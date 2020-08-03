<template>
  <div class="shop_cart">
      <div class="store">
        <p class="cql">陈情令商铺</p>
        <div class="goodsBox">
            <div class="itemBox">
                <div class="goodItem">
                    <label class="goodName">魏无羡</label>
                    <!-- <img src="./images/wwx1.jpg" class="good"/> -->
                    <label class="addButton" @click="flag=!flag">加入购物车</label>
                </div>
                <!-- 半场动画，包括js的三个钩子函数：before-enter、enter、after-enter -->
                <transition
                @before-enter="beforeEnter"
                @enter="enter"
                @after-enter="afterEnter">
                    <div v-show="flag" class="miniBall"></div>
                </transition>
            </div>

            <div class="itemBox">
                <div class="goodItem">
                    <label class="goodName">蓝忘机</label>
                    <!-- <img src="./images/lwj1.jpg" class="good"/> -->
                    <label class="addButton" @click="flag1=!flag1">加入购物车</label>
                </div>
                <transition
                @before-enter="beforeEnter"
                @enter="enter"
                @after-enter="afterEnter">
                    <div v-show="flag1" class="miniBall"></div>
                </transition>
            </div>

            <!-- 购物车 -->
            <label class="goodCar">
                    <Icon size="30" type="ios-cart-outline" ></Icon>
            </label>
        </div>
    </div>
  </div>
</template>
<script>
export default {
    name: 'myTransition',
    components: {

    },
    data() {
      return {
        flag:false,
        flag1:false,
      }
    },
    methods: {
     // el表示transition标签包围起来的那个DOM元素，是个原生的 JS DOM对象
      beforeEnter(el) {
          // 1.结束点
          el.style.transform = "translate(50px, 0)";
      },
      enter(el, done) {
          // 2.需要加上这句才会刷新，执行过渡期间的效果
          el.offsetWidth

          // 3.结束点
          if(this.flag) {
              // 向右移动260px，向下移动230px
              el.style.transform = "translate(260px, 230px)";
          }
          if(this.flag1) {
              el.style.transform = "translate(150px, 230px)";
          }
          el.style.transition = "all 2s ease";

          // 4.动画结束后，隐藏（done代表afterEnter函数）
          done()
      },
      afterEnter(el) {
          if(this.flag) {
              this.flag = !this.flag;
          }
          if(this.flag1) {
              this.flag1 = !this.flag1;
          }
      },
    }
}
</script>
<style scoped lang='scss'>
  .store{
            width: 300px;
            height: 500px;
            border: 1px solid #333;
            margin-left: 20px;
        }
        .cql{
            text-align: center;
            font-size:18px;
            margin: 10px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #333;
        }
        .goodsBox{
            height: 88%;
            position: relative;
            padding: 10px;
        }
        .itemBox{
            margin-right: 10px;
            display: inline-block;
        }
        .goodItem{
            width: 96px;
            display: inline-block;
        }
        .good{
            border: 1px solid #ddd;
            width: 94px;
            display: block;
            margin-bottom: 5px;
        }
        .goodName{
            font-weight: bold;
            display: block;
            text-align: center;
        }
        .addButton{
            border:1px solid silver;
            border-radius:4px;
            margin-left: 14px;
            padding: 2px 3px;
        }
        .addButton:hover{
            cursor: pointer;
            border:1px solid #666;
        }
        .miniBall{
            display: inline-block;
            position: absolute;
            width: 8px;
            height: 8px;
            background-color: red;
            border:1px solid red;
            border-radius: 50%;
        }
        .goodCar{
            display: inline-block;
            position: absolute;
            bottom: 0;
            right: 10px;
        }
        .ivu-btn-ghost {
            color: #3d3030;
            background: 0 0;
        }
</style>
