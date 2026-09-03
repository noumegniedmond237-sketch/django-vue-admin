import os

from application.settings import BASE_DIR

# ================================================= #
# *************** Configuration base MySQL  *************** #
# ================================================= #
# ENGINE de la base de données, démo par défaut avec sqlite3, mysql recommandé en production
# Paramètres sqlite3
DATABASE_ENGINE = "django.db.backends.sqlite3"
DATABASE_NAME = os.path.join(BASE_DIR, "db.sqlite3")

# Pour utiliser mysql, passer à cette configuration
# DATABASE_ENGINE = "django.db.backends.mysql"
# DATABASE_NAME = 'django-vue-admin' # en cas de mysql

# Adresse de la base de données, à remplacer par votre propre adresse
DATABASE_HOST = "127.0.0.1"
# # Port de la base de données
DATABASE_PORT = 3306
# # Nom d'utilisateur de la base de données
DATABASE_USER = "root"
# # Mot de passe de la base de données
DATABASE_PASSWORD = "123456"

# Préfixe des tables
TABLE_PREFIX = "dvadmin_"
# ================================================= #
# ******** Configuration redis, ignorable sans redis  ******** #
# ================================================= #
# REDIS_PASSWORD = ''
# REDIS_HOST = '127.0.0.1'
# REDIS_URL = f'redis://:{REDIS_PASSWORD or ""}@{REDIS_HOST}:6380'
# ================================================= #
# ****************** Activation / désactivation des fonctionnalités  ******************* #
# ================================================= #
DEBUG = True
# Activer l'analyse détaillée à la connexion (récupère l'adresse IP détaillée via api. À désactiver en intranet)
ENABLE_LOGIN_ANALYSIS_LOG = True
# L'interface de connexion /api/token/ nécessite-t-elle un captcha, pour les tests, à désactiver de préférence en production
LOGIN_NO_CAPTCHA_AUTH = True
# Activer ou non la journalisation des API
API_LOG_ENABLE = locals().get("API_LOG_ENABLE", True)
# Méthodes de requête journalisées pour les API
API_LOG_METHODS = locals().get("API_LOG_METHODS", ["POST", "UPDATE", "DELETE", "PUT"])
# API_LOG_METHODS = 'ALL' # ['POST', 'DELETE']
# ================================================= #
# ****************** Autre configuration  ******************* #
# ================================================= #
ENVIRONMENT = "local"  # environnement, test pour test ; prod pour production ; local pour local
ALLOWED_HOSTS = ["*"]
# Emplacement de stockage de la configuration système : redis/memory (par défaut)
DISPATCH_DB_TYPE = 'redis'
