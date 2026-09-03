import { uniqueId } from 'lodash'
import { request } from '@/api/service'
import XEUtils from 'xe-utils'
import { frameInRoutes, frameOutRoutes } from '@/router/routes'
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)
const pluginImport = require('@/libs/util.import.plugin')
/**
 * @description Compléter les données du menu avec le champ path
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu données de menu d'origine
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([])

export const menuAside = supplementPath([])

// Demander les données de menu (pour analyser routes et menu latéral)
export const getMenu = function () {
  return request({
    url: '/api/system/menu/web_router/',
    method: 'get',
    params: {}
  }).then((res) => {
    // Définir les routes dynamiques
    const menuData = res.data.data
    sessionStorage.setItem('menuData', JSON.stringify(menuData))
    return menuData
  })
}

/**
 * Vérifier si la route est valide
 */
export const checkRouter = function (menuData) {
  const result = []
  for (const item of menuData) {
    try {
      if (item.path !== '' && item.component) {
        (item.component && item.component.substr(0, 8) === 'plugins/') ? pluginImport(item.component.replace('plugins/', '')) : _import(item.component)
      }
      result.push(item)
    } catch (err) {
      console.log(`Erreur d'import du menu (la page sera inaccessible). Vérifier que le fichier existe : ${item.component}`)
    }
  }
  return result
}
/**
 * Analyser les données de menu du backend en routes frontend
 */
export const handleRouter = function (menuData) {
  const result = []
  for (const item of menuData) {
    if (item.path !== '' && item.component) {
      const obj = {
        path: item.path,
        name: item.component_name,
        component: (item.component && item.component.substr(0, 8) === 'plugins/') ? pluginImport(item.component.replace('plugins/', '')) : _import(item.component),
        meta: {
          title: item.name,
          auth: true,
          cache: item.cache,
          openInNewWindow: item.frame_out
        }
      }
      if (item.frame_out) {
        frameOutRoutes.push(obj)
      } else {
        result.push(obj)
      }
    } else {
      if (item.is_link === 0) {
        delete item.path
      }
    }
  }
  frameInRoutes[0].children = [...result]
  return { routes: frameInRoutes, frameOut: frameOutRoutes }
}

/**
 * Traiter le menu latéral du frontend
 */
export const handleAsideMenu = function (menuData) {
  // Convertir la liste en données arborescentes
  const data = XEUtils.toArrayTree(menuData, {
    parentKey: 'parent',
    strict: true
  })
  const menu = [
    { path: '/index', title: 'Tableau de bord', icon: 'home' },
    ...data
  ]
  return supplementPath(menu)
}
