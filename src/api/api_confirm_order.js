import * as API from '.'

export default {

  //确认订单
  create: params => {
    return API.POST('/order/create', params)
  },
  //订单状态信息查询
  statusInfo: params => {
    return API.GET('/order/statusInfo', params)
  },
  //获取支付宝二维码
  aliPayQrCodeByOrderInfo: params => {
    return API.IMGCODE('/alipay/aliPayQrCodeByOrderInfo')
  },
  //获取微信二维码
  wxPayQrCodeByOrderInfo: params => {
    return API.IMGCODE('/wxpay/wxPayQrCodeByOrderInfo')
  },
  // 查询微信订单支付状态
  wxPayOrderQuery: params => {
    return API.GET('/wxpay/wxPayOrderQuery', params)
  },
  // 查询支付宝订单支付状态
  aliPayOrderQuery: params => {
    return API.GET('/alipay/aliPayOrderQuery', params)
  },
  // 获取客户发票信息
  getInvoiceInfo: params => {
    return API.GET('/customerInvoice/getInvoiceInfo', params)
  },
  // 文件上传
  uploadToRedis: params => {
    return API.POST('/file/uploadToRedis', params)
  },
  updateInvoiceInfo: params => {
    return API.POST('/customerInvoice/updateInvoiceInfo', params)
  },
}
