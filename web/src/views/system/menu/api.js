/*
 * @date-de-creation: 2021-06-01 22:41:21
 * @Auther: Yuan Xiaotian
 * @derniere-modification-par: Yuan Xiaotian
 * @derniere-modification-le: 2021-07-29 19:23:33
 * Contact QQ : 1638245306
 * @description-fichier: API de gestion des menus
 */
import { request } from '@/api/service'

export const urlPrefix = '/api/system/menu/'

/**
 * Recherche dans la liste
 */
export function GetList (query) {
  return request({
    url: urlPrefix,
    method: 'get',
    params: { ...query }
  }).then(res => {
    // Convertir la liste en données arborescentes
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
