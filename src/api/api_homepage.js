import * as API from '.'
export default {
  //获取首页模板
  getCurTemplate: params => {
    return API.GET('/cms/getCurTemplate', params)
  },
  // 获取商品分类
  goodsTypeForB2B: params => {
    return API.GET('/cms/goodsTypeForB2B', params)
  },
  // 订单数量统计
  orderCount: params => {
    return API.GET('/order/orderCount', params)
  },
}
