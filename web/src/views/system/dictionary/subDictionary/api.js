import { request } from '@/api/service'
import XEUtils from 'xe-utils'
export const urlPrefix = '/api/system/dictionary/'

/**
 * Recherche dans la liste
 */
export function GetList (query) {
  return request({
    url: urlPrefix,
    method: 'get',
    params: query
  }).then(res => {
    // Convertir la liste en données arborescentes
    res.data.data = XEUtils.toArrayTree(res.data.data, { parentKey: 'parent' })
    return res
  })
}
/**
 * Ajouter
 */
export function createObj (obj) {
  return request({
    url: urlPrefix,
    method: 'post',
    data: obj
  })
}

/**
 * Modifier
 */
export function UpdateObj (obj) {
  return request({
    url: urlPrefix + obj.id + '/',
    method: 'put',
    data: obj
  })
}
/**
 * Supprimer
 */
export function DelObj (id) {
  return request({
    url: urlPrefix + id + '/',
    method: 'delete',
    data: { id }
  })
}
