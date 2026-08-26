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
        title: 'Sélection unique',
        key: 'select1',
        sortable: true,
        search: {
          disabled: true
        },
        type: 'select',
        dict: {
          data: [{ value: '1', label: 'Activé' }, { value: '0', label: 'Désactivé' }, { value: '2', label: 'Arrêté' }]
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
