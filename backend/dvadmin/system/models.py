import hashlib
import os
from pathlib import PurePosixPath

from django.contrib.auth.models import AbstractUser
from django.core.files.base import File
from django.db import models

from application import dispatch
from application.settings import BASE_DIR
from dvadmin.utils.models import CoreModel, table_prefix

STATUS_CHOICES = (
    (0, "Désactivé"),
    (1, "Activé"),
)


class Users(CoreModel, AbstractUser):
    username = models.CharField(max_length=150, unique=True, db_index=True, verbose_name="Compte utilisateur",
                                help_text="Compte utilisateur")
    employee_no = models.CharField(max_length=150, unique=True, db_index=True, null=True, blank=True,
                                   verbose_name="Matricule", help_text="Matricule")
    email = models.EmailField(max_length=255, verbose_name="E-mail", null=True, blank=True, help_text="E-mail")
    mobile = models.CharField(max_length=255, verbose_name="Téléphone", null=True, blank=True, help_text="Téléphone")
    avatar = models.CharField(max_length=255, verbose_name="Avatar", null=True, blank=True, help_text="Avatar")
    name = models.CharField(max_length=40, verbose_name="Nom", help_text="Nom")
    GENDER_CHOICES = (
        (0, "Inconnu"),
        (1, "Homme"),
        (2, "Femme"),
    )
    gender = models.IntegerField(
        choices=GENDER_CHOICES, default=0, verbose_name="Genre", null=True, blank=True, help_text="Genre"
    )
    USER_TYPE = (
        (0, "Utilisateur back-office"),
        (1, "Utilisateur front-office"),
    )
    user_type = models.IntegerField(
        choices=USER_TYPE, default=0, verbose_name="Type d'utilisateur", null=True, blank=True, help_text="Type d'utilisateur"
    )
    post = models.ManyToManyField(to="Post", blank=True, verbose_name="Postes associés", db_constraint=False,
                                  help_text="Postes associés")
    role = models.ManyToManyField(to="Role", blank=True, verbose_name="Rôles associés", db_constraint=False,
                                  help_text="Rôles associés")
    dept = models.ForeignKey(
        to="Dept",
        verbose_name="Département d'appartenance",
        on_delete=models.PROTECT,
        db_constraint=False,
        null=True,
        blank=True,
        help_text="Département associé",
    )
    last_token = models.CharField(max_length=255, null=True, blank=True, verbose_name="Jeton de dernière connexion",
                                   help_text="Jeton de dernière connexion")

    class Meta:
        db_table = table_prefix + "system_users"
        verbose_name = "Table des utilisateurs"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class Post(CoreModel):
    name = models.CharField(null=False, max_length=64, verbose_name="Nom du poste", help_text="Nom du poste")
    code = models.CharField(max_length=32, verbose_name="Code du poste", help_text="Code du poste")
    sort = models.IntegerField(default=1, verbose_name="Ordre du poste", help_text="Ordre du poste")
    STATUS_CHOICES = (
        (0, "Départ"),
        (1, "En poste"),
    )
    status = models.IntegerField(choices=STATUS_CHOICES, default=1, verbose_name="Statut du poste", help_text="Statut du poste")

    class Meta:
        db_table = table_prefix + "system_post"
        verbose_name = "Table des postes"
        verbose_name_plural = verbose_name
        ordering = ("sort",)


class Role(CoreModel):
    name = models.CharField(max_length=64, verbose_name="Nom du rôle", help_text="Nom du rôle")
    key = models.CharField(max_length=64, unique=True, verbose_name="Clé de permission", help_text="Clé de permission")
    sort = models.IntegerField(default=1, verbose_name="Ordre du rôle", help_text="Ordre du rôle")
    status = models.BooleanField(default=True, verbose_name="Statut du rôle", help_text="Statut du rôle")
    admin = models.BooleanField(default=False, verbose_name="Est administrateur", help_text="Est administrateur")
    DATASCOPE_CHOICES = (
        (0, "Données personnelles uniquement"),
        (1, "Données du département et sous-départements"),
        (2, "Données du département"),
        (3, "Toutes les données"),
        (4, "Données personnalisées"),
    )
    data_range = models.IntegerField(default=0, choices=DATASCOPE_CHOICES, verbose_name="Portée des permissions de données",
                                     help_text="Portée des permissions de données")
    remark = models.TextField(verbose_name="Remarque", help_text="Remarque", null=True, blank=True)
    dept = models.ManyToManyField(to="Dept", verbose_name="Départements associés (permissions de données)", db_constraint=False,
                                  help_text="Départements associés (permissions de données)")
    menu = models.ManyToManyField(to="Menu", verbose_name="Menus associés", db_constraint=False, help_text="Menus associés")
    permission = models.ManyToManyField(
        to="MenuButton", verbose_name="Boutons d'API des menus associés", db_constraint=False, help_text="Boutons d'API des menus associés"
    )

    class Meta:
        db_table = table_prefix + "system_role"
        verbose_name = "Table des rôles"
        verbose_name_plural = verbose_name
        ordering = ("sort",)


class Dept(CoreModel):
    name = models.CharField(max_length=64, verbose_name="Nom du département", help_text="Nom du département")
    key = models.CharField(max_length=64, unique=True, null=True, blank=True, verbose_name="Clé associée",
                           help_text="Clé associée")
    sort = models.IntegerField(default=1, verbose_name="Ordre d'affichage", help_text="Ordre d'affichage")
    owner = models.CharField(max_length=32, verbose_name="Responsable", null=True, blank=True, help_text="Responsable")
    phone = models.CharField(max_length=32, verbose_name="Téléphone de contact", null=True, blank=True, help_text="Téléphone de contact")
    email = models.EmailField(max_length=32, verbose_name="E-mail", null=True, blank=True, help_text="E-mail")
    status = models.BooleanField(default=True, verbose_name="Statut du département", null=True, blank=True, help_text="Statut du département")
    parent = models.ForeignKey(
        to="Dept",
        on_delete=models.CASCADE,
        default=None,
        verbose_name="Département supérieur",
        db_constraint=False,
        null=True,
        blank=True,
        help_text="Département supérieur",
        db_index=True
    )

    @classmethod
    def recursion_dept_info(cls, dept_id: int, dept_all_list=None, dept_list=None):
        """
        Récupérer récursivement tous les sous-départements d'un département
        :param dept_id: id à récupérer
        :param dept_all_list: liste complète
        :param dept_list: liste récursive
        :return:
        """
        if not dept_all_list:
            dept_all_list = Dept.objects.values("id", "parent")
        if dept_list is None:
            dept_list = [dept_id]
        for ele in dept_all_list:
            if ele.get("parent") == dept_id:
                dept_list.append(ele.get("id"))
                cls.recursion_dept_info(ele.get("id"), dept_all_list, dept_list)
        return list(set(dept_list))

    class Meta:
        db_table = table_prefix + "system_dept"
        verbose_name = "Table des départements"
        verbose_name_plural = verbose_name
        ordering = ("sort",)


class Menu(CoreModel):
    parent = models.ForeignKey(
        to="Menu",
        on_delete=models.CASCADE,
        verbose_name="Menu parent",
        null=True,
        blank=True,
        db_constraint=False,
        help_text="Menu parent",
    )
    icon = models.CharField(max_length=64, verbose_name="Icône du menu", null=True, blank=True, help_text="Icône du menu")
    name = models.CharField(max_length=64, verbose_name="Nom du menu", help_text="Nom du menu")
    sort = models.IntegerField(default=1, verbose_name="Ordre d'affichage", null=True, blank=True, help_text="Ordre d'affichage")
    ISLINK_CHOICES = (
        (0, "Non"),
        (1, "Oui"),
    )
    is_link = models.BooleanField(default=False, verbose_name="Est un lien externe", help_text="Est un lien externe")
    is_catalog = models.BooleanField(default=False, verbose_name="Est un répertoire", help_text="Est un répertoire")
    web_path = models.CharField(max_length=128, verbose_name="Adresse de routage", null=True, blank=True, help_text="Adresse de routage")
    component = models.CharField(max_length=128, verbose_name="Adresse du composant", null=True, blank=True, help_text="Adresse du composant")
    component_name = models.CharField(max_length=50, verbose_name="Nom du composant", null=True, blank=True,
                                      help_text="Nom du composant")
    status = models.BooleanField(default=True, blank=True, verbose_name="Statut du menu", help_text="Statut du menu")
    frame_out = models.BooleanField(default=False, blank=True, verbose_name="Hors cadre principal", help_text="Hors cadre principal")
    cache = models.BooleanField(default=False, blank=True, verbose_name="Mise en cache de la page", help_text="Mise en cache de la page")
    visible = models.BooleanField(default=True, blank=True, verbose_name="Affiché dans la barre latérale",
                                  help_text="Affiché dans la barre latérale")

    class Meta:
        db_table = table_prefix + "system_menu"
        verbose_name = "Table des menus"
        verbose_name_plural = verbose_name
        ordering = ("sort",)


class MenuButton(CoreModel):
    menu = models.ForeignKey(
        to="Menu",
        db_constraint=False,
        related_name="menuPermission",
        on_delete=models.PROTECT,
        verbose_name="Menu associé",
        help_text="Menu associé",
    )
    name = models.CharField(max_length=64, verbose_name="Nom", help_text="Nom")
    value = models.CharField(max_length=64, verbose_name="Valeur de permission", help_text="Valeur de permission")
    api = models.CharField(max_length=200, verbose_name="Adresse d'API", help_text="Adresse d'API")
    METHOD_CHOICES = (
        (0, "GET"),
        (1, "POST"),
        (2, "PUT"),
        (3, "DELETE"),
    )
    method = models.IntegerField(default=0, verbose_name="Méthode de requête d'API", null=True, blank=True,
                                 help_text="Méthode de requête d'API")

    class Meta:
        db_table = table_prefix + "system_menu_button"
        verbose_name = "Table des permissions de menu"
        verbose_name_plural = verbose_name
        ordering = ("-name",)


class Dictionary(CoreModel):
    TYPE_LIST = (
        (0, "text"),
        (1, "number"),
        (2, "date"),
        (3, "datetime"),
        (4, "time"),
        (5, "files"),
        (6, "boolean"),
        (7, "images"),
    )
    label = models.CharField(max_length=100, blank=True, null=True, verbose_name="Nom du dictionnaire", help_text="Nom du dictionnaire")
    value = models.CharField(max_length=200, blank=True, null=True, verbose_name="Code du dictionnaire",
                             help_text="Code du dictionnaire / valeur réelle")
    parent = models.ForeignKey(
        to="self",
        related_name="sublist",
        db_constraint=False,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        verbose_name="Parent",
        help_text="Parent",
    )
    type = models.IntegerField(choices=TYPE_LIST, default=0, verbose_name="Type de valeur", help_text="Type de valeur")
    color = models.CharField(max_length=20, blank=True, null=True, verbose_name="Couleur", help_text="Couleur")
    is_value = models.BooleanField(default=False, verbose_name="Est une valeur",
                                   help_text="Indique s'il s'agit d'une valeur, utilisée pour stocker la valeur concrète")
    status = models.BooleanField(default=True, verbose_name="Statut", help_text="Statut")
    sort = models.IntegerField(default=1, verbose_name="Ordre d'affichage", null=True, blank=True, help_text="Ordre d'affichage")
    remark = models.CharField(max_length=2000, blank=True, null=True, verbose_name="Remarque", help_text="Remarque")

    class Meta:
        db_table = table_prefix + "system_dictionary"
        verbose_name = "Table du dictionnaire"
        verbose_name_plural = verbose_name
        ordering = ("sort",)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        dispatch.refresh_dictionary()  # En cas de mise à jour, actualiser la configuration du dictionnaire

    def delete(self, *args, **kwargs):
        res = super().delete(*args, **kwargs)
        dispatch.refresh_dictionary()
        return res


class OperationLog(CoreModel):
    request_modular = models.CharField(max_length=64, verbose_name="Module de requête", null=True, blank=True,
                                       help_text="Module de requête")
    request_path = models.CharField(max_length=400, verbose_name="Adresse de requête", null=True, blank=True,
                                    help_text="Adresse de requête")
    request_body = models.TextField(verbose_name="Paramètres de requête", null=True, blank=True, help_text="Paramètres de requête")
    request_method = models.CharField(max_length=8, verbose_name="Méthode de requête", null=True, blank=True,
                                      help_text="Méthode de requête")
    request_msg = models.TextField(verbose_name="Description de l'opération", null=True, blank=True, help_text="Description de l'opération")
    request_ip = models.CharField(max_length=32, verbose_name="Adresse IP de requête", null=True, blank=True,
                                  help_text="Adresse IP de requête")
    request_browser = models.CharField(max_length=64, verbose_name="Navigateur de requête", null=True, blank=True,
                                       help_text="Navigateur de requête")
    response_code = models.CharField(max_length=32, verbose_name="Code de statut de réponse", null=True, blank=True,
                                     help_text="Code de statut de réponse")
    request_os = models.CharField(max_length=64, verbose_name="Système d'exploitation", null=True, blank=True, help_text="Système d'exploitation")
    json_result = models.TextField(verbose_name="Informations de retour", null=True, blank=True, help_text="Informations de retour")
    status = models.BooleanField(default=False, verbose_name="Statut de réponse", help_text="Statut de réponse")

    class Meta:
        db_table = table_prefix + "system_operation_log"
        verbose_name = "Journal des opérations"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


def media_file_name(instance, filename):
    h = instance.md5sum
    basename, ext = os.path.splitext(filename)
    return PurePosixPath("files", h[:1], h[1:2], h + ext.lower())


class FileList(CoreModel):
    name = models.CharField(max_length=200, null=True, blank=True, verbose_name="Nom", help_text="Nom")
    url = models.FileField(upload_to=media_file_name, null=True, blank=True, )
    file_url = models.CharField(max_length=255, blank=True, verbose_name="Adresse du fichier", help_text="Adresse du fichier")
    engine = models.CharField(max_length=100, default='local', blank=True, verbose_name="Moteur", help_text="Moteur")
    mime_type = models.CharField(max_length=100, blank=True, verbose_name="Type MIME", help_text="Type MIME")
    size = models.BigIntegerField(default=0, blank=True, verbose_name="Taille du fichier", help_text="Taille du fichier")
    md5sum = models.CharField(max_length=36, blank=True, verbose_name="MD5 du fichier", help_text="MD5 du fichier")

    @classmethod
    def save_file(cls, request, file_path, file_name, mime_type):
        # Enregistrer dans le modèle File
        instance = FileList()
        instance.name = file_name
        instance.engine = dispatch.get_system_config_values("file_storage.file_engine") or 'local'
        instance.file_url = os.path.join(file_path, file_name)
        instance.mime_type = mime_type
        instance.creator = request.user
        instance.modifier = request.user.id
        instance.dept_belong_id = request.user.dept_id

        file_backup = dispatch.get_system_config_values("file_storage.file_backup")
        file_engine = dispatch.get_system_config_values("file_storage.file_engine") or 'local'
        if file_backup:
            instance.url = os.path.join(file_path.replace('media/', ''), file_name)
        if file_engine == 'oss':
            from dvadmin_cloud_storage.views.aliyun import ali_oss_upload
            with open(os.path.join(BASE_DIR, file_path, file_name), 'rb') as file:
                file_path = ali_oss_upload(file, file_name=os.path.join(file_path.replace('media/', ''), file_name))
                if file_path:
                    instance.file_url = file_path
                else:
                    raise ValueError("Échec du téléversement")
        elif file_engine == 'cos':
            from dvadmin_cloud_storage.views.tencent import tencent_cos_upload
            with open(os.path.join(BASE_DIR, file_path, file_name), 'rb') as file:
                file_path = tencent_cos_upload(file, file_name=os.path.join(file_path.replace('media/', ''), file_name))
                if file_path:
                    instance.file_url = file_path
                else:
                    raise ValueError("Échec du téléversement")
        else:
            instance.url = os.path.join(file_path.replace('media/', ''), file_name)
        instance.save()
        return instance

    def save(self, *args, **kwargs):
        if not self.md5sum and self.url:  # file is new
            md5 = hashlib.md5()
            for chunk in self.url.chunks():
                md5.update(chunk)
            self.md5sum = md5.hexdigest()
        if not self.size and self.url:
            self.size = self.url.size
        if not self.file_url:
            url = media_file_name(self, self.name)
            self.file_url = f'media/{url}'
        super(FileList, self).save(*args, **kwargs)

    class Meta:
        db_table = table_prefix + "system_file_list"
        verbose_name = "Gestion des fichiers"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class Area(CoreModel):
    name = models.CharField(max_length=100, verbose_name="Nom", help_text="Nom")
    code = models.CharField(max_length=20, verbose_name="Code de région", help_text="Code de région", unique=True, db_index=True)
    level = models.BigIntegerField(verbose_name="Niveau de région (1 province, 2 ville, 3 district, 4 commune)",
                                   help_text="Niveau de région (1 province, 2 ville, 3 district, 4 commune)")
    pinyin = models.CharField(max_length=255, verbose_name="Pinyin", help_text="Pinyin")
    initials = models.CharField(max_length=20, verbose_name="Initiale", help_text="Initiale")
    enable = models.BooleanField(default=True, verbose_name="Activé", help_text="Activé")
    pcode = models.ForeignKey(
        to="self",
        verbose_name="Code de région parente",
        to_field="code",
        on_delete=models.PROTECT,
        db_constraint=False,
        null=True,
        blank=True,
        help_text="Code de région parente",
    )

    class Meta:
        db_table = table_prefix + "system_area"
        verbose_name = "Table des régions"
        verbose_name_plural = verbose_name
        ordering = ("code",)

    def __str__(self):
        return f"{self.name}"


class ApiWhiteList(CoreModel):
    url = models.CharField(max_length=200, help_text="Adresse URL", verbose_name="url")
    METHOD_CHOICES = (
        (0, "GET"),
        (1, "POST"),
        (2, "PUT"),
        (3, "DELETE"),
    )
    method = models.IntegerField(default=0, verbose_name="Méthode de requête d'API", null=True, blank=True,
                                 help_text="Méthode de requête d'API")
    enable_datasource = models.BooleanField(default=True, verbose_name="Activer les permissions de données", help_text="Activer les permissions de données",
                                            blank=True)

    class Meta:
        db_table = table_prefix + "api_white_list"
        verbose_name = "Liste blanche d'API"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class SystemConfig(CoreModel):
    parent = models.ForeignKey(
        to="self",
        verbose_name="Parent",
        on_delete=models.PROTECT,
        db_constraint=False,
        null=True,
        blank=True,
        help_text="Parent",
    )
    title = models.CharField(max_length=50, verbose_name="Titre", help_text="Titre")
    key = models.CharField(max_length=200, verbose_name="Clé", help_text="Clé", db_index=True)
    value = models.JSONField(max_length=500, verbose_name="Valeur", help_text="Valeur", null=True, blank=True)
    sort = models.IntegerField(default=0, verbose_name="Tri", help_text="Tri", blank=True)
    status = models.BooleanField(default=True, verbose_name="Statut d'activation", help_text="Statut d'activation")
    data_options = models.JSONField(verbose_name="Options de données", help_text="Options de données", null=True, blank=True)
    FORM_ITEM_TYPE_LIST = (
        (0, "text"),
        (1, "datetime"),
        (2, "date"),
        (3, "textarea"),
        (4, "select"),
        (5, "checkbox"),
        (6, "radio"),
        (7, "img"),
        (8, "file"),
        (9, "switch"),
        (10, "number"),
        (11, "array"),
        (12, "imgs"),
        (13, "foreignkey"),
        (14, "manytomany"),
        (15, "time"),
    )
    form_item_type = models.IntegerField(
        choices=FORM_ITEM_TYPE_LIST, verbose_name="Type de formulaire", help_text="Type de formulaire", default=0, blank=True
    )
    rule = models.JSONField(null=True, blank=True, verbose_name="Règles de validation", help_text="Règles de validation")
    placeholder = models.CharField(max_length=100, null=True, blank=True, verbose_name="Message d'aide", help_text="Message d'aide")
    setting = models.JSONField(null=True, blank=True, verbose_name="Configuration", help_text="Configuration")

    class Meta:
        db_table = table_prefix + "system_config"
        verbose_name = "Table de configuration système"
        verbose_name_plural = verbose_name
        ordering = ("sort",)
        unique_together = (("key", "parent_id"),)

    def __str__(self):
        return f"{self.title}"

    def save(self, *args, **kwargs):
        # from application.websocketConfig import websocket_push
        # websocket_push("dvadmin", message={"sender": 'system', "contentType": 'SYSTEM',
        #                                    "content": 'La configuration système a changé~', "systemConfig": True})

        super().save(*args, **kwargs)
        dispatch.refresh_system_config()  # En cas de mise à jour, actualiser la configuration système

    def delete(self, *args, **kwargs):
        res = super().delete(*args, **kwargs)
        dispatch.refresh_system_config()
        from application.websocketConfig import websocket_push
        websocket_push("dvadmin", message={"sender": 'system', "contentType": 'SYSTEM',
                                           "content": 'La configuration système a changé~', "systemConfig": True})

        return res


class LoginLog(CoreModel):
    LOGIN_TYPE_CHOICES = (
        (1, "Connexion standard"),
        (2, "Connexion standard par QR code"),
        (3, "Connexion WeChat par QR code"),
        (4, "Connexion Feishu par QR code"),
        (5, "Connexion DingTalk par QR code"),
        (6, "Connexion par SMS")
    )
    username = models.CharField(max_length=150, verbose_name="Nom d'utilisateur de connexion", null=True, blank=True,
                                help_text="Nom d'utilisateur de connexion")
    ip = models.CharField(max_length=32, verbose_name="IP de connexion", null=True, blank=True, help_text="IP de connexion")
    agent = models.TextField(verbose_name="Informations sur l'agent", null=True, blank=True, help_text="Informations sur l'agent")
    browser = models.CharField(max_length=200, verbose_name="Nom du navigateur", null=True, blank=True, help_text="Nom du navigateur")
    os = models.CharField(max_length=200, verbose_name="Système d'exploitation", null=True, blank=True, help_text="Système d'exploitation")
    continent = models.CharField(max_length=50, verbose_name="Continent", null=True, blank=True, help_text="Continent")
    country = models.CharField(max_length=50, verbose_name="Pays", null=True, blank=True, help_text="Pays")
    province = models.CharField(max_length=50, verbose_name="Province", null=True, blank=True, help_text="Province")
    city = models.CharField(max_length=50, verbose_name="Ville", null=True, blank=True, help_text="Ville")
    district = models.CharField(max_length=50, verbose_name="District", null=True, blank=True, help_text="District")
    isp = models.CharField(max_length=50, verbose_name="Opérateur", null=True, blank=True, help_text="Opérateur")
    area_code = models.CharField(max_length=50, verbose_name="Code de zone", null=True, blank=True, help_text="Code de zone")
    country_english = models.CharField(max_length=50, verbose_name="Nom complet en anglais", null=True, blank=True,
                                       help_text="Nom complet en anglais")
    country_code = models.CharField(max_length=50, verbose_name="Abréviation", null=True, blank=True, help_text="Abréviation")
    longitude = models.CharField(max_length=50, verbose_name="Longitude", null=True, blank=True, help_text="Longitude")
    latitude = models.CharField(max_length=50, verbose_name="Latitude", null=True, blank=True, help_text="Latitude")
    login_type = models.IntegerField(default=1, choices=LOGIN_TYPE_CHOICES, verbose_name="Type de connexion",
                                     help_text="Type de connexion")

    class Meta:
        db_table = table_prefix + "system_login_log"
        verbose_name = "Journal des connexions"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class MessageCenter(CoreModel):
    title = models.CharField(max_length=100, verbose_name="Titre", help_text="Titre")
    content = models.TextField(verbose_name="Contenu", help_text="Contenu")
    target_type = models.IntegerField(default=0, verbose_name="Type de cible", help_text="Type de cible")
    target_user = models.ManyToManyField(to=Users, related_name='user', through='MessageCenterTargetUser',
                                         through_fields=('messagecenter', 'users'), blank=True, verbose_name="Utilisateurs cibles",
                                         help_text="Utilisateurs cibles")
    target_dept = models.ManyToManyField(to=Dept, blank=True, db_constraint=False,
                                         verbose_name="Départements cibles", help_text="Départements cibles")
    target_role = models.ManyToManyField(to=Role, blank=True, db_constraint=False,
                                         verbose_name="Rôles cibles", help_text="Rôles cibles")

    class Meta:
        db_table = table_prefix + "message_center"
        verbose_name = "Centre de messages"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class MessageCenterTargetUser(CoreModel):
    users = models.ForeignKey(Users, related_name="target_user", on_delete=models.CASCADE, db_constraint=False,
                              verbose_name="Table utilisateurs associée", help_text="Table utilisateurs associée")
    messagecenter = models.ForeignKey(MessageCenter, on_delete=models.CASCADE, db_constraint=False,
                                      verbose_name="Table centre de messages associée", help_text="Table centre de messages associée")
    is_read = models.BooleanField(default=False, blank=True, null=True, verbose_name="Lu", help_text="Lu")

    class Meta:
        db_table = table_prefix + "message_center_target_user"
        verbose_name = "Table des utilisateurs cibles du centre de messages"
        verbose_name_plural = verbose_name
