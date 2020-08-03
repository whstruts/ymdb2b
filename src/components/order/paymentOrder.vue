<template>
  <div class="payment_order">
    <div class="steps">
      <img src="@/assets/img/preview/home_logo.png" class="step_logo"/>
      <!--<img src="@/assets/img/preview/yyo_log.png" @click="linkHome()"  class="step_logo"/>-->
      <span class="steps_title">支付方式</span>
    </div>
    <p class="payment_amount">应付金额：<span class="amount_color">￥{{data.payPrice}}</span>元</p>
    <div class="payment_method_wrap">
      <p class="payment_method">
        <span class="payment_method_button " @click="selectPayMethod(1)" :class="{'wx_button':payMethod==1}">
          <img src="../../assets/img/pay/wx_icon.png" class="pay_img"/>微信支付
          <img src="../../assets/img/pay/select_wx_pay.png" class="pay_icon" v-show="payMethod==1"/></span>
        <span class="payment_method_button" @click="selectPayMethod(2)" :class="{'zfb_button':payMethod==2}"
              style="margin-left: 22px">
          <img src="../../assets/img/pay/zfb_icon.png" class="pay_img"/>支付宝支付
          <img src="../../assets/img/pay_icon.png" class="pay_icon" v-show="payMethod==2"/></span>
      </p>
      <p class="expiration_prompt" v-if="ewmOutTime > 0">距离二维码过期还剩<span>{{ewmOutTime}}</span>秒，过期后请刷新页面重新获取二维码</p>
      <p class="expiration_prompt" v-else>二维码已过期，请刷新</p>
      <div class="ewm_bg">
        <img :src="ewmbg"/>
        <div class="ewm-outtime" :class="{'rotate':isRefresh}" @click="handleRefresh()" v-if="isOutTime">
          <img src="@/assets/img/sx.png"/>
          <p>二维码已过期，点击刷新</p>
        </div>
      </div>
      <p class="pay_hint">请使用{{payMethod==1?'微信':'支付宝'}}扫一扫 扫描二维码支付</p>
      <p class="expiration_prompt payment_time" > 支付剩余时间 <span>{{pageData.hour}}:{{pageData.minute}}:{{pageData.second}}</span></p>
      <img src="../../assets/img/pay/wx_bg.png" class="pay_method_bg"  v-show="payMethod==1"/>
      <img src="../../assets/img/pay/zfb_bg.png" class="pay_method_bg"  v-show="payMethod==2"/>
    </div>
    <div class="btn-box">
      <el-button @click="cancelOrder()">取消支付</el-button>
      <el-button type="primary" @click="orderComplete()">支付完成</el-button>
    </div>
  </div>
</template>

<script>
  import API from "../../api/api_confirm_order"
  import API2 from "../../api/api_my_order"
  export default {
    name: "paymentOrder.vue",
    data() {
      return {
        payMethod: 1,
        data: {
          failMsg: '',// 失败原因 ,
          orderCode: "",//订单编号 ,
          orderId: "",// 订单id ,
          payPrice: 0,// 支付金额 ,
          payType: 0,//支付方式 ,
          status: 1,// 订单状态,

        },
        init: null,
        init2: null,
        wInit: null,
        aInit: null,
        ewmbg: null,
        isOutTime: false,  // 二维码是否过期
        isRefresh: false,  // 是否刷新
        ewmOutTime: 60 ,  // 二维码显示60s钟过期
        maxRequestTime: 60, // 最大请求时间为60s,超时取消请求
        payLeaveTime: 0,   // 支付剩余时间
        payLeaveTimeShow: 0,
        pageData: {
          day: '0',
          hour: '00',
          minute: '00',
          second: '00'
        },
      }
    },
    created(){
      this.data.orderId = this.$route.query.orderId;
      this.initData();
      this.getQrCodeByOrderInfo();
      this.checkTimeout();
    },
    destroyed(){
      clearInterval(this.int); //销毁定时器
      clearInterval(this.int2); //销毁定时器
      clearInterval(this.wInit); //销毁定时器
      clearInterval(this.aInit); //销毁定时器
      this.init = null;
      this.init2 = null;
      this.wInit = null;
      this.aInit = null;
    },
    methods: {
      linkHome(){
        this.$router.push({
          path: '/homePage'
        })
      },
      // 微信/支付宝切换事件
      selectPayMethod(statue) {
        this.payMethod = statue;
        this.closeInterval();
        this.isOutTime = false;
        this.getQrCodeByOrderInfo();
        this.checkTimeout();
      },
      // 获取订单信息
      initData() {
        API.statusInfo({orderId: this.data.orderId}).then(res => {
          if (res.code == 0) {
            this.data = res.data;
            let payEndTime = res.data.payEndTime;
            this.checkPayTimeout(payEndTime)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 获取二维码
      getQrCodeByOrderInfo(){
        let timestamp = new Date().getTime();
        this.timestamp = timestamp;
        let token = window.localStorage.getItem('b2b-access-token');
        if(this.payMethod == 1) {
          this.ewmbg = API.wxPayQrCodeByOrderInfo() +"?timestamp=" + timestamp +"&orderId=" + this.data.orderId +'&token=' +token;
          this.getWxPayOrderQuery();
        } else {
          this.ewmbg = API.aliPayQrCodeByOrderInfo() +"?timestamp=" + timestamp +"&orderId=" + this.data.orderId +'&token=' +token;
          this.getAliPayOrderQuery();
        }
      },
      // 刷新二维码
      handleRefresh(){
        this.isRefresh = true;
        this.isOutTime = false;
        this.ewmOutTime = this.maxRequestTime;
        this.getQrCodeByOrderInfo();
        this.checkTimeout();
      },
      // 销毁定时器
      closeInterval() {
        clearInterval(this.int); //销毁定时器
        clearInterval(this.wInit); //销毁定时器
        clearInterval(this.aInit); //销毁定时器
        this.ewmOutTime = this.maxRequestTime;
        this.int = null;
        this.wInit = null;
        this.aInit = null;
      },
      // 二维码过期倒计时
      checkTimeout() {
        this.int = setInterval(() => {
          this.ewmOutTime--;
          if (this.ewmOutTime <= 0) {
            this.isOutTime = true;
            window.clearInterval(this.int); //销毁定时器
            window.clearInterval(this.wInit);
            window.clearInterval(this.aInit);
            return;
          }
        }, 1000)
      },
      // 支付剩余时间倒计时
      checkPayTimeout(payLeaveTime) {
        this.int2 = setInterval(() => {
          payLeaveTime -= 1000;
          if (payLeaveTime <= 0) {
            window.clearInterval(this.int2); //销毁定时器
            this.init2 = null;
            // 支付剩余时间为0后跳转到订单列表
            this.$router.push({
              path: '/centerPage/myOrder'
            })
            return;
          }
          var days = parseInt(payLeaveTime / (1000 * 60 * 60 * 24));
          var hours = parseInt((payLeaveTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = parseInt((payLeaveTime % (1000 * 60 * 60)) / (1000 * 60)) < 10 ? '0'+ parseInt((payLeaveTime % (1000 * 60 * 60)) / (1000 * 60)) : parseInt((payLeaveTime % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = parseInt((payLeaveTime % (1000 * 60)) / 1000) < 10 ?'0'+ parseInt((payLeaveTime % (1000 * 60)) / 1000):parseInt((payLeaveTime % (1000 * 60)) / 1000);
          this.pageData.hour = hours;
          this.pageData.minute = minutes;
          this.pageData.second = seconds
        }, 1000)
      },
      // 获取微信支付单状态
      getWxPayOrderQuery(){
        this.wInit = setInterval( () => {
          API.wxPayOrderQuery({orderId: this.data.orderId}).then((res) => {
            if(res.code == 0 || res.code == 800) { // 已支付 和已取消
              window.clearInterval(this.wInit);
              this.wInit = null;
              this.$router.push({
                path: '/centerPage/myOrder'
              })
            }
          })
        },2000)
      },
      // 获取支付宝支付单状态
      getAliPayOrderQuery(){
        this.aInit = setInterval( () => {
          API.aliPayOrderQuery({orderId: this.data.orderId}).then((res) => {
            if(res.code == 0 || res.code == 800) { // 已支付 和已取消
              window.clearInterval(this.aInit);
              this.aInit = null;
              this.$router.push({
                path: '/centerPage/myOrder'
              })
            }
          })
        },2000)
      },
      // 取消订单
      cancelOrder(){
        this.$confirm('确认要取消订单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API2.cancel({orderId: this.data.orderId}).then( (res) => {
            if(res.code == 0) {
              this.$router.push({
                path: '/centerPage/myOrder'
              })
            } else {
              this.$message.error(res.msg);
            }
          })
        });
      },
      // 点击支付完成
      orderComplete(){
        this.$router.push({
          path: '/centerPage/myOrder'
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .payment_order {
    width: 1200px;
    margin: 0px auto 20px;
    padding-top: 25px;
    .payment_amount {
      text-align: right;
      font-size: 14px;
      color: #333333;
      width: 800px;
      margin: 15px auto;
      line-height: 20px;
      .amount_color {
        color: #FF3131;
        font-size: 20px;
      }
    }
    .payment_method_wrap {
      width: 800px;
      height: 477px;
      margin: auto;
      padding: 28px 0px 0px 69px;
      box-sizing: border-box;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      position: relative;
      .payment_method {
        .payment_method_button {
          display: inline-block;
          width: 141px;
          height: 46px;
          text-align: center;
          line-height: 46px;
          vertical-align: middle;
          font-size: 14px;
          border: 1px solid #EEEEEE;
          box-sizing: border-box;
          position: relative;
          cursor: pointer;
          color: #666;
          .pay_img {
            margin-right: 12px;
            vertical-align: middle;
          }
          .pay_icon {
            position: absolute;
            right: 0px;
            bottom: 0px;

          }
        }
        .wx_button {
          border-color: #09BB07;
        }
        .zfb_button {
          border-color: #29A1F7;
        }
      }
      .expiration_prompt {
        color: #333;
        font-size: 14px;
        line-height: 14px;
        margin: 25px 0px;
        span {
          color: #FF3131;
        }
      }
      .ewm_bg{
        position: relative;
        display: inline-block;
        width: 219px;
        height: 223px;
        border: 1px solid #F2F2F2;
        img{
          width: 100%;
        }
        .ewm-outtime{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, .7);
          z-index: 99;
          cursor: pointer;

          img {
            display: block;
            margin: 72px auto 10px;
            width: 35px;
            transition: all 0.3s ease-in-out;
          }
          &.rotate {
            img {
              transform: rotate(360deg);
            }
          }
          p {
            font-size: 12px;
            color: #fff;
            text-align: center;
          }
        }
      }
      .pay_hint {
        width: 230px;
        text-align: center;
        margin: 15px 0px;
        line-height: 12px;
        color: #666;
      }
      .payment_time{
        margin: 0px;
        width: 233px;
        text-align: center;
      }
      .pay_method_bg{
        position: absolute;
        top: 51px;
        right: 96px;
      }
    }
    .btn-box{
      padding-top: 40px;
      text-align: center;
      .el-button{
        padding: 16px 38px;
        border-radius: 0;
        font-weight: bold;
        font-size: 16px;
      }
      .el-button+.el-button{
        margin-left: 34px;
      }
    }
  }
</style>
