<template>
  <!--大牌云集-->
  <div class="shop_list item_wrap">
    <div class="navigation_nav_common">
      <span class="navigation_nav_common_title"><!--{{navBar.title || '大牌云集'}}--> 大牌云集</span>
      <span class="navigation_nav_common_min_title"><!--{{navBar.subtitle || '大牌厂家优质保障'}}-->大牌厂家优质保障</span>
      <!--<span class="navigation_nav_common_more" v-show="navBar.moreButton=='0'">更多 > </span>-->
    </div>
    <div class="flex-row shop_list_wrap">
      <div class="shop_list_item shop_list_left flex-item">
        <div class="shop_left_max_img">

        </div>
        <div class="shop_min_img_wrap">
          <div class="shop_min_img" v-for="item in 8" :key="item">
            {{item}}
          </div>
        </div>
      </div>
      <div class="shop_list_item shop_list_right flex-item">
        <div class="shop_max_img_wrap flex-row">
          <div class="shop_right_max_img"></div>
          <div class="shop_min_img_wrap2 flex-item">
            <div class="shop_min_img" v-for="item in 4" :key="item">
              {{item}}
            </div>
          </div>
        </div>
        <div class="shop_min_img_wrap">
          <div class="shop_min_img" v-for="item in 8" :key="item">
            {{item}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "shopList"
  }
</script>

<style lang="scss" scoped>
  .shop_list {
    .shop_list_wrap {
      .shop_list_item {
        height: 400px;
        padding: 20px 10px;
        box-sizing: border-box;
        background: #fff;
      }
      .shop_list_left {
        margin-right: 5px;
        .shop_left_max_img {
          height: 174px;
          background: #FECDA4;
          border-radius: 8px;
        }
      }
      .shop_list_right {
        margin-left: 5px;
        .shop_max_img_wrap {
          height: 174px;
          .shop_right_max_img {
            /*display: inline-block;*/
            width: 284px;
            height: 174px;
            background: #FECDA4;
            border-radius: 8px;
            margin-right: 7px;
          }
        }
      }
      .shop_min_img {
        display: inline-block;
        width: 138px;
        height: 82px;
        line-height: 82px;
        background: #FFFFFF;
        border: 1px solid #F4F5F7;
        margin-left: 7px;
        margin-top: 10px;
        box-sizing: border-box;
        text-align: center;
      }
      .shop_min_img_wrap {
        .shop_min_img:nth-child(1), .shop_min_img:nth-child(5) {
          margin-left: 0px;
        }
      }
      .shop_min_img_wrap2 {
        .shop_min_img:nth-child(1), .shop_min_img:nth-child(3) {
          margin-left: 0px;
        }
        .shop_min_img:nth-child(1), .shop_min_img:nth-child(2) {
          margin-top: 0px;
        }
      }
    }

  }
</style>
