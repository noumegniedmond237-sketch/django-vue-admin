const log = [
  {
    i: 'usersTotal0',
    x: 0,
    y: 0,
    w: 12,
    h: 12,
    config: {
      color: {
        label: "Couleur d'arrière-plan",
        type: 'color',
        value: 'rgba(255, 255, 255, 1)',
        placeholder: 'Laissez vide pour couleur aléatoire'
      },
      fontColor: {
        label: 'Couleur du texte',
        type: 'color',
        value: null,
        placeholder: 'Sélectionnez la couleur du texte'
      }
    },
    isResizable: true,
    element: 'usersTotal',
    moved: false
  },
  {
    i: 'loginTotal1',
    x: 12,
    y: 0,
    w: 12,
    h: 12,
    config: {
      color: {
        label: "Couleur d'arrière-plan",
        type: 'color',
        value: 'rgba(255, 255, 255, 1)',
        placeholder: 'Laissez vide pour couleur aléatoire'
      },
      fontColor: {
        label: 'Couleur du texte',
        type: 'color',
        value: null,
        placeholder: 'Sélectionnez la couleur du texte'
      }
    },
    isResizable: true,
    element: 'loginTotal',
    moved: false
  },
  {
    i: 'attachmentTotal2',
    x: 24,
    y: 0,
    w: 12,
    h: 12,
    config: {
      color: {
        label: "Couleur d'arrière-plan",
        type: 'color',
        value: 'rgba(255, 255, 255, 1)',
        placeholder: 'Laissez vide pour couleur aléatoire'
      },
      fontColor: {
        label: 'Couleur du texte',
        type: 'color',
        value: null,
        placeholder: 'Sélectionnez la couleur du texte'
      }
    },
    isResizable: true,
    element: 'attachmentTotal',
    moved: false
  },
  {
    i: 'databaseTotal3',
    x: 36,
    y: 0,
    w: 12,
    h: 12,
    config: {
      color: {
        label: "Couleur d'arrière-plan",
        type: 'color',
        value: 'rgba(255, 255, 255, 1)',
        placeholder: 'Laissez vide pour couleur aléatoire'
      },
      fontColor: {
        label: 'Couleur du texte',
        type: 'color',
        value: null,
        placeholder: 'Sélectionnez la couleur du texte'
      }
    },
    isResizable: true,
    element: 'databaseTotal',
    moved: false
  },
  {
    i: 'userLogin6',
    x: 14,
    y: 12,
    w: 17,
    h: 24,
    config: {},
    isResizable: true,
    element: 'userLogin',
    moved: false
  },
  {
    i: 'registeredUser7',
    x: 31,
    y: 12,
    w: 17,
    h: 24,
    config: {},
    isResizable: true,
    element: 'registeredUser',
    moved: false
  },
  {
    i: 'dashboardImg8',
    x: 14,
    y: 58,
    w: 16,
    h: 14,
    config: {
      src: {
        label: "URL de l'image",
        type: 'input',
        value: 'https://kfm-waiter.oss-cn-zhangjiakou.aliyuncs.com/dvadmin/img/chajianshichang.jpg',
        placeholder: "Entrez l'URL de l'image",
        rules: [
          {
            required: true,
            message: 'Ce champ est requis'
          }
        ]
      },
      url: {
        label: 'Lien de redirection',
        type: 'input',
        placeholder: 'Entrez le lien',
        value: 'https://bbs.django-vue-admin.com/plugMarket.html',
        rules: [
          {
            required: true,
            message: 'Ce champ est requis'
          }
        ]
      }
    },
    isResizable: true,
    element: 'dashboardImg',
    moved: false
  },
  {
    i: 'dashboardImg9',
    x: 0,
    y: 58,
    w: 14,
    h: 14,
    config: {
      src: {
        label: "URL de l'image",
        type: 'input',
        value: '/image/card/tencent.jpg',
        placeholder: "Entrez l'URL de l'image",
        rules: [
          {
            required: true,
            message: 'Ce champ est requis'
          }
        ]
      },
      url: {
        label: 'Lien de redirection',
        type: 'input',
        placeholder: 'Entrez le lien',
        value: 'https://cloud.tencent.com/act/cps/redirect?redirect=1060&cps_key=b302a514a6688aa30823fac954464e5d&from=console',
        rules: [
          {
            required: true,
            message: 'Ce champ est requis'
          }
        ]
      }
    },
    isResizable: true,
    element: 'dashboardImg',
    moved: false
  },
  {
    i: 'dashboardImg10',
    x: 30,
    y: 58,
    w: 18,
    h: 14,
    config: {
      src: {
        label: "URL de l'image",
        type: 'input',
        value: 'https://kfm-waiter.oss-cn-zhangjiakou.aliyuncs.com/dvadmin/img/aliyun-02.png',
        placeholder: "Entrez l'URL de l'image",
        rules: [
          {
            required: true,
            message: 'Ce champ est requis'
          }
        ]
      },
      url: {
        label: 'Lien de redirection',
        type: 'input',
        placeholder: 'Entrez le lien',
        value: 'https://www.aliyun.com/minisite/goods?userCode=jpef8a71&share_source=copy_link',
        rules: [
          {
            required: true,
            message: 'Ce champ est requis'
          }
        ]
      }
    },
    isResizable: true,
    element: 'dashboardImg',
    moved: false
  },
  {
    i: 'usersActive11',
    x: 0,
    y: 12,
    w: 14,
    h: 24,
    config: {
      color: {
        label: "Couleur d'arrière-plan",
        type: 'color',
        value: '',
        placeholder: 'Laissez vide pour couleur aléatoire'
      },
      fontColor: {
        label: 'Couleur du texte',
        type: 'color',
        value: null,
        placeholder: 'Sélectionnez la couleur du texte'
      }
    },
    isResizable: true,
    element: 'usersActive',
    moved: false
  },
  {
    i: 'ver11',
    x: 35,
    y: 36,
    w: 13,
    h: 22,
    config: {
      showHeader: {
        label: "Afficher l'en-tête",
        type: 'boot',
        value: true,
        placeholder: ''
      },
      color: {
        label: "Couleur d'arrière-plan",
        type: 'color',
        value: 'rgba(255, 255, 255, 1)',
        placeholder: 'Laissez vide pour couleur aléatoire'
      },
      fontColor: {
        label: 'Couleur du texte',
        type: 'color',
        value: null,
        placeholder: 'Sélectionnez la couleur du texte'
      }
    },
    isResizable: true,
    element: 'ver',
    moved: false
  },
  {
    i: 'loginRegion12',
    x: 0,
    y: 36,
    w: 35,
    h: 22,
    config: {},
    isResizable: true,
    element: 'loginRegion',
    moved: false
  }
]
export default log
