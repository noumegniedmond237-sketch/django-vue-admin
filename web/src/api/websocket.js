import ElementUI from 'element-ui'
import util from '@/libs/util'
import store from '@/store'
function initWebSocket (e) {
  const token = util.cookies.get('token')
  if (token) {
    const wsUri = util.wsBaseURL() + 'ws/' + token + '/'
    this.socket = new WebSocket(wsUri)// Ici, this désigne vuethis
    this.socket.onerror = webSocketOnError
    this.socket.onmessage = webSocketOnMessage
    this.socket.onclose = closeWebsocket
  }
}

function webSocketOnError (e) {
  ElementUI.Notification({
    title: '',
    message: 'WebSocketErreur de connexion WebSocket' + JSON.stringify(e),
    type: 'error',
    position: 'bottom-right',
    duration: 3000
  })
}

/**
 * Recevoir un message
 * @param e
 * @returns {any}
 */
function webSocketOnMessage (e) {
  const data = JSON.parse(e.data)
  const { refreshUnread, systemConfig } = data
  if (refreshUnread) {
    // Mettre à jour le nombre de notifications
    store.dispatch('d2admin/messagecenter/setUnread')
  }
  if (systemConfig) {
    // Mettre à jour la configuration système
    this.$store.dispatch('d2admin/settings/load')
  }
  if (data.contentType === 'SYSTEM') {
    ElementUI.Notification({
      title: 'Message système',
      message: data.content,
      type: 'success',
      position: 'bottom-right',
      duration: 3000
    })
  } else if (data.contentType === 'ERROR') {
    ElementUI.Notification({
      title: '',
      message: data.content,
      type: 'error',
      position: 'bottom-right',
      duration: 0
    })
  } else if (data.contentType === 'INFO') {
    ElementUI.Notification({
      title: 'Rappel amical',
      message: data.content,
      type: 'success',
      position: 'bottom-right',
      duration: 0
    })
  } else {
    ElementUI.Notification({
      title: 'Rappel amical',
      message: data.content,
      type: 'info',
      position: 'bottom-right',
      duration: 3000
    })
  }
}
// Fermer websocketwebsiocket
function closeWebsocket () {
  console.log('Connexion fermée...')
  ElementUI.Notification({
    title: 'websocket',
    message: 'Connexion fermée...',
    type: 'danger',
    position: 'bottom-right',
    duration: 3000
  })
}

/**
 * Envoyer un message
 * @param message
 */
function webSocketSend (message) {
  this.socket.send(JSON.stringify(message))
}
export default {
  initWebSocket, closeWebsocket, webSocketSend
}
