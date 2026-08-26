<template>
  <div style="padding: 20px">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="Groupe parent" prop="parent">
        <el-select v-model="form.parent" placeholder="Sélectionnez le groupe" clearable style="width: 100%">
          <el-option :label="item.title" :value="item.id" :key="index"
                     v-for="(item,index) in parentOptions"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Titre" prop="title">
        <el-input v-model="form.title" placeholder="Ex: Titre du site" clearable></el-input>
      </el-form-item>
      <el-form-item label="Clé unique" prop="key">
        <el-input v-model="form.key" placeholder="Ex: site_title" clearable></el-input>
      </el-form-item>
      <el-form-item label="Type de champ" prop="form_item_type">
        <el-select v-model="form.form_item_type" placeholder="Sélectionnez le type" clearable style="width: 100%">
          <el-option :label="item.label" :value="item.value" :key="index"
                     v-for="(item,index) in dictionary('config_form_type')"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="[4,5,6].indexOf(form.form_item_type)>-1"
        label="Clé dictionnaire"
        prop="setting"
        :rules="[{required: true,message: 'Ce champ est obligatoire'}]">
        <el-input v-model="form.setting" placeholder="Clé du dictionnaire associé" clearable></el-input>
      </el-form-item>
      <div v-if="[13,14].indexOf(form.form_item_type)>-1">
        <associationTable ref="associationTable" v-model="form.setting"
                          @updateVal="associationTableUpdate"></associationTable>
      </div>
      <el-form-item label="Validation">
        <el-select v-model="form.rule" multiple placeholder="Sélectionnez les règles" clearable style="width: 100%">
          <el-option :label="item.label" :value="item.value" :key="index"
                     v-for="(item,index) in ruleOptions"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Placeholder" prop="placeholder">
        <el-input v-model="form.placeholder" placeholder="Texte indicatif" clearable></el-input>
      </el-form-item>
      <el-form-item label="Ordre" prop="sort">
        <el-input-number v-model="form.sort" :min="0" :max="99"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Créer le paramètre</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as api from '../api'
import associationTable from './components/associationTable'

export default {
  name: 'addContent',
  inject: ['refreshView'],
  components: {
    associationTable
  },
  data () {
    return {
      form: {
        parent: null,
        title: null,
        key: null,
        form_item_type: null,
        rule: null,
        placeholder: null
      },
      rules: {
        parent: [
          {
            required: true,
            message: 'Le groupe parent est requis'
          }
        ],
        title: [
          {
            required: true,
            message: 'Le titre est requis'
          }
        ],
        key: [
          {
            required: true,
            message: 'La clé est requise'
          },
          {
            pattern: /^[A-Za-z0-9_]+$/,
            message: 'Uniquement lettres, chiffres et underscores'
          }
        ],
        form_item_type: [
          {
            required: true,
            message: 'Le type de champ est requis'
          }
        ]
      },
      parentOptions: [],
      ruleOptions: [
        {
          label: 'Obligatoire',
          value: '{"required": true, "message": "Ce champ est obligatoire"}'
        },
        {
          label: 'Email valide',
          value: '{ "type": "email", "message": "Veuillez saisir une adresse email valide"}'
        },
        {
          label: 'URL valide',
          value: '{ "type": "url", "message": "Veuillez saisir une URL valide"}'
        }
      ]
    }
  },
  methods: {
    getParent () {
      api.GetList({
        parent__isnull: true,
        limit: 999
      }).then(res => {
        const { data } = res.data
        this.parentOptions = data
      })
    },
    onSubmit () {
      const that = this
      that.associationTableUpdate().then(() => {
        const form = JSON.parse(JSON.stringify(that.form))
        const rules = []
        if (form.rule) {
          for (const item of form.rule) {
            const strToObj = JSON.parse(item)
            rules.push(strToObj)
          }
        }
        form.rule = rules
        that.$refs.form.validate((valid) => {
          if (valid) {
            api.createObj(form).then(res => {
              this.$message.success('Paramètre créé avec succès')
              this.refreshView()
            })
          } else {
            return false
          }
        })
      })
    },
    associationTableUpdate () {
      const that = this
      return new Promise(function (resolve, reject) {
        if (that.$refs.associationTable) {
          if (!that.$refs.associationTable.onSubmit()) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return reject(false)
          }
          const { formObj } = that.$refs.associationTable
          that.form.setting = formObj
          return resolve(true)
        } else {
          return resolve(true)
        }
      })
    }
  },
  created () {
    this.getParent()
  }
}
</script>

<style scoped>

</style>
