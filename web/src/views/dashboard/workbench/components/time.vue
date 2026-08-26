<template>
  <el-card shadow="hover" class="card-view" :style="{backgroundColor: randomColor(),color: config?.fontColor?.value}">
    <div class="time">
      <h2>{{ time }}</h2>
      <p>{{ day }}</p>
    </div>
  </el-card>
</template>

<script>
import dayjs from 'dayjs'

export default {
  sort: 12,
  title: 'Horloge',
  name: 'myTime',
  icon: 'el-icon-alarm-clock',
  description: "Affichage de l'heure et de la date en direct",
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
      time: '',
      day: ''
    }
  },
  mounted () {
    this.showTime()
    setInterval(() => {
      this.showTime()
    }, 1000)
  },
  methods: {
    showTime () {
      this.time = dayjs().format('HH:mm:ss')
      this.day = dayjs().format('DD/MM/YYYY')
    },
    randomColor () {
      if (this.config?.color?.value) {
        return this.config.color.value
      }
      return 'linear-gradient(to right, #8E54E9, #4776E6)'
    }
  }
}
</script>

<style scoped lang="scss">
.card-view {
  color: $color-primary;
}

.time h2 {
  font-size: 24px;
}

.time p {
  font-size: 18px;
  margin-top: 10px;
  opacity: 0.7;
}
::v-deep .el-card__body {
  height: 110px;

}
.el-card{
  height: 100%;
}
</style>
