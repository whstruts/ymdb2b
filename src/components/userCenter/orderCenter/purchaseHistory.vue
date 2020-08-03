<template>
  <div class="purchase-history" v-loading="loading">
    <div class="order_conditional_screening">
      <!-- <el-select v-model="selectOrderTime" style="width: 130px;"
                  :popper-class="'order_dropdown_wrap'" @change="changeOrderTime">
        <el-option
          v-for="item in orderTimeData"
          :key="item.id"
          :label="item.val"
          :value="item.id">
        </el-option>
      </el-select>
      <template v-if="selectOrderTime==1">
        <el-date-picker
          v-model="beginOrderDate"
          type="date"
          placeholder="订单开始日期" style="margin-left: 18px" @change="changeOrderData" value-format="yyyy-MM-dd"
          format="yyyy-MM-dd" :picker-options="pickerOptions0">
        </el-date-picker>
        <span style="margin: 0px 5px; color: #666">-</span>
        <el-date-picker
          v-model="endOrderDate"
          type="date"
          placeholder="订单结束日期" @change="changeOrderData" value-format="yyyy-MM-dd"
          format="yyyy-MM-dd" :picker-options="pickerOptions1">
        </el-date-picker>
      </template> -->
      <p class="bgfff" style="padding: 0 20px;line-height: 40px">最近一个月({{table.beginTime}}/{{table.endTime}})</p>
    </div>
    <ul class="history-list bgfff" v-if="table.total > 0">
      <li class="history-item" v-for="item in table.data">
        <h2 class="title">近一个月买过其{{item.commodityNum}}个不同效期商品，共{{item.sumNum}}{{item.packageUnit}}</h2>
        <div class="product-info flex-wrp">
          <div class="img-box" @click="linkSearch(item)">
            <img :src="item.drugImg"
                 :onerror="'javascript:this.src='+$utils.defaultBgImg()"/>
            <!-- commodityStatus  0正常 1 无采购权限  2 库存不足/售罄 3  下架-->
            <span class="sell-out" v-if="item.commodityStatus == 2">已售罄</span>
            <span class="sell-out" v-if="item.commodityStatus == 3">已下架</span>
          </div>
          <div class="product-txt flex-item" @click="linkSearch(item)">
             <div class="content content1">
              <p class="pro-name text_overflow">{{item.drugName}}<span v-if="item.drugName">&nbsp;&nbsp;</span>{{item.drugCommonName}}</p>
              <p class="pro-company text_overflow">{{item.specifications}}/{{item.manufacturer}}</p>
              <p class="pro-date text_overflow" v-if="item.minDateExpiration == item.maxDateExpiration">效期：{{item.minDateExpiration}}</p>
              <p class="pro-date text_overflow" v-else>效期：{{item.minDateExpiration}}/{{item.maxDateExpiration}}</p>
              <div class="pro-price" v-if="isLogin == -1"><i>价格登录可见</i></div>
              <template v-else>
                <div class="pro-price" v-if="item.commodityStatus != 1">
                  <p class="pro-price" v-if="item.minPrice == item.maxPrice">￥<i>{{item.minPrice}}</i></p>
                  <p class="pro-price" v-else>￥<i>{{item.minPrice}}</i>-￥<i>{{item.maxPrice}}</i></p>
                </div>
                <div class="pro-price" v-if="item.commodityStatus == 1"><i>无采购权限</i></div>
              </template>
              <p class="pro-store text_overflow">{{item.supplierName}}</p>
            </div>
          </div>
        </div>
        <div class="btn-box">
          <el-button class="btn-find" size="mini" @click="linkSearch(item)">找同品种</el-button>
          <el-button type="primary" class="btn-add" size="mini" :disabled="isLogin !=1 && isLogin != -1  || item.commodityStatus == 1 || item.commodityStatus == 2" @click.stop=addCart(item)>加购物车</el-button>
        </div>
      </li>
    </ul>
    <div class="reset-pagination" v-if="table.total > 0">
      <el-pagination @current-change="handleCurrentChange"
                      background
                      prev-text="上一页"
                      next-text="下一页"
                      layout="prev, pager,next, jumper"
                      :page-sizes="[10, 50, 100, 150]"

                      :total="table.total" :current-page.sync="table.currentPage"
                      :page-size="table.pageSize">
      </el-pagination>
      <el-button class="sure-btn" plain>确 定</el-button>
    </div>
    <div class="no_order" v-if="table.total<=0">
      <img src="../../../assets/img/no_order.png"/>
      <p>暂无历史采购</p>
    </div>
    <!-- 加入购物车弹框 -->
    <el-dialog
      class="b2b-dialog product-list-dialog"
      :visible.sync="dialogVisible"
      width="830px"
      :title="dialogTable.title"
      :append-to-body="true"
      :lock-scroll="false"
      :before-close="handleClose">
      <el-table
        border
        ref="dialogTable"
        :data="dialogTable.data"
        center
        style="width: 100%"
        max-height="550px">
        <el-table-column
          prop="dateExpiration"
          label="效期"
          width="160">
           <template slot-scope="scope">
             {{scope.row.dateExpiration}} <span class="purchase-time" v-if="scope.row.purchaseTimes > 0">已购{{scope.row.purchaseTimes || 0}}次</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="100">
          <template slot-scope="scope">
            <span v-if="specifyQuotation ==1">￥{{scope.row.unitPrice}}</span>
            <span v-if="specifyQuotation ==2">￥{{scope.row.chainPrice}}</span>
            <span v-if="specifyQuotation ==3">￥{{scope.row.commercialPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="repertory"
          label="库存">
          <template slot-scope="scope">
            <!-- commodityStatus  0正常 1 无采购权限  2 库存不足/售罄 3  下架-->
            <span v-if="scope.row.commodityStatus == 2">已售罄</span>
            <span v-if="scope.row.commodityStatus == 3">已下架</span>
            <span v-if="scope.row.commodityStatus == 0">{{scope.row.repertory}}</span>
          </template>
        </el-table-column>
         <el-table-column
          prop="repertory"
          label="中/大包装" width="180px">
          <template slot-scope="scope">
            <p class="size">{{scope.row.mediumPackage}}/{{scope.row.largePackage}} <span>{{scope.row.isRetail==0?'不可拆零':scope.row.isRetail==1?'可拆零':'无'}}</span></p>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="采购数量"
          width="255px">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.commodityNumber" :min="scope.row.isRetail==0?scope.row.largePackage:scope.row.isRetail==1?scope.row.mediumPackage:1" :max="scope.row.repertory" size="mini"
                             class="reset-input-number" :step="scope.row.isRetail==0?scope.row.largePackage:scope.row.isRetail==1?scope.row.mediumPackage:1" step-strictly></el-input-number>
            <el-button type="primary" size="mini" class="btn-add-cart" :disabled="isLogin !=1 && isLogin != -1 || scope.row.commodityStatus == 1 || scope.row.commodityStatus == 2" :loading="scope.row.btnLoading" @click=handleAdd(scope.row,scope.$index)>加购物车</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialog-reset-pagination" style="margin-bottom: -20px" v-if="dialogTable.total > 0">
        <el-pagination @current-change="handleCurrentChange2"
          @size-change="handleSizeChange2"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[5, 10, 20]"
          small
          :total="dialogTable.total" :current-page.sync="dialogTable.page"
          :page-size="dialogTable.limit"
          ></el-pagination>
        <el-button type="primary" size="mini" plain>确 定</el-button>
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer" style="height: 46px"></div>
    </el-dialog>
  </div>
</template>
<script>
import API from "../../../api/api_purchase_history";
import api_product from "../../../api/api_product";
import {bus} from "../../../bus.js"
export default {
  name:"purchaseHistory",
  data(){
    return{
      loading:false,
      isLogin: -1,
      selectOrderTime: 0,
      orderTimeData: [
        {id: 0, val: "近六十日内订单"},
        {id: 1, val: "自定义日期"},
      ],
      beginOrderDate: "",
      endOrderDate: "",
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.endOrderDate) {
            return time.getTime() > new Date(this.endOrderDate).getTime();

          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.beginOrderDate).getTime() - 1 * 24 * 60 * 60 * 1000;//减去一天的时间代表可以选择同一天;
        }
      },
       table: {
        data: [],
        total: 0,
        beginTime:'',
        endTime:'',
        pageSize: 12,
        currentPage: 1
      },
      dialogTable: {
          data:[],
          title: '',
          total: 0,
          limit: 20,
          page: 1
        },
      dialogVisible: false,
      specifyQuotation: '', // 1 单体价 2 连锁价 3 商业价
       currentItem: {},  // 点击的当前商品
    }
  },
  created(){
    this.isLogin = this.$utils.verifyLogin();
    this.specifyQuotation = this.$utils.specifyQuotation();
    this.getHistoryBuy();
  },
  methods:{
    changeOrderTime(val) {
      if (val == 0) {
        this.beginOrderDate = "";
        this.endOrderDate = "";
        this.getHistoryBuy();
      }
    },
    changeOrderData() {
      if (this.beginOrderDate && this.endOrderDate) {
        this.getHistoryBuy();
      }
    },
    //分页
    handleCurrentChange(val) {
      this.table.currentPage = val;
      this.getHistoryBuy();
    },
    handleCurrentChange2(val) {
      this.$refs.dialogTable.bodyWrapper.scrollTop =0;
      this.dialogTable.page = val;
      this.searchPrice();
    },
    handleSizeChange2(val) {
      this.dialogTable.page = 1;
      this.dialogTable.limit = val;
      this.searchPrice();
    },
    // 获取采购历史列表
    getHistoryBuy(){
      let params = {
        limit: this.table.pageSize,
        page: this.table.currentPage,
        type: this.selectOrderTime == 0? 1:'',
        beginTime: this.beginOrderDate,
        endTime: this.endOrderDate
      }
      API.historyBuy(params).then(res => {
        if (res.code == 0) {
          this.table.data = res.data.rows;
          this.table.total = res.data.total;
          this.table.beginTime = res.beginTime;
          this.table.endTime = res.endTime;
        }
      })
    },

    // 点击查找同品种
    linkSearch(item){
      let obj = {
        partnerId: item.partnerId,
        drugSkuId: item.drugSkuId,
        supplierId: item.supplierId,
        page: 1,
        limit: -1
      }
      this.loading =true;
      api_product.searchPrice(obj).then((res) => {
        this.loading = false;
        if (res.code == 0) {
          if(res.data.total == 0) {
            this.$message.error("未查询到商品");
            return;
          } else if(res.data.total == 1) {
            this.$utils.openNewPage(this,"/productDetail", {commodityId: res.data.rows[0].commodityId})
          } else {
            this.$utils.openNewPage(this,"/searchList", {partnerId: item.partnerId, drugSkuId: item.drugSkuId, supplierId: item.supplierId})
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    addCart(item) {
         this.currentItem = item;
        if(this.isLogin == -1) {  // 未登录
          this.isShowLogin = true;
          let query = this.$route.query;
          let href = {
            path: '/search',
            query: query
          };
          this.redictUrl = JSON.stringify(href)
          return;
        }
        this.loading =true;
        this.searchPrice();
      },
      searchPrice(){
        let obj = {
          partnerId: this.currentItem.partnerId,
          drugSkuId: this.currentItem.drugSkuId,
          supplierId: this.currentItem.supplierId,
          page: this.dialogTable.page,
          limit: this.dialogTable.limit
        }
        api_product.searchPrice(obj).then((res) => {
            this.loading = false;
            if (res.code == 0) {
              if(res.data.total == 0) {
                this.$message.error("未查询到商品");
                return;
              }
              let tempArr =[]
              tempArr = res.data.rows;
              for (let i =0; i< tempArr.length; i++) {
                tempArr[i].commodityNumber = 0;
                tempArr[i].btnLoading = false;
              }
              this.dialogTable.data = tempArr;
              this.dialogTable.total = res.data.total;
              this.dialogTable.title = '共'+res.data.total +'个效期';
              this.dialogVisible = true;
            }
         }).catch( () => {
           this.loading =false;
         })
      },
      // 点击弹框关闭
      handleClose(){
        this.dialogTable = {
          data: [],
          totla: 0,
          page: 1,
          limit: 20
        }
        this.dialogVisible = false;
      },
      // 点击弹框里边的加购物车
      handleAdd(row,index) {
        if (row.commodityNumber <= 0) {
          this.$message.warning("请输入购买数量");
          return;
        }
        this.dialogTable.data[index].btnLoading = true;
        api_product.addCart({commodityId: row.commodityId,commodityNumber: row.commodityNumber}).then( (res) => {
          this.dialogTable.data[index].btnLoading = false;
          if(res.code == 0) {
            this.$message.success("已加入购物车");
            bus.$emit("addNum", res.validCommodityCount);
          } else {
            this.$message.error(res.msg)
          }
        }).catch( () =>{
          this.dialogTable.data[index].btnLoading = false;
        })
      },
      linkDetail(item){
        this.$router.push({
          path: '/productDetail?commodityId=' + item.commodityId
        })
      }
  }
}
</script>
<style  lang="scss">
.purchase-history{
  .order_conditional_screening {
    .el-select {
      background: #fff;
    }
    .el-input__inner {
      height: 30px;
      line-height: 28px;
      color: #666;
      font-size: 12px !important;
    }
    .el-input__icon {
      line-height: 28px;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 150px;
      background: #fff;
      .el-input {
        font-size: 12px;
      }
    }
    .order_search_wrap {
      float: right;
      .el-input {
        background: #fff;
        width: 190px;
        border: 1px solid #E1E1E1;
        box-sizing: border-box;
      }
      .el-input-group__append {
        border: initial;
        background: #F8F8F8;
        padding: 0px 14px;
        border-left: 1px solid #E1E1E1;
        .el-button {
          padding: 12px 12px;

        }
        .icon-sousuo {
          font-size: 14px;
          color: #888888;
        }
      }
    }
  }

  .history-list{
    margin-top: 16px;
    padding: 16px;
    overflow: hidden;
    .history-item{
      float: left;
      margin-right: 12px;
      margin-bottom: 12px;
      width: 308px;
      height: 218px;
      border: 1px solid #EEEEEE;
      overflow: hidden;
      box-sizing: border-box;
      &:nth-child(3n){
        margin-right: 0;
      }
      .title{
        padding: 5px 10px;
        font-size: 12px;
        color: #666666;
        border-bottom: 1px solid #EEEEEE;
      }
      .product-info{
        padding: 15px 10px;
        align-items: flex-start;
      }
      .product-txt{
        padding-left: 12px;
        overflow: hidden;
      }
      .img-box{
        position: relative;
        width:80px;
        height:80px;
        border:1px solid #EEEEEE;
        img{
          width: 100%;
        }
      }
      .pro-name{
        font-size: 14px;
        color: #333333;
        line-height: 1;
      }
      .pro-company,.pro-date,.pro-store{
        font-size: 12px;
        color: #999999;
      }
      .pro-price{
        padding-top: 5px;
        font-size: 12px;
        color: #FF2424;
        line-height: 1;
        i{
          font-size: 16px;
          font-style: normal;
        }
      }
      .btn-box{
        padding-right: 10px;
        padding-bottom: 15px;
        text-align: right;
        .btn-add{
          // background-color: #2F9FFE;
        }
        .btn-find{
          color: #2F9FFE;
          border-color: #2F9FFE;
        }
      }
    }
  }
  .product-list-dialog{
    .el-dialog__footer{
      height: 46px;
      padding: 0;
    }
    .size {
      span {
        margin-left: 10px;
        padding: 1px 8px;
        color: #FFA531;
        background: #FFF5DF;
        border-radius: 9px;
      }
    }
    .el-input__inner{
      border: 1px solid #DCDFE6;
    }
    .btn-add-cart{
      width: 90px;
    }
  }
  .no_order {
    margin: 130px auto 30px;
    color: #666666;
    width: 143px;
    text-align: center;
    p {
      text-align: center;
      font-size: 14px;
    }
  }
  .purchase-time{
    padding: 2px 3px;
    font-size:12px;
    color:#00AAEF;
    line-height:30px;
    border-radius: 9px;
    background: #F8F8F8;
  }
}
</style>
