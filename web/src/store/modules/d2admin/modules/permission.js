import { request } from '@/api/service'
const urlPrefix = '/api/system/menu_button/get_btn_permission/'
export default {
  namespaced: true,
  state: {
    // Messages non lus
    data: []
  },
  getters: {
    permissionList (state) {
      return state.data
    }
  },
  actions: {
    /**
     * @description Récupérer les données
     * @param {Object} context
     * @param {String} param message {String} information
     * @param {String} param type {String} type
     * @param {Object} payload meta {Object} informations jointes
     */
    async load ({
      state,
      commit
    }) {
      request({
        url: urlPrefix,
        method: 'get',
        params: {}
      }).then(res => {
        const { data } = res
        commit('set', data)
      })
    }
  },
  mutations: {
    /**
     * Définir les données de permission
     * @param state
     * @param number
     */
    async set (state, data) {
      state.data = data
    }
  }
}
