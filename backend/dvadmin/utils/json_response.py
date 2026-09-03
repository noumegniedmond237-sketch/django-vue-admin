# -*- coding: utf-8 -*-

"""
@author: Yuan Xiaotian
@contact: QQ:1638245306
@Created on: 2021/6/2 002 14:43
@Remark: Fichier JsonResponse personnalisé
"""

from rest_framework.response import Response


class SuccessResponse(Response):
    """
    Retour standard en cas de succès, SuccessResponse(data) ou SuccessResponse(data=data)
    (1) le code 2000 est renvoyé par défaut, la spécification d'autres codes n'est pas prise en charge
    """

    def __init__(self, data=None, msg='success', status=None, template_name=None, headers=None, exception=False,
                 content_type=None,page=1,limit=1,total=1):
        std_data = {
            "code": 2000,
            "data": {
                "page": page,
                "limit": limit,
                "total": total,
                "data": data
            },
            "msg": msg
        }
        super().__init__(std_data, status, template_name, headers, exception, content_type)


class DetailResponse(Response):
    """
    Retour d'interface sans informations de pagination, principalement pour la consultation d'une seule donnée
    (1) le code 2000 est renvoyé par défaut, la spécification d'autres codes n'est pas prise en charge
    """

    def __init__(self, data=None, msg='success', status=None, template_name=None, headers=None, exception=False,
                 content_type=None,):
        std_data = {
            "code": 2000,
            "data": data,
            "msg": msg
        }
        super().__init__(std_data, status, template_name, headers, exception, content_type)


class ErrorResponse(Response):
    """
    Retour standard en cas d'erreur, ErrorResponse(msg='xxx')
    (1) le code d'erreur 400 est renvoyé par défaut, d'autres codes peuvent aussi être spécifiés : ErrorResponse(code=xxx)
    """

    def __init__(self, data=None, msg='error', code=400, status=None, template_name=None, headers=None,
                 exception=False, content_type=None):
        std_data = {
            "code": code,
            "data": data,
            "msg": msg
        }
        super().__init__(std_data, status, template_name, headers, exception, content_type)
