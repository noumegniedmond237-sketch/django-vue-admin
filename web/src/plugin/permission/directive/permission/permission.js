/*
 * @date-de-creation: 2021-06-27 10:14:26
 * @Auther: Yuan Xiaotian
 * @derniere-modification-par: Yuan Xiaotian
 * @derniere-modification-le: 2021-07-27 23:00:10
 * Contact QQ : 1638245306
 * @description-fichier: directive personnalisée-contrôle des permissions
 */
import permissionUtil from './util.permission'
export default {
  inserted (el, binding, vnode) {
    const { value } = binding
    const hasPermission = permissionUtil.hasPermissions(value)
    if (process.env.VUE_APP_PM_ENABLED) {
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}
