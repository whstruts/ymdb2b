<template>
  <div class="spike item_wrap">
    <!--秒杀、限时购-->
    <div class="navigation_nav_common">
      <span class="navigation_nav_common_title">限时购</span>
      <span class="navigation_nav_common_min_title">13个商品正在抢购中...</span>
      <span class="navigation_nav_common_more">
        <span class="page-button page-button-prev">
          <img src="../../../assets/img/page/page_prev.png"/>
        </span>
        <span class="page-button page-button-next">
          <img src="../../../assets/img/page/page_next.png"/>
        </span>
      </span>
    </div>
    <div class="commodity_spike flex-row">
      <div class="spike_wrap">
        <p class="hover_hint">10:00场</p>
        <img src="../../../assets/img/preview/icon-miaosha.png" class="miaosha"/>
        <p class="countdown_hint">距离结束还有</p>
        <count-down :time="countdown"></count-down>
      </div>
      <div class="commodity_wrap" v-for="(item,index) in 4" :key="index"
           :style="{borderColor:index==0?'#FFAC12':index==1?'#83C44D':index==2?'#2296F4':index==3?'#E53935':''}">
        <div class="commodity_min_img_setting">
          <img :src="item.imgUrl" v-if="item.imgUrl" :onerror="'javascript:this.src='+$utils.defaultBgImg()"/>
          <div class="commodity_max_default" v-else>
            <i class="iconfont icon-tupian-copy-copy"></i>
          </div>
        </div>
        <div class="commodity_info">
          <p class="price">价格</p>
          <p class="commodity_title text_overflow">商品名&nbsp;&nbsp;通用名</p>
          <p class="shop_name text_overflow">0.25g*36北京同仁堂制药有限公啥啥啥啥啥啥</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CountDown from "../countdown"

  export default {
    name: "spike",
    components: {CountDown},
    data() {
      return {
        countdown: new Date('2020/10/11 20:50:00') / 1000,
      }
    },
    methods: {}
  }
</script>

<style lang="scss">
  .spike {
    .page-button {
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 28px;
      text-align: center;
    }
    .page-button-next {
      background: #E0E0E0;
    }
    .page-button-prev {
      background: #E0E0E0;
    }
    .page-button-next:hover {
      background: #BFE2FF;
    }
    .page-button-prev:hover {
      background: #BFE2FF;
    }
    .commodity_spike {
      width: 100%;
      height: 320px;
      .spike_wrap {
        width: 228px;
        display: inline-block;
        height: 100%;
        background: #F1EDED;
        border-top: 1px solid #E53935;
        padding: 51px 0px 57px 0px;
        text-align: center;
        box-sizing: border-box;
        .hover_hint {
          text-align: center;
          color: #E53934;
          font-size: 20px;
          line-height: 20px;
          font-weight: bold;
        }
        .miaosha {
          margin-top: 25px;
          margin-bottom: 30px;
        }
        .countdown_hint {
          text-align: center;
          color: #666666;
          font-size: 14px;
          line-height: 15px;
        }
      }
      .commodity_wrap {
        width: 228px;
        display: inline-block;
        height: 100%;
        margin-left: 15px;
        background: #fff;
        padding: 19px;
        border-top: 1px solid;
        box-sizing: border-box;
        text-align: center;
        .commodity_min_img_setting {
          width: 160px;
          height: 153px;
          line-height: 133px;
          margin: 0 auto;
          i {
            font-size: 35px;
          }
          img{
            width: 100%;
            height: 100%;
          }
        }

        .commodity_max_default {
          width: 100%;
          height: 100%;
          text-align: center;
          background: #EFEFEF;
          color: #CECECE;
        }
      }
    }
  }
</style>
