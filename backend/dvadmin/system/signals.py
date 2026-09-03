from django.dispatch import Signal
# Signal d'initialisation
pre_init_complete = Signal()
detail_init_complete = Signal()
post_init_complete = Signal()
# Signal d'initialisation des tenants
pre_tenants_init_complete = Signal()
detail_tenants_init_complete = Signal()
post_tenants_init_complete = Signal()
post_tenants_all_init_complete = Signal()
# Signal de fin de création de tenant
tenants_create_complete = Signal()
