import store from '@/store'

import Vue from 'vue'
import permissionDirective from './directive/permission'

function isInited () {
  if (!isEnabled) {
    console.warn('PM is disabled')
    return true
  }
  return store.getters['permission/inited']
}

const isEnabled = process.env.VUE_APP_PM_ENABLED === 'true'
// Activer le module de permissions
if (isEnabled) {
  // Enregistrer la directive v-permission (contrôle des permissions des boutons)v-permission,
  Vue.use(permissionDirective)
}

export default {
  isEnabled,
  isInited
}
