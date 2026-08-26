<template>
  <d2-container>
    <el-table
      :data="log"
      size="mini"
      style="width: 100%"
      empty-text="Aucun journal disponible"
      stripe>
      <el-table-column
        prop="time"
        label="Date et Heure"
        width="160">
      </el-table-column>
      <el-table-column
        prop="message"
        label="Message">
      </el-table-column>
      <el-table-column
        label="URL"
        align="center"
        min-width="200">
        <template slot-scope="scope">
          {{get(scope.row, 'meta.url')}}
        </template>
      </el-table-column>
      <el-table-column
        label="Balise"
        align="center"
        min-width="120">
        <template slot-scope="scope">
          <el-tag
            v-if="get(scope.row, 'meta.instance.$vnode.componentOptions.tag')"
            type="info"
            size="mini">
            &#60;{{get(scope.row, 'meta.instance.$vnode.componentOptions.tag')}}&gt;
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="Détails"
        width="100">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleShowMore(scope.row)">
            <d2-icon name="eye"/>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      slot="footer"
      type="primary"
      size="mini"
      :loading="uploading"
      @click="handleUpload">
      <d2-icon name="cloud-upload"/>
      Téléverser {{log.length}} entrées de journal
    </el-button>
  </d2-container>
</template>

<script>
import { mapState } from 'vuex'
import { get } from 'lodash'
export default {
  data () {
    return {
      uploading: false
    }
  },
  computed: {
    ...mapState('d2admin/log', [
      'log'
    ])
  },
  methods: {
    get,
    handleShowMore (log) {
      this.$notify({
        type: 'info',
        title: 'Détails du journal',
        message: 'Le contenu complet du journal a été affiché dans la console'
      })
      this.$log.capsule('D2Admin', 'handleShowMore', 'primary')
      console.group(log.message)
      console.log('time: ', log.time)
      console.log('type: ', log.type)
      console.log(log.meta)
      console.groupEnd()
    },
    handleUpload () {
      this.uploading = true
      this.$notify({
        type: 'info',
        title: 'Téléversement des journaux',
        message: `Téléversement de ${this.log.length} entrées en cours...`
      })
      setTimeout(() => {
        this.uploading = false
        this.$notify({
          type: 'success',
          title: 'Téléversement des journaux',
          message: 'Téléversement réussi'
        })
      }, 3000)
    }
  }
}
</script>
