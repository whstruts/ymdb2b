<template>
  <div class="show-varify-dialog">
    <el-dialog
    :visible.sync="varifyDialogVisible"
    title=""
    width="500px"
    :before-close="handleClose">
      <span class="content">你的账号信息还未认证，暂不可进行药品采购，请点击“<i>去认证</i>” 去完善账号信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="linkLogin">去认证</el-button>
        <el-button type="" @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'varifyInfo',
  data(){
    return{

    }
  },
  props:[
    'varifyDialogVisible',
  ],
  methods:{
    linkLogin(){
      this.$router.push({
        path: '/centerPage/qualificationMng'
      })
    },
    handleClose(){
      this.$emit("closeEvent")
    }
  }
}
</script>
<style lang="scss">
  .show-varify-dialog{
    .el-dialog{
      margin-top: 178px !important;
      border-radius: 10px;
    }
    .el-dialog__body{
      padding: 0 20px;
      font-size: 16px;
      .content{
        display: block;
        padding: 25px 20px 20px;
        font-size: 14px;
        color: #333;
        i{
          font-style: normal;
          color: #2F9FFE;
        }
      }
    }
    .el-dialog__footer{
      padding: 10px 20px 37px;
      text-align: center;
      .el-button{
        padding: 0;
        width: 92px;
        height: 31px;
        border-radius: 5px;
      }
      .el-button+.el-button{
        margin-left: 46px;
      }
    }
  }
</style>
