import { throttle } from 'lodash'
import { mapState } from 'vuex'
import menuMixin from '../mixin/menu'
import { createMenu } from '../libs/util.menu'

export default {
  name: 'd2-layout-header-aside-menu-header',
  mixins: [
    menuMixin
  ],
  render (h) {
    return <div
      flex="cross:center"
      class={ { 'd2-theme-header-menu': true, 'is-scrollable': this.isScroll } }
      ref="page">
      <div
        ref="content"
        class="d2-theme-header-menu__content"
        flex-box="1"
        flex>
        <div
          class="d2-theme-header-menu__scroll"
          flex-box="0"
          style={ { transform: `translateX(${this.currentTranslateX}px)` } }
          ref="scroll">
          <el-menu
            mode="horizontal"
            defaultActive={ this.active }
            onSelect={ this.handleMenuSelect }>
            { this.header.map(menu => createMenu.call(this, h, menu)) }
          </el-menu>
        </div>
      </div>
      {
        this.isScroll
          ? [
            <div
              class="d2-theme-header-menu__prev"
              flex="main:center cross:center"
              flex-box="0"
              onClick={ () => this.scroll('left') }>
              <i class="el-icon-arrow-left"></i>
            </div>,
            <div
              class="d2-theme-header-menu__next"
              flex="main:center cross:center"
              flex-box="0"
              onClick={ () => this.scroll('right') }>
              <i class="el-icon-arrow-right"></i>
            </div>
          ]
          : []
      }
    </div>
  },
  computed: {
    ...mapState('d2admin/menu', [
      'header'
    ])
  },
  data () {
    return {
      active: '',
      isScroll: false,
      scrollWidth: 0,
      contentWidth: 0,
      currentTranslateX: 0,
      throttledCheckScroll: null
    }
  },
  watch: {
    '$route.matched': {
      handler (val) {
        this.active = val[val.length - 1].path
      },
      immediate: true
    }
  },
  methods: {
    scroll (direction) {
      if (direction === 'left') {
        // Défiler vers la droite
        this.currentTranslateX = 0
      } else {
        // Défiler vers la gauche
        if (this.contentWidth * 2 - this.currentTranslateX <= this.scrollWidth) {
          this.currentTranslateX -= this.contentWidth
        } else {
          this.currentTranslateX = this.contentWidth - this.scrollWidth
        }
      }
    },
    checkScroll () {
      let contentWidth = this.$refs.content.clientWidth
      let scrollWidth = this.$refs.scroll.clientWidth
      if (this.isScroll) {
        // Si la page peut encore défiler, mettre à jour width
        if (this.contentWidth - this.scrollWidth === this.currentTranslateX) {
          // currentTranslateX doit aussi changer en conséquence [quand on arrive au bout à droite]
          this.currentTranslateX = contentWidth - scrollWidth
          // Le défilement rapide nécessite encore des contrôles (contentWidth peut devenir positif lors du calcul), à limiter
          if (this.currentTranslateX > 0) {
            this.currentTranslateX = 0
          }
        }
        // Mettre à jour les données de l'élément
        this.contentWidth = contentWidth
        this.scrollWidth = scrollWidth
        // Déterminer quand la barre disparaît : quand scroll > content
        if (contentWidth > scrollWidth) {
          this.isScroll = false
        }
      }
      // Déterminer quand la barre apparaît : quand scroll < content
      if (!this.isScroll && contentWidth < scrollWidth) {
        this.isScroll = true
        // Attention : quand isScroll devient true, la taille du conteneur change
        this.$nextTick(() => {
          contentWidth = this.$refs.content.clientWidth
          scrollWidth = this.$refs.scroll.clientWidth
          this.contentWidth = contentWidth
          this.scrollWidth = scrollWidth
          this.currentTranslateX = 0
        })
      }
    }
  },
  mounted () {
    // Initialiser le jugement
    // Par défaut, comparer les tailles parent/enfant pour décider d'afficher le défilement initial,
    this.checkScroll()
    // Écoute globale des changements de fenêtre : comparer les tailles parent/enfant pour activer isScroll
    this.throttledCheckScroll = throttle(this.checkScroll, 300)
    window.addEventListener('resize', this.throttledCheckScroll)
  },
  beforeDestroy () {
    // Retirer l'écouteur
    window.removeEventListener('resize', this.throttledCheckScroll)
  }
}
