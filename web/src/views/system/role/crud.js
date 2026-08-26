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
      highlightCurrentRow: false
    },
    rowHandle: {
      view: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Retrieve')
        }
      },
      width: 230,
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
        show (index, row) {
          return true
        },
        disabled () {
          return !vm.hasPermissions('Update')
        },
        text: 'Permissions',
        type: 'warning',
        size: 'small',
        emit: 'createPermission'
      }]
    },
    indexRow: {
      title: 'N°',
      align: 'center',
      width: 100
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
      width: 90,
      form: {
        disabled: true
      }
    },
    {
      title: 'Nom du rôle',
      key: 'name',
      sortable: true,
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
          { required: true, message: 'Le nom du rôle est requis' }
        ],
        component: {
          props: {
            clearable: true
          },
          placeholder: 'Entrez le nom du rôle'
        },
        itemProps: {
          class: { yxtInput: true }
        }
      }
    },
    {
      title: 'Code de permission',
      key: 'key',
      sortable: true,
      minWidth: 120,
      form: {
        rules: [
          { required: true, message: 'Le code de permission est requis' }
        ],
        component: {
          props: {
            clearable: true
          },
          placeholder: 'Entrez le code identifiant'
        },
        itemProps: {
          class: { yxtInput: true }
        }
      }
    }, {
      title: 'Ordre',
      key: 'sort',
      sortable: true,
      width: 80,
      type: 'number',
      form: {
        value: 1,
        component: {
          placeholder: "Numéro d'ordre"
        }
      }
    },
    {
      title: 'Administrateur',
      key: 'admin',
      sortable: true,
      type: 'radio',
      minWidth: 120,
      dict: {
        data: vm.dictionary('button_whether_bool')
      },
      form: {
        value: false,
        component: {
          placeholder: 'Est-il administrateur ?',
          show (context) {
            return vm.info.is_superuser
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
      type: 'radio',
      minWidth: 100,
      dict: {
        data: vm.dictionary('button_status_bool')
      },
      form: {
        value: true,
        component: {
          placeholder: 'Sélectionnez le statut'
        }
      },
      component: { props: { color: 'auto' } }
    }
    ].concat(vm.commonEndColumns())
  }
}
