# Liaison des villes en cascade
"""
Jusqu'au niveau communal. Mode d'emploi
1. https://www.npmjs.com/package/china-division Télécharger les données et placer le fichier json correspondant dans le répertoire prévu
2. Modifier le nom du fichier json correspondant dans ce fichier
3. Faire un clic droit pour exécuter ce fichier py afin de procéder à l'initialisation
"""
import json
import os

import django
import pypinyin
from django.core.management import BaseCommand
from django.db import connection

from application import dispatch

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'application.settings')
django.setup()
from application.settings import BASE_DIR
from dvadmin.system.models import Area

area_code_list = []


def area_list(code_list, pcode=None, depth=1):
    """
    Récupérer récursivement toutes les listes
    """
    for code_dict in code_list:
        code = code_dict.get('code', None)
        name = code_dict.get('name', None)
        children = code_dict.get('children', None)
        pinyin = ''.join([''.join(i) for i in pypinyin.pinyin(name, style=pypinyin.NORMAL)])
        area_code_list.append(
            {
                "name": name,
                "code": code,
                "level": depth,
                "pinyin": pinyin,
                "initials": pinyin[0].upper() if pinyin else "#",
                "pcode_id": pcode,
            }
        )
        if children:
            area_list(code_list=children, pcode=code, depth=depth + 1)


def main():
    with open(os.path.join(BASE_DIR, 'dvadmin', 'system', 'util', 'pca-code.json'), 'r', encoding="utf-8") as load_f:
        code_list = json.load(load_f)
    area_list(code_list)
    if Area.objects.count() == 0:
        Area.objects.bulk_create([Area(**ele) for ele in area_code_list])
    else:
        for ele in area_code_list:
            code = ele.pop("code")
            Area.objects.update_or_create(code=code, defaults=ele)


class Command(BaseCommand):
    """
    Commande d'initialisation du projet : python manage.py init
    """

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):

        print(f"Préparation de l'initialisation des données de provinces en cours...")

        if dispatch.is_tenants_mode():
            from django_tenants.utils import get_tenant_model
            from django_tenants.utils import tenant_context
            for tenant in get_tenant_model().objects.exclude(schema_name='public'):
                with tenant_context(tenant):
                    print(f"Tenant[{connection.tenant.schema_name}] début de l'initialisation des données...")
                    main()
                    print(f"Tenant[{connection.tenant.schema_name}] initialisation des données terminée !")
        else:
            main()
        print("Initialisation des données de provinces terminée !")
