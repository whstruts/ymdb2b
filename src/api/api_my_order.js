import * as API from '.'

export default {

  //我的订单
  list: params => {
    return API.GET('/order/list', params)
  },
  //订单详情
  detail: params => {
    return API.GET('/order/detail', params)
  },

  //订单列表中再次购买
  again: params => {
    return API.POST('/order/again', params)
  },
  //订单详情中单个再次购买
  againCommodity: params => {
    return API.POST('/order/againCommodity', params)
  },
  //取消订单
  cancel: params => {
    return API.POST('/order/cancel', params)
  },
  //确认收货
  confirm: params => {
    return API.POST('/order/confirm', params)
  },
  //上传电子凭证
  uploadTelegraphicTransferFile: params => {
    return API.POST('/order/uploadTelegraphicTransferFile', params)
  },
  //保存电子凭证
  saveOrderOtt: params => {
    return API.PUT('/order/saveOrderOtt', params)
  },
}
