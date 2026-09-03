/*
 * @date-de-creation: 2021-08-02 23:55:30
 * @Auther: Yuan Xiaotian
 * @derniere-modification-par: Yuan Xiaotian
 * @derniere-modification-le: 2021-08-08 12:27:45
 * Contact QQ : 1638245306
 * @description-fichier:
 */
export default {
  // Configuration des types de champs (utilisable dans crud.js après enregistrement),crud.js
  'selector-table': {
    // Configuration du composant de formulaire
    form: { component: { name: 'selector-table-input', props: { color: 'danger' } } },
    // Configuration du composant de ligne
    component: { name: 'values-format', props: {} },
    // Centrer lors de l'affichage en ligne
    align: 'center'
    // Vous pouvez écrire d'autres configurations par défaut
  }
}
