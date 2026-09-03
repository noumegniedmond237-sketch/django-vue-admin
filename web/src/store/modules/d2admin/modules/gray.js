export default {
  namespaced: true,
  state: {
    // Niveaux de gris
    active: false
  },
  mutations: {
    /**
     * @description Basculer le mode niveaux de gris
     * @param {Object} state state
     */
    toggle (state) {
      state.active = !state.active
    },
    /**
     * @description Définir le mode niveaux de gris
     * @param {Object} state state
     * @param {Boolean} active active
     */
    set (state, active) {
      state.active = active
    }
  }
}
