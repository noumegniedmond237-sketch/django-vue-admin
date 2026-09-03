from rest_framework.views import APIView
from django.shortcuts import render


class PrivacyView(APIView):
    """
    Politique de confidentialité du back-office
    """
    permission_classes = []

    def get(self, request, *args, **kwargs):
        return render(request, 'privacy.html')



class TermsServiceView(APIView):
    """
    Conditions d'utilisation du back-office
    """
    permission_classes = []

    def get(self, request, *args, **kwargs):
        return render(request, 'terms_service.html')
