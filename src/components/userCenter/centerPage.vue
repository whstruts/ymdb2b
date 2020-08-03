<template>
  <div class="center-page" :class="{'bgfff': isBgfff}">
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
          <dt>订单中心</dt>
          <dd>
            <a  href="javascript:;" :class="routeName == 'myOrder' ? 'selected' : ''" @click="linkPage('/centerPage/myOrder')">我的订单</a>
          </dd>
          <dd>
            <a href="javascript:;" :class="routeName == 'purchaseHistory' ? 'selected' : ''" @click="linkPage('/centerPage/purchaseHistory')">历史采购</a>
          </dd>
        </dl>
        <dl>
          <dt>关注中心</dt>
          <dd>
            <a href="javascript:;" @click="ToastKf">我的关注</a>
          </dd>
          <dd>
            <a href="javascript:;" @click="ToastKf">我的缺货篮 </a>
          </dd>
        </dl>
        <dl>
          <dt>个人中心</dt>
          <dd>
            <a href="javascript:;" :class="routeName == 'balance' ? 'selected' : ''"  @click="linkPage('/centerPage/balance')">我的余额</a>
          </dd>
           <dd>
            <a href="javascript:;" :class="routeName == 'invoice' ? 'selected' : ''"  @click="linkPage('/centerPage/invoice')">发票管理</a>
          </dd>
          <dd>
            <a href="javascript:;" :class="routeName == 'resetPwd' ? 'selected' : ''"  @click="linkPage('/centerPage/resetPwd')">账号管理 </a>
          </dd>
          <dd>
            <a href="javascript:;" :class="routeName == 'qualificationMng' ? 'selected' : ''" @click="linkPage('/centerPage/qualificationMng')">资质管理 </a>
          </dd>
        </dl>
      </div>
      <div class="flex-item right-content">
        <router-view></router-view>
      </div>
    </div>
    <right-menu @goShoppingCart="goShoppingCart" :commodityCount= "commodityCount"></right-menu>
    <footer-wrap></footer-wrap>
  </div>
</template>
<script>
import {bus} from "../../bus.js";
import api_user from "../../api/api_user";
import topWrap from '@/components/common/topWrap'
import rightMenu from '@/components/common/rightMenu'
import footerWrap from '@/components/common/footerWrap';

export default {
  name: 'centerPage',
  data(){
    return{
      searchInput: '',
      routeName: null,
      currentRoute: null,
      isBgfff: false, // 背景颜色是否是白色
      commodityCount: 0,
    }
  },
  components: {
    topWrap,
    rightMenu,
    footerWrap
  },
  created(){
    this.routeName = this.$route.name;
    this.currentRoute = this.$route;
    this.changeBg(this.routeName);
    this.getShopCount();
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
    // 获取购物车商品种类
    getShopCount(){
      api_user.getShopCount().then( (res) => {
        if(res.code == 0) {
          let commodityCount = res.data.validCommodityCount;
          if(commodityCount > 99) {
            commodityCount = '99+'
          }
          this.commodityCount = commodityCount
        }
      })
    },
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
    goShoppingCart() {
      let userInfo = JSON.parse(localStorage.getItem("b2b-access-user"));
      if (userInfo) {
        this.isShowLogin = false;
        this.$utils.openNewPage(this,"/shoppingCart")
      } else{
        this.isShowLogin = true;
      }
    },
    // 改变背景颜色和菜单颜色
    changeBg(name){
      // if (name == 'resetPwd') {
      //   this.isBgfff = true;
      // } else {
      //   this.isBgfff = false;
      // }
    },
    linkPage(path){
      this.$router.push({
        path: path
      })
    },
    ToastKf(){
      this.$message.warning("功能开发中")
    }
  }
}
</script>
<style lang='scss'>
  .center-page{
    min-width: 1200px;
    min-height: 100%;
    background: #F5F5F5;
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
      background: #fff;
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
      .tab-bar{
        a{
          position: relative;
          padding: 5px 20px;
          font-size: 14px;
          color: #333333;
          text-decoration: none;
          &:hover,&.selected{
            color: #2F9FFE;
          }
          &.selected{
            &:after{
              position: absolute;
              content: "";
              bottom: 0;
              left: 20px;
              right: 20px;
              height: 2px;
              background: #2F9FFE;
            }
          }
        }
      }
    }
  }
</style>
<style lang='scss'>
  .center-page{
    .el-input__inner{
      border: none;
      background:transparent;
    }
  }
</style>
