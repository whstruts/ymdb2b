<template>
  <div class="search-page" v-loading="loading">
    <div class="w1200">
      <p class="search-total">全部结果：显示<span>{{table.currentPage*table.pageSize - table.pageSize +1}}-{{table.pageSize*table.currentPage}}</span>条，共<span>{{table.total}}</span>条
      </p>
      <div class="search-box">
        <div class="search-item flex-wrp">
          <div class="label">一级分类：</div>
          <div class="flex-item" :class="{'heightAuto': isShowAll}">
            <p class="second-type text_overflow">
              <span :class="{'selected': item.selected}" v-for="(item,index) in table.typeList"
                    @click="chooseType('typeList',item,index)">{{item.name}}</span>
            </p>
          </div>
          <span class="collapse-opr" @click="isShowAll = false" v-if="isShowAll && table.typeList.length > 0">收起<i
            class="iconfont icon-shouqi"></i></span>
          <span class="collapse-opr" @click="isShowAll = true" v-if="!isShowAll && table.typeList.length > 0">更多<i
            class="iconfont icon-zhankai"></i></span>
        </div>
        <div class="search-item flex-wrp">
          <div class="label">规格：</div>
          <div class="flex-item" :class="{'heightAuto': isShowAll2}">
            <p class="second-type text_overflow">
              <span :class="{'selected': item.selected}" v-for="(item,index) in table.specifications"
                    @click="chooseType('specifications',item,index)">{{item.name}}</span>
            </p>
          </div>
          <span class="collapse-opr" @click="isShowAll2 = false" v-if="isShowAll2 && table.specifications.length > 0">收起<i
            class="iconfont icon-shouqi"></i></span>
          <span class="collapse-opr" @click="isShowAll2 = true" v-if="!isShowAll2 && table.specifications.length > 0">更多<i
            class="iconfont icon-zhankai"></i></span>
        </div>
        <div class="search-item flex-wrp">
          <div class="label">厂商：</div>
          <div class="flex-item" :class="{'heightAuto': isShowAll3}">
            <p class="second-type text_overflow">
              <span :class="{'selected': item.selected}" v-for="(item,index) in table.manufacturer"
                    @click="chooseType('manufacturer',item,index)">{{item.name}}</span>
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
          <li :class="{'selected':sort==1}" @click="changeSort(1)">销量<span class="caret-wrapper"><i
            class="sort-caret iconfont icon-arrLeft-fill" :class="{'active': order == 2}"></i><i
            class="sort-caret iconfont icon-sanx-up" :class="{'active': order == 1}"></i></span></li>
          <li :class="{'selected':sort==2}" @click="changeSort(2)">价格<span class="caret-wrapper"><i
            class="sort-caret iconfont icon-arrLeft-fill" :class="{'active': order == 2}"></i><i
            class="sort-caret iconfont icon-sanx-up" :class="{'active': order == 1}"></i></span></li>
        </ul>
        <div class="filter-input">
          <span class="price-between">
            <span class="price-label">价格区间</span>
            <span class="s-input-box">
              <el-input class="price-input" v-model="minPrice" maxlength="4" @keyup.native="handleChangenum"></el-input><i>-</i><el-input
              class="price-input" v-model="maxPrice" maxlength="4" @keyup.native="handleChangenum2"></el-input>
              <div class="price-range">
                <a class="clear-btn" @click="clearInput">清空</a>
                <a class="s-btn" @click="sureInput">确认</a>
              </div>
            </span>

          </span>
          <el-checkbox label="只看有货" name="type" v-model="isInStock" @change="handleInStock"></el-checkbox>
          <el-checkbox label="有活动" name="type"></el-checkbox>
          <el-checkbox label="历史购买" name="type"></el-checkbox>
        </div>
        <div class="search-inset">
          <input type="text" placeholder="在结果中搜索"/>
          <span class="search-btn"><i class="iconfont icon-sousuo"></i></span>
        </div>
        <div class="fr view-type">
          <span class="choosed"><i class="iconfont icon-liebiao-80"></i>列表</span>
          <span><i class="iconfont icon-datu"></i>大图</span>
        </div>
        <p class="validity-date">
          效期
          <span :class="{'choosed': item.choosed}" v-for="(item,index) in dateTypes"
                @click="chooseDateType(item,index)">{{item.name}}</span>
        </p>
      </div>
      <!-- 商品列表 -->
      <div class="product-list">
        <div class="product-item flex-wrp" v-for="(item,index) in table.data">
          <!-- 如果已购买 则显示 购买图标 -->
          <!-- <img class="icon-buyed" src="@/assets/img/icon_buyed.png"/> -->
          <div class="img-box" :style="{backgroundImage: 'url('+ item.drugImg +')'}" @click="linkDetail(item)"></div>
          <div class="product-content flex-item" @click="linkDetail(item)">
            <div class="content content1">
              <p class="pro-name">{{item.drugName}}</p>
              <p class="pro-company">{{item.specifications}}/{{item.manufacturer}}</p>
              <p class="pro-store">{{item.supplierName}}</p>
              <p class="pro-activity"><span class="zk">领券87折</span><span class="mj">满减</span></p>
            </div>
            <div class="content content2">
              <template v-if="isLogin==1">
                <p class="price"><span class="rmb">￥<i>{{item.price}}</i></span>/{{item.packageUnit}}</p>
                <p class="jy_price">建议零售价：￥34</p>
                <p class="profit">毛利率：68.12%</p>
              </template>
              <template v-else>
                <p class="nosee" >{{isLogin==-1?'价格登录可见':'无采购权限'}}</p>
              </template>
            </div>
            <div class="content content3">
              <p class="store">库存：>100</p>
              <p class="date">效期：2020/10/12</p>
              <p class="size">中包装：1盒 <span>可拆零</span><span>件装：120盒</span></p>
            </div>
          </div>
          <div class="opr">
            <el-input-number v-model="item.num" :min="0" :step="1" size="mini"
                             class="reset-input-number"></el-input-number>
            <p>
              <el-button type="primary" class="btn-add-cart" :disabled="isLogin !=1 && isLogin != -1" @click.stop=addCart(item)>加入购物车</el-button>
              <span class="col"><i class="iconfont icon-guanzhu1"></i></span>
            </p>
            <!-- 如果已购买 则显示 继续购买按钮 -->
            <!-- <p>
              <el-button type="primary" class="btn-rebuy">继续购买</el-button>
              <span class="col coled"><i class="iconfont icon-guanzhu"></i></span>
            </p> -->
          </div>
        </div>
      </div>
      <div class="reset-pagination">
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
  </div>
</template>
<script>
  import API from "../../api/api_product";
  import {bus} from "../../bus.js"

  export default {
    name: 'search',
    data() {
      return {
        loading: false,
        isLogin: -1,//  0待审核，1审核通过，2审核失败，9禁用
        arrStr:'', // 首页传过来的字符串
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
        specifications: '',  // 规格
        supplierName: '',    // 供应商名称
        manufacturer: '',    // 厂商
        dateExpirationType: '', // 效期选择1:小于6个月2:6到12个月3:12个月以上
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
          typeList: [],
          manufacturer: [],    // 生产厂商
          specifications: [],  // 规格
          supplierName: [],    // 供应商
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
      }
    },
    created() {
      this.isLogin = this.$utils.verifyLogin();
      let path = this.$router.history.current.path;
      bus.$on("searchEvent", (val) => {
        this.$router.replace(
          {path, query: {value: val}}
        );
        this.value = val;
        this.table.currentPage = 1;
        this.table.total = 0;
        this.handleSearch();
      })
    },
     destroyed() {
      bus.$off("searchEvent");
    },
    mounted() {
      let query = this.$route.query;
      if (query) {
        if (query.arrStr) {  // 搜索框中的值
          this.arrStr = query.arrStr;
        }
        if(query.currentPage) {  //当前页
          this.table.currentPage = query.currentPage;
        }
        if (query.value) {  // 搜索框中的值
          this.value = query.value;
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
        let path = this.$router.history.current.path;
        let newQuery = JSON.parse(JSON.stringify(query));
        newQuery[params] = val;
        this[params] = val; // 赋值
        this.$router.replace(
          {path, query: newQuery}
        );
        this.table.currentPage = 1;
        this.table.total = 0;
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
        this.table.currentPage = 1;
        this.table.total = 0;
        this.handleSearch();
      },

      // 选择分类
      chooseType(type, item, idx) {
        if (type == 'typeList') {
          for (let i in this.table.typeList) {
            this.table.typeList[i].selected = false;
          }
        } else if (type == 'specifications') {
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

          let path = this.$router.history.current.path;
        } else if (type == 'manufacturer') {
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
        } else if (type == 'supplierName') {
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
      linkDetail(item) {
        this.$router.push({
          path: '/productDetail?commodityId=' + item.commodityId
        })
      },
      addCart(item) {
        if(item.num > 0) {
          API.addCart({commodityId: item.commodityId,commodityNumber: item.num}).then( (res) => {
            if(res.code == 0) {
              bus.$emit("addNum", res.data);
            } else {
              this.$message.error(res.msg);
            }
          })
        } else {
          this.$alert('请输入购买数量', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          }
        });
        }
      },
      //分页
      handleCurrentChange(val) {
        this.table.currentPage = val;
        this.funcUrlAdd('currentPage', val);
      },
      handleSearch() {
        let params = this.$route.query;
        if(params.currentPage) {
          params.page = params.currentPage;
        } else {
          params.page = 1;
        }
        params.limit = this.table.pageSize,

        params.inStock = this.isInStock == true ? 1 : '';
        this.loading = true;
        API.search(params).then((res) => {
          this.loading = false;
          if (res.code == 0) {

            let rows = [];
            let manufacturer = [];
            let specifications = [];
            let supplierName = [];
            for (let i in res.data.rows) {
              let obj = res.data.rows[i];
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
            for (let i in res.data.specifications) {
              if (this.specifications != "" && this.specifications != null) {
                if (res.data.specifications[i] == this.specifications) {
                  specifications.push({
                    selected: true,
                    name: res.data.specifications[i]
                  })
                  console.log()
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
            this.table.manufacturer = manufacturer;
            this.table.specifications = specifications;
            this.table.supplierName = supplierName;
            this.table.total = res.data.total;
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
        &.heightAuto {
          padding-top: 13px;
          height: auto;
          line-height: 30px;
          overflow: auto;
        }
        span {
          margin-right: 25px;
          padding: 4px 12px;
          font-size: 12px;
          color: #333;
          cursor: pointer;
          white-space: nowrap;
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
        }
        .img-box {
          width: 140px;
          height: 140px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(238, 238, 238, 1);
          background-repeat: no-repeat;
          background-size: 100px auto;
          background-position: center;
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
          width: 40%;
        }
        .content2 {
          padding-top: 24px;
          padding-left: 60px;
          width: 20%;
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
        .zk {
          color: #FB7F48;
          border: 1px solid #FB7F48;
        }
        .mj {
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
            color: #6AADEC;
            background: rgba(229, 243, 255, 1);
            border-radius: 9px;
          }
        }
        .opr {
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
            padding-top: 13px;
          }
          .el-button {
            padding: 12px 25px;
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
    }
  }
</style>
