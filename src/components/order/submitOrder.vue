<template>
  <div class="submit_order">
    <div class="steps">
      <img src="@/assets/img/preview/home_logo.png" class="step_logo"  @click="linkHome()" />
      <!--<img src="@/assets/img/preview/yyo_log.png" @click="linkHome()"  class="step_logo"/>-->
      <span class="steps_title">提交订单</span>
      <img src="@/assets/img/step/step_3.png" class="step_icon"/>
    </div>
    <div class="submit_order_content_wrap">
      <p class="submit_order_title">
        <i class="el-icon-loading" v-show="data.status==1"></i>
        <i class="iconfont icon-chenggong2" v-show="data.status==2"></i>
        <i class="iconfont icon-ic_error_normal" v-show="data.status==12 || data.status==11"></i>
        <span>{{data.status==1?'订单已提交，预计5分钟内完成验证': data.status==12?'订单提交失败':data.status==2?'订单提交成功':data.status==11?'订单取消':'-'}}</span>

      </p>
      <div class="submit_order_content">
        <p><span>订单编号：{{data.orderCode}}</span> <span class="right_hint">支付方式：{{data.payType==1?'线上支付':data.payType==2?'线下电汇':''}}</span>
        </p>
        <p style="margin-top: 22px"><span>订单金额：<span class="hint_color"> ￥{{data.payPrice}}</span> </span>
          <span class="right_hint hint_color">
            {{data.status==1?'订单验证中':data.status==2&&data.payType==1?'未支付':data.status==2&&data.payType==2?'等待上传电汇凭证':(data.status==12||data.status==11)&&data.payType==1?'订单取消':(data.status==12||data.status==11)&&data.payType==2?'未结算':'-'}}<i
            class="iconfont icon-tishi"></i></span></p>
      </div>
    </div>
    <div class="go_pay_button " @click="goPay(data.status)"
         v-if="(data.status==1 || data.status==2) && data.payType==1 "
         :class="{'verification_order':data.status==1,'verification_order_success':data.status==2}">
      去支付&nbsp;&nbsp;￥{{data.payPrice}}
    </div>
    <p class="submit_order_success_hint" v-if="data.status==2">支付剩余时间：<span class="hint_color">{{ pageData.hours}}:{{pageData.minute}}:{{pageData.second}}</span><span
      style="color: #6666">（超时订单将会被取消）</span></p>
    <div class="verification_order_fail">
      <div class="order_fail_button" v-if="data.status==12 || data.status==11 || data.payType==2">
        <span class="look_order" @click="goOrderDetails">查看订单</span>
        <span class="go_home" @click="goHome">返回首页</span>
      </div>
      <template v-if="data.status==12 || data.status==11">
        <p class="submit_order_fail_hint">订单提交失败，你可重新下单</p>
        <div class="submit_order_fail_reason">
          <p class="reason_title">失败原因</p>
          <p class="reason_content">
            {{data.failMsg}}
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import API from "../../api/api_confirm_order"

  export default {
    name: "submitOrder",
    data() {
      return {
        orderStatus: 1,//订单状态  1正在验证  2 验证成功
        msg: '',
        data: {
          failMsg: '',// 失败原因 ,
          orderCode: "",//订单编号 ,
          orderId: "",// 订单id ,
          payPrice: 0,// 支付金额 ,
          payType: 0,//支付方式 ,
          status: 1,// 订单状态
        },
        interval: null,
        pageData: {
          day: '0',
          hour: '00',
          minute: '00',
          second: '00'
        },
        timeout: null
      }
    },
    created() {
      this.data.orderId = this.$route.query.orderId;
      this.initData();
    },
    destroyed() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
    },
    methods: {
      linkHome() {
        this.$router.push({
          path: '/homePage'
        })
      },
      initData() {
        API.statusInfo({orderId: this.data.orderId}).then(res => {
          if (res.code == 0) {
            this.data = res.data;
            if (res.data.status == 1) { //如果状态为验证中  隔5秒钟再去请求一次
              this.timeout = setTimeout(() => {
                this.initData();
              }, 1000 * 5)
            }
            if (res.data.status == 2) {
              this.down(res.data.payEndTime);
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 支付剩余时间倒计时
      down(payLeaveTime) {
        this.interval = setInterval(() => {
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
          var minutes = parseInt((payLeaveTime % (1000 * 60 * 60)) / (1000 * 60)) < 10 ? '0' + parseInt((payLeaveTime % (1000 * 60 * 60)) / (1000 * 60)) : parseInt((payLeaveTime % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = parseInt((payLeaveTime % (1000 * 60)) / 1000) < 10 ? '0' + parseInt((payLeaveTime % (1000 * 60)) / 1000) : parseInt((payLeaveTime % (1000 * 60)) / 1000);
          this.pageData.hours = hours;
          this.pageData.minute = minutes;
          this.pageData.second = seconds
        }, 1000)
      },
      goPay(status) {
        if (status == 1) {
          return;
        }
        this.$router.push({path: "/paymentOrder?orderId=" + this.data.orderId})
      },
      goHome() {
        this.$router.push({path: "/homepage"})
      },
      goOrderDetails() {
        this.$router.push({path: "/centerPage/orderDetails", query: {orderId: this.data.orderId}})
      }
    },
    beforeDestroy() {
      if (this.interval) {
        clearInterval(this.interval)
      }
    },
  }
</script>

<style scoped lang="scss">
  .submit_order {
    width: 1200px;
    margin: 0px auto 80px;
    padding-top: 25px;
    .submit_order_content_wrap {
      width: 550px;
      margin: 63px auto 0px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      .submit_order_title {
        width: 100%;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background: #E6F3FD;
        span {
          color: #333;
          font-size: 16px;
          vertical-align: middle;
          margin-left: 15px;
        }
        i {
          vertical-align: middle;
        }
        .el-icon-loading {
          font-size: 22px;

        }
        .icon-chenggong2 {
          color: #38BC37;
        }
        .icon-ic_error_normal {
          color: #FF3131;
        }
      }
      .submit_order_content {
        background: #fff;
        padding: 34px 70px 38px;
        box-sizing: border-box;
        p {
          line-height: 14px;
          span {
            font-size: 14px;
            color: #666666;
          }
          .right_hint {
            float: right;
          }
          .hint_color {
            color: #FF3131;
          }
          .icon-tishi {
            margin-left: 8px;
          }
        }
      }
    }

    .go_pay_button {
      width: 240px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      color: #FFFFFF;
      margin: 33px auto 0px;
    }
    .submit_order_success_hint {
      margin: 16px auto 0px;
      width: 550px;
      text-align: center;
      font-size: 14px;
      color: #333;
      .hint_color {
        color: #FF3131;
      }
    }
    .verification_order {
      background: rgba(254, 138, 0, 0.5);
      cursor: not-allowed;
    }
    .verification_order_success {
      background: rgba(254, 138, 0, 1);
      cursor: pointer;
    }
    .verification_order_fail {
      width: 550px;
      margin: 33px auto 0px;
      .order_fail_button {
        text-align: center;
        span {
          display: inline-block;
          color: #2F9FFE;
          border: 1px solid #2F9FFE;
          padding: 0px 36px;
          line-height: 48px;
          font-size: 16px;
          box-sizing: border-box;
          cursor: pointer;
        }
        .go_home {
          margin-left: 34px;

        }
      }
      .submit_order_fail_hint {
        text-align: center;
        font-size: 14px;
        margin-top: 16px;
        line-height: 14px;
        color: #666666;
      }
      .submit_order_fail_reason {
        margin-top: 45px;
        font-size: 14px;
        line-height: 22px;
        .reason_title {
          color: #333333;
          line-height: 20px;
          font-weight: bold;
        }
        .reason_content {
          color: #999999;

        }
      }
    }
  }
</style>
