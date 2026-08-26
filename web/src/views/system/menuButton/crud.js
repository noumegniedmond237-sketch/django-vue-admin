import { request } from '@/api/service'
export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    options: {
      tableType: 'vxe-table',
      rowKey: false,
      width: '100%',
      height: '100%'
    },
    rowHandle: {
      width: 180,
      edit: {
        thin: true,
        text: 'Modifier'
      },
      remove: {
        thin: true,
        text: 'Supprimer'
      }
    },
    indexRow: {
      title: 'N°',
      align: 'center',
      width: 100
    },
    viewOptions: {
      disabled: true,
      componentType: 'form'
    },
    formOptions: {
      defaultSpan: 24
    },
    columns: [{
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
        disabled: true
      },
      view: {
        disabled: true
      }
    },
    {
      title: 'ID',
      key: 'id',
      show: false,
      width: 90,
      form: {
        disabled: true
      }
    },

    {
      title: 'Nom du bouton',
      key: 'name',
      sortable: true,
      width: 150,
      search: {
        disabled: false
      },
      type: 'select',
      dict: {
        data: vm.dictionary('system_button'),
        label: 'label',
        value: 'label'
      },
      form: {
        rules: [
          { required: true, message: 'Le nom est requis' }
        ],
        component: {
          span: 12,
          props: {
            clearable: true,
            elProps: {
              allowCreate: true,
              filterable: true,
              clearable: true
            }
          }
        },
        itemProps: {
          class: { yxtInput: true }
        },
        valueChange (key, value, form, { getColumn, mode, component, immediate, getComponent }) {
          if (value != null) {
            const obj = component.dictOptions.find(item => {
              return item.label === value
            })
            if (obj && obj.value) {
              form.name = obj.label
              form.value = obj.value
            }
          }
        },
        helper: {
          render (h) {
            return (< el-alert title="Saisie personnalisée autorisée" type="warning" description="Configurez les boutons courants dans le gestionnaire de dictionnaires"/>
            )
          }
        }
      }
    },
    {
      title: 'Code de la permission',
      key: 'value',
      sortable: true,
      width: 200,
      search: {
        disabled: false
      },
      type: 'input',
      form: {
        rules: [
          { required: true, message: 'Le code de la permission est requis' }
        ],
        component: {
          span: 12,
          placeholder: 'Ex: Create, Update, Delete',
          props: {
            elProps: {
              clearable: true
            }
          }
        },
        itemProps: {
          class: { yxtInput: true }
        },
        helper: {
          render (h) {
            return (< el-alert title="Code utilisé pour vm.hasPermissions(code)" type="warning"/>
            )
          }
        }
      }
    },
    {
      title: 'Méthode HTTP',
      key: 'method',
      sortable: true,
      width: 150,
      search: {
        disabled: false
      },
      type: 'select',
      dict: {
        data: [
          { label: 'GET', value: 0 },
          { label: 'POST', value: 1 },
          { label: 'PUT', value: 2 },
          { label: 'DELETE', value: 3 }
        ]
      },
      form: {
        rules: [
          { required: true, message: 'La méthode HTTP est requise' }
        ],
        component: {
          span: 12
        },
        itemProps: {
          class: { yxtInput: true }
        }
      }
    },
    {
      title: "URL de l'API",
      key: 'api',
      sortable: true,
      search: {
        disabled: true
      },
      type: 'select',
      dict: {
        url: '/swagger.json',
        label: 'label',
        value: 'value',
        getData: (url, dict) => {
          return request({ url: url }).then(ret => {
            const res = Object.keys(ret.paths)
            const data = []
            for (const item of res) {
              const obj = {}
              obj.label = item
              obj.value = item
              data.push(obj)
            }

            return data
          })
        }
      },
      form: {
        rules: [
          { required: true, message: "L'URL est requise" }
        ],
        component: {
          span: 24,
          props: {
            elProps: {
              allowCreate: true,
              filterable: true,
              clearable: true
            }

          }
        },
        itemProps: {
          class: { yxtInput: true }
        },
        helper: {
          render (h) {
            return (< el-alert title="Format regex accepté pour les paramètres dynamiques, ex: /api/xx/.*?/" type="warning" />
            )
          }
        }
      }
    }
    ]
  }
}
