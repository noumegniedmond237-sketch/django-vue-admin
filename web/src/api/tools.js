import { Message } from 'element-ui'
import store from '@/store'
import util from '@/libs/util'

/**
 * @description Analyse sécurisée d'une chaîne JSON
 */
export function parse (jsonString = '{}', defaultValue = {}) {
  let result = defaultValue
  try {
    result = JSON.parse(jsonString)
  } catch (error) {
    console.log(error)
  }
  return result
}

/**
 * @description Réponse d'API
 */
export function response (data = {}, msg = '', code = 0) {
  return [
    200,
    { code, msg, data }
  ]
}

/**
 * @description Réponse de succès
 */
export function responseSuccess (data = {}, msg = 'Succès') {
  return response(data, msg)
}

/**
 * @description Réponse d'erreur
 */
export function responseError (data = {}, msg = 'Échec de la requête', code = 500) {
  return response(data, msg, code)
}

/**
 * @description Enregistrement et affichage des erreurs
 */
export function errorLog (error) {
  store.dispatch('d2admin/log/push', {
    message: 'Erreur de requête réseau',
    type: 'danger',
    meta: {
      error
    }
  })
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(error)
  }
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
}

/**
 * @description Création d'une erreur
 */
export function errorCreate (msg) {
  const error = new Error(msg)
  errorLog(error)
  throw error
}

/**
 * @description Message de données introuvables (404)
 */
export function dataNotFound (msg) {
  Message({
    message: msg,
    type: 'info',
    duration: 5 * 1000
  })
}

/**
 * @description Message de succès
 */
export function successMsg (msg) {
  Message({
    message: msg,
    type: 'success',
    duration: 5 * 1000
  })
}
