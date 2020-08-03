<template>
  <div class="login">
    <!--<div>
      <img @click="getImgEvent($event)" :src="getImg"/>
    </div>-->
    <div class="login_header">
      <img src="@/assets/img/preview/home_logo.png" style="width: 129px" @click="linkHome"/>
      <!--<img src="@/assets/img/preview/yyo_log.png" @click="linkHome" style="width: 126px;height: 47px"/>-->
      <p class="login_title">欢迎登录</p>
      <span class="hot-line">客服热线：{{kefu}}</span>
    </div>
    <div class="login_content">
      <div class="w1200" style="position:relative">
        <div class="login_setting">
          <div class="login_hint_warp flex-row">
            <span class="login_line"></span>
            <span class="login_hint">用户登录</span>
          </div>
          <div class="login_input">
            <el-input
              placeholder="登录账号/手机号"
              prefix-icon="iconfont icon-yonghu" v-model="login.loginName" @keyup.enter.native="handleLogin"
              maxlength="20"></el-input>
            <el-input
              placeholder="请输入密码"
              prefix-icon="iconfont icon-password" type="password" style="margin-top: 20px" v-model="login.password"
              @keyup.enter.native="handleLogin" maxlength="16"></el-input>

            <el-checkbox v-model="rememberPwd" style="margin-top: 20px">记住密码</el-checkbox>
            <span class="find-pwd" @click="findPwd">找回密码</span>
            <el-button type="primary" class="login_button" @click="handleLogin" :loading="loading">登录
            </el-button>
            <p class="link-reg">还没有账号? <span @click="linkReg">立即注册</span></p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import API from "../api/api_user";

  export default {
    name: 'login',
    data() {
      return {
        login: {
          loginName: "",
          password: "",
        },
        rememberPwd: false,//记住密码
        loading: false,
        getImg: "",
        token: "",
        kefu: "",
        redictUrl: null // 重定向的地址
      }
    },
    created() {
      this.getCookie();
      let redictUrl = this.$route.query.redictUrl;
      if (redictUrl) {
        this.redictUrl = redictUrl;
      }
      let token = localStorage.getItem("b2b-access-user");
      let userInfo = localStorage.getItem("b2b-access-token");
      if(token && userInfo) {
        this.$router.push({
          path: '/'
        })
      } else {
        this.queryKefu();
      }
    },
    destroyed() {
      this.$destroy()
    },
    methods: {
      // 获取热线
      queryKefu(){
        API.queryKefu().then( (res) => {
          if(res.code == 0) {
            this.kefu = res.value;
          }
        })
      },
      linkReg() {
        this.$router.push({
          path: '/regHome/regStep'
        })
      },
      findPwd() {
        this.$router.push({
          path: '/regHome/findPwd'
        })
      },
      linkHome(){
        this.$router.push({path: '/homePage'})
      },
      handleLogin() {
        if (!this.login.loginName || !this.login.password) {
          this.$message.error("请输入用户名和密码！")
          return;
        }
        // 判断记住密码否被勾选; 勾选则调用配置Cookie方法
        if (this.rememberPwd) { // 记住密码
          this.setCookie(this.login.loginName, this.login.password, 30); // 保存期限为30天
        } else {
          this.clearCookie(); // 清空 Cookie
        }
        this.loading = true;
        API.login(this.login).then((res) => {
          this.loading = false;
          if (res.code == "0") {
            localStorage.setItem("b2b-access-user", JSON.stringify(res.customer));
            localStorage.setItem("b2b-access-token", res.token);
            if (this.redictUrl) {
              let href = JSON.parse(this.redictUrl);
              this.$router.push(href)
            } else {

              this.$router.push({
                path: '/homePage'
              })
            }
          } else {
            this.$message.error(res.msg);
          }
        }).catch(() => {
          this.loading = false
        })
      },
      // 设置Cookie
      setCookie(username, password, exdays) { // 用户名, 密码, 保存天数
        let exdate = new Date(); // 获取时间
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);
        // 字符串拼接cookie
        window.document.cookie = 'userName=' + username + ';path=/;expires=' + exdate.toGMTString();
        window.document.cookie = 'userPwd=' + password + ';path=/;expires=' + exdate.toGMTString();
      },

      // 读取Cookie
      getCookie() {
        if (document.cookie.length > 0) {
          let arr = document.cookie.split('; '); // 这里显示的格式需要切割一下自己可输出看下
          for (let i = 0; i < arr.length; i++) {
            let arr2 = arr[i].split('='); // 再次切割
            // 判断查找相对应的值
            if (arr2[0] == 'userName') {
              this.login.loginName = arr2[1]; // 保存到保存数据的地方
            } else if (arr2[0] == 'userPwd') {
              this.login.password = arr2[1];
            }
          }
          if (this.login.loginName && this.login.password) {
            this.rememberPwd = true
          }
        }
      },

      // 清除Cookie
      clearCookie() {
        this.setCookie('', '', -1); // 修改2值都为空，天数为负1天就好了
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .login {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    min-width: 1200px;
    .login_header {
      height: 60px;
      line-height: 60px;
      width: 1200px;
      margin: 0 auto;
      img {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
      }
      .login_title {
        display: inline-block;
        margin-left: 68px;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
      }
      .hot-line {
        float: right;
        font-size: 14px;
        color: #333;
      }
    }
    .login_content {
      height: 607px;
      background: url("../assets/img/login_bg.png") center no-repeat;
      background-size: 100% 100%;
      position: relative;
      .login_setting {
        position: absolute;
        width: 369px;
        height: 384px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.18);
        border-radius: 10px;
        box-sizing: border-box;
        top: 110px;
        right: 0;
        padding: 0px 32px;
        .login_hint_warp {
          margin: 25px 0px;
          .login_line {
            display: inline-block;
            width: 3px;
            height: 15px;
            background: #2F9FFE;
          }
          .login_hint {
            font-size: 16px;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            margin-left: 10px;
          }
        }
        .login_input {
          .iconfont {
            color: #2F9FFE;
            &.icon-yonghu {
              font-size: 17px;
            }
            &.icon-password {
              font-size: 18px;
            }
          }
          .el-input__inner {
            height: 44px !important;
            line-height: 44px !important;
            background: #F4F4F4;
            border-radius: 8px;
            border-color: transparent;
          }
          .verification_code.el-input.is-disabled .el-input__inner {
            cursor: pointer !important;
            background-color: #fff
          }
          .code_success.el-input.is-disabled .el-input__inner {
            color: #2F9FFE;
          }
          .code_fail.el-input.is-disabled .el-input__inner {
            color: red;
          }
          .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #2F9FFE;
          }
          .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: #2F9FFE;
            border-color: #2F9FFE;
          }
          .el-checkbox__inner:hover {
            border-color: #2F9FFE;
          }
          .code_img_wrap {
            position: absolute;
            top: 60px;
            z-index: 10;
            background: #fff;
            box-shadow: 0px 5px 7px 0px rgba(0, 0, 0, 0.15);
            .icon-guanbi {
              position: absolute;
              right: 15px;
              color: #2F9FFE;
              font-size: 20px;
              top: -5px;
            }
            .refresh_img {
              float: left;
              margin-left: 5px;
              color: #2F9FFE;
              cursor: pointer;
              padding-top: 5px
            }
            .check_icon {
              position: absolute;
              font-size: 26px;
              color: #fff
            }

            .verification_button {
              float: right;
              padding: 6px 30px;
              background: #2F9FFE;
              color: #fff;
              margin: 0px 5px 5px 0px;
              cursor: pointer
            }
          }
        }
        .login_button {
          width: 100%;
          background-color: #2F9FFE;
          height: 44px;
          font-size: 20px;
          margin-top: 20px;
          padding: 9px 20px;
        }
        .find-pwd {
          float: right;
          margin-top: 20px;
          font-size: 14px;
          color: #333;
          cursor: pointer;
        }
        .link-reg {
          padding-top: 15px;
          font-size: 14px;
          color: #333;
          text-align: right;
          span {
            cursor: pointer;
            color: #2F9FFE;
          }
        }
      }
    }
  }
</style>
<style lang="scss">

</style>
