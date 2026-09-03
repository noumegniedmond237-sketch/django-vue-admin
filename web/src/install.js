import Vue from 'vue'
// import d2Crud from '@d2-project/d2-crud'
import d2CrudX from 'd2-crud-x'
import { d2CrudPlus } from 'd2-crud-plus'
import {
  D2pAreaSelector,
  D2pDemoExtend,
  D2pFullEditor,
  D2pIconSelector,
  D2pUploader
} from 'd2p-extends' // Import via le code source (le composant de téléversement supporte le chargement différé),
import D2pFileUploader from '@/components/file-uploader'
// Requête HTTP
import { request } from '@/api/service'
import util from '@/libs/util'
import XEUtils from 'xe-utils'
import store from '@/store/index'
import types from '@/config/d2p-extends/types'
import { checkPlugins, plugins } from '@/views/plugins'

/**
 // vxe0
 import 'xe-utils'
 import VXETable from 'vxe-table'
 import 'vxe-table/lib/index.css'
 Vue.use(VXETable)
 **/

// Renommer comme suit pour coexister avec la version officielle (utiliser <d2-crud-x /> dans index.vue),index.vue<d2-crud-x />
// Sans accessKeySecret : mode signature temporaire (ce paramètre est alors obligatoire ; sûr, recommandé en production)name,alorsd2CrudX<d2-crud>,
Vue.use(d2CrudX, { name: 'd2-crud-x' })
// Enregistrer le plugin dvadmin
Vue.use(plugins)
// // version officielle[introduit ici pour démontrer la coexistence avec la version officielle,dans un nouveau projet, on peut remplacer entièrement la version officielle pard2-crud-x]
// Vue.use(d2Crud)
/**
 * @description Vérifier si le plugin est installé
 * @param {String} pluginName nom du plugin
 */
Vue.prototype.checkPlugins = checkPlugins
// Importer d2CrudPlusd2CrudPlus
Vue.use(d2CrudPlus, {
  starTip: false,
  getRemoteDictFunc (url, dict) {
    // Configurer ici la méthode de requête HTTP du dictionnairehttp
    // En utilisation réelle, remplacer par requestrequest
    return request({
      url: url,
      params: dict.body,
      method: 'get'
    }).then(ret => {
      if (dict.isTree) {
        return XEUtils.toArrayTree(ret.data.data || ret.data, { parentKey: 'parent', strict: false })
      } else {
        return ret.data.data || ret.data
      }
    })
  },
  commonOption () { // Configuration commune
    return {
      format: {
        page: { // pageConfiguration de la structure des données retournées par l'API page,
          request: {
            current: 'page',
            size: 'limit',
            orderAsc (query, value) {
              const field = query.orderProp
              if (value) {
                query.ordering = field
              } else {
                query.ordering = `-${field}`
              }
            }
          },
          response: {
            current: 'page', // Numéro de page courant ret.data.current
            size: 'limit', // Numéro de page courant ret.data.current
            // size: (data) => { return data.size }, // nombre d'éléments par page (ret.data.size ; on peut aussi configurer une méthode qui retourne la valeur),ret.data.size, ,
            total: 'total', // Nombre total d'enregistrements ret.data.total
            records: 'data' // Tableau de la liste ret.data.records
          }
        }
      },
      pageOptions: {
        compact: true
      },
      options: {
        size: 'small'
      },
      formOptions: {
        nullToBlankStr: true, // À la soumission, convertir les données undefined en chaîne vide (permet de vider un champ),'',
        defaultSpan: 12, // Span de formulaire par défaut span
        saveRemind: true,
        labelWidth: '110px',
        appendToBody: true
      },
      viewOptions: {
        disabled: false,
        componentType: 'form' // [form,row] : affichage par composant de formulaire ou de ligne
      },
      rowHandle: {
        width: 260,
        edit: {
          type: 'primary'
        }
      }
    }
  }
})

// Installer le plugin d'extension
// Vue.use(D2pTreeSelector)
Vue.use(D2pAreaSelector)
Vue.use(D2pIconSelector)
Vue.use(D2pFullEditor)
Vue.use(D2pDemoExtend)
Vue.use(D2pFileUploader)
Vue.use(D2pUploader, {
  defaultType: 'form',
  cos: {
    domain: 'https://d2p-demo-1251260344.cos.ap-guangzhou.myqcloud.com',
    bucket: 'd2p-demo-1251260344',
    region: 'ap-guangzhou',
    secretId: '', //
    secretKey: '', // Avec secretKey et secretId : mode signature locale (non sûr, déconseillé en production)
    getAuthorization (custom) { // Sans secretKey : mode signature temporaire (ce paramètre est alors obligatoire)(,)
      return request({
        url: '/upload/cos/getAuthorization',
        method: 'get'
      }).then(ret => {
        // Structure retournée ci-dessous
        // ret.data:{
        //   TmpSecretId,
        //   TmpSecretKey,
        //   XCosSecurityToken,
        //   ExpiredTime, // SDK Dans ExpiredTime avant ce délai, getAuthorization ne sera plus rappelé, getAuthorization
        // }
        return ret.data
      })
    }
  },
  alioss: {
    domain: 'https://d2p-demo.oss-cn-shenzhen.aliyuncs.com',
    bucket: 'd2p-demo',
    region: 'oss-cn-shenzhen',
    accessKeyId: '',
    accessKeySecret: '',
    getAuthorization (custom, context) { // Sans accessKeySecret : mode signature temporaire (ce paramètre est alors obligatoire)(,)
      return request({
        url: '/upload/alioss/getAuthorization',
        method: 'get'
      }).then(ret => {
        return ret.data
      })
    },
    sdkOpts: { // sdkConfiguration du SDK
      secure: true // Par défaut sans https ; pour la sécurité, mettre à true
    }
  },
  qiniu: {
    bucket: 'd2p-demo',
    getToken (custom) {
      return request({
        url: '/upload/qiniu/getToken',
        method: 'get'
      }).then(ret => {
        return ret.data // {token:xxx,expires:xxx}
      })
    },
    domain: 'http://d2p.file.veryreader.com'
  },
  form: {
    action: util.baseURL() + 'api/system/file/',
    name: 'file',
    data: {}, // Paramètres supplémentaires de téléversement
    headers () {
      return {
        Authorization: 'JWT ' + util.cookies.get('token')
      }
    },
    type: 'form',
    successHandle (ret, option) {
      if (ret.data === null || ret.data === '') {
        throw new Error('Échec du téléversement')
      }
      return { url: ret.data.url, key: option.data.key, id: ret.data.id }
    },
    withCredentials: false // Indique s'il faut joindre les cookies
  }
})
d2CrudPlus.util.columnResolve.addTypes(types)
// Modifier le type de champ officiel
const selectType = d2CrudPlus.util.columnResolve.getType('select')
selectType.component.props.color = 'auto' // Modifier le type de champ officiel (coloration automatique),
// Obtenir la configuration du dictionnaire
Vue.prototype.dictionary = function (name) {
  return store.state.d2admin.dictionary.data[name]
}
// Obtenir la valeur de libellé du dictionnaire
Vue.prototype.getDictionaryLabel = function (name, value) {
  const data = store.state.d2admin.dictionary.data[name]
  if (data && data instanceof Array) {
    for (var i = 0, len = data.length; i < len; i++) {
      if (data[i].value === value) {
        return data[i].label
      }
    }
    return ''
  }
  return store.state.d2admin.dictionary.data[name]
}
// Obtenir la configuration système
Vue.prototype.systemConfig = function (name) {
  return store.state.d2admin.settings.data[name]
}
// Colonnes par défaut : showForm = afficher dans le formulaire, showTable = afficher dans le tableauColumns  showForm:,showTable:
Vue.prototype.commonEndColumns = function (param = {}) {
  /**
   * @param {Object} {
    description: {
      showForm: true,
      showTable: false
    },
    dept_belong_id: {
      showForm: false,
      showTable: false
    },
    modifier_name: {
      showForm: false,
      showTable: false
    },
    update_datetime: {
      showForm: false,
      showTable: true
    },
    create_datetime: {
      showForm: false,
      showTable: true
    }
  }
   */
  const showData = {
    description: {
      showForm: (param.description && param.description.showForm) !== undefined ? param.description.showForm : true,
      showTable: (param.description && param.description.showTable) !== undefined ? param.description.showTable : false
    },
    dept_belong_id: {
      showForm: (param.dept_belong_id && param.dept_belong_id.showForm) !== undefined ? param.dept_belong_id.showForm : false,
      showTable: (param.dept_belong_id && param.dept_belong_id.showTable) !== undefined ? param.dept_belong_id.showTable : false,
      showSearch: (param.dept_belong_id && param.dept_belong_id.showSearch) !== undefined ? param.dept_belong_id.showSearch : false
    },
    modifier_name: {
      showForm: (param.modifier_name && param.modifier_name.showForm) !== undefined ? param.modifier_name.showForm : false,
      showTable: (param.modifier_name && param.modifier_name.showTable) !== undefined ? param.modifier_name.showTable : false
    },
    update_datetime: {
      showForm: (param.update_datetime && param.update_datetime.showForm) !== undefined ? param.update_datetime.showForm : false,
      showTable: (param.update_datetime && param.update_datetime.showTable) !== undefined ? param.update_datetime.showTable : true
    },
    creator_name: {
      showForm: (param.creator_name && param.creator_name.showForm) !== undefined ? param.creator_name.showForm : false,
      showTable: (param.creator_name && param.creator_name.showTable) !== undefined ? param.creator_name.showTable : false
    },
    create_datetime: {
      showForm: (param.create_datetime && param.create_datetime.showForm) !== undefined ? param.create_datetime.showForm : false,
      showTable: (param.create_datetime && param.create_datetime.showTable) !== undefined ? param.create_datetime.showTable : true
    }
  }
  return [
    {
      title: 'Description',
      key: 'description',
      show: showData.description.showTable,
      search: {
        disabled: true
      },
      type: 'textarea',
      form: {
        disabled: !showData.description.showForm,
        component: {
          placeholder: 'Entrez une description',
          showWordLimit: true,
          maxlength: '200',
          props: {
            type: 'textarea'
          }
        }
      }
    },
    {
      title: 'Modifié par',
      show: showData.modifier_name.showTable,
      width: 120,
      key: 'modifier_name',
      form: {
        disabled: !showData.modifier_name.showForm
      }
    },
    {
      title: 'Département',
      key: 'dept_belong_id',
      show: showData.dept_belong_id.showTable,
      width: 150,
      search: {
        disabled: !showData.dept_belong_id.showSearch
      },
      type: 'tree-selector',
      dict: {
        cache: false,
        url: '/api/system/dept/all_dept/',
        value: 'id',
        label: 'name',
        children: 'children'
      },
      component: {
        name: 'dept-format',
        props: { multiple: false, clearable: true }
      },
      form: {
        disabled: !showData.dept_belong_id.showForm,
        component: {
          props: { multiple: false, clearable: true }
        },
        helper: {
          render (h) {
            return (< el-alert title="Par défaut, département de l'utilisateur connecté" type="info" />
            )
          }
        }
      },
      valueBuilder (row, col) {
        if (row[col.key]) {
          row[col.key] = Number(row[col.key])
        }
      }
    },
    {
      title: 'Date de modification',
      key: 'update_datetime',
      width: 160,
      show: showData.update_datetime.showTable,
      type: 'datetime',
      sortable: true,
      form: {
        disabled: !showData.update_datetime.showForm
      }
    },
    {
      title: 'Date de création',
      key: 'create_datetime',
      width: 160,
      search: {
        disabled: !showData.create_datetime.showForm,
        width: 240,
        component: {
          name: 'el-date-picker',
          props: {
            type: 'daterange',
            'range-separator': 'au',
            'start-placeholder': 'Début',
            'end-placeholder': 'Fin',
            valueFormat: 'yyyy-MM-dd'
          }
        }
      },
      show: showData.create_datetime.showTable,
      type: 'datetime',
      sortable: true,
      form: {
        disabled: !showData.create_datetime.showForm
      }
    }
  ]
}
