<template>
  <el-card class="card-view" shadow="always"
           :style="{backgroundColor:randomColor(),color: config?.fontColor?.value}">
    <div style="display:flex;flex: 1; flex-wrap: wrap;justify-content: space-between; margin-top: 10px;"
         :style="{color: config?.fontColor?.value}">
      <div style="flex: 1; min-width: 180px;max-width:180px;height: 80px; display: flex;">
        <el-col :span="4" class="lightgreen-box">
          <div class="underline">
            <i class="el-icon-s-promotion"></i>
          </div>
        </el-col>
        <el-col :span="20" class="orange-box">
          <div class="enroll-time">
            <div class="enroll-number"><h3>{{ data.today_users || 0 }}</h3>
            </div>
            <div class="enroll-text">Inscriptions aujourd'hui
            </div>
          </div>
        </el-col>
      </div>
      <div style="flex: 1;min-width: 180px;max-width:180px;height: 80px; display: flex;">
        <el-col :span="4" class="lightgreen-box">
          <div class="underline">
            <i class="el-icon-chat-line-square"></i>
          </div>
        </el-col>
        <el-col :span="20" class="orange-box">
          <div class="enroll-time">
            <div class="enroll-number"><h3>{{ data.today_logins || 0 }}</h3>
            </div>
            <div class="enroll-text">Connexions aujourd'hui
            </div>
          </div>
        </el-col>
      </div>
      <div style="flex: 1;min-width: 180px;max-width:180px;height: 80px; display: flex;">
        <el-col :span="4" class="lightgreen-box">
          <div class="underline">
            <i class="el-icon-date"></i>
          </div>
        </el-col>
        <el-col :span="20" class="orange-box">
          <div class="enroll-time">
            <div class="enroll-number"><h3>{{ data.three_days || 0 }}</h3>
            </div>
            <div class="enroll-text">Nouveaux (3 jours)
            </div>
          </div>
        </el-col>
      </div>
      <div style="flex: 1;min-width: 180px;max-width:180px;height: 80px; display: flex;">
        <el-col :span="4" class="lightgreen-box">
          <div class="underline">
            <i class="el-icon-user-solid"></i>
          </div>
        </el-col>
        <el-col :span="20" class="orange-box">
          <div class="enroll-time">
            <div class="enroll-number"><h3>{{ data.seven_days || 0 }}</h3>
            </div>
            <div class="enroll-text">Actifs (7 jours)
            </div>
          </div>
        </el-col>
      </div>
      <div style="flex: 1;min-width: 180px;max-width:180px;height: 80px;display: flex;">
        <el-col :span="4" class="lightgreen-box">
          <div class="underline">
            <i class="el-icon-folder-add"></i>
          </div>
        </el-col>
        <el-col :span="20" class="orange-box">
          <div class="enroll-time">
            <div class="enroll-number"><h3>{{ data.seven_days_active || 0 }}</h3>
            </div>
            <div class="enroll-text">Nouveaux (7 jours)
            </div>
          </div>
        </el-col>
      </div>
      <div style="flex: 1;min-width: 180px;max-width:180px;height: 80px; display: flex;">
        <el-col :span="4" class="lightgreen-box">
          <div class="underline">
            <i class="el-icon-user"></i>
          </div>
        </el-col>
        <el-col :span="20" class="orange-box">
          <div class="enroll-time">
            <div class="enroll-number"><h3>{{ data.monthly_active || 0 }}</h3>
            </div>
            <div class="enroll-text">Actifs mensuels
            </div>
          </div>
        </el-col>
      </div>
    </div>
  </el-card>
</template>

<script>
import { request } from '@/api/service'

export default {
  sort: 5,
  title: 'Activité des Utilisateurs',
  name: 'usersActive',
  icon: 'el-icon-user-solid',
  description: 'Statistiques d\'inscriptions et d\'utilisateurs actifs',
  height: 18,
  width: 20,
  isResizable: true,
  config: {
    color: {
      label: "Couleur d'arrière-plan",
      type: 'color',
      value: '',
      placeholder: 'Laissez vide pour couleur aléatoire'
    },
    fontColor: {
      label: 'Couleur du texte',
      type: 'color',
      value: '',
      placeholder: 'Sélectionnez la couleur du texte'
    }
  },
  props: {
    config: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      data: {}
    }
  },
  mounted () {
    this.initGet()
  },
  methods: {
    initGet () {
      request({
        url: '/api/system/datav/users_active/'
      }).then((res) => {
        this.data = res.data
      })
    },
    randomColor () {
      const color = [
        '#fffff'
      ]
      const ran = Math.floor(Math.random() * 4)
      return color[ran]
    }
  }
}
</script>

<style scoped lang="scss">
.card-view {
  color: $color-primary;
}
.enroll-number{
  color: $color-primary;
}
h3 {
  margin: 0;
}
.lightgreen-box {
  border-bottom: 2px solid;
  height: 60px;
  margin-bottom: 10px;
}

.underline i {
  font-size: 30px;
}

.orange-box {
  height: 60px;
  color: black;
  border-bottom: 2px solid rgb(242, 242, 242);
}

.enroll-time {
  margin-left: 10px;
}

.enroll-text {
  color: rgb(138, 138, 138);
}

.el-card {
  height: 100%;
}
</style>
