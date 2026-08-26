<template>
  <div>
    <el-form :model="formObj" ref="association">
      <el-form-item label="Table liée" prop="table" :rules="[
      { required: true, message: 'Champ obligatoire', trigger: 'blur' }
    ]">
        <el-select v-model="formObj.table" filterable clearable placeholder="Sélectionner une table" @change="handleChange">
          <el-option
            v-for="item in tableOptions"
            :key="item.table"
            :label="item.tableName"
            :value="item.table">
            <span style="float: left">{{ item.tableName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.table }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Champ affiché" prop="field" :rules="[
      { required: true, message: 'Champ obligatoire', trigger: 'blur' }
    ]">
        <el-select v-model="formObj.field" filterable clearable placeholder="Sélectionner un champ">
          <el-option
            v-for="item in labelOptions"
            :key="item.table"
            :label="item.title"
            :value="item.field">
            <span style="float: left">{{ item.field }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.title }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Clé primaire / stockage" prop="primarykey" :rules="[
      { required: true, message: 'Champ obligatoire', trigger: 'blur' }
    ]">
        <el-select v-model="formObj.primarykey" filterable clearable placeholder="Sélectionner la clé">
          <el-option
            v-for="(item,index) in labelOptions"
            :key="index"
            :label="item.title"
            :value="item.field">
            <span style="float: left">{{ item.field }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.title }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Champs de recherche" prop="oldSearchField" :rules="[
      { required: true, message: 'Champ obligatoire', trigger: 'blur' }
    ]">
        <el-select v-model="formObj.oldSearchField" multiple filterable clearable placeholder="Sélectionner les champs"
                   @change="handleSearch">
          <el-option
            v-for="(item,index) in labelOptions"
            :key="index"
            :label="item.title"
            :value="item.field">
            <span style="float: left">{{ item.field }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.title }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as api from '../../api'

export default {
  name: 'associationTable',
  props: {
    value: {
      type: Object
    }
  },
  model: {
    prop: 'value',
    event: 'updateVal'
  },
  data () {
    return {
      formObj: {
        table: null,
        primarykey: null,
        field: null,
        searchField: null,
        oldSearchField: null
      },
      searchField: null,
      tableOptions: [],
      labelOptions: []
    }
  },
  methods: {
    init () {
      api.GetAssociationTable().then(res => {
        const { data } = res
        this.tableOptions = data
        this.formObj.table = data[0].table
        this.labelOptions = data[0].tableFields
        this.formObj.primarykey = 'id'
        this.formObj.field = 'id'
      })
    },
    handleChange (val) {
      const that = this
      const { tableFields } = that.tableOptions.find(item => {
        return item.table === val
      })
      that.labelOptions = tableFields
    },
    handleSearch (val) {
      const that = this
      const fields = that.labelOptions.filter(item => {
        return val.indexOf(item.field) > -1
      })
      that.formObj.searchField = fields
    },
    handleUpdate () {
      this.$emit('updateVal', this.formObj)
    },
    onSubmit () {
      let res = false
      this.$refs.association.validate((valid) => {
        if (valid) {
          res = true
        } else {
          return false
        }
      })
      return res
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
