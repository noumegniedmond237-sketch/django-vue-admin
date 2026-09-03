# -*- coding: utf-8 -*-

"""
@author: Li Qiang
@contact: QQ:1206709430
@Created on: 2021/6/8 003 0:30
@Remark: Gestion des journaux d'opérations
"""

from dvadmin.system.models import OperationLog
from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.viewset import CustomModelViewSet


class OperationLogSerializer(CustomModelSerializer):
    """
    Sérialiseur de journal
    """

    class Meta:
        model = OperationLog
        fields = "__all__"
        read_only_fields = ["id"]


class OperationLogCreateUpdateSerializer(CustomModelSerializer):
    """
    Sérialiseur de création / mise à jour du journal d'opérations
    """

    class Meta:
        model = OperationLog
        fields = '__all__'


class OperationLogViewSet(CustomModelViewSet):
    """
    Interface du journal d'opérations
    list:Rechercher
    create:Créer
    update:Modifier
    retrieve:Détail
    destroy:Supprimer
    """
    queryset = OperationLog.objects.order_by('-create_datetime')
    serializer_class = OperationLogSerializer
    # permission_classes = []
