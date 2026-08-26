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
      fixed: 'right',
      view: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Retrieve')
        }
      },
      width: 70,
      edit: {
        thin: true,
        text: '',
        show: false,
        disabled () {
          return !vm.hasPermissions('Update')
        }
      },
      remove: {
        thin: true,
        text: 'Supprimer',
        show: false,
        disabled () {
          return !vm.hasPermissions('Delete')
        }
      }
    },
    viewOptions: {
      componentType: 'form'
    },
    formOptions: {
      disabled: true,
      defaultSpan: 12
    },
    indexRow: {
      title: 'N°',
      align: 'center',
      width: 70
    },
    columns: [
      {
        title: 'Recherche',
        key: 'search',
        show: false,
        disabled: true,
        search: {
          disabled: false
        },
        form: {
          show: false,
          component: {
            placeholder: 'Rechercher par mot-clé'
          }
        }
      },
      {
        title: 'ID',
        key: 'id',
        width: 90,
        disabled: true,
        form: {
          disabled: true
        }
      },
      {
        title: 'Module',
        key: 'request_modular',
        search: {
          disabled: false
        },
        width: 140,
        type: 'input',
        form: {
          disabled: true,
          component: {
            placeholder: 'Module de la requête'
          }
        }
      },
      {
        title: 'Chemin API',
        key: 'request_path',
        search: {
          disabled: false
        },
        width: 220,
        type: 'input',
        form: {
          disabled: true,
          component: {
            placeholder: "Chemin de l'URL"
          }
        }
      },
      {
        title: 'Paramètres / Corps',
        key: 'request_body',
        search: {
          disabled: true
        },
        disabled: true,
        type: 'textarea',
        form: {
          disabled: true,
          component: {
            props: {
              type: 'textarea'
            },
            autosize: {
              minRows: 2, maxRows: 8
            },
            placeholder: 'Paramètres'
          }
        }
      },
      {
        title: 'Méthode',
        key: 'request_method',
        width: 100,
        type: 'input',
        search: {
          disabled: false
        },
        form: {
          disabled: true,
          component: {
            placeholder: 'Méthode HTTP'
          }
        },
        component: { props: { color: 'auto' } }
      },
      {
        title: 'Description',
        key: 'request_msg',
        disabled: true,
        form: {
          component: {
            span: 12
          }
        }
      },
      {
        title: 'Adresse IP',
        key: 'request_ip',
        search: {
          disabled: false
        },
        width: 130,
        type: 'input',
        form: {
          disabled: true,
          component: {
            placeholder: 'Adresse IP'
          }
        },
        component: { props: { color: 'auto' } }
      },
      {
        title: 'Navigateur',
        key: 'request_browser',
        width: 180,
        type: 'input',
        form: {
          disabled: true
        },
        component: { props: { color: 'auto' } }
      },
      {
        title: 'Code HTTP',
        key: 'response_code',
        search: {
          disabled: true
        },
        width: 100,
        type: 'input',
        form: {
          disabled: true
        },
        component: { props: { color: 'auto' } }
      },
      {
        title: "Système d'exploitation",
        key: 'request_os',
        disabled: true,
        search: {
          disabled: true
        },
        width: 150,
        type: 'input',
        form: {
          disabled: true
        },
        component: { props: { color: 'auto' } }
      },
      {
        title: 'Réponse JSON',
        key: 'json_result',
        search: {
          disabled: true
        },
        minWidth: 240,
        type: 'input',
        form: {
          disabled: true
        },
        component: { props: { color: 'auto' } }
      }, {
        title: 'Opérateur',
        width: 120,
        key: 'creator_name',
        form: {
          disabled: true
        }
      },
      {
        title: 'Date de modification',
        key: 'update_datetime',
        width: 160,
        show: false,
        type: 'datetime',
        form: {
          disabled: true
        }
      },
      {
        fixed: 'right',
        title: "Date de l'opération",
        key: 'create_datetime',
        width: 160,
        type: 'datetime',
        form: {
          disabled: true
        }
      }
    ]
  }
}
