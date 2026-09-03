import setting from '@/setting.js'

export default {
  namespaced: true,
  state: {
    // État d'activation du panneau de recherche
    active: false,
    // Raccourcis clavier
    hotkey: {
      open: setting.hotkey.search.open,
      close: setting.hotkey.search.close
    },
    // Toutes les pages interrogeables
    pool: []
  },
  mutations: {
    /**
     * @description Basculer l'état actif
     * @param {Object} state state
     */
    toggle (state) {
      state.active = !state.active
    },
    /**
     * @description Définir le mode actif
     * @param {Object} state state
     * @param {Boolean} active active
     */
    set (state, active) {
      state.active = active
    },
    /**
     * @description Initialisation
     * @param {Object} state state
     * @param {Array} menu menu
     */
    init (state, menu) {
      const pool = []
      const push = function (menu, titlePrefix = []) {
        menu.forEach(m => {
          if (m.children) {
            push(m.children, [...titlePrefix, m.title])
          } else {
            pool.push({
              ...m,
              fullTitle: [...titlePrefix, m.title].join(' / ')
            })
          }
        })
      }
      push(menu)
      state.pool = pool
    }
  }
}
