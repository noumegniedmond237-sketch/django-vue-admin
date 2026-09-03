<template>
  <div>
    {{currentValue}}
  </div>
</template>
<script>
// Version avancée du composant d'affichage en ligne
// Cet exemple montre comment modifier la valeur entrante avant de l'afficher,
export default {
  name: 'dept-format',
  props: {
    // Recevoir la valeur de row.xxx
    value: {
      type: Number || String,
      required: false
    },
    color: {
      require: false
    }
  },
  data () {
    return {
      currentValue: ''
    }
  },
  watch: {
    value () {
      this.setValue()
    }
  },
  created () {
    this.setValue(this.value)
  },
  methods: {
    async setValue () {
      // Traiter ici la valeur value entrante
      if (!this.$store.state.d2admin.dept.data) {
        await this.$store.dispatch('d2admin/dept/load')
      }
      this.currentValue = this.$store.state.d2admin.dept.data[String(this.value)]
      // Obtenir récursivement le nom correspondant à la clé de la valeurkey
    }
  }
}
</script>
Footer
