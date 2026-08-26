<template>
  <div>
    <img
      src="./image/d2-help-button@2x.png"
      style="width: 138px;"
      @click="dialogVisible = true">
    <el-dialog
      title="Aide & Documentation"
      width="800px"
      :visible.sync="dialogVisible"
      :append-to-body="true">
      <div style="margin-top: -25px; margin-bottom: -25px;">
        <el-button-group class="d2-mb">
          <el-button @click="$open('https://github.com/greper/d2-crud-plus')">
            <d2-icon name="github" class="d2-mr-5 "/>
            GitHub
          </el-button>
          <el-button @click="$open('http://qiniu.veryreader.com/D2CrudPlusExample/index.html')">
            <d2-icon name="book" class="d2-mr-5"/>
            Exemples
          </el-button>
          <el-button @click="$open('https://greper.github.io/d2-crud-plus/')">
            <d2-icon name="book" class="d2-mr-5"/>
            Doc d2-crud-plus
          </el-button>
          <el-button @click="$open('https://fairyever.com/d2-admin/doc/zh/')">
            <d2-icon name="book" class="d2-mr-5"/>
            Doc d2-admin
          </el-button>
        </el-button-group>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false
    }
  }
}
</script>
