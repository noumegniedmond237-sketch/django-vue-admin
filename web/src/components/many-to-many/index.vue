<template>
  <div>
    <el-tag  style="margin-right: 10px" :type="color" v-for="(item,index) in currentValue" :key="index">{{
        item[key]
      }}
    </el-tag>
  </div>
</template>
<script>
// Version avancée du composant d'affichage en ligne
// Cet exemple montre comment modifier la valeur entrante avant de l'afficher,
export default {
  name: 'many-to-many',
  props: {
    color: {
      require: false
    },
    value: {
      type: Array,
      required: false
    }
  },
  data () {
    return {
      currentValue: [],
      key: 'name'
    }
  },
  watch: {
    value (nv, ov) {
      const { row } = this.$parent.scope
      const { children } = this.$parent
      if (children) {
        const valueBinding = this.$parent.valueBinding
        this.setValue(row[valueBinding])
        this.key = children
      } else {
        this.setValue([])
      }
    }
  },
  created () {
    const { row } = this.$parent.scope
    const { children } = this.$parent
    if (children) {
      const valueBinding = this.$parent.valueBinding
      this.setValue(row[valueBinding])
      this.key = children
    } else {
      this.setValue([])
    }
  },
  methods: {
    setValue (value) {
      // Traiter ici la valeur value entrante
      this.currentValue = value
    }
  }
}
</script>
