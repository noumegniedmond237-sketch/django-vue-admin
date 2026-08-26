<template>
  <el-card
    class="card-view"
    :style="{ backgroundColor: randomColor() }"
    shadow="always"
  >
    <div :style="{color: config?.fontColor?.value}">
      <div>
        <div class="card-content-label">Base de données</div>
        <i class="real-time">En direct</i>
      </div>
      <div class="absolute-left">
        <div class="card-content">
          <div class="card-content-value">{{ count }}</div>
          <div class="el-icon-coin">
            Nombre de tables
          </div>
        </div>
      </div>
      <div class="absolute-right">
        <div class="card-content-time">
          <div class="attachment-value">{{ space }}</div>
          <div class="el-icon-s-flag">
            Espace occupé
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { request } from '@/api/service'

export default {
  sort: 4,
  title: 'Base de données',
  name: 'databaseTotal',
  icon: 'el-icon-coin',
  description: 'Statistiques et taille de la base de données',
  height: 14,
  width: 16,
  isResizable: true,
  data () {
    return {
      count: '',
      space: ''
    }
  },
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
  methods: {
    initGet () {
      request({
        url: '/api/system/datav/database_total/'
      }).then((res) => {
        this.count = res.data.count
        this.space = this.$util.formatBytes(res.data.space)
      })
    },
    randomColor () {
      if (this.config?.color?.value) {
        return this.config.color.value
      }
      return this.$util.randomColor()
    }
  },
  mounted () {
    this.initGet()
  }
}
</script>

<style scoped lang="scss">
.card-view {
  color: $color-primary;

  .card-content {
    .card-content-label {
      font-size: 0.8em;
    }

    .card-content-value {
      margin-top: 5px;
      font-size: 1.5em;
      font-weight: bold;
    }
  }

  .attachment-value {
    margin-top: 5px;
    font-size: 1.5em;
    font-weight: bold;
  }

  .el-icon-coin {
    font-size: 12px;
  }

  .el-icon-s-flag {
    font-size: 12px;
  }
}

.real-time {
  background: rgb(53, 59, 86);
  color: #ffffff;
  font-size: 14px;
  font-style: normal;
  padding: 0 7px 0 7px;
  border-radius: 4px;
  position: absolute;
  right: 20px;
  top: 20px;
}

.el-card {
  height: 100%;
}
.absolute-right{
  position: absolute;
  right: 30px;
}
.absolute-left{
  position: absolute;
}
</style>
