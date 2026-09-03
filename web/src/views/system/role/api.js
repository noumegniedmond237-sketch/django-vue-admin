/*
 * @date-de-creation: 2021-06-01 22:41:21
 * @Auther: Yuan Xiaotian
 * @derniere-modification-par: Yuan Xiaotian
 * @derniere-modification-le: 2021-06-05 01:03:36
 * Contact QQ : 1638245306
 * @description-fichier: API de gestion des rôles
 */
import { request } from '@/api/service'

export const urlPrefix = '/api/system/role/'

export function GetList (query) {
  return request({
    url: urlPrefix,
    method: 'get',
    params: { ...query }
  })
}

export function GetObj (obj) {
  return request({
    url: urlPrefix + obj.id + '/',
    method: 'get'
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
