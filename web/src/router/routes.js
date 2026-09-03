import layoutHeaderAside from '@/layout/header-aside'
import { checkPlugins } from '@/views/plugins/index.js'
// Trop de pages en chargement différé ralentissent le rechargement à chaud de webpack : pas de lazy loading en développement, uniquement en production
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)
const pluginImport = require('@/libs/util.import.plugin')
/**
 * Afficher dans le cadre principal
 */
const frameIn = [{
  path: '/',
  redirect: { name: 'index' },
  component: layoutHeaderAside,
  children: [
    // Tableau de bord
    {
      path: 'index',
      name: 'index',
      meta: {
        title: 'Tableau de bord',
        auth: true
      },
      component: _import('dashboard/workbench/index')
    },
    {
      path: 'page1',
      name: 'page1',
      meta: {
        auth: true
      },
      component: _import('demo/page1/index')
    },
    {
      path: 'userInfo',
      name: 'userInfo',
      meta: {
        title: 'Mon Profil',
        auth: true
      },
      component: () => import('@/layout/header-aside/components/header-user/userinfo')
    },
    // dashboard Espace de travail
    {
      path: 'workbench',
      name: 'workbench',
      meta: {
        title: 'Tableau de bord',
        auth: true
      },
      component: _import('dashboard/workbench')
    },
    // Actualiser la page (à conserver impérativement)
    {
      path: 'refresh',
      name: 'refresh',
      hidden: true,
      component: _import('system/function/refresh')
    },
    // Redirection de page (à conserver impérativement)
    {
      path: 'redirect/:route*',
      name: 'redirect',
      hidden: true,
      component: _import('system/function/redirect')
    }
  ]
}]

/**
 * Afficher en dehors du cadre principal
 */
const frameOut = [
  // Connexion
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]
/**
 * Connexion via un tiers
 */
const oauth2PluginsType = checkPlugins('dvadmin-oauth2-web')
if (oauth2PluginsType) {
  frameOut.push({
    path: '/oauth2',
    name: 'login',
    component: oauth2PluginsType === 'local' ? _import('plugins/dvadmin-oauth2-web/src/login/index') : pluginImport('dvadmin-oauth2-web/src/login/index')
  })
}
/**
 * Demande d'inscription d'un locataire (tenant)
 */
const tenantsPluginsType = checkPlugins('dvadmin-tenants-web')
if (tenantsPluginsType) {
  frameOut.push({
    path: '/register',
    name: 'tenantsRegister',
    component: tenantsPluginsType === 'local' ? _import('plugins/dvadmin-tenants-web/src/register/index') : pluginImport('dvadmin-tenants-web/src/register/index')
  })
}
/**
 * Page d'erreur
 */
const errorPage = [{
  path: '/404',
  name: '404',
  component: _import('system/error/404')
}]

// Exporter les menus à afficher
export const frameInRoutes = frameIn
export const frameOutRoutes = frameOut

// Exporter après réorganisation
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
