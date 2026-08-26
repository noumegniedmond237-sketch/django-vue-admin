<template>
  <el-card shadow="hover" :header="config?.showHeader?.value ? 'À propos du projet' : ''" class="card-view" :style="{backgroundColor:randomColor(),color: config?.fontColor?.value}">
    <p :style="{color: config?.fontColor?.value}">Plateforme complète de gestion et d'administration d'entreprise basée sur le modèle RBAC (rôles et permissions). Backend propulsé par Django & Django REST Framework, Frontend développé avec Vue.js et Element UI.
    </p>
  </el-card>
</template>

<script>
export default {
  sort: 9,
  title: 'À propos',
  name: 'about',
  icon: 'el-icon-setting',
  description: 'Informations sur le projet et la plateforme',
  height: 20,
  width: 16,
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
    randomColor () {
      if (this.config?.color?.value) {
        return this.config.color.value
      }
      return this.$util.randomColor()
    }
  }
}
</script>

<style scoped lang="scss">
.card-view {
  color: $color-primary;

  p {
    font-size: 0.9em;
    line-height: 1.6;
    color: $color-primary;
  }
}
.el-card{
  height: 100%;
}
::v-deep .el-card__body {
  height: 110px;
}
</style>
