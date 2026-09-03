import util from '@/libs/util.js'

export default {
  'image-uploader': {
    form: { component: { name: 'd2p-file-uploader', props: { elProps: { listType: 'picture-card', accept: '.png,.jpeg,.jpg,.ico,.bmp,.gif' } } } },
    component: { name: 'd2p-images-format' },
    view: {
      component: { props: { height: 100, width: 100 } }
    },
    align: 'center',
    // Au moment de la soumission, traiter les données
    valueResolve (row, col) {
      const value = row[col.key]
      if (value != null) {
        if (value.length >= 0) {
          if (value instanceof Array) {
            // Retirer le préfixe
            row[col.key] = value.map(str => str.replace(util.baseURL(), '')).toString()
          } else {
            // Retirer le préfixe
            row[col.key] = value.replace(util.baseURL(), '')
          }
        } else {
          row[col.key] = null
        }
      }
    },
    // Au moment de la réception, traiter les données
    valueBuilder (row, col) {
      const value = row[col.key]
      if (value != null && value) {
        row[col.key] = value.split(',')
        // Assembler et corriger l'adresse,
        row[col.key].map((val, index) => {
          if (val.startsWith('/api')) {
            row[col.key][index] = val
          } else if (val.startsWith('/')) {
            row[col.key][index] = util.baseURL() + val.slice(1)
          } else {
            row[col.key][index] = !val.startsWith('http') ? util.baseURL() + val : val
          }
        })
      }
    }
  },
  'avatar-uploader': {
    form: { component: { name: 'd2p-file-uploader', props: { elProps: { limit: 1, listType: 'avatar', accept: '.png,.jpeg,.jpg,.ico,.bmp,.gif', showFileList: false } } } },
    component: { name: 'd2p-images-format' },
    view: {
      component: { props: { height: 100, width: 100 } }
    },
    align: 'center',
    // Au moment de la soumission, traiter les données
    valueResolve (row, col) {
      const value = row[col.key]
      if (value != null) {
        if (value.length >= 0) {
          if (value instanceof Array) {
            // Retirer le préfixe
            row[col.key] = value.map(str => str.replace(util.baseURL(), '')).toString()
          } else {
            // Retirer le préfixe
            row[col.key] = value.replace(util.baseURL(), '')
          }
        } else {
          row[col.key] = null
        }
      }
    },
    // Au moment de la réception, traiter les données
    valueBuilder (row, col) {
      const value = row[col.key]
      if (value != null && value) {
        row[col.key] = value.split(',')
        // Assembler et corriger l'adresse,
        row[col.key].map((val, index) => {
          if (val.startsWith('/api')) {
            row[col.key][index] = val
          } else if (val.startsWith('/')) {
            row[col.key][index] = util.baseURL() + val.slice(1)
          } else {
            row[col.key][index] = !val.startsWith('http') ? util.baseURL() + val : val
          }
        })
      }
    }
  },
  'video-uploader': {
    form: { component: { name: 'd2p-file-uploader', props: { elProps: { limit: 1, listType: 'video', accept: '.avi,.wmv,.mpg,.mpeg,.mov,.rm,.ram,.swf,.flv,.mp4,.mp3,.wma,.avi,.rm,.rmvb,.flv,.mpg,.mkv', showFileList: false } } } },
    component: { name: 'd2p-images-format' },
    view: {
      component: { props: { height: 100, width: 100 } }
    },
    align: 'center',
    // Au moment de la soumission, traiter les données
    valueResolve (row, col) {
      const value = row[col.key]
      if (value != null) {
        if (value.length >= 0) {
          if (value instanceof Array) {
            // Retirer le préfixe
            row[col.key] = value.map(str => str.replace(util.baseURL(), '')).toString()
          } else {
            // Retirer le préfixe
            row[col.key] = value.replace(util.baseURL(), '')
          }
        } else {
          row[col.key] = null
        }
      }
    },
    // Au moment de la réception, traiter les données
    valueBuilder (row, col) {
      const value = row[col.key]
      if (value != null && value) {
        row[col.key] = value.split(',')
        // Assembler et corriger l'adresse,
        row[col.key].map((val, index) => {
          if (val.startsWith('/api')) {
            row[col.key][index] = val
          } else if (val.startsWith('/')) {
            row[col.key][index] = util.baseURL() + val.slice(1)
          } else {
            row[col.key][index] = !val.startsWith('http') ? util.baseURL() + val : val
          }
        })
      }
    }
  },
  'file-uploader': {
    form: { component: { name: 'd2p-file-uploader', props: { elProps: { listType: 'text' } } } },
    component: { name: 'd2p-files-format' },
    // Au moment de la soumission, traiter les données
    valueResolve (row, col) {
      const value = row[col.key]
      if (value != null) {
        if (value.length >= 0) {
          if (value instanceof Array) {
            // Retirer le préfixe
            row[col.key] = value.map(str => str.replace(util.baseURL(), '')).toString()
          } else {
            // Retirer le préfixe
            row[col.key] = value.replace(util.baseURL(), '')
          }
        } else {
          row[col.key] = null
        }
      }
    },
    // Au moment de la réception, traiter les données
    valueBuilder (row, col) {
      const value = row[col.key]
      if (value != null && value) {
        row[col.key] = value.split(',')
        // Assembler et corriger l'adresse,
        row[col.key].map((val, index) => {
          if (val.startsWith('/api')) {
            row[col.key][index] = val
          } else if (val.startsWith('/')) {
            row[col.key][index] = util.baseURL() + val.slice(1)
          } else {
            row[col.key][index] = !val.startsWith('http') ? util.baseURL() + val : val
          }
        })
      }
    }
  },
  'avatar-cropper': {
    form: { component: { name: 'd2p-cropper-uploader', props: { accept: '.png,.jpeg,.jpg,.ico,.bmp,.gif', cropper: { viewMode: 1 } } } },
    component: { name: 'd2p-images-format' },
    align: 'center',
    view: {
      component: { props: { height: 100, width: 100 } }
    },
    // Au moment de la soumission, traiter les données
    valueResolve (row, col) {
      const value = row[col.key]
      if (value != null) {
        if (value.length >= 0) {
          if (value instanceof Array) {
            // Retirer le préfixe
            row[col.key] = value.map(str => str.replace(util.baseURL(), '')).toString()
          } else {
            // Retirer le préfixe
            row[col.key] = value.replace(util.baseURL(), '')
          }
        } else {
          row[col.key] = null
        }
      }
    },
    // Au moment de la réception, traiter les données
    valueBuilder (row, col) {
      const value = row[col.key]
      if (value != null && value) {
        row[col.key] = value.split(',')
        // Assembler et corriger l'adresse,
        row[col.key].map((val, index) => {
          if (val.startsWith('/api')) {
            row[col.key][index] = val
          } else if (val.startsWith('/')) {
            row[col.key][index] = util.baseURL() + val.slice(1)
          } else {
            row[col.key][index] = !val.startsWith('http') ? util.baseURL() + val : val
          }
        })
      }
    }
  },
  'tree-selector': {
    form: { component: { name: 'd2p-tree-selector', props: { } } },
    component: { name: 'values-format', props: {} }
  },
  'input-required': {
    form: {
      component: {
        props: { },
        clearable: true,
        placeholder: 'Veuillez saisir...'
      },
      rules: [{ required: true, message: 'Ce champ est requis' }],
      itemProps: {
        class: { yxtInput: true }
      }
    }
  },
  input: {
    form: {
      component: {
        props: { },
        clearable: true,
        placeholder: 'Veuillez saisir...'
      },
      itemProps: {
        class: { yxtInput: true }
      }
    }
  },
  'editor-ueditor': {
    form: {
      component: {
        name: 'd2p-ueditor',
        span: 24,
        props: {
          config: {
            serverUrl: util.baseURL() + 'api/system/file/ueditor/',
            headers: { Authorization: 'JWT ' + util.cookies.get('token') },
            // Pack de langue français (web/public/lib/UEditor/lang/fr/fr.js)
            lang: 'fr',
            imageUrlPrefix: util.baseFileURL(),
            // Téléversement d'image gribouillée
            scrawlUrlPrefix: util.baseFileURL(),
            // Téléversement via l'outil de capture
            snapscreenUrlPrefix: util.baseFileURL(),
            // Préfixe de chemin pour les images distantes
            catcherUrlPrefix: util.baseFileURL(),
            // Préfixe du chemin d'accès aux vidéos
            videoUrlPrefix: util.baseFileURL(),
            // Préfixe du chemin d'accès aux fichiers
            fileUrlPrefix: util.baseFileURL(),
            // Lister les images du répertoire indiqué
            imageManagerUrlPrefix: util.baseFileURL(),
            // Lister les fichiers du répertoire indiqué
            fileManagerUrlPrefix: util.baseFileURL()
            // Transmettre la configuration à ueditor
            // Référence de la documentation: http://fex.baidu.com/ueditor/#start-config
          }
        }
      }
    }
  }
}
