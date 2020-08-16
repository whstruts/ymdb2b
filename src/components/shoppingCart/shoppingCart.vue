<template>
  <div class="shopping_cart " v-loading="loading">
    <div class="steps">
      <img src="@/assets/img/preview/home_logo.png" class="step_logo" @click="linkHome()"/>
      <!--<img src="@/assets/img/preview/yyo_log.png" @click="linkHome()"  class="step_logo"/>-->
      <span class="steps_title">购物车</span>
      <img src="@/assets/img/step/step_1.png" class="step_icon"/>
    </div>
    <div class="cart_navigation">
      <span class="navigation_title " @click="tabChange(0)"
            :class="{navigation_title_active:commodityType==0}">全部商品<span
        class="cart_num">{{validCommodityCount }}</span></span>
      <span class="line"></span>
      <!--      <span class="navigation_title " @click="tabChange(1)"
                  :class="{navigation_title_active:commodityType==1}">活动商品<span class="cart_num">0</span></span>
            <span class="line"></span>-->
      <span class="navigation_title" @click="tabChange(2)" :class="{navigation_title_active:commodityType==2}">库存紧张<span
        class="cart_num">{{shortRepertoryCount}}</span></span>
      <span class="navigation_hint">满<span class="cart_hint">{{orderThresholdPrice}}</span>元起送,<span class="cart_hint">{{exemptionPostagePrice }}</span>元包邮</span>
    </div>
    <el-row class="table_title">
      <el-col :span="4">
        <div class="table_title_column" style="padding-left: 20px">
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="table_title_column">商品</div>
      </el-col>
      <el-col :span="4">
        <div class="table_title_column">单价</div>
      </el-col>
      <el-col :span="6">
        <div class="table_title_column">采购数量</div>
      </el-col>
      <el-col :span="2">
        <div class="table_title_column" style="padding-left: 28px">小计</div>
      </el-col>
      <el-col :span="2">
        <div class="table_title_column">操作</div>
      </el-col>
    </el-row>
    <div class="table_rows">
      <el-checkbox-group v-model="checkedCart" @change="handleCheckedCitiesChange">
        <el-row class="table_rows_content" v-for="(item,index) in cartData" :key="index"
                :style="{background:checkedCart.indexOf(item)!=-1?'#F0F9FF':item.commodityStatus!=0?'#F8F8F8':'#fff'}">
          <el-col :span="4">
            <div class="table_row_column" style="cursor: pointer">
              <!--commodityStatus 0正常，1暂无购买权限，2库存不足，3下架"-->
              <el-checkbox :label="item" :key="index"
                           v-if="item.commodityStatus==0" :disabled="item.commodityStatus!=0"></el-checkbox>
              <span v-if="item.commodityStatus!=0" class="invalid">
               <!-- {{item.commodityStatus==1 || item.commodityStatus==3?'失效':item.commodityStatus==2?'售罄':'失效'}}-->
                失效
              </span>
              <img class="sold_out" src="@/assets/img/sold_out_icon.png" v-if="item.commodityStatus==2"/>
              <img class="sold_out" src="@/assets/img/withdrawn.png"
                   v-if="item.commodityStatus==1 || item.commodityStatus==3"/>
              <img class="icon-buyed" src="@/assets/img/icon_buyed.png"
                   v-if="item.isShop==1 && item.commodityStatus==0"/>
              <div class="img-box" @click="commodityDetails(item.commodityId)">
                <img :src="item.drugImg"
                     :onerror="'javascript:this.src='+$utils.defaultBgImg()"
                     class="commodity_img"/>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="table_row_column content" @click="commodityDetails(item.commodityId)" style="cursor: pointer">
              <p class="pro-name text_overflow" :title="item.drugCommonName">{{item.drugName?item.drugName+'&nbsp;&nbsp;':''}}{{item.drugCommonName}}</p>
              <p class="pro-company text_overflow" :title="item.manufacturer">
                {{item.specifications}}/{{item.manufacturer }}</p>
              <p class="pro-store">{{item.supplierName}}</p>
              <p class="pro-activity" style="display: none"><span class="zk">领券87折</span><span class="mj">满减</span></p>
              <p v-if="isPurchaseManager(item)"><span class="label-pm">限购</span></p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="table_row_column">
              <p class="commodity_price">￥{{item.price || '0.00'}}/{{item.packageUnit }}</p>
              <span class="commodity_validity_period"> 效期：{{item.dateExpiration }} </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="table_row_column">
              <p v-if="item.repertoryStatus==2 && item.commodityStatus==0"
                 style="width: 172px;text-align:center;color: #FF3131">库存紧张</p>
              <el-input-number v-model="item.commodityNumber" step-strictly
                               :min="item.isRetail==0?item.largePackage:item.isRetail==1?item.mediumPackage:1"
                               :max="item.repertory"
                               class="cart-input-number" @change="commodityNumberChange(item)"
                               :step="item.isRetail==0?item.largePackage:item.isRetail==1?item.mediumPackage:1"
                               :disabled="item.commodityStatus!=0"></el-input-number>
              <p><span class="commodity_package">中/大包装：{{item.mediumPackage }}/{{item.largePackage }}</span>
                <span class="package_instruction">{{item.isRetail==0?'不可拆零':item.isRetail==1?'可拆零':'无'}}</span>
              </p>
              <p>
                <span v-if="item.commodityNumber <= item.maxNum" class="label-pm-c">（限购{{item.maxNum}}盒）</span>
                <span v-else class="label-pm">超过限制购买最大量</span>
              </p>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="table_row_column">
              <p class="total_price">
                ￥{{item.countPrice=(item.price*item.commodityNumber).toFixed(2)}}</p>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="table_row_column" style="padding-left: 0px">
              <p class="delete_commodity" @click="deleteCommodity(item)">删除</p>
              <p class="add_attention" style="display: none">添加关注</p>
            </div>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <div class="no_card" v-if="!cartData||cartData.length<=0">
        <img src="../../assets/img/icon_no_data.png"/>
        <p>购物车空空的，快去选购商品吧</p>
      </div>
    </div>
    <div style="height:50px ">
      <div class="settlement " id="settlement" :class="searchBarFixed ? 'isFixed' :''" v-if="cartData.length>0">
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <span @click="deleteCommodity('')" class="hint_hover">删除选中商品</span>
        <span  @click="clearInvalidCommodity"
              class="hint_hover">清空失效商品</span>
        <div class="commodity_settlement">
          <span class="span_hint">已选中<span class="span_color">{{checkedCart.length}}</span>种商品,共<span
            class="span_color">{{selectCommodityNum}}</span>件 </span>
          <span class="span_hint">合计（不含运费）：<span class="span_color"
                                                 style="font-size: 16px">{{totalAmount}}</span></span>
          <span class="settlement_button "
                :class="{settlement_button2:parseFloat(totalAmount)< parseFloat(orderThresholdPrice)}"
                @click="confirmOrder">{{parseFloat(totalAmount)==0?orderThresholdPrice+'元起送':parseFloat(totalAmount) < parseFloat(orderThresholdPrice)?'还差'+(parseFloat(orderThresholdPrice) - parseFloat(totalAmount)).toFixed(2)+'元起送':'去结算'}}</span>
        </div>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="800px"
      class="b2b-dialog"
      :before-close="handleClose">
      <out-of-stock-list :list="soldOutData"></out-of-stock-list>
      <span slot="footer" class="dialog-footer">
    <!--<el-button @click="handleClose">取 消</el-button>-->
    <el-button type="primary" @click="handleClose">我知道了</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from "../../api/api_shopping_cart"
  import outOfStockList from "../common/outOfStockList"
  import {bus} from '../../bus'

  export default {
    name: "shoppingCart",
    components: {outOfStockList},
    data() {
      return {
        checkAll: false,
        checkedCart: [],
        searchBarFixed: false,
        cartData: [],//购物车里有效商品和失效商品的集合
        shoppingTrolleyList: [],//购物车里有效商品
        invalidShoppingTrolleyList: [],//购物车里失效商品
        totalAmount: 0,//总金额
        selectCommodityNum: 0,//选中的商品数量
        commodityType: 0,
        validCommodityCount: 0,//购物车总数量
        shortRepertoryCount: 0,//库存紧张的数量
        exemptionPostagePrice: 0,//包邮金额
        orderThresholdPrice: 0,//起送金额
        dialogVisible: false,
        soldOutData: [],
        buyAgainData: [], //再次购买的商品id , 从订单列表和订单详情中过来的
        loading: false
      }
    },
    created() {
      this.buyAgainData = this.$route.params.buyAgainData;
      if (this.buyAgainData) {
        this.buyAgainData = JSON.parse(this.buyAgainData);
        let data = this.buyAgainData.failList;
        if (data && data.length > 0) {
          this.dialogVisible = true
          this.soldOutData = data;
        }
      }
      this.initData();
      this.getDeliveryLimit();

    },
    methods: {
      //跳到商品详情
      commodityDetails(commodityId) {
        /* this.$router.push({
           path: '/productDetail?commodityId='+ commodityId
         })*/
        this.$utils.openNewPage(this, "/productDetail", {commodityId})
      },
      // 点击logo图片跳转到首页
      linkHome() {
        this.$router.push({
          path: '/homePage'
        })
      },
      tabChange(val) {
        this.searchBarFixed = false;
        this.commodityType = val
        this.initData();
      },
      initData() {
        this.checkAll = false;
        this.checkedCart = [];
        API.getShoppingList({commodityType: this.commodityType}).then(res => {
          this.totalAmount = '0.00';
          if (res.code == 0) {
            //正常的商品 shoppingTrolleyList
            this.shoppingTrolleyList = res.data.shoppingTrolleyList ? res.data.shoppingTrolleyList : [];
            // 失效的商品invalidShoppingTrolleyList
            this.invalidShoppingTrolleyList = res.data.invalidShoppingTrolleyList ? res.data.invalidShoppingTrolleyList : [];
            //有效和失效的集合
            this.cartData = this.shoppingTrolleyList.concat(this.invalidShoppingTrolleyList)
            if (this.cartData.length > 6) {
              this.searchBarFixed = true;
            }
            setTimeout(() => { //等待cartDaa中的countPrice参数被渲染
              //从再次购买中的商品要被勾选中
              if (!this.buyAgainData) {
                return;
              }
              let commodityIds = this.buyAgainData.commodityIds;
              if (commodityIds && commodityIds.length > 0) {
                this.shoppingTrolleyList.forEach(item => {
                  commodityIds.forEach(data => {
                    if (item.commodityId == data) {
                      this.checkedCart.push(item);
                      console.log(this.checkedCart, "aaaa")
                      this.calculateTheTotalAmount();
                    }
                  })
                })
              }
            }, 100)
          } else {
            this.$message.error(res.msg)
          }
        })
        this.getCount();
      },

      handleClose() {
        this.dialogVisible = false;
        this.totalAmount = 0;
        this.initData();
      },
      //确认订单
      confirmOrder() {
        if (parseFloat(this.totalAmount) < parseFloat(this.orderThresholdPrice)) {
          return;
        }
        if (this.checkedCart.length <= 0) {
          this.$message.error("请勾选要购买的商品")
          return;
        }
        let shoppingTrolleyIdList = [];
        this.checkedCart.forEach(item => {
          shoppingTrolleyIdList.push(item.shoppingTrolleyId);
        })
        this.loading = true;
        API.submitData({shoppingTrolleyIdList}).then(res => {
          this.loading = false;
          if (res.code == 0) {
            let data = JSON.stringify(res.data);
            this.$router.push({path: '/confirmOrder', query: {data: data}})
          } else if (res.code == 500) {
            this.dialogVisible = true
            this.soldOutData = res.data;
          } else {
            this.$message.error(res.msg)
          }
        }).catch(() => {
          this.$message.error("网络异常")
          this.loading = false;
        })


      },
      //获取购物车总数量，活动商品和库存紧张的个数
      getCount() {
        API.count().then(res => {
          if (res.code == 0) {
            this.validCommodityCount = res.data.validCommodityCount;
            this.shortRepertoryCount = res.data.shortRepertoryCount;
            bus.$emit("addNum", res.data.validCommodityCount);
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //获取配送限制
      getDeliveryLimit() {
        API.getDeliveryLimit().then(res => {
          if (res.code == 0) {
            this.exemptionPostagePrice = res.data.exemptionPostagePrice;
            this.orderThresholdPrice = res.data.orderThresholdPrice;
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //删除购物车的商品
      deleteCommodity(item) {
        this.$confirm('确认删除商品?', '提示', {
          type: 'warning'
        }).then(() => {
          let mallShoppingTrolleys = [];
          if (item) {
            mallShoppingTrolleys.push(item.shoppingTrolleyId);
          } else {
            if (this.checkedCart.length <= 0) {
              this.$message.error("请选择需要删除的商品")
              return;
            }
            this.checkedCart.forEach(item => {
              mallShoppingTrolleys.push(item.shoppingTrolleyId)
            });
          }

          API.deleteCommodity({mallShoppingTrolleys}).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.initData();
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
        });
      },
      clearInvalidCommodity() {
        if (this.invalidShoppingTrolleyList.length <= 0) {
          return;
        }
        this.$confirm('确认清除失效商品?', '提示', {
          type: 'warning'
        }).then(() => {
          API.clear().then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.initData();
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
        });
      },
      commodityNumberChange(item) {
        let param = {
          commodityId: item.commodityId,
          commodityNumber: item.commodityNumber
        }
        API.updateCommodityNumber(param).then(res => {
          if (res.code == 0) {
            this.calculateTheTotalAmount();
          } else {
            this.$message.error(res.msg)
            item.commodityNumber=item.commodityNumber-(item.isRetail==1?item.mediumPackage:item.largePackage)
          }
        })

      }
      ,
      handleCheckAllChange(val) {
        this.checkedCart = val ? this.shoppingTrolleyList : [];
        this.calculateTheTotalAmount();
      }
      ,
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.shoppingTrolleyList.length;
        this.calculateTheTotalAmount();
      }
      ,
      //计算购物车总金额
      calculateTheTotalAmount() {
        let data = this.checkedCart.length;
        this.totalAmount = 0;
        this.selectCommodityNum = 0;

        for (let i = 0; i < data; i++) {
          let price = parseFloat(this.checkedCart[i]['countPrice']);
          this.totalAmount += price;
          this.selectCommodityNum += this.checkedCart[i]['commodityNumber']
        }
        this.totalAmount = this.totalAmount.toFixed(2)
      },
      handleScroll() {
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        //变量windowHeight是可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        // console.log("距顶部" + scrollTop + "可视区高度" + windowHeight + "滚动条总高度" + scrollHeight);
        //滚动条到底部的条件  (scrollHeight - 70)减去底部
        if (scrollTop + windowHeight >= (scrollHeight - 435)) {
          //写后台加载数据的函数
          this.$nextTick(() => {
            this.searchBarFixed = false
          })
        } else {
          this.searchBarFixed = true;
        }
      }
      ,
      isPurchaseManager(item){
        return item.startDate != '' && item.startDate != null
          && Date.parse(item.startDate) < new Date()
          && Date.parse(item.endDate) > new Date()
      },
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
    }
    ,
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    }
    ,
  }
</script>

<style lang="scss">
  .shopping_cart {
    position: relative;
    width: 1200px;
    margin: 0px auto 20px;
    padding-top: 25px;

    .cart_navigation {
      margin-top: 40px;
      padding-bottom: 16px;
      border-bottom: 1px solid #EDEDED;
      line-height: 16px;
      .navigation_title {
        font-size: 16px;
        color: #333;
        padding: 0px 20px 16px;
        cursor: pointer;
        .cart_num {
          color: #2F9FFE;
          margin-left: 5px;
        }
      }
      .line {
        display: inline-block;
        height: 12px;
        width: 1px;
        background: #EDEDED;
      }
      .navigation_title_active {
        color: #2F9FFE;
        border-bottom: 1px solid #2F9FFE;

      }
      .navigation_hint {
        font-size: 14px;
        color: #333;
        float: right;
        .cart_hint {
          color: #FF3131;
        }
      }
    }
    .table_title {
      margin-top: 16px;
      height: 35px;
      line-height: 35px;
      background: #F3F4F3;
      color: #666666;
      font-size: 12px;
      .table_title_column {
        padding-left: 40px;
        box-sizing: border-box;

      }
    }
    .table_rows {
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      margin-bottom: 20px;
      position: relative;
      min-height: 400px;
      .no_card {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 110px;
        color: #666666;
        width: 210px;
        text-align: center;
        p {
          text-align: center;
          font-size: 14px;
        }
      }

      .table_rows_content {
        border: 1px solid #F3F4F3;
        border-top: initial;

      }
      .table_row_column {
        padding: 20px 0px 20px 20px;
        box-sizing: border-box;
        position: relative;
        font-size: 12px;
        .sold_out {
          position: absolute;
          bottom: 48px;
          left: 94px;
        }

        .icon-buyed {
          position: absolute;
          bottom: 20px;
          left: 65px;
        }
        .el-checkbox {
          vertical-align: middle;
          margin-right: 30px;
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
          border: 1px solid #F3F4F3;
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
          color: #FFA531;
          background: #FFF5DF;
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
          color: #333;
          cursor: pointer;
        }
        .delete_commodity:hover {
          color: #2F9FFE;
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
          color: #FB7F48;
          border: 1px solid #FC7F48;
        }
        .mj {
          color: #FD2425;
          border: 1px solid #FD2425;
        }
      }
      .el-checkbox__label {
        display: none;
      }
    }
    .isFixed {
      position: fixed;
      background-color: #Fff;
      bottom: 0px;
      z-index: 999;
      box-shadow: 2px 0px 8px rgba(0, 0, 0, 0.1);
    }
    .settlement {
      width: 1200px;
      height: 50px;
      line-height: 50px;
      padding-left: 20px;
      background: #F3F4F3;
      color: #666666;
      box-sizing: border-box;
      .commodity_settlement {
        display: inline-block;
        height: 100%;
        float: right;
        .settlement_button {
          display: inline-block;
          width: 147px;
          height: 50px;
          background: #FE8A00;
          text-align: center;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
        }
        .settlement_button2 {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .span_color {
          color: #FF3131;
        }
        .span_hint {
          margin-right: 40px;
        }
      }
      .hint_hover {
        cursor: pointer;
        margin-left: 30px;
      }
      .hint_hover:hover {
        color: #2F9FFE;
      }
    }
    .el-checkbox__label {
      color: #666666;
      font-size: 12px;
    }
  }
  .label-pm {
    background-color: red;
    color: white;
    font-size:12px;
    font-weight:normal;
  }
  .label-pm-c {
    text-align: left;
    margin-left: 50px;
  }

</style>
