// Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// flex bibliothèque de disposition
import 'flex.css'
// Composant
import '@/components'
// svg Icône SVG
import '@/assets/svg-icons'
// Internationalisation (i18n)
import i18n from '@/i18n.js'

// Plugin fonctionnel
import pluginApi from '@/plugin/api'
import pluginError from '@/plugin/error'
import pluginLog from '@/plugin/log'
import pluginOpen from '@/plugin/open'
import tableSelector from '@/components/table-selector/index'
export default {
  async install (Vue, options) {
    // Définir à false pour empêcher le message de production de vue au démarrage false  vue
    // https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false
    // Environnement courant
    Vue.prototype.$env = process.env.NODE_ENV
    // baseUrl courante
    Vue.prototype.$baseUrl = process.env.BASE_URL
    // Version courante
    Vue.prototype.$version = process.env.VUE_APP_VERSION
    // Heure de construction
    Vue.prototype.$buildTime = process.env.VUE_APP_BUILD_TIME
    // Element
    Vue.use(ElementUI, {
      i18n: (key, value) => i18n.t(key, value)
    })
    // Plugin
    Vue.use(pluginApi)
    Vue.use(pluginError)
    Vue.use(pluginLog)
    Vue.use(pluginOpen)
    Vue.use(tableSelector)
  }
}
