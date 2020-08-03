import * as API from '.'

export default {
  //获取购物车列表
  getShoppingList: params => {
    return API.GET('/shoppingTrolley/list', params)
  },
//获取购物车总数量，活动商品和库存紧张的个数
  count: params => {
    return API.GET('/shoppingTrolley/count', params)
  },
  //删除商品
  deleteCommodity: params => {
    return API.POST('/shoppingTrolley/del', params)
  },
  //清除失效商品
  clear: params => {
    return API.GET('/shoppingTrolley/clearn', params)
  },
  //修改购物车商品数量
  updateCommodityNumber: params => {
    return API.POST('/shoppingTrolley/updateCommodityNumber', params)
  },
  //获取配送限制
  getDeliveryLimit: params => {
    return API.GET('/shoppingTrolley/getDeliveryLimit', params)
  },
  //提交订单
  submitData: params => {
    return API.POST('/order/affirm', params)
  },
}
