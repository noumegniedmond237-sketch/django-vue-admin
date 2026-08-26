<template>
  <el-card shadow="never" class="item-background">
    <img :src="config.src.value || '/image/card/tencent.jpg'" @click="Jump()" class="img-style">
  </el-card>
</template>

<script>
export default {
  sort: 8,
  title: 'Bannière / Image',
  name: 'dashboardImg',
  icon: 'el-icon-picture-outline',
  description: 'Affichage d\'une image avec lien de redirection',
  height: 10,
  width: 16,
  isResizable: true,
  config: {
    src: {
      label: "URL de l'image",
      type: 'input',
      value: '/image/card/tencent.jpg',
      placeholder: "Entrez l'URL de l'image",
      rules: [{ required: true, message: 'Ce champ est requis' }]
    },
    url: {
      label: 'Lien de redirection',
      type: 'input',
      placeholder: 'Entrez le lien',
      value: 'https://django-vue-admin.com',
      rules: [{ required: true, message: 'Ce champ est requis' }]
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
    }
  },
  methods: {
    Jump () {
      if (this.config.url.value) {
        window.open(this.config.url.value, '_blank')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.img-style {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  cursor: pointer;
}
.el-card{
  height: 100%;
}
::v-deep .el-card__body {
  padding: 0;
  border-radius: 4px;
}
</style>
