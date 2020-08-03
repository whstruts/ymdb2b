import * as API from '.'

export default {
  //获取用户信息
  getInfo: params => {
    return API.GET('/customer/getInfo', params)
  },
  // 获取单位类型
  getCustomerType: params => {
    return API.GET('/customer/getCustomerType', params)
  },
  // 获取证件类型
  getCertificate: params => {
    return API.GET('/customer/getCertificate', params)
  },
  // 更新用户信息
  upInfo: params => {
    return API.POST('/customer/upInfo', params)
  },
  // 文件上传
  uploadToRedis: params => {
    return API.POST('/file/uploadToRedis', params)
  },
  // 个人中心修改密码
  upPwdByOldPwd: params => {
    return API.POST('/customer/upPwdByOldPwd', params)
  },
  // 变更记录
  getCustomerTypeChangeLog: params => {
    return API.GET('/customer/getCustomerTypeChangeLog', params)
  },
  // 个人中心首页
  customerIndex: params => {
    return API.GET('/customer/index', params)
  },
  // 订单数量统计
  orderCount: params => {
    return API.GET('/order/orderCount', params)
  },
  // 获取客户发票信息
  getInvoiceInfo: params => {
    return API.GET('/customerInvoice/getInvoiceInfo', params)
  },
  updateInvoiceInfo: params => {
    return API.POST('/customerInvoice/updateInvoiceInfo', params)
  },
  // 用户余额明细
  balanceList: params => {
    return API.GET('/balance/list', params)
  },
  // 修改基本信息
  upInfoBasic: params => {
    return API.POST('/customer/upInfoBasic', params)
  },
}
