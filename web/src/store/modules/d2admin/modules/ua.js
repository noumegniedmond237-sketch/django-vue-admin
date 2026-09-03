import UaParser from 'ua-parser-js'

export default {
  namespaced: true,
  state: {
    // UA de l'utilisateur UA
    data: {}
  },
  mutations: {
    /**
     * @description Enregistrer UA
     * @param {Object} state state
     */
    get (state) {
      state.data = new UaParser().getResult()
    }
  }
}
