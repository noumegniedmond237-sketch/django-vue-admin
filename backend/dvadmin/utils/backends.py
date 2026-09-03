import hashlib
import logging

from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import check_password
from django.utils import timezone

from dvadmin.utils.validator import CustomValidationError

logger = logging.getLogger(__name__)
UserModel = get_user_model()


class CustomBackend(ModelBackend):
    """
    Django原生认证方式
    - 新哈希: pbkdf2/argon2 natif sur le mot de passe en clair (Django check_password).
    - Ancien schéma (compat migration): pbkdf2(md5(mot de passe)) — vérifié en
      fallback puis re-haché en natif à la première connexion réussie.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        msg = '%s 正在使用本地登录...' % username
        logger.info(msg)
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        try:
            user = UserModel._default_manager.get_by_natural_key(username)
        except UserModel.DoesNotExist:
            UserModel().set_password(password)
        else:
            legacy_hashes = []
            verify_password = check_password(password, user.password)
            if not verify_password:
                # Fallback schéma historique: pbkdf2(md5(password))
                legacy_md5 = hashlib.md5(password.encode(encoding='UTF-8')).hexdigest()
                legacy_hashes.append(legacy_md5)
                verify_password = check_password(legacy_md5, user.password)
            if not verify_password:
                # Fallback import historique: pbkdf2(md5(md5(password)))
                legacy_md5_2 = hashlib.md5(legacy_hashes[0].encode(encoding='UTF-8')).hexdigest()
                verify_password = check_password(legacy_md5_2, user.password)
            if verify_password:
                if self.user_can_authenticate(user):
                    # Migration transparente vers le hash natif
                    if legacy_hashes or not user.password.startswith('pbkdf2_'):
                        user.set_password(password)
                        user.save(update_fields=['password'])
                    user.last_login = timezone.now()
                    user.save(update_fields=['last_login'])
                    return user
                raise CustomValidationError("当前用户已被禁用，请联系管理员!")
