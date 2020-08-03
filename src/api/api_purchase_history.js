import * as API from '.'

export default {

  //采购历史
  historyBuy: params => {
    return API.GET('/commodity/historyBuy', params)
  },
}
