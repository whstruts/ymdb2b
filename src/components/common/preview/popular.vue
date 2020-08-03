<template>
  <!--热卖商品、发现好物-->
  <div class="popular item_wrap">
    <div class="navigation_nav_common">
      <span class="navigation_nav_common_title">发现好物</span>
      <!--<span class="navigation_nav_common_min_title">{{navBar.subtitle || ''}}</span>-->
      <span class="navigation_nav_common_more">
        <span class="hot_label " @click="tabLabel(1)" :class="{hot_label_active:labelName==1}">热卖爆品</span>
        <span class="hot_label" @click="tabLabel(2)" :class="{hot_label_active:labelName==2}">高毛利</span>
        <span class="hot_label" @click="tabLabel(3)" :class="{hot_label_active:labelName==3}">销量保证</span>
      </span>
    </div>
    <div class="flex-row">
      <div class="popular_min_img  " v-for="(item,index) in 10" :key="index"
           :style="{marginRight:(index+1)%5==0?'0px':'10px',marginTop:index>=5?'10px':'0px'}">
        <span class="label_name">{{labelName==1?'热卖爆品':labelName==2?'高毛利':labelName==3?'销量保证':'无'}}</span>
        <div class="popular_min_img_setting">
          <img :src="item.imgUrl" v-if="item.imgUrl"/>
          <div class="popular_max_default" v-else>
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
  export default {
    name: "popular",
    data() {
      return {
        labelName: 1
      }
    },
    methods: {
      tabLabel(val) {
        this.labelName = val
      }
    }
  }
</script>

<style lang="scss" scoped>
  .popular {
    .hot_label {
      font-size: 16px;
      padding-bottom: 2px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .hot_label:nth-child(2) {
      margin: 0px 28px;
    }
    .hot_label_active {
      color: #2F9FFE;
      border-bottom: 2px solid #2F9FFE;
    }

    .popular_min_img {
      width: 232px;
      height: 324px;
      padding: 19px;
      background: #fff;
      box-sizing: border-box;
      position: relative;
      .label_name {
        position: absolute;
        color: #4587E3;
        border: 1px solid #4587E3;
        padding: 2px 4px;
        line-height: 12px;
        top: 25px;
        left: 20px;
      }
      .popular_min_img_setting {
        width: 162px;
        height: 153px;
        line-height: 133px;
        margin: 0 auto;
        i {
          font-size: 35px;
        }
        .popular_max_default {
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
