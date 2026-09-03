import { cloneDeep, uniq, get } from 'lodash'
import router from '@/router'
import setting from '@/setting.js'

// Déterminer si la mise en cache est nécessaire
const isKeepAlive = data => get(data, 'meta.cache', false)

export default {
  namespaced: true,
  state: {
    // Pages affichables en mode multi-onglets tab
    pool: [],
    // Liste multi-pages affichée
    opened: get(setting, 'page.opened', []),
    // Données multi-onglets déjà chargées https://github.com/d2-projects/d2-admin/issues/201
    openedLoaded: false,
    // Page courante
    current: '',
    // Noms des pages à mettre en cache name
    keepAlive: []
  },
  actions: {
    /**
     * @description Confirmer le chargement des données multi-onglets https://github.com/d2-projects/d2-admin/issues/201
     * @param {Object} context
     */
    isLoaded ({ state }) {
      if (state.openedLoaded) return Promise.resolve()
      return new Promise(resolve => {
        const timer = setInterval(() => {
          if (state.openedLoaded) resolve(clearInterval(timer))
        }, 10)
      })
    },
    /**
     * @class opened
     * @description Charger la liste des onglets depuis les données persistées
     * @param {Object} context
     */
    async openedLoad ({ state, commit, dispatch }) {
      // store Assignation du store
      const value = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'page.opened',
        defaultValue: setting.page.opened,
        user: true
      }, { root: true })
      // Optimiser les données dans le gestionnaire (filtrer les onglets expirés ou modifiés)
      // Se baser sur le champ fullPath fullPath
      // S'il y a trop de pages, l'algorithme devra peut-être être optimisé
      // valid liste valide : 1, 1, 0, 1 => valide, valide, invalide, valide 1, 1, 0, 1 => valide, valide, invalide, valide
      const valid = []
      // Traiter les données
      state.opened = value
        .map(opened => {
          // Tableau de bord
          if (opened.fullPath === '/index') {
            opened.meta = opened.meta || {}
            if (!opened.meta.title) {
              opened.meta.title = 'Tableau de bord'
            }
            valid.push(1)
            return opened
          }
          // Chercher la page correspondant à name parmi toutes les pages multi-onglets name
          const find = state.pool.find(item => item.name === opened.name)
          // Enregistrer les informations valides ou invalides
          valid.push(find ? 1 : 0)
          // Retourner les données fusionnées (les nouvelles écrasent les anciennes)
          // Les nouvelles données ne contiennent généralement pas params et query, les anciens paramètres sont conservés params et query,
          return Object.assign({}, opened, find)
        })
        .filter((opened, index) => valid[index] === 1)
      // Marquer les données multi-onglets comme chargées https://github.com/d2-projects/d2-admin/issues/201
      state.openedLoaded = true
      // Générer les paramètres de cache depuis les données opened opened
      commit('keepAliveRefresh')
    },
    /**
     * Assigner opened la propriété opened et persister (s'assurer d'avoir d'abord mis à jour state.opened) s'assurer d'avoir d'abord mis à jour state.opened
     * @param {Object} context
     */
    async opened2db ({ state, dispatch }) {
      // Définir les données
      dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'page.opened',
        value: state.opened,
        user: true
      }, { root: true })
    },
    /**
     * @class opened
     * @description Mettre à jour un élément de la liste des pages
     * @param {Object} context
     * @param {Object} payload { index, params, query, fullPath } informations de route
     */
    async openedUpdate ({ state, commit, dispatch }, { index, params, query, fullPath }) {
      // Mettre à jour un élément de la liste des pages
      const page = state.opened[index]
      page.params = params || page.params
      page.query = query || page.query
      page.fullPath = fullPath || page.fullPath
      state.opened.splice(index, 1, page)
      // Persistance
      await dispatch('opened2db')
    },
    /**
     * @class opened
     * @description Réordonner un élément de la liste des pages
     * @param {Object} context
     * @param {Object} payload { oldIndex, newIndex } informations de position
     */
    async openedSort ({ state, commit, dispatch }, { oldIndex, newIndex }) {
      // Réordonner un élément de la liste des pages
      const page = state.opened[oldIndex]
      state.opened.splice(oldIndex, 1)
      state.opened.splice(newIndex, 0, page)
      // Persistance
      await dispatch('opened2db')
    },
    /**
     * @class opened
     * @description Ouvrir une page (ajouter un tag)
     * @param {Object} context
     * @param {Object} payload new tag info
     */
    async add ({ state, commit, dispatch }, { tag, params, query, fullPath }) {
      // Définir le nouveau tag (utilisé à l'ouverture d'une page jamais ouverte) tag
      const newTag = tag
      newTag.params = params || newTag.params
      newTag.query = query || newTag.query
      newTag.fullPath = fullPath || newTag.fullPath
      // Ajouter au tableau des pages affichées
      state.opened.push(newTag)
      // Si cette page doit être mise en cache, l'ajouter aux paramètres de cache
      if (isKeepAlive(newTag)) commit('keepAlivePush', tag.name)
      // Persistance
      await dispatch('opened2db')
    },
    /**
     * @class current
     * @description Ouvrir une nouvelle page
     * @param {Object} context
     * @param {Object} payload Obtenu depuis l'objet to du garde de route { name, params, query, fullPath, meta } informations de route
     */
    async open ({ state, commit, dispatch }, { name, params, query, fullPath, meta }) {
      // Pages déjà ouvertes
      const opened = state.opened
      // Déterminer si cette page est déjà ouverte et enregistrer sa position
      let pageOpendIndex = 0
      const pageOpend = opened.find((page, index) => {
        const same = page.fullPath === fullPath
        pageOpendIndex = same ? index : pageOpendIndex
        return same
      })
      if (pageOpend) {
        // La page a déjà été ouverte
        await dispatch('openedUpdate', {
          index: pageOpendIndex,
          params,
          query,
          fullPath
        })
      } else {
        // La page n'a jamais été ouverte
        const page = state.pool.find(t => t.name === name)
        // Si page introuvable ici, la route est dans le cadre mais sans onglet page
        if (page) {
          await dispatch('add', {
            tag: Object.assign({}, page),
            params,
            query,
            fullPath
          })
        }
      }
      // Si cette page doit être mise en cache, l'ajouter aux paramètres de cache
      if (isKeepAlive({ meta })) commit('keepAlivePush', name)
      // Définir la page courante
      commit('currentSet', fullPath)
    },
    /**
     * @class opened
     * @description Fermer un tag (Fermer une page)
     * @param {Object} context
     * @param {Object} payload { tagName: nom de l'onglet à fermer }
     */
    async close ({ state, commit, dispatch }, { tagName }) {
      // Réserver la prochaine nouvelle page
      let newPage = {}
      const isCurrent = state.current === tagName
      // Si la page fermée est la page affichée
      if (isCurrent) {
        // Chercher une nouvelle page
        const len = state.opened.length
        for (let i = 0; i < len; i++) {
          if (state.opened[i].fullPath === tagName) {
            newPage = i < len - 1 ? state.opened[i + 1] : state.opened[i - 1]
            break
          }
        }
      }
      // Trouver l'index de cette page parmi les données ouvertes
      const index = state.opened.findIndex(page => page.fullPath === tagName)
      if (index >= 0) {
        // Si cette page est en cache, la retirer des paramètres de cache
        commit('keepAliveRemove', state.opened[index].name)
        // Mettre à jour les données (supprimer la page fermée)
        state.opened.splice(index, 1)
      }
      // Persistance
      await dispatch('opened2db')
      // Déterminer la page finale
      if (isCurrent) {
        const { name = 'index', params = {}, query = {} } = newPage
        const routerObj = { name, params, query }
        await router.push(routerObj)
      }
    },
    /**
     * @class opened
     * @description Fermer les onglets à gauche de l'onglet courant
     * @param {Object} context
     * @param {Object} payload { pageSelect: actuellement sélectionnétagName }
     */
    async closeLeft ({ state, commit, dispatch }, { pageSelect } = {}) {
      const pageAim = pageSelect || state.current
      let currentIndex = 0
      state.opened.forEach((page, index) => {
        if (page.fullPath === pageAim) currentIndex = index
      })
      if (currentIndex > 0) {
        // Supprimer la page ouverte (et dans les paramètres de cache)
        for (let i = state.opened.length - 1; i >= 0; i--) {
          if (state.opened[i].name === 'index' || i >= currentIndex) {
            continue
          }

          commit('keepAliveRemove', state.opened[i].name)
          state.opened.splice(i, 1)
        }
      }
      // Persistance
      await dispatch('opened2db')
      // Définir la page courante
      state.current = pageAim
      if (router.app.$route.fullPath !== pageAim) await router.push(pageAim)
    },
    /**
     * @class opened
     * @description Fermer les onglets à droite de l'onglet courant
     * @param {Object} context
     * @param {Object} payload { pageSelect: actuellement sélectionnétagName }
     */
    async closeRight ({ state, commit, dispatch }, { pageSelect } = {}) {
      const pageAim = pageSelect || state.current
      let currentIndex = 0
      state.opened.forEach((page, index) => {
        if (page.fullPath === pageAim) currentIndex = index
      })
      // Supprimer la page ouverte (et dans les paramètres de cache)
      for (let i = state.opened.length - 1; i >= 0; i--) {
        if (state.opened[i].name === 'index' || currentIndex >= i) {
          continue
        }

        commit('keepAliveRemove', state.opened[i].name)
        state.opened.splice(i, 1)
      }
      // Persistance
      await dispatch('opened2db')
      // Définir la page courante
      state.current = pageAim
      if (router.app.$route.fullPath !== pageAim) await router.push(pageAim)
    },
    /**
     * @class opened
     * @description Fermer tout sauf l'onglet actif tag
     * @param {Object} context
     * @param {Object} payload { pageSelect: actuellement sélectionnétagName }
     */
    async closeOther ({ state, commit, dispatch }, { pageSelect } = {}) {
      const pageAim = pageSelect || state.current
      let currentIndex = 0
      state.opened.forEach((page, index) => {
        if (page.fullPath === pageAim) currentIndex = index
      })
      // Supprimer les données de la page fermée et mettre à jour le cache
      for (let i = state.opened.length - 1; i >= 0; i--) {
        if (state.opened[i].name === 'index' || currentIndex === i) {
          continue
        }

        commit('keepAliveRemove', state.opened[i].name)
        state.opened.splice(i, 1)
      }
      // Persistance
      await dispatch('opened2db')
      // Définir la nouvelle page
      state.current = pageAim
      if (router.app.$route.fullPath !== pageAim) await router.push(pageAim)
    },
    /**
     * @class opened
     * @description Tout fermer tag
     * @param {Object} context
     */
    async closeAll ({ state, commit, dispatch }) {
      // Supprimer la page ouverte (et dans les paramètres de cache)
      for (let i = state.opened.length - 1; i >= 0; i--) {
        if (state.opened[i].name === 'index') {
          continue
        }

        commit('keepAliveRemove', state.opened[i].name)
        state.opened.splice(i, 1)
      }
      // Persistance
      await dispatch('opened2db')
      // Après avoir fermé tous les onglets, vérifier si on est sur la page d'accueil
      if (router.app.$route.name !== 'index') {
        await router.push({ name: 'index' })
      }
    }
  },
  mutations: {
    /**
     * @class keepAlive
     * @description Mettre à jour les pages à mettre en cache à partir des pages déjà ouvertes
     * @param {Object} state state
     */
    keepAliveRefresh (state) {
      state.keepAlive = state.opened.filter(item => isKeepAlive(item)).map(e => e.name)
    },
    /**
     * @description Supprimer le paramétrage de cache d'une page
     * @param {Object} state state
     * @param {String} name name
     */
    keepAliveRemove (state, name) {
      const list = cloneDeep(state.keepAlive)
      const index = list.findIndex(item => item === name)
      if (index !== -1) {
        list.splice(index, 1)
        state.keepAlive = list
      }
    },
    /**
     * @description Ajouter le paramétrage de cache d'une page
     * @param {Object} state state
     * @param {String} name name
     */
    keepAlivePush (state, name) {
      const keep = cloneDeep(state.keepAlive)
      keep.push(name)
      state.keepAlive = uniq(keep)
    },
    /**
     * @description Vider les paramètres de cache des pages
     * @param {Object} state state
     */
    keepAliveClean (state) {
      state.keepAlive = []
    },
    /**
     * @class current
     * @description Définir la page actuellement active fullPath
     * @param {Object} state state
     * @param {String} fullPath new fullPath
     */
    currentSet (state, fullPath) {
      state.current = fullPath
    },
    /**
     * @class pool
     * @description Enregistrer pool (réserve de candidats)
     * @param {Object} state state
     * @param {Array} routes routes
     */
    init (state, routes) {
      const pool = []
      const push = function (routes) {
        routes.forEach(route => {
          if (route.children && route.children.length > 0) {
            push(route.children)
          } else {
            if (!route.hidden) {
              const { meta, name, path } = route
              pool.push({ meta, name, path })
            }
          }
        })
      }
      push(routes)
      state.pool = pool
    }
  }
}
