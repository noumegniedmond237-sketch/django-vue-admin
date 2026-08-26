<template>
  <el-card
    class="card-view"
    :style="{ backgroundColor: randomColor() }"
    shadow="always"
  >
    <div :style="{color: config?.fontColor?.value}">
      <div>
        <div class="card-content-label">Fichiers</div>
        <i class="real-time">En direct</i>
      </div>
      <div class="absolute-left">
        <div class="card-content">
          <div class="card-content-value">{{ count }}</div>
          <div class="el-icon-document-copy">
            Total fichiers
          </div>
        </div>
      </div>
      <div class="absolute-right">
        <div class="card-content-time">
          <div class="attachment-value">{{ occupy_space }}</div>
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
  sort: 3,
  title: 'Statistiques des Fichiers',
  name: 'attachmentTotal',
  icon: 'el-icon-s-order',
  description: 'Total des fichiers et espace de stockage occupé',
  height: 14,
  width: 16,
  isResizable: true,
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
  data () {
    return {
      count: '',
      occupy_space: ''
    }
  },
  methods: {
    initGet () {
      request({
        url: '/api/system/datav/attachment_total/'
      }).then((res) => {
        this.count = res.data.count
        this.occupy_space = this.$util.formatBytes(res.data.occupy_space)
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

  .el-icon-document-copy {
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

.absolute-right {
  position: absolute;
  right: 30px;
}

.absolute-left {
  position: absolute;
}
</style>
