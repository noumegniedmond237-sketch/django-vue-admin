import { request } from '@/api/service'

export const urlPrefix = '/api/init/settings/'

// Configuration système
export default {
  namespaced: true,
  state: {
    data: {}
  },
  actions: {
    /**
     * @description Demander la dernière configuration
     * @param {Object} context
     */
    async init ({ state, dispatch, commit }) {
      // Demander la configuration
      request({
        url: urlPrefix,
        method: 'get'
      }).then(async res => {
        // Assignation du store
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'settings.init',
          value: res.data,
          user: true
        }, { root: true })
        dispatch('load')
      })
    },
    /**
     * @description Charger la configuration locale
     * @param {Object} context
     */
    async load ({ state, dispatch, commit }) {
      // store Assignation du store
      const data = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'settings.init',
        defaultValue: {},
        user: true
      }, { root: true })
      commit('set', data)
    }
  },
  mutations: {
    /**
     * @description Récupérer la configuration
     * @param {Object} state state
     * @param {String} key active
     * @param {Object} value active
     */
    async get (state, key, value) {
      return state[key]
    },
    /**
     * @description Assigner la configuration système
     * @param {Object} state state
     * @param {Object} value active
     */
    async set (state, value) {
      state.data = value
      state.keepRecord = value['login.keep_record']
      return state.data
    }
  }
}
