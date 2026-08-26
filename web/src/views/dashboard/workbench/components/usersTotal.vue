<template>
  <el-card class="card-view" :style="{backgroundColor:randomColor(),color: config?.fontColor?.value}" shadow="always">
    <div>
      <el-row type="flex" justify="space-around" style="padding:10px">
        <el-col :span="12">
          <div class="card-content">
            <div class="card-content-label">Utilisateurs Totaux</div>
            <div class="card-content-value">{{ usersTotal }}</div>
          </div>
        </el-col>
        <el-col :span="6" :offset="6" style="text-align: right;">
          <i class="el-icon-user-solid" size="48px"></i>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { request } from '@/api/service'

export default {
  sort: 1,
  title: 'Utilisateurs Totaux',
  icon: 'el-icon-user-solid',
  description: 'Nombre total d\'utilisateurs enregistrés',
  name: 'usersTotal',
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
      usersTotal: ''
    }
  },
  methods: {
    initGet () {
      request({
        url: '/api/system/datav/users_total/'
      }).then((res) => {
        this.usersTotal = res.data.users_total
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
      font-size: 1em;
    }

    .card-content-value {
      margin-top: 10px;
      font-size: 1.5em;
      font-weight: bold;
    }
  }
}

.el-icon-user-solid {
  font-size: 30px;
}

.el-card {
  height: 100%;
}
</style>
