# -*- coding: utf-8 -*-
import urllib

from asgiref.sync import sync_to_async, async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer, AsyncWebsocketConsumer
import json

from channels.layers import get_channel_layer
from rest_framework.request import Request

from application import settings

send_dict = {}


# Structure du message à envoyer
def set_message(sender, msg_type, msg, refresh_unread=False):
    text = {
        'sender': sender,
        'contentType': msg_type,
        'content': msg,
        'refresh_unread': refresh_unread
    }
    return text


# Récupérer de manière asynchrone les utilisateurs cibles du centre de messages
@database_sync_to_async
def _get_message_center_instance(message_id):
    from dvadmin.system.models import MessageCenter
    _MessageCenter = MessageCenter.objects.filter(id=message_id).values_list('target_user', flat=True)
    if _MessageCenter:
        return _MessageCenter
    else:
        return []


@database_sync_to_async
def _get_message_unread(user_id):
    """Obtenir le nombre de messages non lus de l'utilisateur"""
    from dvadmin.system.models import MessageCenterTargetUser
    count = MessageCenterTargetUser.objects.filter(users=user_id, is_read=False).count()
    return count or 0


def request_data(scope):
    query_string = scope.get('query_string', b'').decode('utf-8')
    qs = urllib.parse.parse_qs(query_string)
    return qs


class DvadminWebSocket(AsyncJsonWebsocketConsumer):
    async def connect(self):
        try:
            import jwt
            self.service_uid = self.scope["url_route"]["kwargs"]["service_uid"]
            decoded_result = jwt.decode(self.service_uid, settings.SECRET_KEY, algorithms=["HS256"])
            if decoded_result:
                self.user_id = decoded_result.get('user_id')
                self.room_name = "user_" + str(self.user_id)
                # Lors de la réception d'une connexion, traitement à effectuer
                await self.channel_layer.group_add(
                    "dvadmin",
                    self.channel_name
                )
                await self.channel_layer.group_add(
                    self.room_name,
                    self.channel_name
                )
                await self.accept()
                # Pousser activement un message
                unread_count = await _get_message_unread(self.user_id)
                if unread_count == 0:
                    # Envoyer le succès de connexion
                    await self.send_json(set_message('system', 'SYSTEM', 'Connexion réussie'))
                else:
                    await self.send_json(
                        set_message('system', 'SYSTEM', "Veuillez consulter vos messages non lus~",
                                    refresh_unread=True))
            else:
                await self.close(code=4401)
        except jwt.InvalidTokenError:
            # Token expiré / signature invalide / malformé : refuser proprement
            await self.close(code=4401)
        except Exception:
            await self.close(code=1011)

    async def disconnect(self, close_code):
        # Quitter le groupe de discussion (room_name peut ne pas exister si connect a échoué)
        for group in (getattr(self, "room_name", None), "dvadmin"):
            if group:
                try:
                    await self.channel_layer.group_discard(group, self.channel_name)
                except Exception:
                    pass
        print("Connexion fermée")


class MegCenter(DvadminWebSocket):
    """
    Centre de messages
    """

    async def receive(self, text_data):
        # Recevoir les informations du client, la fonction que vous traitez
        text_data_json = json.loads(text_data)
        # message_id = text_data_json.get('message_id', None)
        # user_list = await _get_message_center_instance(message_id)
        # for send_user in user_list:
        #     await self.channel_layer.group_send(
        #         "user_" + str(send_user),
        #         {'type': 'push.message', 'json': text_data_json}
        #     )

    async def push_message(self, event):
        """Envoi du message"""
        message = event['json']
        await self.send(text_data=json.dumps(message))



def websocket_push(room_name,message):
    """
    Envoi actif
    @param room_name: Nom du groupe
    @param message: Contenu du message
    """
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        room_name,
        {
            "type": "push.message",
            "json": message
        }
    )
