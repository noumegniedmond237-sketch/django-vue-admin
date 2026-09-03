import Vue from 'vue'

function importAll (r) {
  const __modules = []
  r.keys().forEach(key => {
    if (!key.match(new RegExp('^test_.*$')) && key.split('/').length >= 3) {
      __modules.push(key.split('/')[1])
    }
  })
  return __modules
}

export const checkPlugins = function install (pluginName) {
  let pluginsList
  pluginsList = importAll(require.context('./', true, /index\.js$/))
  if (pluginsList && pluginsList.indexOf(pluginName) !== -1) {
    try {
      const Module = import('@/views/plugins/' + pluginName + '/src/index')
      // Enregistrer le composant
      if (Module.default) {
        Vue.use(Module.default)
      }
      // Plugin local
      return 'local'
    } catch (exception) {}
  }
  pluginsList = importAll(require.context('@great-dream/', true, /index\.js$/))
  if (pluginsList && pluginsList.indexOf(pluginName) !== -1) {
    // node_modules Plugins encapsulés dans node_modules
    try {
      const Module = import('@great-dream/' + pluginName + '/src/index')
      // Enregistrer le composant
      if (Module.default) {
        Vue.use(Module.default)
      }
      // Plugin local
      return 'plugins'
    } catch (exception) {}
  }
  // Plugin introuvable
  return undefined
}

export const plugins = async function install (Vue, options) {
  // Chercher tous les plugins sous src/views/plugins (chaque plugin doit avoir un index.js) src/views/plugins , index.js
  // Chercher ensuite tous les plugins sous node_modules/@great-dream/ node_modules/@great-dream/
  // Dédupliquer puis importer pour l'enregistrement vue
  if (window.pluginsAll) return
  let components = []
  components = components.concat(importAll(require.context('./', true, /index\.js$/)))
  components = components.concat(importAll(require.context('@great-dream/', true, /index\.js$/)))
  components = Array.from(new Set(components))
  components.filter(async (key, index) => {
    try {
      const Module = await import('@/views/plugins/' + key + '/src/index')
      // Enregistrer le composant
      if (Module.default) {
        Vue.use(Module.default)
        return true
      }
      return false
    } catch (exception) {
      try {
        const Module = await import('@great-dream/' + key + '/src/index')
        // Enregistrer le composant
        if (Module.default) {
          Vue.use(Module.default)
          return true
        }
        return false
      } catch (exception) {
        console.log(`[${key}]échec d'enregistrement du plugin:`, exception)
        return false
      }
    }
  })
  console.log('Plugins enregistrés avec succès:', components)
  window.pluginsAll = components
  return components
}

export const getStoreModules = function (Vue, options) {
  // Enregistrer les fichiers Store de chaque plugin
  if (window.storeModules) return
  const storeModules = {}
  let components = []
  components = components.concat(importAll(require.context('./', true, /index\.js$/)))
  components = components.concat(importAll(require.context('@great-dream/', true, /index\.js$/)))
  components = Array.from(new Set(components))
  components.filter(async (key, index) => {
    try {
      const Module = require('@/views/plugins/' + key + '/src/store/index.js')
      // Enregistrer le composant
      if (Module.default) {
        storeModules[Module.default.stateName || key] = Module.default
        console.log(`[${key}]storeenregistré avec succès`)
        return true
      }
      return false
    } catch (exception) {
      try {
        const Module = require('@great-dream/' + key + '/src/store/index.js')
        // Enregistrer le composant
        if (Module.default) {
          storeModules[Module.default.stateName || key] = Module.default
          console.log(`[${key}]storeenregistré avec succès`)
          return true
        }
        return false
      } catch (exception) {
        return false
      }
    }
  })
  window.storeModules = storeModules
  return storeModules
}
