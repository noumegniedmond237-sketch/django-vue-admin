const fs = require('fs')
const path = require('path')

module.exports = () => {
  // Enregistrer les fichiers scss de chaque plugin
  const pluginsScssPath = []
  let components = []
  // Parcourir les fichiers sous @great-dream/ @great-dream/
  const greatDreamDir = path.resolve('./node_modules/@great-dream')
  if (fs.existsSync(greatDreamDir)) {
    const greatDreamFiles = fs.readdirSync(greatDreamDir)
    greatDreamFiles.forEach(file => {
      const scssPath = path.join(greatDreamDir, file, 'src', 'index.scss')
      if (fs.existsSync(scssPath)) {
        components.push(file)
      }
    })
  }

  // Parcourir les fichiers sous ./src/views/plugins
  const pluginsDir = path.resolve('./src/views/plugins')
  if (fs.existsSync(pluginsDir)) {
    const pluginFiles = fs.readdirSync(pluginsDir)
    pluginFiles.forEach(file => {
      const scssPath = path.join(pluginsDir, file, 'src', 'index.scss')
      if (fs.existsSync(scssPath)) {
        components.push(file)
      }
    })
  }
  components = Array.from(new Set(components))
  components.filter(async (key, index) => {
    const pluginDirectories = ['./src/views/plugins/', './node_modules/@great-dream/']
    // const pluginDirectories = ['./node_modules/@great-dream/']
    pluginDirectories.forEach(directory => {
      const scssPath = directory + key + '/src/index.scss'
      if (fs.existsSync(scssPath)) {
        pluginsScssPath.push('"' + scssPath.replace('./src/views/plugins/', '~@/views/plugins/').replace('./node_modules/@great-dream/', '~@great-dream/') + '"')
        console.log(`[${key}] scssenregistré avec succès`)
        return true
      }
      return false
    })
  })
  return pluginsScssPath
}
