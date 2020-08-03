<template>
  <div class="search-page" v-loading="loading">
    <div class="w1200">
      <p class="search-total">全部结果：显示<span>{{table.page*table.limit - table.limit +1}}-{{table.limit*table.page}}</span>条，共<span>{{table.total}}</span>条
      </p>
      <div class="search-box">
        <div class="search-item flex-wrp">
          <div class="label">一级分类：</div>
          <div class="flex-item" :class="{'heightAuto': isShowAll}">
            <div class="second-type">
              <span :class="{'selected': item.selected}" v-for="(item,index) in table.typeCode"
                    @click="chooseType('typeCode',item,index)">{{item.name}}</span>
            </div>
          </div>
          <span class="collapse-opr" @click="isShowAll = false" v-if="isShowAll && table.typeCode.length > 0">收起<i
            class="iconfont icon-shouqi"></i></span>
          <span class="collapse-opr" @click="isShowAll = true" v-if="!isShowAll && table.typeCode.length > 0">更多<i
            class="iconfont icon-zhankai"></i></span>
        </div>
        <div class="search-item flex-wrp">
          <div class="label">厂家：</div>
          <div class="flex-item" :class="{'heightAuto': isShowAll2}">
            <p class="second-type text_overflow">
              <span :class="{'selected': item.selected}" v-for="(item,index) in table.manufacturer"
                    @click="chooseType('manufacturer',item,index)">{{item.name}}</span>
            </p>
          </div>
          <span class="collapse-opr" @click="isShowAll2 = false" v-if="isShowAll2 && table.manufacturer.length > 0">收起<i
            class="iconfont icon-shouqi"></i></span>
          <span class="collapse-opr" @click="isShowAll2 = true" v-if="!isShowAll2 && table.manufacturer.length > 0">更多<i
            class="iconfont icon-zhankai"></i></span>
        </div>
         <div class="search-item flex-wrp">
          <div class="label">规格：</div>
          <div class="flex-item" :class="{'heightAuto': isShowAll3}">
            <p class="second-type text_overflow">
              <span :class="{'selected': item.selected}" v-for="(item,index) in table.specifications"
                    @click="chooseType('specifications',item,index)">{{item.name}}</span>
            </p>
          </div>
          <span class="collapse-opr" @click="isShowAll3 = false" v-if="isShowAll3 && table.manufacturer.length > 0">收起<i
            class="iconfont icon-shouqi"></i></span>
          <span class="collapse-opr" @click="isShowAll3 = true" v-if="!isShowAll3 && table.manufacturer.length > 0">更多<i
            class="iconfont icon-zhankai"></i></span>
        </div>
        <div class="search-item flex-wrp">
          <div class="label">供应商：</div>
          <div class="flex-item" :class="{'heightAuto': isShowAll4}">
            <p class="second-type text_overflow">
              <span :class="{'selected': item.selected}" v-for="(item,index) in table.supplierName"
                    @click="chooseType('supplierName',item,index)">{{item.name}}</span>
            </p>
          </div>
          <span class="collapse-opr" @click="isShowAll4 = false" v-if="isShowAll4 && table.supplierName.length > 0">收起<i
            class="iconfont icon-shouqi"></i></span>
          <span class="collapse-opr" @click="isShowAll4 = true" v-if="!isShowAll4 && table.supplierName.length > 0">更多<i
            class="iconfont icon-zhankai"></i></span>
        </div>
      </div>
      <div class="filter-box">
        <ul class="filter-list">
          <li :class="{'choosed':sort==0}" @click="changeSort(0)">默认</li>
        </ul>
        <div class="filter-input">
          <el-checkbox label="有活动" name="type"></el-checkbox>
          <el-checkbox label="历史购买" name="type" v-model="isHistoryBuy" @change="handleIsHistoryBuy"></el-checkbox>
        </div>
        <div class="search-inset">
          <input type="text" placeholder="在结果中搜索" v-model="value1" @keyup.enter="searchInResult"/>
          <span class="search-btn" @click="searchInResult"><i class="iconfont icon-sousuo"></i></span>
        </div>
        <div class="fr view-type">
          <span class="choosed"><i class="iconfont icon-liebiao-80"></i>列表</span>
          <!-- <span><i class="iconfont icon-datu"></i>大图</span> -->
        </div>
      </div>
      <!-- 商品列表 -->
      <div class="product-list" style="min-height: 400px;">
        <div class="product-item flex-wrp" v-for="(item,index) in table.data"  @click="linkList(item)">
          <!-- 如果已购买 则显示 购买图标 -->
          <img class="icon-buyed" src="@/assets/img/icon_buyed.png" v-if="item.isHistoryBuy == 1"/>
          <div class="img-box">
            <img :src="item.drugImg"
                 :onerror="'javascript:this.src='+$utils.defaultBgImg()"/>
          </div>
          <div class="product-content flex-item">
            <div class="content content1">
              <p class="pro-name" :title="item.drugName">{{item.drugName}}<span v-if="item.drugName">&nbsp;&nbsp;</span>{{item.drugCommonName}}</p>
              <p class="pro-company">{{item.specifications}}/{{item.manufacturer}}</p>
              <p class="pro-store">{{item.supplierName}}</p>
              <!-- <p class="pro-activity"><span class="zk">领券87折</span><span class="mj">满减</span></p> -->
            </div>
            <div class="content content2">
              <template v-if="isLogin==-1">
                <p class="nosee" >价格登录可见</p>
              </template>
              <template v-else>
                <template v-if="item.commodityStatus == 1">
                  <p class="nosee" >无采购权限</p>
                </template>
                <template v-if="item.commodityStatus != 1">
                  <!--  1 单体价 2 连锁价 3 商业价 -->
                  <div v-if="specifyQuotation == 1">
                    <p class="price" v-if="item.minUnitPrice == item.maxUnitPrice"><span class="rmb">￥<i>{{item.minUnitPrice}}</i></span>/{{item.packageUnit}}</p>
                    <p class="price" v-else><span class="rmb">￥<i>{{item.minUnitPrice}}</i>-</span><span class="rmb">￥<i>{{item.maxUnitPrice}}</i></span>/{{item.packageUnit}}</p>
                  </div>
                  <div v-if="specifyQuotation == 2">
                    <p class="price" v-if="item.minChainPrice == item.maxChainPrice"><span class="rmb">￥<i>{{item.minChainPrice}}</i></span>/{{item.packageUnit}}</p>
                    <p class="price" v-else><span class="rmb">￥<i>{{item.minChainPrice}}</i>-</span><span class="rmb">￥<i>{{item.maxChainPrice}}</i></span>/{{item.packageUnit}}</p>
                  </div>
                  <div v-if="specifyQuotation == 3">
                    <p class="price" v-if="item.minCommercialPrice == item.maxCommercialPrice"><span class="rmb">￥<i>{{item.minCommercialPrice}}</i></span>/{{item.packageUnit}}</p>
                    <p class="price" v-else><span class="rmb">￥<i>{{item.minCommercialPrice}}</i>-</span><span class="rmb">￥<i>{{item.maxCommercialPrice}}</i></span>/{{item.packageUnit}}</p>
                  </div>
                </template>
              </template>

              <p class="date" v-if="item.minDateExpiration == item.maxDateExpiration">效期：{{item.minDateExpiration}}</p>
              <p class="date" v-else>效期：{{item.minDateExpiration}}/{{item.maxDateExpiration}}</p>
              <p class="store" v-if="item.minRepertory == item.maxRepertory">库存：{{item.minRepertory}}</p>
              <p class="store" v-else>库存：{{item.minRepertory}}-{{item.maxRepertory}}</p>
            </div>
            <div class="content content3">
              <p class="jy_price">建议零售价：</p>
              <p class="size">中/大包装 ：{{item.mediumPackage}}/{{item.largePackage}}</p>
              <!-- <p class="size">中包装：{{item.mediumPackage}}盒 <span>{{item.isRetail==0?'不可拆零':item.isRetail==1?'可拆零':'无'}}</span><span>大包装：{{item.largePackage}}{{item.packageUnit }}</span></p> -->
            </div>
          </div>
          <div class="opr">
            <p>
              <el-button type="primary" class="btn-add-cart" :disabled="isLogin !=1 && isLogin != -1  || item.commodityStatus == 1 || item.commodityStatus == 2" @click.stop=addCart(item)>加入购物车</el-button>
            </p>
            <!-- 如果已购买 则显示 继续购买按钮 -->
            <!-- <p>
              <el-button type="primary" class="btn-rebuy">继续购买</el-button>
              <span class="col coled"><i class="iconfont icon-guanzhu"></i></span>
            </p> -->
          </div>
        </div>
        <p class="no-data-tips" v-if="table.total <= 0">
          <img class="no-data" src="../../assets/img/icon_no_data.png"/>暂未搜到商品，换个搜索词试试</p>
      </div>
      <div class="reset-pagination" v-if="table.total > 0">
        <el-pagination @current-change="handleCurrentChange"
                       background
                       prev-text="上一页"
                       next-text="下一页"
                       layout="prev, pager,next, jumper"
                       :page-sizes="[10, 50, 100, 150]"

                       :total="table.total" :current-page.sync="table.page"
                       :page-size="table.limit">
        </el-pagination>
        <el-button class="sure-btn" plain>确 定</el-button>
      </div>
    </div>

    <!-- 加入购物车弹框 -->
    <el-dialog
      class="b2b-dialog product-list-dialog"
      :visible.sync="dialogVisible"
      width="830px"
      max-height="730px"
      :title="dialogTable.title"
      :append-to-body="true"
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
          width="140">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="120">
          <template slot-scope="scope">
            <span v-if="specifyQuotation ==1">￥{{scope.row.unitPrice}}</span>
            <span v-if="specifyQuotation ==2">￥{{scope.row.chainPrice}}</span>
            <span v-if="specifyQuotation ==3">￥{{scope.row.commercialPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="repertory"
          label="库存">
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
            <el-input-number v-model="scope.row.commodityNumber" :min="scope.row.isRetail==0?scope.row.largePackage:scope.row.isRetail==1?scope.row.mediumPackage:1" :max="scope.row.minRepertory" size="mini"
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
      <div slot="footer" class="dialog-footer" style="height: 46px">
      </div>
    </el-dialog>
    <show-login :loginDialogVisible="isShowLogin" :redictUrl="redictUrl" @closeEvent="closeLoginDialog"></show-login>
  </div>
</template>
<script>
  import API from "../../api/api_product";
  import {bus} from "../../bus.js"
  import showLogin from '@/components/common/showLogin';
  export default {
    name: 'search',
    data() {
      return {
        loading: false,
        isLogin: -1,//  0待审核，1审核通过，2审核失败，9禁用
        arrStr:'', // 首页传过来的字符串
        commodityCode: '', // 首页传过来的code
        value: '', // 搜索框的值
        isShowAll: false,
        isShowAll2: false,
        isShowAll3: false,
        isShowAll4: false,
        sort: 0,  // 默认0  销量1   价格2
        order: '', // 上1  下2
        minPrice: '',
        maxPrice: '',
        isInStock: false,    // 只看有货
        typeCode:'',         // 一级分类
        specifications: '',  // 规格
        supplierName: '',    // 供应商名称
        manufacturer: '',    // 厂商
        dateExpirationType: '', // 效期选择1:小于6个月2:6到12个月3:12个月以上
        value1: '',     // 搜索结果中搜索
        isHistoryBuy: false, // 历史购买
        dateTypes: [
          {
            choosed: false,
            val: 1,
            name: '小于六个月'
          },
          {
            choosed: false,
            val: 2,
            name: '6-12个月'
          },
          {
            choosed: false,
            val: 3,
            name: '12个月以上'
          }
        ],
        table: {
          data: [],
          typeCode: [],
          manufacturer: [],    // 生产厂商
          specifications: [],  // 规格
          supplierName: [],    // 供应商
          total: 0,
          limit: 20,
          page: 1
        },
        dialogTable: {
          data:[],
          title: '',
          total: 0,
          limit: 20,
          page: 1
        },
        dialogVisible: false,
        isShowLogin: false,
        redictUrl: '',
        specifyQuotation: '', // 1 单体价 2 连锁价 3 商业价
        currentItem: {},  // 点击的当前商品
      }
    },
    components:{
      showLogin,
    },
    created() {
      this.isLogin = this.$utils.verifyLogin();
      this.specifyQuotation = this.$utils.specifyQuotation();
      bus.$on("goto", url => {
        localStorage.removeItem("b2b-access-user");
        localStorage.removeItem("b2b-access-token");
        let query = this.$route.query;
        let href = {
          path: '/search',
          query: query
        };
        this.redictUrl = JSON.stringify(href)
        this.$router.push({
          path: '/login?redictUrl=' + JSON.stringify(href)
        });
      });
    },
    destroyed() {
      bus.$off("searchEvent");
    },
    mounted() {
      let path = this.$router.history.current.path;
      let query = this.$route.query;
      bus.$on("searchEvent", (val) => {
        this.$router.replace(
          {path, query: {value: val}}
        );
        this.value = val;
        this.table.page = 1;
        this.table.total = 0;
        this.clearData();
        this.handleSearch();
      })
      if (query) {
        if (query.arrStr) {  // 首页传过来的值
          this.arrStr = query.arrStr;
        }
        if (query.commodityCode) {  // 首页传过来的值
          this.commodityCode = query.commodityCode;
        }
        if(query.page) {  //当前页
          this.table.page = Number(query.page);
          console.log(this.table.page)
        }
        if (query.value) {  // 搜索框中的值
          this.value = query.value;
        }
         if (query.value1) {  // 搜索结果中搜索值
          this.value1 = query.value1;
        }
        if (query.typeCode) {  // 一级分类
          this.typeCode = query.typeCode;
        }
        if (query.supplierName) {  // 供应商
          this.supplierName = query.supplierName;
        }
        if (query.manufacturer) {  // 生产厂商
          this.manufacturer = query.manufacturer;
        }
        if (query.specifications) { // 规格
          this.specifications = query.specifications;
        }
        if (query.minPrice) {
          this.minPrice = query.minPrice
        }
        if (query.maxPrice) {
          this.maxPrice = query.maxPrice;
        }
        if (query.isInStock) {
          this.isInStock = true;
        }
        if (query.order) {
          this.order = query.order;
        }
        if (query.sort) {
          this.sort = query.sort;
        }
        if (query.isHistoryBuy) {
          this.isHistoryBuy = true;
        }
        if (query.dateExpirationType) {
          this.dateExpirationType = query.dateExpirationType;
          for (let i in this.dateTypes) {
            if (this.dateExpirationType == this.dateTypes[i].val) {
              this.dateTypes[i].choosed = true;
            }
          }
        }
        this.handleSearch();
      }

    },
    methods: {
      // 动态添加url参数
      funcUrlAdd(params, val) {
        let query = this.$route.query;
        console.log(query)
        let path = this.$router.history.current.path;
        let newQuery = JSON.parse(JSON.stringify(query));
        if(params == 'value1' || params == 'typeCode' || params == 'manufacturer' || params == 'specifications' || params == 'specifications') { //  如果是是在结果中再搜索，要把页面清除掉
          delete newQuery['page'];
        }
        newQuery[params] = val;
        this[params] = val; // 赋值
        this.$router.replace(
          {path, query: newQuery}
        );
        this.handleSearch();
      },
      // 动态删除url参数
      funcUrlDel(params) {
        let query = this.$route.query;
        let path = this.$router.history.current.path;
        let newQuery = JSON.parse(JSON.stringify(query));

        if (params in newQuery) {
          delete newQuery[params];
        }
        this[params] = "";  // 清空值
        this.$router.replace(
          {path, query: newQuery}
        );
        this.table.page = 1;
        this.table.total = 0;
        this.handleSearch();
      },
      // 清除选项
      clearData(){
        this.isShowAll = false;
        this.isShowAll2 = false;
        this.isShowAll3 = false;
        this.isShowAll4 = false;
        this.isInStock = false;    // 只看有货
        this.isHistoryBuy = false;    // 历史购买
        this.typeCode = '';         // 一级分类
        this.specifications = '';  // 规格
        this.supplierName =  '';    // 供应商名称
        this.manufacturer =  '';    // 厂商
        this.dateExpirationType =  ''; // 效期选择1:小于6个月2:6到12个月3:12个月以上
        this.value1 =  '';     // 搜索结果中搜索
      },
      // 选择分类
      chooseType(type, item, idx) {
        this.table.page = 1;
        if (type == 'typeCode') {  // 一级分类
          for (let i in this.table.typeCode) {
            if (i == idx) {
              if (this.table.typeCode[idx].selected) {
                this.funcUrlDel('typeCode');
                this.table.typeCode[idx].selected = false;
              } else {
                this.funcUrlAdd('typeCode', item.typeCode);
                this.table.typeCode[idx].selected = true;
              }
            } else {
              this.table.typeCode[i].selected = false;
            }
          }
        } else if (type == 'manufacturer') { // 厂商
          for (let i in this.table.manufacturer) {
            if (i == idx) {
              if (this.table.manufacturer[idx].selected) {
                this.funcUrlDel('manufacturer');
                this.table.manufacturer[idx].selected = false;
              } else {
                this.funcUrlAdd('manufacturer', item.name);
                this.table.manufacturer[idx].selected = true;
              }
            } else {
              this.table.manufacturer[i].selected = false;
            }
          }
        } else if (type == 'specifications') {  // 规格
          for (let i in this.table.specifications) {
            if (i == idx) {
              if (this.table.specifications[idx].selected) {
                this.funcUrlDel('specifications');
                this.table.specifications[idx].selected = false;
              } else {
                this.funcUrlAdd('specifications', item.name);
                this.table.specifications[idx].selected = true;
              }
            } else {
              this.table.specifications[i].selected = false;
            }
          }
        }
        else if (type == 'supplierName') { // 供应商
          for (let i in this.table.supplierName) {
            if (i == idx) {
              if (this.table.supplierName[idx].selected) {
                this.funcUrlDel('supplierName');
                this.table.supplierName[idx].selected = false;
              } else {
                this.funcUrlAdd('supplierName', item.name);
                this.table.supplierName[idx].selected = true;
              }
            } else {
              this.table.supplierName[i].selected = false;
            }
          }
        }
      },
      // 销量、价格切换
      changeSort(sort) {
        if (sort == this.sort) {
          if (this.order == 1) {
            this.order = 2;
            this.funcUrlAdd('order', 2);
          } else {
            this.order = 1;
            this.funcUrlAdd('order', 1);
          }
        } else {
          this.sort = sort;
          this.order = 1;
          this.funcUrlAdd('order', 1);
        }
        this.funcUrlAdd('sort', sort);

      },
      // 价格只能输入数字
      handleChangenum(evt) {
        this.minPrice = evt.target.value.replace(/[^\d]/g, '');
      },
      handleChangenum2(evt) {
        this.maxPrice = evt.target.value.replace(/[^\d]/g, '');
      },
      // 价格区间
      clearInput() {
        this.minPrice = "";
        this.maxPrice = "";
      },
      sureInput() {
        if (this.minPrice == "" && this.maxPrice == "") {
          this.minPrice = 0;
          this.maxPrice = 9999;
        }
        if (Number(this.maxPrice) < Number(this.minPrice)) {
          let min = JSON.parse(JSON.stringify(this.maxPrice));
          let max = JSON.parse(JSON.stringify(this.minPrice));
          this.minPrice = min;
          this.maxPrice = max;
        }
        this.funcUrlAdd("minPrice", this.minPrice);
        this.funcUrlAdd("maxPrice", this.maxPrice);
      },
      handleInStock() {
        if (this.isInStock) {
          this.funcUrlAdd('isInStock', true);
        } else {
          this.funcUrlAdd('isInStock', false);
        }
      },
      // 历史购买
      handleIsHistoryBuy() {
        if (this.isHistoryBuy) {
          this.funcUrlAdd('isHistoryBuy', true);
        } else {
          this.funcUrlAdd('isHistoryBuy', false);
        }
      },
      // 选择效期
      chooseDateType(item, idx) {
        for (let i in this.dateTypes) {
          if (i == idx) {
            if (this.dateTypes[idx].choosed) {
              this.dateTypes[idx].choosed = false;
              this.funcUrlDel('dateExpirationType')
            } else {
              this.dateTypes[idx].choosed = true;
              this.funcUrlAdd('dateExpirationType', this.dateTypes[idx].val)
            }
          } else {
            this.dateTypes[i].choosed = false;
          }
        }
      },
      linkList(item) {
        let obj = {
          partnerId: item.partnerId,
          drugSkuId: item.drugSkuId,
          supplierId: item.supplierId,
          page: 1,
          limit: -1
        }
        this.loading =true;
        API.searchPrice(obj).then((res) => {
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
        console.log(obj)
        API.searchPrice(obj).then((res) => {
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
      // 搜索结果中搜索
      searchInResult(){
        if(this.value1 == "") {
          this.funcUrlDel('value1');
          this.table.page = 1;
        } else {
          this.funcUrlAdd('value1', this.value1)
        }
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
      // 关闭是否登录弹框
      closeLoginDialog(){
        this.isShowLogin = false;
      },
      // 点击弹框里边的加购物车
      handleAdd(row,index) {
        if (row.commodityNumber <= 0) {
          this.$message.warning("请输入购买数量");
          return;
        }
        this.dialogTable.data[index].btnLoading = true;
        API.addCart({commodityId: row.commodityId,commodityNumber: row.commodityNumber}).then( (res) => {
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
      //分页
      handleCurrentChange(val) {
        this.table.page = val;
        this.funcUrlAdd('page', val);
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
      handleSearch() {
        let postData = this.$route.query;
        if(postData.value) {
          bus.$emit("searchValue", postData.value);
        }
        if(postData.page) {
          postData.page = Number(postData.page);
        } else {
          postData.page = 1;
        }
        postData.limit = this.table.limit,

        postData.inStock = this.isInStock == true ? 1 : '';
        postData.isHistoryBuy = this.isHistoryBuy == true ? 1 : '';
        this.loading = true;
        API.search(postData).then((res) => {
          this.loading = false;
          if (res.code == 0) {
            let rows = [];           // 列表数据
            let typeCode = [];       // 一级分类
            let manufacturer = [];   // 厂商
            let specifications = []; // 规格
            let supplierName = [];   // 供应商
            for (let i in res.data.rows) {
              let obj = res.data.rows[i];
              // obj.minDateExpiration = this.$utils.dateFormate(res.data.rows[i].minDateExpiration);  // 日期格式化
              // obj.maxDateExpiration = this.$utils.dateFormate(res.data.rows[i].maxDateExpiration);
              obj.num = 0;
              rows.push(obj)
            }
            for (let i in res.data.manufacturer) {
              if (this.manufacturer != "" && this.manufacturer != null) {
                if (res.data.manufacturer[i] == this.manufacturer) {
                  manufacturer.push({
                    selected: true,
                    name: res.data.manufacturer[i]
                  })
                } else {
                  manufacturer.push({
                    selected: false,
                    name: res.data.manufacturer[i]
                  })
                }
              } else {
                manufacturer.push({
                  selected: false,
                  name: res.data.manufacturer[i]
                })
              }
            }
            for (let i in res.data.oneTypeCode) {
              if (this.typeCode != "" && this.typeCode != null) {
                if (res.data.oneTypeCode[i].typeCode == this.typeCode) {
                  typeCode.push({
                    selected: true,
                    typeCode: res.data.oneTypeCode[i].typeCode,
                    name: res.data.oneTypeCode[i].name
                  })
                } else {
                  typeCode.push({
                    selected: false,
                    typeCode: res.data.oneTypeCode[i].typeCode,
                    name: res.data.oneTypeCode[i].name
                  })
                }
              } else {
                typeCode.push({
                  selected: false,
                  typeCode: res.data.oneTypeCode[i].typeCode,
                  name: res.data.oneTypeCode[i].name
                })
              }
            }
            for (let i in res.data.specifications) {
              if (this.specifications != "" && this.specifications != null) {
                if (res.data.specifications[i] == this.specifications) {
                  specifications.push({
                    selected: true,
                    name: res.data.specifications[i]
                  })
                } else {
                  specifications.push({
                    selected: false,
                    name: res.data.specifications[i]
                  })
                }
              } else {
                specifications.push({
                  selected: false,
                  name: res.data.specifications[i]
                })
              }
            }
            for (let i in res.data.supplierName) {
              if (this.supplierName != "" && this.supplierName != null) {
                if (res.data.supplierName[i] == this.supplierName) {
                  supplierName.push({
                    selected: true,
                    name: res.data.supplierName[i]
                  })
                } else {
                  supplierName.push({
                    selected: false,
                    name: res.data.supplierName[i]
                  })
                }
              } else {
                supplierName.push({
                  selected: false,
                  name: res.data.supplierName[i]
                })
              }

            }

            this.table.data = rows;
            this.table.page = Number(postData.page);
            this.table.manufacturer = manufacturer;
            this.table.typeCode = typeCode;
            this.table.specifications = specifications;
            this.table.supplierName = supplierName;
            this.table.total = res.data.total;
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .search-page {
    .search-total {
      font-size: 14px;
      color: #666666;
      span {
        color: #2F9FFE;
      }
    }
    .search-box {
      margin: 14px 0;
      border: 1px solid #EBEBEE;
      .search-item {
        position: relative;
        background: #F6F6F6;
        border-bottom: 1px solid #EBEBEE;
        &:last-child {
          border-bottom: none;
        }
      }
      .label {
        padding: 15px 0;
        width: 101px;
        font-size: 12px;
        color: #999;
        text-align: center;
      }
      .flex-item {
        position: relative;
        padding: 0 96px 0 18px;
        height: 54px;
        line-height: 54px;
        overflow: hidden;
        background: #fff;
        .second-type{
          padding: 10px 0;
        }
        &.heightAuto {
          height: auto;
          overflow: auto;
          .second-type{
            white-space: normal;
            overflow-y: auto;
            text-overflow: inherit;
            word-break: break-all;
            max-height: 300px;

          }
        }
        span {
          float: left;
          margin:5px 25px 5px 0;
          padding: 0 12px;
          height: 24px;
          line-height: 24px;
          font-size: 12px;
          color: #333;
          cursor: pointer;
          &.selected {
            color: #43A8FE;
            background: #E8F4FF;
            border-radius: 12px;
          }
        }
      }
      .collapse-opr {
        position: absolute;
        top: 13px;
        right: 21px;
        width: 54px;
        height: 26px;
        line-height: 26px;
        color: #999999;
        background: rgba(246, 246, 246, 1);
        border: 1px solid rgba(230, 230, 234, 1);
        border-radius: 3px;
        text-align: center;
        cursor: pointer;
      }
    }
    .filter-box {
      padding: 8px 0;
      background: rgba(246, 246, 246, 1);;
      border: 1px solid #EBEBEE;
      .filter-list {
        display: inline-block;
        li {
          position: relative;
          display: inline-block;
          width: 77px;
          line-height: 1;
          text-align: center;
          font-size: 12px;
          color: #666;
          cursor: pointer;
          &.choosed {
            color: #2F9FFE;
          }
          &.selected {
            .active {
              color: #2F9FFE !important;
            }
          }
          .caret-wrapper {
            display: inline-block;
            position: relative;
            width: 12px;
            height: 17px;
            vertical-align: middle;
            .sort-caret {
              position: absolute;
              right: 0;
              font-size: 12px;
              color: #CCCCCC;
              &.icon-arrLeft-fill {
                top: 0;
              }
              &.icon-sanx-up {
                bottom: 0;
              }
            }
          }
        }
      }
      .filter-input {
        position: relative;
        display: inline-block;
        font-size: 12px;
        &:after {
          position: absolute;
          content: "";
          top: 50%;
          right: 0;
          margin-top: -6px;
          width: 1px;
          height: 12px;
          background: #E6E6EA;
        }
        .price-between {
          position: relative;
          padding: 0 20px;
          .price-label {
            padding-right: 15px;
          }
          .price-range {
            display: none;
            position: absolute;
            left: -8px;
            top: -10px;
            width: 152px;
            height: 70px;
            border: 1px solid #979797;
            background: #fff;
            .clear-btn, .s-btn {
              position: absolute;
              bottom: 8px;
              color: #666;
              cursor: pointer;
              text-decoration: none;
              &:hover {
                color: #409EFF;
              }
            }
            .clear-btn {
              left: 15px;
            }
            .s-btn {
              right: 15px;
              padding: 0 6px;
              line-height: 1.5;
              border: 1px solid #979797;
            }
          }
        }
        .s-input-box {
          position: relative;
          z-index: 10;
          &:hover {
            .price-range {
              display: block;
            }
          }
        }
        .price-input {
          width: 62px;
          padding: 0;
          z-index: 10;
          .el-input__inner {
            padding: 0 5px;
            height: 25px;
            line-height: 25px;
            border-radius: 2px;
          }
        }
        i {
          padding: 0 5px;
          z-index: 10;
        }
        .el-checkbox {
          margin-right: 20px;
        }
        .el-checkbox__label {
          font-size: 12px;
        }
      }

    }
    .search-inset {
      position: relative;
      display: inline-block;
      margin-left: 20px;
      padding: 0 30px 0 5px;
      width: 175px;
      height: 25px;
      font-size: 12px;
      background: #fff;
      border-radius: 2px;
      box-sizing: border-box;
      input {
        background: transparent;
        outline: none;
        border: none;
        width: 100%;
      }
      .search-btn {
        position: absolute;
        right: 0;
        top: 0;
        height: 25px;
        line-height: 25px;
        width: 30px;
        text-align: center;
        cursor: pointer;
      }
    }
    .view-type {
      span {
        padding-right: 20px;
        cursor: pointer;
        &.choosed {
          color: #2F9FFE;
          i {

          }
        }
        i {
          padding-right: 5px;
          font-size: 12px;
        }
        .icon-liebiao-80 {
          font-size: 15px;
        }
      }
    }
    .validity-date {
      padding: 10px 0 0 27px;
      font-size: 12px;
      color: #666;
      span {
        margin-left: 15px;
        display: inline-block;
        width: 74px;
        height: 23px;
        line-height: 23px;
        font-size: 12px;
        color: #999999;
        text-align: center;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(230, 230, 234, 1);
        border-radius: 10px;
        cursor: pointer;
        &.choosed {
          color: #2F9FFE;
          background: rgba(232, 244, 255, 1);
          border: 1px solid rgba(47, 159, 254, 1);
        }
      }
    }
    .product-list {
      .product-item {
        position: relative;
        padding: 10px;
        cursor: pointer;
        &:nth-child(2n) {
          background: #FAFAFA;
        }
        .icon-buyed {
          position: absolute;
          bottom: 15px;
          left: 5px;
          z-index: 10;
        }
        .img-box {
          position: relative;
          padding: 15px;
          width: 140px;
          height: 140px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(238, 238, 238, 1);
          background-repeat: no-repeat;
          background-size: 100px auto;
          background-position: center;
          overflow: hidden;
          box-sizing: border-box;
          img{
            width: 100%;
          }
        }
        .content {
          float: left;
          font-size: 12px;
          color: #999;
          vertical-align: middle;
          box-sizing: border-box;
        }
        .content1 {
          padding-left: 50px;
          width: 30%;
        }
        .content2 {
          // padding-top: 24px;
          padding-left: 60px;
          width: 30%;
        }
        .content3 {
          padding-top: 24px;
          padding-left: 80px;
          width: 40%;
        }
        p {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .pro-name {
          font-size: 14px;
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
        .mj {
          color: #FB7F48;
          border: 1px solid #FB7F48;
        }
        .zk {
          color: #FFA60C;
          border: 1px solid #FFA60C;
        }
        .price {
          .rmb {
            font-size: 12px;
            color: #FF3131;
            i {
              font-size: 16px;
              font-style: normal;
            }
          }
        }
        .nosee{
          font-size: 16px;
          color: #FF2424;
        }
        .date {
          color: #333333;
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
        .opr {
          padding-right: 16px;
          .el-input-number--mini {
            width: 173px;
            line-height: 31px;
            .el-input__inner {
              height: 33px;
              line-height: 33px;
            }
            .el-input-number__decrease,
            .el-input-number__increase {
              width: 33px;
            }
          }
          p {
            padding-top: 30px;
          }
          .el-button {
            padding: 12px 50px;
          }
          .btn-add-cart {
            background-color: #2F9FFE;
            border-color: #2F9FFE;
            &.is-disabled{
              opacity: 0.5;
            }
          }
          .btn-rebuy {
            background-color: #FFA531;
            border-color: #FFA531;
          }
          .col {
            display: inline-block;
            margin-left: 10px;
            width: 39px;
            height: 39px;
            line-height: 39px;
            text-align: center;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(222, 222, 222, 1);
            border-radius: 5px;
            cursor: pointer;
            &.coled {
              i {
                color: #FCD200;
              }
            }
            i {
              color: #CFCFCF;
            }
          }
        }
      }
      .no-data-tips{
        padding:  100px 0 0;
        font-size: 12px;
        text-align: center;
        color: #999;
        .no-data{
          margin: 0 auto;
          display: block;
        }
      }
    }
  }
</style>
<style lang='scss'>
  .search-page{
    .el-input-number--mini{
      width: 116px;
    }
    .el-table__header thead tr th{
      background: #F5F7FA;
      border-color: #ECEFF6;
    }
    .el-table--border, .el-table--group{
      border-color: #ECEFF6;
    }
    th,td{
      text-align: center;
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
      .btn-add-cart{
        width: 90px;
      }
    }

  }
</style>
