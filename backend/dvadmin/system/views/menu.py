# -*- coding: utf-8 -*-

"""
@author: Yuan Xiaotian
@contact: QQ:1638245306
@Created on: 2021/6/1 001 22:38
@Remark: Module des menus
"""
from rest_framework import serializers
from rest_framework.decorators import action

from dvadmin.system.models import Menu, MenuButton
from dvadmin.system.views.menu_button import MenuButtonInitSerializer
from dvadmin.utils.json_response import SuccessResponse
from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.viewset import CustomModelViewSet


class MenuSerializer(CustomModelSerializer):
    """
    Sérialiseur simple de la table des menus
    """
    menuPermission = serializers.SerializerMethodField(read_only=True)
    hasChild = serializers.SerializerMethodField()

    def get_menuPermission(self, instance):
        queryset = instance.menuPermission.order_by('-name').values_list('name', flat=True)
        if queryset:
            return queryset
        else:
            return None

    def get_hasChild(self, instance):
        hasChild = Menu.objects.filter(parent=instance.id)
        if hasChild:
            return True
        return False

    class Meta:
        model = Menu
        fields = "__all__"
        read_only_fields = ["id"]


class MenuCreateSerializer(CustomModelSerializer):
    """
    Sérialiseur de création de la table des menus
    """
    name = serializers.CharField(required=False)

    class Meta:
        model = Menu
        fields = "__all__"
        read_only_fields = ["id"]


class MenuInitSerializer(CustomModelSerializer):
    """
    Récupération récursive des informations (pour générer le fichier JSON d'initialisation)
    """
    name = serializers.CharField(required=False)
    children = serializers.SerializerMethodField()
    menu_button = serializers.SerializerMethodField()

    def get_children(self, obj: Menu):
        data = []
        instance = Menu.objects.filter(parent_id=obj.id)
        if instance:
            serializer = MenuInitSerializer(instance=instance, many=True)
            data = serializer.data
        return data

    def get_menu_button(self, obj: Menu):
        data = []
        instance = obj.menuPermission.order_by('method')
        if instance:
            data = list(instance.values('name', 'value', 'api', 'method'))
        return data

    def save(self, **kwargs):
        instance = super().save(**kwargs)
        children = self.initial_data.get('children')
        menu_button = self.initial_data.get('menu_button')
        # Table des menus
        if children:
            for menu_data in children:
                menu_data['parent'] = instance.id
                filter_data = {
                    "name": menu_data['name'],
                    "web_path": menu_data['web_path'],
                    "component": menu_data['component'],
                    "component_name": menu_data['component_name'],
                }
                instance_obj = Menu.objects.filter(**filter_data).first()
                if instance_obj and not self.initial_data.get('reset'):
                    continue
                serializer = MenuInitSerializer(instance_obj, data=menu_data, request=self.request)
                serializer.is_valid(raise_exception=True)
                serializer.save()
        # Boutons de menu
        if menu_button:
            for menu_button_data in menu_button:
                menu_button_data['menu'] = instance.id
                filter_data = {
                    "menu": menu_button_data['menu'],
                    "value": menu_button_data['value']
                }
                instance_obj = MenuButton.objects.filter(**filter_data).first()
                serializer = MenuButtonInitSerializer(instance_obj, data=menu_button_data, request=self.request)
                serializer.is_valid(raise_exception=True)
                serializer.save()
        return instance

    class Meta:
        model = Menu
        fields = ['name', 'icon', 'sort', 'is_link', 'is_catalog', 'web_path', 'component', 'component_name', 'status',
                  'cache', 'visible', 'parent', 'children', 'menu_button', 'frame_out', 'creator', 'dept_belong_id']
        extra_kwargs = {
            'creator': {'write_only': True},
            'dept_belong_id': {'write_only': True}
        }
        read_only_fields = ['id', 'children']


class WebRouterSerializer(CustomModelSerializer):
    """
    Sérialiseur simple des routes de menu du front-end
    """
    path = serializers.CharField(source="web_path")
    title = serializers.CharField(source="name")
    menuPermission = serializers.SerializerMethodField(read_only=True)

    def get_menuPermission(self, instance):
        # Vérifier s'il s'agit d'un super administrateur
        if self.request.user.is_superuser:
            return instance.menuPermission.values_list('value', flat=True)
        else:
            # Récupérer l'ensemble des identifiants de boutons d'autorisation selon le rôle actuel
            permissionIds = self.request.user.role.values_list('permission', flat=True)
            queryset = instance.menuPermission.filter(id__in=permissionIds, menu=instance.id).values_list('value',
                                                                                                          flat=True)
            if queryset:
                return queryset
            else:
                return None

    class Meta:
        model = Menu
        fields = (
        'id', 'parent', 'icon', 'sort', 'path', 'name', 'title', 'is_link', 'is_catalog', 'web_path', 'component',
        'component_name', 'cache', 'visible', 'menuPermission', 'frame_out')
        read_only_fields = ["id"]


class MenuViewSet(CustomModelViewSet):
    """
    Interface de gestion des menus
    list:Rechercher
    create:Créer
    update:Modifier
    retrieve:Détail
    destroy:Supprimer
    """
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    create_serializer_class = MenuCreateSerializer
    update_serializer_class = MenuCreateSerializer
    search_fields = ['name', 'status']
    filter_fields = ['parent', 'name', 'status', 'is_link', 'visible', 'cache', 'is_catalog']

    # extra_filter_backends = []

    @action(methods=['GET'], detail=False, permission_classes=[])
    def web_router(self, request):
        """Pour que le front-end récupère les routes du rôle actuel"""
        user = request.user
        queryset = self.queryset.filter(status=1)
        if not user.is_superuser:
            menuIds = user.role.values_list('menu__id', flat=True)
            queryset = Menu.objects.filter(id__in=menuIds, status=1)
        serializer = WebRouterSerializer(queryset, many=True, request=request)
        data = serializer.data
        return SuccessResponse(data=data, total=len(data), msg="Récupéré avec succès")

    def list(self, request):
        """Chargement paresseux"""
        params = request.query_params
        parent = params.get('parent', None)
        if params:
            if parent:
                queryset = self.queryset.filter(parent=parent)
            else:
                queryset = self.queryset
        else:
            queryset = self.queryset.filter(parent__isnull=True)
        queryset = self.filter_queryset(queryset)
        serializer = MenuSerializer(queryset, many=True, request=request)
        data = serializer.data
        return SuccessResponse(data=data)
