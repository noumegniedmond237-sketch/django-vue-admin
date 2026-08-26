<template>
  <el-card
    shadow="hover"
    :header="config?.showHeader?.value ? 'Informations de Version' : ''"
    class="card-view"
    :style="{backgroundColor:randomColor(),color: config?.fontColor?.value}"
  >
    <div style="text-align: center;">
      <h2 style="margin-top: 5px;">{{ title }}</h2>
      <p style="margin-top: 5px;">Dernière version : {{ ver }}</p>
    </div>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  sort: 10,
  title: 'Informations de Version',
  name: 'ver',
  icon: 'el-icon-monitor',
  description: 'Version actuelle du système',
  height: 14,
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
    return {
      ver: 'loading...',
      title: ''
    }
  },
  mounted () {
    this.getVer()
  },
  computed: {
    ...mapState('d2admin', {
      siteName: state => state.settings.data['login.site_name']
    })
  },
  methods: {
    async getVer () {
      const rawTitle = this.siteName || process.env.VUE_APP_TITLE || 'Django Vue Admin'
      this.title = (rawTitle === '企业级后台管理系统') ? 'Django Vue Admin' : rawTitle
    },
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
}

::v-deep .el-card__body {
  height: 110px;
}

.el-card {
  height: 100%;
}
</style>
