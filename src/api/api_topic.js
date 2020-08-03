import * as API from '.'

export default {

  //获取专题页详情
  getActivityDetail: params => {
    return API.GET('/activity/getActivityDetail', params)
  }
}
