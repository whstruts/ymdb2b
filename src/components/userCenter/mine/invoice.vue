<template>
  <div class="invoice bgfff">
    <!--普通发票-->
    <div class="invoiec-item flex-wrp">
      <div class="item-title">
        <span class="label">电子普通发票</span>
      </div>
      <div class="flex-item">
        <el-form v-model="form" ref="ruleForm" :rules="rules" label-width="110px">
          <el-form-item class="form-item-type">
            <!-- <el-checkbox-group v-model="form.fp">
              <el-checkbox label="可接受电子发票" name="type"></el-checkbox>
            </el-checkbox-group> -->
            <div class="dzfp-desc">电子发票，功效等同于普通纸质发票。增值税电子普通发票的开票方和受票方需要纸质发票的，可以自行打印增值税电子普通发票的版式文件，
其法律效力、 基本用途、基本使用规定等与税务机关监制的增值税普通发票相同。</div>
          </el-form-item>
          <el-form-item label="单位名称">
             {{form.company}}
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input type="textarea" resize="none" v-model="form.address" :disabled="!canEdit" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号" prop="dutyNumber">
            <el-input v-model="form.dutyNumber" :disabled="!canEdit" maxlength="30"></el-input>
            <!-- <div>
              <el-checkbox v-model="noDutyNumber" :disabled="!canEdit">没有税号（如果你经营的单位无税号，但又需要发票，请选择此项）</el-checkbox>
            </div> -->
          </el-form-item>
          <el-form-item label="开户银行" prop="depositBank">
            <el-input v-model="form.depositBank" :disabled="!canEdit" maxlength="30"></el-input>
            <span class="tips">xx银行xxx支行</span>
          </el-form-item>
          <el-form-item label="银行账户" prop="bankAccount">
            <el-input v-model="form.bankAccount" :disabled="!canEdit" maxlength="25"></el-input>
            <span  class="tips">开户许可证或法人的私人账户</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" class="button-edit" :loading="loadingBtn" v-if="!canEdit" @click="canEdit = true">修改</el-button>
            <el-button type="" size="small" class="button-edit" v-if="canEdit" @click="cancel(1)">取消</el-button>
            <el-button type="primary" size="small" class="button-edit" :loading="loadingBtn"  v-if="canEdit" @click="save(1)">保存</el-button>
          </el-form-item>
         </el-form>
      </div>
    </div>
     <!--专用发票-->
    <div class="invoiec-item flex-wrp">
      <div class="item-title">
        <span class="label">专用发票</span>
      </div>
      <div class="flex-item">
        <el-form v-model="form2" ref="ruleForm2" :rules="rules2" label-width="110px">
          <el-form-item label="公司名称">
             {{form2.company}}
          </el-form-item>
           <el-form-item class="is-required" label="上传开票信息" prop="invoiceInfo">
             <div class="file-box" >
               <input type="file" class="upload-input" id="choose"  accept="image/*" @change='onUpload($event)' v-if="img== null || img== ''">
               <div class="img-box-padding" v-else>
                <div class="img-box" :style="{backgroundImage: 'url('+img +')'}"></div>
                <div class="black-mask" v-if="canEdit2"><span class="iconfont icon-shanchu" @click="delImg()"></span></div>
              </div>
             </div>
             <span class="tips">专用发票需要上传开票信息图片，或者填写开票必须信息</span>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input type="textarea" resize="none" v-model="form2.address" :disabled="!canEdit2" maxlength="100"></el-input>
            <span class="tips" style="vertical-align: top">专票要求的公司地址</span>
          </el-form-item>
          <el-form-item label="纳税人识别号" prop="dutyNumber">
            <el-input v-model="form2.dutyNumber" :disabled="!canEdit2" maxlength="30"></el-input>
             <span  class="tips">营业执照上的【统一社会信用代码】</span>
          </el-form-item>
          <el-form-item label="电话" prop="contactWay">
            <el-input v-model="form2.contactWay" :disabled="!canEdit2" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="开户银行" prop="depositBank">
            <el-input v-model="form2.depositBank" :disabled="!canEdit2" maxlength="30"></el-input>
            <span class="tips">xx银行xxx支行</span>
          </el-form-item>
          <el-form-item label="银行账户" prop="bankAccount">
            <el-input v-model="form2.bankAccount" :disabled="!canEdit2" maxlength="25"></el-input>
            <span  class="tips">开户许可证或法人的私人账户</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" class="button-edit" v-if="!canEdit2" @click="canEdit2 = true">修改</el-button>
            <el-button type="" size="small" class="button-edit" v-if="canEdit2" @click="cancel(2)">取消</el-button>
            <el-button type="primary" size="small" class="button-edit" :loading="loadingBtn2" v-if="canEdit2" @click="save(2)">保存</el-button>
          </el-form-item>
         </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import lrz from 'lrz' // 图片压缩
import API from "../../../api/api_mine";
export default {
  name: 'balance',
  data(){
    return{
      form:{
        company:"",
        dutyNumber:"",
        address:"",
        depositBank:""
      },
      tempForm:{},
      form2:{
        company:"",
        dutyNumber:"",
        contactWay: '',
        address:"",
        depositBank:"",
        invoiceInfo:"",
        fileRedisId:""
      },
      tempForm2:{},
      img:"",
      canEdit: false,
      canEdit2: false,
      loadingBtn: false,
      loadingBtn2: false,
      noDutyNumber: false, // 是否含有纳税人识别号
      rules:{
        address:[
          { required: true, message: ' ', trigger: 'blur' },
        ],
        dutyNumber:[
          {required: true, message: ' ', trigger: 'blur' }
        ],
        depositBank:[
          { required: true, message: ' ', trigger: 'blur' },
        ],
        bankAccount:[
          { required: true, message: ' ', trigger: 'blur' },
        ],
      },
      rules2:{
        // dutyNumber:[
        //   { required: true, message: ' ', trigger: 'blur' },
        // ],
        // contactWay: [
        //   {required: true, message: ' ', trigger: 'blur'},
        //   {
        //     pattern: /^[0-9\-]+$/,
        //     message: '电话格式不正确'
        //   }
        // ],
        // address:[
        //   { required: true, message: ' ', trigger: 'blur' },
        // ],
        // depositBank:[
        //   { required: true, message: ' ', trigger: 'blur' },
        // ],
        // bankAccount:[
        //   { required: true, message: ' ', trigger: 'blur' },
        // ],
      }
    }
  },
  created(){
    this.getInVoiceInfo();
  },
  methods:{
    // 获取发票信息
    getInVoiceInfo(){
      API.getInvoiceInfo().then( (res) => {
        if(res.code == 0) {
          let ordinaryInvoice = res.data.ordinaryInvoice;
          if(ordinaryInvoice) {
            this.form = ordinaryInvoice;
            this.tempForm = JSON.parse(JSON.stringify(ordinaryInvoice));
          }

          let specialInvoice = res.data.specialInvoice;
          if(specialInvoice) {
            if(specialInvoice.invoiceInfo != "" && specialInvoice.invoiceInfo != null) {
              this.img = specialInvoice.invoiceInfo
            }
            this.form2 = specialInvoice;
            this.tempForm2 = JSON.parse(JSON.stringify(specialInvoice));
          }

        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 点击取消
    cancel(type){
      if(type == 1) {
        this.$refs['ruleForm'].resetFields();
        this.form = JSON.parse(JSON.stringify(this.tempForm));
        this.canEdit = false;
      } else {
        this.$refs['ruleForm2'].resetFields();
        this.form2 = JSON.parse(JSON.stringify(this.tempForm2));
        this.canEdit2 = false;
      }
    },
    // 点击保存
    save(type){
      let params = {};
      if(type == 1) {
        if(this.form.address == "" || this.form.address == null) {
          this.$message.error("请输入地址");
          return;
        }
        if(this.form.dutyNumber == "" ||this.form.dutyNumber == null) {
          this.$message.error("请输入纳税人识别号");
          return;
        }
        if(this.noDutyNumber  == false && this.form.dutyNumber == "") {
          this.$message.error("请输入纳税人识别号，如果没有，请勾选没有税号");
          return;
        }
        if(this.form.depositBank  == "" || this.form.depositBank == null) {
          this.$message.error("请输入开户银行");
          return;
        }
        if(this.form.bankAccount  == "" || this.form.bankAccount == null) {
          this.$message.error("请输入银行账户");
          return;
        }
        params = this.form;
        params.invoiceType = type;
         this.loadingBtn = true;
      } else {
        if(this.form2.invoiceInfo == "" || this.form2.invoiceInfo == null) {
          this.$message.error("请上传开票信息");
          return;
        }
        // if(this.form2.address == "" || this.form2.address == null) {
        //   this.$message.error("请输入地址");
        //   return;
        // }
        // if(this.form2.dutyNumber == "" || this.form2.dutyNumber == null) {
        //   this.$message.error("请输入纳税人识别号");
        //   return;
        // }
        // if(this.form2.contactWay == "" || this.form2.contactWay == null) {
        //   this.$message.error("请输入电话");
        //   return;
        // }
        // let regPhone = /(^1[23456789]\d{9}$)|(^(0\d{2})-(\d{8})$)|(^(0\d{3})-(\d{7})$)/;
        // if (!regPhone.test(this.form2.contactWay)){
        //   this.$message.error("电话格式不正确");
        //   return;
        // }
        // if(this.form2.depositBank  == "" || this.form2.depositBank == null) {
        //   this.$message.error("请输入开户银行");
        //   return;
        // }
        // if(this.form2.bankAccount  == "" || this.form2.bankAccount == null) {
        //   this.$message.error("请输入银行账户");
        //   return;
        // }
        params = this.form2;
        params.invoiceType = type;
        this.loadingBtn2 = true;
      }
      API.updateInvoiceInfo(params).then((res)=> {
        if(res.code == 0) {
          this.canEdit = false;
          this.canEdit2 = false;
          this.loadingBtn = false;
          this.loadingBtn2 = false;
          this.getInVoiceInfo();
          this.$message.success("修改成功")
        } else {
          this.loadingBtn = false;
          this.loadingBtn2 = false;
          this.$message.error(res.msg);
        }
      })
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
    onUpload(e){
      let formdata = new window.FormData()
      let photoFile = e.target.files[0];
      e.target.value='';
      if(!photoFile) {
        return;
      }
      lrz(photoFile,{ width: 450, fieldName: 'file' }).then(rst => {
        let data = rst.base64;
        let blob = this.convertBase64UrlToBlob(data);
        formdata.append("file", blob, 'image.jpg');
        this.uploadFn(formdata, rst.base64)
      });
    },
    uploadFn(formdata,base64){
      API.uploadToRedis(formdata).then(res => {
        if (res.code == 0) {
          let obj = {}
          obj.fileId = res.data;
          obj.img = base64;
          obj.imgType = 'jpg';
          this.img = obj.img;
          this.form2.invoiceInfo = res.data;
          this.form2.fileRedisId = res.data;
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 删除图片
    delImg(){
      this.img = "";
      this.form2.invoiceInfo = "";
    }
  }
}
</script>
<style lang="scss">
  .invoice{
    padding: 0 20px;
    .flex-wrp{
      align-items: flex-start;
    }
    .dzfp-desc{
      padding: 8px 12px;
      line-height: 16px;
      font-size: 12px;
      color: #F3B533;
      background:#FFFEF1;
      border:1px solid #FFD500;
    }
    .invoiec-item{
      padding: 15px 40px 8px 0;
      border-bottom: 1px solid #DEDEDE;
      &:last-child{
        border-bottom: none;
      }
      .item-title{
          padding-left: 3px;
          padding-right: 26px;
          width: 85px;
          font-size: 14px;
          color: #333333;
          font-weight: bold;
          text-align: right;

      }
      .form-item-type{
        .el-form-item__content{
          margin-left: 0 !important;
        }
      }
      .el-form-item__content{
        line-height: 28px;
      }
      .el-form-item__label{
        line-height: 28px;
        text-align: left;
      }
      .tips{
        padding-left: 16px;
        font-size: 14px;
        color: #999999;
      }
    }
    .el-input{
      width: 262px;
      .el-input__inner{
        height: 28px;
        line-height: 28px;
        border:1px solid #DEDEDE;
        border-radius: 0;
      }
    }
    .el-textarea{
      width: 262px;
      .el-textarea__inner{
        height: 83px;
        border-radius: 0;
      }
    }
    .button-edit{
      padding: 0;
      width: 90px;
      height: 32px;
      line-height: 32px;
      border-radius: 0;
    }
    .file-box{
      display: inline-block;
      position: relative;
      width: 88px;
      height: 88px;
      background: url(~@/assets/img/icon_upload.png) no-repeat center;
      background-size: cover;
      .upload-input{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }
    .img-box-padding{
        position: relative;
        width: 100%;
        height: 100%;
        padding: 5px;
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
      .icon-shanchu{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
      }
  }
</style>
