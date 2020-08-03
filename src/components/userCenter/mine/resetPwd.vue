<template>
  <div class="resetPwd">
    <div class="tab-bar bgfff">
      <a href="javascript:;" :class="{'selected':currentTab == 1 }" @click="changeTab(1)">基本信息</a>
      <a href="javascript:;" :class="{'selected':currentTab == 2 }" @click="changeTab(2)">修改密码</a>
    </div>
    <div class="bgfff" style="margin-top: 20px">
       <div class="qualification-info" v-if="currentTab == 1">
        <p class="wx-tips">温馨提示：单位信息必须与“营业执照/GSP证书”上保持一致</p>
        <div class="flex-wrp login-account">
          <span class="label">登录账号:</span>
          <div class="flex-item">{{form.phone}}<span v-if="(form.loginName != null && form.loginName != '') && form.phone != form.loginName">/{{form.loginName}}</span></div>
        </div>
        <el-form class="form" :model="form" :rules="rules" ref="form" label-width="90px" inline>

          <el-form-item label="单位类型:">
            <el-select v-model="form.customerTypeId" placeholder="" disabled>
              <el-option
                v-for="item in customerType"
                :key="item.customerTypeId"
                :label="item.customerTypeName"
                :value="item.customerTypeId" >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="责任业务员:">
             <span>{{form.partnerName}}<template v-if="form.partnerPhone">（{{form.partnerPhone}}）</template></span>
          </el-form-item>
          <el-form-item label="联 系 人:" prop="linkName">
            <el-input v-model="form.linkName" placeholder="" :class="form.linkName == '' && beginVarify?'required-filed':''" :disabled="!canEdit" maxlength10></el-input>
          </el-form-item>
          <el-form-item label="联系方式:" prop="companyLandline">
            <el-input v-model="form.companyLandline" placeholder=""  :disabled="!canEdit" maxlength="20" @keyup.native="handleRegTel"></el-input>
          </el-form-item>

          <el-form-item label="单位名称:" class="w100" prop="companyName">
            <el-input v-model="form.companyName" placeholder="" :disabled="!canEdit  || form.auditStatus != 0"></el-input>
          </el-form-item>
          <el-form-item label="所在区域:" class="w100" prop="areaArr">
            <el-cascader v-model="form.areaArr" :options="areaList" :props="searchProps" :disabled="!canEdit  || form.auditStatus != 0"></el-cascader>
          </el-form-item>
           <el-form-item class="w100" label="单位地址:" prop="companyAddress">
            <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" resize="none" v-model="form.companyAddress" placeholder="" :class="form.companyAddress == '' && beginVarify?'required-filed':''" :disabled="!canEdit" maxlength="120"></el-input>
          </el-form-item >
           <el-form-item class="w100" label="收货地址:"  prop="address">
            <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2}"  resize="none" v-model="form.address" placeholder="" :class="form.address == '' && beginVarify?'required-filed':''" :disabled="!canEdit  || form.auditStatus != 0" maxlength="120"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-box">
          <el-button type="primary" class="btn-submit" v-if="!canEdit" @click="canEdit = true;beginVarify = true">修改</el-button>
          <el-button type="" class="btn-submit btn-cancel" v-if="canEdit" @click="handleCancel">取消</el-button>
          <el-button type="primary" class="btn-submit" v-if="canEdit" @click="handleSubmit">保存</el-button>
        </div>
      </div>
      <el-form class="reset-form" ref="form2" :rules="rules2" :model="form" label-width="95px" v-if="currentTab == 2">
        <el-form-item label="登录账号：" class="item-first">
          {{userInfo.phone}} <span v-if="userInfo.loginName != null && userInfo.phone != userInfo.loginName">/{{userInfo.loginName}}</span>
        </el-form-item>
        <el-form-item label="旧密码：" prop="oldPwd">
          <el-input
          placeholder=""
          type="password"  v-model.trim="form.oldPwd"  maxlength="16" size="small"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPwd">
          <el-input
          placeholder=""
          type="password"  v-model.trim="form.newPwd" maxlength="16" size="small"></el-input>
          <span class="input-tips">密码6-16个字符，由字母、数字组成，注意区分大小</span>
        </el-form-item>
        <el-form-item label="确认密码：" prop="reNewPwd">
          <el-input
          placeholder=""
          type="password" v-model.trim="form.reNewPwd" maxlength="16" size="small"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" class="login-button" @click="handleUpPwd('form2')" :loading="loading" :disabled="!form.oldPwd||!form.newPwd||!form.reNewPwd">保存
        </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import API from "../../../api/api_mine";
  import API2 from "../../../api/api_user";

  export default {
    name: 'login',
    data() {
      let  regPwd = (rule, value, callback) => {
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/

        if (!reg.test(value.trim())) {
          callback(new Error(' '));
        } else {
          callback();
        }
      };
      return {
        currentTab: 1,
        canEdit: false,
        beginVarify: false,
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
        tempForm: {},
        userInfo:{},
        searchProps: {
          label: "name",
          children: 'children',
          value: "areaId",
        },
        areaList:[],
        rules:{
          companyName:[
            {required: true, message: ' ', trigger: 'blur' }
          ],
          companyAddress:[
            {required: true, message: ' ', trigger: 'blur' }
          ],
          areaArr:[
            {required: true, message: ' ', trigger: 'change'}
          ],
          linkName:[
            {required: true, message: ' ', trigger: 'blur'}
          ],
          companyLandline:[
            {required: true, message: ' ', trigger: 'blur'}
          ],
          address:[
            {required: true, message: ' ', trigger: 'blur'}
          ]
        },
        rules2:{
          oldPwd:[
            { required: true, message: ' ', trigger: 'blur' },
          ],
          newPwd:[
            { required: true, message: ' ', trigger: 'blur' },
            { validator: regPwd, trigger: 'blur' }
          ],
          reNewPwd:[
            { required: true, message: ' ', trigger: 'blur' },
            { validator: regPwd, trigger: 'blur' }
          ]
        },
        verificationCodeList: [],
        verificationCode: "",//验证码
        codeIsSuccess: false,//验证码是否验证成功
        rememberPwd: false,//记住密码
        loading: false,
        imgCheck: "",
        getImg: "",
        token: "",
        areaList:[],
        customerType:[],   // 单位类型
      }
    },
    created(){
      this.getInfo();
    },
    mounted(){
      let userInfo = JSON.parse(window.localStorage.getItem('b2b-access-user'));
      this.userInfo = userInfo;
      console.log(this.userInfo)
    },
    methods: {
      changeTab(num){
        this.currentTab = num;
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
            this.form = res.data;
            this.tempForm = JSON.parse(JSON.stringify(res.data));
            // 如果用户没有选择单位类型，默认传1，获取零售单体的证件信息
            if(res.data.customerTypeId == null || res.data.customerTypeId == '') {
              this.form.customerTypeId = "";
              this.originCustomerTypeId = "";
              this.tempForm.customerTypeId = "";
            }
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      handleRegTel(){
        this.form.companyLandline = this.form.companyLandline.replace(/[^\d\-\d]/g,'')
      },
      // 点击取消
      handleCancel(){
        this.form = JSON.parse(JSON.stringify(this.tempForm));
        this.canEdit = false;
      },
      handleSubmit(){
        let regGh =/^((0\d{2,3}-\d{7,8})|(1\d{10}))$/;
        if (this.form.companyName == '' || this.form.areaArr == '' || this.form.companyAddress == '' || this.form.address == '' || this.form.linkName == '' || this.form.companyLandline == '') {
          this.$message.warning("请检查必填项!")
          return;
        }
        if(this.form.companyLandline && this.form.companyLandline != "") {
          if(!regGh.test(this.form.companyLandline)) {
            this.$message.warning("联系方式格式不正确!")
            return;
          }
        }
        if(this.form.areaArr) {
          this.form.area = this.form.areaArr[2];
        }
        API.upInfoBasic(this.form).then((res) => {
          if (res.code == 0) {
            this.getInfo();
            this.$message.success("操作成功");
            this.canEdit = false;
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      handleUpPwd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.form.newPwd != this.form.reNewPwd) {
              this.$message.error("两次输入的密码不一致")
              return;
            }
            this.loading = true;
            API.upPwdByOldPwd(this.form).then((res) => {
              this.loading = false;
              if (res.code == "0") {
                this.$message.success("重置成功，请使用新密码登录");
                localStorage.removeItem("b2b-access-user");
                localStorage.removeItem("b2b-access-token");
                localStorage.removeItem("setValidityTime");
                localStorage.removeItem("setTime");
                this.$router.push({
                  name: "login"
                });
              } else {
                this.$message.error(res.msg);
              }
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$message.error("密码格式错误");
          }
        })

      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .resetPwd{
    .title{
      padding: 6px 23px;
      font-size: 14px;
      color: #333333;
      background: #F8F8F8;
    }
    .qualification-info{
      padding: 0 30px 200px 30px;
      .wx-tips{
        padding: 15px 0 10px;
        font-size: 14px;
        color: #F3A707;
      }
      .login-account{
        font-size: 14px;
        color: #666666;
        .label{
          display: inline-block;
          width: 73px;
          text-align: left;
        }
        .flex-item{
          padding-left: 20px;
        }
      }
      .el-form{
        .el-form-item__content{
          width: 320px;
        }
        .el-input__inner,.el-textarea__inner{
          padding: 0 5px;
          height: 32px;
          line-height: 32px;
          border: 1px solid #DEDEDE !important;
          border-radius: 0;
        }
        .el-form-item__label{
          text-align: left;
        }
        .el-cascader {
          width: 100%;
        }
      }
      .el-form-item {
        margin-right: 0 !important;
        line-height: 32px;
        width: 49%;
        margin-bottom: 10px;
        vertical-align: middle !important;
        &.w100{
          width: 100%;
          .el-form-item__content{
            width: 774px;
          }
        }
      }
      .is-disabled{
        .el-input__inner,.el-textarea__inner {
          background: transparent !important;
          border: none !important;
          color: #666;
          cursor: text !important;
        }
        .el-select__caret, .el-input__icon{
          display: none;
        }
      }
      .el-date-editor .el-range-separator {
        padding: 0 15px
      }
      .btn-box{
        margin-top: 30px;
        .el-button+.el-button{
          margin-left: 22px;
        }
      }
      .btn-submit{
        padding: 12px 51px;
        border-radius: 0;
      }
    }

    .reset-form{
      padding: 50px 42px 300px 42px;
      width: 325px;
      .input-tips{
        position: absolute;
        left: 355px;
        font-size: 12px;
        width: 123%;
        color: #999999
      }
      .item-first{
        color: #333333;
        .el-form-item__label{
          color: #333;
        }
      }
      .el-form-item__content{
        line-height: 32px;
      }
      .el-form-item{
        margin-bottom: 15px;
      }
      .el-form-item__label{
        line-height: 32px;
        color: #666666;
      }
      .el-input__inner{
        width: 334px;
        border: 1px solid #D2D2D2;
        border-radius: 0;
      }
      .login-button{
        padding: 12px 51px;
        border-radius: 0;
      }
    }
  }
</style>
