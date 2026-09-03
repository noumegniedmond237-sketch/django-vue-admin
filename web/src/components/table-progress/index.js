import { d2CrudPlus } from 'd2-crud-plus'
import group from './group'
function install (Vue) {
  Vue.component('table-progress', () => import('./lib/table-progress'))
  if (d2CrudPlus != null) {
    // Enregistrer le type de champ `demo-extend`
    d2CrudPlus.util.columnResolve.addTypes(group)
  }
}

export default {
  install
}
