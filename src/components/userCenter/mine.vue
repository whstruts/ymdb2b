<template>
  <div class="center-home">
    <div class="flex-wrp userinfo">
      <div class="info-bg">
        <div class="flex-wrp">
          <div class="avator"></div>
          <div class="info-txt flex-item">
            <p class="s-name">{{customerInfo.companyName}}</p>
            <p class="s-tel">{{customerInfo.linkName}} {{customerInfo.phone}}</p>
          </div>
        </div>
        <!-- {{customerInfo.address}} -->
        <p class="s-address">&nbsp;</p>
        <span class="s-amount">可用余额：{{customerInfo.balance || 0}}元</span>
      </div>
      <div class="flex-item order-type-box">
        <ul class="bgfff order-type">
          <li @click="linkOrder(1)">
            <i class="iconfont icon-icon-money"></i>
            <p>待付款</p>
            <span v-if="orderCount.waitPayCount > 0">{{orderCount.waitPayCount}}</span>
          </li>
          <li @click="linkOrder(3)">
            <i class="iconfont icon-shangpinchuku"></i>
            <p>待出库</p>
            <span v-if="orderCount.outOfTheLibraryCount > 0">{{orderCount.outOfTheLibraryCount }}</span>
          </li>
          <li @click="linkOrder(4)">
            <i class="iconfont icon-peisongzhong"></i>
            <p>配送中</p>
            <span v-if="orderCount.deliveryCount > 0">{{orderCount.deliveryCount }}</span>
          </li>
          <li @click="linkOrder(5)">
            <i class="iconfont icon-yiwancheng "></i>
            <p>已完成</p>
            <span v-if="orderCount.endCount > 0">{{orderCount.endCount}}</span>
          </li>
          <li @click="linkOrder(7)">
            <i class="iconfont icon-tuihuo"></i>
            <p>退货/退款</p>
            <span v-if="orderCount.backCount > 0">{{orderCount.backCount}}</span>
          </li>
          <li @click="linkOrder()">
            <i class="iconfont icon-jiantou-copy icon-all "></i>
            <p>全部订单</p>
          </li>
        </ul>
      </div>
    </div>
    <p class="new_order_hint">最新订单</p>
    <order-item :orderData="customerInfo.orderList" @countdownClose="countdownClose" ref="orderItem"></order-item>
  </div>
</template>
<script>
  import API from "../../api/api_mine";
  import orderItem from "../common/userCenter/orderItem"

  export default {
    name: 'centerHome',
    data() {
      return {
        customerInfo: {},
        orderCount: {}
      }
    },
    components: {orderItem},
    created() {
      this.getCustomerInfo();
      this.getOrderCount();
    },
    methods: {
      // 获取用户信息
      getCustomerInfo() {
        API.customerIndex().then((res) => {
          if (res.code == 0) {
            this.customerInfo = res.data;
            if (this.customerInfo.orderList.length > 0) {
              setTimeout(() => {
                this.$refs.orderItem.initData();
              }, 100)
            }
          }
        })
      },
      // 获取统计数据
      getOrderCount() {
        API.orderCount().then((res) => {
          if (res.code == 0) {
            this.orderCount = res.data
          }
        })
      },
      // 链接到订单页
      linkOrder(status) {
        console.log(status)
        if (status) {
          this.$router.push({
            path: '/centerPage/myOrder?orderStatus=' + status
          })
        } else {
          this.$router.push({
            path: '/centerPage/myOrder'
          })
        }
      },
      //待付款倒计时结束时刷新该页面
      countdownClose() {
        //每次刷新数据的时候都要把待支付的定时器给关掉
        if (this.$refs.orderItem) {
          this.$refs.orderItem.destroyInterval();
        }
        this.getCustomerInfo();
      },
    }
  }
</script>
<style scoped lang="scss">
  .center-home {
    .userinfo {
      .info-bg {
        margin-top: -5px;
        width: 345px;
        height: 244px;
        background: url(~@/assets/img/center/center_bg.png) no-repeat center;
        background-size: 100%;
        border-radius: 3px;
        .flex-wrp {
          padding: 30px 27px 0 27px;
        }
      }
      .avator {
        display: inline-block;
        width: 76px;
        height: 76px;
        background: #E8E8E8;
        border-radius: 50%;
        background: url(~@/assets/img/preview/login_default_icon.png) no-repeat;
        background-size: cover;
      }
      .info-txt {
        display: inline-block;
        padding-left: 20px;
        font-size: 14px;
        color: #666666;
        overflow: hidden;
        p {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          &.s-name {
            font-weight: bold;
            color: #333333;
          }
        }
        .s-title {
          color: #333333;
        }
      }
      .s-address {
        padding: 15px 0 0 27px;
        font-size: 14px;
        color: #666666;
      }
      .s-amount {
        display: inline-block;
        margin: 15px 0 0 27px;
        padding: 6px 25px;
        font-size: 14px;
        color: #FFE590;
        background: linear-gradient(90deg, rgba(97, 98, 107, 1) 0%, rgba(50, 51, 57, 1) 100%);
        border-radius: 20px;
      }
    }
    .order-type-box{
      box-sizing: border-box;
    }
    .order-type {
      margin-left: -3px;
      padding: 13px 0;
      text-align: center;
      li {
        position: relative;
        margin-right: 100px;
        padding: 15px 0;
        width: 96px;
        height: 88px;
        display: inline-block;
        cursor: pointer;
        text-align: center;
        box-sizing: border-box;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &:hover {
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
          .iconfont {
            color: #2F9FFE;
          }
          .icon-all {
            border: 1px solid #2F9FFE;
            background-color: #fff;
          }
        }
        .iconfont {
          line-height: 1;
          font-size: 36px;
          &.icon-yiwancheng {
            font-size: 33px;
          }
          &.icon-tuihuo {
            font-size: 44px;
          }
        }
        p {
          font-size: 14px;
          text-align: center;
          color: #333333;
        }
        span {
          position: absolute;
          right: 15px;
          top: 5px;
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
        .icon-all {
          width: 34px;
          height: 34px;
          line-height: 34px;
          font-size: 15px;
          background-color: #EEEEEE;
          border: 1px solid #EEEEEE;
          border-radius: 50%;
          text-align: center;
        }
      }
    }
    .new_order_hint {
      font-size: 14px;
      color: #333333;
      line-height: 14px;
      margin: 20px 0px 10px;
      font-weight: 600;
    }
  }
</style>
