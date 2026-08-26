export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    options: {
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
        title: "Nom d'utilisateur",
        key: 'username',
        search: {
          disabled: false
        },
        width: 140,
        type: 'input',
        form: {
          disabled: true,
          component: {
            placeholder: "Nom d'utilisateur"
          }
        }
      },
      {
        title: 'Adresse IP',
        key: 'ip',
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
        }
      }, {
        title: 'Fournisseur (FAI)',
        key: 'isp',
        search: {
          disabled: true
        },
        disabled: true,
        width: 180,
        type: 'input',
        form: {
          component: {
            placeholder: 'FAI'
          }
        }
      }, {
        title: 'Continent',
        key: 'continent',
        width: 100,
        type: 'input',
        form: {
          disabled: true,
          component: {
            placeholder: 'Continent'
          }
        },
        component: { props: { color: 'auto' } }
      }, {
        title: 'Pays',
        key: 'country',
        width: 100,
        type: 'input',
        form: {
          component: {
            placeholder: 'Pays'
          }
        },
        component: { props: { color: 'auto' } }
      }, {
        title: 'Province / Région',
        key: 'province',
        width: 120,
        type: 'input',
        form: {
          component: {
            placeholder: 'Région'
          }
        },
        component: { props: { color: 'auto' } }
      }, {
        title: 'Ville',
        key: 'city',
        width: 100,
        type: 'input',
        form: {
          component: {
            placeholder: 'Ville'
          }
        },
        component: { props: { color: 'auto' } }
      }, {
        title: 'Code Région',
        key: 'area_code',
        width: 100,
        type: 'input',
        form: {
          component: {
            placeholder: 'Code région'
          }
        },
        component: { props: { color: 'auto' } }
      }, {
        title: 'Type de connexion',
        key: 'login_type',
        width: 140,
        type: 'select',
        search: {
          disabled: false
        },
        dict: {
          data: [
            { label: 'Identifiant / Mot de passe', value: 1 },
            { label: 'QR Code Standard', value: 2 },
            { label: 'WeChat QR Code', value: 3 },
            { label: 'Feishu QR Code', value: 4 },
            { label: 'DingTalk QR Code', value: 5 },
            { label: 'SMS OTP', value: 6 }]
        },
        form: {
          component: {
            placeholder: 'Type de connexion'
          }
        },
        component: { props: { color: 'auto' } }
      }, {
        title: "Système d'exploitation",
        key: 'os',
        width: 180,
        type: 'input',
        form: {
          component: {
            placeholder: "Système d'exploitation"
          }
        }
      }, {
        title: 'Navigateur',
        key: 'browser',
        width: 180,
        type: 'input',
        form: {
          component: {
            placeholder: 'Navigateur'
          }
        }
      }, {
        title: 'User Agent',
        key: 'agent',
        disabled: true,
        width: 180,
        type: 'input',
        form: {
          component: {
            placeholder: 'User Agent'
          }
        }
      }, {
        fixed: 'right',
        title: 'Date de connexion',
        key: 'create_datetime',
        width: 160,
        type: 'datetime',
        sortable: true
      }
    ]
  }
}
