<template>
  <div class="d2-multiple-page-control-group" flex>
    <div class="d2-multiple-page-control-content" flex-box="1">
      <div class="d2-multiple-page-control-content-inner">
        <d2-contextmenu
          :visible.sync="contextmenuFlag"
          :x="contentmenuX"
          :y="contentmenuY">
          <d2-contextmenu-list
            :menulist="tagName === '/index' ? contextmenuListIndex : contextmenuList"
            @rowClick="contextmenuClick"/>
        </d2-contextmenu>
        <el-tabs
          class="d2-multiple-page-control d2-multiple-page-sort"
          :value="current"
          type="card"
          @tab-click="handleClick"
          @tab-remove="handleTabRemove"
          @contextmenu.native="handleContextmenu">
          <el-tab-pane
            v-for="page in opened"
            :key="page.fullPath"
            :label="(page.meta && (page.meta.title === '控制台' ? 'Tableau de bord' : page.meta.title)) || (page.fullPath === '/index' ? 'Tableau de bord' : 'Sans titre')"
            :name="page.fullPath"
            :closable="isTabClosable(page)"/>
        </el-tabs>
      </div>
    </div>
    <div class="d2-multiple-page-control-btn" flex-box="0">
      <el-dropdown
        size="default"
        split-button
        @click="closeAll"
        @command="command => handleControlItemClick(command)">
        <d2-icon name="times-circle"/>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="left">
            <d2-icon name="arrow-left" class="d2-mr-10"/>
            Fermer à gauche
          </el-dropdown-item>
          <el-dropdown-item command="right">
            <d2-icon name="arrow-right" class="d2-mr-10"/>
            Fermer à droite
          </el-dropdown-item>
          <el-dropdown-item command="other">
            <d2-icon name="times" class="d2-mr-10"/>
            Fermer les autres
          </el-dropdown-item>
          <el-dropdown-item command="all">
            <d2-icon name="times-circle" class="d2-mr-10"/>
            Tout fermer
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Sortable from 'sortablejs'

export default {
  components: {
    D2Contextmenu: () => import('../contextmenu'),
    D2ContextmenuList: () => import('../contextmenu/components/contentmenuList')
  },
  data () {
    return {
      contextmenuFlag: false,
      contentmenuX: 0,
      contentmenuY: 0,
      contextmenuListIndex: [
        { icon: 'times-circle', title: 'Tout fermer', value: 'all' }
      ],
      contextmenuList: [
        { icon: 'refresh', title: 'Actualiser', value: 'refresh' },
        { icon: 'arrow-left', title: 'Fermer à gauche', value: 'left' },
        { icon: 'arrow-right', title: 'Fermer à droite', value: 'right' },
        { icon: 'times', title: 'Fermer les autres', value: 'other' },
        { icon: 'times-circle', title: 'Tout fermer', value: 'all' }
      ],
      tagName: '/index'
    }
  },
  computed: {
    ...mapState('d2admin/page', [
      'opened',
      'current'
    ])
  },
  methods: {
    ...mapActions('d2admin/page', [
      'close',
      'closeLeft',
      'closeRight',
      'closeOther',
      'closeAll',
      'openedSort'
    ]),
    /**
     * @description Vérifie si l'onglet est fermable
     */
    isTabClosable (page) {
      return page.name !== 'index'
    },
    /**
     * @description Clic sur le menu contextuel
     */
    handleContextmenu (event) {
      let target = event.target
      let flag = false
      if (target.className.indexOf('el-tabs__item') > -1) flag = true
      else if (target.parentNode.className.indexOf('el-tabs__item') > -1) {
        target = target.parentNode
        flag = true
      }
      if (flag) {
        event.preventDefault()
        event.stopPropagation()
        this.contentmenuX = event.clientX
        this.contentmenuY = event.clientY
        this.tagName = target.getAttribute('aria-controls').slice(5)
        this.contextmenuFlag = true
      }
    },
    /**
     * @description Action du menu contextuel
     */
    contextmenuClick (command) {
      this.handleControlItemClick(command, this.tagName)
    },
    /**
     * @description Gestion du clic sur les options de fermeture
     */
    handleControlItemClick (command, tagName = null) {
      if (tagName) this.contextmenuFlag = false
      const params = { pageSelect: tagName }
      switch (command) {
        case 'refresh': this.$router.push({ name: 'refresh' }); break
        case 'left': this.closeLeft(params); break
        case 'right': this.closeRight(params); break
        case 'other': this.closeOther(params); break
        case 'all': this.closeAll(); break
        default: this.$message.error('Opération invalide'); break
      }
    },
    /**
     * @description Clic sur un onglet
     */
    handleClick (tab, event) {
      const page = this.opened.find(page => page.fullPath === tab.name)
      if (page) {
        const { name, params, query } = page
        this.$router.push({ name, params, query })
      }
    },
    /**
     * @description Suppression d'un onglet
     */
    handleTabRemove (tagName) {
      this.close({ tagName })
    }
  },
  mounted () {
    const el = document.querySelectorAll('.d2-multiple-page-sort .el-tabs__nav')[0]
    if (el) {
      Sortable.create(el, {
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt
          this.openedSort({ oldIndex, newIndex })
        }
      })
    }
  }
}
</script>
