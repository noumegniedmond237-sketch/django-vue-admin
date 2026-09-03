<template>
  <div>
    <el-progress :percentage="currentValue" :color="setColor" :format="format"></el-progress>
  </div>
</template>
<script>
// Version avancée du composant d'affichage en ligne
// Cet exemple montre comment modifier la valeur entrante avant de l'afficher,
export default {
  name: 'table-progress',
  props: {
    // Recevoir la valeur de row.xxx
    value: {
      type: String || Number,
      required: false
    }
  },
  data () {
    return {
      currentValue: ''
    }
  },
  watch: {
    value (value) {
      // this.$emit('change', value)
      if (this.currentValue === value) {
        return
      }
      this.setValue(value)
    }
  },
  created () {
    this.setValue(this.value)
  },
  methods: {
    setValue (value) {
      // Traiter ici la valeur value entrante
      this.currentValue = Number(this.value)
      // Obtenir récursivement le nom correspondant à la clé de la valeurkey
    },
    setColor () {
      if (this.value <= 50) {
        return '#F56C6C'
      } else if (this.value > 50 && this.value < 80) {
        return '#E6A23C'
      } else {
        return '#67C23A'
      }
    },
    format (percentage) {
      return `${percentage}%`
    }
  }
}
</script>
