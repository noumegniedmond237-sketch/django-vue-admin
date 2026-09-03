import hashlib

from django.contrib.auth.hashers import make_password, check_password
from django_restql.fields import DynamicSerializerMethodField
from rest_framework import serializers
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db import connection
from application import dispatch
from dvadmin.system.models import Users, Role, Dept
from dvadmin.system.views.role import RoleSerializer
from dvadmin.utils.json_response import ErrorResponse, DetailResponse
from dvadmin.utils.serializers import CustomModelSerializer
from dvadmin.utils.validator import CustomUniqueValidator
from dvadmin.utils.viewset import CustomModelViewSet


def recursion(instance, parent, result):
    new_instance = getattr(instance, parent, None)
    res = []
    data = getattr(instance, result, None)
    if data:
        res.append(data)
    if new_instance:
        array = recursion(new_instance, parent, result)
        res += (array)
    return res


class UserSerializer(CustomModelSerializer):
    """
    Sérialiseur de gestion des utilisateurs
    """
    dept_name = serializers.CharField(source='dept.name', read_only=True)
    role_info = DynamicSerializerMethodField()

    class Meta:
        model = Users
        read_only_fields = ["id"]
        exclude = ["password"]
        extra_kwargs = {
            "post": {"required": False},
        }

    def get_role_info(self, instance, parsed_query):
        roles = instance.role.all()
        # You can do what ever you want in here
        # `parsed_query` param is passed to BookSerializer to allow further querying
        serializer = RoleSerializer(
            roles,
            many=True,
            parsed_query=parsed_query
        )
        return serializer.data


class UsersInitSerializer(CustomModelSerializer):
    """
    Informations d'initialisation (pour générer le fichier JSON d'initialisation)
    """

    def save(self, **kwargs):
        instance = super().save(**kwargs)
        role_key = self.initial_data.get('role_key', [])
        role_ids = Role.objects.filter(key__in=role_key).values_list('id', flat=True)
        instance.role.set(role_ids)
        dept_key = self.initial_data.get('dept_key', None)
        dept_id = Dept.objects.filter(key=dept_key).first()
        instance.dept = dept_id
        instance.save()
        return instance

    class Meta:
        model = Users
        fields = ["username", "email", 'mobile', 'avatar', "name", 'gender', 'user_type', "dept", 'user_type',
                  'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'creator', 'dept_belong_id',
                  'password', 'last_login', 'is_superuser']
        read_only_fields = ['id']
        extra_kwargs = {
            'creator': {'write_only': True},
            'dept_belong_id': {'write_only': True}
        }


class UserCreateSerializer(CustomModelSerializer):
    """
    Sérialiseur de création d'utilisateur
    """

    username = serializers.CharField(
        max_length=50,
        validators=[
            CustomUniqueValidator(queryset=Users.objects.all(), message="L'identifiant doit être unique")
        ],
    )
    password = serializers.CharField(
        required=False,
    )

    def validate_password(self, value):
        password = self.initial_data.get("password")
        if password:
            return make_password(value)
        return value

    def save(self, **kwargs):
        data = super().save(**kwargs)
        data.dept_belong_id = data.dept_id
        data.save()
        data.post.set(self.initial_data.get("post", []))
        return data

    class Meta:
        model = Users
        fields = "__all__"
        read_only_fields = ["id"]
        extra_kwargs = {
            "post": {"required": False},
        }


class UserUpdateSerializer(CustomModelSerializer):
    username = serializers.CharField(
        max_length=50,
        validators=[
            CustomUniqueValidator(queryset=Users.objects.all(), message="L'identifiant doit être unique")
        ],
    )
    mobile = serializers.CharField(
        max_length=50,
        validators=[
            CustomUniqueValidator(queryset=Users.objects.all(), message="Le numéro de téléphone doit être unique")
        ],
        allow_blank=True
    )

    def save(self, **kwargs):
        data = super().save(**kwargs)
        data.dept_belong_id = data.dept_id
        data.save()
        data.post.set(self.initial_data.get("post", []))
        return data

    class Meta:
        model = Users
        read_only_fields = ["id", "password"]
        fields = "__all__"
        extra_kwargs = {
            "post": {"required": False, "read_only": True},
        }


class UserInfoUpdateSerializer(CustomModelSerializer):
    mobile = serializers.CharField(
        max_length=50,
        validators=[
            CustomUniqueValidator(queryset=Users.objects.all(), message="Le numéro de téléphone doit être unique")
        ],
        allow_blank=True
    )

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

    class Meta:
        model = Users
        fields = ['email', 'avatar', 'name', 'gender']
        extra_kwargs = {
            "post": {"required": False, "read_only": True},
        }


class ExportUserProfileSerializer(CustomModelSerializer):
    """
    Sérialiseur d'export des utilisateurs
    """

    last_login = serializers.DateTimeField(
        format="%Y-%m-%d %H:%M:%S", required=False, read_only=True
    )
    is_active = serializers.SerializerMethodField(read_only=True)
    dept_name = serializers.CharField(source="dept.name", default="")
    dept_owner = serializers.CharField(source="dept.owner", default="")
    gender = serializers.CharField(source="get_gender_display", read_only=True)

    def get_is_active(self, instance):
        return "Activé" if instance.is_active else "Désactivé"

    class Meta:
        model = Users
        fields = (
            "username",
            "name",
            "email",
            "mobile",
            "gender",
            "is_active",
            "last_login",
            "dept_name",
            "dept_owner",
        )


class UserProfileImportSerializer(CustomModelSerializer):
    password = serializers.CharField(required=True, max_length=50, error_messages={"required": "Le mot de passe de connexion ne peut pas être vide"})

    def save(self, **kwargs):
        data = super().save(**kwargs)
        # Mot de passe saisi en clair (Excel) -> hash natif Django (cf. CustomBackend)
        data.set_password(str(self.initial_data.get("password", "admin123456")))
        data.save()
        return data

    class Meta:
        model = Users
        exclude = (
            "post",
            "user_permissions",
            "groups",
            "is_superuser",
            "date_joined",
        )


class UserViewSet(CustomModelViewSet):
    """
    Interface des utilisateurs
    list:Rechercher
    create:Créer
    update:Modifier
    retrieve:Détail
    destroy:Supprimer
    """

    queryset = Users.objects.exclude(is_superuser=1).all()
    serializer_class = UserSerializer
    create_serializer_class = UserCreateSerializer
    update_serializer_class = UserUpdateSerializer
    filter_fields = ["^name", "~username", "^mobile", "is_active", "dept", "user_type", "$dept__name"]
    # filter_fields = {
    #     "name": ["icontains"],
    #     "mobile": ["iregex"],
    #     "username": ["icontains"],
    #     "is_active": ["icontains"],
    #     "dept": ["exact"],
    #     "user_type": ["exact"],
    #     "dept__name": ["icontains"],
    # }
    search_fields = ["username", "name", "gender", "dept__name", "role__name"]
    # Export
    export_field_label = {
        "username": "Compte utilisateur",
        "name": "Nom de l'utilisateur",
        "email": "E-mail de l'utilisateur",
        "mobile": "Numéro de téléphone",
        "gender": "Genre de l'utilisateur",
        "is_active": "Statut du compte",
        "last_login": "Dernière connexion",
        "dept_name": "Nom du département",
        "dept_owner": "Responsable du département",
    }
    export_serializer_class = ExportUserProfileSerializer
    # Import
    import_serializer_class = UserProfileImportSerializer
    import_field_dict = {
        "username": "Compte de connexion",
        "name": "Nom de l'utilisateur",
        "email": "E-mail de l'utilisateur",
        "mobile": "Numéro de téléphone",
        "gender": {
            "title": "Genre de l'utilisateur",
            "choices": {
                "data": {"Inconnu": 2, "Homme": 1, "Femme": 0},
            }
        },
        "is_active": {
            "title": "Statut du compte",
            "choices": {
                "data": {"Activé": True, "Désactivé": False},
            }
        },
        "password": "Mot de passe de connexion",
        "dept": {"title": "Département", "choices": {"queryset": Dept.objects.filter(status=True), "values_name": "name"}},
        "role": {"title": "Rôle", "choices": {"queryset": Role.objects.filter(status=True), "values_name": "name"}},
    }

    @action(methods=["GET"], detail=False, permission_classes=[IsAuthenticated])
    def user_info(self, request):
        """Récupérer les informations de l'utilisateur actuel"""
        user = request.user
        result = {
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "mobile": user.mobile,
            "user_type": user.user_type,
            "gender": user.gender,
            "email": user.email,
            "avatar": user.avatar,
            "dept": user.dept_id,
            "is_superuser": user.is_superuser,
            "role": user.role.values_list('id', flat=True),
        }
        if hasattr(connection, 'tenant'):
            result['tenant_id'] = connection.tenant and connection.tenant.id
            result['tenant_name'] = connection.tenant and connection.tenant.name
        dept = getattr(user, 'dept', None)
        if dept:
            result['dept_info'] = {
                'dept_id': dept.id,
                'dept_name': dept.name
            }
        role = getattr(user, 'role', None)
        if role:
            result['role_info'] = role.values('id', 'name', 'key')
        return DetailResponse(data=result, msg="Récupéré avec succès")

    @action(methods=["PUT"], detail=False, permission_classes=[IsAuthenticated])
    def update_user_info(self, request):
        serializer = UserInfoUpdateSerializer(request.user, data=request.data, request=request)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return DetailResponse(data=None, msg="Modifié avec succès")

    @action(methods=["PUT"], detail=True, permission_classes=[IsAuthenticated])
    def change_password(self, request, *args, **kwargs):
        data = request.data
        old_pwd = data.get("oldPassword")
        new_pwd = data.get("newPassword")
        new_pwd2 = data.get("newPassword2")
        if old_pwd is None or new_pwd is None or new_pwd2 is None:
            return ErrorResponse(msg="Les paramètres ne peuvent pas être vides")
        if new_pwd != new_pwd2:
            return ErrorResponse(msg="Les deux mots de passe ne correspondent pas")
        verify_password = check_password(old_pwd, self.request.user.password)
        if not verify_password:
            verify_password = check_password(hashlib.md5(old_pwd.encode(encoding='UTF-8')).hexdigest(), self.request.user.password)
        if verify_password:
            # Stockage en hash natif Django (le CustomBackend migre les anciens hashes au login)
            request.user.set_password(new_pwd)
            request.user.save(update_fields=["password"])
            return DetailResponse(data=None, msg="Modifié avec succès")
        else:
            return ErrorResponse(msg="L'ancien mot de passe est incorrect")

    @action(methods=["PUT"], detail=True, permission_classes=[IsAuthenticated])
    def reset_to_default_password(self, request, *args, **kwargs):
        instance = Users.objects.filter(id=kwargs.get("pk")).first()
        if instance:
            instance.set_password(dispatch.get_system_config_values("base.default_password"))
            instance.save()
            return DetailResponse(data=None, msg="Mot de passe réinitialisé avec succès")
        else:
            return ErrorResponse(msg="Utilisateur introuvable")

    @action(methods=["PUT"], detail=True)
    def reset_password(self, request, pk):
        instance = Users.objects.filter(id=pk).first()
        data = request.data
        new_pwd = data.get("newPassword")
        new_pwd2 = data.get("newPassword2")
        if instance:
            if new_pwd != new_pwd2:
                return ErrorResponse(msg="Les deux mots de passe ne correspondent pas")
            else:
                instance.password = make_password(new_pwd)
                instance.save()
                return DetailResponse(data=None, msg="Modifié avec succès")
        else:
            return ErrorResponse(msg="Utilisateur introuvable")
