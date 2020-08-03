<template>
  <div class="my_order" v-loading="tableLoading">
    <div class="order_status">
      <span :class="{'order_status':orderStatus==item.id}"
            v-for="item in orderStatusTab"
            :key="item.id" @click="tabOrderStatus(item.id)">{{item.val}}</span>
    </div>
    <div class="order_conditional_screening">
      <template v-if=" this.orderStatus==0">
        <span class="screening_title">订单状态：</span>
        <el-select v-model="selectOrderStatus" style="width: 110px;margin-right: 18px"
                   :popper-class="'order_dropdown_wrap'" @change="changeOrderStatus">
          <el-option
            v-for="item in orderStatusData"
            :key="item.id"
            :label="item.val"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
      <el-select v-model="selectOrderTime" style="width: 130px;"
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
      </template>
      <span class="order_search_wrap">
        <span class="screening_title">订单关键词：</span>
        <el-input placeholder="商品名称/厂家" v-model="searchKeyword" @keyup.enter.native="handleSearch">
         <el-button slot="append" icon="iconfont icon-sousuo" @click="handleSearch"></el-button>
        </el-input>
      </span>
    </div>
    <order-item :orderData="table.data" @countdownClose="countdownClose" ref="orderItem"></order-item>
    <div class="reset-pagination" v-show="table.total>10">
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
  </div>
</template>

<script>
  import orderItem from "../../common/userCenter/orderItem"
  import API from "../../../api/api_my_order"

  export default {
    name: "myOrder",
    components: {orderItem},
    data() {
      return {
        orderStatus: 0,
        orderData: [],
        selectOrderStatus: 0,
        orderStatusTab: [
          {id: 0, val: "全部订单"},
          {id: 1, val: "待付款"},
          {id: 2, val: "已付款"},
          {id: 3, val: "待出库"},
          {id: 4, val: "配送中"},
          {id: 5, val: "已完成"},
          {id: 6, val: "已取消"},
          {id: 7, val: "退货/退款"},
        ],
        orderStatusData: [
          {id: 0, val: "全部"},
          {id: 1, val: "待付款"},
          {id: 2, val: "已付款"},
          {id: 3, val: "开单中"},
          {id: 4, val: "拣货中"},
          {id: 5, val: "待配送"},
          {id: 6, val: "商品已出库"},
          {id: 7, val: "已完成"},
          {id: 8, val: "已取消"},
          {id: 9, val: "退货/退款"},
        ],
        selectOrderTime: 0,
        orderTimeData: [
          {id: 0, val: "近六十日内订单"},
          {id: 1, val: "自定义日期"},
        ],
        beginOrderDate: "",
        endOrderDate: "",
        searchKeyword: "",
        table: {
          data: [],
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
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
        queryClickStatus: false,//查询点击状态，设置两秒允许钟点一次，防止多刷，定时器紊乱
        tableLoading: false,
      }
    },
    created() {
      let status = this.$route.query.orderStatus;
      if (status) {
        this.orderStatus = status;
      }
      this.initData();
    },
    methods: {
      handleSearch() {
        if (!this.queryClickStatus) {
          this.table.currentPage = 1;
          this.initData();
          this.queryClickStatus = true;
          setTimeout(() => {
            this.queryClickStatus = false;
          }, 2000)
        }
      },
      //待付款倒计时结束时刷新该页面
      countdownClose() {
        this.initData();
      },
      initData() {
        //每次刷新数据的时候都要把待支付的定时器给关掉
        if (this.$refs.orderItem) {
          this.$refs.orderItem.destroyInterval();
        }
        let param = {
          limit: this.table.pageSize,
          page: this.table.currentPage,
          orderStatusTab: this.orderStatus,
          orderStatus: this.selectOrderStatus,
          queryText: this.searchKeyword,
          startTime: this.beginOrderDate,
          endTime: this.endOrderDate
        }
        API.list(param).then(res => {
          if (res.code == 0) {
            this.table.data
            this.table.data = res.data.rows;
            this.table.total = res.data.total;
            if (res.data.rows.length > 0) {
              setTimeout(() => {
                this.$refs.orderItem.initData();
              }, 100)
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      changeOrderStatus() {
        this.table.data = [];
        this.handleSearch();
      },
      changeOrderTime(val) {
        if (val == 0) {
          this.beginOrderDate = "";
          this.endOrderDate = "";
          this.handleSearch();
        }
      },
      changeOrderData() {
        if (this.beginOrderDate && this.endOrderDate) {
          this.handleSearch();
        }
      },
      tabOrderStatus(status) {
        this.orderStatus = status;
        this.selectOrderStatus = 0;
        this.selectOrderTime = 0;
        this.beginOrderDate = "";
        this.endOrderDate = "";
        this.searchKeyword = "",
          this.table.currentPage = 1;
        // this.initData();
        if (this.$refs.orderItem.intervalArr && this.$refs.orderItem.intervalArr.length > 0) { //如果定时任务有数据的话，给一秒钟的时间关闭
          this.tableLoading = true;
          this.$refs.orderItem.destroyInterval();
          setTimeout(() => {
            this.tableLoading = false;
            this.initData();
          }, 1000)
        } else {
          this.$refs.orderItem.destroyInterval();
          this.initData();
        }
      },
      handleCurrentChange(val) {
        this.table.currentPage = val;
        this.initData();
      }
    }
  }
</script>

<style lang="scss">
  .my_order {
    width: 980px;
    .order_status {
      padding-left: 20px;
      color: #333333;
      font-size: 14px;
      background: #fff;
      line-height: 40px;
      font-weight: 600;
      span {
        display: inline-block;
        margin-right: 35px;
        padding: 0px 5px;
        cursor: pointer;
      }
      .order_status {
        color: #2F9FFE;
        border-bottom: 2px solid #2F9FFE;
      }
    }
    .order_conditional_screening {
      padding: 15px 0px;
      .screening_title {
        color: #666;
        padding-left: 5px;
        font-weight: bold;
        font-size: 12px;
      }
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

  }

  .order_dropdown_wrap {
    .el-select-dropdown__item {
      font-size: 12px;
    }
  }
</style>

