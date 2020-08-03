<template>
  <div class="balance">
    <div class="available-balance bgfff">
      可用余额（元）：<span>{{table.balance}}</span>
    </div>
    <div class="balance-list bgfff">
      <div class="balance-title">
        <el-select v-model="selectOrderTime" style="width: 106px;"
          :popper-class="'order_dropdown_wrap'" @change="changeOrderTime" size="small">
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
            placeholder="开始日期" style="margin-left: 20px" @change="changeOrderData" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd" :picker-options="pickerOptions0" size="small">
          </el-date-picker>
          <span style="margin: 0px 5px; color: #666">-</span>
          <el-date-picker
            v-model="endOrderDate"
            type="date"
            placeholder="结束日期" @change="changeOrderData" value-format="yyyy-MM-dd"
            format="yyyy-MM-dd" :picker-options="pickerOptions1" size="small">
          </el-date-picker>
        </template>
        <span class="amount-total income">收入：<i>{{table.income}}</i>元</span>
        <span class="amount-total expend ">支出：<i>{{table.pay}}</i>元</span>
      </div>
      <el-table
      :data="table.data">
        <el-table-column label="日期" prop="createTime" width="140px"> </el-table-column>
        <el-table-column width="165px">
          <template slot="header" slot-scope="scope">
            <el-dropdown  trigger="click"  @command="handleCommand">
              <span class="el-dropdown-link">
                收入/支出（元）<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  command="">全部</el-dropdown-item>
                <el-dropdown-item command="1">收入</el-dropdown-item>
                <el-dropdown-item command="2">支出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
             <span :style="{color:scope.row.incomeExpenses==1 || scope.row.incomeExpenses==3?'#00AA5F':'#FF7428'}">{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px">
          <template slot="header" slot-scope="scope">
            <el-dropdown  trigger="click"  @command="handleCommand2">
              <span class="el-dropdown-link">
                类型<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  command="">全部</el-dropdown-item>
                <el-dropdown-item  command="1">退货/退款</el-dropdown-item>
                <el-dropdown-item  command="2">订单抵扣</el-dropdown-item>
                <el-dropdown-item  command="3">记账收入</el-dropdown-item>
                <el-dropdown-item  command="4">记账支出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
             <span>{{scope.row.incomeExpenses == 1?'退货/退款':scope.row.incomeExpenses == 2? '订单抵扣':scope.row.incomeExpenses == 3? '记账收入':scope.row.incomeExpenses == 4?'记账支出':'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联订单" width="200px">
          <template slot-scope="scope">
            <span v-if="scope.row.orderCode">订单号：<a href="javascript:;" @click="linkOrderList(scope.row)"> {{scope.row.orderCode}}</a></span>
          </template>
        </el-table-column>
        <el-table-column label="订单支付方式" prop="typemsg" width="100px">
        </el-table-column>
        <el-table-column label="可用余额" prop="balance" width="120px"></el-table-column>
        <el-table-column label="备注" prop="" width="150px">
          <template slot-scope='scope'>
            <el-popover
              placement="top-start"
              title="备注"
              width="200"
              trigger="hover"
              :content="scope.row.remark" v-if="scope.row.incomeExpenses != 2">
              <p class="text_overflow" slot="reference">{{scope.row.remark}}</p>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  </div>
</template>
<script>
import API from "../../../api/api_mine";
export default {
  name: 'balance',
  data(){
    return{
      orderTimeData:[
        {id: 0, val: "近一个月"},
        {id: 1, val: "自定义"},
      ],
      selectOrderTime:"近一个月",
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
        pageSize: 10,
        currentPage: 1,
        incomeExpenses:'', // 收入/支出
        typemsg: '',       // 订单支付类型
        balance: 0,        // 可用余额
        income: 0,         // 收入
        pay: 0,            // 支出
      },
    }
  },
  created(){
    this.getBalanceList();
  },
  methods:{
    // 获取余额明细
    getBalanceList(){
      let params = {
        limit: this.table.pageSize,
        page: this.table.currentPage,
        incomeExpenses: this.table.incomeExpenses, // 1收入（增加），2支出（减少）
        typemsg: this.table.typemsg,   // 1订单退款，2订单支付
        startTime: this.beginOrderDate,
        endTime: this.endOrderDate
      }
      API.balanceList(params).then( (res) => {
        if(res.code == 0) {
          this.table.data = res.data.rows;
          this.table.total = res.data.total;
          this.table.balance = res.balance;
          this.table.income = res.income;
          this.table.pay = res.pay;
        } else {
          this.$message.error(res.msg);
        }

      })
    },
    changeOrderTime(){
      if(this.selectOrderTime == 0) {
        this.beginOrderDate = "";
        this.endOrderDate = "";
        this.getBalanceList();
      }

    },
    changeOrderData() {
      if (this.beginOrderDate && this.endOrderDate) {
        this.getBalanceList();
      }
    },
    //分页
    handleCurrentChange(val) {
      this.table.currentPage = val;
      this.getBalanceList();
    },
    handleCommand(command){
      this.table.incomeExpenses = command;
      this.getBalanceList();
    },
    handleCommand2(command){
      this.table.incomeExpenses = command;
      this.getBalanceList();
    },
    // 链接到订单列表
    linkOrderList(row){
      const {href} = this.$router.resolve({
        path: "/centerPage/orderDetails?orderId=" + row.orderId
      });
      window.open(href, '_blank');
    }
  }
}
</script>
<style lang="scss">
  .balance{
    .available-balance{
      padding: 23px 19px;
      font-size: 14px;
      color: #666;
      span{
        font-size: 18px;
        font-weight: bold;
        color: #2F9FFE;
        vertical-align: middle;
      }
    }
    .balance-title{
      padding: 16px 0px;
    }
    .el-input__inner{
      border: 1px solid #DEDEDE;
    }
    .el-date-editor{
      width: 150px;
    }
    .amount-total{
      padding-left: 44px;
      font-size: 14px;
      color: #333;
      i{
        font-style: normal;
      }
      &.income{
        i{
          color: #00AA5F;
        }
      }
      &.expend{
        i{
          color: #FF7428;
        }
      }
    }
    .balance-list{
      margin-top: 20px;
      padding: 0 20px 20px;
    }
    .el-table__header{
      thead{
        height: 36px;
        line-height: 36px;
      }
      th{
        padding: 0;
        font-size: 14px;
        text-align: center;
        background: #F5F7FA;
        border-bottom: 1px solid #F5F7FA !important;
      }
    }
    .el-table td{
      padding: 6px 0;
    }
    td{
      border-bottom: 1px solid #F5F7FA !important;
    }
    .el-table--border::after, .el-table--group::after, .el-table::before{
      background: transparent;
    }
    .el-dropdown{
      line-height: 23px;
    }
    .cell{
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  }
</style>
