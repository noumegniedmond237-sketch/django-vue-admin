<template>
    <el-dialog class="cropper-uploader quying-dialog" :title="title" :visible.sync="dialogVisible" append-to-body
               :before-close="handleClose" :close-on-click-modal="true" ref="editAvatar" :width="_dialogWidth" >
          <div class="cropper-uploader-wrap" >
            <input type="file" v-show="false" ref="fileinput" :accept="accept" @change="handleChange">
            <!-- step1 -->
            <div class="cropper-uploader__choose cropper-uploader_left" v-show="!isLoaded">
              <el-button round @click="handleClick">+ Choisir une image</el-button>
              <p>{{_uploadTip}}</p>
            </div>
            <!-- step2 -->
            <div class="cropper-uploader__edit cropper-uploader_left" v-show="isLoaded">
              <div class="cropper-uploader__edit-area" >
                    <vue-cropper
                      ref="cropper"
                      :src="imgSrc"
                      preview=".preview"
                      :style="{height:_cropperHeight}"
                      v-bind="_cropper"
                    />
              </div>
              <div class="tool-bar">
                <el-button-group>
                  <el-button round size="mini" icon="el-icon-edit" @click="handleClick">Changer</el-button>
                  <el-button round size="mini" type="" @click="flipX">Miroir H</el-button>
                  <el-button round size="mini" type="" @click="flipY">Miroir V</el-button>
                  <el-button round size="mini" type="" icon="el-icon-zoom-in" @click="zoom(0.1)"></el-button>
                  <el-button round size="mini" type="" icon="el-icon-zoom-out" @click="zoom(-0.1)"></el-button>
                  <el-button round size="mini" type="" icon="el-icon-refresh-right" @click="rotate(90)">Pivoter</el-button>
                  <el-button round size="mini" type="" icon="el-icon-refresh" @click="reset">Réinitialiser</el-button>
                </el-button-group>
              </div>
            </div>
            <div class="cropper-uploader__preview">
              <span class="cropper-uploader__preview-title">Aperçu</span>
              <div class="cropper-uploader__preview-120 preview"></div>
              <div class="cropper-uploader__preview-65 preview" :class="{'round': _cropper.aspectRatio===1}"></div>
            </div>
          </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="mini">Annuler</el-button>
        <el-button type="primary" size="mini" @click="doCropper()">Confirmer</el-button>
      </div>
    </el-dialog>
</template>

<script>
import VueCropper from './vue-cropper'
import log from 'd2p-extends/src/utils/util.log'
export default {
  name: 'd2p-cropper',
  components: {
    VueCropper
  },
  props: {
    title: {
      type: String,
      default: 'Recadrer l\'image'
    },
    cropperHeight: {
      type: [String, Number]
    },
    dialogWidth: {
      type: [String, Number],
      default: '50%'
    },
    maxSize: {
      type: Number,
      default: 5
    },
    uploadTip: {
      type: String
    },
    cropper: {
      type: Object
    },
    accept: {
      type: String,
      default: '.jpg, .jpeg, .png, .gif, .webp'
    },
    output: {
      type: String,
      default: 'blob'
    }
  },
  data () {
    return {
      dialogVisible: false,
      isLoaded: false,
      imgSrc: '',
      data: null,
      file: undefined,
      scale: {
        x: 1,
        y: 1
      }
    }
  },
  computed: {
    _uploadTip () {
      if (this.uploadTip != null && this.uploadTip !== '') {
        return this.uploadTip
      }
      if (this.maxSize > 0) {
        return `Formats acceptés : ${this.accept.replace(/,/g, ', ')} (taille max : ${this.maxSize} Mo)`
      } else {
        return `Formats acceptés : ${this.accept}`
      }
    },
    _cropper () {
      const def = {
        aspectRatio: 1,
        ready: this.ready
      }
      if (this.cropper == null) {
        return def
      }
      const assign = Object.assign(def, this.cropper)
      log.debug('cropper options:', assign)
      return assign
    },
    _cropperHeight () {
      let height = this.cropperHeight
      if (height == null) {
        height = document.documentElement.clientHeight * 0.55
        if (height < 270) {
          height = 270
        }
      }
      if (typeof (height) === 'number') {
        height += 'px'
      }
      return height
    },
    _dialogWidth () {
      let width = this.dialogWidth
      if (width == null) {
        width = '50%'
      }
      if (typeof (width) === 'number') {
        width += 'px'
      }
      return width
    }
  },
  methods: {
    open (url) {
      this.dialogVisible = true
      if (url != null && url !== '') {
        this.imgSrc = url
      }
    },
    close () {
      this.dialogVisible = false
    },
    clear () {
      this.isLoaded = false
      if (this.$refs.fileinput != null) {
        this.$refs.fileinput.value = null
      }
      if (this.$refs.cropper != null) {
        this.$refs.cropper.clear()
      }
    },
    getCropper () {
      return this.$refs.cropper
    },
    ready (event) {
      log.debug('cropper ready:', event)
    },
    preventDefault (e) {
      e.preventDefault()
      return false
    },
    handleClick (e) {
      this.$refs.fileinput.click()
    },
    checkFile (file) {
      if (file.type.indexOf('image') === -1) {
        this.$message({
          message: 'Veuillez sélectionner un format d\'image valide',
          type: 'warning'
        })
        return false
      }
      if (this.maxSize > 0 && file.size / 1024 / 1024 > this.maxSize) {
        this.$message({
          message: 'La taille de l\'image dépasse la limite maximale (' + this.maxSize + ' Mo)',
          type: 'warning'
        })
        return false
      }
      return true
    },
    handleChange (e) {
      e.preventDefault()
      const files = e.target.files || e.dataTransfer.files
      this.isLoaded = true
      const file = files[0]
      if (this.checkFile(file)) {
        this.file = file
        this.setImage(e)
      }
    },
    handleClose () {
      this.dialogVisible = false
      this.$emit('cancel')
    },
    doCropper () {
      if (!this.isLoaded) {
        this.$message('Veuillez d\'abord sélectionner une image')
        return
      }
      this.dialogVisible = false
      this.doOutput(this.file)
    },
    doOutput (file) {
      log.debug('output this:', this)
      const ret = { file }
      if (this.output === 'all') {
        this.getCropImageBlob((blob) => {
          const dataUrl = this.cropImageDataUrl()
          ret.blob = blob
          ret.dataUrl = dataUrl
          this.$emit('done', ret)
        })
      }

      if (this.output === 'blob') {
        this.getCropImageBlob((blob) => {
          ret.blob = blob
          this.$emit('done', ret)
        })
      }
      if (this.output === 'dataUrl') {
        ret.dataUrl = this.cropImageDataUrl()
        this.$emit('done', ret)
      }
    },
    emit (result) {
      this.$emit('done', result)
    },
    cropImageDataUrl () {
      return this.$refs.cropper.getCroppedCanvas().toDataURL()
    },
    getCropImageBlob (callback, type, quality) {
      this.$refs.cropper.getCroppedCanvas().toBlob(callback, type, quality)
    },
    flipX () {
      this.$refs.cropper.scaleX(this.scale.x *= -1)
    },
    flipY () {
      this.$refs.cropper.scaleY(this.scale.y *= -1)
    },
    getCropBoxData () {
      this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4)
    },
    getData () {
      this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4)
    },
    move (offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY)
    },
    reset () {
      this.$refs.cropper.reset()
    },
    rotate (deg) {
      this.$refs.cropper.rotate(deg)
    },
    setCropBoxData () {
      if (!this.data) return
      this.$refs.cropper.setCropBoxData(JSON.parse(this.data))
    },
    setData () {
      if (!this.data) return
      this.$refs.cropper.setData(JSON.parse(this.data))
    },
    setImage (e) {
      const file = e.target.files[0]
      if (file.type.indexOf('image/') === -1) {
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        this.imgSrc = event.target.result
        this.$refs.cropper.replace(event.target.result)
      }
      reader.readAsDataURL(file)
    },
    setCrop (x, y, width, height) {
      this.$refs.cropper.setCropBoxData({
        left: x,
        top: y,
        width: width,
        height: height
      })
    },
    zoom (percent) {
      this.$refs.cropper.relativeZoom(percent)
    }
  }
}
</script>

<style lang="scss">
.cropper-uploader{
  .el-dialog__body{
    padding: 0 20px;
  }
  .cropper-uploader-wrap{
    display: flex;
    justify-content: center;
    .cropper-uploader_left{
      width: 400px;
    }
    .cropper-uploader__choose{
      height: 270px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .tool-bar{
      margin-top: 10px;
    }
    .cropper-uploader__preview{
      margin-left: 20px;
      position: relative;
      .cropper-uploader__preview-title{
        position: absolute;
        top:0px;
        left:0px;
      }
      .preview{
        overflow: hidden;
        border:1px solid #eee;
        border-radius: 4px;
        background-color: #eee;
      }
      .cropper-uploader__preview-120{
        margin-top: 30px;
        width: 120px;
        height: 120px;
      }
      .cropper-uploader__preview-65{
        margin-top: 10px;
        width: 65px;
        height: 65px;
        &.round{
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
