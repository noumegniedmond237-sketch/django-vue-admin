import { cloneDeep } from 'lodash'
import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'

export default {
  namespaced: true,
  state: {
    // Couleur
    value: process.env.VUE_APP_ELEMENT_COLOR
  },
  actions: {
    /**
     * @description Définir la couleur
     * @param {Object} context
     * @param {String} color taille
     */
    async set ({ state, dispatch, commit }, color) {
      // Enregistrer la valeur précédente
      const old = state.value
      // store Assignation du store
      state.value = color || process.env.VUE_APP_ELEMENT_COLOR
      // Persistance
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'color.value',
        value: state.value,
        user: true
      }, { root: true })
      // Appliquer
      commit('apply', {
        oldColor: old,
        newColor: state.value
      })
    },
    /**
     * @description Lire les paramètres de couleur depuis les données persistées
     * @param {Object} context
     */
    async load ({ state, dispatch, commit }) {
      // Enregistrer la valeur précédente
      const old = state.value
      // store Assignation du store
      state.value = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'color.value',
        defaultValue: process.env.VUE_APP_ELEMENT_COLOR,
        user: true
      }, { root: true })
      // Appliquer
      commit('apply', {
        oldColor: old,
        newColor: state.value
      })
    }
  },
  mutations: {
    /**
     * @description Assigner vuex les paramètres de couleur du thème de vuex au système
     * @param {Object} context
     * @param {Object} payload oldColor {String} ancienne couleur
     * @param {Object} payload newColor {String} nouvelle couleur
     */
    apply (state, { oldColor, newColor }) {
      var options = {
        oldColors: cloneDeep(forElementUI.getElementUISeries(oldColor)),
        newColors: cloneDeep(forElementUI.getElementUISeries(newColor))
      }
      client.changer.changeColor(options)
    }
  }
}
