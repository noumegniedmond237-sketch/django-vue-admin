import store from '@/store'
import util from '@/libs/util'

export default {
  install (Vue, options) {
    // Impression rapide des logs log
    Vue.prototype.$log = {
      ...util.log,
      push (data) {
        if (typeof data === 'string') {
          // Si les données transmises sont une chaîne
          // Assigner au champ message
          // Pour faciliter l'utilisation
          // eg: this.$log.push('foo text')
          store.dispatch('d2admin/log/push', {
            message: data
          })
        } else if (typeof data === 'object') {
          // Si les données transmises sont un objet
          store.dispatch('d2admin/log/push', data)
        }
      }
    }
  }
}
