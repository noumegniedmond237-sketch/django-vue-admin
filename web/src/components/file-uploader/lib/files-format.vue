<template>
  <span>
    <template v-if="type === 'text'">
      <span v-for="(item) in items" :key="item.url" >
        <el-link type="primary" size="mini" :underline="false" :href="item.url"  target="_blank"> {{item.name}} </el-link>
      </span>
    </template>
    <template v-else >
      <el-tag class='tag-item  d2-mr-5 d2-mb-2 d2-mt-2' v-for="(item) in items" :key="item.url"  size="small"  :type="item.color"  >
        <el-link type="primary"  :underline="false" :href="item.url"  target="_blank">{{item.name}}</el-link>
      </el-tag>
    </template>
  </span>
</template>

<script>
// Composant d'affichage formaté des fichiers
export default {
  name: 'd2p-files-format',
  props: {
    // Valeur
    value: {
      require: true
    },
    // Couleur,[primary, success, warning, danger ,info]
    color: {
      require: false,
      default: 'primary'
    },
    // Type d'affichage[text, tag]
    type: {
      default: 'tag' // Optionnel[text,tag]
    },
    // Méthode de construction de l'URL de téléchargementurl
    buildUrl: {
      type: Function,
      default: function (value, item) { return value }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    items () {
      if (this.value == null || this.value === '') {
        return []
      }
      let valueArr = []
      if (typeof (this.value) === 'string') {
        valueArr = [this.getItem(this.value)]
      } else if (this.value instanceof Array) {
        // Déjà un tableau à l'origine
        valueArr = []
        for (const val of this.value) {
          valueArr.push(this.getItem(val))
        }
      } else if (this.value instanceof Object) {
        valueArr = []
        valueArr.push(this.getItem(this.value))
      }
      return valueArr
    }
  },
  created () {
  },
  methods: {
    getFileName (url) {
      if (url && url.lastIndexOf('/') >= 0) {
        return url.substring(url.lastIndexOf('/') + 1)
      }
      return url
    },
    getItem (value) {
      const url = this.buildUrl(value)
      return {
        url,
        value: value,
        name: this.getFileName(url),
        color: this.color
      }
    }
  }
}
</script>
<style >
  .d2-mb-2{margin-bottom: 2px}
  .d2-mt-2{margin-top: 2px;}
  .d2-mr-5{margin-right: 5px;}
  .tag-item{
    margin-right: 10px;
  }
  .el-divider__text, .el-link {
    font-size: inherit;
  }
</style>
