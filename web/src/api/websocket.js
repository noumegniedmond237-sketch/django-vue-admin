import ElementUI from 'element-ui'
import util from '@/libs/util'
import store from '@/store'

// État du module (pas de `this` : ces fonctions sont appelées sans récepteur Vue)
const wsState = {
  socket: null,
  url: null,
  reconnectTimer: null,
  reconnectAttempts: 0,
  maxReconnectDelay: 30000,
  manualClose: false
}

function notifyError (message) {
  ElementUI.Notification({
    title: 'WebSocket',
    message,
    type: 'error',
    position: 'bottom-right',
    duration: 5000
  })
}

function reconnectDelay () {
  // Backoff exponentiel plafonné : 1s, 2s, 4s, ... max 30s
  return Math.min(1000 * Math.pow(2, wsState.reconnectAttempts), wsState.maxReconnectDelay)
}

function scheduleReconnect () {
  if (wsState.manualClose) return
  if (wsState.reconnectTimer) return
  const delay = reconnectDelay()
  wsState.reconnectAttempts += 1
  wsState.reconnectTimer = setTimeout(() => {
    wsState.reconnectTimer = null
    connect()
  }, delay)
}

function connect () {
  const token = util.cookies.get('token')
  if (!token) return
  // Éviter les doubles connexions
  if (wsState.socket && (wsState.socket.readyState === WebSocket.OPEN || wsState.socket.readyState === WebSocket.CONNECTING)) {
    return
  }
  wsState.url = util.wsBaseURL() + 'ws/' + token + '/'
  try {
    wsState.socket = new WebSocket(wsState.url)
  } catch (e) {
    scheduleReconnect()
    return
  }
  wsState.socket.onerror = webSocketOnError
  wsState.socket.onmessage = webSocketOnMessage
  wsState.socket.onclose = onClose
}

function initWebSocket () {
  wsState.manualClose = false
  wsState.reconnectAttempts = 0
  connect()
}

function webSocketOnError () {
  // Erreur de handshake/réseau : on tente une reconnexion silencieuse
  // (le détail technique part en console, pas en notification brute)
  if (process.env.NODE_ENV === 'development') {
    console.warn('[websocket] erreur de connexion, nouvelle tentative...')
  }
}

function onClose (event) {
  wsState.socket = null
  if (wsState.manualClose) {
    wsState.manualClose = false
    return
  }
  // Fermeture inattendue (ex. 4401 token expiré/invalide, 1011 erreur serveur)
  if (event && event.code === 4401) {
    // Auth refusée : inutile de spammer, l'utilisateur sera redirigé au prochain 401 HTTP
    if (process.env.NODE_ENV === 'development') {
      console.warn('[websocket] connexion refusée (auth), reconnexion suspendue')
    }
    return
  }
  scheduleReconnect()
}

/**
 * 接收消息
 * @param e
 * @returns {any}
 */
function webSocketOnMessage (e) {
  let data
  try {
    data = JSON.parse(e.data)
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[websocket] message non-JSON ignoré', e.data)
    }
    return
  }
  const { refreshUnread, systemConfig } = data
  if (refreshUnread) {
    // 更新消息通知条数
    store.dispatch('d2admin/messagecenter/setUnread')
  }
  if (systemConfig) {
    // 更新系统配置 (store importé directement : `this` n'est pas une instance Vue ici)
    store.dispatch('d2admin/settings/load')
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
    notifyError(data.content)
  } else if (data.contentType === 'INFO') {
    ElementUI.Notification({
      title: 'Information',
      message: data.content,
      type: 'success',
      position: 'bottom-right',
      duration: 0
    })
  } else if (data.content) {
    ElementUI.Notification({
      title: 'Information',
      message: data.content,
      type: 'info',
      position: 'bottom-right',
      duration: 3000
    })
  }
}

// 关闭websocket (fermeture volontaire : pas de popup, pas de reconnexion)
function closeWebsocket () {
  wsState.manualClose = true
  wsState.reconnectAttempts = 0
  if (wsState.reconnectTimer) {
    clearTimeout(wsState.reconnectTimer)
    wsState.reconnectTimer = null
  }
  if (wsState.socket) {
    try {
      wsState.socket.close()
    } catch (e) {
      // socket déjà fermé
    }
    wsState.socket = null
  }
}

/**
 * 发送消息
 * @param message
 */
function webSocketSend (message) {
  if (wsState.socket && wsState.socket.readyState === WebSocket.OPEN) {
    wsState.socket.send(JSON.stringify(message))
  } else if (process.env.NODE_ENV === 'development') {
    console.warn('[websocket] envoi impossible : socket non connecté')
  }
}
export default {
  initWebSocket, closeWebsocket, webSocketSend
}
