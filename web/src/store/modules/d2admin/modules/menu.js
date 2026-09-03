// Définir le fichier
import setting from '@/setting.js'

export default {
  namespaced: true,
  state: {
    // Menu de la barre supérieure
    header: [],
    // Menu latéral
    aside: [],
    // Réduire la barre latérale
    asideCollapse: setting.menu.asideCollapse,
    // Animation de repli de la barre latérale
    asideTransition: setting.menu.asideTransition
  },
  actions: {
    /**
     * Définir l'ouverture ou la fermeture de la barre latérale
     * @param {Object} context
     * @param {Boolean} collapse is collapse
     */
    async asideCollapseSet ({ state, dispatch }, collapse) {
      // store Assignation du store
      state.asideCollapse = collapse
      // Persistance
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'menu.asideCollapse',
        value: state.asideCollapse,
        user: true
      }, { root: true })
    },
    /**
     * Basculer l'ouverture / la fermeture de la barre latérale
     * @param {Object} context
     */
    async asideCollapseToggle ({ state, dispatch }) {
      // store Assignation du store
      state.asideCollapse = !state.asideCollapse
      // Persistance
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'menu.asideCollapse',
        value: state.asideCollapse,
        user: true
      }, { root: true })
    },
    /**
     * Définir l'animation de repli de la barre latérale
     * @param {Object} context
     * @param {Boolean} transition is transition
     */
    async asideTransitionSet ({ state, dispatch }, transition) {
      // store Assignation du store
      state.asideTransition = transition
      // Persistance
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'menu.asideTransition',
        value: state.asideTransition,
        user: true
      }, { root: true })
    },
    /**
     * Basculer l'animation de repli de la barre latérale
     * @param {Object} context
     */
    async asideTransitionToggle ({ state, dispatch }) {
      // store Assignation du store
      state.asideTransition = !state.asideTransition
      // Persistance
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'menu.asideTransition',
        value: state.asideTransition,
        user: true
      }, { root: true })
    },
    /**
     * Charger les paramètres de la barre latérale depuis les données persistées
     * @param {Object} context
     */
    async asideLoad ({ state, dispatch }) {
      // store Assignation du store
      const menu = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'menu',
        defaultValue: setting.menu,
        user: true
      }, { root: true })
      state.asideCollapse = menu.asideCollapse !== undefined ? menu.asideCollapse : setting.menu.asideCollapse
      state.asideTransition = menu.asideTransition !== undefined ? menu.asideTransition : setting.menu.asideTransition
    }
  },
  mutations: {
    /**
     * @description Définir le menu de la barre supérieure
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    headerSet (state, menu) {
      // store Assignation du store
      state.header = menu
    },
    /**
     * @description Définir le menu latéral
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    asideSet (state, menu) {
      // store Assignation du store
      state.aside = menu
    }
  }
}
