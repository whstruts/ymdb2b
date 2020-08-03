<template>
  <div class="setpwd-suc">
    <div class="w1200">
      <div class="reg-suc-tips">
        <i class="iconfont icon-chenggong"></i>
        <h2 class="tips">找回密码成功！</h2>
        <el-button type="primary" class="link-btn" @click="linkLogin">去登录</el-button>
      </div>

    </div>
  </div>
</template>
<script>
export default {
  name:'regStep1',
  data(){
    return{
      phone: ''
    }
  },
  created(){
    let phone = this.$route.query.phone;
    if(phone != "") {
      this.phone= phone;
    }
  },
  methods:{
    linkLogin(){
      this.$router.replace({
        path: '/login'
      })
    }
  }
}
</script>
<style lang="scss">
  .setpwd-suc{
    .reg-suc-tips{
      padding-top: 87px;
      text-align: center;
      .icon-chenggong{
        font-size: 38px;
        color: #4DA1FB;
        line-height: 1;
      }
      .tips{
        padding-top: 20px;
        font-size: 18px;
        color: #333;
      }
      p{
        margin: 35px auto;
        padding: 21px 32px;
        width: 769px;
        background:#F4F4F4;
        border-radius:8px;
        box-sizing: border-box;
        span{
          display: block;
        }
      }
      .link-btn{
        margin: 55px 0;
        padding: 0;
        width: 281px;
        height: 47px;
        line-height: 47px;
      }
    }
  }
</style>
