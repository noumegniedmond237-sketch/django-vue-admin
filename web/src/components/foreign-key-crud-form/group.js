export default {
  // Configuration des types de champs (utilisable dans crud.js après enregistrement),crud.js
  'foreign-key-crud-form': {
    // Configuration du composant de ligne
    form: { component: { name: 'foreign-key-crud-form', props: { color: 'danger' } } },
    component: {
      name: 'values-popover',
      props: {
        elProps: {
          type: 'list',
          rowKey: 'name'
        }
      }
    },
    // Centrer lors de l'affichage en ligne
    align: 'center'
    // Vous pouvez écrire d'autres configurations par défaut
  }
}
