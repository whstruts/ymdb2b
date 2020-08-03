import * as API from '.'

export default {
  //搜索
  search: params => {
    return API.GET('/commodity/search', params)
  },
  // 二级搜索
  searchPrice: params => {
    return API.GET('/commodity/searchPrice', params)
  },
  // 商品详情
  productInfo: params => {
    return API.GET('/commodity/info', params)
  },
  // 加入购物车
  addCart: params => {
    return API.POST('/shoppingTrolley/add', params)
  },
  // 购物车商品种类
  shopCount: params => {
    return API.GET('/shoppingTrolley/count', params)
  },
  // 同商品其他效期推荐
  otherCommodity: params => {
    return API.GET('/commodity/otherCommodity', params)
  },
  // 搜索联想
  getAssociate: params => {
    return API.GET('/commodity/getAssociate', params)
  },
}
