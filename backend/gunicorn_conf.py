# gunicorn.conf
# coding:utf-8
# Commande de démarrage : gunicorn -c gunicorn.py application.asgi:application
import multiprocessing
# Nombre de processus workers en parallèle, int, nombre recommandé : cpu*2+1
workers = multiprocessing.cpu_count() * 2 + 1
# Nombre de threads démarrés pour chaque processus
threads = 3
# IP et port liés
bind = '0.0.0.0:8000'
# Activer le mode démon, confier le processus à un gestionnaire tiers
daemon = 'false'
# Mode coroutine, le mode sync par défaut, utilisation recommandée de gevent, ici utilisé avec uvicorn : uvicorn.workers.UvicornWorker
worker_class = 'uvicorn.workers.UvicornWorker'
# Concurrence maximale (nombre de threads de traitement des requêtes par worker, entier positif, 1 par défaut)
worker_connections = 10000
# Nombre maximal de clients concurrents, 1000 par défaut. Ce paramètre affecte les modes gevent et eventlet
# Chaque processus worker redémarrera automatiquement après avoir traité max_requests requêtes
max_requests = 10000
max_requests_jitter = 200
# Répertoire du fichier de processus
pidfile = './gunicorn.pid'
# Niveau de journalisation, ce niveau concerne le journal des erreurs, celui du journal d'accès ne peut pas être défini
loglevel = 'info'
# Format du journal d'accès gunicorn, le journal des erreurs ne peut pas être défini
access_log_format = '' # lorsque worker_class vaut uvicorn.workers.UvicornWorker, le format du journal correspond aux loggers de Django
# File d'écoute
backlog = 512
#Nom du processus
proc_name = 'gunicorn_process'
# Délai d'expiration 120s, 30s par défaut. À ajuster selon vos besoins : timeout = 120
timeout = 120
# Redémarrage après expiration
graceful_timeout = 300
# Secondes d'attente des requêtes sur une connexion keep-alive, 2 par défaut. Généralement entre 1 et 5 secondes.
keepalive = 3
# Taille maximale de la ligne de requête HTTP, ce paramètre limite la taille autorisée de la ligne de requête, 4094 par défaut.
# Valeur numérique de 0 à 8190. Ce paramètre permet de prévenir toute attaque DDOS
limit_request_line = 5120
# Limiter le nombre de champs d'en-tête dans les requêtes HTTP.
#  Ce champ limite le nombre de champs d'en-tête pour prévenir les attaques DDOS, à utiliser avec limit-request-field-size pour améliorer la sécurité.
# Par défaut, cette valeur vaut 100 et ne peut pas dépasser 32768
limit_request_fields = 101
# Limiter la taille des en-têtes dans les requêtes HTTP, 8190 par défaut.
# Valeur entière ou 0, lorsque cette valeur vaut 0, aucune limite n'est appliquée à la taille des en-têtes
limit_request_field_size = 0
# Journaliser vers la sortie standard
accesslog = '-'
