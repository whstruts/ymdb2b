<template>
  <div class="order_item">
    <!--@click="goOrderDetails(item.orderId)"-->
    <div class="order_list_item" v-for="(item,index) in orderData" :key="index">
      <p class="order_item_title">
        <span>{{item.orderTime }}</span>
        <span>订单号：{{item.orderCode }}</span>
        <span class="return_status">
          <span v-if="item.deliveryStatus==1" style="color: #E6A23C;">部分发货</span>
          <span v-if="parseFloat(item.backPrice)>0" style="color:#FF4647;">{{item.isAllBack==1?'部分退货':item.isAllBack==2?'整单退货':''}}</span>
        </span>
      </p>
      <div class="order_item_content flex-row">
        <!--<div class="img-box" :style="{backgroundImage: 'url('+item.orderImages[0] +')'}"></div>-->
        <div class="img-box" @click.stop="goOrderDetails(item.orderId)">
          <img :src="item.orderImages[0]"
               :onerror="'javascript:this.src='+$utils.defaultBgImg()"
               class="commodity_img"/>
        </div>
        <span class="commodity_num" @click.stop="goOrderDetails(item.orderId)">{{item.commodityKindNumber }}种商品，共{{item.commodityNumber }}件</span>
        <span class="line"></span>
        <div class="amount flex-row">
          <div>
            <!--<p><span>应付金额：</span><span class="amount_color">￥{{item.totalPrice}}</span></p>-->
            <!--<p style="display: none"><span>优惠金额：</span><span class="amount_color">￥{{item.discountsPrice || '0'}}</span>-->
            <!--</p>-->
            <p><span>实付金额：</span><span class="amount_color span_color">￥{{item.payPrice }}</span>（含运费{{item.carriagePrice
              || '0.00'}}元）</p>
            <p><span :class="item.payType==1?'pay_type':'pay_type2'">
              {{item.payType==1?'在线支付':item.payType==2?'线下电汇':'-'}}
              <span v-if="item.payType==1&&item.payChannel">-&nbsp;{{item.payChannel}}</span>
            </span>
            </p>
          </div>
          <!-- <div class="promotions_wrap">
             <p>优惠券：￥{{item.discountsPrice || '0.00'}}</p>
             <p>满&nbsp;&nbsp;&nbsp;减：￥0.00</p>
           </div>-->
        </div>
        <span class="line"></span>
        <div class="item_order_status">
          <!--:style="{color:item.orderStatus == 10?'#666666':(item.orderStatus == 11 || item.orderStatus == 12)?'#FF0000':''}"-->
          <p class="pay_status_color" v-if="item.isAllBack!=2">
            {{item.orderStatus == 2?'待付款':item.orderStatus == 3?'已付款':item.orderStatus == 4?'开单中':
            item.orderStatus ==5?'拣货中':item.orderStatus == 6?'待配送':item.orderStatus == 7?'商品已出库':
            item.orderStatus == 8?'配送完成':item.orderStatus == 9?'已完成':item.orderStatus == 10?'已取消':
            item.orderStatus == 11?'已取消': item.orderStatus == 12?'提交失败':item.orderStatus == 13?'退货/退款':'验证中'}}
          </p>
          <p @click.stop="goOrderDetails(item.orderId)">
            <label class="order_hint">订单详情</label>
          </p>
          <p v-if="item.orderStatus == 7"><label style="cursor: pointer"
                                                 @click.stop="goOrderDetails(item.orderId)">查看物流</label></p>
          <p v-if="item.payType==2 && item.ottStatus!=null && item.orderStatus<10 &&item.ottId">
            <el-popover
              placement="left"
              trigger="hover">
              <img :src="item.webPath " style="max-width: 600px"/>
              <span slot="reference" style="cursor: pointer">查看电汇凭证</span>
            </el-popover>
            <el-tooltip placement="top" v-if="item.orderStatus==2 && item.ottStatus==0">
              <div slot="content" class="tooltip_setting">电汇订单需要等待管理员进行审核，敬请谅解！如要咨询审核进度，请拨打右上方的客服热线</div>
              <span class="review_statue under_review">审核中</span>
            </el-tooltip>
            <el-tooltip placement="top" v-if="item.orderStatus == 2 && item.ottStatus==2 ">
              <div slot="content" class="tooltip_setting">{{item.failMsg }}</div>
              <span class="review_statue audit_rejection">已驳回</span>
            </el-tooltip>
          </p>
        </div>
        <span class="line"></span>
        <div class="order_operating">
          <p v-if="item.orderStatus == 2"><span style="color: #999">剩余时间&nbsp;</span>
            <span class="span_color">
    {{ item.time }} </span>
          </p>
          <p v-if="item.orderStatus == 2 && item.payType==1" @click.stop="goPay(item.orderId)">
            <span class="go_pay_button">去支付</span>
          </p>
          <el-upload class="uploadfile" action="" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG"
                     :http-request='(file)=>{ return uploadTelegraphicTransferFile(file,item.orderId)}'
                     :show-file-list="false" multiple
                     v-if="item.orderStatus == 2  && item.payType==2 && item.ottStatus!=1">
            <!--ottStatus 0未审核，1已通过，2已驳回-->
            <span
              class="go_pay_button">{{(item.ottStatus==0 || item.ottStatus==2) &&item.ottId?'更新电汇凭证':'上传电汇凭证'}}</span>
          </el-upload>
          <!--  <p v-if="item.orderStatus == 2  && item.payType==2" @click.stop="goPay(item.orderId)">
              <span class="go_pay_button">上传电汇凭证</span>
            </p>-->
          <p v-if="item.orderStatus == 7 || item.orderStatus == 8"><span class="buy_again_button receipt_button"
                                                                         @click="confirmReceipt(item.orderId)">确认收货</span>
          </p>
          <p v-if="item.orderStatus == 2" @click.stop="cancelOrder(item.orderId)"><label
            class="order_hint">取消订单</label></p>
          <p v-if="item.orderStatus != 2 "><span class="buy_again_button"
                                                 @click.stop="buyAgain(item.orderId)">再次购买</span></p>
          <el-popover
            placement="top"
            width="200"
            title="电子发票"
            trigger="hover"
            v-if="(item.orderStatus == 7 || item.orderStatus == 8 || item.orderStatus == 9) && item.invoiceStatus==1">
            <div v-for="(data ,position) in item.invoiceInfoList" :key="position"
                 class="order_list_invoice_item text_overflow" @click="lookInvoice(data.fileWebPath)">{{data.fileName}}
            </div>
            <p slot="reference"><span class="buy_again_button">下载电子发票</span></p>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="no_order" v-if="orderData.length<=0">
      <img src="../../../assets/img/no_order.png"/>
      <p>暂无订单</p>
    </div>
  </div>

</template>

<script>
  import API_ORDDR from "../../../api/api_my_order"

  export default {
    name: "orderItem",
    props: {
      orderData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    /*  watch: {
        orderData: {
          handler() {
            // console.log("深度监控commodityData", newVal)
          },
          deep: true,
          immediate: true
        }
      },*/
    data() {
      return {
        intervalArr: [],
        pageData: {
          day: '0',
          hour: '00',
          minute: '00',
          second: '00'
        },
      }
    },
    methods: {
      //上传电子凭证
      uploadTelegraphicTransferFile(param, orderId) {
        let fileObject = param.file;
        /* let fileType = fileObject.type;
       let isPdf = fileType.indexOf("pdf") != -1;
        if (!isPdf) {
          this.$message.error("只能上传pdf的文件");
          return;
        }*/
        /*  let isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
            this.$message.error("只能上传pdf的文件大小小于2M");
            return;
          }*/
        let formData = new FormData();
        formData.append("file", fileObject);
        console.log(formData)
        API_ORDDR.uploadTelegraphicTransferFile(formData).then(res => {
          if (res.code == 0) {
            let ottId = res.data;
            API_ORDDR.saveOrderOtt({orderId, ottId}).then(res => {
              if (res.code == 0) {
                this.$message.success(res.msg)
                this.$emit('countdownClose');
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //查看电子发票
      lookInvoice(fileWebPath) {
        window.open(fileWebPath);
      },
      //确认收货
      confirmReceipt(orderId) {
        this.$confirm('确认收货?', '提示', {
          type: 'warning'
        }).then(() => {
          API_ORDDR.confirm({orderId}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.$emit('countdownClose');
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
        });
      },
      //取消订单
      cancelOrder(orderId) {
        this.$confirm('确认取消订单?', '提示', {
          type: 'warning'
        }).then(() => {
          API_ORDDR.cancel({orderId}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.$emit('countdownClose');
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
        });
      },
      //再次购买
      buyAgain(orderId) {
        API_ORDDR.again({orderId}).then(res => {
          if (res.code == 0) {
            let buyAgainData = res.data;
            this.$router.push({name: 'shoppingCart', params: {buyAgainData: JSON.stringify(buyAgainData)}})
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      goOrderDetails(orderId) {
        this.$utils.openNewPage(this, "/centerPage/orderDetails", {orderId})
      },
      goPay(orderId) {
        this.$router.push({path: '/submitOrder', query: {orderId}})
      },
      initData() {
        this.intervalArr = []
        let dataLength = this.orderData.length;
        for (let i = 0; i < dataLength; i++) {
          let item = this.orderData[i];
          if (item.orderImages) {
            item.orderImages = item.orderImages.split(",");
          } else {
            item.orderImages = [{}]
          }
          if (item.orderStatus == 2 && item.payEndTime > 0) { //待支付时显示支付倒计时
            let endTime = item.payEndTime;
            let interval = setInterval(() => {
              endTime -= 1000;
              if (endTime <= 0) {
                this.destroyInterval();
                this.$emit('countdownClose');
                return;
              }
              var days = parseInt(endTime / (1000 * 60 * 60 * 24));
              var hours = parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) < 10 ? '0' + parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              var minutes = parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60)) < 10 ? '0' + parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60)) : parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60));
              var seconds = parseInt((endTime % (1000 * 60)) / 1000) < 10 ? '0' + parseInt((endTime % (1000 * 60)) / 1000) : parseInt((endTime % (1000 * 60)) / 1000);
              item.time = hours + " : " + minutes + " : " + seconds;
              this.$set(this.orderData, i, item);//解决时间更新，界面视图无更新问题
            }, 1000);
            this.intervalArr.push(interval);
          }
        }
      },
      //销毁定时任务
      destroyInterval() {
        this.intervalArr.forEach(item => {
          clearInterval(item)
        })
        this.intervalArr = [];
      }
    },
    beforeDestroy() {
      this.destroyInterval();
    },

  }
</script>

<style lang="scss">
  .order_item {
    margin-bottom: 20px;
    position: relative;
    .no_order {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 110px;
      color: #666666;
      width: 143px;
      text-align: center;
      p {
        text-align: center;
        font-size: 14px;
      }
    }

    .order_list_item {
      width: 100%;
      padding-left: 12px;
      background: #fff;
      box-sizing: border-box;
      margin-bottom: 10px;
      .order_item_title {
        height: 34px;
        line-height: 34px;
        border-bottom: 1px solid #F5F5F5;
        box-sizing: border-box;
        padding-left: 5px;
        color: #999999;
        position: relative;
        span {
          margin-right: 28px;
          font-size: 12px;
        }
        .return_status {
          position: absolute;
          right: -5px;
          top: 0px;
          font-size: 14px;
        }
      }
      .order_item_content {
        padding: 15px 0px 15px 8px;
        box-sizing: border-box;

        .img-box {
          display: inline-block;
          vertical-align: middle;
          width: 80px;
          height: 80px;
          border: 1px solid #EEEEEE;
          text-align: center;
          padding-top: 5px;
          box-sizing: border-box;
          .commodity_img {
            object-fit: cover;
            width: 70px;
            height: 70px;
            background-size: cover;
            background-position: 50% 50%;
            background-repeat: no-repeat;
            cursor: pointer;
          }
        }

        .commodity_num {
          color: #333;
          font-size: 14px;
          width: 185px;
          text-align: center;
          cursor: pointer;
        }
        .line {
          display: inline-block;
          height: 109px;
          width: 1px;
          background: #F5F5F5;
        }
        .amount {
          padding: 0px 70px 0px 48px;
          color: #666666;
          p {
            font-size: 12px;
          }
          .amount_color {
            color: #333333;
            margin-left: 5px;
            display: inline-block;
          }
          .pay_type {
            color: #5AB3FF;
            background: #E6F4FF;
            padding: 1px 5px;
          }
          .pay_type2 {
            color: #88CB5C;
            background: #F0F9EB;
            padding: 1px 5px;
          }
          .promotions_wrap {
            background: #F8F8F8;
            margin-left: 18px;
            padding: 5px 11px;
            color: #999999;
            p {
              line-height: 20px;
            }
          }
        }
        .item_order_status {
          width: 174px;
          p {
            font-size: 14px;
            text-align: center;
            color: #666666;
          }
          .pay_status_color {
            color: #333;
          }
          .review_statue {
            display: inline-block;
            padding: 0px 4px;
            border-radius: 3px;
            font-size: 12px;
            margin-left: 6px;
            line-height: 18px;
            cursor: pointer;
          }
          .under_review {
            color: #E6A23C;
            background: #FDF6EC;
          }
          .audit_rejection {
            color: #FF4647;
            background: #FFEEEE;
          }
        }
        .order_hint {
          cursor: pointer;
        }
        .order_hint:hover {
          color: #2F9FFE;
        }
        .order_operating {
          width: 166px;
          p {
            text-align: center;
            color: #666666;
            font-size: 12px;
            line-height: 12px;
            margin-bottom: 10px;
          }
          .go_pay_button {
            display: inline-block;
            width: 80px;
            height: 24px;
            line-height: 24px;
            background: #2F9FFE;
            color: #fff;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
          }
          .buy_again_button {
            display: inline-block;
            width: 80px;
            height: 24px;
            line-height: 24px;
            border-radius: 3px;
            border: 1px solid #DFDFDF;
            cursor: pointer;
          }
          .buy_again_button:hover {
            border-color: #2F9FFE;
            color: #2F9FFE;
          }
          .receipt_button {
            border-color: #2F9FFE;
            color: #2F9FFE;
          }
        }
      }
      .span_color {
        color: #FF0000 !important;
      }
    }
    .uploadfile {
      text-align: center;
      margin-bottom: 10px;
    }
  }


</style>
