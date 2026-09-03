export default {
  // Configuration des types de champs (utilisable dans crud.js après enregistrement),crud.js
  'card-select': {
    // Configuration du composant de formulaire
    form: { component: { name: 'card-select-form', props: { color: 'danger' } } },
    // Configuration du composant de ligne
    component: { name: 'values-format', props: {} },
    // Centrer lors de l'affichage en ligne
    align: 'center'
    // Vous pouvez écrire d'autres configurations par défaut
  }
}
