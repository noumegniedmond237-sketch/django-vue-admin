<template>
  <div id="app">
    <router-view/>
    <!--  Pour la compatibilité avec le micro-frontend Qiankun  -->
    <div id="qiankun"></div>
    <!-- Peut être supprimé après autorisation-->
    <div class="dvadmin-auth">
      <span>Powered by Django-Vue-Admin</span>
      <el-divider direction="vertical"></el-divider>
      <span>© DvAdmin</span>
    </div>
  </div>
</template>

<script>
import util from '@/libs/util'

export default {
  name: 'app',
  watch: {
    '$i18n.locale': 'i18nHandle'
  },
  created () {
    this.i18nHandle(this.$i18n.locale)
  },
  methods: {
    i18nHandle (val, oldVal) {
      util.cookies.set('lang', val)
      document.querySelector('html').setAttribute('lang', val)
    }
  }
}
</script>

<style lang="scss">
// Style d'autorisation
.dvadmin-auth {
  font-size: 0.8em;
  position: fixed;
  top: 50vh;
  right: -163px;;
  text-align: center;
  color: #888888;
  background-image: linear-gradient(to left, #d3d3d3, #989898, #888888, #363636, #888888, #989898, #d3d3d3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-background-size: 200% 100%;
  animation: bgp 6s infinite linear;
  transform: rotate(90deg);
}

@import "~@/assets/style/public-class.scss";
@import "~@/assets/style/yxt-public.scss";
</style>
