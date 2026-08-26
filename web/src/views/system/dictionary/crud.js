export const crudOptions = (vm) => {
  return {
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
        children: 'children',
        hasChild: 'hasChildren',
        expandAll: true
      }
    },
    rowHandle: {
      width: 230,
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
      custom: [{
        text: ' Configurer',
        type: 'success',
        size: 'small',
        emit: 'dictionaryConfigure'
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
      defaultSpan: 24,
      width: '35%'
    },
    columns: [{
      title: 'Recherche',
      key: 'search',
      show: false,
      disabled: true,
      search: {
        disabled: false
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
      title: 'Nom du dictionnaire',
      key: 'label',
      minWidth: 120,
      search: {
        disabled: false,
        component: {
          props: {
            clearable: true
          }
        }
      },
      type: 'input',
      form: {
        rules: [
          { required: true, message: 'Le nom du dictionnaire est requis' }
        ],
        component: {
          props: {
            clearable: true
          },
          placeholder: 'Entrez le nom du dictionnaire'
        },
        itemProps: {
          class: { yxtInput: true }
        }
      }
    },
    {
      title: 'Code du dictionnaire',
      key: 'value',
      minWidth: 120,
      search: {
        disabled: true,
        component: {
          props: {
            clearable: true
          }
        }
      },
      type: 'input',
      form: {
        rules: [
          { required: true, message: 'Le code du dictionnaire est requis' }
        ],
        component: {
          props: {
            clearable: true
          },
          placeholder: 'Entrez le code unique'
        },
        itemProps: {
          class: { yxtInput: true }
        },
        helper: {
          render (h) {
            return (< el-alert title="Utilisation : vm.dictionary('code_du_dictionnaire')" type="warning"/>
            )
          }
        }
      }
    },
    {
      title: 'Statut',
      key: 'status',
      width: 90,
      search: {
        disabled: false
      },
      type: 'radio',
      dict: {
        data: vm.dictionary('button_status_bool')
      },
      component: {
        props: {
          options: []
        }
      },
      form: {
        rules: [
          { required: true, message: 'Le statut est requis' }
        ],
        value: true,
        component: {
          placeholder: 'Sélectionnez le statut'
        },
        itemProps: {
          class: { yxtInput: true }
        }
      }
    },
    {
      title: 'Ordre',
      key: 'sort',
      width: 90,
      type: 'number',
      form: {
        value: 1,
        component: {
        },
        itemProps: {
          class: { yxtInput: true }
        }
      }
    }
    ].concat(vm.commonEndColumns({
      description: {
        showForm: false,
        showTable: false
      }
    }))
  }
}
