// Fournir les fonctions de défilement
// Commun au mode sans optimisation du défilement

import { throttle } from 'lodash'

// Générer le gestionnaire d'événement de défilement handler
function handleMaker (wait) {
  return throttle(e => {
    this.$emit('scroll', {
      x: e.target.scrollLeft,
      y: e.target.scrollTop
    })
  }, wait)
}

export default {
  props: {
    // Intervalle de limitation (throttle) de l'événement de défilement
    scrollDelay: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data () {
    return {
      handleScroll: null
    }
  },
  watch: {
    scrollDelay (val) {
      // Retirer l'ancien écouteur
      this.removeScrollListener()
      // Générer la nouvelle méthode handle handle
      this.handleScroll = handleMaker.call(this, val)
      // Ajouter un nouvel écouteur
      this.addScrollListener()
    }
  },
  methods: {
    // Ajouter l'écouteur de défilement
    addScrollListener () {
      if (typeof this.handleScroll !== 'function') {
        // mounted Quand cette méthode est appelée dans le cycle de vie mounted, on entre dans cette condition
        this.handleScroll = handleMaker.call(this, this.scrollDelay)
      }
      // Ajouter un écouteur
      this.$refs.body.addEventListener('scroll', this.handleScroll)
    },
    // Retirer l'écouteur de défilement
    removeScrollListener () {
      this.$refs.body.removeEventListener('scroll', this.handleScroll)
    },
    // Méthode d'appel externe Retour en haut
    scrollToTop () {
      const smoothscroll = () => {
        const body = this.$refs.body
        const currentScroll = body.scrollTop
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll)
          body.scrollTo(0, currentScroll - (currentScroll / 5))
        }
      }
      smoothscroll()
    }
  }
}
