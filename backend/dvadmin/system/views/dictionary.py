# -*- coding: utf-8 -*-

"""
@author: Yuan Xiaotian
@contact: QQ:1638245306
@Created on: 2021/6/3 003 0:30
@Remark: Gestion des dictionnaires
"""
from rest_framework import serializers
from rest_framework.views import APIView

from application import dispatch
from dvadmin.system.models import Dictionary
from dvadmin.utils.json_response import SuccessResponse
from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.viewset import CustomModelViewSet


class DictionarySerializer(CustomModelSerializer):
    """
    Sérialiseur de dictionnaire
    """

    class Meta:
        model = Dictionary
        fields = "__all__"
        read_only_fields = ["id"]


class DictionaryInitSerializer(CustomModelSerializer):
    """
    Informations d'initialisation (pour générer le fichier JSON d'initialisation)
    """
    children = serializers.SerializerMethodField()

    def get_children(self, obj: Dictionary):
        data = []
        instance = Dictionary.objects.filter(parent_id=obj.id)
        if instance:
            serializer = DictionaryInitSerializer(instance=instance, many=True)
            data = serializer.data
        return data

    def save(self, **kwargs):
        instance = super().save(**kwargs)
        children = self.initial_data.get('children')
        # Table des menus
        if children:
            for data in children:
                data['parent'] = instance.id
                filter_data = {
                    "value": data['value'],
                    "parent": data['parent']
                }
                instance_obj = Dictionary.objects.filter(**filter_data).first()
                if instance_obj and not self.initial_data.get('reset'):
                    continue
                serializer = DictionaryInitSerializer(instance_obj, data=data, request=self.request)
                serializer.is_valid(raise_exception=True)
                serializer.save()
        return instance

    class Meta:
        model = Dictionary
        fields = ['label', 'value', 'parent', 'type', 'color', 'is_value', 'status', 'sort', 'remark', 'creator',
                  'dept_belong_id', 'children']
        read_only_fields = ["id"]
        extra_kwargs = {
            'creator': {'write_only': True},
            'dept_belong_id': {'write_only': True}
        }


class DictionaryCreateUpdateSerializer(CustomModelSerializer):
    """
    Sérialiseur de création / mise à jour de la gestion des dictionnaires
    """

    class Meta:
        model = Dictionary
        fields = '__all__'


class DictionaryViewSet(CustomModelViewSet):
    """
    Interface de gestion des dictionnaires
    list:Rechercher
    create:Créer
    update:Modifier
    retrieve:Détail
    destroy:Supprimer
    """
    queryset = Dictionary.objects.all()
    serializer_class = DictionarySerializer
    extra_filter_backends = []
    search_fields = ['label']


class InitDictionaryViewSet(APIView):
    """
    Récupérer la configuration d'initialisation
    """
    authentication_classes = []
    permission_classes = []
    queryset = Dictionary.objects.all()

    def get(self, request):
        dictionary_key = self.request.query_params.get('dictionary_key')
        if dictionary_key:
            if dictionary_key == 'all':
                data = [ele for ele in dispatch.get_dictionary_config().values()]
                if not data:
                    dispatch.refresh_dictionary()
                    data = [ele for ele in dispatch.get_dictionary_config().values()]
            else:
                data = self.queryset.filter(parent__value=dictionary_key, status=True).values('label', 'value', 'type',
                                                                                              'color')
            return SuccessResponse(data=data, msg="Récupéré avec succès")
        return SuccessResponse(data=[], msg="Récupéré avec succès")
