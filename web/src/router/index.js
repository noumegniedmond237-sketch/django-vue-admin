import Vue from 'vue'
import VueRouter from 'vue-router'
// Barre de progression
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'
// Données de route
import routes from './routes'
import { getMenu, handleAsideMenu, handleRouter, checkRouter } from '@/menu'
import { request } from '@/api/service'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
console.log(routes)
// Exporter les routes (utilisé dans main.js) Dans main.js
const router = new VueRouter({
  routes
})

/**
 * Interception des routes
 * Vérification des permissions
 */
router.beforeEach(async (to, from, next) => {
  // Liste blanche
  const whiteList = ['/login', '/auth-redirect', '/bind', '/register', '/clientRenew', '/oauth2']
  // Confirmer le chargement des données multi-onglets https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // Confirmer le chargement des paramètres de taille des composants https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // Barre de progression
  NProgress.start()
  // Fermer le panneau de recherche
  store.commit('d2admin/search/set', false)
  // Vérifier si les correspondances de la route courante exigent une authentification
  // Ici, la présence du token dans les cookies sert temporairement de critère de connexion
  // Modifier selon les besoins métier
  const token = util.cookies.get('token')
  if (token && token !== 'undefined') {
    if (!store.state.d2admin.user.info.name) {
      var res = await request({
        url: '/api/system/user/user_info/',
        method: 'get',
        params: {}
      })
      await store.dispatch('d2admin/user/set', res.data, { root: true })
      await store.dispatch('d2admin/account/load')
      store.dispatch('d2admin/settings/init')
    }
    if (!store.state.d2admin.menu || store.state.d2admin.menu.aside.length === 0) {
      await store.dispatch('d2admin/permission/load', routes)
      await store.dispatch('d2admin/dept/load')
      // Ajouter des routes dynamiquement
      getMenu().then(ret => {
        // Vérifier si la route est valide
        ret = checkRouter(ret)
        const { routes, frameOut } = handleRouter(ret)
        // Traiter les routes (obtenir les paramètres de chaque niveau)
        store.commit('d2admin/page/init', routes)
        routes.map((r) => {
          router.addRoute(r)
        })
        frameOut.map((r) => {
          router.addRoute(r)
          router.options.routes.push(r)
        })
        console.log('router', router, routes, frameOut)
        // routes.forEach(route => router.addRoute(route))

        const menu = handleAsideMenu(ret)
        const aside = handleAsideMenu(ret.filter(value => value.visible === true))
        store.commit('d2admin/menu/asideSet', aside) // Définir le menu latéral
        store.commit('d2admin/search/init', menu) // Définir les informations utilisateur de vuexRecherche
        next({ path: to.fullPath, replace: true, params: to.params })
      })
    } else {
      const childrenPath = window.qiankunActiveRule || []
      // Déterminer s'il s'agit du mode locataire (tenant),
      if (to.path !== '/clientRenew' && store.state.d2admin.user.info.tenant_id) {
        // Si le locataire expire, rediriger vers la page de renouvellement,
        if (store.state.d2admin.user.info.tenant_expire) {
          next({ path: '/clientRenew' })
          // Annuler la navigation courante
          NProgress.done()
          return
        // Pour un locataire ordinaire sans offre d'essai en période d'essai
        } else if (store.state.d2admin.user.info.tenant_id !== 100000 && !store.state.d2admin.user.info.package_manage && store.state.d2admin.user.info.tenant_experience) {
          next({ path: '/clientRenew' })
          // Annuler la navigation courante
          NProgress.done()
          return
        }
      }
      if (to.name) {
        if (to.meta.openInNewWindow && ((from.query.newWindow && to.query.newWindow !== '1') || from.path === '/')) {
          to.query.newWindow = '1'
        }

        // Avec l'attribut name, c'est une route de l'application principale name ,
        if (to.meta.openInNewWindow && !to.query.newWindow && !from.query.newWindow && from.path !== '/') {
          // Ouvrir la route dans une nouvelle fenêtre
          const { href } = router.resolve({
            path: to.path + '?newWindow=1'
          })
          window.open(href, '_blank')
          // Annuler la navigation courante
          NProgress.done()
          next(false)
        } else {
          // Annuler la navigation courante
          NProgress.done()
          next()
        }
      } else if (childrenPath.some((item) => to.path.includes(item))) {
        next()
      } else {
        next({ name: '404' })
      }
    }
  } else {
    // Rediriger vers la connexion quand non connecté
    // Joindre le chemin complet de redirection après une connexion réussie
    // https://github.com/d2-projects/d2-admin/issues/138
    if (whiteList.indexOf(to.path) !== -1) {
      // Accès direct via la liste blanche (sans connexion),
      next()
    } else {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
      NProgress.done()
    }
  }
})

router.afterEach(to => {
  // Barre de progression
  NProgress.done()
  // Contrôle multi-pages : ouvrir une nouvelle page
  store.dispatch('d2admin/page/open', to)
  // Modifier le titre
  util.title(to.meta.title)
})

export default router
