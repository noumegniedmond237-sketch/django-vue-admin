/*
 * @date-de-creation: 2021-06-01 22:41:21
 * @Auther: Yuan Xiaotian
 * @derniere-modification-par: Yuan Xiaotian
 * @derniere-modification-le: 2021-08-13 00:06:07
 * Contact QQ : 1638245306
 * @description-fichier: connexion et déconnexion
 */
import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import store from '@/store/index'
import { SYS_USER_LOGIN, SYS_USER_LOGOUT } from '@/views/system/login/api'
import { request } from '@/api/service'

export default {
  namespaced: true,
  actions: {
    /**
     * @description Connexion
     * @param {Object} context
     * @param {Object} payload username {String} compte utilisateur
     * @param {Object} payload password {String} mot de passe
     * @param {Object} payload route {Object} objet de route de redirection après une connexion réussie tout format supporté par vue-router
     */
    async login ({ dispatch }, {
      username = '',
      password = '',
      captcha = '',
      captchaKey = ''
    } = {}) {
      let res = await SYS_USER_LOGIN({
        username,
        password,
        captcha,
        captchaKey
      })
      // Pour les cookies, toujours stocker uuid et token
      // Tout le système dépend de ces deux données pour la validation et le stockage
      // uuid est l'identifiant unique de l'utilisateur (défini à l'inscription, immuable et unique)
      // token représente l'état de connexion courant ; il est recommandé de joindre le token aux requêtes réseau  token
      // Si nécessaire, le token doit être rafraîchi périodiquement (conservé un jour par défaut) token ,
      res = res.data
      util.cookies.set('uuid', res.userId)
      util.cookies.set('token', res.access)
      util.cookies.set('refresh', res.refresh)
      // Définir les informations utilisateur de vuex vuex Informations utilisateur
      // await dispatch('d2admin/user/set', {
      //   name: res.name,
      //   user_id: res.userId,
      //   avatar: res.avatar,
      //   role_info: res.role_info,
      //   dept_info: res.dept_info
      // }, { root: true })
      var userInfoRes = await request({
        url: '/api/system/user/user_info/',
        method: 'get',
        params: {}
      })
      await store.dispatch('d2admin/user/set', userInfoRes.data, { root: true })
      // Après la connexion, charger une série de paramètres depuis les données persistées
      await dispatch('load')
    },
    /**
     * @description Déconnecter l'utilisateur et revenir à la page de connexion
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} indique si une confirmation est requise
     */
    logout ({ commit, dispatch }, { confirm = false, refresh = true } = {}) {
      /**
       * @description Déconnexion
       */
      async function logout () {
        await SYS_USER_LOGOUT({ refresh: util.cookies.get('refresh') }).then(() => {
          // Supprimercookie
          util.cookies.remove('token')
          util.cookies.remove('uuid')
          util.cookies.remove('refresh')
        })
        // Vider les informations utilisateur de vuex vuex Informations utilisateur
        await dispatch('d2admin/user/set', {}, { root: true })
        store.commit('d2admin/menu/asideSet', []) // Définir le menu latéral
        store.commit('d2admin/search/init', []) // Définir les informations utilisateur de vuexRecherche
        sessionStorage.removeItem('menuData')

        store.dispatch('d2admin/db/databaseClear')

        // Naviguer vers la route
        router.push({ name: 'login' })
        if (refresh) {
          router.go(0)
        }
      }
      // Déterminer si une confirmation est nécessaire
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('Êtes-vous sûr de vouloir vous déconnecter ?', 'Déconnexion', {
          confirmButtonText: 'Confirmer',
          cancelButtonText: 'Annuler',
          type: 'warning'
        })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            Message({ message: 'Déconnexion annulée' })
          })
      } else {
        logout()
      }
    },
    /**
         * @description Après la connexion, charger une série de paramètres depuis les données persistées
         * @param {Object} context
         */
    async load ({ dispatch }) {
      // Charger le nom d'utilisateur
      await dispatch('d2admin/user/load', null, { root: true })
      // Charger le thème
      await dispatch('d2admin/theme/load', null, { root: true })
      // Charger les paramètres d'effet de transition des pages
      await dispatch('d2admin/transition/load', null, { root: true })
      // Charger la liste multi-pages de la dernière session depuis les données persistées
      await dispatch('d2admin/page/openedLoad', null, { root: true })
      // Charger la config de la barre latérale depuis les données persistées
      await dispatch('d2admin/menu/asideLoad', null, { root: true })
      // Charger la taille globale depuis les données persistées
      await dispatch('d2admin/size/load', null, { root: true })
      // Charger les paramètres de couleur depuis les données persistées
      await dispatch('d2admin/color/load', null, { root: true })
    }
  }
}
