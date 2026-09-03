# Classe de base d'initialisation
import json
import os

from django.apps import apps
from django.db import connection
from rest_framework import request

from application import settings
from application.dispatch import is_tenants_mode
from dvadmin.system.models import Users, Menu


class CoreInitialize:
    """
    Mode d'emploi : hériter de cette classe, surcharger la méthode run, et appeler save dans run pour initialiser les données
    """
    creator_id = None
    reset = False
    request = request
    file_path = None

    def __init__(self, reset=False, creator_id=None, app=None):
        """
        reset: réinitialiser ou non les données d'initialisation
        creator_id: identifiant du créateur
        """
        self.reset = reset or self.reset
        self.creator_id = creator_id or self.creator_id
        self.app = app or ''
        self.request.user = Users.objects.order_by('create_datetime').first()

    def init_base(self, Serializer, unique_fields=None):
        model = Serializer.Meta.model
        if is_tenants_mode() and connection.tenant.schema_name !='public' and model._meta.model_name == 'menu':
            # En mode super locataire, annuler l'initialisation des menus
            return
        path_file = os.path.join(apps.get_app_config(self.app.split('.')[-1]).path, 'fixtures',
                                 f'init_{Serializer.Meta.model._meta.model_name}.json')
        if not os.path.isfile(path_file):
            return
        with open(path_file, encoding="utf-8") as f:
            for data in json.load(f):
                filter_data = {}
                # Configurer les conditions de filtrage : utiliser les champs d'identifiant unique s'ils existent, sinon tous les champs
                if unique_fields:
                    for field in unique_fields:
                        if field in data:
                            filter_data[field] = data[field]
                else:
                    for key, value in data.items():
                        if isinstance(value, list) or value == None or value == '':
                            continue
                        filter_data[key] = value
                instance = model.objects.filter(**filter_data).first()
                data["reset"] = self.reset
                serializer = Serializer(instance, data=data, request=self.request)
                serializer.is_valid(raise_exception=True)
                serializer.save()
        print(f"[{self.app}][{model._meta.model_name}]Initialisation terminée")

    def save(self, obj, data: list, name=None, no_reset=False):
        name = name or obj._meta.verbose_name
        print(f"Initialisation en cours[{obj._meta.label} => {name}]")
        if not no_reset and self.reset and obj not in settings.INITIALIZE_RESET_LIST:
            try:
                obj.objects.all().delete()
                settings.INITIALIZE_RESET_LIST.append(obj)
            except Exception:
                pass
        for ele in data:
            m2m_dict = {}
            new_data = {}
            for key, value in ele.items():
                # Si la valeur transmise est une liste, extraire les relations plusieurs-à-plusieurs et les mettre à jour avec set
                if isinstance(value, list) and value and isinstance(value[0], int):
                    m2m_dict[key] = value
                else:
                    new_data[key] = value
            object, _ = obj.objects.get_or_create(id=ele.get("id"), defaults=new_data)
            for key, m2m in m2m_dict.items():
                m2m = list(set(m2m))
                if m2m and len(m2m) > 0 and m2m[0]:
                    exec(f"""
if object.{key}:
    values_list = object.{key}.all().values_list('id', flat=True)
    values_list = list(set(list(values_list) + {m2m}))
    object.{key}.set(values_list)
""")
        print(f"Initialisation terminée[{obj._meta.label} => {name}]")

    def run(self):
        raise NotImplementedError('.run() must be overridden')
