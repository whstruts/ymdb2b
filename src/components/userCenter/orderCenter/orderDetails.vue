<template>
  <div class="order_details">
    <div class="order_details_top flex-row">
      <div class="order_status_wrap">
        <p class="order_status" v-if="data.isAllBack!=2">
          {{data.orderStatus == 2?'待付款':data.orderStatus == 3?'已付款':data.orderStatus == 4?'开单中':
          data.orderStatus ==5?'拣货中':data.orderStatus == 6?'待配送':data.orderStatus == 7?'商品已出库':
          data.orderStatus == 8?'配送完成':data.orderStatus == 9?'已完成':data.orderStatus == 10?'已取消':
          data.orderStatus == 11?'已取消': data.orderStatus == 12?'提交失败':data.orderStatus == 13?'退货/退款':'验证中'}}

        </p>
        <p v-if="data.isAllBack==2" class="order_status">
          整单退款
        </p>
        <el-popover
          placement="top"
          width="200"
          title="电子发票"
          trigger="hover"
          v-if="(data.orderStatus == 7 || data.orderStatus == 8 || data.orderStatus == 9) && data.invoiceStatus==1">
          <div v-for="(item ,position) in data.invoiceInfoList" :key="position"
               class="order_list_invoice_item text_overflow" @click="lookInvoice(item.fileWebPath)">{{item.fileName}}
          </div>
          <p style="display: inline-block" slot="reference" class="buy_again_button">下载电子发票</p>
        </el-popover>

        <p class="down_time" v-if="data.orderStatus == 2">剩余时间
          {{pageData.hours}}:{{pageData.minute}}:{{pageData.second}}</p>
        <p><span class="go_pay_button" v-if="data.orderStatus == 2 && data.payType==1" @click="goToPay(data.orderId)">去支付</span>
        </p>
        <el-upload class="uploadfile" action="" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG"
                   :http-request='(file)=>{ return uploadTelegraphicTransferFile(file,data.orderId)}'
                   :show-file-list="false" multiple
                   v-if="data.orderStatus == 2  && data.payType==2 && data.ottStatus!=1 " style="text-align: center;">
          <!--ottStatus 0未审核，1已通过，2已驳回-->
          <span class="go_pay_button">{{(data.ottStatus==0 || data.ottStatus==2)&&data.ottId?'更新电汇凭证':'上传电汇凭证'}}</span>
        </el-upload>
        <p v-if="data.orderStatus == 2"><label @click="cancelOrder">取消订单</label></p>
        <p class="fail_msg"
           v-if="(data.orderStatus == 10 || data.orderStatus == 11 || data.orderStatus == 12)&&data.failMsg">
          {{data.failMsg }}
        </p>
        <div class="remarks flex-row" v-if="data.additionalRemarks">
          <p class="remarks_title">商家备注：</p>
          <el-tooltip placement="top">
            <div slot="content" class="tooltip_setting">
              <div v-html="data.additionalRemarks"></div>
            </div>
            <p v-html="data.additionalRemarks" class="remarks_content flex-item text_overflow"></p>
          </el-tooltip>


        </div>
        <div class="back_number_wrap" v-if="data.backPrice">
          <p class="back_status"><span style="vertical-align: middle">{{data.isAllBack==1?'部分退货':'整单退货'}}</span>
            <el-tooltip placement="top" v-if="data.backRemark">
              <div slot="content" class="tooltip_setting">
                <span>退货原因：</span>
                <div v-html="data.backRemark"></div>
              </div>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>


            <span class="back_price">退款：￥{{data.backPrice}}<label>( 已退至余额 )</label></span></p>
          <p class="back_time">退款时间：{{data.backTime}}</p>
        </div>
      </div>
      <div class="order_step_wrap">
        <img src="../../../assets/img/step/order_status.png" v-if="data.orderStatus<=6 ||data.orderStatus>=10 "/>
        <img src="../../../assets/img/step/order_status2.png" v-if="data.orderStatus==7"/>
        <img src="../../../assets/img/step/order_status3.png" v-if="data.orderStatus==8"/>
        <img src="../../../assets/img/step/order_status4.png" v-if="data.orderStatus==9"/>
        <div class="step_time_wrap" style="margin-bottom: 20px">
          <span v-for="(item,index) in  timeDataVal" :key="index"
                :style="{left:index==0?'-7px':index==1?'205px':index==2?'420px':index==3?'633px':'0px'}"
                class="step_title">
            {{item }}
          </span>
        </div>
        <div class="step_time_wrap">
          <span v-for="(item,index) in  timeData" :key="index"
                :style="{left:index==0?'-7px':index==1?'205px':index==2?'420px':index==3?'633px':'0px'}"
                class="step_time">
            {{item }}
          </span>
        </div>
      </div>
    </div>
    <div class="order_details_wrap flex-row">
      <div class="order_detail">
        <span class="title_hint">订单信息</span>
        <p class="text_overflow" :title="data.consignee">
          <span class="detail_title">收货单位：</span><span class="detail_content">{{data.consignee}}</span></p>
        <p><span class="detail_title">收货人：</span><span class="detail_content">{{data.linkName}}&nbsp;&nbsp;{{data.consigneePhone }}</span>
        </p>
        <p class="text_overflow" :title="data.consigneeAddress">
          <span class="detail_title">收货地址：</span>
          <span class="detail_content">{{data.consigneeAddress }}</span>
        </p>
        <p class="text_overflow" :title="data.remark">
          <span class="detail_title">备注：</span>
          <span class="detail_content">{{data.remark }}</span></p>
        <p><span class="detail_title">下单时间：</span>
          <span class="detail_content">{{data.orderTime }}</span></p>
        <p>
          <span class="detail_title">订单号：</span>
          <span class="detail_content">{{data.orderCode }}</span>
        </p>
        <p>
          <span class="detail_title">支付方式：</span>
          <span class="detail_content">{{data.payType==1?'在线支付':data.payType==2?'线下电汇':'-'}}
              <span v-if="data.payType==1&&data.payChannel">-&nbsp;{{data.payChannel}}</span>
          </span>
          <span v-if="data.payType==2 && data.ottStatus!=null && data.orderStatus<10">
            <el-popover
              placement="top"
              trigger="hover" v-if="data.webPath">
              <img :src="data.webPath " style="max-width: 600px"/>
              <span slot="reference" class="buy_again_button">查看电汇凭证</span>
            </el-popover>
            <el-tooltip placement="top" v-if="data.orderStatus==2 && data.ottStatus==0 &&data.ottId">
              <div slot="content" class="tooltip_setting">电汇订单需要等待管理员进行审核，敬请谅解！如要咨询审核进度，请拨打右上方的客服热线</div>
              <span class="review_statue under_review">审核中</span>
            </el-tooltip>
            <el-tooltip placement="top" v-if="data.orderStatus == 2 && data.ottStatus==2 && data.ottId">
              <div slot="content" class="tooltip_setting">{{data.failMsg }}</div>
              <span class="review_statue audit_rejection">已驳回</span>
            </el-tooltip>
          </span>
        </p>
      </div>
      <div class="logistics_info_wrap flex-item">
        <template v-if="data.orderStatus>=7 && data.orderStatus<10">
          <p class="logistics__wrap">
            <span v-for="(item,index) in data.orderCommodityPackageList"
                  @click="tabExpressCompany(index)" :class="{'logistics_num_active':index==wuLiuDataIndex }">包裹{{$utils.convertToChinaNum(index+1)}}</span>
          </p>
          <p class="logistics_company"><span>物流公司： {{wuLiuData.expressCompany}} </span> <span>运单号码： {{wuLiuData.expressNo}} </span>
          </p>
          <div class="wu_liu">
            <el-timeline>
              <el-timeline-item :timestamp="item.time" placement="top" :hide-timestamp="true"
                                v-for="(item,index) in wuLiuData.expInfo" :key="index">
                <p style="font-size: 12px;line-height: 20px;padding-right: 10px"
                   :style="{color:index==0?'#FE950D':'#666666'}">
                  {{item.time}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.context}}</p>
              </el-timeline-item>

            </el-timeline>
          </div>
        </template>
        <span class="no_data" v-if="!wuLiuData.expInfo || wuLiuData.expInfo.length<=0">暂无物流信息</span>
      </div>
    </div>
    <div class="order_commodity">
      <div class="commodity_table_wrap" v-for="(num,position) in data.orderCommodityPackageList" :key="position">
        <p class="commodity_logistics_company" v-if="data.orderStatus>=7 && data.orderStatus<10">
          <span class="logistics_num">包裹{{$utils.convertToChinaNum(position+1)}}</span>
          <span>物流公司： {{num.expressCompany}} </span>
          <span>运单号码： {{num.expressNo}} </span>
        </p>
        <el-row class="table_title">
          <el-col :span="3">
            <div class="table_title_column" style="padding-left: 20px">
              &nbsp;
            </div>
          </el-col>
          <el-col :span="6">
            <div class="table_title_column" style="padding-left: 40px">商品</div>
          </el-col>
          <el-col :span="4">
            <div class="table_title_column" style="padding-left: 25px">单价</div>
          </el-col>
          <el-col :span="2">
            <div class="table_title_column">购买数量</div>
          </el-col>
          <el-col :span="2">
            <div class="table_title_column">实发数量</div>
          </el-col>
          <el-col :span="3">
            <div class="table_title_column" style="padding-left: 0px">退款金额</div>
          </el-col>
          <el-col :span="2">
            <div class="table_title_column" style="padding-left: 5px">状态</div>
          </el-col>
          <el-col :span="2">
            <div class="table_title_column" style="padding-left: 15px">操作</div>
          </el-col>
        </el-row>
        <div class="table_rows">
          <el-row class="table_rows_content" v-for="(item,index) in num.orderCommodityDetailList" :key="index">
            <el-col :span="3">
              <div class="table_row_column" style="padding-left:20px">
                <!--<div class="img-box" :style="{backgroundImage: 'url('+ item.drugImg+')'}"></div>-->
                <div class="img-box">
                  <img :src="item.drugImg"
                       :onerror="'javascript:this.src='+$utils.defaultBgImg()"
                       class="commodity_img" @click="commodityDetails(item.commodityId)"/>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="table_row_column content" style="padding-right: 15px">
                <p class="pro-name text_overflow" :title="item.drugCommonName"
                   @click="commodityDetails(item.commodityId)">{{item.drugName?item.drugName+'&nbsp;&nbsp;':''}}{{item.drugCommonName}}</p>
                <p class="pro-company text_overflow" :title="item.manufacturer">{{item.specifications
                  }}/{{item.manufacturer }}</p>
                <p class="pro-store">{{item.supplierName}}</p>
                <p class="pro-activity" style="display: none"><span class="zk">领券87折</span><span class="mj">满减</span>
                </p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="table_row_column" style="padding-left:5px">
                <p class="commodity_price">￥{{item.commodityPrice }}/{{item.packageUnit }}</p>
                <span class="commodity_validity_period"> 效期：{{item.dateExpiration}}</span>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="table_row_column" style="padding-left:10px">
                <p class="total_price">
                  x{{item.commodityNumber}}</p>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="table_row_column" style="padding-left:10px">
                <p class="total_price">
                  x{{item.sendNumber || 0}}
                </p>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="table_row_column" style="padding-left:5px">
                <p class="total_price">
                  ￥{{item.backPrice || 0}}
                </p>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="table_row_column">
                <p class="total_price">
                  <span v-if="item.backNumber!=null && item.backNumber!=0" style="color: #FF3131">
                   {{item.commodityNumber === item.backNumber?'全部退货':'部分退货'}}
                  </span>
                  <span v-else>
                    {{item.status==0?'未发货':item.status==1?'部分发货':item.status==2?'全部发货':'未发货'}}
                  </span>

                </p>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="table_row_column">
                <p class="add_attention" style="display: none">申请售后</p>
                <p class="add_attention" @click="buyAgain(item)">加购物车</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <p class="billing_tips">
        <span class="hint_color">{{data.commodityKindNumber }}</span>种商品，共<span class="hint_color">{{data.commodityNumber }}</span>件&nbsp;&nbsp;商品总金额：<span
        class="span_price">￥{{data.commodityPrice || '0.00'}}</span>
      </p>
      <!--  <p class="billing_tips">
          优惠券：<span class="span_price">￥等待接口</span>
        </p>
        <p class="billing_tips">
          满减：<span class="span_price">￥等待接口</span>
        </p>-->
      <p class="billing_tips">
        <el-tooltip class="item" effect="dark" content="订单金额不足起配金额" placement="top-start">
          <i class="iconfont icon-wenhao"></i>
        </el-tooltip>
        运费：<span class="span_price">￥{{data.carriagePrice || '0.00'}}</span>
      </p>
      <p class="billing_tips" v-if="data.payType==1">
        余额抵扣：<span class="span_price">-￥{{data.balancePay ||  '0.00'}}</span>
      </p>
      <p class="billing_tips">
        实付金额（含运费{{data.carriagePrice || '0.00'}}元）：<span
        class="hint_color span_price">￥{{data.payPrice  || '0.00'}}</span>
      </p>

    </div>
  </div>
</template>

<script>
  import API from "../../../api/api_my_order"
  import {bus} from '../../../bus'

  export default {
    name: "orderDetails",
    data() {
      return {
        orderId: '',
        data: [],
        timeData: [],
        timeDataVal: ["提交订单", "商品出库", "等待收货", "完成"],
        interval: null,
        pageData: {
          day: '0',
          hour: '00',
          minute: '00',
          second: '00'
        },
        wuLiuData: {},
        wuLiuDataIndex: 0,
      }
    },
    created() {
      this.orderId = this.$route.query.orderId;
      this.initData();
    },
    beforeDestroy() {
      if (this.interval) {
        clearInterval(this.interval)
      }
    },
    methods: {
      //跳到商品详情
      commodityDetails(commodityId) {
        this.$utils.openNewPage(this, "/productDetail", {commodityId})
      },
      initData() {
        if (this.interval) {
          clearInterval(this.interval)
        }
        API.detail({orderId: this.orderId}).then(res => {
          if (res.code == 0) {
            this.data = res.data;
            if (res.data.orderStatus == 2) {
              this.down(res.data.payEndTime)
            }
            this.timeData = [];
            this.timeData.push(res.data.orderTime);
            if (res.data.orderStatus == 7 || res.data.orderStatus == 8 || res.data.orderStatus == 9) {
              this.timeData.push(res.data.deliveryTime)
            }
            if (res.data.orderStatus == 8 || res.data.orderStatus == 9) {
              this.timeData.push(res.data.deliveryEndTime)
            }
            if (res.data.orderStatus == 9) {
              this.timeData.push(res.data.orderEndTime)
            }
            if (this.data.orderCommodityPackageList && this.data.orderCommodityPackageList.length > 0) {
              this.wuLiuData = this.data.orderCommodityPackageList[0];
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      goToPay(orderId) {
        this.$router.push({path: '/submitOrder', query: {orderId}})
      },
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
        API.uploadTelegraphicTransferFile(formData).then(res => {
          if (res.code == 0) {
            let ottId = res.data;
            API.saveOrderOtt({orderId, ottId}).then(res => {
              if (res.code == 0) {
                this.$message.success(res.msg)
                this.initData()
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
      //切换物流信息
      tabExpressCompany(index) {
        this.wuLiuData = this.data.orderCommodityPackageList[index];
        this.wuLiuDataIndex = index;
      },
      down(endTime) {
        this.interval = setInterval(() => {
          // console.log(endTime<=0)
          endTime -= 1000
          if (endTime <= 0) {
            clearInterval(this.interval);
            this.initData();
            return
          }
          var days = parseInt(endTime / (1000 * 60 * 60 * 24));
          var hours = parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) < 10 ? '0' + parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : parseInt((endTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60)) < 10 ? '0' + parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60)) : parseInt((endTime % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = parseInt((endTime % (1000 * 60)) / 1000) < 10 ? '0' + parseInt((endTime % (1000 * 60)) / 1000) : parseInt((endTime % (1000 * 60)) / 1000);
          this.pageData.hours = hours;
          this.pageData.minute = minutes;
          this.pageData.second = seconds
        }, 1000);
      },
      //再次购买
      buyAgain(item) {
        API.againCommodity({orderId: this.data.orderId, orderCommodityId: item.orderCommodityId}).then(res => {
          if (res.code == 0) {
            this.$message.success(res.msg)
            bus.$emit("addNum", res.data.validCommodityCount);
            /*let buyAgainData = [];
            buyAgainData.push(res.data)
            this.$router.push({path: '/shoppingCart', query: {buyAgainData: JSON.stringify(buyAgainData)}})*/
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //取消订单
      cancelOrder() {
        this.$confirm('确认取消订单?', '提示', {
          type: 'warning'
        }).then(() => {
          API.cancel({orderId: this.orderId}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.initData()
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
        });
      },
    }
  }
</script>

<style scoped lang="scss">
  .order_details {
    width: 1200px;
    font-size: 12px;
    .buy_again_button {
      display: inline-block;
      border-radius: 3px;
      border: 1px solid #DFDFDF;
      cursor: pointer;
      box-sizing: border-box;
      padding: 4px 10px;
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
    .order_details_top {
      width: 100%;
      background: #fff;
      padding: 50px 0px;
      border-top: 2px solid #2F9FFE;
      box-sizing: border-box;
      align-items: start;
      .order_status_wrap {
        width: 384px;
        min-height: 100px;
        padding: 0px 40px;
        border-right: 1px solid #F5F5F5;
        box-sizing: border-box;
        text-align: center;
        p {
          text-align: center;
          color: #666;
          line-height: 18px;
          margin-top: 5px;
        }
        .go_pay_button {
          display: inline-block;
          width: 78px;
          height: 24px;
          background: #2F9FFE;
          color: #fff;
          border-radius: 3px;
          cursor: pointer;
          line-height: 24px;
        }

        .order_status {
          color: #2F9FFE;
          font-size: 18px;
          font-weight: bold;
          padding-bottom: 3px;
        }
        .down_time {
          color: #999;
        }
        label {
          cursor: pointer;
        }
        .fail_msg {
        }
        .remarks {
          align-items: start;
          p {
            text-align: left;
          }
          .remarks_title {
            color: #333;
          }
          .remarks_content {
            padding-left: 5px;
          }
        }
        .back_number_wrap {
          margin-top: 15px;
          border-top: 1px dotted #DFDFDF;
          padding-top: 5px;
          box-sizing: border-box;
          .back_status {
            color: #FF4647;
            text-align: left;

            i, label {
              color: #666666;
              margin-left: 5px;
            }
            i {
              vertical-align: middle;
            }
          }
          .back_price {
            float: right;
          }
          .icon-wenhao {
            cursor: pointer;
          }
          .back_time {
            color: #999;
            text-align: right;
          }
        }
      }

      .order_step_wrap {
        padding: 0px 52px;
        height: 100px;
        img {
          width: 687px;
        }
        .step_time_wrap {
          width: 687px;
          position: relative;
          span {
            display: inline-block;
            text-align: center;
            position: absolute;
            width: 67px;
            color: #999999;
            line-height: 16px;
          }
          .step_title {
            color: #666;
            font-size: 14px;
            font-weight: bold;
          }
          .step_time {

          }
        }
      }
    }
    .order_details_wrap {
      width: 100%;
      height: 260px;
      margin-top: 20px;
      background: #fff;
      box-sizing: border-box;
      .order_detail {
        width: 367px;
        padding: 0px 22px;
        border-right: 1px solid #F5F5F5;
        box-sizing: border-box;
        .title_hint {
          font-weight: bold;
          color: #333;
        }
        p {
          line-height: 14px;
          margin-top: 15px;
        }
        .detail_title {
          color: #999999;
          display: inline-block;
          width: 70px;
          text-align: right;
        }
        .detail_content {
          color: #333333;
        }
      }
      .logistics_info_wrap {
        padding: 0px 25px;
        height: 228px;
        position: relative;
        .logistics__wrap {
          span {
            padding: 2px 10px;
            border-radius: 2px;
            background: #F5F5F5;
            color: #666;
            margin-right: 16px;
            cursor: pointer;
          }
          .logistics_num_active {
            background: #E6F4FF;
            color: #2F9FFE;
          }
        }
        .logistics_company {
          color: #666666;
          line-height: 12px;
          margin-top: 8px;
          span {
            margin-right: 20px;
          }
        }
        .wu_liu {
          width: 100%;
          height: 180px;
          margin-top: 15px;
          overflow-y: auto;
          padding-left: 1px;
          .el-timeline-item {
            padding-bottom: 10px;
          }
        }

      }
    }

    .order_commodity {
      background: #fff;
      padding: 20px 20px 10px;
      margin-top: 20px;

      .commodity_table_wrap {
        .commodity_logistics_company {
          .logistics_num {
            font-size: 14px;
            color: #333333;
            font-weight: bold;
          }
          span {
            margin-right: 20px;
          }
          line-height: 14px;
          padding-bottom: 15px;
        }

        .table_title {
          height: 35px;
          line-height: 35px;
          background: #F3F4F3;
          color: #666666;
          font-size: 12px;
          .table_title_column {
            box-sizing: border-box;

          }
        }
        .table_rows {
          width: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          margin-bottom: 5px;
          padding-bottom: 20px;
          .table_rows_content {
            border: 1px solid #F3F4F3;
            border-top: initial;

          }
          .table_row_column {
            padding: 20px 0px;
            box-sizing: border-box;
            position: relative;
            font-size: 12px;
            .img-box {
              cursor: pointer;
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
              }
            }
            .commodity_price {
              font-size: 12px;
              color: #333;
              font-weight: 600;
            }
            .commodity_validity_period {
              border: 1px solid #F3F4F3;
              color: #999999;
              padding: 1px 5px;
              font-size: 12px;
              border-radius: 2px;
              margin-top: 5px;
            }

            .commodity_package {
              color: #999;
            }
            .package_instruction {
              color: #6AADEC;
              background: #E5F3FF;
              border-radius: 9px;
              padding: 1px 6px;
              margin-left: 6px;
            }
            .total_price {
              color: #666666;
            }
            .add_attention {
              color: #666666;
              cursor: pointer;
              padding-left: 10px;
            }
            .add_attention:hover {
              color: #2F9FFE;
            }
            .invalid {
              background: #DADADA;
              color: #666666;
              padding: 0px 3px;
              margin-right: 15px;
            }

          }
          .content {
            font-size: 12px;
            color: #999;
            line-height: 22px;
            .pro-name {
              font-size: 14px;
              font-weight: 600;
              color: #333;
              cursor: pointer;
            }
            .pro-activity {
              padding-top: 5px;
            }
            .zk, .mj {
              padding: 2px 6px;
              margin-right: 10px;
              border-radius: 2px;
            }
            .zk {
              color: #FB7F48;
              border: 1px solid #FB7F48;
            }
            .mj {
              color: #FFA60C;
              border: 1px solid #FFA60C;
            }
          }
        }
      }

      .billing_tips {
        text-align: right;
        margin-bottom: 15px;
        font-size: 14px;
        color: #666666;
        line-height: 15px;
        .hint_color {
          color: #FF3131;
        }
        .span_price {
          display: inline-block;
          min-width: 85px;
          text-align: right;
        }
      }
    }
  }
</style>
