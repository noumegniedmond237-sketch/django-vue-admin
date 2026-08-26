<template>
  <d2-container class="page">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Paramètres du profil" name="userInfo">
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <el-form
              ref="userInfoForm"
              label-width="140px"
              :model="userInfo"
              required-asterisk
              :rules="userInforules"
              :label-position="position"
              center
            >
              <el-form-item prop="avatar" label="Photo de profil">
                <d2p-cropper-uploader :value="userInfo.avatar || '/image/avatar.png'" @input="handleAvatarSuccess"/>
              </el-form-item>
              <el-form-item prop="username" label="Identifiant">
                <el-input v-model="userInfo.username" disabled></el-input>
              </el-form-item>
              <el-form-item prop="name" required label="Nom d'affichage">
                <el-input v-model="userInfo.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="Téléphone" required prop="mobile">
                <el-input v-model="userInfo.mobile" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="Email" prop="email">
                <el-input v-model="userInfo.email" clearable></el-input>
              </el-form-item>
              <el-form-item label="Genre" prop="gender">
                <el-radio-group v-model="userInfo.gender">
                  <el-radio :label="1">Homme</el-radio>
                  <el-radio :label="0">Femme</el-radio>
                  <el-radio :label="-1">Non précisé</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Département" prop="dept">
                <el-input :value="userInfo.dept_info && userInfo.dept_info.dept_name" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="Rôle(s) actuel(s)" prop="role">
                <el-select :value="userInfo.role" multiple placeholder="Sélectionner" disabled size="mini" style="width: 100%;">
                  <el-option
                    v-for="item in userInfo.role_info"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="updateInfo" type="primary">
                  <i class="fa fa-check"></i>
                  Mettre à jour
                </el-button>
                <el-button @click="resetForm('info')" type="info">
                  <i class="fa fa-reply-all"></i>
                  Réinitialiser
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Sécurité du mot de passe" name="passwrod">
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <el-form
              ref="userPasswordForm"
              :model="userPasswordInfo"
              required-asterisk
              label-width="160px"
              :label-position="position"
              :rules="passwordRules"
              center
            >
              <el-form-item label="Ancien mot de passe" required prop="oldPassword">
                <el-input
                  type="password"
                  v-model="userPasswordInfo.oldPassword"
                  placeholder="Entrez votre mot de passe actuel"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item required prop="newPassword" label="Nouveau mot de passe">
                <el-input
                  type="password"
                  v-model="userPasswordInfo.newPassword"
                  placeholder="Entrez le nouveau mot de passe"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item required prop="newPassword2" label="Confirmer le mot de passe">
                <el-input
                  type="password"
                  v-model="userPasswordInfo.newPassword2"
                  placeholder="Confirmez le nouveau mot de passe"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="settingPassword">
                  <i class="fa fa-check"></i> Enregistrer
                </el-button>
                <el-button @click="resetForm('passwordForm')" type="info">
                  <i class="fa fa-reply-all"></i> Réinitialiser
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>
<script>
import util from '@/libs/util.js'
import { request } from '@/api/service'
import { mapActions } from 'vuex'
export default {
  name: 'userInfo',
  data () {
    var validatePass = (rule, value, callback) => {
      const pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}')
      if (value === '') {
        callback(new Error('Veuillez saisir un mot de passe'))
      } else if (value === this.userPasswordInfo.oldPassword) {
        callback(new Error('Le nouveau mot de passe doit être différent de l\'ancien'))
      } else if (!pwdRegex.test(value)) {
        callback(new Error('Le mot de passe doit contenir au moins 8 caractères, incluant lettres et chiffres'))
      } else {
        if (this.userPasswordInfo.newPassword2 !== '') {
          this.$refs.userPasswordForm.validateField('newPassword2')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Veuillez confirmer votre mot de passe'))
      } else if (value !== this.userPasswordInfo.newPassword) {
        callback(new Error('Les deux mots de passe ne correspondent pas !'))
      } else {
        callback()
      }
    }
    return {
      position: 'left',
      activeName: 'userInfo',
      action: util.baseURL() + 'api/system/file/',
      headers: {
        Authorization: 'JWT ' + util.cookies.get('token')
      },
      fileList: [],
      userInfo: {
        name: '',
        gender: '',
        mobile: '',
        avatar: '',
        email: ''
      },
      userInforules: {
        name: [{ required: true, message: 'Veuillez saisir un nom d\'affichage', trigger: 'blur' }]
      },
      userPasswordInfo: {
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      },
      passwordRules: {
        oldPassword: [
          {
            required: true,
            message: 'Veuillez entrer le mot de passe actuel',
            trigger: 'blur'
          }
        ],
        newPassword: [{ validator: validatePass, trigger: 'blur' }],
        newPassword2: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.getCurrentUserInfo()
  },
  methods: {
    ...mapActions('d2admin/account', ['logout']),
    getCurrentUserInfo () {
      const _self = this
      return request({
        url: '/api/system/user/user_info/',
        method: 'get',
        params: {}
      }).then((res) => {
        _self.userInfo = res.data
      })
    },
    updateInfo () {
      const _self = this

      _self.$refs.userInfoForm.validate((valid) => {
        if (valid) {
          const userInfo = _self.userInfo
          delete userInfo.role
          request({
            url: '/api/system/user/update_user_info/',
            method: 'put',
            data: userInfo
          }).then((res) => {
            _self.$message.success('Profil mis à jour avec succès')
            _self.getCurrentUserInfo()
          })
        } else {
          this.$message.error('Veuillez vérifier les champs du formulaire')
        }
      })
    },
    resetForm (name) {
      const _self = this
      if (name === 'info') {
        _self.getCurrentUserInfo()
      } else {
        _self.userPasswordForm = {}
      }
    },
    handleClick (tab, event) {
      const _self = this
      if (tab.paneName === 'userInfo') {
        _self.$refs.userPasswordForm.resetFields()
        _self.getCurrentUserInfo()
      } else {
        _self.$refs.userInfoForm.resetFields()
      }
    },
    settingPassword () {
      const _self = this

      _self.$refs.userPasswordForm.validate((valid) => {
        if (valid) {
          const userId = util.cookies.get('uuid')
          if (userId) {
            const params = JSON.parse(JSON.stringify(_self.userPasswordInfo))
            params.oldPassword = _self.$md5(params.oldPassword)
            params.newPassword = _self.$md5(params.newPassword)
            params.newPassword2 = _self.$md5(params.newPassword2)
            request({
              url: '/api/system/user/' + userId + '/change_password/',
              method: 'put',
              data: params
            }).then((res) => {
              _self.activeName = 'userInfo'
              _self.$message.success('Mot de passe modifié avec succès')
              _self.logout({})
            })
          }
        } else {
          this.$message.error('Veuillez vérifier les champs du formulaire')
        }
      })
    },
    handleAvatarSuccess (res, file) {
      this.userInfo.avatar = res
    }
  }
}
</script>
