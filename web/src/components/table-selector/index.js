/*
 * @date-de-creation: 2021-08-02 23:56:15
 * @Auther: Yuan Xiaotian
 * @derniere-modification-par: Yuan Xiaotian
 * @derniere-modification-le: 2021-08-09 22:15:56
 * Contact QQ : 1638245306
 * @description-fichier:
 */
import { d2CrudPlus } from 'd2-crud-plus'
import group from './group'

function install (Vue, options) {
  Vue.component('table-selector-input', () => import('./table-selector'))
  // Vue.component('d2p-row-format', () => import('./row'))
  if (d2CrudPlus != null) {
    // Enregistrer le type de champ `demo-extend`
    d2CrudPlus.util.columnResolve.addTypes(group)
  }
}

// Exporter install : après `vue.use(D2pDemoExtend)`, `demo-extend` peut être utilisé dans `crud.js`
export default {
  install
}
