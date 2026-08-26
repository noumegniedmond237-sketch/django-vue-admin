import { request } from '@/api/service'

export const crudOptions = (vm) => {
  return {
    indexRow: {
      width: 60,
      title: 'N°',
      align: 'center'
    },
    options: {
      tableType: 'vxe-table',
      rowKey: true,
      height: '100%'
    },
    rowHandle: {
      width: 160,
      fixed: 'right',
      view: false,
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
        text: '',
        show () {
          return vm.tabActivted !== 'receive'
        },
        disabled () {
          return !vm.hasPermissions('Delete')
        }
      },
      custom: [
        {
          thin: true,
          text: null,
          icon: 'el-icon-view',
          size: 'small',
          disabled () {
            return !vm.hasPermissions('Retrieve')
          },
          order: 1,
          emit: 'onView'
        }
      ]
    },
    columns: [
      {
        title: 'ID',
        key: 'id',
        width: 80,
        form: { disabled: true }
      },
      {
        title: 'Titre',
        key: 'title',
        search: {
          disabled: false
        },
        width: 200,
        form: {
          rules: [
            {
              required: true,
              message: 'Le titre est requis'
            }
          ],
          component: { span: 24, placeholder: 'Entrez le titre du message' }
        }
      },
      {
        title: 'Statut de lecture',
        key: 'is_read',
        type: 'select',
        width: 130,
        show () {
          return vm.tabActivted === 'receive'
        },
        dict: {
          data: [
            { label: 'Lu', value: true, color: 'success' },
            { label: 'Non lu', value: false, color: 'danger' }
          ]
        },
        form: {
          disabled: true
        }
      },
      {
        title: 'Cible de diffusion',
        key: 'target_type',
        type: 'radio',
        width: 140,
        show () {
          return vm.tabActivted === 'send'
        },
        dict: { data: [{ value: 0, label: 'Utilisateurs' }, { value: 1, label: 'Rôles' }, { value: 2, label: 'Départements' }, { value: 3, label: 'Tous (Annonce)' }] },
        form: {
          component: {
            span: 24,
            props: {
              type: 'el-radio-button'
            }
          },
          rules: [
            {
              required: true,
              message: 'Veuillez sélectionner la cible',
              trigger: ['blur', 'change']
            }
          ]
        }
      },
      {
        title: 'Destinataires (Utilisateurs)',
        key: 'target_user',
        search: {
          disabled: true
        },
        width: 160,
        type: 'table-selector',
        disabled: true,
        dict: {
          cache: false,
          url: '/api/system/user/',
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
            span: 24,
            show (context) {
              return context.form.target_type === 0
            },
            pagination: true,
            props: { multiple: true },
            elProps: {
              columns: [
                {
                  field: 'name',
                  title: 'Nom'
                },
                {
                  field: 'phone',
                  title: 'Téléphone'
                }
              ]
            }
          }
        },
        component: {
          name: 'manyToMany',
          valueBinding: 'user_info',
          children: 'name'
        }
      },
      {
        title: 'Destinataires (Rôles)',
        key: 'target_role',
        search: {
          disabled: true
        },
        disabled: true,
        width: 160,
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
            span: 24,
            show (context) {
              return context.form.target_type === 1
            },
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
                  title: 'Clé du rôle'
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
        title: 'Destinataires (Départements)',
        key: 'target_dept',
        search: {
          disabled: true
        },
        width: 160,
        type: 'table-selector',
        dict: {
          cache: false,
          url: '/api/system/dept/all_dept/',
          isTree: true,
          value: 'id',
          label: 'name',
          children: 'children',
          getData: (url, dict, {
            form,
            component
          }) => {
            return request({
              url: url
            }).then(ret => {
              return ret.data
            })
          }
        },
        disabled: true,
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
            span: 24,
            show (context) {
              return context.form.target_type === 2
            },
            props: {
              multiple: true,
              elProps: {
                treeConfig: {
                  transform: true,
                  rowField: 'id',
                  parentField: 'parent',
                  expandAll: true
                },
                columns: [
                  {
                    field: 'name',
                    title: 'Département',
                    treeNode: true
                  },
                  {
                    field: 'status_label',
                    title: 'Statut'
                  },
                  {
                    field: 'parent_name',
                    title: 'Parent'
                  }
                ]
              }
            }
          }
        },
        component: {
          name: 'manyToMany',
          valueBinding: 'dept_info',
          children: 'name'
        }
      },
      {
        title: 'Contenu',
        key: 'content',
        minWidth: 300,
        type: 'editor-quill',
        form: {
          rules: [
            {
              required: true,
              message: 'Le contenu est requis'
            }
          ],
          component: {
            disabled: () => {
              return vm.getEditForm().disable
            },
            props: {
              uploader: {
                type: 'form'
              }
            },
            events: {
              'text-change': (event) => {
              }
            }
          }
        }
      }
    ].concat(vm.commonEndColumns({
      create_datetime: { showTable: true },
      update_datetime: { showTable: false }
    }))
  }
}
