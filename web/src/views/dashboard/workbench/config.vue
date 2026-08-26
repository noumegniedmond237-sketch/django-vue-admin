<template>
  <div>
    <el-drawer
      :visible.sync="deviceUpgradeDrawer"
      :size="500">
      <div slot="title">
        <span>Configuration du Widget</span>
        <el-tag size="small" style="margin-left: 10px">{{ myComp.title }}</el-tag>
      </div>
      <!-- Contenu du composant -->
      <el-form ref="ruleForm" label-width="160px" class="demo-ruleForm" style="padding: 20px;">
        <el-form-item
          v-for="(item,index) in items.config"
          :label="item.label"
          :key="index"
          :rules="item.rules">
          <el-input v-if="item.type==='input'" v-model="item.value" :placeholder="item.placeholder || 'Entrez la valeur'"></el-input>
          <el-switch v-if="item.type==='boot'" v-model="item.value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          <el-color-picker v-if="item.type==='color'" v-model="item.value" show-alpha :predefine="predefineColors"></el-color-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveConfig">Enregistrer</el-button>
          <el-button @click="deviceUpgradeDrawer = false">Fermer</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'dashboardConfig',
  data () {
    return {
      deviceUpgradeDrawer: false,
      myComp: {},
      items: {},
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ]
    }
  },
  methods: {
    initData (myComp, items) {
      this.myComp = myComp
      this.items = items
    },
    saveConfig () {
      this.deviceUpgradeDrawer = false
      this.$emit('saveConfig', this.myComp, this.items)
    }
  }
}
</script>

<style scoped>

</style>
