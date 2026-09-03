<template>
  <div class="page-login"></div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import localeMixin from '@/locales/mixin.js'
import * as api from '@/views/system/login/api'
import { checkPlugins } from '@/views/plugins'

export default {
  mixins: [localeMixin],
  beforeCreate () {
    // Initialiser la configuration
    this.$store.dispatch('d2admin/settings/init')
  },
  data () {
    return {
      processTitle: (process.env.VUE_APP_TITLE === 'Django Vue Admin' ? 'Django Vue Admin' : process.env.VUE_APP_TITLE) || 'Django Vue Admin',
      backgroundImage: 'url(' + this.loginBackground + ')',
      // Formulaire
      formLogin: {
        username: '',
        password: '',
        captcha: ''
      },
      // Validation du formulaire
      rules: {
        username: [
          {
            required: true,
            message: "Veuillez saisir le nom d'utilisateur",
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'Veuillez saisir le mot de passe',
            trigger: 'blur'
          }
        ]
      },
      captchaKey: null,
      image_base: null,
      // Connexion rapide, pour l'environnement de développement
      selectUsersDialogVisible: false,
      users: [
        {
          name: 'SuperAdmin',
          username: 'superadmin',
          password: 'admin123456'
        },
        {
          name: 'Admin',
          username: 'admin',
          password: 'admin123456'
        }
      ],
      isTenant: checkPlugins('dvadmin-tenants-web')
    }
  },
  computed: {
    ...mapState('d2admin', {
      siteLogo: state => state.settings.data['login.site_logo'] || require('@/assets/image/dvadmin.png'), // Adresse du logo du site
      keepRecord: state => state.settings.data['login.keep_record'],
      siteName: state => state.settings.data['login.site_name'], // Nom du site
      copyright: state => state.settings.data['login.copyright'],
      loginBackground: state => state.settings.data['login.login_background'] || require('@/assets/image/bg.jpg'), // Image de fond de la page de connexion
      helpUrl: state => state.settings.data['login.help_url'], // Aide
      privacyUrl: state => state.settings.data['login.privacy_url'], // Confidentialité
      clauseUrl: state => state.settings.data['login.clause_url'], // Conditions
      captchaState: state => state.settings.data['base.captcha_state'] !== undefined ? state.settings.data['base.captcha_state'] : true, // Code de vérification
      isPublic: state => state.settings.data.schema_name === 'public' // Indique si super-locataire (tenant)
    })
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions('d2admin/account', ['login']),
    /**
     * Obtenir le code de vérification
     */
    getCaptcha () {
      if (this.captchaState !== undefined && !this.captchaState) return
      api.getCaptcha().then((ret) => {
        this.formLogin.captcha = null
        this.captchaKey = ret.data.key
        this.image_base = ret.data.image_base
      })
    },
    /**
     * @description Soumettre le formulaire
     */
    // Soumettre les informations de connexion
    submit () {
      const that = this
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // Connexion
          // Attention : la démo ne transmet pas de code de vérification
          // Modifier le code selon les données à transmettre
          this.login({
            username: that.formLogin.username,
            // Mot de passe en clair (TLS) : hash natif côté serveur (cf. CustomBackend)
            password: that.formLogin.password,
            captcha: that.formLogin.captcha,
            captchaKey: that.captchaKey
          })
            .then(() => {
              // Si l'objet de redirection n'existe pas, retourner le chemin racine
              // this.$router.replace(this.$route.query.redirect || '/')
              this.$router.replace('/')
            })
            .catch(() => {
              this.getCaptcha()
            })
        } else {
          // Échec de validation du formulaire de connexion
          this.$message.error('Veuillez vérifier les champs du formulaire')
        }
      })
    },
    // Connexion rapide
    handleUserBtnClick (user) {
      this.formLogin.username = user.username
      this.formLogin.password = user.password
      // this.submit()
      this.selectUsersDialogVisible = false
      if (!this.captchaState) {
        this.submit()
      }
    }
  },
  created () {
    this.$store.dispatch('d2admin/db/databaseClear')
    this.getCaptcha()
  }
}
</script>

<style lang="scss" scoped>
// ----
.page-login {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-position: center 0;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  -webkit-background-size: cover; /* Compatible avec les navigateurs à noyau Webkit comme Chrome et Safari */
  -o-background-size: cover; /* Compatible avec Opera */
  zoom: 1;
}

::v-deep .el-card__body {
  height: 100%;
  padding: 0;
}

.card {
  height: 100%;
  width: 100%;
  border-radius: 30px;
  padding: 0;
  margin-top: 12%;
}

.right-card {
  float: right;
  text-align: center;
  width: 50%;
  height: 100%;
}

.right-card h1 {
  color: #098dee;
  margin-bottom: 40px;
  margin-top: 40px;
}

.button-login {
  width: 100%;
  margin-top: 30px;
}

::v-deep .el-input-group__append {
  padding: 0;
}

// footer
.page-login--content-footer {
  margin-top: 10%;
  padding: 1em 0;

  .page-login--content-footer-locales {
    padding: 0px;
    margin: 0px;
    margin-bottom: 15px;
    font-size: 12px;
    line-height: 12px;
    text-align: center;
    color: $color-text-normal;

    a {
      color: $color-text-normal;
      margin: 0 0.5em;

      &:hover {
        color: $color-text-main;
      }
    }
  }

  .page-login--content-footer-copyright {
    padding: 0px;
    margin: 0px;
    margin-bottom: 10px;
    font-size: 12px;
    line-height: 12px;
    text-align: center;
    color: $color-text-normal;

    a {
      color: $color-text-normal;
    }
  }

  .page-login--content-footer-options {
    padding: 0px;
    margin: 0px;
    font-size: 12px;
    line-height: 12px;
    text-align: center;

    a {
      color: $color-text-normal;
      margin: 0 1em;
    }
  }
}
</style>
