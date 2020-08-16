<template>
  <div class="product-detail shop_cart bgf5">
    <div class="w1200 shop_cart">
      <p class="crumbs">
        <a v-for="item in form.typeList" @click="linkSearch(item)">{{item.name}}></a><a>{{form.drugCommonName}}</a>
      </p>
      <div class="prodcut-display bgfff flex-wrp">
        <div class="product-imgs">
          <!-- commodityStatus  0正常 1 无采购权限  2 库存不足/售罄 3  下架 4 控销-->
          <div class="product-img-big" v-if="hadRequest&& form.commodityStatus != 2 && form.commodityStatus != 3">
            <pic-zoom :url="bigImg" :scale="3"></pic-zoom>
          </div>
          <div class="product-img-big posRelative" v-if="hadRequest && form.commodityStatus == 2">
            <img :src="bigImg" :onerror="'javascript:this.src='+$utils.defaultBgImg()"/>
            <span class="sell-out">已售罄</span>
          </div>
          <div class="product-img-big posRelative" v-if="hadRequest && form.commodityStatus == 3">
            <img :src="bigImg" :onerror="'javascript:this.src='+$utils.defaultBgImg()"/>
            <span class="sell-out">已下架</span>
          </div>
          <div class="product-img-small">
            <swiper :options="swiperOption" ref="mySwiper">
              <swiper-slide v-for="(item, index) in form.imgArr" :key="index">
                <img class="bgImg" :src="item.url" :class="{'choosed': item.choosed}"
                     @mouseover="viewBigImg(item,index)" :onerror="'javascript:this.src='+$utils.defaultBgImg()"/>
              </swiper-slide>
              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
          </div>
        </div>
        <div class="flex-item product-content">
          <h2 class="p-name"><span class="tag" v-if="form.recipeType != '' && form.recipeType != null">{{form.recipeType }}</span>{{form.drugName?form.drugName+'&nbsp;&nbsp;':''}}{{form.drugCommonName}}
          </h2>
          <p class="p-size">{{form.specifications}}/{{form.manufacturer}}</p>
          <p class="p-company">{{form.supplierName}}</p>
          <!-- isLogin 0待审核，1审核通过，2审核失败，9禁用 -->
          <div class="price nosee" v-if="isLogin == -1">价格登录可见</div>
          <template v-else>
            <div class="price" v-if="form.commodityStatus != 1">
              <span class="rmb">￥</span><span class="num">{{form.price}}</span>/{{form.packageUnit}}
            </div>
            <div class="price nosee" v-if="form.commodityStatus == 1">无采购权限</div>
          </template>
          <div class="p-detail-list">
            <p v-if="isPurchaseManager()">
              <span class="font_pm" >限购</span>
              <span class="label-pm">该商品{{form.minNum}}{{form.packageUnit}}起购,
                限购{{form.maxNum}}{{form.packageUnit}},
                活动时间截止{{form.endDate}}</span>
            </p>
            <div class="item1">
              <p>
                <span class="label">建议零售价</span><span style="font-size: 12px"></span>
              </p>
              <p>
                <span class="label">产品批号</span>{{form.productionBatch}}
              </p>
              <p>
                <span class="label">有效期至</span>{{form.dateExpiration || '--'}}
              </p>
            </div>
            <div class="item2">
              <p>
                <span class="label">中/大包装</span>{{form.mediumPackage}}/{{form.largePackage}} <span class="size-tag">{{form.isRetail==0?'不可拆零':form.isRetail==1?'可拆零':'无'}}</span>
              </p>
              <p>
                <span class="label">批准文号</span>{{form.approveNumber}}
              </p>
              <p>
                <span class="label">生产日期</span>{{form.productionDate}}
              </p>
            </div>
          </div>
          <div class="opr">
            <el-input-number v-model="addNum"
                             :min="form.isRetail==0?form.largePackage:form.isRetail==1?form.mediumPackage:1"
                             :max="isPurchaseManager()?form.maxNum:form.repertory"
                             :step="form.isRetail==0?form.largePackage:form.isRetail==1?form.mediumPackage:1"
                             size="small" class="reset-input-number" step-strictly ></el-input-number>
            <span class="store">库存：{{form.repertory}}</span>
            <span class="label-pm" v-if="isPurchaseManager()&& this.addNum < this.form.minNum">数量低于限购下限：{{this.form.minNum}}</span>
            <span class="label-pm" v-if="isPurchaseManager()&& this.addNum > this.form.maxNum">数量高于限购上限：{{this.form.maxNum}}</span>
            <p>
              <transition name="drop"
                          @before-enter="beforeEnter"
                          @enter="enter"
                          @after-enter="afterEnter">
                <img class="add_img" v-if="addShow" :src="flayImg" alt="">
              </transition>
              <template v-if="isLogin == -1">
                <el-button type="primary" class="btn-add-cart" ref="cardBtn" @click="addCart">加入购物车</el-button>
              </template>
              <template v-else>
                <el-button type="primary" class="btn-add-cart" ref="cardBtn"
                           :disabled="isLogin !=1 && isLogin != -1 || form.commodityStatus != 0" @click="addCart">加入购物车
                </el-button>
              </template>
              <!-- <span class="col coled"><i class="iconfont icon-guanzhu"></i></span> -->
            </p>
          </div>
          <div class="cart" ref="cart" style="position:fixed;top:200px;right:0;width: 36px;height:106px"></div>
        </div>
      </div>

      <!-- 同商品其他效期推荐 -->
      <div class="bgfff intro-same-product" v-if="otherCommodityList && otherCommodityList.length > 0">
        <h2>同商品其他效期推荐<span class="fr">{{otherCommodityList.length}}个效期</span></h2>
        <swiper :options="swiperOption" ref="mySwiper2" class="other-swiper">
          <swiper-slide v-for="(item, index) in otherCommodityList" :key="index">
            <div class="item-content" :class="item.active? 'active':''" @click="handleChoose(item,index)">
              <p class="xq"><span>效期：{{item.dateExpiration}}</span></p>
              <div class="price nosee" v-if="isLogin == -1">价格登录可见</div>
              <template v-else>
                <p class="price-store" v-if="item.commodityStatus != 1"><i class="rmb">￥</i><span class="price">{{item.price}}</span>/
                  {{item.packageUnit}}<span class="store">库存：{{item.repertory}}</span></p>
                <div class="price nosee" v-if="item.commodityStatus == 1">无采购权限</div>
              </template>
              <div class="add-number">
                <div class="reset-input-number el-input-number el-input-number--small">
                    <span role="button" class="el-input-number__decrease" @click.stop="handleMinus(item,index)">
                      <i class="el-icon-minus"></i>
                    </span>
                  <span role="button" class="el-input-number__increase" @click.stop="handleAdd(item,index)">
                      <i class="el-icon-plus"></i>
                    </span>
                  <div class="el-input el-input--small">
                    <input type="text" autocomplete="off" class="el-input__inner" maxlength="9" v-model="item.commodityNumber" @blur="handleKeyBlur(item,index)"/>
                  </div>
                </div>
                <template v-if="isLogin == -1">
                  <el-button type="primary" class="btn-add-cart" ref="cardBtn" @click.stop="handleAddCart(item)">加购物车
                  </el-button>
                </template>
                <template v-else>
                  <el-button type="primary" class="btn-add-cart" ref="cardBtn"
                             :disabled="isLogin !=1 && isLogin != -1 || item.commodityStatus != 0"
                             @click="handleAddCart(item)">加购物车
                  </el-button>
                </template>
              </div>
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
      <!-- 为你推荐  商品信息 -->
      <div class="flex-wrp introce-detaill">
        <!-- <div class="introduce bgfff">
          <h2 class="s-title">为你推荐<span>换一换</span></h2>
          <div class="p-item">
            <div class="item-content">
              <div class="img-box">
                <img src="@/assets/img/product_big.jpg"/>
              </div>
              <p class="p-name">太福 四黄太福 四黄泻火片0.25</p>
              <p class="p-company">北京同仁堂制药有限公司 拷贝</p>
              <p class="p-month-sell">月销量：88</p>
            </div>
          </div>
          <div class="p-item">
            <div class="item-content">
              <div class="img-box">
                <img src="@/assets/img/product_big.jpg"/>
              </div>
              <p class="p-name">太福 四黄太福 四黄泻火片0.25</p>
              <p class="p-company">北京同仁堂制药有限公司 拷贝</p>
              <p class="p-month-sell">月销量：88</p>
            </div>
          </div>
          <div class="p-item">
            <div class="item-content">
              <div class="img-box">
                <img src="@/assets/img/product_big.jpg"/>
              </div>
              <p class="p-name">太福 四黄太福 四黄泻火片0.25</p>
              <p class="p-company">北京同仁堂制药有限公司 拷贝</p>
              <p class="p-month-sell">月销量：88</p>
            </div>
          </div>
        </div> -->
        <div class="flex-item  bgfff p-rich-detail" style="margin-left: 0">
          <div class="tab">
            <a href="javascrit:;" class="choosed">商品信息</a>
            <!-- <a href="javascrit:;">药检报告单</a> -->
          </div>
          <div class="product-info">
            <div class="info-box">
              <h2 class="title">商品参数</h2>
              <div class="product-cs">
                <div class="p-item p1">
                  <div class="flex-wrp">
                    <span>商品名称：</span>
                    <div class="flex-item">{{form.drugName}}</div>
                  </div>
                  <div class="flex-wrp">
                    <span>处方分类：</span>
                    <div class="flex-item">{{form.recipeType}}</div>
                  </div>
                  <div class="flex-wrp">
                    <span>规格：</span>
                    <div class="flex-item">{{form.specifications}}</div>
                  </div>
                  <div class="flex-wrp">
                    <span>剂型：</span>
                    <div class="flex-item">{{form.dosageForm}}</div>
                  </div>
                </div>
                <div class="p-item p2">
                  <div class="flex-wrp">
                    <span>生产厂家：</span>
                    <div class="flex-item">{{form.manufacturer}}</div>
                  </div>
                  <div class="flex-wrp">
                    <span>商品编码：</span>
                    <div class="flex-item">{{form.commodityCode}}</div>
                  </div>
                  <div class="flex-wrp">
                    <span>生产日期：</span>
                    <div class="flex-item">{{form.productionDate}}</div>
                  </div>
                </div>
                <div class="p-item p3">
                  <div class="flex-wrp">
                    <span>存储条件：</span>
                    <div class="flex-item">{{form.store}}</div>
                  </div>
                  <div class="flex-wrp">
                    <span>批准文号：</span>
                    <div class="flex-item">{{form.approveNumber }}</div>
                  </div>
                  <div class="flex-wrp">
                    <span>有效期至：</span>
                    <div class="flex-item">{{form.dateExpiration}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="info-box">
              <h2 class="title">商品说明书</h2>
              <div class="product-desc">
                <div class="table table2">
                  <div class="cell">
                    <div class="cell-txt flex-wrp">
                      <span>【商品名称】</span>
                      <div class="flex-item" :title="form.drugName">{{form.drugName || '　'}}</div>
                    </div>
                    <div class="cell-txt flex-wrp">
                      <span>【厂家】</span>
                      <div class="flex-item" :title="form.manufacturer">{{form.manufacturer || '　'}}</div>
                    </div>
                    <div class="cell-txt flex-wrp">
                      <span>【规格】</span>
                      <div class="flex-item">{{form.specifications || '　'}}</div>
                    </div>
                    <div class="cell-txt flex-wrp">
                      <span>【剂型】</span>
                      <div class="flex-item" :title="form.dosageForm">{{form.dosageForm || '　'}}</div>
                    </div>
                    <div class="cell-txt flex-wrp">
                      <span>【包装单位】</span>
                      <div class="flex-item" :title="form.packageUnit">{{form.packageUnit || '　' }}</div>
                    </div>
                    <div class="cell-txt flex-wrp">
                      <span>【处方分类】</span>
                      <div class="flex-item" :title="form.recipeType">{{form.recipeType || '　' }}</div>
                    </div>
                  </div>

                  <div class="cell">
                    <div class="cell-txt flex-wrp">
                      <span>【通用名】</span>
                      <div class="flex-item" :title="form.drugCommonName">{{form.drugCommonName || '　' }}</div>
                    </div>
                    <div class="cell-txt flex-wrp">
                      <span>【有效期】</span>
                      <div class="flex-item" :title="form.approveEndTime">{{form.approveEndTime || '　'}}</div>
                    </div>
                    <div class="cell-txt flex-wrp">
                      <span>【批准文号】</span>
                      <div class="flex-item" :title="form.approveNumber">{{form.approveNumber || '　'}}</div>
                    </div>
                    <div class="cell-txt flex-wrp">
                      <span>【商品条码】</span>
                      <div class="flex-item" :title="form.barCode">{{form.barCode || '　' }}</div>
                    </div>
                    <div class="cell-txt flex-wrp">
                      <span>【英文名】</span>
                      <div class="flex-item" :title="form.drugEnName">{{form.drugEnName || '　'}}</div>
                    </div>
                    <div class="cell-txt flex-wrp">
                      <span>【贮藏】</span>
                      <div class="flex-item" :title="form.store">{{form.store || '　'}}</div>
                    </div>
                  </div>
                </div>

                <div class="table table1">
                  <div class="cell">
                    <div class="cell-txt flex-wrp">
                      <span>【功能主治】</span>
                      <div class="flex-item">{{form.majorFunctions || '　'}}</div>
                    </div>
                    <div class="cell-txt flex-wrp">
                      <span>【用法用量】</span>
                      <div class="flex-item">{{form.usageDosage || '　'}}</div>
                    </div>
                    <div class="cell-txt flex-wrp">
                      <span>【注意事项】</span>
                      <div class="flex-item">{{form.warnings || '　'}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <show-login :loginDialogVisible="isShowLogin" :redictUrl="redictUrl" @closeEvent="closeLoginDialog"></show-login>
  </div>
</template>
<script>
  import PicZoom from 'vue-piczoom'
  import {bus} from '../../bus.js'
  import API from "../../api/api_product";
  import showLogin from '@/components/common/showLogin';
  import $ from 'jquery'

  window.$ = $
  window.jQuery = $
  import fly from '../../assets/js/jquery.fly.min';

  export default {
    name: 'productDetail',
    data() {
      return {
        form: {},
        hadRequest: false,
        loading: false,
        otherCommodityList: [], //同商品其他效期推荐
        isShowLogin: false,
        redictUrl: '',
        bigImg: '', // 大图
        addShow: false, // 是否显示加入购物车动画
        swiperOption: {
          slidesPerView: 5,
          spaceBetween: 10,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },
        configs: {
          width: 372,
          height: 448,
          maskWidth: 120,
          maskHeight: 120,
          maskColor: '#000',
          maskOpacity: 0.2
        },
        addNum: null,
        flayImg: null, // 加入购物车效果中的飞跃的小球图片
        isLogin: -1,//  0待审核，1审核通过，2审核失败，9禁用
      }
    },
    components: {
      showLogin,
      PicZoom
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    created() {
      this.isLogin = this.$utils.verifyLogin();
    },
    mounted() {
      let commodityId = this.$route.query.commodityId;
      if (commodityId) {
        this.getProductInfo(commodityId)
        this.getOtherCommodity(commodityId)
      }
    },
    methods: {
      isPurchaseManagerI(item){
        return item.startDate != '' && item.startDate != null
          && Date.parse(item.startDate) < new Date()
          && Date.parse(item.endDate) > new Date()
      },
      getProductInfo(commodityId) {
        this.loading = true;
        API.productInfo({commodityId: commodityId}).then((res) => {
          if (res.code == 0) {
            let data = JSON.parse(JSON.stringify(res.data));
            if (data && data.imgArr.length > 0) {
              for (var i = 0; i < data.imgArr.length; i++) {
                data.imgArr[i] = {
                  url: data.imgArr[i],
                  choosed: false
                };
              }
              data.imgArr[0].choosed = true;
              this.flayImg = res.data.imgArr[0].url;

            } else {
              data.imgArr = [
                {
                  url: this.$utils.defaultBgImg2(),
                  choosed: true
                }
              ];
              this.flayImg = data.imgArr[0].url;
              // this.bigImg = data.imgArr[0].url;
            }
            setTimeout(() => {
              this.bigImg = this.$utils.verifyImagePath(data.imgArr[0].url);
            }, 100)

            if (data.isRetail == 0) {
              this.addNum = data.largePackage;
            } else {
              this.addNum = data.mediumPackage;
            }
            this.form = data;
            this.loading = false;
            this.hadRequest = true;
          } else {
            this.loading = false;
            this.$message.error(res.msg)
          }
        }).catch(() => {
          this.loading = false;
        })
      },
      // 同商品其他效期推荐
      getOtherCommodity(commodityId) {
        API.otherCommodity({commodityId: commodityId}).then((res) => {
          if (res.code == 0) {
            let data = res.data;
            if (data) {
              for (let i = 0; i < data.length; i++) {
                if (data[i].isRetail == 0) {
                  data[i].commodityNumber = data[i].largePackage;
                } else {
                  data[i].commodityNumber = data[i].mediumPackage;
                }
              }
              data[0].active = true;
            }
            this.otherCommodityList = data;
          }
        })
      },
      // 点击同效期
      handleChoose(item,index){
        let list =  this.otherCommodityList;
        if(list[index].active) return;
        for(let i in list) {
          list[i].active =false;
        }
        list[index].active = true;
        this.$nextTick( () => {
          this.otherCommodityList = list;
        })
        this.getProductInfo(item.commodityId);
      },
      // 点击面包屑
      linkSearch(item) {
        let typeCode = item.typeCode;
        this.$router.push({
          path: '/search?typeCode=' + typeCode
        })
      },
      // 点击加入购物车 先判断是否登录
      addCart(event) {
        if (this.isLogin == -1) {  // 未登录
          this.isShowLogin = true;
          let query = this.$route.query;
          let href = {
            path: '/productDetail',
            query: query
          };
          this.redictUrl = JSON.stringify(href)
          return;
        }
        if (this.addNum > 0) {
          API.addCart({commodityId: this.form.commodityId, commodityNumber: this.addNum}).then((res) => {
            if (res.code == 0) {
              var offset = $(".abs-bar").offset();
              var img = $('.bgImg').attr('src'); //获取当前点击图片链接
              let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
              var flyer = $('<img class="flyer-img" src="' + img + '">'); //抛物体对象
              flyer.fly({
                start: {
                  left: event.pageX,//抛物体起点横坐标
                  top: event.pageY - scrollTop - 40 //抛物体起点纵坐标
                },
                end: {
                  left: offset.left,//抛物体终点横坐标
                  top: 200, //抛物体终点纵坐标
                },
                onEnd: function () {
                  flyer.show().animate({width: '40px', height: '40px', opacity: 0}, 300).fadeOut(300);////成功加入购物车动画效果
                  flyer.destroy; //销毁抛物体
                }
              });
              // this.$message.success("已加入购物车")
              bus.$emit("addNum", res.commodityCount);
            } else {
              this.$message.error(res.msg)
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
      handleAddCart(item) {
        if (this.isLogin == -1) {  // 未登录
          this.isShowLogin = true;
          let query = this.$route.query;
          let href = {
            path: '/productDetail',
            query: query
          };
          this.redictUrl = JSON.stringify(href)
          return;
        }
        if (item.commodityNumber > 0) {
          API.addCart({commodityId: item.commodityId, commodityNumber: item.commodityNumber}).then((res) => {
            if (res.code == 0) {
              this.$message.success("已加入购物车")
              bus.$emit("addNum", res.commodityCount);
            } else {
              this.$message.error(res.msg)
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
      handleMinus(item, index) {
        if (item.isRetail == 0) {
          if (this.otherCommodityList[index].commodityNumber <= item.largePackage) {
            return;
          }
          this.otherCommodityList[index].commodityNumber -= item.largePackage;
        } else {
          if (this.otherCommodityList[index].commodityNumber <= item.mediumPackage) {
            return;
          }
          this.otherCommodityList[index].commodityNumber -= item.mediumPackage;
        }
      },
      handleAdd(item, index) {
        // 判断是否大于最大库存
        if (this.otherCommodityList[index].commodityNumber >= this.otherCommodityList[index].repertory) {
          this.$message.warning("不能超过库存数量");
          return;
        }
        if (item.isRetail == 0) {
          this.otherCommodityList[index].commodityNumber += item.largePackage;
        } else {
          this.otherCommodityList[index].commodityNumber += item.mediumPackage;
        }

      },
      // 验证input输入的值
      handleKeyBlur(item, index) {
        let reg = /\D|^0/g;  // 只允许输入数字
        this.otherCommodityList[index].commodityNumber = item.commodityNumber.toString().replace(reg, '');
        if (item.isRetail == 0) {   // 不可拆零
          if(item.commodityNumber < item.largePackage) {  // 数量少于大包装时候 取大包装数量
            item.commodityNumber = item.largePackage
            console.log(item.commodityNumber)
          } else {    // 四舍五入取值
            item.commodityNumber = Math.round(item.commodityNumber/item.largePackage)*item.largePackage;
          }
        } else { // 可拆零
          if(item.commodityNumber < item.mediumPackage) { // 数量少于大包装时候 取中包装数量
            item.commodityNumber = item.mediumPackage
          } else {
            item.commodityNumber = Math.round(item.commodityNumber/item.mediumPackage)*item.mediumPackage;
          }
        }

        if (item.commodityNumber > item.repertory) {
          this.otherCommodityList[index].commodityNumber = item.repertory
        }
      },
      // 关闭是否登录弹框
      closeLoginDialog() {
        this.isShowLogin = false;
      },
      // 点击小图查看大图
      viewBigImg(item, idx) {
        this.bigImg = this.$utils.verifyImagePath(item.url);
        // this.bigImg = item.url;
        for (let i in this.form.imgArr) {
          this.form.imgArr[i].choosed = false;
        }
        this.form.imgArr[idx].choosed = true;
      },
      beforeEnter(el) {
        let cardBtn = this.$refs.cardBtn;
        let x = cardBtn.offsetLeft;
        let y = cardBtn.offsetTop;
        console.log(x)
        el.style.webkitTransform = `translate3d(0, 0, 0px)`;
        el.style.transform = `translate3d(0, 0, 0px)`;
      },
      enter(el) {
        let cart = this.$refs.cart;
        let x = cart.offsetLeft;
        let y = -(600 - cart.offsetTop) - 140;
        console.log(y)
        this.$nextTick(() => {
          el.style.webkitTransform = `translate3d(${x}px, ${y}px, 0)`; //接着将小球位置置为初始值，但css中设置了transition .8s,因此，动画效果就出来了
          el.style.transform = `translate3d(${x}px,${y}px, 0)`;
        });
      },
      afterEnter(el) {
        this.addShow = false;
      },
      isPurchaseManager(){
        return this.form.startDate != '' && this.form.startDate != null
          && Date.parse(this.form.startDate) < new Date()
          && Date.parse(this.form.endDate) > new Date()
      },
    }
  }
</script>
<style lang="scss" scoped>
  .product-detail {
    padding-bottom: 40px;
    .crumbs {
      padding: 10px 0;
      font-size: 14px;
      color: #666666;
      a {
        cursor: pointer;
      }
    }
    .prodcut-display {
      padding: 20px 24px 28px 20px;
      align-items: flex-start;
      .product-imgs {
        width: 372px;
        height: 372px;
        border: 1px solid #EEEEEE;
        // box-sizing: border-box;
        .product-img-big {
          height: 372px;
          &.posRelative {
            position: relative;
          }
          .sell-out {
            width: 120px;
            height: 120px;
            line-height: 120px;
            font-size: 14px;
          }
        }
        img {
          width: 100%;
        }
      }
      .product-img-small {
        padding: 10px 0;
        img {
          width: 67px;
          height: 67px;
          border: 1px solid #EEEEEE;
          box-sizing: border-box;
          cursor: pointer;
          &.choosed {
            border-color: #2F9FFE;
          }
        }
      }
    }
    .swiper-button-prev, .swiper-button-next {
      width: 21px;
      height: 43px;
      background-color: rgba(0, 0, 0, 0.4);
      background-position: center;
      background-repeat: no-repeat;
      background-size: 7px 12px;
    }
    .swiper-button-prev {
      left: 0;
      background-image: url(~@/assets/img/icon_arrow_left.png);
    }
    .swiper-button-next {
      right: 0;
      background-image: url(~@/assets/img/icon_arrow_right.png);
    }
    .product-content {
      padding-left: 24px;
      .p-name {
        font-size: 20px;
        font-weight: bold;
        color: #333333;
        .tag {
          margin-right: 7px;
          padding: 0 5px;
          font-size: 12px;
          color: #FF5B5B;
          border: 1px solid #FF5B5B;
          border-radius: 9px;
          vertical-align: middle;
        }
      }
      .p-size, .p-company {
        font-size: 14px;
        color: #666666;
      }
      .price {
        margin: 15px 0;
        padding: 16px;
        font-size: 18px;
        font-weight: bold;
        background: #F4F4F4;
        .rmb {
          color: #E50000;
        }
        .num {
          font-size: 26px;
          color: #E50000;
        }
      }
      .nosee {
        font-size: 16px;
        color: #FF2424;
        font-weight: normal;
      }
      .p-detail-list {
        padding-bottom: 20px;
        overflow: hidden;
        border-bottom: 1px solid #DEDEDE;
        .item1, .item2 {
          padding: 0 10px;
          float: left;
          font-size: 14px;
          color: #333333;
          overflow: hidden;
          white-space: nowrap;
          text-emphasis: ellipsis;
          box-sizing: border-box;
          .label {
            display: inline-block;
            width: 90px;
            text-align: left;
            color: #999999;
          }
          .size-tag {
            margin-left: 10px;
            padding: 1px 8px;
            color: #FFA531;
            background: #FFF5DF;
            border-radius: 9px;
          }
        }
        .item1 {
          width: 50%;
        }
        .item2 {
          width: 50%;
        }
      }
      .opr {
        padding: 45px 0 50px;
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
        .store {
          padding-left: 24px;
          font-size: 14px;
          color: #333;
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
          &.is-disabled {
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
    .intro-same-product {
      margin-top: 20px;
      .nosee {
        font-size: 16px;
        color: #FF2424;
        font-weight: normal;
        text-align: center;
      }
      h2 {
        padding: 5px 20px;
        font-size: 14px;
        color: #333;
        font-weight: bold;
        border-bottom: 1px solid #EEEEEE;
        span{
          font-weight: normal;
        }
      }
    }
    .introce-detaill {
      margin-top: 20px;
      align-items: flex-start;
    }
    .introduce {
      width: 234px;
      box-sizing: border-box;
      .s-title {
        padding: 5px 20px;
        font-size: 14px;
        color: #333333;
        border-bottom: 1px solid #EEEEEE;
        span {
          float: right;
          font-size: 12px;
          color: #2F9FFE;
          vertical-align: middle;
        }
      }
      .p-item {
        padding: 0 33px;
        .item-content {
          padding: 25px 0;
          border-bottom: 1px solid #EEEEEE;
        }
        .img-box {
          margin: 0 auto;
          width: 140px;
          img {
            width: 100%;
          }
        }
        p {
          font-size: 12px;
          color: #666666;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &.p-name {
            font-size: 14px;
            color: #333;
          }
        }
      }
    }
    .p-rich-detail {
      margin-left: 20px;
      .tab {
        a {
          position: relative;
          padding: 15px 24px;
          font-size: 14px;
          color: #666;
          text-decoration: none;
          &.choosed {
            color: #2F9FFE;
            // border-top: 2px solid #2F9FFE;
          }
          &:after {
            position: absolute;
            content: "";
            right: 0;
            width: 1px;
            height: 30px;
            background: #f5f5f5;
          }
          &:last-child {
            &:after {
              display: none;
            }
          }
        }
      }
      .product-info {
        padding: 0 24px;
        // width: 946px;
        width: 100%;
        box-sizing: border-box;
        .info-box {
          padding: 35px 0 0 0;
        }
        .title {
          position: relative;
          padding-left: 8px;
          font-size: 14px;
          color: #666;
          &:before {
            position: absolute;
            content: "";
            left: -5px;
            top: 50%;
            margin-top: -7px;
            width: 4px;
            height: 15px;
            background: #2F9FFE;
          }
        }
        .product-cs {
          padding: 8px;
          overflow: hidden;
          .p-item {
            padding-right: 30px;
            float: left;
            box-sizing: border-box;
            font-size: 12px;
            color: #666;
            &.p1 {
              width: 25%;
            }
            &.p2 {
              width: 40%;
            }
            &.p3 {
              width: 35%;
            }
            .flex-wrp {
              align-items: flex-start;
            }
          }
        }
      }
      .product-desc {
        margin: 25px auto 120px;
        border: 1px solid #EEEEEE;
        .table {
          font-size: 12px;
          color: #666;
          overflow: hidden;
        }
        .table2 {
          .cell {
            float: left;
            width: 50%;
          }
          .flex-item {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .cell-txt {
          position: relative;
          border-bottom: 1px solid #EEEEEE;
          background: #F8F8F8;
          span {
            display: block;
            padding: 0 10px 0 40px;
            height: 100%;
            width: 159px;
            text-align: left;
            box-sizing: border-box;
          }
          .flex-item {
            padding: 10px 25px;
            background: #ffffff;
          }
        }
        .table1 {
          .cell-txt {
            &:last-child {
              border-bottom: none;
            }
          }
        }
      }
    }

  }

  .add_img {
    width: 50px;
    height: 50px;
    position: fixed;
    left: 460px;
    top: 600px;
    border-radius: 50%;
    border: 1px solid #eeeeee;
    z-index: 1001;
    &.drop-enter-active {
      transition: 2s cubic-bezier(.22, .85, .59, 1.08)
    }
  }

  .other-swiper {
    padding: 17px 22px;
    .item-content {
      padding: 13px;
      border: 1px solid #F5F5F5;
      border-radius: 10px;
      cursor: pointer;
      &.active{
        border-color: #2F9FFE;
      }
      p {
        text-align: center;
      }
      .xq {
        span {
          padding: 5px 10px;
          font-size: 14px;
          color: #333;
          background: #F4F4F4;
        }
      }
      .price-store {
        padding: 5px 0;
        i {
          font-size: 12px;
          font-style: normal;
          color: #E50000
        }
        .price {
          font-size: 16px;
          color: #E50000;
        }
        .store {
          padding-left: 16px;
          font-size: 12px;
          color: #666666;
        }
      }
    }
    .el-input-number--small {
      width: 119px;
    }
    .btn-add-cart {
      padding: 7px;
      border-radius: 0;
    }
  }
</style>

<style>
  .flyer-img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    z-index: 1001;
  }

  .el-tooltip__popper {
    width: 270px;
  }
  .font_pm{
    margin-left: 10px;
    color: #FF0000;
    border:1px solid #FF0000;
    padding: 2px;
    border-radius: 3px;
  }
  .label-pm {
    margin-left: 10px;
    text-align: left;
    color: #FF0000;
  }
</style>
