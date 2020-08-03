<template>
  <div class="home_wrap ">
    <top-wrap></top-wrap>
    <div class="search_wrap" v-if="currentRoute.meta.search">
      <img src="@/assets/img/preview/home_logo.png" @click="linkHome()"/>
      <!--<img src="@/assets/img/preview/yyo_log.png" @click="linkHome()"/>-->
      <div class="search_bg" ref="search">
        <div class="search_content">
          <!-- 商品名称 规格 厂家 供应商 多个关键词之间用空格 -->
          <el-input v-model="searchInput"
          ref="searchInput"
          placeholder="商品名称 厂家 多个关键词之间用空格"
          class="search_input"
          @input="querySearchAsync"
          @keydown.up.native= "selectResultItem('up')"
          @keydown.down.native= "selectResultItem('down')"
          @keyup.enter.native="linkSearch"
          @focus="querySearchAsync"
          :maxlength="30"></el-input>
          <div class="search_button" @click="linkSearch()">搜索</div>
        </div>
        <p class="popular_search">
          <!-- <label>热门搜索：</label><span>阿莫西林</span><span>感冒药</span><span>阿莫西林</span><span>感冒药</span> -->
        </p>
        <!-- 搜索建议 -->
        <div class="search-suggest" v-if="showSuggest && suggestList.length > 0">
          <ul>
            <li v-for="(item,index) in suggestList" :class="currentIndex == index ? 'active':''" @click="handleSelect(item)" v-if="index <10">{{item.value}}</li>
          </ul>
          <a href="javascript:;" class="opr-btn" @click="handleClose">关闭</a>
        </div>
        <!-- 搜索历史 -->
        <div class="search-suggest history-list" v-if="showHistory && historyList.length > 0">
          <ul>
            <li v-for="(item,index) in historyList" class="flex-wrp" :class="currentIndex == index ? 'active':''" @click="handleSelect(item)" v-if="index <10"><p class="flex-item">{{item}}</p> <span class="history-label">搜索历史</span><a href="javascript:;" class="clear" @click.stop="handleClear(index)">删除</a></li>
          </ul>
          <a href="javascript:;" class="opr-btn" @click="handleClearAll">全部清除</a>
        </div>
      </div>
      <!-- 搜索框固定效果 -->
      <div class="search-wrap-fixed" :class="{'show': isFixed}"  >
      <div class="search_wrap">
        <img src="@/assets/img/preview/home_logo.png" @click="linkHome()"/>
        <!--<img src="@/assets/img/preview/yyo_log.png" @click="linkHome()"/>-->
        <div class="search_bg" ref="search2">
          <div class="search_content">
            <el-input v-model="searchInput"
            placeholder="商品名称 厂家 多个关键词之间用空格"
            class="search_input"
            @input="querySearchAsync(2)"
            @keydown.up.native= "selectResultItem('up')"
            @keydown.down.native= "selectResultItem('down')"
            @keyup.enter.native="linkSearch"
            @focus="querySearchAsync(2)"
            :maxlength="30"></el-input>
            <div class="search_button" @click="linkSearch()">搜索</div>
          </div>
          <!-- 搜索建议 -->
          <div class="search-suggest" v-if="showSuggest2 && suggestList.length > 0">
            <ul>
              <li v-for="(item,index) in suggestList" :class="currentIndex == index ? 'active':''" @click="handleSelect(item)" v-if="index <10">{{item.value}}</li>
            </ul>
            <a href="javscript:;" class="opr-btn" @click="handleClose">关闭</a>
          </div>
          <!-- 搜索历史 -->
          <div class="search-suggest history-list" v-if="showHistory2 && historyList.length > 0">
            <ul>
              <li v-for="(item,index) in historyList" class="flex-wrp" :class="currentIndex == index ? 'active':''" @click="handleSelect(item)" v-if="index <10"><p class="flex-item">{{item}}</p> <span class="history-label">搜索历史</span><a href="javascript:;" class="clear" @click.stop="handleClear(index)">删除</a></li>
            </ul>
            <a href="javscript:;" class="opr-btn" @click="handleClearAll">全部清除</a>
          </div>
        </div>
        <div class="home_shopping_cart" @click="goShoppingCart">
          <i class="iconfont icon-gouwuche"></i>
          <span>我的购物车
            <template  v-if="commodityCount > '0' && commodityCount < '99+'">({{commodityCount}})</template>
            <template v-if="commodityCount > '99+'">(99+)</template>
          </span>
        </div>
      </div>
    </div>
      <div class="home_shopping_cart" @click="goShoppingCart">
        <i class="iconfont icon-gouwuche"></i>
        <span>我的购物车
          <template v-if="commodityCount > '0' && commodityCount < '99+'">({{commodityCount}})</template>
          <template v-if="commodityCount > '99+'">(99+)</template>
        </span>
      </div>
    </div>
    <router-view class="home_main scrollbar"></router-view>
    <right-menu @goShoppingCart="goShoppingCart" :commodityCount= "commodityCount"></right-menu>
    <show-login :loginDialogVisible="isShowLogin" :redictUrl="redictUrl" @closeEvent="closeLoginDialog"></show-login>
    <varify-info :varifyDialogVisible="isShowVarify" @closeEvent="closeVarifyDialog"></varify-info>
    <varify-zj :varifyZjVisible="varifyZjVisible" :varifyZjMsg='varifyZjMsg' @closeEvent="closeVarifyZj"></varify-zj>
    <footer-wrap></footer-wrap>
  </div>
</template>

<script>
  import {bus} from "../bus.js";
  import API from "../api/api_product";
  import api_user from "../api/api_user";
  import topWrap from '@/components/common/topWrap'
  import rightMenu from '@/components/common/rightMenu'
  import showLogin from '@/components/common/showLogin';
  import footerWrap from '@/components/common/footerWrap';
  import varifyInfo from '@/components/common/varifyInfo';
  import varifyZj from '@/components/common/varifyZj'
  export default {
    name: "home",
    data() {
      return {
        searchInput: '',
        currentRoute: "",
        isShowLogin: false,
        isShowVarify: false,
        varifyZjVisible: false,
        varifyZjMsg: '',
        redictUrl: "",//登录后跳转的链接
        isFixed: false,
        deadline: 60*60*24*1000, // 设置24小时内不再弹框
        notifyInstance: null,
        commodityCount: '0', // 购物车商品种类
        currentIndex: 0,   // 搜索建议默认选中第一个
        suggestList: [],   // 搜索建议列表
        historyList:[],    // 搜索历史
        showSuggest: false,
        showHistory: false,
        showSuggest2: false,
        showHistory2: false,
      }
    },
    components: {
      topWrap,
      rightMenu,
      showLogin,
      footerWrap,
      varifyInfo,
      varifyZj
    },
    watch: {
      $route(to) {
        this.currentRoute = to;
        // 如果不是在搜索页面，清除掉输入框的值
        if(to.path != '/search') {
          this.searchInput = "";
        }
      }
    },
    created() {
      this.currentRoute = this.$route;
      let userInfo = JSON.parse(localStorage.getItem("b2b-access-user"));
      let setTime = localStorage.getItem("setTime");
      let time = new Date().getTime();
      let value = this.$route.query.value;
      if(value) {
        this.searchInput = value;
      }
      if(userInfo) {
        // 检查用户是否认证
        if(userInfo.auditStatus ==0) {   // 0 未认证
          if(setTime != null) {  // 缓存里边有时间戳
            if(time - setTime > this.deadline) { // 当前时间- 缓存设置的时间 > 时间期限
              localStorage.setItem("setTime", time)
              this.isShowVarify = true;
            } else {  // 未过期
              this.isShowVarify = false;
            }
          } else { // 缓存里边没有时间戳
            localStorage.setItem("setTime", time)
            this.isShowVarify = true;
          }
        } else {
          //  "证件有效期类型(1=正常,2=已过期,3=快过期)") certificatesValidity;
          let certificatesValidity = userInfo.certificatesValidity;
          if (certificatesValidity != 1) {
            let msg = "";
            let setValidityTime = localStorage.getItem("setValidityTime");
            if(certificatesValidity == 2) {
              this.varifyZjMsg ="您的证件已过期,请及时更新"
            } else {
              this.varifyZjMsg ="您的证件即将过期,请及时更新"
            }
            if(setValidityTime != null) {  // 缓存里边有时间戳
              if(time - setValidityTime > this.deadline) { // 当前时间- 缓存设置的时间 > 时间期限
                localStorage.setItem("setValidityTime", time)
                this.varifyZjVisible = true;
              }
            } else {
              localStorage.setItem("setValidityTime", time)
              this.varifyZjVisible = true;
            }
          }
        }

        this.getShopCount();
      }
      document.addEventListener('click',(e)=>{
        if(this.$refs.search ) {
          if(!this.$refs.search.contains(e.target)){
  　　　　　 this.showSuggest = false;
            this.showHistory = false;
　　　　   }
        }
        if(this.$refs.search2){
          if(!this.$refs.search2.contains(e.target)){
            this.showSuggest2 = false;
            this.showHistory2 = false;
　　　　   }
        }
　　  })
      bus.$on("goto", url => {
        localStorage.removeItem("b2b-access-user");
        localStorage.removeItem("b2b-access-token");
        localStorage.removeItem("setValidityTime");
        localStorage.removeItem("setTime");
        this.$router.push({
          path: url
        });
      });
      bus.$on("addNum", (val) => {
        if(val) {
          this.commodityCount = val
        }
      })
      bus.$on("searchValue", val => {
        this.searchInput = val;
      })
    },
    mounted(){
      window.addEventListener('scroll', this.watchScroll)
    },
    methods: {
      goShoppingCart() {
        if( this.currentRoute.path  == '/shoppingCart') return;
        let userInfo = JSON.parse(localStorage.getItem("b2b-access-user"));
        if (userInfo) {
          this.isShowLogin = false;
          this.$utils.openNewPage(this,"/shoppingCart")
        } else{
          this.isShowLogin = true;
        }
      },
      // 获取购物车商品种类
      getShopCount(){
        api_user.getShopCount().then( (res) => {
          if(res.code == 0) {
            let commodityCount = res.data.validCommodityCount;
            if(commodityCount > 99) {
              commodityCount = '99+'
            }
            this.commodityCount = commodityCount
          }
        })
      },
      watchScroll(){
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        setTimeout( () => {
          this.showSuggest = false;
          this.showHistory = false;
          this.showSuggest2 = false;
          this.showHistory2 = false;
        },300)
        this.suggestList = [];
        if(scrollTop > 260) {
          this.isFixed = true;
          this.showHistory = false;
          this.showSuggest = false;
        } else {
          this.isFixed = false;
        }
      },
      // 联想搜索
       querySearchAsync(num) {
        if(!this.searchInput) {
          let searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
          if(searchHistory) {
            this.historyList = searchHistory;
          }
          if(num == 2) {
            this.showSuggest2 = false;
            this.showHistory2 = true;
          } else {
            this.showSuggest = false;
            this.showHistory = true;
          }

          return;
        };
        if(num == 2) {
          this.showHistory2 = false;
          this.showSuggest2 = true;
        } else {
          this.showHistory = false;
          this.showSuggest = true;
        }
        this.currentIndex = 0;
        setTimeout( () => {
          API.getAssociate({value:this.searchInput}).then((res) => {
            if(res.code == 0) {
              let data = res.data;
              let arr = [];
              if(data && data.length >0 ) {
                for (let i in data) {
                  arr.push({
                    value: data[i]
                  })
                }
              }
              this.suggestList = arr;
            } else {
              this.$message.error(res.message)
            }
          })
        },300)

      },
      handleBlur(num){
        setTimeout( () => {
          this.currentIndex = 0;
          if(num == 2) {
            this.showSuggest2 = false;
            this.showHistory2 = false;
          } else {
            this.showSuggest = false;
            this.showHistory = false;
          }

        },200)
      },
      // 键盘上下键操作
      selectResultItem(direction){
        if(direction == 'up') {
          if(this.currentIndex == 0) return;
          this.currentIndex --;
        } else {
          if(this.showSuggest || this.showSuggest2) {
            if (this.currentIndex === this.suggestList.length - 1) {
              this.currentIndex = 0
            } else {
              this.currentIndex++;
            }
          }
          if(this.showHistory || this.showHistory2) {
            if (this.currentIndex === this.historyList.length - 1) {
              this.currentIndex = 0
            } else {
              this.currentIndex++;
            }
          }
        }
        if(this.showSuggest || this.showSuggest) {
          this.searchInput = this.suggestList[this.currentIndex].value;
        }
        if(this.showHistory || this.showHistory2) {
          this.searchInput = this.historyList[this.currentIndex];
        }

      },
      // 搜索联想列表选中一个
      handleSelect(item){
        if(this.showSuggest || this.showSuggest2) {
          this.searchInput = item.value;
          this.suggestList = [];
          this.showSuggest = false;
          this.showSuggest2 = false;
        }
        if(this.showHistory || this.showHistory2){
          this.searchInput = item;
          this.showHistory = false;
          this.showHistory2 = false;
        }
        this.currentIndex = 0;
        this.linkSearch();
      },
      // 关闭搜索建议列表
      handleClose(){
        this.suggestList = [];
      },
      // 清除全部搜索历史
      handleClear(index){
        let searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
        searchHistory.splice(index,1);
        if(searchHistory.length > 0) {
          this.historyList = searchHistory;
          localStorage.setItem("searchHistory",JSON.stringify(searchHistory));
        } else {
          localStorage.removeItem("searchHistory");
          this.showHistory = false;
          this.historyList = [];
        }
      },
      handleClearAll(){
        localStorage.removeItem("searchHistory");
        this.showHistory = false;
        this.historyList = [];
      },
      closeLoginDialog() {
        this.isShowLogin = false;
      },
      closeVarifyDialog(){
        this.isShowVarify = false;
      },
      closeVarifyZj(){
        this.varifyZjVisible = false;
      },
      linkSearch() {
        if (this.searchInput == "") return; // 输入框空禁止搜索
        this.showSuggest = false;
        this.showSuggest2 = false;
        this.showHistory = false;
        this.showHistory2 = false;
        if (this.currentRoute.path === '/search') {  // 当前路由在搜索界面
          bus.$emit("searchEvent", this.searchInput);
        }
        // 搜索列表缓存
        let historyArr = [];
        let searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
        if(searchHistory) {
          historyArr = searchHistory;
        }
        if(historyArr.indexOf(this.searchInput) == -1) {
          historyArr.unshift(this.searchInput); // 将搜索关键字添加到头
        }
        let arr = [];
        if(historyArr.length > 10) {
          arr = historyArr.splice(0, 10);
        } else {
          arr = historyArr
        }
        localStorage.setItem("searchHistory",JSON.stringify(arr));

        if(this.currentRoute.path == '/productDetail' || this.currentRoute.path == '/search') {  // 当前路由在商品详情页或者搜索页 点搜索在当前页面打开 其他情况开新页面
          this.$router.push({
            path: '/search?value=' + this.searchInput
          })
        } else {
          this.$utils.openNewPage(this,"/search", {value:this.searchInput})
        }
      },
      // 点击logo图片跳转到首页
      linkHome(){
        console.log(this.currentRoute)
        console.log(this.currentRoute.name == 'homepage')
        if(this.currentRoute.name == 'homepage') {
          location.reload();
          // this.$router.go(0)
        } else{
          this.$router.push({
            path: '/homePage'
          })
        }
      },
      // 消息提示
      openNotify(msg){
        this.notifyInstance = this.$notify({
            title: '提示',
            position: 'bottom-right',
            type:"warning",
            duration: 0,
            dangerouslyUseHTMLString: true,
            message: msg,
            customClass: 'varify-notify',
            onClick: (evt) =>{
              this.closeNotify();
              this.$utils.openNewPage(this,"/centerPage/qualificationMng")
            }
          });
      },
      // 关闭消息提示
      closeNotify(){
        this.notifyInstance.close()
      },
    }
  }
</script>

<style lang="scss">
  .home_wrap {
    height: 100%;
    .search_wrap {
      width: 1135px;
      margin: 25px auto;
      img {
        vertical-align: middle;
        height: 53px;
        cursor: pointer;
      }
      .search_bg {
        position: relative;
        width: 606px;
        margin: 8px 70px 8px 100px;
        vertical-align: top;
        display: inline-block;
        .search_content {
          width: 606px;
          height: 44px;
          border: 2px solid #2F9FFE;
          border-radius: 20px;
          box-sizing: border-box;
          .search_input {
            width: 480px;
            .el-input__inner {
              border: initial;
              border-radius: 20px;
              padding: 0px 25px;
              box-sizing: border-box;
              border: none;
            }
          }
          .search_button {
            float: right;
            width: 104px;
            height: 42px;
            line-height: 42px;
            border-top-right-radius: 16px;
            border-bottom-right-radius: 16px;
            background-color: #2F9FFE;
            text-align: center;
            color: #fff;
            font-size: 16px;
            box-sizing: border-box;
            cursor: pointer;
          }
        }
        .popular_search {
          margin-top: 5px;
          label {
            color: #333;
          }
          span {
            color: #999999;
            margin-right: 5px;
            cursor: pointer;
          }
          span:nth-child(2n+1) {
            color: #2F9FFE;
          }
        }
      }
      .search-suggest{
        position: absolute;
        top: 50px;
        left: 10px;
        margin: 5px 0;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        border-radius: 4px;
        border: 1px solid #E4E7ED;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        background-color: #FFF;
        width: 480px;
        max-height: 378px;
        overflow-y: auto;
        z-index: 1000;
        .popper-arrow{
          position: absolute;
          display: block;
          width: 0;
          height: 0;
          border-color: transparent;
          border-style: solid;
          top: -6px;
          left: 35px;
          margin-right: 3px;
          border-top-width: 0;
          border-bottom-color: #EBEEF5;
           border-width: 6px;
          -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
          filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
          &:after{
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            content: " ";
            border-width: 6px;
          }
        }
        li{
          padding: 0 14px;
          margin: 0;
          line-height: 34px;
          cursor: pointer;
          color: #606266;
          font-size: 14px;
          list-style: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &:hover, &.active{
            background: #F5F5F5;
          }
        }
        .opr-btn{
          display: block;
          padding: 0 14px;
          height: 34px;
          line-height: 34px;
          font-size: 12px;
          color: #333;
          text-align: right;
          border-top: 1px solid #EEEEEE;
        }
      }
      .history-list{
        li {
          p{
            padding-right: 50px;
            font-size: 12px;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .history-label{
            font-size: 12px;
            color: #999;
          }
          .clear{
            display: none;
            font-size: 12px;
            color: #2F9FFE;
          }
          &:hover{
            .history-label{
              display: none;
              }
            .clear{
              display: block;
            }
          }
        }
      }
      .home_shopping_cart {
        height: 40px;
        line-height: 39px;
        padding: 0px 15px;
        display: inline-block;
        vertical-align: top;
        margin-top: 10px;
        box-shadow: 0px 0px 5px rgba(0, 135, 250, 0.2);
        box-sizing: border-box;
        color: #2F9FFE;
        cursor: pointer;
        i {
          vertical-align: middle;
        }
        span {
          margin-left: 3px;
          vertical-align: middle;
        }
      }
    }
    .search-wrap-fixed{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: 100%;
      z-index: 999;
      background: #fff;
      box-shadow:0px 5px 10px 0px rgba(0, 0, 0, 0.05);
      transform: translateY(-100%);
      transition: transform 0.1s ease-in;
      &.show{
        transform: translateY(0);
      }
      .search_wrap{
        position: relative;
        margin: 0 auto;
        .search_bg{
          margin: 16px 70px 16px 100px;
        }
        img{
          margin-top: 10px;
        }
        .search_wrap
        .home_shopping_cart{
          margin-top: 18px;
        }
      }
      .home_shopping_cart{
        margin-top:  18px;
      }
    }
    .el-container {
      overflow: hidden;
    }
    .home_left {
      width: 220px !important;
      text-align: center;
      background: #fff;
      border-right: 1px solid #DEDEDE;
      /*保证菜单超出不会出现滚动条的 火狐*/
      scrollbar-width: none;
      /*保证菜单超出不会出现滚动条的 谷歌*/
      &::-webkit-scrollbar {
        display: none;
      }
      .el-submenu__title, .single_menu_item {
        font-size: 16px;
      }
      .el-menu {
        border-right: initial;
      }
      .el-menu-item {
        font-size: 14px;

      }
      .el-menu-item:hover, .el-submenu__title:hover {
        background: #F1FFFC !important;
      }
      .el-submenu.is-active {
        .el-submenu__title {
          color: #00B78D !important;
          background: #F1FFFC !important;
          border-left: 3px solid #00b78d !important;
        }
      }
      .iconCls {
        position: absolute;
        left: 20%;
      }

    }
    .home_right {
      padding: 0px !important;
      overflow: hidden;
      .home_main {

        overflow-y: auto;
        overflow-x: hidden;
      }
      .el-dialog__wrapper::-webkit-scrollbar, .scrollbar::-webkit-scrollbar {
        width: 5px;
      }
      .el-dialog__wrapper::-webkit-scrollbar-track, .scrollbar::-webkit-scrollbar-track {
        background-color: #fff;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
      }
      .el-dialog__wrapper::-webkit-scrollbar-thumb, .scrollbar::-webkit-scrollbar-thumb {
        background-color: #ccc;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
      }
    }
  }
  .varify-notify{
    a{
      padding-left: 5px;
      color: #2F9FFE;
      cursor: pointer;
    }
  }
</style>
