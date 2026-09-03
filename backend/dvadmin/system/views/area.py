# -*- coding: utf-8 -*-
from django.db.models import Q
from rest_framework import serializers

from dvadmin.system.models import Area
from dvadmin.utils.json_response import SuccessResponse
from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.viewset import CustomModelViewSet


class AreaSerializer(CustomModelSerializer):
    """
    Sérialiseur de région
    """
    pcode_count = serializers.SerializerMethodField(read_only=True)

    def get_pcode_count(self, instance: Area):
        return Area.objects.filter(pcode=instance).count()

    class Meta:
        model = Area
        fields = "__all__"
        read_only_fields = ["id"]


class AreaCreateUpdateSerializer(CustomModelSerializer):
    """
    Sérialiseur de création / mise à jour de la gestion des régions
    """

    class Meta:
        model = Area
        fields = '__all__'


class AreaViewSet(CustomModelViewSet):
    """
    Interface de gestion des régions
    list:Rechercher
    create:Créer
    update:Modifier
    retrieve:Détail
    destroy:Supprimer
    """
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    extra_filter_backends = []
