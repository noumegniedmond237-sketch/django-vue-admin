import Vue from 'vue'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    // taille
    value: '' // medium small mini
  },
  actions: {
    /**
     * @description Appliquer les paramètres courants à element
     * @param {Object} context
     * @param {Boolean} refresh indique s'il faut actualiser la page après le paramétrage
     */
    apply ({ state, commit }, refresh) {
      Vue.prototype.$ELEMENT.size = state.value
      if (refresh) {
        commit('d2admin/page/keepAliveClean', null, { root: true })
        router.replace('/refresh')
      }
    },
    /**
     * @description Confirmer le chargement des paramètres de taille des composants https://github.com/d2-projects/d2-admin/issues/198
     * @param {Object} context
     */
    isLoaded ({ state }) {
      if (state.value) return Promise.resolve()
      return new Promise(resolve => {
        const timer = setInterval(() => {
          if (state.value) resolve(clearInterval(timer))
        }, 10)
      })
    },
    /**
     * @description Définir la taille
     * @param {Object} context
     * @param {String} size taille
     */
    async set ({ state, dispatch }, size) {
      // store Assignation du store
      state.value = size
      // Appliquer
      dispatch('apply', true)
      // Persistance
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'size.value',
        value: state.value,
        user: true
      }, { root: true })
    },
    /**
     * @description Lire les paramètres de taille depuis les données persistées
     * @param {Object} context
     */
    async load ({ state, dispatch }) {
      // store Assignation du store
      state.value = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'size.value',
        defaultValue: 'default',
        user: true
      }, { root: true })
      // Appliquer
      dispatch('apply')
    }
  }
}
