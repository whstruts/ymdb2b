<template>
  <div class="home_page">
    <div class="banner_wrap item_wrap">
      <div class="nav_bar">
            <span v-for="(item,index) in navigationBar" :key="index"
                  @click="clickColumnName(item,index)"
                  :style="{color:cloumnCurrentIndex==index?'#2F9FFE':''}">{{item.columnName}}</span>
      </div>
      <div class="banner_left">
        <div class="type_title">商品分类</div>
        <div class="type_wrap" @mouseleave="typeLeave()">
          <div v-for="(item,index) in goodsType" :key="index" v-if="index<=7"
               @mouseenter="typeEnter(index,item)" class="goods_type_content "
               :class="{goods_type_content_active:typeCurrentIndex==index}" @click="linkSearch(item)">
            <span>{{item.name}}</span>
            <i class="el-icon-arrow-right arrow-right1"></i>
          </div>
          <div class="goods_type" v-show="typeCurrentIndex!=-1">
            <div class="goods_type_row flex-row" v-for="(data,position) in goodsTypeName"
                 :key="position">
              <p class="goods_type_nav">
                <span class="goods_type_nav_wrap" style=" background: #2F9FFE;"
                      @click="linkSearch(data)">{{data.name}}</span>
                <span class="arrow-right_wrap" style="background: #1488EB;"> <i
                  class="el-icon-arrow-right arrow-right2"></i></span>
              </p>
              <p class=" flex-item goods_type_nav_name">
                <span v-for="(item,index) in data.chiledList"
                      :key="index" @click="linkSearch(item)">{{item.name}}</span>
              </p>
            </div>
          </div>
        </div>

      </div>
      <div class="banner_right">

        <div style="position: relative">
          <span class="sign_out" @click="signOut" v-if="userInfo">退出</span>
          <img src="../../assets/img/preview/login_default_icon.png" @click="linkLogin" style="cursor: pointer"/>
          <p class="welcome_msg text_overflow" @click="goMine" :title="userInfo?userInfo.companyName:'hi,欢迎来到药满多'">
            {{userInfo?userInfo.companyName:'hi,欢迎来到药满多'}}</p>
          <!--未登录的-->
          <div class="go_login button_bg" v-if="!userInfo" @click="linkLogin">登录</div>
          <div class="go_register button_bg" v-if="!userInfo" @click="linkReg">注册</div>
          <!--已登录的-->
          <div class="flex-row" v-if="userInfo">
            <p class="flex-item login_info" @click="linkOrder(1)">
              <span class="order_num">{{orderCount.waitPayCount || 0}}</span>
              <span class="order_status">待付款</span>
            </p>
            <p class="flex-item login_info" @click="linkOrder(3)">
              <span class="order_num">{{orderCount.outOfTheLibraryCount || 0 }}</span>
              <span class="order_status">待出库</span>
            </p>
            <p class="flex-item login_info" @click="linkOrder(4)">
              <span class="order_num">{{orderCount.deliveryCount || 0}}</span>
              <span class="order_status">配送中</span>
            </p>
          </div>
        </div>
        <p class="headline_wrap">
          <i class="iconfont icon-gg"></i>
          <span class="headline_title">药头条</span>
          <span class="headline_more" @click="more">更多 > </span>
        </p>
        <p class="headline_new_wrap" v-for="(item,index) in info" :key="index" v-if="index < 4"
           @click="newlist(item.id)">
          <img src="../../assets/img/preview/hot_icon.png" v-if="index == 0"/>
          <img src="../../assets/img/preview/new_icon.png" v-else/>
          <span class="headline_new_title">{{item.title}}</span>
        </p>
        <!-- <p class="headline_new_wrap">
          <img src="../../assets/img/preview/new_icon.png"/>
          <span class="headline_new_title">药品成本价格调差将入法</span>
        </p>
        <p class="headline_new_wrap">
          <img src="../../assets/img/preview/new_icon.png"/>
          <span class="headline_new_title">药品成本价格调差将入...</span>
        </p>
        <p class="headline_new_wrap">
          <img src="../../assets/img/preview/new_icon.png"/>
          <span class="headline_new_title">药品成本价格调差将入法</span>
        </p> -->
      </div>
      <el-carousel trigger="click" class="carousel_img">
        <el-carousel-item v-for="(item,index) in bannerData" :key="index">
          <img :src="item.imgUrl" v-if="item.imgUrl" style="cursor: pointer" @click="clickBanner(item,index)"/>
          <div class="banner_img" v-else>暂无图片</div>
        </el-carousel-item>
      </el-carousel>

    </div>
    <div style="clear: both"></div>
    <!--后期加-->
    <!--<spike></spike>-->
    <div v-for="(item,index) in settingDataList" :key="index">
      <preview-merchant :merchantData="item" v-if="item.identifier=='merchant'"></preview-merchant>
      <preview-commodity :commodityData="item"
                         v-if="item.identifier=='commodity'"></preview-commodity>
      <preview-ad :adData="item" v-if="item.identifier=='ad'"></preview-ad>
    </div>
    <!--后期加-->
    <!--<shop-list></shop-list>-->
    <!--<popular></popular>-->
  </div>
</template>

<script>
  import previewMerchant from "../common/preview/previewMerchant"
  import previewCommodity from "../common/preview/previewCommodity"
  import previewAd from "../common/preview/previewAd"
  import spike from "../common/preview/spike"
  import shopList from "../common/preview/shopList"
  import popular from "../common/preview/popular"
  import API from "../../api/api_homepage"
  import API_drug from "../../api/api_drug"

  export default {
    name: "preview",
    components: {popular, shopList, spike, previewCommodity, previewMerchant, previewAd},
    data() {
      return {
        info: [],
        searchInput: "",
        navigationBar: [],
        bannerData: [],
        settingDataList: [],
        goodsType: [],//商品分类集合
        userInfo: null,
        typeCurrentIndex: -1,
        goodsTypeName: [],
        cloumnCurrentIndex: 0,
        orderCount: {}
      }
    },
    created() {
      this.userInfo = JSON.parse(localStorage.getItem('b2b-access-user'));
      this.initData();
      if (this.userInfo) {
        this.getOrderCount();
      }

    },
    methods: {
      // 链接到订单页
      linkOrder(status) {
        if (status) {
          /* this.$router.push({
             path: '/centerPage/myOrder?orderStatus=' + status
           })*/
          this.$utils.openNewPage(this, "/centerPage/myOrder", {orderStatus: status})
        }
      },
      // 订单数量统计
      getOrderCount() {
        API.orderCount().then((res) => {
          if (res.code == 0) {
            this.orderCount = res.data
          }
        })
      },
      initData() {
        this.getCurTemplate();
        this.goodsTypeForB2B();
        this.datainfo();
      },
      newlist(id) {
        /* this.$router.push({
           path:'/drugnews/newsdetails?id='+id
         })*/
        this.$utils.openNewPage(this, "/drugnews/newsdetails", {id})
      },
      datainfo() {
        API_drug.newslists().then(res => {
          if (res.code == 0) {
            this.info = res.page.rows
          }
        })
      },
      getCurTemplate() {
        API.getCurTemplate().then(res => {
          if (res.code == 0) {
            if (!res.template) {
              return;
            }
            this.navigationBar = res.template.navigationBar;
            this.bannerData = res.template.bannerData;
            this.settingDataList = res.template.settingDataList;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      clickColumnName(item, index) {
        this.cloumnCurrentIndex = index;
        this.$utils.jumpPage(item, this)
      },

      //banner图的跳转
      clickBanner(item) {
        this.$utils.jumpPage(item, this)
      },
      goodsTypeForB2B() {
        API.goodsTypeForB2B().then(res => {
          if (res.code == 0) {
            this.goodsType = res.data;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      typeEnter(index, item) {
        this.goodsTypeName = item.chiledList;
        this.typeCurrentIndex = index;
      },
      typeLeave() {
        this.typeCurrentIndex = -1;
      },

      signOut() {
        this.$confirm('确认退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem("b2b-access-user");
          localStorage.removeItem("b2b-access-token");
          this.$router.push({
            path: '/login'
          })
        });
      },
      goMine() {
        this.$utils.openNewPage(this, "/centerPage/mine")
      },
      linkLogin() {
        if (this.userInfo) {
          this.$utils.openNewPage(this, "/centerPage/mine")
        } else {
          this.$router.push({
            path: '/login'
          })
        }
      },
      linkReg() {
        this.$router.push({
          path: '/regHome/regStep'
        })
      },

      more() {
        /*  this.$router.push({
            path: '/drugnews/newslist'
          })*/
        this.$utils.openNewPage(this, "/drugnews/newslist")
      },
      // 点击一级分类跳转到搜索界面
      linkSearch(item) {
        let typeCode = item.typeCode;
        this.$utils.openNewPage(this, "/search", {typeCode: typeCode})
      }
    }
  }
</script>

<style lang="scss">
  .home_page {
    background-color: #F5F5F5;
    /*height: 100%;*/
    width: 100%;
    min-width: 1280px;
    padding-bottom: 90px;
    box-sizing: border-box;

    .banner_wrap {
      margin-top: 60px !important;
      .carousel_img {
        width: 746px;
        position: absolute;
        left: 240px;
        img {
          width: 100%;
          height: 100%;
        }
        .el-carousel__container {
          height: 440px;
        }
        .banner_img {
          background: #EFEFEF;
          width: 100%;
          height: 100%;
          text-align: center;
          line-height: 442px;
          color: #999;
          font-size: 26px;
          font-weight: bold;
        }
      }

      /* .nav_wrap {
         width: 1200px;
         position: absolute;
         left: 50%;
         z-index: 100;
         transform: translateX(-50%);
         top: 0px;
         bottom: 0px;
       }*/
      .nav_bar {
        position: absolute;
        left: 250px;
        top: -36px;
        color: #333;
        font-size: 14px;
        font-weight: 600;
        right: 0px;
        span {
          margin-left: 45px;
          cursor: pointer;
        }
        span:first-child {
          margin-left: 0px;
        }
      }
      .banner_left {
        width: 232px;
        float: left;
        z-index: 100;
        position: relative;
        .type_title {
          width: 100%;
          height: 43px;
          position: absolute;
          top: -43px;
          line-height: 43px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          background: #2F9FFE;
          text-align: center;
          border-top-right-radius: 20px;
          border-top-left-radius: 20px;
        }
        .type_wrap {
          width: 100%;
          height: 440px;
          font-size: 14px;
          background: #404B5A;
          box-sizing: border-box;
          .goods_type_content {
            color: #fff;
            position: relative;
            line-height: 50px;
            height: 50px;
            padding-left: 22px;
            i {
              vertical-align: middle;
              font-size: 16px;
            }
            span {
              vertical-align: middle;
              margin-left: 10px;
              cursor: pointer;
            }
            .arrow-right1 {
              position: absolute;
              right: 22px;
              top: 50%;
              transform: translateY(-50%);
            }
          }
          .goods_type_content_active {
            background: #fff;
            span {
              color: #2F9FFE;
            }

          }
        }
        .goods_type {
          position: absolute;
          top: 0px;
          left: 232px;
          bottom: 0px;
          width: 765px;
          background: #fff;
          border-top: 1px solid rgba(236, 236, 236, 1);
          padding: 0px 32px 20px;
          overflow: hidden;
          box-sizing: border-box;
          overflow-x: hidden;
          overflow-y: auto;
          /*保证菜单超出不会出现滚动条的 火狐*/
          scrollbar-width: none;
          /*保证菜单超出不会出现滚动条的 谷歌*/
          &::-webkit-scrollbar {
            display: none;
          }
          .more_goods_type {
            font-size: 0px;
            color: #fff;
            position: absolute;
            right: 30px;
            bottom: 30px;
            cursor: pointer;
          }
          .goods_type_row {
            border-bottom: 1px solid #EDEDED;
            padding: 8px 0px 12px;
            align-items: start;
            .goods_type_nav {
              font-size: 0px;
              padding-top: 5px;
              line-height: 20px;
              height: 20px;
              color: #fff;
              cursor: pointer;
            }
          }
          .goods_type_nav_wrap {
            display: inline-block;
            font-size: 12px;
            padding: 0px 5px;
            height: 100%;
            vertical-align: top;
          }
          .arrow-right_wrap {
            display: inline-block;
            vertical-align: top;
            padding: 0px 3px;

            height: 100%;
            .arrow-right2 {
              padding-top: 3px;
              font-size: 14px;
            }
          }
          .goods_type_nav_name {
            span {
              display: inline-block;
              font-size: 12px;
              color: #666666;
              margin-left: 16px;
              line-height: 30px;
              cursor: pointer;
              &:hover {
                color: #2F9FFE;
              }
            }
          }
        }
      }
      .banner_right {
        float: right;
        margin-top: 5px;
        width: 204px;
        height: 430px;
        background: #FFFFFF;
        z-index: 100;
        padding: 32px 16px 0px;
        box-sizing: border-box;
        text-align: center;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
        .sign_out {
          position: absolute;
          right: 6px;
          top: -18px;
          color: #999999;
          font-size: 14px;
          cursor: pointer;
        }
        .welcome_msg {
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
        }
        .button_bg {
          width: 66px;
          height: 30px;
          border-radius: 15px;
          text-align: center;
          line-height: 30px;
          display: inline-block;
          margin-top: 18px;
          cursor: pointer;
        }
        .go_login {
          background-color: #2F9FFE;
          color: #fff;
        }
        .go_register {
          border: 1px solid #2F9FFE;
          box-sizing: border-box;
          color: #2F9FFE;
          margin-left: 25px;
        }
        .login_info {
          text-align: center;
          margin-top: 20px;
          cursor: pointer;
          span {
            display: block;
            line-height: 20px;
          }
          .order_num {
            font-size: 14px;
            color: #2F9FFE;
          }
          .order_status {
            font-size: 12px;
            color: #666666;
          }
        }
        .headline_wrap {
          margin: 35px 0px 19px;
          font-weight: bold;
          color: #333;
          line-height: 22px;

          i {
            font-size: 20px;
            vertical-align: middle;
          }
          .headline_title {
            vertical-align: middle;
          }
          .headline_more {
            color: #999999;
            vertical-align: middle;
            float: right;
            cursor: pointer;
          }
        }
        .headline_new_wrap {
          line-height: 14px;
          margin-bottom: 13px;
          img {
            vertical-align: middle;
          }
          .headline_new_title {
            vertical-align: middle;
            color: #666666;
            font-weight: bold;
            margin-left: 7px;
            width: 130px;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            &:hover {
              color: #2F9FFE;
            }
          }

        }
      }

    }

    .navigation_nav_common {
      width: 100%;
      line-height: 24px;
      height: 24px;
      margin-bottom: 22px;
      position: relative;
      .navigation_nav_common_title {
        color: #333;
        font-size: 24px;
        vertical-align: middle;
      }
      .navigation_nav_common_min_title {
        font-size: 14px;
        margin-left: 10px;
        color: #666666;
        display: inline-block;
        height: 19px;
        vertical-align: bottom;
      }

      .navigation_nav_common_more {
        position: absolute;
        right: 0px;
        bottom: 0px;
        line-height: 16px;
        color: #999999;
        cursor: pointer;
      }
    }
    .item_wrap {
      width: 1200px;
      margin: 44px auto 0px;
      position: relative;
    }

    .commodity_info {
      margin-top: 15px;
      box-sizing: border-box;
      width: 100%;
      .price {
        font-size: 16px;
        color: #FF2424;
      }
      .commodity_title {
        font-size: 14px;
        color: #333;
      }
      .shop_name {
        color: #999999;
        font-size: 12px;
      }
    }

    .item_box_shadow {
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    }

  }
</style>
