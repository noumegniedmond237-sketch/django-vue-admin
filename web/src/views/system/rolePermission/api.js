/*
 * @date-de-creation: 2021-06-01 22:41:21
 * @Auther: Yuan Xiaotian
 * @derniere-modification-par: Yuan Xiaotian
 * @derniere-modification-le: 2021-08-12 16:29:27
 * Contact QQ : 1638245306
 * @description-fichier: API de gestion des rôles
 */
import { request } from '@/api/service'

export const urlPrefix = '/api/system/role/'

export function GetList (query) {
  return request({
    url: urlPrefix,
    method: 'get',
    params: query
  }).then(res => {
    return res.data.data
  })
}

export function createObj (obj) {
  return request({
    url: urlPrefix,
    method: 'post',
    data: obj
  })
}

export function UpdateObj (obj) {
  return request({
    url: urlPrefix + obj.id + '/',
    method: 'put',
    data: obj
  })
}

export function DelObj (id) {
  return request({
    url: urlPrefix + id + '/',
    method: 'delete',
    data: { id }
  })
}

// Obtenir les données de menu via l'id du rôleid,
export function GetMenuData (obj) {
  return request({
    url: '/api/system/role/role_get_menu/',
    method: 'get',
    params: {}
  }).then(res => {
    // Convertir la liste en données arborescentes
    return res.data
  })
}

/**
 * Obtenir les permissions sur les données
 * @param obj
 * @returns {*}
 * @constructor
 */
export function GetDataScope () {
  return request({
    url: '/api/system/role/data_scope/',
    method: 'get',
    params: {}
  })
}

/**
 * Obtenir les départements du rôle
 * @returns {*}
 * @constructor
 */
export function GetDataScopeDept () {
  return request({
    url: '/api/system/role/data_scope_dept/',
    method: 'get',
    params: {}
  })
}
