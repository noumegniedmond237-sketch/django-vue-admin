import { request } from '@/api/service'
export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    options: {
      height: '100%'
    },
    viewOptions: {
      componentType: 'row'
    },
    formOptions: {
      defaultSpan: 12
    },
    columns: [
      {
        title: 'ID',
        key: 'id',
        width: 90,
        form: {
          disabled: true
        }
      },
      {
        title: 'Sélection locale',
        key: 'select1',
        sortable: true,
        search: {
          disabled: true
        },
        type: 'table-selector',
        dict: {
          url: '/api/system/user/',
          value: 'id',
          label: 'name',
          getData: (url, dict, { form, component }) => {
            return request({ url: url, params: { page: 1, limit: 1 } }).then(ret => {
              component._elProps.page = ret.data.page
              component._elProps.limit = ret.data.limit
              component._elProps.total = ret.data.total

              return ret.data.data
            })
          }
        },
        form: {
          component: {
            span: 12,
            props: { multiple: true },
            elProps: {
              pagination: true,
              columns: [
                {
                  field: 'name',
                  title: 'Nom'
                },
                {
                  field: 'username',
                  title: 'Identifiant'
                },
                {
                  field: 'role',
                  title: 'ID Rôle'
                },
                {
                  field: 'dept',
                  title: 'ID Département'
                }
              ]
            }
          }
        }
      },
      {
        title: 'Avatar',
        key: 'image',
        type: 'avatar-uploader',
        width: 150,
        align: 'left',
        form: {
          component: {
            props: {
              elProps: {
                multiple: false,
                limit: 5
              },
              sizeLimit: 50 * 1024
            },
            span: 24
          },
          helper: 'Taille maximale : 50 Ko'
        }
      },
      {
        title: 'Images',
        key: 'files',
        type: 'image-uploader',
        width: 150,
        align: 'left',
        form: {
          component: {
            props: {
              elProps: {
                multiple: false,
                limit: 5
              },
              sizeLimit: 50 * 1024
            },
            span: 24
          },
          helper: 'Taille maximale : 50 Ko'
        }
      },
      {
        title: 'Sélection multiple',
        key: 'select2',
        sortable: true,
        width: 180,
        search: {
          disabled: false,
          title: 'Sélection multiple'
        },
        type: 'select',
        form: {
          title: 'Sélection multiple',
          component: {
            props: {
              filterable: true,
              multiple: true,
              clearable: true
            }
          }
        },
        dict: {
          data: [{ value: 'paris', label: 'Paris' }, { value: 'lyon', label: 'Lyon' }, { value: 'marseille', label: 'Marseille' }, { value: 'toulouse', label: 'Toulouse' }]
        },
        component: { props: { color: 'auto' } }
      }
    ]
  }
}
