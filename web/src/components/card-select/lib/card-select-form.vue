<!-- Options de cartes plusieurs-à-plusieurs -->
<template>
  <div class="cardSelectForm">
    <div class="menu" v-for="(data, title) in tableData" :key="title">
      <div class="title" v-if="showGroupTitle">
        {{title}}
        <span class="content">
          Ajouter{{title}}
        </span>
      </div>
      <el-row>
        <el-col :span="7" :offset="index % 3 === 0 ? 0 : 1" v-for="(item,index) in data" :key="index" class="package_features">
          <div class="menu-item flex"
               :class="{active: value.indexOf(item.id) !== -1, disabled:item[fields.required]}"
               @click="handleValueChange(item.id,item[fields.required])">
            <div class="m-r-10">
              <el-avatar shape="square" :size="34" fit="fill" :src="baseURL + item[fields.icon]"></el-avatar>
            </div>
            <div class="menu-info flex-1">
              <div class="nr">{{ item[fields.name] }}</div>
              <div class="content">{{ item[fields.content] }}</div>
            </div>
            <span class="is-required" v-if="item[fields.required]"> Obligatoire </span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { request } from '@/api/service'
import { d2CrudPlus } from 'd2-crud-plus'
import util from '@/libs/util'

export default {
  name: 'card-select-form',
  model: {
    prop: 'value',
    event: ['change', 'input']
  },
  mixins: [d2CrudPlus.input, d2CrudPlus.inputDict],
  props: {
    // Valeur
    value: {
      type: Array,
      required: false,
      default: Array
    },
    // Configuration du dictionnaire de données
    dict: {
      type: Object,
      require: false
    },
    // Autres configurations
    elProps: {
      type: Object,
      require: false,
      default () {
        return {
          tableConfig: {
            multiple: false,
            columns: []
          }
        }
      }
    },
    fields: {
      type: Object,
      default () {
        return {
          name: 'name', // Nom
          content: 'description', // Champ de description du contenu
          required: 'is_required', // Champ obligatoire
          icon: 'icon', // Champ d'icône
          group: 'category' // Champ de regroupement
        }
      }
    },
    // On peut définir des paramètres transmis via component.props
    disabled: {
      type: Boolean,
      default: false
    },
    showGroupTitle: {
      type: Boolean,
      default: true
    },
    isGroup: {
      type: Boolean,
      default: true
    },
    // Sans groupement, un nom de groupe par défaut est utilisé (peut être vide),
    defaultGroupTitle: {
      type: String,
      default: 'Base'
    }
  },
  data () {
    return {
      pageConfig: {
        page: 1,
        limit: 999,
        total: 0
      },
      tableData: [],
      requiredIds: [],
      baseURL: util.baseURL()
    }
  },
  computed: {
    // On peut aussi surveiller les changements de value via computed (similaire à watch, à choisir selon le cas)computedsurveiller les changements de value,watch,
    _elProps () {
      return this.elProps
    }
  },
  watch: {

  },
  created () {
    this.getDict()
  },
  mounted () {
  },
  methods: {
    // Initialisationvalue
    initValue () {
      // Si la valeur par défaut est vide, assigner toutes les valeurs obligatoires à value,value
      if (this.value.length === 0) {
        this.$emit('change', this.requiredIds)
        this.$emit('input', this.requiredIds)
      }
    },
    // Récupérer les données
    getDict () {
      const that = this
      let url
      if (typeof that.dict.url === 'function') {
        const form = that.d2CrudContext.getForm()
        url = that.dict.url(that.dict, { form })
      } else {
        url = that.dict.url
      }
      let dictParams = {}
      if (that.dict.params) {
        dictParams = { ...that.dict.params }
      }
      const params = {
        page: that.pageConfig.page,
        limit: that.pageConfig.limit
      }
      if (that._elProps.tableConfig.data === undefined || that._elProps.tableConfig.data.length === 0) {
        request({
          url: url,
          method: 'get',
          params: { ...params, ...dictParams }
        }).then(res => {
          let { data, page, limit, total } = res.data
          const requiredIds = []
          data = data.reduce((acc, item) => {
            if (item[this.fields.required]) {
              requiredIds.push(item.id)
            }
            const { ...rest } = item
            const group = this.isGroup ? item[this.fields.group] : this.defaultGroupTitle
            if (!acc[group]) {
              acc[group] = []
            }
            acc[group].push(rest)
            return acc
          }, {})
          this.requiredIds = requiredIds
          this.initValue()
          that.pageConfig.page = page
          that.pageConfig.limit = limit
          that.pageConfig.total = total
          that.tableData = data
        })
      } else {
        const requiredIds = []
        that.tableData = that._elProps.tableConfig.data.reduce((acc, item) => {
          if (item[this.fields.required]) {
            requiredIds.push(item.id)
          }
          const { ...rest } = item
          const group = this.isGroup ? item[this.fields.group] : this.defaultGroupTitle
          if (!acc[group]) {
            acc[group] = []
          }
          acc[group].push(rest)
          return acc
        }, {})
        this.requiredIds = requiredIds
        this.initValue()
      }
    },
    /**
     * Sélection
     * @param val:Object
     */
    handleValueChange (val, isRequired) {
      if (!isRequired) {
        if (this.value.indexOf(val) === -1) {
          this.$emit('change', [...this.value, val])
          this.$emit('input', [...this.value, val])
        } else {
          const newValue = JSON.parse(JSON.stringify(this.value))
          newValue.splice(this.value.indexOf(val), 1)
          this.$emit('change', newValue)
          this.$emit('input', newValue)
        }
      }
    }
  }
}
</script>
<style scoped>
.option {
  height: auto;
  line-height: 1;
  padding: 5px;
  background-color: #fff;
}

</style>
<style lang="scss">
.cardSelectForm {
  line-height: 1.3;
  .title {
    margin-bottom: 16px;
    font-size: 14px;
    color: #333;
    font-weight: 500;

    .content {
      color: #999;
      font-size: 11px;
      margin-left: 4px;
    }
  }

  .menu {
    margin: 0;
  }

  .menu-item {
    margin: 10px 0;
    padding: 0 16px;
    border-radius: 8px;
    background: #f9f9f9;
    width: 220px;
    border: 1px solid #f9f9f9;
    cursor: pointer;
    height: 80px;
    position: relative;
  }

  .flex {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .menu-info {
    min-width: 0;
    flex: 1;

    .nr {
      font-weight: 400;
      color: #333;
      font-size: 14px;
    }

    .content {
      color: #999;
      font-size: 11px;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
  .flex-1{
    flex: 1;
  }
  .m-r-10{
    margin-right: 10px;
  }
  .active{
    background: #f5f8ff;
    border: 1px solid #4073fa;
  }
  .disabled{
    cursor: not-allowed;
  }
  .is-required{
    position: absolute;
    background-color: #ff9959;
    color: #fff;
    top: 10px;
    right: 0;
    transform: translateY(-50%);
    padding: 1px 4px;
    border-radius: 4px;
  }
}
</style>
