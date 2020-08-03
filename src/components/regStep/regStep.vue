<template>
  <div class="reg-step1">
    <div class="w1200">
      <div class="step-box">
        <!-- <el-steps :active="1" align-center>
          <el-step title="设置账户信息"></el-step>
          <el-step title="上传资质"></el-step>
          <el-step title="注册成功"></el-step>
        </el-steps> -->
      </div>
      <div class="flex-wrp reg-container">
        <el-form class="form" :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="所属地区" prop="area">
            <el-cascader v-model="form.area" :options="areaList" clearable :props="searchProps" @change="checkInviteCode"></el-cascader>
          </el-form-item>
          <el-form-item label="邀请码">
            <el-input v-model="form.invitedCode" placeholder="非必填"  @blur="checkInviteCode"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="form.phone" placeholder=""  @keyup.native="handleChange" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item class="imgcode-item" label="验证码" prop="randomString">
            <el-input v-model="form.randomString" placeholder="" max="4"></el-input>
            <div class="img-code-box"  :style="{backgroundImage: 'url('+ imgCodeUrl +')'}" @click="getImgCode()"></div>
          </el-form-item>
          <el-form-item class="sms-item" label="短信验证码" prop="smsCode">
            <el-input v-model="form.smsCode" placeholder="" maxlength="6"></el-input>
            <el-button type="primary" class="btn-code"  @click="getCode">{{verifyBtn}}</el-button>
          </el-form-item>
          <el-form-item class="pwd-item" label="登录密码" prop="password">
            <el-input type="password" v-model="form.password" placeholder="" maxlength="16"></el-input>
            <p class="tips">密码6-16个字符，建议由字母、数字组成，注意区分大小写！</p>
          </el-form-item>
          <el-form-item label="确认密码" prop="repassword">
            <el-input type="password" v-model="form.repassword" placeholder="" maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="单位名称" prop="companyName">
            <el-input v-model="form.companyName" placeholder="" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="单位地址" prop="companyAddress">
            <el-input v-model="form.companyAddress" placeholder="" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="linkName">
            <el-input v-model="form.linkName" placeholder="" maxlength="10"></el-input>
          </el-form-item>

          <el-form-item class="rember-item">
            <el-checkbox v-model="agreeBtn">阅读并同意</el-checkbox><a href="https://app.ymdb2b.com/xieyi.html" target="_blank">《平台协议》</a>
          </el-form-item>
          <el-form-item>
            <el-button class="btn-submit" type="primary" @click="handleReg('form')">注册</el-button>
          </el-form-item>
        </el-form>
        <div class="flex-item reg-notice">
          <h2>注册须知</h2>
          <p>1.请填写自己的手机号，方便下次登录时使用 <br/>2.邀请码为非必填项，填写邀请码是为给您分配责任业务员使用 <br/>2.注册过程中如有疑问，请拨打右上角的客服热线</p>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import API from "../../api/api_user";
export default {
  name:'regStep1',
  data(){
    let  regPhone = (rule, value, callback) => {
      let reg = /^1[23456789]\d{9}$/;
      if (!reg.test(value.trim())) {
        callback(new Error('手机号格式不正确'));
      } else if(reg.test(value.trim())){
        API.checkPhone({phone: this.form.phone}).then( (res) => {
          if (res.code == 0) {
            if (res.data == false) {
              callback(new Error('手机号已注册，请前往登录页找回密码'));
            } else {
              callback();

            }
          }
        })
      } else {
        callback();
      }
    };
    let  regPwd = (rule, value, callback) => {
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
      if (!reg.test(value.trim())) {
        callback(new Error('密码格式不正确'));
      } else {
        callback();
      }
    };
    let  regPwd2 = (rule, value, callback) => {
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
      if (!reg.test(value.trim())) {
        callback(new Error('密码格式不正确'));
      } else  if(value != this.form.password){
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    return{
      form:{
        phone:'',
        password:'',
        repassword: '',
        randomString: '',
        linkName: '',
        area:[]
      },
      imgCodeUrl: '',
      agreeBtn: false,
      verifyBtn: '获取验证码',
      timer: null,
      isCountDown: false,
      areaList:[],
      props: {
        label: "name",
        children: 'children',
        value: "areaId",
        multiple: true,
      },
      searchProps: {
        label: "name",
        children: 'children',
        value: "areaId",
      },
      rules:{
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: regPhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: regPwd, trigger: 'blur' }
        ],
        repassword:[
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: regPwd2, trigger: 'blur' }
        ],
        randomString:[
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ],
        smsCode:[
          {required: true, message: '请输入短信验证码', trigger: 'blur'}
        ],
        companyName:[
          {required: true, message: '请输入单位名称', trigger: 'blur'}
        ],
        companyAddress:[
          {required: true, message: '请输入单位地址', trigger: 'blur'}
        ],
        linkName:[
          {required: true, message: '请输入联系人', trigger: 'blur'}
        ],
        area:[
          {required: true, message: '请选择地区', trigger: 'change'}
        ]
      }
    }
  },
  mounted(){
    this.getImgCode();
    this.getAreaList();
  },
  methods:{
    // 获取图片验证码
    getImgCode(){
      let timestamp = new Date().getTime();
      this.timestamp = timestamp;
      this.imgCodeUrl = API.imgCode() +"?timestamp=" + timestamp;
    },
    // 获取省市区
    getAreaList(){
      API.getAreaList().then( (res) => {
        this.areaList = this.$utils.getTreeData(res.data);
      })
    },
    // 验证邀请码
    checkInviteCode(){
      if(this.form.area && this.form.area.length > 0 && this.form.invitedCode != "" && this.form.invitedCode != null) {
        API.matchAreaAndInvitedCode({area: this.form.area[2], invitedCode: this.form.invitedCode}).then( (res) => {
          if(res.code != 0) {
            this.$message.error(res.msg);
          }
        })
      }
    },
    handleChange(evt){
      this.$nextTick(()=>{
        this.form.phone =  evt.target.value.replace(/[^\d]/g,'');
      })
    },
    getCode(){
      if (!this.isCountDown) {
        let that = this;
        let count = 120;
        if(!(/^1[23456789]\d{9}$/.test(that.form.phone))){
          that.$message.error("请输入正确的手机号");
          return;
        }
        if(that.form.randomString == ''){
          that.$message.error("请输入图形验证码");
          return;
        }
        that.isCountDown = true;
        API.smsRegist({phone: that.form.phone, timestamp: that.timestamp,randomString: that.form.randomString}).then((result)=> {
          if (result.code === 0) {
            that.timer = setInterval(function(){
              if (count == 1){
                clearInterval(that.timer);
                that.verifyBtn = '获取验证码';
                that.isCountDown = false;
                return;
              }
              count--;
              that.verifyBtn = count +"s后重新获取"
            },1000)
            that.$message.success("验证码已发送！");
          } else {
            that.isCountDown = false;
            that.getImgCode()
            that.$message.error(result.msg);
          }
        })
      }
    },
    handleReg(formName){
      this.checkInviteCode();
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.agreeBtn) {
            this.$message.error("请先阅读并同意平台协议");
            return;
          }
          let form = JSON.parse(JSON.stringify(this.form));
          form.area = this.form.area[2];
          API.registerOne(form).then( (res) => {
            if(res.code == 0) {
              this.$router.replace({
                path: '/regHome/regStepSuc?phone=' + this.form.phone
              })
            } else {
              this.$message.error(res.msg);
            }
          })

        }else {
          return false;
        }

      })
    }
  }
}
</script>
<style lang="scss">
  .reg-step1{
    .reg-container{
      align-items: flex-start;
    }
    .img-code-box{
      position: absolute;
      left: 100%;
      top: 0;
      margin-left: 10px;
      width: 105px;
      height: 45px;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
    }
    .form{
      padding-left: 60px;
      .el-form-item{
        margin-bottom: 20px;
      }
      .el-form-item__label{
        color: #333;
      }
      .el-form-item__content{
        width: 281px;
      }
      .el-input__inner{
        width: 281px;
        height: 37px;
        line-height: 37px;
        border-radius: 5px;
        border-color: #cccccc;
      }
      .tips{
        line-height: 1;
        padding-top: 20px;
        font-size: 12px;
        color: #666;
        white-space: nowrap;
      }
      .el-form-item__error{
        padding-left: 10px;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        white-space: nowrap;
      }
      .imgcode-item{
        .el-form-item__error{
          left: 146%;
        }
      }
      .sms-item{
        .el-form-item__error{
          left: 146%;
        }
      }
      .pwd-item{
        .el-form-item__error{
          top: 25%;
        }
      }
      .btn-code{
        position: absolute;
        left: 100%;
        top: 8px;
        padding: 0;
        margin-left: 10px;
        width: 124px;
        height: 27px;
        line-height: 27px;
        font-size: 14px;
      }
      .rember-item{
        margin-top: -15px;
        line-height: 1;
        .el-checkbox{
          margin-right: 0;
        }
        a{
          color: #4DA1FB;
        }
      }
      .btn-submit{
        width: 100%;
      }
    }

    .reg-notice{
      margin-left: 240px;
      padding-left: 65px;
      padding-bottom: 355px;
      border-left: 1px solid #EEEEEE;
      color: #333;
      font-size: 14px;
      h2{
        font-size: 14px;
        font-weight: bold;
      }
      p{
        line-height: 30px;
      }
    }
  }
</style>
