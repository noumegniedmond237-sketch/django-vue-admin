/*
 * @date-de-creation: 2021-06-01 22:41:21
 * @Auther: Yuan Xiaotian
 * @derniere-modification-par: Yuan Xiaotian
 * @derniere-modification-le: 2021-07-04 00:54:41
 * Contact QQ : 1638245306
 * @description-fichier: présentation de la version
 */
import util from '@/libs/util.js'

export default {
  namespaced: true,
  mutations: {
    /**
     * @description Afficher les informations de version
     * @param {Object} state state
     */
    versionShow () {
      util.log.capsule('D2Admin', `v${process.env.VUE_APP_VERSION}`)
      console.log('DVAdmin(Gitee):https://gitee.com/liqianglog/django-vue-admin')
      console.log('Adresse de démo:https://demo.django-vue-admin.com')
      console.log('Adresse de la communauté:https://bbs.django-vue-admin.com')
      console.log('Adresse de la documentation:https://www.django-vue-admin.com')
      console.log('Adresse de la doc de configuration frontend : https://d2.pub/zh/doc/d2-crud-v2')
      console.log('Merci de mettre une star ! star, ~')
    }
  }
}
