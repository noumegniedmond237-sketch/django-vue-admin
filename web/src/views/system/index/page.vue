<template>
  <d2-container class="page">
    <div style="margin-bottom: 15px">
      <el-card class="box-card" shadow="never">
        <div style="font-size: 16px; font-weight: 500; color: #303133;">
          👋 Bienvenue sur votre plateforme d'administration <b>Django Vue Admin</b> !
        </div>
        <div style="font-size: 13px; color: #606266; margin-top: 6px;">
          Une solution complète d'administration basée sur Django Rest Framework et Vue.js, entièrement prête à l'emploi.
        </div>
      </el-card>
    </div>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span><b>À propos du système</b></span>
          </div>
          <div>
            <div style="margin-bottom: 15px;">
              <el-tag type="success">Backend</el-tag>
              <p style="margin-top: 8px; font-size: 13px; color: #606266; line-height: 1.6;">
                Django & Django REST Framework avec gestion avancée des permissions (RBAC), filtres, authentification JWT, journalisation des opérations et architecture modulaire.
              </p>
            </div>
            <div>
              <el-tag type="primary">Frontend</el-tag>
              <p style="margin-top: 8px; font-size: 13px; color: #606266; line-height: 1.6;">
                Interface d'administration moderne sous Vue.js, Element UI et D2Admin avec tableaux réactifs, routage dynamique, gestion des thèmes et support multilingue.
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <div>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span><b>Accès Rapide</b></span>
            </div>

            <el-row :gutter="10">
              <el-col
                :span="12"
                v-for="(li, index) in quickLinks"
                :key="index"
                style="margin-bottom: 10px;"
              >
                <el-card shadow="hover" style="cursor: pointer;" @click.native="$router.push(li.path)">
                  <div style="font-weight: 600; color: #409EFF;">
                    <i :class="li.icon" style="margin-right: 6px;"></i>{{ li.name }}
                  </div>
                  <div style="font-size: 12px; color: #909399; margin-top: 5px;">
                    {{ li.content }}
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
export default {
  data () {
    return {
      quickLinks: [
        {
          name: 'Utilisateurs',
          icon: 'el-icon-user',
          path: '/user',
          content: 'Gérer les comptes et accès utilisateurs'
        },
        {
          name: 'Rôles & Permissions',
          icon: 'el-icon-lock',
          path: '/role',
          content: 'Configurer les rôles et droits du système'
        },
        {
          name: 'Départements',
          icon: 'el-icon-office-building',
          path: '/dept',
          content: 'Gérer l\'organigramme et départements'
        },
        {
          name: 'Paramètres Système',
          icon: 'el-icon-setting',
          path: '/config',
          content: 'Configuration générale de la plateforme'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  .box-card {
    border-radius: 4px;
  }
}
</style>
