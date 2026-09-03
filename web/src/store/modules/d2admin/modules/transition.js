// Définir le fichier
import setting from '@/setting.js'

export default {
  namespaced: true,
  state: {
    // Indique si l'animation de transition des pages est activée
    active: setting.transition.active
  },
  actions: {
    /**
     * @description Définir l'état d'activation
     * @param {Object} context
     * @param {Boolean} active nouvel état
     */
    async set ({ state, dispatch }, active) {
      // store Assignation du store
      state.active = active
      // Persistance
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'transition.active',
        value: state.active,
        user: true
      }, { root: true })
    },
    /**
     * Lire les paramètres d'animation de transition depuis la base de données
     * @param {Object} context
     */
    async load ({ state, dispatch }) {
      // store Assignation du store
      state.active = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'transition.active',
        defaultValue: setting.transition.active,
        user: true
      }, { root: true })
    }
  }
}
