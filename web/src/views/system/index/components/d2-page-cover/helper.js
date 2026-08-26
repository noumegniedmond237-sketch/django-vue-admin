export default {
  crud: `  columns: [
    {
      title: 'Date',
      key: 'date',
      type: 'date',
    },
    {
      title: 'Statut',
      key: 'status',
      type: 'select',
      dict: { url: '/dicts/OpenStatusEnum' }
    },
    {
      title: 'Ville',
      key: 'city',
      type: 'select',
      form: {
        component: {
          props: { filterable: true, multiple: true, clearable: true }
        }
      },
      dict: {
        data: [
          { value: 'paris', label: 'Paris' },
          { value: 'lyon', label: 'Lyon' },
          { value: 'marseille', label: 'Marseille' },
          { value: 'toulouse', label: 'Toulouse' }
        ]
      }
    }
  ]
  `
}
