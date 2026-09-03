export default {
  // Configuration des types de champs (utilisable dans crud.js après enregistrement),crud.js
  'table-list-selector': {
    // Configuration du composant de formulaire
    form: { component: { name: 'table-list-selector-input', props: { color: 'danger' } } },
    // Configuration du composant de ligne
    component: { name: 'values-format', props: {} },
    // Centrer lors de l'affichage en ligne
    align: 'center'
    // Vous pouvez écrire d'autres configurations par défaut
  }
}
