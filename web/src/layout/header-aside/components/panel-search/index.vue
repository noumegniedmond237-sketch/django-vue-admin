<template>
  <div class="panel-search" flex="dir:top">
    <div class="panel-search__input-group" flex-box="0" flex="dir:top main:center cross:center" @click.self="handlePanelClick">
      <d2-icon-svg class="panel-search__logo" name="dvadmin" style="width: 200px;height: 200px;"/>
      <el-autocomplete
        class="panel-search__input"
        ref="input"
        v-model="searchText"
        suffix-icon="el-icon-search"
        placeholder="Rechercher une page..."
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        :clearable="true"
        @keydown.esc.native="handleEsc"
        @select="handleSelect">
        <d2-panel-search-item slot-scope="{ item }" :item="item"/>
      </el-autocomplete>
      <div class="panel-search__tip">
        Utilisez le raccourci
        <span class="panel-search__key">{{hotkey.open}}</span>
        pour ouvrir la recherche, et
        <span class="panel-search__key">{{hotkey.close}}</span>
        pour fermer
      </div>
    </div>
    <div v-if="resultsList.length > 0" class="panel-search__results-group" flex-box="1">
      <el-card shadow="never">
        <div class="panel-search__results-group-inner">
          <d2-panel-search-item
            v-for="(item, index) in resultsList"
            :key="index"
            :item="item"
            :hover-mode="true"
            @click.native="handleResultsGroupItemClick(item.path)"/>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
import { mapState } from 'vuex'
import mixin from '../mixin/menu'
export default {
  mixins: [
    mixin
  ],
  components: {
    'd2-panel-search-item': () => import('./components/panel-search-item/index.vue')
  },
  data () {
    return {
      searchText: '',
      results: []
    }
  },
  computed: {
    ...mapState('d2admin/search', [
      'hotkey',
      'pool'
    ]),
    resultsList () {
      return (this.results.length === 0 && this.searchText === '') ? this.pool.map(e => ({
        value: e.fullTitle,
        ...e
      })) : this.results
    },
    fuse () {
      return new Fuse(this.pool, {
        shouldSort: true,
        tokenize: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'fullTitle',
          'path'
        ]
      })
    }
  },
  methods: {
    querySearch (queryString, callback) {
      const results = this.fuse.search(queryString).map(e => e.item)
      this.results = results
      callback(results)
    },
    focus () {
      this.input = ''
      setTimeout(() => {
        if (this.$refs.input) {
          this.$refs.input.focus()
        }
        this.searchText = ''
        this.results = []
      }, 500)
    },
    handleResultsGroupItemClick (path) {
      if (path === this.$route.path) {
        this.handleEsc()
        return
      }
      this.handleMenuSelect(path)
    },
    async handleSelect ({ path }) {
      if (path === this.$route.path) {
        this.handleEsc()
        return
      }
      await this.$nextTick()
      this.handleMenuSelect(path)
    },
    closeSuggestion () {
      if (this.$refs.input.activated) {
        this.$refs.input.suggestions = []
        this.$refs.input.activated = false
      }
    },
    handlePanelClick () {
      this.handleEsc()
    },
    async handleEsc () {
      this.closeSuggestion()
      await this.$nextTick()
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-search {
  margin: 20px;
  width: 100%;
  .panel-search__input-group {
    height: 240px;
    .panel-search__logo {
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
    }
    .panel-search__input {
      width: 500px;
    }
    .panel-search__tip {
      @extend %unable-select;
      margin-top: 20px;
      margin-bottom: 40px;
      font-size: 12px;
      color: $color-text-sub;
      .panel-search__key {
        padding: 1px 5px;
        margin: 0px 2px;
        border-radius: 2px;
        background-color: $color-text-normal;
        color: $color-bg;
      }
    }
  }
  .panel-search__results-group {
    overflow: auto;
    margin-bottom: -20px;
    .panel-search__results-group-inner {
      margin: -20px;
    }
  }
}
</style>
