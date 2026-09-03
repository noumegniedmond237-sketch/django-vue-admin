import { d2CrudPlus } from 'd2-crud-plus'
import group from './group'

function install (Vue, options) {
  Vue.component('many-to-many', () => import('./index'))
  if (d2CrudPlus != null) {
    // Enregistrer le type de champ `demo-extend`
    d2CrudPlus.util.columnResolve.addTypes(group)
  }
}

// Exporter install : après `vue.use(D2pDemoExtend)`, `demo-extend` peut être utilisé dans `crud.js`
export default {
  install
}
