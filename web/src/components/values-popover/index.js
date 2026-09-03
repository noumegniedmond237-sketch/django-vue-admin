import { d2CrudPlus } from 'd2-crud-plus'
import group from './group'

function install (Vue, options) {
  Vue.component('values-popover', () => import('./values-popover'))
  if (d2CrudPlus != null) {
    // Enregistrer le type de champ `demo-extend`
    d2CrudPlus.util.columnResolve.addTypes(group)
  }
}
// Exporter install
export default {
  install
}
