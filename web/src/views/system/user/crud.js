import { request } from '@/api/service'

export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    options: {
      height: '100%',
      rowId: 'id'
    },
    selectionRow: {
      align: 'center',
      width: 46
    },
    rowHandle: {
      width: 240,
      fixed: 'right',
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
      custom: [
        {
          thin: true,
          text: 'Réinitialiser mot de passe',
          size: 'small',
          type: 'warning',
          icon: 'el-icon-refresh-left',
          show () {
            return vm.hasPermissions('ResetPassword')
          },
          emit: 'resetPassword'
        }
      ]
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
      width: 60
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
        disabled: true,
        form: {
          disabled: true
        }
      },
      {
        title: 'Département',
        key: 'dept__name',
        treeNode: true,
        search: {
          disabled: false,
          component: {
            props: {
              clearable: true
            }
          }
        },
        show: false,
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
        minWidth: 120,
        type: 'input',
        form: {
          rules: [
            {
              required: true,
              message: "Le nom d'utilisateur est requis"
            }
          ],
          component: {
            placeholder: "Entrez le nom d'utilisateur"
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'Mot de passe',
        key: 'password',
        minWidth: 100,
        type: 'input',
        form: {
          rules: [
            {
              required: true,
              message: 'Le mot de passe est requis'
            }
          ],
          component: {
            span: 12,
            showPassword: true,
            placeholder: 'Entrez le mot de passe'
          },
          value: vm.systemConfig('base.default_password'),
          editDisabled: true,
          itemProps: {
            class: { yxtInput: true }
          }
        },
        disabled: true,
        valueResolve (row, key) {
          if (row.password) {
            row.password = vm.$md5(row.password)
          }
        }
      },
      {
        title: 'Nom complet',
        key: 'name',
        sortable: 'custom',
        minWidth: 120,
        search: {
          disabled: false
        },
        type: 'input',
        form: {
          rules: [
            {
              required: true,
              message: 'Le nom complet est requis'
            }
          ],
          component: {
            span: 12,
            placeholder: 'Entrez le nom complet'
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'Département',
        key: 'dept',
        search: {
          disabled: false
        },
        minWidth: 140,
        type: 'tree-selector',
        dict: {
          cache: true,
          isTree: true,
          url: '/api/system/dept/all_dept/',
          value: 'id',
          label: 'name'
        },
        form: {
          rules: [
            {
              required: true,
              message: 'Ce champ est requis'
            }
          ],
          itemProps: {
            class: { yxtInput: true }
          },
          component: {
            span: 12,
            pagination: true,
            props: { multiple: false }
          }
        },
        component: {
          name: 'foreignKey',
          valueBinding: 'dept_name'
        }
      },
      {
        title: 'Rôles',
        key: 'role',
        search: {
          disabled: true
        },
        minWidth: 130,
        type: 'table-selector',
        dict: {
          cache: false,
          url: '/api/system/role/',
          value: 'id',
          label: 'name',
          getData: (url, dict, {
            form,
            component
          }) => {
            return request({
              url: url,
              params: {
                page: 1,
                limit: 10
              }
            }).then(ret => {
              component._elProps.page = ret.data.page
              component._elProps.limit = ret.data.limit
              component._elProps.total = ret.data.total
              return ret.data.data
            })
          }
        },
        form: {
          rules: [
            {
              required: true,
              message: 'Ce champ est requis'
            }
          ],
          itemProps: {
            class: { yxtInput: true }
          },
          component: {
            span: 12,
            pagination: true,
            props: { multiple: true },
            elProps: {
              columns: [
                {
                  field: 'name',
                  title: 'Nom du rôle'
                },
                {
                  field: 'key',
                  title: 'Code du rôle'
                }
              ]
            }
          }
        },
        component: {
          name: 'manyToMany',
          valueBinding: 'role_info',
          children: 'name'
        }
      },
      {
        title: 'Téléphone',
        key: 'mobile',
        search: {
          disabled: false
        },
        minWidth: 120,
        type: 'input',
        form: {
          rules: [
            {
              max: 20,
              message: 'Numéro de téléphone invalide',
              trigger: 'blur'
            }
          ],
          itemProps: {
            class: { yxtInput: true }
          },
          component: {
            placeholder: 'Entrez le numéro de téléphone'
          }
        }
      }, {
        title: 'E-mail',
        key: 'email',
        minWidth: 180,
        form: {
          rules: [
            {
              type: 'email',
              message: 'Adresse email invalide',
              trigger: ['blur', 'change']
            }
          ],
          component: {
            placeholder: 'Entrez votre adresse email'
          }
        }
      },
      {
        title: 'Genre',
        key: 'gender',
        type: 'radio',
        width: 80,
        dict: {
          data: vm.dictionary('gender')
        },
        form: {
          value: 1,
          component: {
            span: 12
          }
        },
        component: { props: { color: 'auto' } }
      }, {
        title: "Type d'utilisateur",
        key: 'user_type',
        search: {
          disabled: false
        },
        width: 145,
        type: 'select',
        dict: {
          data: vm.dictionary('user_type')
        },
        form: {
          show: false,
          value: 0,
          component: {
            span: 12
          }
        }
      }, {
        title: 'Statut',
        key: 'is_active',
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
            span: 12
          }
        }
      },
      {
        title: 'Avatar',
        key: 'avatar',
        type: 'avatar-cropper',
        width: 70,
        align: 'left',
        form: {
          component: {
            props: {
              elProps: {
                multiple: false,
                limit: 1
              },
              sizeLimit: 500 * 1024
            },
            span: 24
          },
          helper: 'Taille maximale : 500 Ko'
        }
      }
    ].concat(vm.commonEndColumns({
      create_datetime: { showTable: false },
      update_datetime: { showTable: false }
    }))
  }
}
