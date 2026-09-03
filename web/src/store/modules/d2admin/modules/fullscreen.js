import screenfull from 'screenfull'

export default {
  namespaced: true,
  state: {
    // Activation du plein écran
    active: false
  },
  actions: {
    /**
     * @description Initialiser les écouteurs
     * @param {Object} context
     */
    listen ({ commit }) {
      if (screenfull.isEnabled) {
        screenfull.on('change', () => {
          if (!screenfull.isFullscreen) commit('set', false)
        })
      }
    },
    /**
     * @description Basculer en plein écran
     * @param {Object} context
     */
    toggle ({ commit }) {
      if (screenfull.isFullscreen) {
        screenfull.exit()
        commit('set', false)
      } else {
        screenfull.request()
        commit('set', true)
      }
    }
  },
  mutations: {
    /**
     * @description Définir les informations utilisateur de vuex store l'état plein écran dans le store
     * @param {Object} state state
     * @param {Boolean} active active
     */
    set (state, active) {
      state.active = active
    }
  }
}
