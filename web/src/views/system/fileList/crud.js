export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    options: {
      height: '100%'
    },
    rowHandle: {
      width: 110,
      view: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Retrieve')
        }
      },
      edit: false,
      remove: {
        thin: true,
        text: '',
        disabled () {
          return !vm.hasPermissions('Delete')
        }
      }
    },
    viewOptions: {
      componentType: 'form'
    },
    formOptions: {
      defaultSpan: 12
    },
    indexRow: {
      title: 'N°',
      align: 'center',
      width: 100
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
          disabled: true,
          component: {
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
        width: 90,
        disabled: true,
        form: {
          disabled: true
        }
      },
      {
        title: 'Nom du fichier',
        key: 'name',
        search: {
          disabled: false
        },
        width: 160,
        type: 'input',
        form: {
          component: {
            placeholder: 'Nom du fichier'
          }
        }
      },
      {
        title: 'URL du fichier',
        key: 'url',
        type: 'file-uploader',
        search: {
          disabled: true
        },
        width: 220
      },
      {
        title: 'MD5 du fichier',
        key: 'md5sum',
        width: 200,
        search: {
          disabled: true
        },
        form: {
          disabled: false
        }
      },
      {
        title: 'Description',
        key: 'description',
        show: false,
        search: {
          disabled: true
        },
        type: 'textarea',
        form: {
          component: {
            placeholder: 'Entrez une description',
            showWordLimit: true,
            maxlength: '200',
            props: {
              type: 'textarea'
            }
          }
        }
      }, {
        title: 'Créé par',
        show: false,
        width: 120,
        key: 'modifier_name',
        form: {
          disabled: true
        }
      },
      {
        title: 'Date de modification',
        key: 'update_datetime',
        width: 160,
        type: 'datetime',
        form: {
          disabled: true
        }
      },
      {
        title: 'Date de création',
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
