<template>
  <div class="topic-page">
    <menu-wrap></menu-wrap>
    <div  :style="{background: activityInfo.backgroundColor}" v-if="hadRequest && hadTopic">
      <div class="banner-img">
        <img :src="activityInfo.headImg"/>
      </div>
      <div class="w1200">
        <div class="commodity-list">
          <div class="commodity-item" v-for="(item,index) in dataList"
          :class="{'showCart': item.isShowCart}"
            @mouseover="handleMouseover(index,item)"
            @mouseleave="handleMouseleave(index,item)">
            <div class="img-box" @click="linkDetail(item)">
              <img :src="item.drugImg" :onerror="'javascript:this.src='+$utils.defaultBgImg()"/>
            </div>
            <div class="commodity-info" @click="linkDetail(item)">
              <p class="price">{{item.price}}</p>
              <p class="commodity-title text_overflow" :title="item.manufacturer"><span v-if="item.drugName">{{item.drugName}}&nbsp;</span>{{item.drugCommonName}}</p>
              <p class="commodity-manufacturers text_overflow">{{item.specifications || '规格'}}&nbsp;{{item.manufacturer ||'厂家'}}</p>
              <p title="" class="commodity-date text_overflow">效期：{{item.dateExpiration}}</p>
              <p title="" class="shop-name text_overflow">{{item.supplierName}}</p>
            </div>
            <div class="opr-info">
              <p class="size">中/大包装 ：{{item.mediumPackage}}/{{item.largePackage}} <span class="fr">{{item.isRetail==0?'不可拆零':item.isRetail==1?'可拆零':'无'}}</span></p>
              <div class="cart-num flex-wrp">
                <el-input-number class="reset-input-number flex-item" v-model="item.num" :min="item.isRetail==0?item.largePackage:item.isRetail==1?item.mediumPackage:1" :max="item.repertory" :step="item.isRetail==0?item.largePackage:item.isRetail==1?item.mediumPackage:1" size="mini"
                            step-strictly></el-input-number>
                <!-- commodityStatus  0正常 1 不可买-->
                <el-button type="primary" size="mini" class="btn-add-cart" :disabled="isLogin !=1 && isLogin != -1 || item.commodityStatus == 1" @click.stop="addCart(item)">加购物车</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="no-topic" v-if="hadRequest && !hadTopic">
      <img src="../../assets/img/icon_no_topic.png"/>
      <p>{{topicTips}}</p>
    </div>
    <show-login :loginDialogVisible="isShowLogin" :redictUrl="redictUrl" @closeEvent="closeLoginDialog"></show-login>
  </div>
</template>
<script>
import menuWrap from "../common/menuWrap"
import showLogin from '@/components/common/showLogin';
import API from "../../api/api_topic";
import api_product from "../../api/api_product";
import {bus} from "../../bus";

export default {
  name:'topic',
  data(){
    return{
      isLogin: -1,//  0待审核，1审核通过，2审核失败，9禁用
      specifyQuotation: '', // 1 单体价 2 连锁价 3 商业价
      dataList:[],
      isShowLogin: false,
      redictUrl: '',
      activityInfo:{},
      hadRequest: false, // 是否已请求
      topicTips:'',
      hadTopic: true  // 是否有专题信息
    }
  },
  components:{
    menuWrap,
    showLogin
  },
  created(){
    this.isLogin = this.$utils.verifyLogin();
    this.specifyQuotation = this.$utils.specifyQuotation();
    let activityId = this.$route.query.activityId;
    if(activityId) {
      this.funcUrlAdd('date',new Date().getTime());
      this.getActivityDetail(activityId)
    }
  },
  methods:{
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
      },
    // 获取专题页详情
    getActivityDetail(activityId){
      API.getActivityDetail({activityId: activityId}).then((res) => {
        this.hadRequest = true;
        if(res.code == 0) {
          this.hadTopic = true;
          this.activityInfo = res.data;
          let commodityData = JSON.parse(res.data.commodityData);
          if(commodityData) {
            for( let i  in commodityData ) {
                commodityData[i].num = 0;
                commodityData[i].largePackage = Number(commodityData[i].largePackage);
                commodityData[i].mediumPackage = Number(commodityData[i].mediumPackage);
                commodityData[i].repertory = Number(commodityData[i].repertory)
            }
            this.dataList = commodityData;
            document.title =  res.data.activityName;
          }
        } else {
          this.topicTips = res.msg;
          this.hadTopic = false;
        }
      })
    },
    handleMouseover(index,item){
      item.isShowCart = true;
      this.$set(this.dataList, index, item)
    },
    handleMouseleave(index,item){
       item.isShowCart = false;
      this.$set(this.dataList, index, item)
    },
    // 关闭是否登录弹框
    closeLoginDialog(){
      this.isShowLogin = false;
    },
    // 点击加入购物车
    addCart(item){
      if(this.isLogin == -1) {  // 未登录
        this.isShowLogin = true;
        let query = this.$route.query;
        let href = {
          path: '/homePage/topic',
          query: query
        };
        this.redictUrl = JSON.stringify(href)
        return;
      } else {
        if(item.num > 0) {
          api_product.addCart({commodityId: item.commodityId,commodityNumber: item.num}).then( (res) => {
            if(res.code == 0) {
              this.$message.success("已加入购物车")
              bus.$emit("addNum", res.commodityCount);
            } else {
              this.$message.error(res.msg);
            }
          })
        }
      }
    },
    // 点击跳转到商品详情
    linkDetail(item){
      this.$utils.openNewPage(this, "/productDetail", {commodityId: item.commodityId})
    }
  }
}
</script>
<style lang="scss">
  .topic-page{
    min-height: 600px;
    min-width: 1200px;
    .banner-img{
      img{
        width: 100%;
      }
    }
    .commodity-list{
      padding: 77px 0;
      min-height: 400px;
      overflow: hidden;
      .commodity-item{
        position: relative;
        float: left;
        padding: 20px;
        width:240px;
        height:338px;
        background:#fff;
        border:1px solid rgba(238,238,238,1);
        box-sizing: border-box;
        cursor: pointer;
        overflow: hidden;
        &.showCart{
          border-color: #000;
          .opr-info{
            display: block;
          }
        }
        .img-box{
          position: relative;
          padding: 0 25px;
          height: 166px;
          &:hover{
            img{
              transform: scale(1.1);
            }
          }
          img{
            width: 100%;
            transition: transform 0.1s ease-in;
          }
        }
        .price {
          font-size: 16px;
          color: #FF2424;
        }
        .commodity-title{
          font-size: 14px;
          color: #333333;
        }
        .commodity-manufacturers,.commodity-date{
          font-size: 12px;
          color: #999999;
        }
        .shop-name{
          font-size: 12px;
          color: #666666;
          text-decoration: underline;
        }
        .opr-info{
          display: none;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(0,0,0,.5);
          .size{
            padding: 0 15px;
            color: #fff;
          }
          .cart-num{
            height: 40px;
            line-height: 40px;
            background: #2F3844;
            .reset-input-number{
              margin: 0 15px;
              .el-input--mini .el-input__inner{
                line-height: 29px;
              }
            }
            .btn-add-cart{
              height: 40px;
              border-radius: 0;
              background: #2F9FFE;
            }
          }
        }
      }
    }
    .no-topic{
      padding: 190px 0;
      img{
        display: block;
        margin: 0 auto;
        font-size: 0;
      }
      p{
        padding-top: 15px;
        font-size: 14px;
        color: #999999;
        text-align: center;
      }
    }
  }
</style>
