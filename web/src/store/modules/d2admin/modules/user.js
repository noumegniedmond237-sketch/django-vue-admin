export default {
  namespaced: true,
  state: {
    // Informations utilisateur
    info: {}
  },
  actions: {
    /**
     * @description Définir les données utilisateur
     * @param {Object} context
     * @param {*} info info
     */
    async set ({ state, dispatch }, info) {
      // store Assignation du store
      state.info = info
      // Persistance
      // await dispatch('d2admin/db/set', {
      //   dbName: 'sys',
      //   path: 'user.info',
      //   value: info,
      //   user: true
      // }, { root: true })
    },
    /**
     * @description Récupérer les données utilisateur depuis la base de données
     * @param {Object} context
     */
    async load ({ state, dispatch }) {
      // store Assignation du store
      // state.info = await dispatch('d2admin/db/get', {
      //   dbName: 'sys',
      //   path: 'user.info',
      //   defaultValue: {},
      //   user: true
      // }, { root: true })
    }
  }
}
