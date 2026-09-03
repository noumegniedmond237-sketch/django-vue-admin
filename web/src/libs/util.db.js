import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import util from '@/libs/util'
import { cloneDeep } from 'lodash'

const adapter = new LocalStorage(`d2admin-${process.env.VUE_APP_VERSION}`)
const db = low(adapter)

db
  .defaults({
    sys: {},
    database: {}
  })
  .write()

export default db

/**
 * @description Vérifier si le chemin existe, sinon l'initialiser l'initialiser s'il n'existe pas
 * @param {Object} payload dbName {String} nom de la base de données
 * @param {Object} payload path {String} chemin
 * @param {Object} payload user {Boolean} distinguer les utilisateurs
 * @param {Object} payload validator {Function} hook de validation des données (retourne true si valide) retourne true
 * @param {Object} payload defaultValue {*} valeur par défaut initiale
 * @returns {String} Chemin utilisable directement
 */
export function pathInit ({
  dbName = 'database',
  path = '',
  user = true,
  validator = () => true,
  defaultValue = ''
}) {
  const uuid = util.cookies.get('uuid') || 'ghost-uuid'
  const currentPath = `${dbName}.${user ? `user.${uuid}` : 'public'}${path ? `.${path}` : ''}`
  const value = db.get(currentPath).value()
  if (!(value !== undefined && validator(value))) {
    db
      .set(currentPath, defaultValue)
      .write()
  }
  return currentPath
}

/**
 * @description Stocker les données à l'emplacement indiqué | le chemin est initialisé automatiquement s'il n'existe pas
 * @description Équivalent à lire dbName.path = value
 * @param {Object} payload dbName {String} nom de la base de données
 * @param {Object} payload path {String} chemin de stockage
 * @param {Object} payload value {*} valeur à stocker
 * @param {Object} payload user {Boolean} indique s'il faut distinguer les utilisateurs
 */
export function dbSet ({
  dbName = 'database',
  path = '',
  value = '',
  user = false
}) {
  db.set(pathInit({
    dbName,
    path,
    user
  }), value).write()
}

/**
 * @description Récupérer les données
 * @description Équivalent à lire dbName.path || defaultValue
 * @param {Object} payload dbName {String} nom de la base de données
 * @param {Object} payload path {String} chemin de stockage
 * @param {Object} payload defaultValue {*} valeur par défaut en cas d'échec de lecture
 * @param {Object} payload user {Boolean} indique s'il faut distinguer les utilisateurs
 */
export function dbGet ({
  dbName = 'database',
  path = '',
  defaultValue = '',
  user = false
}) {
  return cloneDeep(db.get(pathInit({
    dbName,
    path,
    user,
    defaultValue
  })).value())
}

/**
 * @description Obtenir l'objet de stockage
 * @param {Object} payload user {Boolean} indique s'il faut distinguer les utilisateurs
 */
export function database ({
  dbName = 'database',
  path = '',
  user = false,
  validator = () => true,
  defaultValue = ''
} = {}) {
  return db.get(pathInit({
    dbName, path, user, validator, defaultValue
  }))
}
