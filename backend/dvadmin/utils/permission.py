import re

from django.contrib.auth.models import AnonymousUser
from django.db.models import F
from rest_framework.permissions import BasePermission

from dvadmin.system.models import ApiWhiteList


def ValidationApi(reqApi, validApi):
    """
    Vérifier si l'utilisateur actuel possède l'autorisation d'interface
    :param reqApi: interface de la requête actuelle
    :param validApi: interface utilisée pour la vérification
    :return: True ou False
    """
    if validApi is not None:
        valid_api = validApi.replace('{id}', '.*?')
        matchObj = re.match(valid_api, reqApi, re.M | re.I)
        if matchObj:
            return True
        else:
            return False
    else:
        return False


class AnonymousUserPermission(BasePermission):
    """
    Autorisations des utilisateurs anonymes
    """

    def has_permission(self, request, view):
        if isinstance(request.user, AnonymousUser):
            return False
        return True


def ReUUID(api):
    """
    Remplacer l'uuid de l'interface
    :param api:
    :return:
    """
    pattern = re.compile(r'[a-f\d]{4}(?:[a-f\d]{4}-){4}[a-f\d]{12}/$')
    m = pattern.search(api)
    if m:
        res = api.replace(m.group(0), ".*/")
        return res
    else:
        return None


class CustomPermission(BasePermission):
    """Autorisations personnalisées"""

    def has_permission(self, request, view):
        if isinstance(request.user, AnonymousUser):
            return False
        # Vérifier s'il s'agit d'un super administrateur
        if request.user.is_superuser:
            return True
        else:
            api = request.path  # Interface de la requête actuelle
            method = request.method  # Méthode de la requête actuelle
            methodList = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
            method = methodList.index(method)
            # ***Liste blanche d'interfaces***
            api_white_list = ApiWhiteList.objects.values(permission__api=F('url'), permission__method=F('method'))
            api_white_list = [
                str(item.get('permission__api').replace('{id}', '([a-zA-Z0-9-]+)')) + ":" + str(
                    item.get('permission__method')) + '$' for item in api_white_list if item.get('permission__api')]
            # ********#
            if not hasattr(request.user, "role"):
                return False
            userApiList = request.user.role.values('permission__api', 'permission__method')  # Récupérer toutes les interfaces détenues par les rôles de l'utilisateur actuel
            ApiList = [
                str(item.get('permission__api').replace('{id}', '([a-zA-Z0-9-]+)')) + ":" + str(
                    item.get('permission__method')) + '$' for item in userApiList if item.get('permission__api')]
            new_api_ist = api_white_list + ApiList
            new_api = api + ":" + str(method)
            for item in new_api_ist:
                matchObj = re.match(item, new_api, re.M | re.I)
                if matchObj is None:
                    continue
                else:
                    return True
            else:
                return False


class SuperuserPermission(BasePermission):
    """
    Classe d'autorisation du super administrateur
    """

    def has_permission(self, request, view):
        if isinstance(request.user, AnonymousUser):
            return False
        # Vérifier s'il s'agit d'un super administrateur
        if request.user.is_superuser:
            return True


class AdminPermission(BasePermission):
    """
    Classe d'autorisation de l'administrateur ordinaire
    """

    def has_permission(self, request, view):
        if isinstance(request.user, AnonymousUser):
            return False
        # Vérifier s'il s'agit d'un super administrateur
        is_superuser = request.user.is_superuser
        # Vérifier s'il s'agit d'un rôle administrateur
        is_admin = request.user.role.values_list('admin', flat=True)
        if is_superuser or True in is_admin:
            return True
