# -*- coding: utf-8 -*-

"""
@author: Yuan Xiaotian
@contact: QQ:1638245306
@Created on: 2021/6/3 003 0:30
@Remark: Gestion des boutons de menu
"""
from django.db.models import F, CharField, Value, ExpressionWrapper
from django.db.models.functions import Cast, Concat
from rest_framework.decorators import action

from dvadmin.system.models import MenuButton, Menu
from dvadmin.utils.json_response import DetailResponse
from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.viewset import CustomModelViewSet


class MenuButtonSerializer(CustomModelSerializer):
    """
    Sérialiseur des boutons de menu
    """

    class Meta:
        model = MenuButton
        fields = ["id", "name", "value", "api", "method", "menu"]
        read_only_fields = ["id"]


class MenuButtonInitSerializer(CustomModelSerializer):
    """
    Sérialiseur d'initialisation des boutons de menu
    """

    class Meta:
        model = MenuButton
        fields = ["id", "name", "value", "api", "method", "menu"]
        read_only_fields = ["id"]


class MenuButtonCreateUpdateSerializer(CustomModelSerializer):
    """
    Sérialiseur d'initialisation des boutons de menu
    """

    class Meta:
        model = MenuButton
        fields = "__all__"
        read_only_fields = ["id"]


class MenuButtonViewSet(CustomModelViewSet):
    """
    Interface des boutons de menu
    list:Rechercher
    create:Créer
    update:Modifier
    retrieve:Détail
    destroy:Supprimer
    """

    queryset = MenuButton.objects.all()
    serializer_class = MenuButtonSerializer
    create_serializer_class = MenuButtonCreateUpdateSerializer
    update_serializer_class = MenuButtonCreateUpdateSerializer
    extra_filter_backends = []

    @action(methods=["GET"], detail=False, permission_classes=[])
    def get_btn_permission(self, request):
        """
        Récupérer les autorisations de boutons de l'utilisateur actuel
        """
        user = request.user
        if not user.is_superuser:
            menuIds = user.role.values_list("menu__id", flat=True)
        else:
            menuIds = Menu.objects.filter(status=1)
        queryset = (
            MenuButton.objects.filter(menu__in=menuIds)
            .annotate(permission=Concat("menu__web_path", Value(":"), "value", output_field=CharField()))
            .values_list("permission", flat=True)
        )
        return DetailResponse(data=queryset)
