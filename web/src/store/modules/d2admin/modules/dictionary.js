import { request } from '@/api/service'

export const urlPrefix = '/api/init/dictionary/'
export const BUTTON_VALUE_TO_COLOR_MAPPING = {
  1: 'success',
  true: 'success',
  0: 'danger',
  false: 'danger',
  Search: 'warning', // Rechercher
  Update: 'primary', // Modifier
  Create: 'success', // Ajouter
  Retrieve: 'info', // Détail (singleton)
  Delete: 'danger' // Supprimer
}

export function getButtonSettings (objectSettings) {
  return objectSettings.map(item => {
    return {
      label: item.label,
      value: item.value,
      color: item.color || BUTTON_VALUE_TO_COLOR_MAPPING[item.value]
    }
  })
}

// Configuration système
export default {
  namespaced: true,
  state: {
    data: {} // Collection des valeurs du dictionnaire
  },
  actions: {
    /**
     * @description Charger la configuration locale
     * @param {Object} context
     * @param {String} key
     */
    async load ({ state, dispatch, commit }, key = 'all') {
      const query = { dictionary_key: key }
      request({
        url: urlPrefix,
        params: query,
        method: 'get'
      }).then(async res => {
        // store Assignation du store
        var newData = {}
        if (key === 'all') {
          res.data.data.map(data => {
            data.children.map((children, index) => {
              switch (children.type) {
                case 1:
                  children.value = Number(children.value)
                  break
                case 6:
                  children.value = children.value === 'true'
                  break
              }
            })
            newData[data.value] = getButtonSettings(data.children)
          })
          state.data = newData
        } else {
          state.data = res.data.data[key]
        }
      })
    }
    /**
     * @description Récupérer la configuration
     * @param {Object} state state
     * @param {Object} dispatch dispatch
     * @param {String} key valeur du dictionnaire
     * @param {String} isCache indique si mise en cache
     */
  },
  mutations: {
    /**
     * @description Définir la configuration
     * @param {Object} state state
     * @param {Boolean} key active
     * @param {Boolean} value active
     */
    async set (state, key, value) {
      state.data[key] = value
    },
    /**
     * @description Récupérer la configuration
     * @param {Object} state state
     * @param {Boolean} key active
     */
    async get (state, key) {
      return state.data[key]
    }
  }
}
