import axios from 'axios'
import Adapter from 'axios-mock-adapter'
import { get } from 'lodash'
import util from '@/libs/util'
import { dataNotFound, errorCreate, errorLog } from './tools'
import router from '@/router'
import qs from 'qs'

/**
 * @description Création de l'instance de requêtes
 */

export function getErrorMessage (msg) {
  if (typeof msg === 'string') {
    return msg
  }
  if (typeof msg === 'object') {
    if (msg.code === 'token_not_valid') {
      util.cookies.remove('token')
      util.cookies.remove('uuid')
      router.push({ path: '/login' })
      router.go(0)
      return 'Session expirée, veuillez vous reconnecter !'
    }
    if (msg.code === 'user_not_found') {
      util.cookies.remove('token')
      util.cookies.remove('uuid')
      router.push({ path: '/login' })
      router.go(0)
      return 'Compte utilisateur introuvable, veuillez vous reconnecter !'
    }
    return Object.values(msg)
  }
  if (Object.prototype.toString.call(msg).slice(8, -1) === 'Array') {
    return msg
  }
  return msg
}

function createService () {
  const service = axios.create({
    baseURL: util.baseURL(),
    timeout: 20000,
    paramsSerializer: (params) => qs.stringify(params, { indices: false })
  })
  service.interceptors.request.use(
    config => config,
    error => {
      console.log(error)
      return Promise.reject(error)
    }
  )
  service.interceptors.response.use(
    async response => {
      let dataAxios = response.data || null
      if (response.headers['content-disposition']) {
        dataAxios = response
      }
      const { code } = dataAxios
      if (code === undefined) {
        return dataAxios
      } else {
        switch (code) {
          case 2000:
            return dataAxios
          case 401:
            if (response.config.url === 'api/login/') {
              errorCreate(`${getErrorMessage(dataAxios.msg)}`)
              break
            }
            var res = await refreshTken()
            var config = response.config
            util.cookies.set('token', res.data.access)
            config.headers.Authorization = 'JWT ' + res.data.access
            config.__retryCount = config.__retryCount || 0
            if (config.__retryCount >= config.retry) {
              util.cookies.remove('token')
              util.cookies.remove('uuid')
              router.push({ path: '/login' })
              errorCreate('Session expirée, veuillez vous reconnecter.')
              break
            }
            config.__retryCount += 1
            return service(config)
          case 404:
            dataNotFound(`${dataAxios.msg}`)
            break
          case 4000:
            errorCreate(`${getErrorMessage(dataAxios.msg)}`)
            break
          case 400:
            errorCreate(`${dataAxios.msg}`)
            break
          default:
            errorCreate(`${dataAxios.msg}: ${response.config.url}`)
            break
        }
      }
    },
    error => {
      const status = get(error, 'response.status')
      switch (status) {
        case 400:
          error.message = 'Requête incorrecte'
          break
        case 401:
          util.cookies.remove('token')
          util.cookies.remove('uuid')
          util.cookies.remove('refresh')
          router.push({ path: '/login' })
          error.message = 'Session expirée, veuillez vous reconnecter.'
          break
        case 403:
          error.message = 'Accès refusé'
          break
        case 404:
          error.message = `Ressource non trouvée : ${error.response.config.url}`
          break
        case 408:
          error.message = 'Délai d\'attente de la requête dépassé'
          break
        case 500:
          error.message = 'Erreur interne du serveur'
          break
        case 501:
          error.message = 'Service non implémenté'
          break
        case 502:
          error.message = 'Passerelle incorrecte'
          break
        case 503:
          error.message = 'Service temporairement indisponible'
          break
        case 504:
          error.message = 'Délai d\'attente de la passerelle dépassé'
          break
        case 505:
          error.message = 'Version HTTP non supportée'
          break
        default:
          break
      }
      errorLog(error)
      return Promise.reject(error)
    }
  )
  return service
}

function createRequestFunction (service) {
  return function (config) {
    const token = util.cookies.get('token')
    var params = get(config, 'params', {})
    for (const key of Object.keys(params)) {
      if (String(params[key]) === 'true') {
        params[key] = 1
      }
      if (String(params[key]) === 'false') {
        params[key] = 0
      }
    }
    const configDefault = {
      headers: {
        Authorization: 'JWT ' + token,
        'Content-Type': get(config, 'headers.Content-Type', 'application/json')
      },
      timeout: 60000,
      baseURL: util.baseURL(),
      data: {},
      params: params,
      retry: 3,
      retryDelay: 1000
    }
    return service(Object.assign(configDefault, config))
  }
}

export const service = createService()
export const request = createRequestFunction(service)

export const serviceForMock = createService()
export const requestForMock = createRequestFunction(serviceForMock)

export const mock = new Adapter(serviceForMock)

const refreshTken = function () {
  const refresh = util.cookies.get('refresh')
  return request({
    url: 'token/refresh/',
    method: 'post',
    data: {
      refresh: refresh
    }
  })
}

export const downloadFile = function ({
  url,
  params,
  method,
  filename = 'export'
}) {
  request({
    url: url,
    method: method,
    params: params,
    responseType: 'blob'
  }).then(res => {
    const disposition = res.headers['content-disposition']
    let fileName = `${filename}.xlsx`
    if (disposition && disposition.includes('=')) {
      fileName = window.decodeURI(disposition.split('=')[1])
    }
    if (res) {
      const blob = new Blob([res.data], { type: 'charset=utf-8' })
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    }
  })
}
