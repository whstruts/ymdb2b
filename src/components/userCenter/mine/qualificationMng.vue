<template>
  <div class="qualification-manage" v-loading="loading">
    <div class="tab-bar bgfff">
      <a href="javascript:;" :class="{'selected':currentTab == 1 }" @click="changeTab(1)">资质管理</a>
      <a href="javascript:;" :class="{'selected':currentTab == 2 }" @click="changeTab(2)">变更记录</a>
    </div>
    <!-- 资质管理 -->
    <div class="zl-manage" v-if="currentTab == 1">
      <div class="authen-status">
        <!-- 0未认证，1已认证，2认证失败 3 认证中 -->
        <template v-if="form.auditStatus == 0">
          <i class="icon-status iconfont icon-weirenzheng" ></i><span class="rz-txt">未认证</span> <span class="tips">请尽快完善以下信息</span>
        </template>
        <template v-if="form.auditStatus == 1">
          <i class="icon-status iconfont icon-yirenzheng"></i><span class="rz-txt">已认证</span> <span class="tips">你的资质已审核通过，你可以在平台上进行药品采购</span>
        </template>
        <template v-if="form.auditStatus == 2">
          <i class="icon-status iconfont icon-bohui"></i><span class="rz-txt">已驳回</span> <span class="tips">你的资质信息被驳回，请重新提交！驳回原因：{{form.remark}}</span>
        </template>
        <template v-if="form.auditStatus == 3">
          <i class="icon-status iconfont icon-shenhezhong"></i><span class="rz-txt">审核中</span> <span class="tips">你的资质信息已提交审核，请耐心等待审核结果</span>
        </template>
      </div>
      <div class="qualification-info">
        <el-form class="form" :model="form" :rules="rules" ref="form" label-width="70px" inline>
          <el-form-item label="单位类型:">
            <el-select v-model="form.customerTypeId" placeholder="" @change="handleChangeType" :class="form.customerTypeId == null && beginVarify?'required-filed':''" :disabled="!canEdit  || form.auditStatus == 1 || form.auditStatus ==3">
              <el-option
                v-for="item in customerType"
                :key="item.customerTypeId"
                :label="item.customerTypeName"
                :value="item.customerTypeId" >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="bgfff zj-info-box" v-if="certificatType.length > 0">
        <h2 class="info-title">证件照过期将影响客户的药品采购，请通知客户及时更新</h2>
        <div class="info-item" v-for="(item,index) in certificatType" >
          <div class="item-name">{{item.certificateName}}<span class="is-required">（必填项）</span> <span class="fr"><a href="javascript:;" @click="showBigImg(item)">查看大图</a><a href="javascript:;" @click="viewExample(item)" style="padding-left: 20px" v-if="item.egImg">查看范例</a></span></div>
          <div class="item-content flex-wrp">
            <div class="file-box" :class="item.img == '' && beginVarify?'required-filed':''">
              <input type="file" class="upload-input" id="choose"  accept="image/*" @change='onUpload(index,$event)' v-if="item.img == null || item.img == ''">
              <div class="img-box-padding" v-else>
                <img class="img-box" :src="item.img" />
                <div class="black-mask" v-if="canEdit"><span class="iconfont icon-shanchu" @click="delImg(index,item)"></span></div>
              </div>
              <!-- 未认证不显示  validity 0  不需验证  1 需要验证  2 填写了日期验证  不填日期不验证-->
              <template v-if="item.customerId != '' && form.auditStatus != 0">
                <div v-if="item.validity == 0">
                  <span class="zj-status status-normal">正常情况</span>
                </div>
                <div v-if="item.validity == 1">
                  <span class="zj-status status-normal" v-if="item.laveDay > 30">正常情况</span>
                  <span class="zj-status status-outdate"  v-if="item.laveDay <= 0">已过期</span>
                  <span class="zj-status status-outdate-soon"  v-if="item.laveDay > 0 && item.laveDay <= 30">{{item.laveDay}}天后过期</span>
                </div>
                <div v-if="item.validity == 2">
                  <template v-if="item.validityStart == ''">
                    <span class="zj-status status-normal">正常情况</span>
                  </template>
                  <template v-else>
                    <span class="zj-status status-normal" v-if="item.laveDay > 30">正常情况</span>
                    <span class="zj-status status-outdate"  v-if="item.laveDay <= 0">已过期</span>
                    <span class="zj-status status-outdate-soon"  v-if="item.laveDay > 0 && item.laveDay <= 30">{{item.laveDay}}天后过期</span>
                  </template>
                </div>
              </template>
            </div>
            <div class="flex-item zj-txt">
              <div class="zj-number">
                <p>证照号码：<span class="copy-btn" data-clipboard-action="copy"  :data-clipboard-text="item.certificateCode" @click="copy(item.certificateCode)" v-if="item.certificateCode">复制</span></p>
                <el-input v-model="item.certificateCode" :class="item.certificateCode == '' && beginVarify?'required-filed':''" maxlength="32" :disabled="!canEdit"></el-input>
              </div>
              <div class="zj-date">
                <p>证件有效期：</p>
                <el-date-picker
                  v-model="item.date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder=""
                  :class="item.date == '' && item.validityType == 1?'required-filed':''"
                  end-placeholder="" value-format="yyyy/MM/dd" format="yyyy/MM/dd" @change="handleChangeDate(index, $event)" :disabled="!canEdit || item.validityType ==2">
                </el-date-picker>
              </div>
              <el-radio-group v-model="item.validityType" >
                <el-radio class="radio-reset" :label="2" :disabled="!canEdit" @click.native.prevent="clickRadio(index,2)">长期有效</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="item-rules">
            <!--<p class="rule-tile">注意事项：</p>-->
            <p  v-html="item.remark"></p>
          </div>
        </div>
      </div>
      <div class="btn-box">
        <el-button type="primary" class="btn-submit" @click="handleSubmit" v-if="form.auditStatus == 0 || form.auditStatus == 2">提交审核</el-button>
        <el-button type="primary" class="btn-submit" v-if="form.auditStatus == 1 && canEdit == false" @click="update">更新</el-button>
        <el-button type="" class="btn-submit btn-cancel" v-if="form.auditStatus == 1 && canEdit == true" @click="handleCancel">取消</el-button>
        <el-button type="primary" class="btn-submit" v-if="form.auditStatus == 1 && canEdit == true" @click="handleSubmit">保存</el-button>
      </div>
    </div>

    <!-- 变更记录 -->
    <div class="change-record bgfff" v-if="currentTab == 2">
      <div class="table-record">
        <div class="table-header flex-wrp">
          <span style="width: 40%">证照类型</span>
          <span style="width: 30%">时间</span>
          <span style="width: 30%">状态</span>
        </div>
        <div class="table-body">
          <div class="tr flex-wrp" v-for="item in changeLog.data">
            <div class="td" style="width: 40%;text-align:left">
              <div class="img-box-padding">
                <div class="img-box"  :style="{backgroundImage: 'url('+ item.img +')'}"></div>
              </div>
              <span class="zj-name">{{item.certificateName}}</span>
            </div>
            <div class="td" style="width: 30%">{{item.createTime}}</div>
            <div class="td status status-check" style="width: 30%">
              <!-- 审核流程状态：0未认证，1已认证，2已驳回 3待审核 -->
              <template v-if="item.auditStatus == 0" >未认证</template>
              <template v-if="item.auditStatus == 1" ><span style="color:#38BC37">已通过</span></template>
              <template v-if="item.auditStatus == 2" ><span style="color:#999">已驳回</span></template>
              <template v-if="item.auditStatus == 3" ><span style="color:#F3510A">待审核</span></template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="reset-pagination" v-if="currentTab == 2 && changeLog.total > 0">
      <el-pagination @current-change="handleCurrentChange"
                      background
                      prev-text="上一页"
                      next-text="下一页"
                      layout="prev, pager,next, jumper"
                      :page-sizes="[10, 50, 100, 150]"

                      :total="changeLog.total" :current-page.sync="changeLog.currentPage"
                      :page-size="changeLog.pageSize">
      </el-pagination>
      <el-button class="sure-btn" plain>确 定</el-button>
    </div>
    <el-dialog
    class="b2b-dialog"
     title="提示"
    :visible.sync="bigImgDialogVisible"
    :before-close="closeImgDialog"
    width="40%">
      <div class="big-img-box">
        <img :src="imgUrl"/>
      </div>
      <div slot="footer" class="dialog-footer" style="height: 26px"></div>
    </el-dialog>
    <el-image-viewer
           v-if="showViewer"
           :on-close="closeViewer"
           :url-list="[url]" />
  </div>
</template>
<script>
import API from "../../../api/api_mine";
import API2 from "../../../api/api_user";
import lrz from 'lrz' // 图片压缩
// 导入组件
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name:'qualificationMng',
  data() {
    return {
      loading: false,
      beginVarify: false, // 是否开始验证
      currentTab:1,
      userInfo: {},
      canEdit: false,
      bigImgDialogVisible: false,
      imgUrl: '',
      form:{
        phone: '',
        loginName: '',
        companyName:'',
        customerTypeName:'',
        customerTypeId:'',
        companyAddress:'',
        areaArr:'',
        linkName:'',
        companyLandline:'',
        address:'',
        auditStatus:'',
        auditFlowStatus:''
      },
      tempForm:{},
      rules:{},
      options:[],
      searchProps: {
        label: "name",
        children: 'children',
        value: "areaId",
      },
      areaList:[],
      customerType:[],   // 单位类型
      certificatType:[], // 证件类型
      tempCertificatType:[],
      originCustomerTypeId: '',  // 原始证件id
      originCertificatType:[], // 原始证件类型
      bigImg:{
        imgUrlList:[],
        currentIndex: 1,
      },
      validityType: '',
      changeLog:{
        data: [],
        total: 0,
        pageSize: 5,
        currentPage: 1
      },
      url:'',
      showViewer: false
    }
  },
  components: { ElImageViewer },
  created(){
    this.getInfo();
  },
  methods:{
    changeTab (num){
      this.currentTab = num;
      if(num == 2) {
        this.getCustomerTypeChangeLog();
      }
    },
    // 获取单位类型
    getCustomerType(){
      this.loading = true;
      API.getCustomerType().then( (res) => {
        if(res.code == 0) {
          this.customerType = res.data;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    // 获取省市区
    getAreaList(){
      API2.getAreaList().then( (res) => {
        if(res.code == 0) {
          this.areaList = this.$utils.getTreeData(res.data);
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    // 获取用户信息
    async getInfo(){
      await this.getCustomerType();
      await this.getAreaList();
      API.getInfo().then( (res) => {
        this.loading = false;
        if(res.code == 0) {
          this.form.phone = res.data.phone || '';
          this.form.loginName = res.data.loginName || ''
          this.form.companyName = res.data.companyName || '';
          this.form.customerTypeName = res.data.customerTypeName || '';
          this.form.customerTypeId = res.data.customerTypeId || '';
          this.form.companyAddress = res.data.companyAddress || '';
          this.form.areaArr = res.data.areaArr || '';
          this.form.linkName = res.data.linkName || '';
          this.form.companyLandline = res.data.companyLandline || '';
          this.form.address = res.data.address || '';
          this.form.auditStatus = res.data.auditStatus || '';
          this.form.auditFlowStatus = res.data.auditFlowStatus || '';
          this.form.remark = res.data.remark;
          if(res.data.auditStatus == 0 || res.data.auditStatus == 2) { // 未认证/审核失败
            this.canEdit = true;
          }
          this.tempForm = res.data;
          // 如果用户没有选择单位类型，默认传1，获取零售单体的证件信息
          if(res.data.customerTypeId == null || res.data.customerTypeId == '') {
            this.form.customerTypeId = 1;
            this.originCustomerTypeId = "";
            this.getCertificate(1);
          }  else {
            this.getCertificate(res.data.customerTypeId);
          }
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    // 获取变更记录
    getCustomerTypeChangeLog(){
      let params = {
          page: this.changeLog.currentPage,
          limit: this.changeLog.pageSize,
        }
      API.getCustomerTypeChangeLog(params).then( (res) => {
        if(res.code == 0) {
          this.changeLog.data = res.data.rows;
           this.changeLog.total = res.data.total;
        }
      })
    },
    //分页
    handleCurrentChange(val) {
      this.changeLog.currentPage = val;
      this.getCustomerTypeChangeLog();
    },
    // 选择单位类型
    handleChangeType(val){
      this.getCertificate(val);
    },

    handleRegTel(){
      this.form.companyLandline = this.form.companyLandline.replace(/[^\d\-\d]/g,'')
    },
    // 获取证件类型
    getCertificate(customerTypeId){
      API.getCertificate({customerTypeId: customerTypeId}).then( (res) => {
        if(res.code == 0) {
          let list = res.data;
          let imgs = []
          for (let i =0; i< list.length; i++) {
            // 判断开始时间结束时间是否为空
            if(list[i].validityStart != "" && list[i].validityStart != null && list[i].validityEnd != ""  && list[i].validityEnd != null) {
              list[i].date = [list[i].validityStart, list[i].validityEnd]
            } else {
              list[i].date = ""
            }
            imgs.push(list[i].img)
          }
          this.certificatType = list;
          this.tempCertificatType = JSON.parse(JSON.stringify(list));
          this.images = imgs;

        } else {
          this.$message.error(res.msg);
        }
      })
    },
    // 选择日期
    handleChangeDate(idx, val){
      if(val) {
        this.certificatType[idx].validityStart= val[0];
        this.certificatType[idx].validityEnd= val[1];
      } else {
        this.$nextTick( () => {
          this.certificatType[idx].date= '';
          this.certificatType[idx].validityStart= '';
          this.certificatType[idx].validityEnd= '';
        })

      }
      console.log(this.tempCertificatType)
    },
    // 点击查看大图
    showBigImg (item) {
      if(item.img) {
        // this.imgUrl = item.img
        // this.bigImgDialogVisible = true;
        this.url = item.img;
        this.showViewer = true;

      } else {
        this.$message.error("请先上传图片")
      }
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    },
    // 查看范例
    viewExample(item){
      if(item.egImg) {
        this.imgUrl = item.egImg
        this.bigImgDialogVisible = true;
      } else {
        this.$message.error("暂无范例")
      }
    },
    // 关闭查看图片弹框
    closeImgDialog(){
      this.imgUrl = "";
      this.bigImgDialogVisible = false;
    },
    /**
     * 将以base64的图片url数据转换为Blob
     * @param urlData
     *  url方式表示的base64图片数据
     */
    convertBase64UrlToBlob(urlData){
      var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
    },
    // 上传图片
    onUpload(idx,e){
      let formdata = new window.FormData()
      let photoFile = e.target.files[0];
      e.target.value='';
      if(!photoFile) {
        return;
      }
      lrz(photoFile,{fieldName: 'file' }).then(rst => {
        let data = rst.base64;
        let blob = this.convertBase64UrlToBlob(data);
        formdata.append("file", blob, 'image.jpg');
        this.uploadFn(idx, formdata, rst.base64)
      });
    },
    uploadFn(idx,formdata,base64){
      API.uploadToRedis(formdata).then(res => {
        if (res.code == 0) {
          let obj = this.certificatType[idx];
          obj.fileId = res.data;
          obj.img = base64;
           obj.imgType = 'jpg';
          this.certificatType.splice(idx,1,obj);
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 点击删除图片
    delImg(index,item){
      this.certificatType[index].img = '';
      this.certificatType[index].fileId = '';
    },
    // 点击复制按钮
    copy(num){
      var clipboard = new this.clipboard('.copy-btn')
      clipboard.on('success', e => {
        this.$message.success("复制成功")
        // 释放内存
        clipboard.destroy();
      })
      clipboard.on('error', e => {
        // 不支持复制
　　　　　　//console.log('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
    },
    // 点击更新按钮
    update(){
      this.canEdit = true;
    },
    // 点击单选按钮
    clickRadio(index,e){
      if(this.canEdit){
        e === this.certificatType[index].validityType? (this.certificatType[index].validityType = 1):(this.certificatType[index].validityType = e);
        this.certificatType[index].date = '';
      }
    },
    // 点击取消
    handleCancel(){
      this.form = JSON.parse(JSON.stringify(this.tempForm));
      this.certificatType = JSON.parse(JSON.stringify(this.tempCertificatType));
      this.canEdit = false;
    },
    // 点击提交审核按钮
    handleSubmit(){
      if(!this.canEdit) return;
      this.beginVarify = true;
      for(let i in this.certificatType) {
        let obj = this.certificatType[i];
        if(obj.img == "" || obj.certificateCode == '') {
          this.$message.warning("请检查必填项!")
          return;
        }
        if (obj.validityType != 2 && obj .date == '') {
          this.$message.warning("请选择证件有效期");
          return;
        }

      }
      let postData = this.form;
      let certificatType = this.certificatType;
      // 如果重新上传了图片，就把img清空
      for(let i=0; i< certificatType.length; i++) {
        if(certificatType[i].fileId != "" && certificatType[i].fileId != null) {
          certificatType[i].img ="";
        }
      }
      if(this.form.areaArr) {
        postData.area = this.form.areaArr[2];
      }
      postData.certificatesList = certificatType;
      console.log(postData)
      API.upInfo(postData).then(res => {
        if (res.code == 0) {
          this.canEdit =false;
          this.getInfo();
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.qualification-manage{
  .authen-status{
    padding-top: 11px;
    .icon-weirenzheng{
      color: #FF3131;
      font-size: 16px;
      vertical-align: middle;
    }
    .icon-yirenzheng{
      color: #67C23A;
      font-size: 19px;
      vertical-align: middle;
    }
    .icon-shenhezhong{
      color: #F3A707;
      font-size: 19px;
      vertical-align: middle;
    }
    .icon-bohui{
      color: #FF0000;
      font-size: 19px;
      vertical-align: middle;
    }
    .rz-txt{
      padding-left: 7px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      vertical-align: middle;
    }
    .tips{
      padding-left: 15px;
      font-size: 14px;
      color: #999999;
      vertical-align: middle;
    }
  }
  .qualification-info{
    padding: 0 30px;
    .wx-tips{
      padding-top: 15px;
      font-size: 14px;
      color: #F3A707;
    }
    .login-account{
      font-size: 14px;
      color: #666666;
      .flex-item{
        padding-left: 12px;
      }
      .el-form{
        .el-input__inner{
          padding: 0 5px;
          height: 28px;
          line-height: 28px;
          border: 1px solid #DEDEDE;
        }
      }
    }
  }
  .zj-info-box{
    padding: 0 20px;
    overflow: hidden;
    .info-title{
      padding: 15px 0 10px;
      font-size: 14px;
      color: #666666;
    }
    .info-item{
      float: left;
      margin-right: 20px;
      margin-bottom: 16px;
      padding: 18px;
      width: 460px;
      height: 318px;
      border: 1px solid #F5F5F5;
      box-sizing: border-box;
      &:nth-child(2n+1){
        margin-right: 0;
      }
      .item-name{
        font-size:14px;
        color: #333333;
        .is-required{
          color: #FF0000;
        }
        a{
          color: #F3A707;
          text-decoration: underline;
        }
      }
    }
    .item-content{
      padding: 10px 0;
      align-items: flex-start;
    }
    .file-box{
      position: relative;
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
      cursor: pointer;
      background: url(~@/assets/img/icon_upload.png) no-repeat center;
      &.required-filed{
        border: 1px solid #FF0000;
      }
      .upload-input{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
      .img-box-padding{
        position: relative;
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        &:hover{
          .black-mask{
            display: block;
          }
        }
        .black-mask{
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          line-height: 150px;
          text-align: center;
          color: #fff;
          font-size: 16px;
          background: rgba(0,0,0,0.3);
        }
      }
      .img-box{
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
      }
    }
    .zj-txt {
      padding-left: 10px;
    }
    .item-rules{
      font-size: 12px;
      color: #666;
      .rule-title{
        color: #333333;
      }
    }
  }
  .btn-box{
    padding: 26px 0 32px;
    text-align: center;
    .btn-submit{
      padding: 12px 20px;
      width: 133px;
      border-radius: 0;
    }
  }
  .change-record{
    margin-top: 20px;
    .table-record{
      width: 100%;
      // padding: 0 17px;
      .table-header{
        padding: 0 18px;
        height: 33px;
        line-height: 33px;
        background-color: #F9F9F9;
        overflow: hidden;
        span{
          float: left;
          text-align: center;
        }
      }
      .table-body{
        padding: 0 18px;
        .tr{
          padding: 18px 0;
          border-bottom: 1px solid #F3F4F3;
          overflow: hidden;
          .td{
            font-size: 12px;
            color: #333333;
            text-align: center;
          }
          .flex-item{
            font-size: 14px;
            color: #333333;
            text-align: left;
          }
          .status-check{
            color: #F3510A
          }
          .status-pass{
            color: #38BC37
          }
        }
      }
      .img-box-padding{
        display: inline-block;
        padding: 10px;
        width: 95px;
        height: 94px;
        border: 1px solid #eeeeee;
        box-sizing: border-box;
        vertical-align: middle;
      }
      .img-box{
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
      }
      .zj-name{
        padding-left: 36px;
        font-size: 14px;
        color: #333333;
      }
    }
  }
  .big-img-box{
    img{
      width: 100%;
    }
  }
}
</style>
<style lang='scss'>
  .qualification-manage{
    font-size: 14px;
    color: #666666;
    .el-form{
      padding-bottom: 11px;
    }
    .el-form-item{
      margin-right: 120px !important;
      margin-bottom: 0;
      vertical-align: middle !important;
      &:nth-child(2n){
        margin-right: 0;
      }
    }
    .el-form-item__content{
      line-height: 28px;
    }
    .el-form-item__label{
      padding: 0;
      line-height: 28px;
      text-align: left;
    }
    .qualification-info,.zj-info-box{
      .el-input__inner{
        padding: 0 5px;
        width: 262px;
        height: 28px;
        line-height: 28px;
        border: 1px solid #DEDEDE;
        border-radius: 0;
      }
      .el-select__caret{
        line-height: 28px;
      }
    }
    .el-cascader{
      line-height: 28px;
    }
    .w100{
       margin-right: 0;
      .el-input__inner{
        width: 718px;
      }
    }
    .zj-number{
      p{
        line-height: 22px;
      }
      .copy-btn{
        color:#2F9FFE;
        cursor: pointer;
        &:hover{
          text-decoration: underline;
        }
      }
      .el-input__inner{
        width: 262px;
        background: transparent;
      }
    }
    .zj-date{
      padding-top: 10px;
      width: 114px;
    }
    .zj-status{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: block;
      margin-top: 10px;
      width: 100%;
      height: 24px;
      line-height: 24px;
      text-align: center;
      font-size: 12px;
      &.status-normal{
        color: #67C23A;
        background: #ECF9E5;
      }
      &.status-outdate{
        color: #FFFFFF;
        background: #ACACAC;
      }
      &.status-outdate-soon{
        color: #FF6868;
        background: #FFF0F0;
      }
    }
    .el-range__icon{
      display: none;
    }
    .el-range-input{
      text-align: left;
      background-color: transparent !important;
    }
    .el-range-separator{
      line-height: 28px;
    }
    .el-range__close-icon{
      line-height: 28px;
    }
    .el-input__icon{
      line-height: 30px;
    }
    .el-button+.el-button {
        margin-left: 88px;
    }
    .required-filed{
      input{
        border-color: #FF0000 !important;
      }
    }
    .el-range-editor{
      &.el-input__inner{
        &.required-filed{
          border-color: #FF0000;
        }
      }
    }
    .radio-reset{
      margin-top:10px;
      .el-radio__inner{
        width: 18px;
        height:18px;
      }
      .el-radio__input{
        &.is-checked{
          .el-radio__inner{
            background-color: #fff;
            &:after{
              width: 10px;
              height: 10px;
              background-color: #00AAEF;
            }
          }
        }
      }
    }
    .el-form-item__content{
      vertical-align: middle;
    }
    .el-input__inner{
      background: #fff;
    }
    .is-disabled{
      .el-input__inner {
        background: transparent;
        border: none;
        color: #666 !important;
      }
      .el-select__caret, .el-input__icon{
        display: none;
      }
    }
    .el-date-editor .el-range-separator {
      padding: 0 15px
    }
    .el-image-viewer__close{
      color:#fff;
    }
  }
</style>
