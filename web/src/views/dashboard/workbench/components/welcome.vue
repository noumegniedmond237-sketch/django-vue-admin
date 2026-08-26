<template>
  <el-card
    shadow="hover"
    :header="config?.showHeader?.value ? 'Bienvenue' : ''"
    class="card-view"
    :style="{background: randomColor(), color: config?.fontColor?.value}">
    <div class="welcome">
      <div class="logo">
        <img src="/image/django-vue-admin.png">
        <h2>Bienvenue sur Django-Vue-Admin</h2>
      </div>
      <div class="tips">
        <div class="tips-item">
          <div class="tips-item-icon">
            <i class="el-icon-menu"></i>
          </div>
          <div class="tips-item-message">Voici votre console d'administration. Cliquez sur "Personnaliser" pour ajouter, déplacer ou réorganiser les widgets.</div>
        </div>
        <div class="tips-item">
          <div class="tips-item-icon">
            <i class="el-icon-star-on"></i>
          </div>
          <div class="tips-item-message">Solution complète d'administration basée sur Django REST Framework et Vue.js, prête à l'emploi.</div>
        </div>
        <div class="tips-item">
          <div class="tips-item-icon">
            <i class="el-icon-milk-tea"></i>
          </div>
          <div class="tips-item-message">Architecture modulaire, gestion des rôles (RBAC), sécurité renforcée et performances optimales.</div>
        </div>
      </div>
      <div class="actions">
        <el-button type="primary" icon="el-icon-document" size="large" @click="godoc">Documentation</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  sort: 11,
  title: 'Bienvenue',
  name: 'welcome',
  icon: 'el-icon-present',
  description: 'Présentation de la plateforme et documentation',
  width: 16,
  height: 45,
  isResizable: true,
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
      value: '',
      placeholder: 'Laissez vide pour couleur aléatoire'
    },
    fontColor: {
      label: 'Couleur du texte',
      type: 'color',
      value: '',
      placeholder: 'Sélectionnez la couleur du texte'
    }
  },
  props: {
    config: {
      type: Object,
      required: false
    }
  },
  data () {
    return {}
  },
  methods: {
    godoc () {
      window.open('https://www.django-vue-admin.com/')
    },
    randomColor () {
      if (this.config?.color?.value) {
        return this.config.color.value
      }
      return 'linear-gradient(150deg, #3b88ec 0%, #accaff 100%)'
    }
  }
}
</script>

<style scoped lang="scss">
.card-view {
  color: $color-primary;
}
.welcome .logo {
  text-align: center;
}

.welcome .logo img {
  vertical-align: bottom;
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.welcome .logo h2 {
  font-size: 24px;
  font-weight: normal;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tips {
  margin-top: 20px;
  padding: 0 40px;
}

.tips-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7.5px 0;
}

.tips-item-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 18px;
  margin-right: 20px;
  color: var(--el-color-primary);
  background: rgba(180, 180, 180, 0.1);
}

.tips-item-message {
  flex: 1;
  font-size: 14px;
}

.actions {
  text-align: center;
  margin-top: 20px;
}
.el-card{
  height: 100%;
}
</style>
