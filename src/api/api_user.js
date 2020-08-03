/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  //登录
  login: params => {
    return API.POST('/login/pwlogin', params)
  },
  //登出
  logout: params => {
    return API.GET('/login/logout', params)
  },
  //检查手机号
  checkPhone: params => {
    return API.POST('/customer/checkPhone', params)
  },
  // 注册
  registerOne: params => {
    return API.POST('/customer/registerOne', params)
  },
  // 获取验证码
  smsCode: params => {
    return API.GET('/login/smsCode', params)
  },
  // 注册获取验证码
  smsRegist: params => {
    return API.GET('/login/smsRegist', params)
  },
  // 修改密码获取验证码
  smsFindPwd: params => {
    return API.GET('/login/smsFindPwd', params)
  },
  findPwd: params => {
    return API.POST('/login/findPwd', params)
  },
  resetPwd: params => {
    return API.POST('/login/upPwd', params)
  },
  // 获取图片验证码
  imgCode: () => {
    return API.IMGCODE('/login/imageCode')
  },
  // 获取省市区
  getAreaList: params => {
    return API.GET('/area/list', params)
  },
  // 获取热线
  queryKefu: params => {
    return API.KEFU('https://app.ymdb2b.com/api/api-admin/kefu/query', params)
  },
  // 获取购物车商品种类
  getShopCount: params => {
    return API.GET('/shoppingTrolley/count', params)
  },
  // 验证邀请码
  checkInvitedCode: params => {
    return API.POST('/customer/checkInvitedCode', params)
  },
  // 区域匹配验证
  matchAreaAndInvitedCode: params => {
    return API.GET('/customer/matchAreaAndInvitedCode', params)
  },
}
