<template>
  <div class="reg-suc">
    <div class="w1200">
      <!-- <div class="step-box">
        <el-steps :active="3" align-center>
          <el-step title="设置账户信息"></el-step>
          <el-step title="上传资质"></el-step>
          <el-step title="注册成功"></el-step>
        </el-steps>
      </div> -->
      <div class="reg-suc-tips">
        <i class="iconfont icon-chenggong"></i>
        <h2 class="tips">恭喜您，账号注册成功！</h2>
        <p>
          <span class="title">温馨提示</span>
          您的账户（{{phone}}）已注册成功，您可登录账户进入平台浏览商品，暂时不可见商品价格且无采购权限，需等待管理员审核资质通过后，方可在平台上进行药品采购。
        </p>
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
  .reg-suc{
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
        margin: 32px 0;
        padding: 0;
        width: 281px;
        height: 47px;
        line-height: 47px;
      }
    }
  }
</style>
