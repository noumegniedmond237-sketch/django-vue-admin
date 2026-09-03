import { get } from 'lodash'
import setting from '@/setting.js'

export default {
  namespaced: true,
  state: {
    // Thème
    list: get(setting, 'theme.list', []),
    // Thème actif (un nom, pas un objet)
    activeName: get(setting, 'theme.list[0].name', 'd2')
  },
  getters: {
    /**
     * @description Retourner les informations du thème courant (toutes les données du thème actif, pas seulement un nom) ce n'est pas un nom mais toutes les données du thème actif
     * @param {Object} state state
     */
    activeSetting (state) {
      return state.list.find(theme => theme.name === state.activeName)
    }
  },
  actions: {
    /**
     * @description Activer un thème
     * @param {String} themeValue nom du thème à activer
     */
    async set ({ state, commit, dispatch }, themeName) {
      // Vérifier si ce thème existe dans la liste des thèmes
      state.activeName = state.list.find(e => e.name === themeName) ? themeName : state.list[0].name
      // Appliquer le thème de vuex au DOM
      commit('dom')
      // Persistance
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'theme.activeName',
        value: state.activeName,
        user: true
      }, { root: true })
    },
    /**
     * @description Charger les paramètres de thème depuis les données persistées     * @param {Object} context
     */
    async load ({ state, commit, dispatch }) {
      // store Assignation du store
      const activeName = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'theme.activeName',
        defaultValue: state.list[0].name,
        user: true
      }, { root: true })
      // Vérifier si ce thème existe dans la liste des thèmes
      if (state.list.find(e => e.name === activeName)) {
        state.activeName = activeName
      } else {
        state.activeName = state.list[0].name
        // Persistance
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'theme.activeName',
          value: state.activeName,
          user: true
        }, { root: true })
      }
      // Appliquer le thème de vuex au DOM
      commit('dom')
    }
  },
  mutations: {
    /**
     * @description Appliquer le thème de vuex au DOM
     * @param {Object} state state
     */
    dom (state) {
      document.body.className = `theme-${state.activeName}`
    }
  }
}
