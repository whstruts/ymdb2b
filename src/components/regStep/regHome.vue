<template>
  <div class="reg-home">
    <div class="reg-header">
      <div class="w1200">
        <div class="fl logo-box">
          <img src="@/assets/img/preview/home_logo.png" style="width: 129px" @click="linkHome"/>
          <span>{{headerName}}</span>
        </div>
        <div class="fr opr">
          <span>已有账号？<a @click="linkLogin">直接登录> </a></span>
          <span class="hot-line">客服热线：{{kefu}}</span>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import API from "../../api/api_user";
export default {
  name:"regHome",
  data(){
    return{
      headerName: '',
      kefu: ''
    }
  },
  created(){
    let routeName = this.$route.name;
    if(routeName == "findPwd" || routeName == 'setPwd') {
      this.headerName = "找回密码"
    } else {
      this.headerName = "注册"
    }
    this.queryKefu();
  },
  methods:{
    // 获取热线
    queryKefu(){
      API.queryKefu().then( (res) => {
        if(res.code == 0) {
          this.kefu = res.value;
        }
      })
    },
    linkLogin(){
      this.$router.push({
        path: '/login'
      })
    },
    linkHome(){
      this.$router.push({
        path: '/homePage'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .reg-home{
    min-width: 1200px;
    .reg-header{
      height: 60px;
      box-shadow:0px 3px 7px 0px rgba(0, 0, 0, 0.1);
      .logo-box{
        padding-top: 11px;
        img{
          vertical-align: middle;
          cursor: pointer;
        }
        span{
          padding-left: 23px;
          font-size: 14px;
          color: #333;
        }
      }
      .opr{
        padding-top: 14px;
        font-size: 14px;
        color: #333;
        a{
          font-size: 14px;
          color: #2F9FFE;
          cursor: pointer;
        }
        .hot-line{
          padding-left: 80px;
        }
      }
    }
  }
</style>
<style lang='scss'>
  .step-box{
    padding: 50px 185px;

    .el-step{
      .el-step__line{
        top: 13px;
        height: 4px;
        border-color:#E7E7E7;
        .el-step__line-inner{
          border-width: 2px !important;
        }
      }
    }
    .is-finish{
      .el-step__icon{
        &.is-text{
          border: 3px solid #E5E5E5;
          background: #4DA1FB;
          color: #fff;
        }
      }
    }
    .el-step__icon{
      width: 30px;
      height: 30px;
      &.is-text{
        color: #E5E5E5;
        border: 3px solid #E5E5E5;
        font-weight: normal;
      }
    }
    .el-step__head{
      &.is-finish {
        color: #fff !important;
        border-color: transparent;
        .el-step__line{
          border-color: #4DA1FB;
        }
      }
    }
    .el-step__icon-inner{
      font-size: 15px;
    }
    .el-step__title{
      &.is-process{
        font-weight: normal;
        color: #999999;
      }
      &.is-finish{
        color: #438EFA;
        font-weight: 400;
      }
    }
  }
</style>
