<template>
  <div>
    <el-tag v-if="currentValue" :type="color">{{ currentValue }}</el-tag>
    <span v-else></span>
  </div>
</template>
<script>
// Version avancée du composant d'affichage en ligne
// Cet exemple montre comment modifier la valeur entrante avant de l'afficher,
export default {
  name: 'foreign-key',
  props: {
    color: {
      require: false
    },
    value: {
      type: [String, Number],
      required: false
    }
  },
  data () {
    return {
      currentValue: ''
    }
  },
  watch: {
    value (nv, ov) {
      const { row } = this.$parent.scope
      const valueBinding = this.$parent.valueBinding
      this.setValue(row[valueBinding])
    }
  },
  created () {
    const { row } = this.$parent.scope
    const valueBinding = this.$parent.valueBinding
    this.setValue(row[valueBinding])
  },
  methods: {
    setValue (value) {
      // Traiter ici la valeur value entrante
      this.currentValue = value
    }
  }
}
</script>
