<template>
  <div class="helpcenter-page" :class="{'bgfff': isBgfff}">
    <top-wrap></top-wrap>
    <div class="bgfff">
      <div class="search_wrap">
        <img src="@/assets/img/preview/home_logo.png" @click="linkHome()"/>
        <!--<img src="@/assets/img/preview/yyo_log.png" @click="linkHome()"/>-->
        <span class="current-path">{{currentRoute.meta.title}}</span>
        <div class="search_bg">
          <div class="search_content flex-wrp">
            <el-input v-model="searchInput" placeholder="搜索商品" class="search_input flex-item"
                       @keyup.enter.native="linkSearch"></el-input>
            <div class="search_button" @click="linkSearch()">搜索</div>
          </div>
        </div>
      </div>
    </div>
    <div class="w1200 mt14 container flex-wrp" style="margin-bottom:20px">
      <div class="left-menu" :class="{'bgF8': isBgfff}" v-if="currentRoute.meta.search">
        <dl>
          <dt>新手指南</dt>
          <dd>
            <a  href="javascript:;"  :class="routeName == 'pcoperation' ? 'selected' : ''"  @click="linkPage('/helpcenter/pcoperation')">网站操作流程</a>
          </dd>
          <dd>
            <a href="javascript:;" :class="routeName == 'appoperation' ? 'selected' : ''"  @click="linkPage('/helpcenter/appoperation')">APP操作流程</a>
          </dd>
          <dd>
            <a href="javascript:;" :class="routeName == 'accounts' ? 'selected' : ''"  @click="linkPage('/helpcenter/accounts')">药满多对公账户</a>
          </dd>
        </dl>
        <dl>
          <dt>配送方式</dt>
          <dd>
            <a href="javascript:;" :class="routeName == 'wlinstructions' ? 'selected' : ''"  @click="linkPage('/helpcenter/wlinstructions')">物流配送说明</a>
          </dd>
          <dd>
            <a href="javascript:;" :class="routeName == 'shInstructions' ? 'selected' : ''"  @click="linkPage('/helpcenter/shInstructions')">收货说明</a>
          </dd>
        </dl>
        <dl>
          <dt>售后服务</dt>
          <dd>
            <a href="javascript:;" :class="routeName == 'explain' ? 'selected' : ''"  @click="linkPage('/helpcenter/explain')">退换货说明</a>
          </dd>
          </dl>
        <dl>
          <dt>关于我们</dt>
          <dd>
            <a href="javascript:;" :class="routeName == 'company' ? 'selected' : ''"  @click="linkPage('/helpcenter/company')">公司介绍</a>
          </dd>
           <dd>
            <a href="javascript:;" :class="routeName == 'contact' ? 'selected' : ''"  @click="linkPage('/helpcenter/contact')">联系我们</a>
          </dd>
        </dl>
      </div>
      <div class="flex-item right-content">
        <router-view></router-view>
      </div>
    </div>
    <footer-wrap></footer-wrap>
  </div>
</template>
<script>
import {bus} from "../../bus.js";
import topWrap from '@/components/common/topWrap'
import footerWrap from '@/components/common/footerWrap';

export default {
  name: 'centerPage',
  data(){
    return{
      searchInput: '',
      routeName: null,
      currentRoute: null,
      isBgfff: false, // 背景颜色是否是白色
    }
  },
  components: {
    topWrap,
    footerWrap
  },
  created(){
    this.routeName = this.$route.name;
    this.currentRoute = this.$route;
    this.changeBg(this.routeName);
    bus.$on("goto", url => {
      localStorage.removeItem("b2b-access-user");
      localStorage.removeItem("b2b-access-token");
      this.$router.push({
        path: url
      });
    });
  },
  watch:{
    '$route.name'( newVal) {
      this.routeName = newVal;
      this.changeBg(newVal);
    },
    $route(to) {
      this.currentRoute = to;
    }
  },
  methods:{
    linkHome(){
      this.$router.push({
        path: '/homePage'
      })
    },
    linkSearch() {
      if (this.searchInput == "") return;
      if (this.currentRoute.path === '/search') {
        bus.$emit("searchEvent", this.searchInput);
      } else {
        this.$router.push({
          path: '/search?value=' + this.searchInput
        })
      }
    },
    // 改变背景颜色和菜单颜色
    changeBg(name){
      if (name == 'resetPwd') {
        this.isBgfff = true;
      } else {
        this.isBgfff = false;
      }
    },
    linkPage(path){
      this.$router.push({
        path: path
      })
    }
  }
}
</script>
<style scoped lang='scss'>
  .helpcenter-page {
    min-height: 100%;
    background: #FFFFFF;
    &.bgfff{
      background: #fff;
    }
    .mt14{
      margin-top: 14px;
    }
    .search_wrap {
      margin: 0 auto;
      padding: 18px 0;
      width: 1125px;
      background: #fff;
      overflow: hidden;
      img {
        vertical-align: middle;
        height: 53px;
        cursor: pointer;
      }
      .current-path{
        padding-left: 48px;
        font-size: 18px;
        color: #333;
        font-weight: bold;
        vertical-align: bottom;
      }
      .search_bg {
        float: right;
        margin-top: 4px;
        vertical-align: middle;
        .search_content {
          width: 384px;
          height: 44px;
          border: 2px solid #2F9FFE;
          border-radius: 20px;
          box-sizing: border-box;
          .search_input {
            width: 295px;
            .el-input__inner {
              border: initial;
              border-radius: 20px;
              padding: 0px 25px;
              box-sizing: border-box;
            }
          }
          .search_button {
            float: right;
            width: 89px;
            height: 42px;
            line-height: 42px;
            border-top-right-radius: 16px;
            border-bottom-right-radius: 16px;
            background-color: #2F9FFE;
            text-align: center;
            color: #fff;
            font-size: 16px;
            box-sizing: border-box;
            cursor: pointer;
          }
        }
        .popular_search {
          margin-top: 5px;
          label {
            color: #333;
          }
          span {
            color: #999999;
            margin-right: 5px;
            cursor: pointer;
          }
          span:nth-child(2n+1) {
            color: #2F9FFE;
          }
        }
      }
    }
    .container{
      &.flex-wrp{
        align-items: flex-start;
      }
    }
    .left-menu{
      padding: 20px 20px 200px 20px;
      width: 200px;
      background:rgba(248,248,248,1);
      box-sizing: border-box;
      &.bgF8{
        background: #F8F8F8;
      }
      dl {
        padding: 15px 0;
        border-bottom: 1px solid #F5F5F5;
        &:last-child{
          border-bottom: none;
        }
        dt{
          padding-left: 37px;
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }
        dd{
          padding: 6px 0 6px 45px;
          font-size: 14px;
          color: #666666;
          a{
            text-decoration: none;
            &:hover,&.selected{
              color: #2F9FFE;
            }
          }
        }
      }
    }
    .right-content{
      margin-left: 19px;
    }
  }
</style>
<style lang='scss'>
  .helpcenter-page {
    .el-input__inner{
      border: none;
      background:transparent;
    }
  }
</style>
