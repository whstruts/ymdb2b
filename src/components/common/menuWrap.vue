<template>
  <div class="menu-wrap flex-wrp">
    <div class="menu-left" >
      <div class="type-title">商品分类</div>
      <div class="type-wrap flex-item"  @mouseleave="typeLeave()">
        <div v-for="(item,index) in goodsType" :key="index" v-if="index<=7"
              @mouseenter="typeEnter(index,item)" class="goods_type_content "
              :class="{goods_type_content_active:typeCurrentIndex==index}" @click="linkSearch(item)">
          <span>{{item.name}}</span>
          <i class="el-icon-arrow-right arrow-right1"></i>
        </div>
        <div class="goods_type" v-show="typeCurrentIndex!=-1">
          <div class="goods_type_row flex-row" v-for="(data,position) in goodsTypeName"
                :key="position">
            <p class="goods_type_nav">
              <span class="goods_type_nav_wrap" style=" background: #2F9FFE;" @click="linkSearch(data)">{{data.name}}</span>
              <span class="arrow-right_wrap" style="background: #1488EB;"> <i
                class="el-icon-arrow-right arrow-right2"></i></span>
            </p>
            <p class=" flex-item goods_type_nav_name">
              <span v-for="(item,index) in data.chiledList"
                    :key="index" @click="linkSearch(item)">{{item.name}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="nav-bar flex-item">
      <span v-for="(item,index) in navigationBar" :key="index" @click="clickColumnName(item,index)">{{item.columnName}}</span>
    </div>
  </div>
</template>
<script>
import API from "../../api/api_homepage"
export default {
  name: 'menuWrap',
  data(){
    return{
      navigationBar: [],
      goodsType:[],
      goodsTypeName:[],
      typeCurrentIndex: -1,
    }
  },
  created(){
    this.getCurTemplate();
    this.goodsTypeForB2B();
  },
  methods:{
    // 点击菜单
    clickColumnName(item, index) {
      this.cloumnCurrentIndex = index;
      this.$utils.jumpPage(item, this)
    },
    // 获取当前模板
    getCurTemplate() {
      API.getCurTemplate().then(res => {
        if (res.code == 0) {
          if (!res.template) {
            return;
          }
          this.navigationBar = res.template.navigationBar;
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    goodsTypeForB2B() {
      API.goodsTypeForB2B().then(res => {
        if (res.code == 0) {
          this.goodsType = res.data;
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    typeEnter(index, item) {
      this.goodsTypeName = item.chiledList;
      this.typeCurrentIndex = index;
    },
    typeLeave() {
      this.typeCurrentIndex = -1;
    },
    // 点击一级分类跳转到搜索界面
    linkSearch(item){
      let typeCode = item.typeCode;
      this.$utils.openNewPage(this, "/search",{typeCode: typeCode})
    },
    linkHome(){
       this.$utils.openNewPage(this, "/homePage")
    }
  }
}
</script>
<style scoped lang="scss">
  .menu-wrap{
    margin: 0 auto;
    width: 1200px;
    .menu-left{
      position: relative;
      width: 232px;
      &:hover{
        .type-wrap{
          display: block;
        }
      }
      .type-title{
        width: 100%;
        height: 43px;
        line-height: 43px;
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        background: #2F9FFE;
        text-align: center;
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
        cursor: pointer;
      }
      .type-wrap{
        position:absolute;
        display: none;
        left: 0;
        top: 43px;
        width: 100%;
        height: 440px;
        font-size: 14px;
        background: #404B5A;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        z-index: 99;
        .goods_type_content {
          color: #fff;
          position: relative;
          line-height: 50px;
          height: 50px;
          padding-left: 22px;
          span {
            vertical-align: middle;
            margin-left: 10px;
            cursor: pointer;
          }
          .arrow-right1 {
            position: absolute;
            right: 22px;
            top: 50%;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
          }
        }
        .goods_type_content_active {
          background: #fff;
          span {
            color: #2F9FFE;
          }
        }
        .goods_type {
          position: absolute;
          top: 0px;
          left: 232px;
          bottom: 0px;
          width: 765px;
          background: #fff;
          border-top: 1px solid rgba(236, 236, 236, 1);
          padding: 0px 32px 20px;
          overflow: hidden;
          box-sizing: border-box;
          overflow-x: hidden;
          overflow-y: auto;
          /*保证菜单超出不会出现滚动条的 火狐*/
          scrollbar-width: none;
          /*保证菜单超出不会出现滚动条的 谷歌*/
          &::-webkit-scrollbar {
            display: none;
          }
          .more_goods_type {
            font-size: 0px;
            color: #fff;
            position: absolute;
            right: 30px;
            bottom: 30px;
            cursor: pointer;
          }
          .goods_type_row {
            border-bottom: 1px solid #EDEDED;
            padding: 8px 0px 12px;
            align-items: start;
            .goods_type_nav {
              font-size: 0px;
              padding-top: 5px;
              line-height: 20px;
              height: 20px;
              color: #fff;
              cursor: pointer;
            }
          }
          .goods_type_nav_wrap {
            display: inline-block;
            font-size: 12px;
            padding: 0px 5px;
            height: 100%;
            vertical-align: top;
          }
          .arrow-right_wrap {
            display: inline-block;
            vertical-align: top;
            padding: 0px 3px;

            height: 100%;
            .arrow-right2 {
              padding-top: 3px;
              font-size: 14px;
            }
          }
          .goods_type_nav_name {
            span {
              display: inline-block;
              font-size: 12px;
              color: #666666;
              margin-left: 16px;
              line-height: 30px;
              cursor: pointer;
              &:hover {
                color: #2F9FFE;
              }
            }
          }
        }
      }
    }
    .nav-bar{
      float: left;
      color: #333;
      font-size: 14px;
      font-weight: 600;
      line-height: 43px;
      span{
        margin-left: 45px;
        cursor: pointer;
        &:hover{
          color: #2F9FFE
        }
      }
    }
  }
</style>
