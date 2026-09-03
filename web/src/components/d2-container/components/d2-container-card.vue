<template>
  <div class="d2-container-card">
    <div v-if="$slots.header" class="d2-container-card__header" ref="header">
      <slot name="header"/>
    </div>
    <div class="d2-container-card__body" ref="body">
      <div class="d2-container-card__body-card">
        <slot/>
      </div>
    </div>
    <div v-if="$slots.footer" class="d2-container-card__footer" ref="footer">
      <slot name="footer"/>
    </div>
  </div>
</template>

<script>
import scroll from './mixins/normal'
export default {
  name: 'd2-container-card',
  mixins: [
    scroll
  ],
  mounted () {
    // Ajouter l'écouteur de défilement
    this.addScrollListener()
  },
  beforeDestroy () {
    // Retirer l'écouteur de défilement
    this.removeScrollListener()
  }
}
</script>
