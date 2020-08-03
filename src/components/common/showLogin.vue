<template>
  <div class="show-login-dialog">
    <el-dialog
    :visible.sync="loginDialogVisible"
    title="提示"
    width="440px"
    :before-close="handleClose">
      <span>您还没有登录，请先登录!</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="linkLogin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'showLogin',
  data(){
    return{
      rUrl:""
    }
  },
  props:[
    'loginDialogVisible',
    'redictUrl'
  ],
  watch:{
    redictUrl(newVal){
      this.rUrl = newVal
    }
  },
  methods:{
    linkLogin(){
      this.$router.push({
        path: '/login?redictUrl=' + this.rUrl
      })
    },
    handleClose(){
      this.$emit("closeEvent")
    }
  }
}
</script>
<style lang="scss">
  .show-login-dialog{
    .el-dialog__body{
      padding: 0 20px;
      font-size: 16px;
    }
  }
</style>
