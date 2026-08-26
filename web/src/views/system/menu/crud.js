import { request } from '@/api/service'
import { urlPrefix as menuPrefix } from './api'
import XEUtils from 'xe-utils'
export const crudOptions = (vm) => {
  const validateWebPath = (rule, value, callback) => {
    const isLink = vm.getEditForm().is_link
    let pattern = /^\/.*?/
    if (isLink) {
      pattern = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/g
    } else {
      pattern = /^\/.*?/
    }
    if (!pattern.test(value)) {
      callback(new Error('Veuillez saisir une adresse valide'))
    } else {
      callback()
    }
  }
  return {
    pagination: false,
    pageOptions: {
      compact: true
    },
    options: {
      tableType: 'vxe-table',
      rowKey: true,
      rowId: 'id',
      height: '100%',
      highlightCurrentRow: false,
      treeConfig: {
        transform: true,
        rowField: 'id',
        parentField: 'parent',
        expandAll: true,
        hasChild: 'hasChild',
        lazy: true,
        loadMethod: vm.loadContentMethod
      }
    },
    rowHandle: {
      view: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Retrieve')
        }
      },
      edit: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Update')
        }
      },
      remove: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Delete')
        }
      },
      width: 230,
      fixed: 'right',
      custom: [{
        show (index, row) {
          if (row.web_path && !row.is_link) {
            return true
          }
          return false
        },
        disabled () {
          return !vm.hasPermissions('Update')
        },
        text: ' Boutons',
        type: 'warning',
        size: 'small',
        emit: 'createPermission'
      }]
    },
    indexRow: {
      title: 'N°',
      align: 'center',
      width: 80
    },
    viewOptions: {
      componentType: 'form'
    },
    formOptions: {
      defaultSpan: 12
    },
    columns: [
      {
        title: 'Recherche',
        key: 'search',
        show: false,
        disabled: true,
        search: {
          disabled: false,
          component: {
            props: {
              clearable: true
            },
            placeholder: 'Rechercher par mot-clé'
          }
        },
        form: {
          disabled: true,
          component: {
            props: {
              clearable: true
            }
          }
        },
        view: {
          disabled: true
        }
      },
      {
        title: 'ID',
        key: 'id',
        show: false,
        width: 60,
        form: {
          component: {
            show: false
          }
        }
      },
      {
        title: 'Menu parent',
        key: 'parent',
        show: false,
        search: {
          disabled: true
        },
        type: 'cascader',
        dict: {
          url: menuPrefix,
          cache: false,
          isTree: true,
          value: 'id',
          label: 'name',
          children: 'children',
          getData: (url, dict, { form, component }) => {
            return request({ url: url, params: { limit: 999, status: 1, is_catalog: 1 } }).then(ret => {
              const responseData = ret.data.data
              const result = XEUtils.toArrayTree(responseData, { parentKey: 'parent', strict: true })
              return [{ id: null, name: 'Racine', children: result }]
            })
          }
        },
        form: {
          component: {
            props: {
              elProps: {
                clearable: true,
                showAllLevels: false,
                props: {
                  checkStrictly: true,
                  emitPath: false,
                  clearable: true
                }
              }
            }
          }
        }
      },
      {
        title: 'Nom du menu',
        key: 'name',
        sortable: true,
        treeNode: true,
        search: {
          disabled: false,
          component: {
            props: {
              clearable: true
            }
          }
        },
        minWidth: 180,
        type: 'input',
        form: {
          rules: [
            { required: true, message: 'Le nom du menu est requis' }
          ],
          component: {
            props: {
              clearable: true
            },
            placeholder: 'Entrez le nom du menu'
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'Icône',
        key: 'icon',
        width: 70,
        type: 'icon-selector',
        form: {
          component: {
            placeholder: "Sélectionnez l'icône"
          }
        }
      },
      {
        title: 'Ordre',
        key: 'sort',
        width: 70,
        type: 'number',
        form: {
          value: 1,
          component: {
            placeholder: "Numéro d'ordre"
          }
        }
      },
      {
        title: 'Est un catalogue',
        key: 'is_catalog',
        width: 120,
        type: 'dict-switch',
        search: {
          disabled: true
        },
        dict: {
          data: vm.dictionary('button_whether_bool')
        },
        form: {
          value: false,
          component: {
            placeholder: 'Est-ce un catalogue ?'
          },
          valueChange (key, value, form, { getColumn, mode, component, immediate, getComponent }) {
            if (!value) {
              form.web_path = undefined
              form.component = undefined
              form.component_name = undefined
              form.cache = false
              form.is_link = false
            }
          }
        }
      },
      {
        title: 'Lien externe',
        key: 'is_link',
        width: 100,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_whether_bool')
        },
        form: {
          value: false,
          component: {
            show (context) {
              const { form } = context
              return !form.is_catalog
            },
            placeholder: 'Est-ce un lien externe ?'
          },
          valueChange (key, value, form, { getColumn, mode, component, immediate, getComponent }) {
            form.web_path = undefined
            form.component = undefined
            form.component_name = undefined
            if (value) {
              getColumn('web_path').title = 'URL externe'
              getColumn('web_path').component.placeholder = 'Entrez l\'URL externe'
              getColumn('web_path').helper = {
                render (h) {
                  return (< el-alert title="URL externe commençant par https:// ou http://" type="warning" />
                  )
                }
              }
            } else {
              getColumn('web_path').title = 'Route Web'
              getColumn('web_path').component.placeholder = 'Entrez le chemin de la route'
              getColumn('web_path').helper = {
                render (h) {
                  return (< el-alert title="Chemin d'accès dans le navigateur, débutant par /" type="warning" />
                  )
                }
              }
            }
          }
        }
      },
      {
        title: 'Route Web',
        key: 'web_path',
        width: 150,
        show: false,
        form: {
          rules: [
            { required: true, message: 'Veuillez saisir un chemin de route valide' },
            { validator: validateWebPath, trigger: 'change' }
          ],
          component: {
            show (context) {
              const { form } = context
              return !form.is_catalog
            },
            props: {
              clearable: true
            },
            placeholder: 'Exemple : /mon-menu'
          },
          helper: {
            render (h) {
              return (< el-alert title="Chemin d'accès dans le navigateur, débutant par /" type="warning" />
              )
            }
          }
        }
      },
      {
        title: 'Composant Vue',
        key: 'component',
        type: 'select',
        show: false,
        dict: {
          cache: false,
          data: vm.searchFiles()
        },
        form: {
          rules: [
            { required: true, message: 'Veuillez choisir un composant' }
          ],
          component: {
            show (context) {
              const { form } = context
              return !form.is_catalog && !form.is_link
            },
            props: {
              clearable: true,
              filterable: true
            },
            placeholder: 'Sélectionnez le fichier composant'
          },
          helper: {
            render (h) {
              return (< el-alert title="Chemin du composant sous src/views/" type="warning" />
              )
            }
          }
        }
      },
      {
        title: 'Nom du composant',
        key: 'component_name',
        width: 170,
        form: {
          rules: [
            { required: true, message: 'Le nom du composant est requis' }
          ],
          component: {
            show (context) {
              const { form } = context
              return !form.is_catalog && !form.is_link
            },
            props: {
              clearable: true
            },
            placeholder: 'Nom du composant Vue'
          },
          helper: {
            render (h) {
              return (< el-alert title="Propriété 'name' dans le fichier .vue" type="warning" />
              )
            }
          }
        }
      },
      {
        title: 'Permissions',
        key: 'menuPermission',
        type: 'select',
        width: 300,
        form: {
          disabled: true,
          component: {
            elProps: {
              filterable: true,
              multiple: true,
              clearable: true
            }
          }
        }
      },
      {
        title: 'Cache',
        key: 'cache',
        search: {
          disabled: false
        },
        width: 70,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_whether_bool')
        },
        form: {
          value: false,
          component: {
            show (context) {
              const { form } = context
              return !form.is_catalog
            },
            placeholder: 'Activer le cache ?'
          },
          helper: {
            render (h) {
              return (< el-alert title="Activer le cache (keep-alive) pour cette page" type="warning" />
              )
            }
          }
        }
      },
      {
        title: 'Visible menu',
        key: 'visible',
        search: {
          disabled: false
        },
        width: 100,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_whether_bool')
        },
        form: {
          value: true,
          component: {
            placeholder: 'Afficher dans le menu latéral ?'
          },
          rules: [
            { required: true, message: 'Ce champ est requis' }
          ],
          helper: {
            render (h) {
              return (< el-alert title="Afficher ou masquer dans le menu latéral" type="warning" />
              )
            }
          }
        }
      }, {
        title: 'Hors-cadre',
        key: 'frame_out',
        search: {
          disabled: false
        },
        width: 90,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_whether_bool')
        },
        form: {
          value: false,
          component: {
            placeholder: 'Afficher hors du cadre principal ?'
          },
          rules: [
            { required: true, message: 'Ce champ est requis' }
          ],
          helper: {
            render (h) {
              return (< el-alert title="Afficher sans la disposition (layout) standard" type="warning" />
              )
            }
          }
        }
      },
      {
        title: 'Statut',
        key: 'status',
        sortable: true,
        search: {
          disabled: false
        },
        width: 80,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_status_bool')
        },
        form: {
          value: true,
          component: {
            placeholder: 'Sélectionnez le statut'
          },
          rules: [
            { required: true, message: 'Le statut est requis' }
          ]
        }
      }
    ].concat(vm.commonEndColumns({
      update_datetime: { showTable: false }
    }))
  }
}
