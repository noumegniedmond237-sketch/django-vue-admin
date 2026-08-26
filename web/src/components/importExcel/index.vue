<template>
  <div style="display: inline-block">
    <el-button size="small" type="success" icon="el-icon-upload" @click="handleImport">
      <slot>Importer</slot>
    </el-button>
    <el-dialog :title="upload.title || 'Importer des données'" :visible.sync="upload.open" width="400px" append-to-body destroy-on-close>
      <div v-loading="loading">
        <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">
            Glissez-déposez le fichier ici ou
            <em>cliquez pour sélectionner</em>
          </div>
          <div slot="tip" class="el-upload__tip" style="color:red">Formats acceptés : .xls ou .xlsx uniquement</div>
        </el-upload>
        <div>
          <el-button type="warning" style="font-size:14px;margin-top: 20px" @click="importTemplate">Télécharger le modèle
          </el-button>
          <el-button type="warning" style="font-size:14px;margin-top: 20px" @click="updateTemplate" v-if="showUpdate">
            Modèle de mise à jour
          </el-button>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="loading" @click="submitFileForm">Confirmer</el-button>
        <el-button :disabled="loading" @click="upload.open = false">Annuler</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from '@/libs/util'
import { request, downloadFile } from '@/api/service'

export default {
  name: 'importExcel',
  inject: ['refreshView'],
  props: {
    upload: {
      type: Object,
      default () {
        return {
          open: false,
          title: '',
          isUploading: false,
          updateSupport: 0,
          headers: { Authorization: 'JWT ' + util.cookies.get('token') },
          url: util.baseURL() + 'api/system/file/'
        }
      }
    },
    api: {
      type: String,
      default () {
        return undefined
      }
    },
    fieldOptions: {
      type: Array,
      default () {
        return []
      }
    },
    showUpdate: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    handleImport () {
      this.upload.open = true
    },
    importTemplate () {
      downloadFile({
        url: this.api + 'import_data/',
        params: {},
        method: 'get'
      })
    },
    updateTemplate () {
      downloadFile({
        url: this.api + 'update_template/',
        params: {},
        method: 'get'
      })
    },
    handleFileUploadProgress (event, file, fileList) {
      this.upload.isUploading = true
    },
    handleFileSuccess (response, file, fileList) {
      const that = this
      that.upload.isUploading = false
      that.loading = true
      that.$refs.upload.clearFiles()
      return request({
        url: that.api + 'import_data/',
        method: 'post',
        data: {
          url: response.data.url
        }
      }).then(response => {
        that.loading = false
        that.$alert('Importation réussie', 'Terminé', {
          confirmButtonText: 'OK',
          callback: action => {
            that.refreshView()
          }
        })
      }).finally(() => {
        that.loading = false
      })
    },
    submitFileForm () {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped>

</style>
