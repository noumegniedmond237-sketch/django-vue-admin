<template>
<div>
  <el-divider content-position="left">Centre de notifications</el-divider>
  <div v-if="msgObj">
     <h3>{{msgObj.title}}</h3>
    <div class="content-style" v-html="sanitizedContent"></div>
  </div>
  <div v-else>
    <el-empty description="Aucune notification" :image-size="100"></el-empty>
  </div>
  <el-divider></el-divider>
  <div style="text-align: center">
    <el-button type="text" @click="toPage">Accéder aux messages</el-button>
  </div>
</div>
</template>

<script>
import DOMPurify from 'dompurify'
import { mapActions } from 'vuex'
export default {
  name: 'msgList',
  props: {
    msgObj: {
      type: Object,
      default: null
    }
  },
  computed: {
    // Contenu riche assaini (anti-XSS) avant rendu HTML
    sanitizedContent () {
      return DOMPurify.sanitize((this.msgObj && this.msgObj.content) || '', { USE_PROFILES: { html: true } })
    }
  },
  methods: {
    ...mapActions('d2admin/page', [
      'open'
    ]),
    toPage () {
      this.$router.push({
        name: 'messageCenter'
      })
    }
  }
}
</script>

<style scoped>
  .msg-list{
    padding: 5px 0px;
    border-bottom: 1px solid #eeeeee;
  }
  .content-style{
    width: 370px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>
