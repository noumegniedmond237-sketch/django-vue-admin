export default {
  // Configuration des types de champs (utilisable dans crud.js après enregistrement),crud.js
  'table-progress': {
    // Configuration du composant de formulaire
    form: { component: { name: 'form-input', props: { color: 'danger' } } },
    // Configuration du composant de ligne
    component: { name: 'table-progress', props: {} },
    // Centrer lors de l'affichage en ligne
    align: 'center'
    // Vous pouvez écrire d'autres configurations par défaut
  }
}
