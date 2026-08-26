<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="Titre" prop="title">
        <el-input v-model="form.title" placeholder="Ex: Paramètres Email"></el-input>
      </el-form-item>
      <el-form-item label="Clé unique" prop="key">
        <el-input v-model="form.key" placeholder="Ex: email_config"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Créer le groupe</el-button>
        <el-button @click="$emit('close')">Annuler</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as api from '../api'

export default {
  name: 'addTabs',
  inject: ['refreshView'],
  data () {
    return {
      form: {
        title: null,
        key: null
      },
      rules: {
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
            message: 'Uniquement des lettres, chiffres et underscores'
          }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      const that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          api.createObj(that.form).then(res => {
            this.$message.success('Groupe créé avec succès')
            this.refreshView()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
