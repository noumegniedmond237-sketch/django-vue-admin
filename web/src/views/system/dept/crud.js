import * as api from './api'
export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    pagination: false,
    options: {
      tableType: 'vxe-table',
      stripe: false,
      rowKey: true,
      rowId: 'id',
      height: '100%',
      highlightCurrentRow: false,
      defaultExpandAll: true,
      resizable: true,
      treeConfig: {
        transform: true,
        rowField: 'id',
        parentField: 'parent',
        hasChild: 'hasChild',
        lazy: true,
        loadMethod: ({ row }) => {
          let query = JSON.parse(JSON.stringify(vm.getSearch().getForm()))
          query = Object.fromEntries(
            Object.entries(query).filter(([_, value]) => ![undefined, null, [], '[]', ''].includes(value))
          )
          query.parent = row.id
          return api.GetList({ ...query }).then(ret => {
            return ret.data.data
          })
        },
        iconLoaded: 'el-icon-loading'
      }
    },
    rowHandle: {
      fixed: 'right',
      width: 140,
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
      }
    },
    indexRow: {
      title: 'N°',
      align: 'center',
      width: 70
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
          disabled: true
        },
        form: {
          disabled: true,
          component: {
            props: {
              clearable: true
            },
            placeholder: 'Rechercher par mot-clé'
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
        disabled: true,
        width: 90,
        form: {
          disabled: true
        }
      },
      {
        show: false,
        title: 'Département parent',
        key: 'parent',
        type: 'tree-selector',
        minWidth: 200,
        dict: {
          isTree: true,
          label: 'name',
          value: 'id',
          cache: false,
          getData: (url, dict, { form, component }) => {
            return api.DeptLazy().then(ret => { return ret })
          }
        },
        form: {
          helper: 'Laisser vide pour la racine',
          component: {
            span: 12,
            props: {
              multiple: false
            }
          }
        }
      },
      {
        title: 'Nom du département',
        key: 'name',
        sortable: true,
        treeNode: true,
        minWidth: 180,
        search: {
          disabled: false,
          component: {
            props: {
              clearable: true
            }
          }
        },
        type: 'input',
        showOverflow: 'tooltip',
        form: {
          rules: [
            { required: true, message: 'Le nom du département est requis' }
          ],
          component: {
            span: 12,
            props: {
              clearable: true
            },
            placeholder: 'Entrez le nom du département'
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'Code identifiant',
        key: 'key',
        sortable: true,
        minWidth: 120,
        form: {
          component: {
            props: {
              clearable: true
            },
            placeholder: "Entrez le code de l'identifiant"
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'Responsable',
        key: 'owner',
        sortable: true,
        minWidth: 120,
        form: {
          component: {
            span: 12,
            props: {
              clearable: true
            },
            placeholder: 'Entrez le nom du responsable'
          }
        }
      },
      {
        title: 'Téléphone',
        key: 'phone',
        sortable: true,
        minWidth: 120,
        form: {
          component: {
            span: 12,
            props: {
              clearable: true
            },
            placeholder: 'Entrez le numéro de téléphone'
          }
        }
      },
      {
        title: 'E-mail',
        key: 'email',
        sortable: true,
        minWidth: 140,
        form: {
          component: {
            span: 12,
            props: {
              clearable: true
            },
            placeholder: "Entrez l'adresse email"
          },
          rules: [
            {
              type: 'email',
              message: 'Adresse email invalide',
              trigger: ['blur', 'change']
            }
          ]
        }
      },
      {
        title: 'Ordre',
        key: 'sort',
        sortable: true,
        width: 80,
        type: 'number',
        form: {
          value: 1,
          component: {
            span: 12,
            placeholder: "Numéro d'ordre"
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
        width: 90,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_status_bool')
        },
        form: {
          value: true,
          component: {
            span: 12,
            placeholder: 'Sélectionnez le statut'
          }
        }
      }
    ].concat(vm.commonEndColumns())
  }
}
