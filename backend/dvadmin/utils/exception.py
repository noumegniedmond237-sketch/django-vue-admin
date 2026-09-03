# -*- coding: utf-8 -*-

"""
@author: Yuan Xiaotian
@contact: QQ:1638245306
@Created on: 2021/6/2 002 16:06
@Remark: Gestion des exceptions personnalisée
"""
import logging
import traceback

from django.db.models import ProtectedError, RestrictedError
from django.http import Http404
from rest_framework.exceptions import APIException as DRFAPIException, AuthenticationFailed, PermissionDenied
from rest_framework.status import HTTP_407_PROXY_AUTHENTICATION_REQUIRED, HTTP_401_UNAUTHORIZED
from rest_framework.views import set_rollback, exception_handler

from dvadmin.utils.json_response import ErrorResponse

logger = logging.getLogger(__name__)


def CustomExceptionHandler(ex, context):
    """
    Interception et traitement unifiés des exceptions
    Objectifs : (1) annuler toutes les réponses d'exception 500 et les unifier en retour d'erreur standard
        (2) afficher précisément les informations d'erreur
    :param ex:
    :param context:
    :return:
    """
    msg = ""
    code = 4000
    # Appeler la fonction de traitement des exceptions par défaut
    response = exception_handler(ex, context)
    if isinstance(ex, AuthenticationFailed):
        # S'il s'agit d'une erreur d'authentification
        if response and response.data.get("detail") == "Given token not valid for any token type":
            code = 401
            msg = ex.detail
        elif response and response.data.get("detail") == "Token is blacklisted":
            # Token dans la liste noire
            return ErrorResponse(status=HTTP_401_UNAUTHORIZED)
        else:
            code = 401
            msg = ex.detail
    elif isinstance(ex, Http404):
        code = 400
        msg = "Adresse d'interface incorrecte"
    elif isinstance(ex, DRFAPIException):
        set_rollback()
        msg = ex.detail
        if isinstance(ex, PermissionDenied):
            msg = f'{msg} ({context["request"].method}: {context["request"].path})'
        if isinstance(msg, dict):
            for k, v in msg.items():
                for i in v:
                    msg = "%s:%s" % (k, i)
    elif isinstance(ex, (ProtectedError, RestrictedError)):
        set_rollback()
        msg = "Suppression impossible : ces données sont liées à d'autres données"
    # elif isinstance(ex, DatabaseError):
    #     set_rollback()
    #     msg = "Exception du serveur d'interface, veuillez contacter l'administrateur"
    elif isinstance(ex, Exception):
        logger.exception(traceback.format_exc())
        msg = str(ex)
    return ErrorResponse(msg=msg, code=code)
