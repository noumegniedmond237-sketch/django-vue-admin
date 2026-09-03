/*
 * @date-de-creation: 2021-06-01 22:41:19
 * @Auther: Yuan Xiaotian
 * @derniere-modification-par: Yuan Xiaotian
 * @derniere-modification-le: 2021-08-12 00:57:05
 * Contact QQ : 1638245306
 * @description-fichier:
 */
// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// Plugin principal
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'

// Paramètres de menu et de routes
import router from './router'
import { menuHeader } from '@/menu'

// Permissions des boutons
import '@/plugin/permission' // Charger permissionpermission

// d2-crud-plus Installation et initialisation
import './install'
// Configuration du SDKvxe-table
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

// websocket
import websocket from '@/api/websocket'
import util from '@/libs/util'
import VueCoreVideoPlayer from 'vue-core-video-player'
// Enregistrer le composant echarts
import * as echarts from 'echarts' // Enregistrer le composant echarts
// Composants tiers
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
// NOTE: vue-core-video-player écrase Vue.prototype.$t avec son i18n interne
// (dashboard/layers), ce qui casse toutes les traductions vue-i18n de l'app.
// On sauvegarde le $t de vue-i18n avant et on le restaure après.
// Le player utilise helper_i18n en interne, il n'a pas besoin du $t global.
const vueI18nT = Vue.prototype.$t
Vue.use(VueCoreVideoPlayer)
if (vueI18nT) Vue.prototype.$t = vueI18nT
// Plugin principal
Vue.use(d2Admin)
Vue.use(VXETable)
Vue.prototype.$util = util
Vue.prototype.$websocket = websocket
Vue.prototype.$echarts = echarts
new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  beforeCreate () {
    // Initialiser la configuration
    this.$store.dispatch('d2admin/settings/load')
    this.$store.dispatch('d2admin/dictionary/load')
  },
  created () {

    // Traiter les routes (obtenir les paramètres de chaque niveau)
    // this.$store.commit('d2admin/page/init', frameInRoutes)
    // Définir le menu de la barre supérieure
    // this.$store.commit('d2admin/menu/headerSet', menuHeader)
    // Définir le menu latéral
    // this.$store.commit('d2admin/menu/asideSet', menuAside)
    // Initialiser la recherche dans le menu
    // this.$store.commit('d2admin/search/init', menuAside)
  },
  mounted () {
    // Afficher les informations système
    this.$store.commit('d2admin/releases/versionShow')
    // Après la connexion, charger une série de paramètres depuis la base de données
    this.$store.dispatch('d2admin/account/load')
    // Obtenir et enregistrer l'UA de l'utilisateur UA
    this.$store.commit('d2admin/ua/get')
    // Initialiser l'écoute du plein écran
    this.$store.dispatch('d2admin/fullscreen/listen')
  },
  watch: {
    // Détecter les changements de route pour changer le contenu latéral
    '$route.matched': {
      handler (matched) {
        if (matched.length > 0) {
          const _side = menuHeader.filter(menu => menu.path === matched[0].path)
          if (_side.length > 0) {
            this.$store.commit('d2admin/menu/asideSet', _side[0].children)
          }
        }
      },
      immediate: true
    }
  }
}).$mount('#app')
