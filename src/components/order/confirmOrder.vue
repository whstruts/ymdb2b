<template>
  <div class="confirm_order" v-loading="loading">
    <div class="steps">
      <img src="@/assets/img/preview/home_logo.png" @click="linkHome()" class="step_logo"/>
      <!--<img src="@/assets/img/preview/yyo_log.png" @click="linkHome()"  class="step_logo"/>-->
      <span class="steps_title">确认订单</span>
      <img src="@/assets/img/step/step_2.png" class="step_icon"/>
    </div>
    <div class="shipping_address" style="margin-top: 40px;">
      <p class="shipping_info">收货信息</p>
      <p class="shop_address">{{data.companyName}}</p>
      <p class="shipping_name">{{data.linkName}}&nbsp;&nbsp;{{data.phone}}</p>
      <p class="shipping_name">{{data.address }}</p>
    </div>
    <div class=" shipping_pay">
      <p class="shipping_info">支付方式</p>
      <div class="pay_method " @click="selectPayMethod(item.type)" :class="{'pay_active':payType==item.type}"
           v-for="(item,index) in data.payTypeList" :key="index">
        {{item.nameStr}} <img src="../../assets/img/pay_icon.png" class="pay_icon" v-show="payType==item.type"/>
      </div>
      <!-- <div class="pay_method" @click="selectPayMethod(2)" :class="{'pay_active':payType==2}">
         线下电汇 <img src="../../assets/img/pay_icon.png" class="pay_icon" v-show="payType==2"/>
       </div>-->
    </div>
    <div class="shipping_address" v-if="payType==1">
      <p class="shipping_info">我的余额</p>
      <p class="shop_address">
        本次使用 <!-- onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"-->
        <el-input v-model="inputBalancePrice" style="width: 117px;margin: 0px 5px" size="mini"
                  onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" @change="balancePriceChange"
        ></el-input>
        元<span style="margin-left: 30px">抵扣<label class="hint_color">￥{{balancePrice ||'0.00'}}</label></span>
      </p>
      <p class="shop_address">
        账户可用余额共计为：<label style="color: #2F9FFE">{{data.balance }}</label>元<span class="shipping_name">（扣减余额后最低起配必须达到{{data.orderThresholdPrice}}，因此本次最多可使用 {{data.maxBalance}}元）</span>
      </p>
    </div>
    <div class=" shipping_pay" :style="{marginTop:payType==2?'0px':''}">
      <p class="shipping_info">发票类型</p>
      <div class="pay_method " @click="selectInvoiceType('1')" :class="{'invoice_active':invoiceType=='1'}">
        电子普通发票 <img src="../../assets/img/invoice_icon.png" class="pay_icon" v-show="invoiceType=='1'"/>
      </div>
      <div class="pay_method" @click="selectInvoiceType('2')" :class="{'invoice_active':invoiceType=='2'}">
        专用发票 <img src="../../assets/img/invoice_icon.png" class="pay_icon" v-show="invoiceType=='2'"/>
      </div>
      <!-- <div class="pay_method" @click="selectInvoiceType('')" :class="{'invoice_active':invoiceType==''}">
         不需要 <img src="../../assets/img/invoice_icon.png" class="pay_icon" v-show="invoiceType==''"/>
       </div>-->
      <span class=" edit_invoice" @click="openInvoiceDialog('1')">修改发票信息 <i
        class="iconfont icon-xinlingshouyewuicon-"></i></span>
    </div>
    <p class="shipping_info">商品明细</p>
    <el-row class="table_title">
      <el-col :span="3">
        <div class="table_title_column">&nbsp;</div>
      </el-col>
      <el-col :span="7">
        <div class="table_title_column">商品</div>
      </el-col>
      <el-col :span="6">
        <div class="table_title_column">单价</div>
      </el-col>
      <el-col :span="4">
        <div class="table_title_column" style="padding-left:10px">采购数量</div>
      </el-col>
      <el-col :span="4">
        <div class="table_title_column">金额</div>
      </el-col>
    </el-row>
    <div class="content_list">
      <el-row class="content_list_rows" v-for="(item,index) in data.list" :key="index">
        <el-col :span="3">
          <div class="list_column">
            <!--<div class="img-box" :style="{backgroundImage: 'url('+ item.drugImg +')'}"></div>-->
            <div class="img-box">
              <img :src="item.drugImg"
                   :onerror="'javascript:this.src='+$utils.defaultBgImg()"
                   class="commodity_img"/>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="list_column content">
            <p class="pro-name text_overflow" :title="item.drugCommonName">{{item.drugName?item.drugName+'&nbsp;&nbsp;':''}}{{item.drugCommonName}}</p>
            <p class="pro-company text_overflow" :title="item.manufacturer">{{item.specifications
              }}/{{item.manufacturer }}</p>
            <p class="pro-store">{{item.supplierName}}</p>
            <p class="pro-activity" style="display: none"><span class="zk">领券87折</span><span class="mj">满减</span></p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="list_column">
            <p class="commodity_price">￥{{item.price }}/{{item.packageUnit }}</p>
            <span class="commodity_validity_period"> 效期：{{item.dateExpiration }} </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="list_column">
            {{item.commodityNumber}}
          </div>
        </el-col>
        <el-col :span="4">
          <div class="list_column">
            <p class="total_price">
              ￥{{item.totalPrice}}</p>
          </div>
        </el-col>

      </el-row>
    </div>
    <div class="conifrm_order_footer">
      <div class="leave_comments flex-row">
        <span>给商户留言：</span>
        <i class="iconfont icon-beizhu" v-if="!showRemark" @click="showRemark=true"
           style="color: #666666;cursor: pointer"></i>
        <el-input type="text" size="medium" v-model="remark" maxlength="200" show-word-limit
                  v-if="showRemark"></el-input>
      </div>
      <p class="billing_tips">
        已选择<span class="hint_color">{{data.commodityKindNumber }}</span>种商品，
        共<span class="hint_color">{{data.commodityNumber }}</span>件&nbsp;&nbsp;商品总金额：<span class="span_price">￥{{data.commodityPrice}}</span>
      </p>
      <p class="billing_tips">
        <el-tooltip class="item" effect="dark" content="订单金额不足起配金额" placement="top-start">
          <i class="iconfont icon-wenhao"></i>
        </el-tooltip>
        运费：<span class="span_price">￥{{data.carriagePrice || '0.00'}}</span>
      </p>
      <p class="billing_tips" v-if="payType==1">
        余额抵扣：<span class="span_price">-￥{{balancePrice || '0.00'}}</span>
      </p>
      <p class="billing_tips">
        应付合计（含运费{{data.carriagePrice || '0.00'}}元）：<span class="hint_color span_price">￥{{(data.payPrice - balancePrice).toFixed(2)}}</span>
      </p>
      <p class="cnfirm_order_submit_wrap">
        <i class="iconfont icon-fanhui"></i><span class="back_cart" @click="backCart">返回购物车</span> <span
        class="confirm_order_bottom" @click="submitOrderData">提交订单</span>
      </p>
    </div>
    <div class="conifrm_order_footer2" v-show="slide">
      <div class="footer_content_wrap">
        <p style="display: inline-block;float: left"><i class="iconfont icon-fanhui"></i><span
          class="back_cart" @click="backCart">返回购物车</span>
        <p class="billing_tips">
          已选择<span class="hint_color">{{data.commodityKindNumber }}</span>种商品，
          共<span class="hint_color">{{data.commodityNumber }}</span>件
        </p>
        <p class="billing_tips">
          商品总金额：<span>￥{{data.commodityPrice}}</span>
        </p>
        <p class="billing_tips">
          <el-tooltip class="item" effect="dark" content="订单金额不足起配金额" placement="top">
            <i class="iconfont icon-wenhao"></i>
          </el-tooltip>
          运费：<span>￥{{data.carriagePrice || '0.00'}}</span>
        </p>
        <p class="billing_tips" v-if="payType==1">
          余额抵扣：<span>￥{{balancePrice || '0.00'}}</span>
        </p>
        <p class="billing_tips ">
          应付合计（含运费{{data.carriagePrice || '0.00'}}元）：<span class="hint_color" style="font-weight: bold">￥{{(data.payPrice - balancePrice).toFixed(2)}}</span>
        </p>
        <span class="confirm_order_bottom" @click="submitOrderData">提交订单</span>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="800px"
      class="b2b-dialog"
      :before-close="handleClose">
      <div>
        <div class="pay_method " @click="selectEditInvoiceType('1')" :class="{'invoice_active':invoiceEditType=='1'}"
             style="margin-top: 0px">
          电子普通发票 <img src="../../assets/img/invoice_icon.png" class="pay_icon" v-show="invoiceEditType=='1'"/>
        </div>
        <div class="pay_method" @click="selectEditInvoiceType('2')" :class="{'invoice_active':invoiceEditType=='2'}"
             style="margin-top: 0px">
          专用发票 <img src="../../assets/img/invoice_icon.png" class="pay_icon" v-show="invoiceEditType=='2'"/>
        </div>
      </div>

      <div v-if="invoiceEditType=='1'">
        <el-form v-model="form" ref="ruleForm" :rules="rules" label-width="110px">
          <el-form-item class="form-item-type">
            <div class="dzfp-desc">电子发票，功效等同于普通纸质发票。增值税电子普通发票的开票方和受票方需要纸质发票的，可以自行打印增值税电子普通发票的版式文件，
              其法律效力、 基本用途、基本使用规定等与税务机关监制的增值税普通发票相同。
            </div>
          </el-form-item>
          <el-form-item label="单位名称">
            <span style="color: #333;"> {{form.company}}</span>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input type="textarea" :rows="2" v-model="form.address" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号" prop="">
            <el-input v-model="form.dutyNumber" maxlength="30"></el-input>
            <div class="duty_number" style="display: none">
              <el-checkbox v-model="noDutyNumber">没有税号（如果你经营的单位无税号，但又需要发票，请选择此项）</el-checkbox>
            </div>
          </el-form-item>
          <el-form-item label="开户银行" prop="depositBank">
            <el-input v-model="form.depositBank" maxlength="30"></el-input>
            <span class="tips">xx银行xxx支行</span>
          </el-form-item>
          <el-form-item label="银行账户" prop="bankAccount">
            <el-input v-model="form.bankAccount" maxlength="25"></el-input>
            <span class="tips">开户许可证或法人的私人账户</span>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="invoiceEditType=='2'" style="margin-top: 20px">
        <el-form v-model="form2" ref="ruleForm2" :rules="rules2" label-width="115px">
          <el-form-item label="公司名称">
            <span style="color: #333;">{{form2.company}}</span>
          </el-form-item>
          <el-form-item class="is-required" label="上传开票信息" prop="invoiceInfo">
            <div class="file-box">
              <input type="file" class="upload-input" id="choose" accept="image/*" @change='onUpload($event)'
                     v-if="img== null || img== ''">
              <div class="img-box-padding" v-else>
                <div class="img-box2" :style="{backgroundImage: 'url('+img +')'}"></div>
                <div class="black-mask"><span class="iconfont icon-shanchu" @click="delImg()"></span>
                </div>
              </div>
            </div>
            <span class="tips">专用发票需要上传开票信息图片，或者填写开票必须信息</span>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input type="textarea" :rows="2" v-model="form2.address" maxlength="100"></el-input>
            <span class="tips" style="vertical-align: top">专票要求的公司地址</span>
          </el-form-item>
          <el-form-item label="纳税人识别号" prop="dutyNumber">
            <el-input v-model="form2.dutyNumber" maxlength="30"></el-input>
            <span class="tips">营业执照上的【统一社会信用代码】</span>
          </el-form-item>
          <el-form-item label="电话" prop="contactWay">
            <el-input v-model="form2.contactWay" maxlength="20"></el-input>
            <span class="tips">专票要求的公司电话</span>
          </el-form-item>
          <el-form-item label="开户银行" prop="depositBank">
            <el-input v-model="form2.depositBank" maxlength="30"></el-input>
            <span class="tips">xx银行xxx支行</span>
          </el-form-item>
          <el-form-item label="银行账户" prop="bankAccount">
            <el-input v-model="form2.bankAccount" maxlength="25"></el-input>
            <span class="tips">开户许可证或法人的私人账户</span>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
    <!--<el-button @click="handleClose">取 消</el-button>-->
    <el-button type="primary" @click="invoiceDataSubmit">修改</el-button>
  </span>
    </el-dialog>


  </div>
</template>

<script>
  import API from "../../api/api_confirm_order"
  import lrz from 'lrz' // 图片压缩
  export default {
    name: "confirmOrder",
    data() {
      return {
        payType: 0, //支付方式
        data: [],
        remark: "",
        slide: false,//是否是滑动
        invoiceType: '',//发票类型
        inputBalancePrice: "",//输入的余额抵扣价
        balancePrice: "",//使用的余额抵扣价
        dialogVisible: false,
        invoiceEditType: '1',//选择修改发票的类型
        noDutyNumber: false, // 是否含有纳税人识别号
        form: {
          company: "",
          dutyNumber: "",
          address: "",
          depositBank: "",
        },
        form2: {
          company: "",
          dutyNumber: "",
          contactWay: '',
          address: "",
          depositBank: "",
          invoiceInfo: "",
          fileRedisId: ""
        },
        img: "",
        rules: {},
        rules2: {},
        showRemark: false,//是否显示留言输入框
        loading: false
      }
    },
    created() {
      this.data = JSON.parse(this.$route.query.data);
      if (this.data.payTypeList.length > 0) {
        this.payType = this.data.payTypeList[0].type;
        this.invoiceType = this.data.invoiceType || '';
      }
    },
    methods: {
      balancePriceChange() {
        this.inputBalancePrice = this.inputBalancePrice.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');
        this.balancePrice = this.inputBalancePrice ? parseFloat(this.inputBalancePrice).toFixed(2) : '';
        if (parseFloat(this.balancePrice) > parseFloat(this.data.maxBalance)) {
          this.$message.error('本次最多可使用' + this.data.maxBalance + '元');
          this.balancePrice = this.data.maxBalance;
          this.inputBalancePrice = this.data.maxBalance;
          return;
        }
      },
      submitOrderData() {
        if (!this.invoiceType) {
          this.$message.error("请选择发票类型");
          return;
        }
        let param = {
          payType: this.payType,
          remark: this.remark,
          orderCacheId: this.data.orderCacheId,
          balancePrice: this.balancePrice,
          ciId: this.invoiceType == '1' ? this.data.invoice1.ciId : this.invoiceType == '2' ? this.data.invoice2.ciId : "",
        };
        this.loading = true;
        API.create(param).then(res => {
          this.loading = false;
          if (res.code == 0) {
            this.$router.push({path: '/submitOrder', query: {orderId: res.data}})
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //选择的发票类型
      selectInvoiceType(type) {
        if (type == 1 && !this.data.invoice1) {
          // this.$message.error("请在发票管理中添加电子普通发票");
          this.openInvoiceDialog(type)
          return;
        } else if (type == 2 && !this.data.invoice2) {
          // this.$message.error("请在发票管理中添加专用发票");
          this.openInvoiceDialog(type)
          return;
        }
        this.invoiceType = type;
      },
      //选择支付类型
      selectPayMethod(statue) {
        this.payType = statue;
        if (this.payType == 2) {
          this.balancePrice = "";
        }
      },
      //返回购物车
      backCart() {
        this.$router.back();
      },
      linkHome() {
        this.$router.push({
          path: '/homePage'
        })
      },

      //新增/修改发票数据
      invoiceDataSubmit() {
        let params = {};
        if (this.invoiceEditType == '1') {
          if (this.form.address == "" || this.form.address == null) {
            this.$message.error("请输入地址");
            return;
          }
          /* if (this.noDutyNumber == false && this.form.dutyNumber == "") {
             this.$message.error("请输入纳税人识别号，如果没有，请勾选没有税号");
             return;
           }*/
          if (this.form.dutyNumber == "") {
            this.$message.error("请输入纳税人识别号");
            return;
          }
          if (this.form.depositBank == "" || this.form.depositBank == null) {
            this.$message.error("请输入开户银行");
            return;
          }
          if (this.form.bankAccount == "" || this.form.bankAccount == null) {
            this.$message.error("请输入银行账户");
            return;
          }
          params = this.form;
          params.invoiceType = this.invoiceEditType;
        } else if (this.invoiceEditType == '2') {
          if (this.form2.invoiceInfo == "" || this.form2.invoiceInfo == null) {
            this.$message.error("请上传开票信息");
            return;
          }
          /*  if (this.form2.address == "" || this.form2.address == null) {
              this.$message.error("请输入地址");
              return;
            }
            if (this.form2.dutyNumber == "" || this.form2.dutyNumber == null) {
              this.$message.error("请输入纳税人识别号");
              return;
            }
            if (this.form2.contactWay == "" || this.form2.contactWay == null) {
              this.$message.error("请输入电话");
              return;
            }
            let regPhone = /(^1[23456789]\d{9}$)|(^(0\d{2})-(\d{8})$)|(^(0\d{3})-(\d{7})$)/;
            if (!regPhone.test(this.form2.contactWay)) {
              this.$message.error("电话格式不正确");
              return;
            }
            if (this.form2.depositBank == "" || this.form2.depositBank == null) {
              this.$message.error("请输入开户银行");
              return;
            }
            if (this.form2.bankAccount == "" || this.form2.bankAccount == null) {
              this.$message.error("请输入银行账户");
              return;
            }*/
          params = this.form2;
          params.invoiceType = this.invoiceEditType;
        }
        API.updateInvoiceInfo(params).then((res) => {
          if (res.code == 0) {
            if (this.invoiceEditType == '1') {
              this.data.invoice1 = res.data[0];
            } else if (this.invoiceEditType == '2') {
              this.data.invoice2 = res.data[0];
            }
            this.handleClose();
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      /**
       * 将以base64的图片url数据转换为Blob
       * @param urlData
       *  url方式表示的base64图片数据
       */
      convertBase64UrlToBlob(urlData) {
        var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
      },
      // 上传图片
      onUpload(e) {
        let formdata = new window.FormData()
        let photoFile = e.target.files[0];
        e.target.value = '';
        if (!photoFile) {
          return;
        }
        lrz(photoFile, {width: 450, fieldName: 'file'}).then(rst => {
          let data = rst.base64;
          let blob = this.convertBase64UrlToBlob(data);
          formdata.append("file", blob, 'image.jpg');
          this.uploadFn(formdata, rst.base64)
        });
      },
      uploadFn(formdata, base64) {
        API.uploadToRedis(formdata).then(res => {
          if (res.code == 0) {
            let obj = {}
            obj.fileId = res.data;
            obj.img = base64;
            obj.imgType = 'jpg';
            this.img = obj.img;
            this.form2.invoiceInfo = res.data;
            this.form2.fileRedisId = res.data;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 删除图片
      delImg() {
        this.img = "";
        this.form2.invoiceInfo = "";
      },
      selectEditInvoiceType(type) {
        this.invoiceEditType = type;
      },
      //打开修改发票dialog
      openInvoiceDialog(type) {
        this.dialogVisible = true;
        this.invoiceEditType = type;
        this.getInVoiceInfo();
      },
      //关闭修改发票状态
      handleClose() {
        this.dialogVisible = false;
        this.form = {};
        this.form2 = {};
        this.invoiceEditType = '1';
      },
      // 获取发票信息
      getInVoiceInfo() {
        API.getInvoiceInfo().then((res) => {
          if (res.code == 0) {
            let ordinaryInvoice = res.data.ordinaryInvoice;
            if (ordinaryInvoice) {
              this.form = ordinaryInvoice;
            }
            let specialInvoice = res.data.specialInvoice;
            if (specialInvoice) {
              if (specialInvoice.invoiceInfo != "" && specialInvoice.invoiceInfo != null) {
                this.img = specialInvoice.invoiceInfo
              }
              this.form2 = specialInvoice;
            }

          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleScroll() {
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        //变量windowHeight是可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        // console.log("距顶部" + scrollTop + "可视区高度" + windowHeight + "滚动条总高度" + scrollHeight);
        // //滚动条到底部的条件  (scrollHeight - 70)减去底部
        if (scrollTop + windowHeight >= (scrollHeight - 611)) {
          //写后台加载数据的函数
          this.$nextTick(() => {
            this.slide = false
          })
        } else {
          this.slide = true;
        }
      },
    },
    mounted() {
      /* 2019/12/12需求变更为确认订单页面不需要悬浮页，故注释
        window.addEventListener('scroll', this.handleScroll)*/
    }
    ,
    destroyed() {
      // window.removeEventListener('scroll', this.handleScroll)
    }
    ,
  }
</script>

<style lang="scss">
  .confirm_order {
    position: relative;
    width: 1200px;
    margin: 0px auto 20px;
    padding-top: 25px;
    .shipping_address {
      width: 100%;
      border: 1px solid #F3F4F3;
      font-size: 14px;
      padding-bottom: 20px;

      p {
        padding-left: 20px;
      }
      .shop_address {
        color: #333333;
        padding-top: 16px;
      }
      .shipping_name {
        color: #666666;
      }
    }
    .shipping_info {
      padding-left: 20px;
      height: 40px;
      line-height: 40px;
      background: #F8F8F8;
      font-size: 16px;
      color: #333333;
      font-weight: bold;
    }
    .shipping_pay {
      margin-top: 20px;
      font-size: 14px;
      padding-bottom: 20px;
      position: relative;

      .edit_invoice {
        color: #666666;
        position: absolute;
        right: 20px;
        bottom: 25px;
        cursor: pointer;
        i {
          margin-left: 5px;

        }
      }
    }
    .pay_method {
      display: inline-block;
      margin-top: 12px;
      width: 141px;
      height: 46px;
      line-height: 46px;
      text-align: center;
      border: 1px solid #EEEEEE;
      margin-right: 15px;
      color: #666666;
      font-size: 14px;
      box-sizing: border-box;
      cursor: pointer;

    }
    .pay_active {
      position: relative;
      border-color: #2F9FFE;
    }
    .invoice_active {
      position: relative;
      border-color: #F67A16;
    }
    .pay_icon {
      position: absolute;
      right: 0px;
      bottom: 0px;
    }
    .table_title {
      margin-top: 13px;
      height: 33px;
      line-height: 33px;
      font-weight: 600;
      color: #666666;
      font-size: 12px;
      border-bottom: 1px solid #F3F4F3;
      .table_title_column {
        padding-left: 40px;
        box-sizing: border-box;
      }
    }
    .content_list {
      margin-bottom: 24px;
      .content_list_rows {
        border-bottom: 1px solid #F3F4F3;
        box-sizing: border-box;
        .list_column {
          padding: 18px 0px 20px 20px;
          box-sizing: border-box;
          position: relative;
          font-size: 12px;

          .icon-buyed {
            position: absolute;
            bottom: 15px;
            left: 58px;
          }
          .el-checkbox {
            vertical-align: middle;
          }
          .img-box {
            display: inline-block;
            vertical-align: middle;
            width: 95px;
            height: 95px;
            border: 1px solid #EEEEEE;
            text-align: center;
            padding-top: 5px;
            box-sizing: border-box;
            .commodity_img {
              object-fit: cover;
              width: 85px;
              height: 85px;
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
            border: 1px solid #DFDFDF;
            color: #999999;
            padding: 1px 5px;
            font-size: 12px;
            border-radius: 2px;
            margin-top: 5px;
          }
          .cart-input-number {
            width: 172px;
            height: 32px;
            line-height: 30px;
            margin-bottom: 6px;
            .el-input-number__decrease, .el-input-number__increase {
              background: #F3F4F3;
            }
            .el-input__inner {
              height: 32px;
              line-height: 30px;
            }
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
            color: #FF3131;
            font-weight: 600;
          }
          .delete_commodity {
            text-align: center;
            color: #2F9FFE;
            cursor: pointer;
          }
          .add_attention {
            text-align: center;
            color: #333;
            cursor: pointer;
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
            color: #FC7F48;
            border: 1px solid #FC7F48;
          }
          .mj {
            color: #FD2425;
            border: 1px solid #FD2425;
          }
        }
      }
    }
    .icon-fanhui {
      color: #3366CC;
      vertical-align: middle;
    }
    .back_cart {
      color: #3366CC;
      vertical-align: middle;
      margin-left: 5px;
      cursor: pointer;
    }
    .billing_tips {
      text-align: right;
      margin-bottom: 15px;
      font-size: 12px;
      color: #666666;
      line-height: 15px;
      .icon-wenhao {
        vertical-align: middle;
        margin-right: 5px;
      }

      .span_price {
        display: inline-block;
        min-width: 85px;
        text-align: right;
      }
    }
    .confirm_order_bottom {
      margin-left: 24px;
      padding: 14px 48px;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      background: #FE8A00;
      cursor: pointer;
    }
    .conifrm_order_footer {
      .leave_comments {
        margin-bottom: 45px;
        span {
          color: #666666;
          font-size: 14px
        }
        .el-input {
          flex: 1;
          .el-input__inner {
            border-color: #F3F4F3;
            height: 38px;
            line-height: 38px;
          }
          .el-input__count-inner {
            color: #666666;
            font-size: 12px;
          }
        }
      }

      .cnfirm_order_submit_wrap {
        text-align: right;
        height: 50px;
        line-height: 50px;
        margin-top: 26px;

      }
    }
    .conifrm_order_footer2 {
      position: fixed;
      left: 0px;
      right: 0px;
      bottom: 0px;
      background: #fff;
      box-shadow: 2px 0px 8px rgba(0, 0, 0, 0.1);
      .footer_content_wrap {
        height: 50px;
        line-height: 50px;
        width: 1200px;
        margin: 0 auto;
        text-align: right;
        .billing_tips {
          display: inline-block;
          margin-left: 60px;
        }
      }
    }
    .hint_color {
      color: #FF3131;
    }

    .dzfp-desc {
      padding: 8px 12px;
      line-height: 16px;
      font-size: 12px;
      color: #F3B533;
      background: #FFFEF1;
      border: 1px solid #FFD500;
    }
    .form-item-type {
      .el-form-item__content {
        margin-left: 0 !important;
        margin-top: 15px;
      }
    }
    .el-form-item__content {
      line-height: 28px;
    }
    .el-form-item__label {
      line-height: 28px;
      text-align: left;
    }
    .tips {
      padding-left: 16px;
      font-size: 14px;
      color: #999999;
    }
    .el-input {
      width: 262px;
      .el-input__inner {
        height: 28px;
        line-height: 28px;
        border: 1px solid #DEDEDE;
        border-radius: 0;
      }
    }
    .el-textarea {
      width: 262px;
      .el-textarea__inner {
        /*height: 83px;*/
        border-radius: 0;
      }
    }
    .button-edit {
      padding: 0;
      width: 90px;
      height: 32px;
      line-height: 32px;
      border-radius: 0;
    }
    .file-box {
      display: inline-block;
      position: relative;
      width: 88px;
      height: 88px;
      background: url(~@/assets/img/icon_upload.png) no-repeat center;
      background-size: cover;
      .upload-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }
    .img-box-padding {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 5px;
      box-sizing: border-box;
      &:hover {
        .black-mask {
          display: block;
        }
      }
      .black-mask {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        line-height: 150px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        background: rgba(0, 0, 0, 0.3);
      }
    }
    .img-box2 {
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
    }
    .icon-shanchu {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      cursor: pointer;
    }
    .el-form-item {
      margin-bottom: 18px;
    }
    .duty_number {
      .el-checkbox__label {
        font-size: 12px;
        color: #666666;
      }
    }
  }

</style>
