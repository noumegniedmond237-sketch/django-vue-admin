export default {
  // Raccourcis clavier
  // Prise en charge des raccourcis ex. ctrl+shift+s
  hotkey: {
    search: {
      open: 's',
      close: 'esc'
    }
  },
  // Configuration par défaut de la barre latérale
  menu: {
    asideCollapse: false,
    asideTransition: true
  },
  // Page par défaut en cas d'échec de lecture des données persistées
  page: {
    opened: [
      {
        name: 'index',
        fullPath: '/index',
        meta: {
          title: 'Tableau de bord',
          auth: false
        }
      }
    ]
  },
  // Recherche dans le menu
  search: {
    enable: true
  },
  // Thèmes enregistrés
  theme: {
    list: [
      {
        title: 'D2Admin Classique',
        name: 'd2',
        preview: 'image/theme/d2/preview@2x.png'
      },
      {
        title: 'Chester',
        name: 'chester',
        preview: 'image/theme/chester/preview@2x.jpg'
      },
      {
        title: 'Element',
        name: 'element',
        preview: 'image/theme/element/preview@2x.jpg'
      },
      {
        title: 'Violet',
        name: 'violet',
        preview: 'image/theme/violet/preview@2x.jpg'
      },
      {
        title: 'Lignes Épurées',
        name: 'line',
        backgroundImage: 'image/theme/line/bg.jpg',
        preview: 'image/theme/line/preview@2x.jpg'
      },
      {
        title: 'Météore',
        name: 'star',
        backgroundImage: 'image/theme/star/bg.jpg',
        preview: 'image/theme/star/preview@2x.jpg'
      },
      {
        title: 'Tomorrow Night Blue (VSCode)',
        name: 'tomorrow-night-blue',
        preview: 'image/theme/tomorrow-night-blue/preview@2x.jpg'
      }
    ]
  },
  // Indique si l'animation de changement de page est activée par défaut
  transition: {
    active: true
  }
}
