import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  },
  routes: [
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/components/login'], resolve),
      meta: {
        title: '登录',
      }
    },
    {
      path: '/regHome',
      name: 'regHome',
      component: resolve => require(['@/components/regStep/regHome'], resolve),
      meta: {
        title: '注册',
      },
      children: [
        {
          path: 'regStep',
          name: "regStep",
          component: resolve => require(['@/components/regStep/regStep'], resolve),
          meta: {
            title: '注册'
          }
        },
        {
          path: 'regStepSuc',
          name: "regStepSuc",
          component: resolve => require(['@/components/regStep/regStepSuc'], resolve),
          meta: {
            title: '注册'
          }
        },
        {
          path: 'findPwd',
          name: "findPwd",
          component: resolve => require(['@/components/regStep/findPwd'], resolve),
          meta: {
            title: '找回密码'
          }
        },
        {
          path: 'setPwd',
          name: "setPwd",
          component: resolve => require(['@/components/regStep/setPwd'], resolve),
          meta: {
            title: '找回密码'
          }
        },
        {
          path: 'setPwdSuc',
          name: "setPwdSuc",
          component: resolve => require(['@/components/regStep/setPwdSuc'], resolve),
          meta: {
            title: '找回密码成功'
          }
        }
      ]
    },

    {
      path: '/',
      name: 'home',
      component: resolve => require(['@/components/home'], resolve),
      redirect: '/homePage',
      meta: {
        title: '首页',

      },
      children: [
        //商城首页
        {
          path: '/homepage',
          name: "homepage",
          component: resolve => require(['@/components/mall/homepage'], resolve),
          meta: {
            title: '商城首页',
            search: true,//是否显示搜索框 ，，true显示，false不显示
          }
        },
        {
          path: '/search',
          name: "search",
          component: resolve => require(['@/components/search/search'], resolve),
          meta: {
            title: '搜索结果页',
            search: true
          }
        },
        {
          path: '/searchList',
          name: "searchList",
          component: resolve => require(['@/components/search/searchList'], resolve),
          meta: {
            title: '列表',
            search: true
          }
        },
        {
          path: '/productDetail',
          name: "productDetail",
          component: resolve => require(['@/components/productDetail/productDetail'], resolve),
          meta: {
            title: '商品详情页',
            search: true
          }
        },
        {
          path: '/demo',
          name: "demo",
          component: resolve => require(['@/components/productDetail/demo'], resolve),
          meta: {
            title: '商品详情页',
            search: true
          }
        },
        {
          path: '/shoppingCart',
          name: "shoppingCart",
          component: resolve => require(['@/components/shoppingCart/shoppingCart'], resolve),
          meta: {
            title: '购物车',
            search: false
          }
        },
        {
          path: '/confirmOrder',
          name: "confirmOrder",
          component: resolve => require(['@/components/order/confirmOrder'], resolve),
          meta: {
            title: '确认订单',
            search: false
          }
        },
        {
          path: '/submitOrder',
          name: "submitOrder",
          component: resolve => require(['@/components/order/submitOrder'], resolve),
          meta: {
            title: '提交订单',
            search: false
          }
        },
        {
          path: '/paymentOrder',
          name: "paymentOrder",
          component: resolve => require(['@/components/order/paymentOrder'], resolve),
          meta: {
            title: '支付方式',
            search: false
          }
        },
        {
          path: '/drugnews/newslist',
          name: 'drugnews',
          component: resolve => require(['@/components/drugnews/newslist'], resolve),
          meta: {
            title: '药头条',
            search: true
          },
        },
        {
          path: '/drugnews/newsdetails',
          name: 'drugnews',
          component: resolve => require(['@/components/drugnews/newsdetails'], resolve),
          meta: {
            title: '药头条',
            search: true
          },
        },
        // 专题页
        {
          path: '/homePage/topic',
          name: "topic",
          component: resolve => require(['@/components/topic/topic'], resolve),
          meta: {
            title: '专题页',
            search: true
          }
        },
      ]
    },
    {
      path: '/centerPage',
      name: 'centerPage',
      component: resolve => require(['@/components/userCenter/centerPage'], resolve),
      meta: {
        title: '个人中心',
      },
      children: [
        {
          path: 'mine',
          name: "mine",
          component: resolve => require(['@/components/userCenter/mine'], resolve),
          meta: {
            title: '我的',
            search: true
          }
        },
        {
          path: 'myOrder',
          name: "myOrder",
          component: resolve => require(['@/components/userCenter/orderCenter/myOrder'], resolve),
          meta: {
            title: '我的订单',
            search: true
          }
        },
        {
          path: 'orderDetails',
          name: "orderDetails",
          component: resolve => require(['@/components/userCenter/orderCenter/orderDetails'], resolve),
          meta: {
            title: '订单详情',
            search: false
          }
        },
        {
          path: 'qualificationMng',
          name: "qualificationMng",
          component: resolve => require(['@/components/userCenter/mine/qualificationMng'], resolve),
          meta: {
            title: '资质管理',
            search: true
          }
        },
        {
          path: 'resetPwd',
          name: "resetPwd",
          component: resolve => require(['@/components/userCenter/mine/resetPwd'], resolve),
          meta: {
            title: '账号管理',
            search: true
          }
        },
        {
          path: 'balance',
          name: "balance",
          component: resolve => require(['@/components/userCenter/mine/balance'], resolve),
          meta: {
            title: '我的余额',
            search: true
          }
        },
        {
          path: 'invoice',
          name: "invoice",
          component: resolve => require(['@/components/userCenter/mine/invoice'], resolve),
          meta: {
            title: '发票管理',
            search: true
          }
        },
        {
          path: 'purchaseHistory',
          name: "purchaseHistory",
          component: resolve => require(['@/components/userCenter/orderCenter/purchaseHistory'], resolve),
          meta: {
            title: '历史采购',
            search: true
          }
        },
      ]
    },
    {
      path: '/help/helpcenter',
      name: 'helpcenter',
      component: resolve => require(['@/components/help/helpcenter'], resolve),
      meta: {
        title: '帮助中心',
        search: true
      },
      children: [
        {
          path: '/helpcenter/company',
          name: "company",
          component: resolve => require(['@/components/help/about/company'], resolve),
          meta: {
            title: '帮助中心',
            search: true
          }
        },
        {
          path: '/helpcenter/contact',
          name: "contact",
          component: resolve => require(['@/components/help/about/contact'], resolve),
          meta: {
            title: '帮助中心',
            search: true
          }
        },
        {
          path: '/helpcenter/explain',
          name: "explain",
          component: resolve => require(['@/components/help/about/explain'], resolve),
          meta: {
            title: '帮助中心',
            search: true
          }
        },
        {
          path: '/helpcenter/accounts',
          name: "accounts",
          component: resolve => require(['@/components/help/about/accounts'], resolve),
          meta: {
            title: '帮助中心',
            search: true
          }
        },
        {
          path: '/helpcenter/wlinstructions',
          name: "wlinstructions",
          component: resolve => require(['@/components/help/about/wlinstructions'], resolve),
          meta: {
            title: '帮助中心',
            search: true
          }
        },
        {
          path: '/helpcenter/shInstructions',
          name: "shInstructions",
          component: resolve => require(['@/components/help/about/shInstructions'], resolve),
          meta: {
            title: '帮助中心',
            search: true
          }
        },
        {
          path: '/helpcenter/pcoperation',
          name: "pcoperation",
          component: resolve => require(['@/components/help/about/pcoperation'], resolve),
          meta: {
            title: '帮助中心',
            search: true
          }
        },
        {
          path: '/helpcenter/appoperation',
          name: "appoperation",
          component: resolve => require(['@/components/help/about/appoperation'], resolve),
          meta: {
            title: '帮助中心',
            search: true
          }
        },
      ]
    },
  ]
})
