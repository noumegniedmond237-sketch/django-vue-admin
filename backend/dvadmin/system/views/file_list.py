import base64
import datetime
import hashlib
import json
import os
import random
from pathlib import PurePosixPath

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from application.settings import BASE_DIR
from application import dispatch, settings
from dvadmin.system.models import FileList, media_file_name
from dvadmin.system.views.ueditor_settings import ueditor_upload_settings, ueditor_settings
from dvadmin.utils.json_response import DetailResponse
from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.string_util import format_bytes
from dvadmin.utils.viewset import CustomModelViewSet

# Extensions bannies côté serveur (exécutables / scripts / actifs XSS),
# appliquées quel que soit le endpoint d'upload.
BLOCKED_UPLOAD_EXTENSIONS = frozenset({
    ".php", ".phtml", ".py", ".pyc", ".sh", ".bash", ".pl", ".rb",
    ".exe", ".com", ".dll", ".msi", ".bat", ".cmd", ".ps1", ".vbs", ".jar",
    ".js", ".jse", ".html", ".htm", ".svg", ".swf", ".xhtml",
})
# Taille max d'un upload via l'API fichiers (20 Mo, surchargeable en settings).
FILE_UPLOAD_MAX_SIZE = getattr(settings, "FILE_UPLOAD_MAX_SIZE", 20 * 1024 * 1024)


def sanitize_upload_name(filename):
    """Ne conserve que le nom de fichier (anti path-traversal)."""
    return os.path.basename(filename or "")


def validate_upload_file(filename, size):
    """Validation serveur commune : extension + taille. Lève ValidationError."""
    basename = sanitize_upload_name(filename)
    if not basename:
        raise ValidationError("Nom de fichier manquant")
    _, ext = os.path.splitext(basename)
    if ext.lower() in BLOCKED_UPLOAD_EXTENSIONS:
        raise ValidationError(f"Type de fichier interdit : {ext}")
    if size is not None and size > FILE_UPLOAD_MAX_SIZE:
        raise ValidationError(f"Fichier trop volumineux (max {format_bytes(FILE_UPLOAD_MAX_SIZE)})")
    return basename


class FileSerializer(CustomModelSerializer):
    url = serializers.SerializerMethodField(read_only=True)

    def get_url(self, instance):
        if self.request.query_params.get('prefix'):
            if settings.ENVIRONMENT in ['local']:
                prefix = 'http://127.0.0.1:8000'
            elif settings.ENVIRONMENT in ['test']:
                prefix = 'http://{host}/api'.format(host=self.request.get_host())
            else:
                prefix = 'https://{host}/api'.format(host=self.request.get_host())
            if instance.file_url:
                return instance.file_url if instance.file_url.startswith('http') else f"{prefix}/{instance.file_url}"
            return (f'{prefix}/media/{str(instance.url)}')
        return instance.file_url or (f'media/{str(instance.url)}')

    class Meta:
        model = FileList
        fields = "__all__"

    def create(self, validated_data):
        file_engine = dispatch.get_system_config_values("file_storage.file_engine") or 'local'
        file_backup = dispatch.get_system_config_values("file_storage.file_backup")
        file = self.initial_data.get('file')
        if file is None:
            raise ValidationError("Aucun fichier fourni")
        # Validation serveur : extension + taille (+ nom assaini)
        clean_name = validate_upload_file(getattr(file, "name", ""), getattr(file, "size", None))
        file_size = file.size
        validated_data['name'] = clean_name
        validated_data['size'] = file_size
        md5 = hashlib.md5()
        for chunk in file.chunks():
            md5.update(chunk)
        validated_data['md5sum'] = md5.hexdigest()
        validated_data['engine'] = file_engine
        validated_data['mime_type'] = file.content_type
        if file_backup:
            validated_data['url'] = file
        if file_engine == 'oss':
            from dvadmin_cloud_storage.views.aliyun import ali_oss_upload
            h = validated_data['md5sum']
            basename, ext = os.path.splitext(file.name)
            file_path = ali_oss_upload(file, file_name=PurePosixPath("files", h[:1], h[1:2], h + ext.lower()))
            if file_path:
                validated_data['file_url'] = file_path
            else:
                raise ValueError("Échec du téléversement")
        elif file_engine == 'cos':
            from dvadmin_cloud_storage.views.tencent import tencent_cos_upload
            h = validated_data['md5sum']
            basename, ext = os.path.splitext(file.name)
            file_path = tencent_cos_upload(file, file_name=PurePosixPath("files", h[:1], h[1:2], h + ext.lower()))
            if file_path:
                validated_data['file_url'] = file_path
            else:
                raise ValueError("Échec du téléversement")
        else:
            validated_data['url'] = file
        # Champs d'audit
        try:
            request_user = self.request.user
            validated_data['dept_belong_id'] = request_user.dept.id
            validated_data['creator'] = request_user.id
            validated_data['modifier'] = request_user.id
        except:
            pass
        return super().create(validated_data)


class FileViewSet(CustomModelViewSet):
    """
    Interface de gestion des fichiers
    list:Rechercher
    create:Créer
    update:Modifier
    retrieve:Détail
    destroy:Supprimer
    """
    queryset = FileList.objects.all()
    serializer_class = FileSerializer
    filter_fields = ['name', ]
    # L'API fichiers exige un utilisateur authentifié (le front envoie le JWT).
    # NOTE: l'action `ueditor` reste joignable sans JWT car l'uploader JS de
    # l'éditeur ne sait pas envoyer d'en-tête Authorization ; elle est durcie
    # par validation serveur stricte (listes côté serveur, anti-traversal).
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, request=request)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return DetailResponse(data=serializer.data, msg="Créé avec succès")

    @csrf_exempt
    @action(methods=["GET", "POST"], detail=False, permission_classes=[])
    def ueditor(self, request):
        action = self.request.query_params.get("action", "")
        reponse_action = {
            "config": self.get_ueditor_settings,
            "uploadimage": self.upload_file,
            "uploadscrawl": self.upload_file,
            "uploadvideo": self.upload_file,
            "uploadfile": self.upload_file,
        }
        handler = reponse_action.get(action)
        if handler is None:
            return HttpResponse(json.dumps({"state": "Action non supportée"}),
                                content_type="application/javascript", status=400)
        return handler(request)

    def get_ueditor_settings(self, request):
        return HttpResponse(json.dumps(ueditor_upload_settings, ensure_ascii=False),
                            content_type="application/javascript")

    # Enregistrer le fichier téléversé
    def save_upload_file(self, file, file_path):
        with open(file_path, 'wb') as f:
            try:
                for chunk in file.chunks():
                    f.write(chunk)

            except Exception as e:
                return f"Erreur d'écriture du fichier : {e}"
        return u"SUCCESS"

    def get_path_format_vars(self):
        return {
            "year": datetime.datetime.now().strftime("%Y"),
            "month": datetime.datetime.now().strftime("%m"),
            "day": datetime.datetime.now().strftime("%d"),
            "date": datetime.datetime.now().strftime("%Y%m%d"),
            "time": datetime.datetime.now().strftime("%H%M%S"),
            "datetime": datetime.datetime.now().strftime("%Y%m%d%H%M%S"),
            "rnd": random.randrange(100, 999)
        }

    def get_output_path(self, path_format_var):
        """
        Obtenir le chemin du fichier de sortie
        :param path_format_var:
        :return:
        """
        file_name = (ueditor_settings["defaultPathFormat"] % path_format_var).replace("\\", "/")
        # Décomposer OutputPathFormat
        output_path = os.path.join('media', 'ueditor', f'{self.request.user.id}')
        if not os.path.exists(output_path):
            os.makedirs(output_path)
        return (file_name, output_path)

    # Traitement du téléversement de la fonction gribouillage
    def save_scrawl_file(self, request, file_path, file_name):
        import base64
        instance = None
        try:
            content = request.data.get(ueditor_upload_settings.get("scrawlFieldName", "upfile"))
            f = open(os.path.join(BASE_DIR, file_path, file_name), 'wb')
            f.write(base64.b64decode(content))
            f.close()
            state = "SUCCESS"
            instance = FileList.save_file(request, file_path, file_name, mime_type='image/png')
        except Exception as e:
            state = f"Erreur d'écriture du fichier image : {e}"
        return state, instance

    def upload_file(self, request):
        """Téléverser un fichier"""
        state = "SUCCESS"
        action = self.request.query_params.get("action")
        # Téléverser le fichier
        upload_field_name_list = {
            "uploadfile": "fileFieldName",
            "uploadimage": "imageFieldName",
            "uploadscrawl": "scrawlFieldName",
            "catchimage": "catcherFieldName",
            "uploadvideo": "videoFieldName",
        }
        upload_field_name = self.request.query_params.get(upload_field_name_list[action],
                                                          ueditor_upload_settings.get(action, "upfile"))
        # Téléversement du gribouillage, encodé en base64, nécessite un traitement séparé
        if action == "uploadscrawl":
            upload_file_name = "scrawl.png"
            upload_file_size = 0
        else:
            # Récupérer le fichier téléversé
            file = request.FILES.get(upload_field_name, None)
            if file is None:
                return HttpResponse(json.dumps({"state": "ERROR"}, ensure_ascii=False),
                                    content_type="application/javascript")
            upload_file_name = file.name
            upload_file_size = file.size

        # Obtenir le nom d'origine du fichier téléversé (assaini : basename uniquement)
        upload_original_name, upload_original_ext = os.path.splitext(upload_file_name)
        upload_original_name = sanitize_upload_name(upload_original_name)
        upload_file_name = upload_original_name + upload_original_ext
        upload_original_ext = upload_original_ext.lower()
        # Denylist serveur (prioritaire) : bloque exécutables/scripts/actifs XSS
        if upload_original_ext in BLOCKED_UPLOAD_EXTENSIONS:
            state = u"Le serveur n'autorise pas le téléversement des fichiers de type %s." % upload_original_ext
            return HttpResponse(json.dumps({"state": state}, ensure_ascii=False),
                                content_type="application/javascript")
        # Vérification du type de fichier — listes côté SERVEUR uniquement (les query params sont ignorés
        # pour empêcher le contournement de type ?fileAllowFiles=.py)
        upload_allow_type = {
            "uploadfile": "fileAllowFiles",
            "uploadimage": "imageAllowFiles",
            "uploadvideo": "videoAllowFiles"
        }
        if action in upload_allow_type:
            allow_type = ueditor_upload_settings.get(upload_allow_type[action], []) or []
            allow_type = [str(e).lower() for e in allow_type]
            if upload_original_ext not in allow_type:
                state = u"Le serveur n'autorise pas le téléversement des fichiers de type %s." % upload_original_ext
                return HttpResponse(json.dumps({"state": state}, ensure_ascii=False),
                                    content_type="application/javascript")

        # Vérification de la taille — plafond côté SERVEUR uniquement
        upload_max_size = {
            "uploadfile": "filwMaxSize",
            "uploadimage": "imageMaxSize",
            "uploadscrawl": "scrawlMaxSize",
            "uploadvideo": "videoMaxSize"
        }
        max_size = int(ueditor_upload_settings.get(upload_max_size[action], 0))
        if max_size != 0:
            if upload_file_size > max_size:
                state = u"La taille du fichier téléversé ne doit pas dépasser %s." % format_bytes(max_size)
                return HttpResponse({"state": state}, content_type="application/javascript")

        path_format_var = self.get_path_format_vars()
        path_format_var.update({
            "basename": upload_original_name,
            "extname": upload_original_ext[1:],
            "filename": upload_file_name,
        })
        # Obtenir le chemin du fichier de sortie
        format_file_name, output_path = self.get_output_path(path_format_var)
        # Écrire le fichier une fois tous les contrôles terminés
        file_instance = None
        if state == "SUCCESS":
            if action == "uploadscrawl":
                state, file_instance = self.save_scrawl_file(request, file_path=output_path,
                                                             file_name=format_file_name)
            else:
                file = request.FILES.get(upload_field_name, None)
                # Enregistrer dans le fichier, renvoyer ERROR en cas d'échec d'enregistrement
                state = self.save_upload_file(file, os.path.join(BASE_DIR, output_path, format_file_name))
                # Enregistrer dans la gestion des pièces jointes
                file_instance = FileList.save_file(request, output_path, format_file_name, mime_type=file.content_type)

        # Renvoyer les données
        return_info = {
            'url': file_instance.file_url if file_instance else os.path.join(output_path, format_file_name),  # Nom du fichier après enregistrement
            'original': upload_file_name,  # Nom du fichier d'origine
            'type': upload_original_ext,
            'state': state,  # Statut du téléversement, SUCCESS si réussi, toute autre valeur est renvoyée telle quelle à la boîte de téléversement d'image
            'size': upload_file_size
        }
        return HttpResponse(json.dumps(return_info, ensure_ascii=False), content_type="application/javascript")
