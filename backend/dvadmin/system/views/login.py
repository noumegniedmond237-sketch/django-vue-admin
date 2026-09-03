import base64
from datetime import datetime, timedelta

from captcha.views import CaptchaStore, captcha_image
from django.contrib import auth
from django.contrib.auth import login
from django.shortcuts import redirect
from django.utils.translation import gettext_lazy as _
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers
from rest_framework.status import HTTP_401_UNAUTHORIZED
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from django.conf import settings

from application import dispatch
from dvadmin.system.models import Users
from dvadmin.utils.json_response import ErrorResponse, DetailResponse
from dvadmin.utils.request_util import save_login_log
from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.validator import CustomValidationError


class CaptchaView(APIView):
    authentication_classes = []
    permission_classes = []
    throttle_classes = [AnonRateThrottle]
    throttle_scope = "login"

    @swagger_auto_schema(
        responses={"200": openapi.Response("Récupéré avec succès")},
        security=[],
        operation_id="captcha-get",
        operation_description="Récupération du code de vérification",
    )
    def get(self, request):
        data = {}
        if dispatch.get_system_config_values("base.captcha_state"):
            hashkey = CaptchaStore.generate_key()
            id = CaptchaStore.objects.filter(hashkey=hashkey).first().id
            imgage = captcha_image(request, hashkey)
            # Convertir l'image en base64
            image_base = base64.b64encode(imgage.content)
            data = {
                "key": id,
                "image_base": "data:image/png;base64," + image_base.decode("utf-8"),
            }
        return DetailResponse(data=data)


class LoginSerializer(TokenObtainPairSerializer):
    """
    Sérialiseur de connexion :
    Surcharge du sérialiseur de djangorestframework-simplejwt
    """
    captcha = serializers.CharField(
        max_length=6, required=False, allow_null=True, allow_blank=True
    )

    class Meta:
        model = Users
        fields = "__all__"
        read_only_fields = ["id"]

    default_error_messages = {"no_active_account": _("Identifiant / mot de passe incorrect")}

    def validate(self, attrs):

        captcha = self.initial_data.get("captcha", None)
        if dispatch.get_system_config_values("base.captcha_state"):
            if captcha is None:
                raise CustomValidationError("Le code de vérification ne peut pas être vide")
            self.image_code = CaptchaStore.objects.filter(
                id=self.initial_data["captchaKey"]
            ).first()
            five_minute_ago = datetime.now() - timedelta(hours=0, minutes=5, seconds=0)
            if self.image_code and five_minute_ago > self.image_code.expiration:
                self.image_code and self.image_code.delete()
                raise CustomValidationError("Code de vérification expiré")
            else:
                if self.image_code and (
                        self.image_code.response == captcha
                        or self.image_code.challenge == captcha
                ):
                    self.image_code and self.image_code.delete()
                else:
                    self.image_code and self.image_code.delete()
                    raise CustomValidationError("Code de vérification image incorrect")
        data = super().validate(attrs)
        data["name"] = self.user.name
        data["userId"] = self.user.id
        data["avatar"] = self.user.avatar
        data['user_type'] = self.user.user_type
        dept = getattr(self.user, 'dept', None)
        if dept:
            data['dept_info'] = {
                'dept_id': dept.id,
                'dept_name': dept.name,

            }
        role = getattr(self.user, 'role', None)
        if role:
            data['role_info'] = role.values('id', 'name', 'key')
        request = self.context.get("request")
        request.user = self.user
        # Enregistrer le journal de connexion
        save_login_log(request=request)
        # Vérifier si la connexion unique est activée
        if dispatch.get_system_config_values("base.single_login"):
            # Ajouter les tokens précédents de l'utilisateur à la liste noire
            user = Users.objects.filter(id=self.user.id).values('last_token').first()
            last_token = user.get('last_token')
            if last_token:
                try:
                    token = RefreshToken(last_token)
                    token.blacklist()
                except:
                    pass
            # Enregistrer le token le plus récent dans la table des utilisateurs
            Users.objects.filter(id=self.user.id).update(last_token=data.get('refresh'))
        return {"code": 2000, "msg": "Requête réussie", "data": data}

class CustomTokenRefreshView(TokenRefreshView):
    """
    Rafraîchissement personnalisé du token (avec rotation : l'ancien refresh est blacklisté,
    une nouvelle paire est émise — le front doit stocker le nouveau refresh).
    """
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        try:
            token = RefreshToken(refresh_token)
            user_id = token.get("user_id")
            user = Users.objects.filter(id=user_id).first()
            if not user:
                return ErrorResponse(status=HTTP_401_UNAUTHORIZED)
            if api_settings.ROTATE_REFRESH_TOKENS:
                try:
                    token.blacklist()
                except Exception:
                    pass
                new_refresh = RefreshToken.for_user(user)
                data = {
                    "access": str(new_refresh.access_token),
                    "refresh": str(new_refresh),
                }
            else:
                data = {
                    "access": str(token.access_token),
                    "refresh": str(token),
                }
            # Maintenir le suivi single-login sur le refresh courant
            Users.objects.filter(id=user.id).update(last_token=data["refresh"])
        except Exception:
            return ErrorResponse(status=HTTP_401_UNAUTHORIZED)
        return DetailResponse(data=data)

class LoginView(TokenObtainPairView):
    """
    Interface de connexion
    """
    serializer_class = LoginSerializer
    permission_classes = []
    throttle_classes = [AnonRateThrottle]
    throttle_scope = "login"


class LoginTokenSerializer(TokenObtainPairSerializer):
    """
    Sérialiseur de connexion :
    """

    class Meta:
        model = Users
        fields = "__all__"
        read_only_fields = ["id"]

    default_error_messages = {"no_active_account": _("Identifiant / mot de passe incorrect")}

    def validate(self, attrs):
        if not getattr(settings, "LOGIN_NO_CAPTCHA_AUTH", False):
            return {"code": 4000, "msg": "Cette interface n'est pas encore activée !", "data": None}
        data = super().validate(attrs)
        data["name"] = self.user.name
        data["userId"] = self.user.id
        return {"code": 2000, "msg": "Requête réussie", "data": data}


class LoginTokenView(TokenObtainPairView):
    """
    Interface de connexion pour obtenir un token
    """

    serializer_class = LoginTokenSerializer
    permission_classes = []
    throttle_classes = [AnonRateThrottle]
    throttle_scope = "login"


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh")
        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except Exception:
                pass
        Users.objects.filter(id=self.request.user.id).update(last_token=None)
        return DetailResponse(msg="Déconnexion réussie")


class ApiLoginSerializer(CustomModelSerializer):
    """Sérialiseur de connexion de la documentation d'API"""

    username = serializers.CharField()
    password = serializers.CharField()

    class Meta:
        model = Users
        fields = ["username", "password"]


class ApiLogin(APIView):
    """Interface de connexion de la documentation d'API"""

    serializer_class = ApiLoginSerializer
    authentication_classes = []
    permission_classes = []
    throttle_classes = [AnonRateThrottle]
    throttle_scope = "login"

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        # Mot de passe en clair: le CustomBackend gère le natif + fallback md5 historique
        user_obj = auth.authenticate(
            request,
            username=username,
            password=password,
        )
        if user_obj:
            login(request, user_obj)
            return redirect("/")
        else:
            return ErrorResponse(msg="Identifiant ou mot de passe incorrect")
