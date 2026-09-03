import Vue from 'vue'
import Vuex from 'vuex'

import d2admin from './modules/d2admin'
import { getStoreModules } from '@/views/plugins'
Vue.use(Vuex)
// Créer un objet modules vide
const modules = { d2admin: d2admin }
Object.assign(modules, getStoreModules())
export default new Vuex.Store({
  modules
})
