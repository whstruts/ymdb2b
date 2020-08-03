import * as API from '.'

export default {
  
  //药头条列表页
  newslists: params => {
    return API.GET('/headline/list', params)
  },

  //药头条列表页详情页
  newsdetilas: params => {
    return API.GET('/headline/getById', params)
  }
}