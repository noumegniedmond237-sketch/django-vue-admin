# -*- coding: utf-8 -*-

"""
@author: Yuan Xiaotian
@contact: QQ:1638245306
@Created on: 2022/1/1 001 9:34
@Remark:
"""
from dvadmin.system.models import ApiWhiteList
from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.viewset import CustomModelViewSet


class ApiWhiteListSerializer(CustomModelSerializer):
    """
    Interface de liste blanche d'API - sérialiseur
    """

    class Meta:
        model = ApiWhiteList
        fields = "__all__"
        read_only_fields = ["id"]


class ApiWhiteListInitSerializer(CustomModelSerializer):
    """
    Informations d'initialisation (pour générer le fichier JSON d'initialisation)
    """

    class Meta:
        model = ApiWhiteList
        fields = ['url', 'method', 'enable_datasource', 'creator', 'dept_belong_id']
        read_only_fields = ["id"]
        extra_kwargs = {
            'creator': {'write_only': True},
            'dept_belong_id': {'write_only': True}
        }


class ApiWhiteListViewSet(CustomModelViewSet):
    """
    Liste blanche des interfaces API
    list:Rechercher
    create:Créer
    update:Modifier
    retrieve:Détail
    destroy:Supprimer
    """
    queryset = ApiWhiteList.objects.all()
    serializer_class = ApiWhiteListSerializer
    # permission_classes = []
