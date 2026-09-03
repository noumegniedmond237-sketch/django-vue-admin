# -*- coding: utf-8 -*-

"""
@author: Yuan Xiaotian
@contact: QQ:1638245306
@Created on: 2021/6/3 003 0:30
@Remark: Gestion des rôles
"""
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from dvadmin.system.models import Role, Menu, MenuButton, Dept
from dvadmin.system.views.dept import DeptSerializer
from dvadmin.system.views.menu import MenuSerializer
from dvadmin.system.views.menu_button import MenuButtonSerializer
from dvadmin.utils.json_response import SuccessResponse, DetailResponse
from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.validator import CustomUniqueValidator
from dvadmin.utils.viewset import CustomModelViewSet


class RoleSerializer(CustomModelSerializer):
    """
    Sérialiseur de rôle
    """

    class Meta:
        model = Role
        fields = "__all__"
        read_only_fields = ["id"]


class RoleInitSerializer(CustomModelSerializer):
    """
    Informations d'initialisation (pour générer le fichier JSON d'initialisation)
    """

    class Meta:
        model = Role
        fields = ['name', 'key', 'sort', 'status', 'admin', 'data_range', 'remark',
                  'creator', 'dept_belong_id']
        read_only_fields = ["id"]
        extra_kwargs = {
            'creator': {'write_only': True},
            'dept_belong_id': {'write_only': True}
        }


class RoleCreateUpdateSerializer(CustomModelSerializer):
    """
    Sérialiseur de création / mise à jour de la gestion des rôles
    """
    menu = MenuSerializer(many=True, read_only=True)
    dept = DeptSerializer(many=True, read_only=True)
    permission = MenuButtonSerializer(many=True, read_only=True)
    key = serializers.CharField(max_length=50,
                                 validators=[CustomUniqueValidator(queryset=Role.objects.all(), message="Le code de permission doit être unique")])
    name = serializers.CharField(max_length=50, validators=[CustomUniqueValidator(queryset=Role.objects.all())])

    def validate(self, attrs: dict):
        return super().validate(attrs)

    def save(self, **kwargs):
        is_superuser = self.request.user.is_superuser
        if not is_superuser:
            self.validated_data.pop('admin')
        data = super().save(**kwargs)
        data.dept.set(self.initial_data.get('dept', []))
        data.menu.set(self.initial_data.get('menu', []))
        data.permission.set(self.initial_data.get('permission', []))
        return data

    class Meta:
        model = Role
        fields = '__all__'


class MenuPermissonSerializer(CustomModelSerializer):
    """
    Autorisations de boutons du menu
    """
    menuPermission = serializers.SerializerMethodField()

    def get_menuPermission(self, instance):
        is_superuser = self.request.user.is_superuser
        if is_superuser:
            queryset = MenuButton.objects.filter(menu__id=instance.id)
        else:
            menu_permission_id_list = self.request.user.role.values_list('permission',flat=True)
            queryset = MenuButton.objects.filter(id__in=menu_permission_id_list,menu__id=instance.id)
        serializer = MenuButtonSerializer(queryset,many=True, read_only=True)
        return serializer.data

    class Meta:
        model = Menu
        fields = ['id', 'parent', 'name', 'menuPermission']


class RoleViewSet(CustomModelViewSet):
    """
    Interface de gestion des rôles
    list:Rechercher
    create:Créer
    update:Modifier
    retrieve:Détail
    destroy:Supprimer
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    create_serializer_class = RoleCreateUpdateSerializer
    update_serializer_class = RoleCreateUpdateSerializer
    search_fields = ['name', 'key']

    @action(methods=['GET'], detail=False, permission_classes=[IsAuthenticated])
    def role_get_menu(self, request):
        """Renvoyer les menus détenus par le rôle selon le rôle de l'utilisateur actuel"""
        is_superuser = request.user.is_superuser
        is_admin = request.user.role.values_list('admin',flat=True)
        if is_superuser or True in is_admin:
            queryset = Menu.objects.filter(status=1).all()
        else:
            menu_id_list = request.user.role.values_list('menu',flat=True)
            queryset = Menu.objects.filter(id__in=menu_id_list)
        # queryset = self.filter_queryset(queryset)
        serializer = MenuPermissonSerializer(queryset, many=True,request=request)
        return DetailResponse(data=serializer.data)

    @action(methods=['GET'], detail=False, permission_classes=[IsAuthenticated])
    def data_scope(self, request):
        is_superuser = request.user.is_superuser
        role_queryset = Role.objects.filter(users__id=request.user.id).values_list('data_range', flat=True)
        if is_superuser:
            data = [
                {
                    "value": 0,
                    "label": 'Données personnelles uniquement'
                },
                {
                    "value": 1,
                    "label": 'Données du département et des sous-départements'
                },
                {
                    "value": 2,
                    "label": 'Données du département'
                },
                {
                    "value": 3,
                    "label": 'Toutes les données'
                },
                {
                    "value": 4,
                    "label": 'Données personnalisées'
                }
            ]
        else:
            data = []
            data_range_list = list(set(role_queryset))
            for item in data_range_list:
                if item == 0:
                    data = [{
                        "value": 0,
                        "label": 'Données personnelles uniquement'
                    }]
                elif item == 1:
                    data = [{
                        "value": 0,
                        "label": 'Données personnelles uniquement'
                    }, {
                        "value": 1,
                        "label": 'Données du département et des sous-départements'
                    },
                        {
                            "value": 2,
                            "label": 'Données du département'
                        }]
                elif item == 2:
                    data = [{
                        "value": 0,
                        "label": 'Données personnelles uniquement'
                    },
                        {
                            "value": 2,
                            "label": 'Données du département'
                        }]
                elif item == 3:
                    data = [{
                        "value": 0,
                        "label": 'Données personnelles uniquement'
                    },
                        {
                            "value": 3,
                            "label": 'Toutes les données'
                        }, ]
                elif item == 4:
                    data = [{
                        "value": 0,
                        "label": 'Données personnelles uniquement'
                    },
                        {
                            "value": 4,
                            "label": 'Données personnalisées'
                        }]
                else:
                    data = []
        return DetailResponse(data=data)

    @action(methods=['GET'], detail=False, permission_classes=[IsAuthenticated])
    def data_scope_dept(self,request):
        """Récupérer les informations du département selon le rôle actuel"""
        is_superuser = request.user.is_superuser
        if is_superuser:
            queryset = Dept.objects.values('id','name','parent')
        else:
            dept_list = request.user.role.values_list('dept',flat=True)
            queryset = Dept.objects.filter(id__in=dept_list).values('id','name','parent')
        return DetailResponse(data=queryset)