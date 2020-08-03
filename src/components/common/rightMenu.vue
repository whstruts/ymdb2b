<template>
  <div class="rightMenu" :class="{'showMenu': isshowMenu}">
    <div class="abs-bar">
      <a href="javascript:;" class="gwc" @click="goShoppingCart">
        <i class="iconfont icon-gouwuche"></i>
        <span>购物车</span>
        <i class="num" v-if="num > 0 && num <= 99">{{num}}</i>
        <i class="num" v-if=" num > 99">99+</i>
      </a>
      <a href="javascript:;" class="gz">
        <div class="icon"><i class="iconfont icon-guanzhu1"></i></div>
        <div class="hover-tips">关注</div>
      </a>
      <a href="javascript:;" class="kf">
        <div class="icon"><i class="iconfont icon-kefu"></i></div>
        <div class="hover-tips">客服</div>
      </a>
      <a href="javascript:;" class="wd" @click="linkUserCenter">
        <div class="icon"><i class="iconfont icon-wode"></i></div>
        <div class="hover-tips zs-tips">个人中心</div>
      </a>
      <div class="bottom-bar">
        <a href="javascript:;" class="phone">
          <i class="iconfont icon-shouji"></i>
          <div class="ewm">
            <div class="flex-wrp">
              <div class="txt flex-item">
                <p>扫一扫</p>
                <p>下载<i>药满多APP</i></p>
              </div>
              <div class="img-box">
                <img src="@/assets/img/app_ewm.png"/>
              </div>
            </div>
          </div>
        </a>
        <a href="javascript:;" class="top" @click="linkTop">
          <i class="iconfont icon-zhiding"></i>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  import {bus} from '../../bus.js'
  import API from "../../api/api_product";
  export default {
    name: 'rightMenu',
    data() {
      return {
        isshowMenu: false,
        num: 0,
      }
    },
    props:[
      'commodityCount'
    ],
    watch:{
       'commodityCount'(newVal) {
         this.num = newVal;
       }
    },
    created() {
      bus.$on("addNum", (val) => {
        if(val) {
          this.num = val;
        }
      })
    },
    mounted() {
      setTimeout(() => {
        this.isshowMenu = true;
      }, 1000)
      // this.getShopCount();
    },
    methods: {
      goShoppingCart() {
        this.$emit("goShoppingCart")
      },
      // 查看购物车商品种类
      getShopCount(){
        API.shopCount().then( (res) => {
          if(res.code == 0) {
            this.num = res.data.commodityCount;
          }
        })
      },
      // 回到顶部
      linkTop(){
        let distance = document.documentElement.scrollTop || document.body.scrollTop; //获得当前高度
        let step = distance/50; //每步的距离
        (function jump(){
          if(distance > 0){
          distance-=step;
          window.scrollTo(0,distance);
            setTimeout(jump,10)
          }
        })();
      },
      // 跳转到个人中心
      linkUserCenter(){
        this.$utils.openNewPage(this,"/centerPage/mine")
      }
    }
  }
</script>
<style lang="scss" scoped>
  .rightMenu {
    position: fixed;
    right: -36px;
    top: 0;
    width: 36px;
    height: 100%;
    background: #404C59;
    z-index: 1000;
    transition: right 0.2s ease-in-out;
    &.showMenu {
      right: 0;
    }
    .abs-bar {
      position: absolute;
      top: 200px;
      width: 100%;
      height: 100%;
      color: #fff;
      text-align: center;
      z-index: 3;
      a {
        position: relative;
        display: block;
        width: 100%;
        text-align: center;
        text-decoration: none;
        &:hover {
          .icon {
            background: #2F9FFE !important;
          }
          .hover-tips {
            left: -72px;
            &.zs-tips {
              left: -102px;
            }
          }

        }
        &.gz, &.kf, &.wd {
          margin: 10px 0;
          width: 36px;
          height: 36px;
          line-height: 36px;
          .icon {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            background: #404C59;
          }
        }
        &.gwc {
          padding: 10px 0;
          background: #54616F;
          span {
            line-height: 1.5;
          }
          &:hover {
            background: #000;
          }
        }
        .num {
          display: inline-block;
          margin: 5px auto 0;
          padding: 1px 6px;
          line-height: 1.5;
          font-size: 12px;
          font-style: normal;
          color: #fff;
          background: #FF0000;
          border-radius: 10px;
          min-width: 12px;
          text-align: center;
        }
        &.gz {
          i {
            font-size: 15px;
          }
        }
        &.kf {
          i {
            font-size: 16px;
          }
        }
        &.wd {
          i {
            font-size: 20px;
          }
        }
        span {
          display: block;
          margin: 0 auto;
          width: 20px;
          font-size: 12px;
        }
        .hover-tips {
          position: absolute;
          top: 0;
          left: 36px;
          width: 72px;
          height: 36px;
          line-height: 36px;
          color: #fff;
          text-align: center;
          transition: left 0.3s ease-in-out 0.1s;
          background: #2F9FFE;
          white-space: nowrap;
          box-sizing: border-box;
          z-index: -1;
          &.zs-tips {
            width: 102px;
            left: 36px;
          }
        }
      }
      .bottom-bar {
        position: absolute;
        bottom: 290px;
        width: 36px;
        text-align: center;
        .phone, .top {
          margin: 10px 0;
          width: 36px;
          height: 36px;
          line-height: 36px;
          background: #404C59;
          &:hover{
            background: #2F9FFE !important;
          }
        }
        .phone {
          i {
            font-size: 30px;
          }
          &:hover {
            .ewm {
              display: block;
            }
          }
        }
        .top {
          i {
            font-size: 30px;
          }
        }
        .ewm {
          display: none;
          position: absolute;
          top: -28px;
          left: -215px;
          padding: 8px;
          width: 200px;
          height: 89px;
          border: 1px solid #2F9FFE;
          background: #fff;
          box-sizing: border-box;
          z-index: -1;
          transition: left 0.2s ease-in-out;
          &:after{
            position: absolute;
            content: '';
            top: 38px;
            right: -11px;
            width:0;
            height:0;
            border-top: 7px solid transparent;
            border-bottom: 7px solid transparent;
            border-left:10px solid #2F9FFE;
          }
          &:before{
            position: absolute;
            content: '';
            top: 38px;
            right: -9px;
            width:0;
            height:0;
            border-top: 7px solid transparent;
            border-bottom: 7px solid transparent;
            border-left:10px solid #fff;
            z-index: 10;
          }
          .txt{
            font-size: 12px;
            color: #333;
            p{
              line-height: 2;
              text-align: center;
            }
            i{
              font-size: 12px;
              font-style: normal;
              color: #2F9FFE;
            }
          }
          .img-box{
            display: inline-block;
            width: 73px;
            height: 73px;
            img{
              width: 100%;
            }
          }
        }
      }
    }
  }
</style>
