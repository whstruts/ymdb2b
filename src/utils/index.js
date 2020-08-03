export default {

  /**
   * 验证用户是否登录
   * 验证用户登录成功后的用户是否通过审核
   * @param item
   */
  verifyLogin() {
    let userInfo = JSON.parse(localStorage.getItem("b2b-access-user"));
    if (userInfo) {
      return userInfo.auditStatus;//0待审核，1审核通过，2审核失败，9禁用
    } else {
      return -1
    }
  },
  /**
   * 根据客户报价类型显示不同的价格
   */
  specifyQuotation() {
    let userInfo = JSON.parse(localStorage.getItem("b2b-access-user"));
    if (userInfo) {
      return userInfo.specifyQuotation;//1 单体价 2 连锁价 3 商业价
    }
  },
  convertToChinaNum(num) {
    var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
    var arr2 = new Array('', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿');//可继续追加更高位转换值
    if (!num || isNaN(num)) {
      return "零";
    }
    var english = num.toString().split("")
    var result = "";
    for (var i = 0; i < english.length; i++) {
      var des_i = english.length - 1 - i;//倒序排列设值
      result = arr2[i] + result;
      var arr1_index = english[des_i];
      result = arr1[arr1_index] + result;
    }
    //将【零千、零百】换成【零】 【十零】换成【十】
    result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
    //合并中间多个零为一个零
    result = result.replace(/零+/g, '零');
    //将【零亿】换成【亿】【零万】换成【万】
    result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
    //将【亿万】换成【亿】
    result = result.replace(/亿万/g, '亿');
    //移除末尾的零
    result = result.replace(/零+$/, '')
    //将【零一十】换成【零十】
    //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
    //将【一十】换成【十】
    result = result.replace(/^一十/g, '十');
    return result;
  },
  // 递归方法
  getTreeData(data) {
    // 循环遍历json数据
    for (var i = 0; i < data.length; i++) {
      if (!data[i].children || data[i].children.length <= 0) {
        // children若为空数组，则将children设为undefined  不然会多出一个空级选项
        data[i].children = undefined;
      } else {
        // children若不为空数组，则继续 递归调用 本方法
        this.getTreeData(data[i].children);
      }
    }
    return data;
  },
  openNewPage(that, path, data) {
    const {href} = that.$router.resolve({
      path: path,
      query: data
    });
    window.open(href, '_blank');
  },

  jumpPage(item, that) {
    //jumpPage   0 跳转到页面 1活动 2商品 3外部链接 4 无
    if (item.jumpPage == 0) {
      // linkAddress  0搜索列表 关键字keyword  1 历史采购 2 我的关注 3我的缺货篮
      if (item.linkAddress == '0') {
        this.openNewPage(that, "/search", {value: item.keyword})
      }
    } else if (item.jumpPage == 3 || item.jumpPage == 1) {
      window.open(item.linkAddress, "_blank");
    } else if (item.jumpPage == 2) {
      this.openNewPage(that, "/productDetail", {commodityId: item.linkAddress.commodityId})
    }
  },
  /**
   * 时间格式转换 2020-10-10  -->  2020/10/10
   */
  dateFormate(date) {
    if (date) {
      let str = "";
      str = date.split("-").join("/");
      return str
    }
  },
  defaultBgImg() {
    return "'https://app.ymdb2b.com/ymdDefaultCommodityImg.jpg'"
  },
  defaultBgImg2() {
    return "https://app.ymdb2b.com/ymdDefaultCommodityImg.jpg"
  },
  //验证图片路径是否有效
  verifyImagePath(url) {
    var ImgObj = new Image(); //判断图片是否存在
    ImgObj.src = url;
    console.log(url)
    //没有图片，则返回-1
    if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
      return url;
    } else {
      return this.defaultBgImg2();
    }
  }
}

