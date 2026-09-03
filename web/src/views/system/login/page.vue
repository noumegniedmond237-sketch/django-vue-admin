<template>
  <div
    class="w3l-signinform"
    :style="{background:'url(' +(loginBackground || require('@/assets/image/bg.jpg')) +') no-repeat center', backgroundSize: '100% 100%' }"
  >
    <!-- container -->
    <div class="wrapper">
      <!-- main content -->
      <div class="w3l-form-info">
        <!-- logo -->
        <img class="page-login--logo" :src="siteLogo" width="300"/>
        <div class="w3_info">
          <h2 style="text-align: center">{{ siteName || processTitle }}</h2>
          <el-card shadow="always" class="card">
            <el-tabs v-model="activeName">
              <el-tab-pane :label="$t('page.login.title') || 'Login'" name="first" stretch>
                <span slot="label"><span style="margin: 30px">{{ $t('page.login.title') || 'Login' }}</span></span>
                <br/>
                <el-form
                  ref="loginForm"
                  label-position="top"
                  :rules="rules"
                  :model="formLogin"
                  size="default"
                >
                  <el-form-item prop="username">
                    <el-input
                      type="text"
                      v-model="formLogin.username"
                      prefix-icon="el-icon-user-solid"
                      :placeholder="($t('page.login.username') || 'Username') + ' (superadmin)'"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      type="password"
                      v-model="formLogin.password"
                      prefix-icon="el-icon-s-promotion"
                      show-password
                      :placeholder="($t('page.login.password') || 'Password') + ' (admin123456)'"
                      @keyup.enter.native='submit'
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    prop="captcha"
                    v-if="captchaState"
                    :rules="{required: true,message: $t('page.login.captcha') || 'Captcha',trigger: 'blur'}"
                  >
                    <el-input
                      type="text"
                      v-model="formLogin.captcha"
                      :placeholder="$t('page.login.captcha') || 'Captcha'"
                      @keyup.enter.native="submit"
                    >
                      <template slot="append">
                        <img
                          alt="Captcha"
                          class="login-code"
                          style="cursor: pointer;width:145px;height: 33px;"
                          height="33px"
                          width="145px"
                          slot="suffix"
                          :src="image_base"
                          @click="getCaptcha"
                        />
                      </template>
                    </el-input>
                  </el-form-item>
                </el-form>
                <el-row v-if="isTenant && isPublic">
                  <el-col :span="11">
                    <button class="btn btn-primary btn-block" style="padding: 10px 10px;" @click="submit">{{ $t('page.login.btn') || 'Login' }}</button>
                  </el-col>
                  <el-col :span="11" :offset="2">
                    <button
                      class="btn btn-primary btn-block"
                      style="padding: 10px 10px;background-color: #409eff;color: #fff;"
                      @click="$router.push('/register')">
                      {{ $t('page.login.trial') || 'Trial' }}
                    </button>
                  </el-col>
                </el-row>
                <button v-else class="btn btn-primary btn-block" style="padding: 10px 10px;" @click="submit">{{ $t('page.login.btn') || 'Login' }}</button>
                <component v-if="componentTag" :is="componentTag"></component>
              </el-tab-pane>
            </el-tabs>
          </el-card>
          <el-button
            class="page-login--quick"
            size="default"
            type="success"
            @click="selectUsersDialogVisible = true"
            v-if="$env === 'development'"
          >
            {{ $t('page.login.quick') || 'Quick Login' }}
          </el-button>
          <!-- footer -->
          <div class="footer">
            <p class="page-login--content-footer-locales">
              <a
                v-for="language in $languages"
                :key="language.value"
                @click="onChangeLocale(language.value)"
                style="cursor:pointer;"
              >
                {{ language.label }}
              </a>
            </p>
            <p>Copyright &copy; {{ copyright }}</p>
            <p>
              <a href="https://beian.miit.gov.cn" target="_blank">{{
                keepRecord
                }}</a>
              | <a :href="helpUrl || '#'" target="_blank">Aide</a> |
              <a :href="privacyUrl || '#'" target="_blank">Confidentialité</a> |
              <a :href="clauseUrl || '#'" target="_blank">Conditions</a>
            </p>
          </div>
          <!-- footer -->
        </div>
      </div>
      <!-- //main content -->
    </div>
    <!-- //container -->
    <el-dialog title="Sélection rapide d'utilisateur" :visible.sync="selectUsersDialogVisible" width="400px" append-to-body>
      <el-row :gutter="10" style="margin: -20px 0px -10px 0px">
        <el-col v-for="(user, index) in users" :key="index" :span="8">
          <div class="page-login--quick-user" @click="handleUserBtnClick(user)">
            <d2-icon name="user-circle-o"/>
            <span>{{ user.name }}</span>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import base from './base.vue'
const pluginImport = require('@/libs/util.import.plugin')
export default {
  extends: base,
  name: 'page',
  data () {
    return {
      activeName: 'first',
      componentTag: ''
    }
  },
  created () {
    // Enregistrer le plugin de connexion tierce
    var componentTag = ''
    try {
      componentTag = pluginImport('dvadmin-third-web/src/login/index')
    } catch (error) {
      componentTag = ''
    }
    this.componentTag = componentTag
  },
  mounted () {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  @import './css/style.css';

  .copyrights {
    text-indent: -9999px;
    height: 0;
    line-height: 0;
    font-size: 0;
    overflow: hidden;
  }

  // Panneau de sélection rapide d'utilisateur
  .page-login--quick {
    margin-top: 20px;
  }

  .page-login--quick-user {
    @extend %flex-center-col;
    padding: 10px 0px;
    border-radius: 4px;

    &:hover {
      background-color: $color-bg;

      i {
        color: $color-text-normal;
      }

      span {
        color: $color-text-normal;
      }
    }

    i {
      font-size: 36px;
      color: $color-text-sub;
    }

    span {
      font-size: 12px;
      margin-top: 10px;
      color: $color-text-sub;
    }
  }
</style>
