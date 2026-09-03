import { markRaw } from 'vue'

const resultComps = {}
const requireComponent = require.context(
  './', // Rechercher dans le répertoire courant
  false, // Ne pas parcourir les sous-dossiers
  /\.vue$/ // Correspondance par expression régulière Se baser sur le champ fullPath .vueles fichiers se terminant par .vue
)
requireComponent.keys().forEach(fileName => {
  const comp = requireComponent(fileName)
  resultComps[fileName.replace(/^\.\/(.*)\.\w+$/, '$1')] = comp.default
})
export default markRaw(resultComps)
