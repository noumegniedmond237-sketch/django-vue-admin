import logging

from django.core.management.base import BaseCommand

from application import settings
from dvadmin.system import signals

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    """
    Commande d'initialisation du projet : python manage.py init
    """

    def add_arguments(self, parser):
        parser.add_argument(
            "init_name",
            nargs="*",
            type=str,
        )
        parser.add_argument("-y", nargs="*")
        parser.add_argument("-Y", nargs="*")
        parser.add_argument("-n", nargs="*")
        parser.add_argument("-N", nargs="*")

    def handle(self, *args, **options):
        reset = False
        if isinstance(options.get("y"), list) or isinstance(options.get("Y"), list):
            reset = True
        if isinstance(options.get("n"), list) or isinstance(options.get("N"), list):
            reset = False
        signals.pre_init_complete.send(sender=None, msg='Début de l’initialisation', data={"reset": reset})
        for app in settings.INSTALLED_APPS:
            signals.detail_init_complete.send(sender=None, msg='Initialisation en cours', data={"app": app, "reset": reset})
            try:
                exec(
                    f"""
from {app}.fixtures.initialize import Initialize
Initialize(reset={reset},app="{app}").run()
                """
                )
            except ModuleNotFoundError:
                # Compatibilité avec l'initialisation des versions précédentes
                try:
                    exec(
                        f"""
from {app}.initialize import main
main(reset={reset})
                """
                    )
                except ModuleNotFoundError:
                    pass
        signals.post_init_complete.send(sender=None, msg='Initialisation terminée', data={"reset": reset})
        print("Initialisation des données terminée !")
