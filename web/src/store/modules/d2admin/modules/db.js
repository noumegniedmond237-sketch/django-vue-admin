import router from '@/router'
import { cloneDeep } from 'lodash'
import { database as getDatabase, dbGet, dbSet } from '@/libs/util.db'

export default {
  namespaced: true,
  actions: {
    /**
     * @description Stocker les données à l'emplacement indiqué | le chemin est initialisé automatiquement s'il n'existe pas
     * @description Équivalent à lire dbName.path = value
     * @param {Object} context
     * @param {Object} payload dbName {String} nom de la base de données
     * @param {Object} payload path {String} chemin de stockage
     * @param {Object} payload value {*} valeur à stocker
     * @param {Object} payload user {Boolean} indique s'il faut distinguer les utilisateurs
     */
    set (context, {
      dbName = 'database',
      path = '',
      value = '',
      user = false
    }) {
      dbSet({ dbName, path, value, user })
    },
    /**
     * @description Récupérer les données
     * @description Équivalent à lire dbName.path || defaultValue
     * @param {Object} context
     * @param {Object} payload dbName {String} nom de la base de données
     * @param {Object} payload path {String} chemin de stockage
     * @param {Object} payload defaultValue {*} valeur par défaut en cas d'échec de lecture
     * @param {Object} payload user {Boolean} indique s'il faut distinguer les utilisateurs
     */
    get (context, {
      dbName = 'database',
      path = '',
      defaultValue = '',
      user = false
    }) {
      return dbGet({ dbName, path, defaultValue, user })
    },
    /**
     * @description Obtenir l'objet de stockage
     * @param {Object} context
     * @param {Object} payload user {Boolean} indique s'il faut distinguer les utilisateurs
     */
    database (context, {
      user = false
    } = {}) {
      return getDatabase({
        user,
        defaultValue: {}
      })
    },
    /**
     * @description Vider l'objet de stockage
     * @param {Object} context
     * @param {Object} payload user {Boolean} indique s'il faut distinguer les utilisateurs
     */
    databaseClear (context, {
      user = false
    } = {}) {
      return getDatabase({
        user,
        validator: () => false,
        defaultValue: {}
      })
    },
    /**
     * @description Obtenir l'objet de stockage [ distinguer les pages ]
     * @param {Object} context
     * @param {Object} payload basis {String} critère de distinction des pages [ name | path | fullPath ]
     * @param {Object} payload user {Boolean} indique s'il faut distinguer les utilisateurs
     */
    databasePage (context, {
      basis = 'fullPath',
      user = false
    } = {}) {
      return getDatabase({
        path: `$page.${router.app.$route[basis]}`,
        user,
        defaultValue: {}
      })
    },
    /**
     * @description Vider l'objet de stockage [ distinguer les pages ]
     * @param {Object} context
     * @param {Object} payload basis {String} critère de distinction des pages [ name | path | fullPath ]
     * @param {Object} payload user {Boolean} indique s'il faut distinguer les utilisateurs
     */
    databasePageClear (context, {
      basis = 'fullPath',
      user = false
    } = {}) {
      return getDatabase({
        path: `$page.${router.app.$route[basis]}`,
        user,
        validator: () => false,
        defaultValue: {}
      })
    },
    /**
     * @description Persister rapidement les données courantes de la page ( $data ) Persistance
     * @param {Object} context
     * @param {Object} payload instance {Object} vue instance de vue
     * @param {Object} payload basis {String} critère de distinction des pages [ name | path | fullPath ]
     * @param {Object} payload user {Boolean} indique s'il faut distinguer les utilisateurs
     */
    pageSet (context, {
      instance,
      basis = 'fullPath',
      user = false
    }) {
      return getDatabase({
        path: `$page.${router.app.$route[basis]}.$data`,
        user,
        validator: () => false,
        defaultValue: cloneDeep(instance.$data)
      })
    },
    /**
     * @description Récupérer rapidement les données persistées de la page
     * @param {Object} context
     * @param {Object} payload instance {Object} vue instance de vue
     * @param {Object} payload basis {String} critère de distinction des pages [ name | path | fullPath ]
     * @param {Object} payload user {Boolean} indique s'il faut distinguer les utilisateurs
     */
    pageGet (context, {
      instance,
      basis = 'fullPath',
      user = false
    }) {
      return dbGet({
        path: `$page.${router.app.$route[basis]}.$data`,
        user,
        defaultValue: cloneDeep(instance.$data)
      })
    },
    /**
     * @description Vider les instantanés de page
     * @param {Object} context
     * @param {Object} payload basis {String} critère de distinction des pages [ name | path | fullPath ]
     * @param {Object} payload user {Boolean} indique s'il faut distinguer les utilisateurs
     */
    pageClear (context, {
      basis = 'fullPath',
      user = false
    }) {
      return getDatabase({
        path: `$page.${router.app.$route[basis]}.$data`,
        user,
        validator: () => false,
        defaultValue: {}
      })
    }
  }
}
