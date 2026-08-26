<template>
  <div>
    <div style="margin: 10px">
      <el-button
        type="primary"
        size="mini"
        @click="submitPermisson"
        v-permission="'Save'"
      >Enregistrer
      </el-button>
    </div>
    <el-container style="height: 80vh; border: 1px solid #eee">
      <el-aside width="300px" style="border:1px solid #eee;padding: 20px;">
        <div style="margin: 10px;">
          <div style="margin-bottom: 20px">
            <div class="yxt-flex-align-center">
              <div class="yxt-divider"></div>
              <span>Périmètre des Données</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="dataAuthorizationTips"
                placement="right"
              >
                <el-icon class="el-icon-question"></el-icon>
              </el-tooltip>
            </div>
          </div>

          <div>
            <el-select
              v-show="roleObj.name"
              v-model="roleObj.data_range"
              @change="dataScopeSelectChange"
            >
              <el-option
                v-for="item in dataScopeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>

          <div v-show="roleObj.data_range === 4" class="dept-tree">
            <el-tree
              :data="deptOptions"
              show-checkbox
              default-expand-all
              :default-checked-keys="deptCheckedKeys"
              ref="dept"
              node-key="id"
              :check-strictly="true"
              :props="{ label: 'name' }"
            ></el-tree>
          </div>

        </div>
      </el-aside>
      <el-main>
        <div style="margin: 10px;">
          <div>
            <div style="margin-bottom: 20px">
              <div class="yxt-flex-align-center">
                <div class="yxt-divider"></div>
                <span>Permissions des Menus</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="menuAuthorizationTips"
                  placement="right"
                >
                  <el-icon class="el-icon-question"></el-icon>
                </el-tooltip>
              </div>
            </div>
            <el-tree
              class="flow-tree"
              ref="menuTree"
              :data="menuOptions"
              node-key="id"
              default-expand-all
              show-checkbox
              :expand-on-click-node="false"
              :default-checked-keys="menuCheckedKeys"
              :check-on-click-node="false"
              empty-text="Veuillez d'abord sélectionner un rôle"
              :check-strictly="menuCheckStrictly"
              @check-change="handleCheckClick"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <div class="yxt-flex-between">
                  <div :style="{width:((4-node.level)*18+100)+'px'}">{{ data.name }}</div>
                  <div>
                    <el-checkbox
                      v-for="(item, index) in data.menuPermission"
                      :key="index"
                      v-model="item.checked"
                    >{{ item.name }}</el-checkbox>
                  </div>
                </div>
              </span>
            </el-tree>
          </div>
        </div>
        <el-backtop target=".el-main"></el-backtop>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import * as api from './api'
import XEUtils from 'xe-utils'

export default {
  name: 'rolePermission',
  props: {
    roleObj: {
      type: Object,
      default () {
        return {
          name: null,
          data_range: null
        }
      }
    }
  },
  data () {
    return {
      filterText: '',
      data: [],
      menuOptions: [],
      permissionData: [],
      menuCheckedKeys: [],
      menuCheckStrictly: false,
      deptOptions: [],
      deptCheckedKeys: [],
      dataScopeOptions: [
        {
          value: 0,
          label: 'Uniquement ses propres données'
        },
        {
          value: 1,
          label: 'Ce département et sous-départements'
        },
        {
          value: 2,
          label: 'Ce département uniquement'
        },
        {
          value: 3,
          label: 'Toutes les données'
        },
        {
          value: 4,
          label: 'Périmètre personnalisé'
        }
      ],
      dataAuthorizationTips: 'Portée des données accessibles pour ce rôle',
      menuAuthorizationTips: 'Menus et fonctionnalités accessibles pour ce rôle'
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getCrudOptions () {
      // eslint-disable-next-line no-undef
      return crudOptions(this)
    },
    pageRequest (query) {
      return api.GetList(query).then(res => {
        res.map((value, index) => {
          value.node_id = index
        })
        this.data = res
        this.$nextTick().then(() => {
          this.initNode()
        })
      })
    },
    initNode () {
      this.getDeptData()
      this.getMenuData(this.roleObj)
      this.menuCheckedKeys = this.roleObj.menu
      this.menuCheckStrictly = true
      this.deptCheckedKeys = this.roleObj.dept
      this.GetDataScope()
    },
    addRequest (row) {
      return api.createObj(row)
    },
    updateRequest (row) {
      return api.UpdateObj(row)
    },
    delRequest (row) {
      return api.DelObj(row.id)
    },
    getDeptData () {
      api.GetDataScopeDept().then(ret => {
        this.deptOptions = XEUtils.toArrayTree(ret.data, { parentKey: 'parent', strict: false })
      })
    },
    getMenuData (data) {
      api.GetMenuData(data).then(res => {
        res.forEach(x => {
          x.menuPermission.forEach(a => {
            if (data.permission.indexOf(a.id) > -1) {
              this.$set(a, 'checked', true)
            } else {
              this.$set(a, 'checked', false)
            }
          })
        })
        this.menuOptions = XEUtils.toArrayTree(res, {
          parentKey: 'parent',
          strict: true
        })
      })
    },
    GetDataScope () {
      api.GetDataScope().then(res => {
        if (res.data && res.data.length > 0) {
          const frenchLabels = {
            0: 'Uniquement ses propres données',
            1: 'Ce département et sous-départements',
            2: 'Ce département uniquement',
            3: 'Toutes les données',
            4: 'Périmètre personnalisé'
          }
          this.dataScopeOptions = res.data.map(item => ({
            ...item,
            label: frenchLabels[item.value] || item.label
          }))
        }
      })
    },
    getMenuAllCheckedKeys () {
      const checkedKeys = this.$refs.menuTree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.menuTree.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    getDeptAllCheckedKeys () {
      const checkedKeys = this.$refs.dept.getCheckedKeys()
      const halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    submitPermisson () {
      this.roleObj.menu = this.getMenuAllCheckedKeys()
      this.roleObj.dept = this.getDeptAllCheckedKeys()
      const menuData = XEUtils.toTreeArray(this.menuOptions)
      const permissionData = []
      menuData.forEach(x => {
        const checkedPermission = x.menuPermission.filter(f => {
          return f.checked
        })

        if (checkedPermission.length > 0) {
          for (const item of checkedPermission) {
            permissionData.push(item.id)
          }
        }
      })
      this.roleObj.permission = permissionData
      return this.updateRequest(this.roleObj).then(res => {
        this.$message.success('Autorisations mises à jour avec succès')
      })
    },
    dataScopeSelectChange (value) {
      if (value !== 4) {
      }
    },
    handleCheckClick (data, checked) {
      const {
        menuPermission,
        children,
        parent
      } = data
      this.menuCheckStrictly = false
      for (const item of menuPermission) {
        this.$set(item, 'checked', checked)
      }
      if (children && parent) {
        for (const item of children) {
          this.$refs.menuTree.setChecked(item.id, checked)
        }
      }
    }
  },
  created () {
    this.pageRequest()
  }
}
</script>

<style lang="scss">
.yxtInput {
  .el-form-item__label {
    color: #49a1ff;
  }
}

.dept-tree::-webkit-scrollbar {
  display: none;
}

.dept-tree {
  height: 160px;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.flow-tree {
  overflow: auto;
  flex: 1;

  margin: 10px;

  .el-tree-node {
    .el-tree-node__children {
      overflow: visible !important
    }
  }
}

</style>
