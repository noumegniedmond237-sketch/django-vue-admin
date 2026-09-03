# -*- coding: utf-8 -*-

"""
@author: Yuan Xiaotian
@contact: QQ:1638245306
@Created on: 2021/6/3 003 0:30
@Remark: Gestion des autorisations des boutons
"""
from dvadmin.system.models import LoginLog
from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.viewset import CustomModelViewSet


class LoginLogSerializer(CustomModelSerializer):
    """
    Sérialiseur des autorisations du journal de connexion
    """

    class Meta:
        model = LoginLog
        fields = "__all__"
        read_only_fields = ["id"]


class LoginLogViewSet(CustomModelViewSet):
    """
    Interface du journal de connexion
    list:Rechercher
    create:Créer
    update:Modifier
    retrieve:Détail
    destroy:Supprimer
    """
    queryset = LoginLog.objects.all()
    serializer_class = LoginLogSerializer
    extra_filter_backends = []
    ordering_fields = ['create_datetime']
