<template>
  <div class="top-wrap">
    <div class="top">
      <div class="top_left">
        <span v-if="isHome">欢迎来到药满多</span>
        <span class="back-home" v-else @click="linkHome">返回首页</span>
        <p class="top_text text_go">
          <span class="hint go_login text_overflow" @click="linkLogin" :title="userInfo?userInfo.companyName:'请登录'">{{userInfo?userInfo.companyName:'请登录'}}</span>
          <span class="line"></span>
          <span class="hint" @click="linkReg">{{userInfo?'退出':'注册'}}</span>
        </p>
      </div>

      <div class="top_right">
        <p class="top_text" style="margin-right: 30px">
          <template v-if="userInfo"><span class="hint" @click="linkOrder">我的订单</span><span class="line"></span></template><span class="hint" @click="helpcenter">帮助中心</span><span class="line"></span><span class="hint" @click="aboutus">关于我们</span>
        </p>
        <p class="top_text">
          <span class="hint">客服热线：{{kefu}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import API from "../../api/api_user";
import api_mine from "../../api/api_mine";
export default {
  name: 'topWrap',
  data(){
    return{
      userInfo: null,
      currentRoute: {},
      isHome:true,
      curRoute:'',
      kefu: ''
    }
  },
  watch: {
    $route(to) {
      // 如果不是在搜索页面，清除掉输入框的值
      if(to.path == '/homePage') {
        this.isHome = true;
      } else {
        this.isHome = false;
      }
    }
  },
  created(){
    let curRoute = this.$route;
    this.curRoute = curRoute;
    if(curRoute.path == '/homePage') {
      this.isHome = true;
    } else {
      this.isHome = false;
    }
    this.queryKefu();
    let userInfo = JSON.parse(localStorage.getItem("b2b-access-user"));
    if(userInfo) {
      this.getCustomerInfo();
    }

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
    // 获取用户信息
      getCustomerInfo() {
        api_mine.customerIndex().then((res) => {
          if (res.code == 0) {
            this.userInfo = res.data;
          }
        })
      },
    aboutus() {
      this.$router.push({
        path:'/helpcenter/company'
      })
    },
    helpcenter() {
      this.$router.push({
        path: '/helpcenter/pcoperation'
      })
    },
    linkLogin() {
      if (this.userInfo) {
        if(this.curRoute.path == '/centerPage/mine') {
          this.$router.push({
            path: '/centerPage/mine'
          })
        } else {
          this.$utils.openNewPage(this,"/centerPage/mine");
        }

      } else {
        this.$router.push({
          path: '/login'
        })
        // this.$utils.openNewPage(this,"/login")
      }
    },
    linkReg() {
      if (this.userInfo) {
        this.$confirm('确认退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.logout().then( (res) => {
            if(res.code == 0) {
              localStorage.removeItem("b2b-access-user");
              localStorage.removeItem("b2b-access-token");
              localStorage.removeItem("setValidityTime");
              localStorage.removeItem("setTime");
              this.$router.push({
                path: '/login'
              })
            } else {
              this.$$message.error(res.msg);
            }
          })
        });
        return;
      }
      this.$router.push({
        path: '/regHome/regStep'
      })
    },
    linkOrder(){
      if(this.curRoute.path == '/centerPage/myOrder') {
        this.$router.push({
          path:'/centerPage/myOrder'
        })
      } else {
        this.$utils.openNewPage(this,"/centerPage/myOrder")
      }

    },
    linkHome(){
      this.$router.push({
        path: '/homePage'
      })
    }
  }
}
</script>
<style lang="scss">
  .top-wrap {
      width: 100%;
      height: 36px;
      line-height: 36px;
      box-sizing: border-box;
      background-color: #F5F5F5;
      font-size: 14px;
      .top {
        width: 1130px;
        margin: auto;
        .top_left {
          float: left;
          color: #333;
          .text_go{
            display: inline-block;
            padding-left: 30px;
          }
        }
        .back-home{
          cursor: pointer;
        }
        .top_right {
          float: right;
        }
        .go_login {
          color: #2F9FFE;
          max-width: 165px;
          display: inline-block;
        }
        .top_text {
          display: inline-block;
          color: #666;
          .hint {
            vertical-align: middle;
            cursor: pointer;
          }
          .line {
            display: inline-block;
            width: 1px;
            height: 14px;
            background: #ccc;
            vertical-align: middle;
            margin: 0px 10px;
          }
        }

      }
    }
</style>
