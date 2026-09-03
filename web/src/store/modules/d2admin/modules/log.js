import dayjs from 'dayjs'
import { get } from 'lodash'
import util from '@/libs/util.js'

export default {
  namespaced: true,
  state: {
    // Journaux d'erreur
    // + Propriétés d'une entrée de journal
    //   - message obligatoire message du journal
    //   - type facultatif type success | warning | info(Colonnes par défaut : showForm = afficher dans le formulaire, showTable = afficher dans le tableau) | danger
    //   - time obligatoire heure d'enregistrement du journal
    //   - meta facultatif autres informations jointes
    log: []
  },
  getters: {
    /**
     * @description Retourner le nombre de journaux existants log (all)
     * @param {*} state vuex state
     */
    length (state) {
      return state.log.length
    },
    /**
     * @description Retourner le nombre de journaux existants log (error)
     * @param {*} state vuex state
     */
    lengthError (state) {
      return state.log.filter(log => log.type === 'danger').length
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
    push ({ rootState, commit }, { message, type = 'info', meta }) {
      commit('push', {
        message,
        type,
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        meta: {
          // Informations de l'utilisateur courant
          user: rootState.d2admin.user.info,
          // UUID de l'utilisateur courant
          uuid: util.cookies.get('uuid'),
          // token courant
          token: util.cookies.get('token'),
          // Adresse courante
          url: get(window, 'location.href', ''),
          // Paramètres utilisateur
          ...meta
        }
      })
    }
  },
  mutations: {
    /**
     * @description Ajouter un journal
     * @param {Object} state state
     * @param {Object} log data
     */
    push (state, log) {
      state.log.push(log)
    },
    /**
     * @description Vider les journaux
     * @param {Object} state state
     */
    clean (state) {
      // store Assignation du store
      state.log = []
    }
  }
}
