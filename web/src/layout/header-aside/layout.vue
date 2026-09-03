<template>
  <div
    class="d2-layout-header-aside-group"
    :style="styleLayoutMainGroup"
    :class="{ grayMode: grayActive }"
  >
    <!-- Masque semi-transparent -->
    <div class="d2-layout-header-aside-mask"></div>
    <!-- Contenu principal -->
    <div class="d2-layout-header-aside-content" flex="dir:top">
      <!-- Barre supérieure -->
      <div
        class="d2-theme-header"
        :style="{ opacity: this.searchActive ? 0.5 : 1 }"
        flex-box="0"
        flex
      >
        <router-link
          to="/index"
          :class="{ 'logo-group': true, 'logo-transition': asideTransition }"
          :style="{ width: asideCollapse ? asideWidthCollapse : asideWidth }"
          flex-box="0"
        >
          <img
            v-if="asideCollapse"
            :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/icon-only.png`"
          />
          <img
            v-else
            :src="`${$baseUrl}image/theme/${themeActiveSetting.name}/logo/all.png`"
          />
        </router-link>
        <div class="toggle-aside-btn" @click="handleToggleAside" flex-box="0">
          <d2-icon name="bars" />
        </div>
        <d2-menu-header flex-box="1" />
        <!-- Côté droit de la barre supérieure -->
        <div class="d2-header-right" flex-box="0">
          <!-- Pour n'afficher ce bouton qu'en développement, ajouter v-if="$env === 'development'" -->
          <d2-header-search @click="handleSearchClick" />
          <d2-header-log />
          <d2-header-fullscreen />
          <d2-header-theme />
          <d2-header-message />
          <d2-header-size />
          <d2-header-locales />
          <d2-header-color />
          <d2-header-user />
        </div>
      </div>
      <!-- Ci-dessous, zone principale Zone principale -->
      <div class="d2-theme-container" flex-box="1" flex>
        <!-- Zone principale + barre latérale -->
        <div
          flex-box="0"
          ref="aside"
          :class="{
            'd2-theme-container-aside': true,
            'd2-theme-container-transition': asideTransition && !resizing,
          }"
          :style="{
            width: asideCollapse ? asideWidthCollapse : asideWidth,
            opacity: this.searchActive ? 0.5 : 1,
          }"
        >
          <d2-menu-side />
          <!-- Poignée de redimensionnement de la barre latérale -->
          <div
            v-if="!asideCollapse"
            class="d2-aside-resizer"
            title="Étirer pour ajuster la largeur"
            @mousedown="onAsideResizeStart"
          />
        </div>
        <!-- Zone principale -->
        <div class="d2-theme-container-main" flex-box="1" flex>
          <!-- Recherche -->
          <transition name="fade-scale">
            <div v-if="searchActive" class="d2-theme-container-main-layer" flex>
              <d2-panel-search ref="panelSearch" @close="searchPanelClose" />
            </div>
          </transition>
          <!-- Contenu -->
          <transition name="fade-scale">
            <div
              v-if="!searchActive"
              class="d2-theme-container-main-layer"
              flex="dir:top"
            >
              <!-- tab -->
              <div class="d2-theme-container-main-header" flex-box="0">
                <d2-tabs />
              </div>
              <!-- Page -->
              <div class="d2-theme-container-main-body" flex-box="1">
                <transition :name="transitionActive ? 'fade-transverse' : ''">
                  <keep-alive :include="keepAlive" v-if="showView">
                    <router-view :key="routerViewKey" />
                  </keep-alive>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import d2MenuSide from './components/menu-side'
import d2MenuHeader from './components/menu-header'
import d2Tabs from './components/tabs'
import d2HeaderFullscreen from './components/header-fullscreen'
import d2HeaderLocales from './components/header-locales'
import d2HeaderSearch from './components/header-search'
import d2HeaderSize from './components/header-size'
import d2HeaderTheme from './components/header-theme'
import d2HeaderUser from './components/header-user'
import d2HeaderLog from './components/header-log'
import d2HeaderColor from './components/header-color'
import d2HeaderMessage from './components/header-message'
import { mapState, mapGetters, mapActions } from 'vuex'
import mixinSearch from './mixins/search'
export default {
  name: 'd2-layout-header-aside',
  mixins: [mixinSearch],
  components: {
    d2MenuSide,
    d2MenuHeader,
    d2Tabs,
    d2HeaderFullscreen,
    d2HeaderLocales,
    d2HeaderSearch,
    d2HeaderSize,
    d2HeaderTheme,
    d2HeaderUser,
    d2HeaderLog,
    d2HeaderColor,
    d2HeaderMessage
  },
  provide () {
    return {
      refreshView: this.refreshView
    }
  },
  data () {
    return {
      // [Largeur de la barre latérale] état normal (persistée en localStorage)
      asideWidth: this.readAsideWidth(),
      // [Largeur de la barre latérale] état replié
      asideWidthCollapse: '65px',
      // Largeurs min/max autorisées lors du redimensionnement manuel
      asideWidthMin: 160,
      asideWidthMax: 480,
      // Vrai pendant un glisser-déposer de la poignée (coupe la transition CSS)
      resizing: false,
      resizeStartX: 0,
      resizeStartWidth: 0,
      showView: true // Pour actualiser la page au clic sur sa route
    }
  },
  computed: {
    ...mapState('d2admin', {
      keepAlive: (state) => state.page.keepAlive,
      grayActive: (state) => state.gray.active,
      transitionActive: (state) => state.transition.active,
      asideCollapse: (state) => state.menu.asideCollapse,
      asideTransition: (state) => state.menu.asideTransition
    }),
    ...mapGetters('d2admin', {
      themeActiveSetting: 'theme/activeSetting'
    }),
    /**
     * @description Permettre la mise en cache des routes avec paramètres
     */
    routerViewKey () {
      // Par défaut, la key ressemble à __transition-n-/foo key  __transition-n-/foo
      // Cette manipulation garantit le même format final de key (ex. __transition-n-__stamp-time-/foo) key   __transition-n-__stamp-time-/foo
      const stamp = this.$route.meta[`__stamp-${this.$route.fullPath}`] || ''
      return `${stamp ? `__stamp-${stamp}-` : ''}${this.$route.fullPath}`
    },
    /**
     * @description Style d'image de fond du conteneur le plus externe
     */
    styleLayoutMainGroup () {
      return this.themeActiveSetting.backgroundImage
        ? {
          backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')`
        }
        : {}
    }
  },
  methods: {
    ...mapActions('d2admin/menu', ['asideCollapseToggle']),
    /**
     * Recevoir le clic sur le bouton de bascule de la barre latérale
     */
    handleToggleAside () {
      this.asideCollapseToggle()
    },
    /**
     * Actualiser la page
     */
    refreshView () {
      this.showView = false // Retirer le nœud router-view via v-if
      this.$nextTick(() => {
        this.showView = true // Puis rajouter le nœud router-view via v-if après mise à jour du DOM
      })
    },
    /**
     * @description Lit la largeur persistée de la barre latérale
     */
    readAsideWidth () {
      // Bornes dupliquées ici car data() n'a pas encore accès à this
      const min = 160
      const max = 480
      try {
        const saved = parseInt(window.localStorage.getItem('d2-aside-width'), 10)
        if (saved >= min && saved <= max) {
          return saved + 'px'
        }
      } catch (e) {
        // localStorage indisponible : largeur par défaut
      }
      return '200px'
    },
    /**
     * @description Début du redimensionnement manuel de la barre latérale
     */
    onAsideResizeStart (e) {
      if (this.asideCollapse) return
      e.preventDefault()
      this.resizing = true
      this.resizeStartX = e.clientX
      this.resizeStartWidth = parseInt(this.asideWidth, 10) || 200
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
      window.addEventListener('mousemove', this.onAsideResizing)
      window.addEventListener('mouseup', this.onAsideResizeEnd)
    },
    /**
     * @description Redimensionnement en cours (largeur bornée)
     */
    onAsideResizing (e) {
      const width = Math.min(
        this.asideWidthMax,
        Math.max(this.asideWidthMin, this.resizeStartWidth + e.clientX - this.resizeStartX)
      )
      this.asideWidth = width + 'px'
    },
    /**
     * @description Fin du redimensionnement : persiste la largeur
     */
    onAsideResizeEnd () {
      this.resizing = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', this.onAsideResizing)
      window.removeEventListener('mouseup', this.onAsideResizeEnd)
      try {
        window.localStorage.setItem('d2-aside-width', parseInt(this.asideWidth, 10))
      } catch (e) {
        // stockage indisponible : on garde la largeur en mémoire
      }
    }
  },
  mounted () {
    this.$websocket.initWebSocket()
  },
  destroyed () {
    // Couper la connexion websocket en quittant la routewebsocket
    this.$websocket.closeWebsocket()
  }
}
</script>

<style lang="scss">
// Enregistrer le thème
@import "~@/assets/style/theme/register.scss";

// Poignée de redimensionnement de la barre latérale
.d2-theme-container-aside {
  position: relative;
}
.d2-aside-resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -3px;
  width: 7px;
  cursor: ew-resize;
  z-index: 10;
  background: transparent;
  transition: background-color 0.2s;
  &:hover, &:active {
    background: rgba(64, 158, 255, 0.55);
  }
}

@-webkit-keyframes bgp {
  0% {background-position: 0 0; }
  100% {background-position: -100% 0; }
}
</style>
