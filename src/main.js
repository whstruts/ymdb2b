// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import 'es6-promise/auto'
import ElementUI, {Message} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/style/index.scss';
import "./assets/fonts/iconfont.css"

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import Util from "./utils/index"
import "./utils/plugins"
import clipboard from 'clipboard';
//注册到vue原型上
Vue.prototype.clipboard = clipboard;
import imageViewer from 'image-viewer-vue'
Vue.use(imageViewer)
// import uweb from 'vue-uweb'
// let uwebOptions = {
//   siteId:'1278892635',
//   debug: true, // 请不要在生产环境中使用，避免造成安全隐患
// }
// Vue.use(uweb,uwebOptions)

Vue.prototype.$utils = Util;
Vue.use(VueAwesomeSwiper, /* { default global options } */)
Vue.config.productionTip = false;

// 为了实现Class的私有属性
const showMessage = Symbol('showMessage')

/**
 *  重写ElementUI的Message
 *  single默认值true，因为项目需求，默认只弹出一个，可以根据实际需要设置
 */
class DonMessage {
  success(options, single = true) {
    this[showMessage]('success', options, single)
  }

  warning(options, single = true) {
    this[showMessage]('warning', options, single)
  }

  info(options, single = true) {
    this[showMessage]('info', options, single)
  }

  error(options, single = true) {
    this[showMessage]('error', options, single)
  }

  [showMessage](type, options, single) {
    if (single) {
      // 判断是否已存在Message
      if (document.getElementsByClassName('el-message').length === 0) {
        Message[type](options)
      }
    } else {
      Message[type](options)
    }
  }
}

Vue.use(ElementUI);
Vue.prototype.$message = new DonMessage()

/* eslint-disable no-new */
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;
  next()
});
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
    window.location.reload();
    // router.replace(router.history.pending.fullPath);
  } else {
    console.log(error)
  }
})
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
