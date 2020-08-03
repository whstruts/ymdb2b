<template>
  <div class="out_fo_stock_list">
    <p class="out_fo_stock_title">
      <i class="iconfont icon-tishi"></i>
      <span>下手慢了，以下商品部分被抢空</span>
      <br/> <span style="color: #999;font-size: 14px;line-height: 12px">商品可能已作下架处理</span>
    </p>

    <div class="content_list">
      <el-row class="content_list_rows" v-for="(item,index) in list" :key="index">
        <el-col :span="5">
          <div class="list_column">
            <!--<div class="img-box" :style="{backgroundImage: 'url('+ item.frontView +')'}"></div>-->
            <div class="img-box">
              <img :src="item.drugImg"
                   :onerror="'javascript:this.src='+$utils.defaultBgImg()" class="commodity_img"/>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
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
        <el-col :span="5">
          <div class="list_column">
            <p class="total_price">
              {{item.commodityStatus==1?'暂无购买权限':item.commodityStatus==2?'库存不足':item.commodityStatus==3?'商品已下架':item.commodityStatus==4?'控销，无法购买':item.commodityStatus==5?'添加失败':'无'}}</p>
          </div>
        </el-col>
        <!--    <el-col :span="4">
              <div class="list_column">
                <p class="total_price">
                  ￥{{item.countPrice=(item.price*item.commodityNumber).toFixed(2)}}</p>
              </div>
            </el-col>-->

      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: "outOfStockList",
    props: {
      list: {
        type: Array,
        default() {
          return {}
        }
      }
    },
    data() {
      return {}
    },
    created() {
      console.log(this.list)
    }
  }
</script>

<style scoped lang="scss">
  .out_fo_stock_list {
    .out_fo_stock_title {
      text-align: center;
      margin: 8px 0px 30px;
      line-height: 32px;
      i {
        color: #FE8A00;
        font-size: 32px;
        vertical-align: middle;
        margin-right: 11px;
      }
      span {
        color: #333333;
        font-size: 16px;
        vertical-align: middle;
      }
    }

    .content_list {
      background: #F8F8F8;
      height: 396px;
      overflow-x: hidden;
      overflow-y: auto;
      margin-bottom: 14px;
      border-top: 1px solid #EAEAEA;
      .content_list_rows {
        border: 1px solid #EAEAEA;
        border-top: initial;
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
            border: 1px solid #999999;
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
            color: #FFA70D;
            border: 1px solid #FFA70D;
          }
        }
      }
    }
  }
</style>
