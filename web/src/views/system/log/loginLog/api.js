/*
 * @date-de-creation: 2021-06-08 10:40:32
 * @Auther: Yuan Xiaotian
 * @derniere-modification-par: Yuan Xiaotian
 * @derniere-modification-le: 2021-06-09 10:36:20
 * Contact QQ : 1638245306
 * @description-fichier: journaux d'opérations
 */
import { request } from '@/api/service'

export const urlPrefix = '/api/system/login_log/'

export function GetList (query) {
  return request({
    url: urlPrefix,
    method: 'get',
    params: query
  })
}
