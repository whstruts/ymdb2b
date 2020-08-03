<template>
  <div class="varify-zj" v-if="varifyZjVisible">
    <div class="el-notification__closeBtn el-icon-close" @click="handleClose"></div>
    <h2 class="title"><i class="el-notification__icon el-icon-warning"></i>提示</h2>
    <div class="content">{{varifyZjMsg}}</div>
    <a href="javascript:;" class="link-btn" @click="linkRz">去认证</a>
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
    'varifyZjVisible',
    'varifyZjMsg'
  ],
  methods:{
    linkLogin(){
      this.$router.push({
        path: '/centerPage/qualificationMng'
      })
    },
    handleClose(){
      this.$emit("closeEvent")
    },
    linkRz(){
      this.$utils.openNewPage(this,"/centerPage/qualificationMng")
    }
  }
}
</script>
<style lang="scss">
  .varify-zj{
    position: fixed;
    right: 15px;
    bottom: 0;
    width:340px;
    height:218px;
    text-align: center;
    background:#fff;
    border-radius:10px;
    z-index: 1000;
    box-sizing: border-box;
    box-shadow: 0px 0px 5px rgba(0,0,0,0.3);
    .title{
      padding-top: 27px;
      font-size: 16px;
      color: #333333;
      text-align: center;
      .el-icon-warning{
        padding-right: 10px;
        color: #E6A23C;
        vertical-align: middle;
      }
    }
    .content{
      padding-top: 38px;
      font-size: 14px;
      color: #333333;
    }
    .link-btn{
      margin-top: 25px;
      padding: 1px 25px;
      font-size: 14px;
      color: #fff;
      background: #0680FD;
      border-radius: 5px;
      text-decoration: none;
    }
  }
</style>
