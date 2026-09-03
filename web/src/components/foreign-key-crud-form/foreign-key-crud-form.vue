<template>
  <div>
    <el-row>
      <el-col :span="elProps.index.span" v-if="elProps.index">
        <div style="text-align: center">{{ elProps.index.name }}</div>
      </el-col>
      <el-col :span="elProps.fields[key].span" v-for="(_, key) in elProps.fields" :key="key">
        <div style="text-align: center">{{ elProps.fields[key].name }}</div>
      </el-col>
      <el-col :span="2">
        <div style="text-align: center">Actions</div>
      </el-col>
    </el-row>
    <el-form :model="currentForm" ref="currentFormRef" label-width="0px" size="mini" type="flex">
      <el-row style="margin-bottom: 0" :gutter="5" v-for="(field, index) in currentForm.data" :key="index">
        <el-col :span="elProps.index.span" v-if="elProps.index">
          <div style="text-align: center">
            {{ index + 1 }}
          </div>
        </el-col>
        <el-col :span="elProps.fields[key].span" v-for="(_,key) in elProps.fields" :key="key">
          <el-form-item
            :prop="'data.' + index + '.' + key"
            :rules="[
                { required: elProps.fields[key].required, message: 'Ce champ est requis', trigger: 'blur' },
              ]"
            style="text-align: center"
          >
            <el-select v-model="field[key]" v-if="elProps.fields[key].type === 'select'" placeholder="Sélectionner">
              <el-option
                v-for="item in elProps.fields[key].option"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input-number style="width: 100%" v-else-if="elProps.fields[key].type === 'number'"
                             controls-position="right" v-model="field[key]"></el-input-number>
            <div class="d2p-images" v-else-if="elProps.fields[key].type === 'image'">
              <d2p-file-uploader v-model="field[key]"
                                 :elProps="elProps.fields[key].elProps || { listType: 'picture-card', accept: '.png,.jpeg,.jpg,.ico,.bmp,.gif', limit: 1 }"></d2p-file-uploader>
            </div>
            <!--     Texte riche     -->
            <span v-else-if="elProps.fields[key].type === 'ueditor'">
              <values-popover v-model="field[key]" :elProps="{ type: 'ueditor' }"
                              @previewClick="previewClick(index,key)"></values-popover>
            </span>
            <!--     Plusieurs-à-plusieurs     -->
            <span v-else-if="elProps.fields[key].type === 'many_to_many'">
              <values-popover
                v-model="field[key]"
                :dict="elProps.fields[key].dict"
                :elProps="{ type: elProps.fields[key].value?.type || 'manyToMany',  rowKey: elProps.fields[key].value?.rowKey || 'title', label: elProps.value?.title || 'Contenu de l\'option' }"
                @listClick="manyToManyClick(index,key)">
              </values-popover>
            </span>
            <el-input v-model="field[key]" v-else placeholder="Saisir..."></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button @click.prevent="topDomain(index)" :disabled="index === 0" type="primary" circle
                       icon="el-icon-top"></el-button>
            <el-button @click.prevent="bottomDomain(index)" :disabled="index === currentForm.data.length - 1"
                       type="primary" circle icon="el-icon-bottom"></el-button>
            <el-button @click.prevent="removeDomain(index)" type="danger" circle icon="el-icon-delete"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-col :span="12">
          <el-button type="primary" @click="addDomain">Ajouter</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <el-dialog
      title="Édition de texte enrichi"
      :visible.sync="previewVisible"
      append-to-body
      width="900">
      <d2p-ueditor
        v-if="currentForm.data && currentForm.data[ueditorIndex] && ueditorKey"
        v-model="currentForm.data[ueditorIndex][ueditorKey]"
        :config="ueditorConfig">
      </d2p-ueditor>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="previewVisible = false">Terminé</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Modifier"
      :visible.sync="manyToManyVisible"
      append-to-body
      v-if="currentForm.data && currentForm.data[manyToManyIndex] && manyToManyKey"
      :width="elProps.fields[manyToManyKey].dialogWidth">
      <foreign-key-crud-form
        v-model="currentForm.data[manyToManyIndex][manyToManyKey]"
        :isInitRows="elProps.fields[manyToManyKey].isInitRows"
        :elProps="elProps.fields[manyToManyKey].elProps"
        @change="foreignChange"
      ></foreign-key-crud-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="manyToManyVisible = false">Enregistrer</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import util from '@/libs/util.js'

export default {
  name: 'foreignKeyCrudForm',
  model: {
    prop: 'value',
    event: ['change', 'input']
  },
  props: {
    elProps: {
      type: Object,
      default () {
        return {
          isInitRows: true,
          index: {
            name: 'N°',
            span: 2
          },
          fields: {
            description: {
              name: 'Description',
              type: 'input',
              span: 10,
              default: null,
              required: true
            },
            content: {
              name: 'Type',
              type: 'select',
              span: 4,
              default: 0,
              required: true,
              options: [{
                value: '0',
                label: 'Choix unique'
              }, {
                value: '1',
                label: 'Choix multiple'
              }, {
                value: '2',
                label: 'Texte court'
              }, {
                value: '3',
                label: 'Texte long'
              }]
            },
            score: {
              name: 'Score',
              type: 'number',
              span: 4,
              default: 0,
              required: true,
              min: 0,
              max: null
            },
            option_data: {
              name: 'Options',
              type: 'many_to_many',
              span: 2,
              default: [],
              required: false,
              unit: '',
              value: {
                type: 'strList',
                rowKey: 'name',
                title: 'Contenu de l\'option'
              },
              isInitRows: true,
              dialogWidth: '700',
              dict: {
                value: 'id',
                label: 'name'
              },
              elProps: {
                index: {
                  name: 'N°',
                  span: 2
                },
                fields: {
                  name: {
                    name: 'Libellé de l\'option',
                    type: 'input',
                    span: 10,
                    default: null,
                    required: true
                  },
                  sort: {
                    name: 'Ordre',
                    type: 'number',
                    span: 8,
                    default: 0,
                    required: true,
                    min: 0,
                    max: null
                  }
                }
              }
            }
          }
        }
      }
    },
    value: {
      type: Array,
      required: false
    }
  },
  data () {
    return {
      ueditorConfig: {
        serverUrl: util.baseURL() + 'api/system/file/ueditor/',
        headers: { Authorization: 'JWT ' + util.cookies.get('token') },
        // Pack de langue français (web/public/lib/UEditor/lang/fr/fr.js)
        lang: 'fr',
        imageUrlPrefix: util.baseFileURL(),
        // Téléversement d'image gribouillée
        scrawlUrlPrefix: util.baseFileURL(),
        // Téléversement via l'outil de capture
        snapscreenUrlPrefix: util.baseFileURL(),
        // Préfixe de chemin pour les images distantes
        catcherUrlPrefix: util.baseFileURL(),
        // Préfixe du chemin d'accès aux vidéos
        videoUrlPrefix: util.baseFileURL(),
        // Préfixe du chemin d'accès aux fichiers
        fileUrlPrefix: util.baseFileURL(),
        // Lister les images du répertoire indiqué
        imageManagerUrlPrefix: util.baseFileURL(),
        // Lister les fichiers du répertoire indiqué
        fileManagerUrlPrefix: util.baseFileURL()
        // Transmettre la configuration à ueditor
        // Référence de la documentation: http://fex.baidu.com/ueditor/#start-config
      },
      // Zone d'édition en modale pour le texte riche
      previewVisible: false,
      ueditorIndex: 0,
      ueditorKey: null,
      // Fenêtre modale plusieurs-à-plusieurs
      manyToManyIndex: 0,
      manyToManyKey: null,
      manyToManyVisible: false
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    submitForm () {
      let res = ''
      this.$refs.currentFormRef.validate((valid) => {
        if (valid) {
          const { data } = this.currentForm
          res = data
        } else {
          console.log('error submit!!')
          return false
        }
      })
      return res
    },
    currentForm () {
      if (!this.value || !this.value[0]) {
        if (this.elProps.isInitRows) {
          const fields = {
            _id: this.value?.length || 0
          }
          for (const key in this.elProps.fields) {
            fields[key] = this.elProps.fields[key].default || null
          }
          this.$emit('change', [fields])
          this.$emit('input', [fields])
          return {
            data: [fields]
          }
        } else {
          return {
            data: []
          }
        }
      }
      return {
        data: this.value
      }
    }
  },
  created () {
  },
  methods: {
    // Échanger les positions des éléments du tableau,
    swapArray (arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      arr[index2].sort = index2 + 1
      arr[index1].sort = index1 + 1
      return arr
    },
    // Supprimer
    removeDomain (index) {
      this.currentForm.data.splice(index, 1)
      this.$emit('change', this.currentForm.data)
      this.$emit('input', this.currentForm.data)
    },
    // Monter
    topDomain (index) {
      this.swapArray(this.currentForm.data, index - 1, index)
      this.$emit('change', this.currentForm.data)
      this.$emit('input', this.currentForm.data)
    },
    // Descendre
    bottomDomain (index) {
      this.swapArray(this.currentForm.data, index, index + 1)
      this.$emit('change', this.currentForm.data)
      this.$emit('input', this.currentForm.data)
    },
    // Ajouter
    addDomain () {
      const fields = {
        _id: this.value?.length || 0
      }
      for (const key in this.elProps.fields) {
        fields[key] = this.elProps.fields[key].default || null
      }
      fields.sort = (this.value?.length || 0) + 1
      this.currentForm.data.push(fields)
      this.$emit('change', this.currentForm.data)
      this.$emit('input', this.currentForm.data)
    },
    // Événement de clic sur le bouton d'aperçu du texte riche
    previewClick (index, key) {
      this.ueditorIndex = index
      this.ueditorKey = key
      this.previewVisible = true
      console.log('previewClick', index, key)
    },
    // Événement de clic plusieurs-à-plusieurs
    manyToManyClick (index, key) {
      this.manyToManyIndex = index
      this.manyToManyKey = key
      this.manyToManyVisible = true
      if (!this.currentForm.data[this.manyToManyIndex][this.manyToManyKey]) {
        this.currentForm.data[this.manyToManyIndex][this.manyToManyKey] = []
      }
    },
    foreignChange (res) {
      if (this.manyToManyKey) {
        this.currentForm.data[this.manyToManyIndex][this.manyToManyKey] = res
      }
    }
  }
}
</script>
<style lang="scss">
.d2p-images {
  height: 30px;
  width: 30px;

  .el-upload-list__item-thumbnail {
    height: 60px !important;
    width: 60px !important;
  }

  .el-upload-list__item {
    width: 60px !important;
    height: 60px !important;
    line-height: 0 !important;

    img {
      height: 60px !important;
      width: 60px !important;
    }
  }

  .el-upload-list__item-actions {
    height: 60px !important;
    width: 60px !important;
    line-height: 0 !important;
  }
}

</style>
<style lang="scss" scoped>
::v-deep .d2p-file-uploader .el-upload--picture-card {
  width: 50px;
  height: 50px;
}
</style>
