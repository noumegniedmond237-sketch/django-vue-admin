import { request } from '@/api/service'
export default {
  namespaced: true,
  state: {
    // Messages non lus
    unread: 0
  },
  getters: {
    unread (state) {
      return state.unread
    }
  },
  actions: {
    /**
     * @description Ajouter une entrée de journal
     * @param {Object} context
     * @param {String} param message {String} information
     * @param {String} param type {String} type
     * @param {Object} payload meta {Object} informations jointes
     */
    async setUnread ({
      state,
      commit
    }, number) {
      if (number) {
        commit('set', number)
      } else {
        request({
          url: '/api/system/message_center/get_unread_msg/',
          method: 'get',
          params: {}
        }).then(res => {
          const { data } = res
          commit('set', data.count)
        })
      }
    }
  },
  mutations: {
    /**
     * Définir les messages non lus
     * @param state
     * @param number
     */
    async set (state, number) {
      state.unread = number
    }
  }
}
