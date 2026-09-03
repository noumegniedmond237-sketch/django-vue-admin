/*
 * @date-de-creation: 2021-06-01 22:41:21
 * @Auther: Yuan Xiaotian
 * @derniere-modification-par: Yuan Xiaotian
 * @derniere-modification-le: 2021-06-06 12:25:38
 * Contact QQ : 1638245306
 * @description-fichier: API des permissions de menu
 */
import { request } from '@/api/service'

export const urlPrefix = '/api/system/menu_button/'

export function GetList (query) {
  return request({
    url: urlPrefix,
    method: 'get',
    params: query
  })
}

export function createObj (obj, id) {
  const data = { ...obj, menu: id }
  return request({
    url: urlPrefix,
    method: 'post',
    data: data
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
