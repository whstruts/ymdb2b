<template>
  <div class="find-pwd">
    <div class="w1200">
      <div class="flex-wrp reg-container">
        <el-form class="form":model="form" :rules="rules" ref="form" label-width="130px">
          <el-form-item class="tips-title">请输入要找回密码的账号</el-form-item>
          <el-form-item label="手机号" prop="account">
            <el-input v-model="form.account" placeholder=""  @keyup.native="handleChange" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item class="imgcode-item" label="图形验证码" prop="randomString">
            <el-input v-model="form.randomString" placeholder="" maxlength="4"></el-input>
            <div class="img-code-box"  :style="{backgroundImage: 'url('+ imgCodeUrl +')'}" @click="getImgCode()"></div>
          </el-form-item>
          <el-form-item class="sms-item" label="短信验证码" prop="smsCode">
            <el-input v-model="form.smsCode" placeholder="" maxlength="6"></el-input>
            <el-button type="primary" class="btn-code"  @click="getCode">{{verifyBtn}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="btn-submit" type="primary" @click="nextStep('form')">下一步</el-button>
            <p class="tips">手机号码已停用？收不到短信验证码，您可拨打右上角的客服热线联系找回</p>
          </el-form-item>
        </el-form>
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
      } else {
        callback();
      }
    };
    return{
      form:{
        account:'',
        randomString:'',
        smsCode: ''
      },
      imgCodeUrl: '',
      verifyBtn: '获取验证码',
      rules:{
        account: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: regPhone, trigger: 'blur' }
        ],
        randomString:[
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ],
        smsCode:[
          {required: true, message: '请输入短信验证码', trigger: 'blur'}
        ],
      }
    }
  },
  created(){
    this.getImgCode();
  },
  methods:{
    // 获取图片验证码
    getImgCode(){
      let timestamp = new Date().getTime();
      this.timestamp = timestamp;
      this.imgCodeUrl = API.imgCode() +"?timestamp=" + timestamp;
    },
    handleChange(evt){
      this.$nextTick(()=>{
        this.form.account =  evt.target.value.replace(/[^\d]/g,'');
      })
    },
    getCode(){
      if (!this.isCountDown) {
        let that = this;
        let count = 120;
        if(!(/^1[23456789]\d{9}$/.test(that.form.account))){
          that.$message.error("请输入正确的手机号");
          return;
        }
        if(that.form.randomString == ''){
          that.$message.error("请输入图形验证码");
          return;
        }
        that.isCountDown = true;
        API.smsFindPwd({phone: that.form.account, timestamp: that.timestamp,randomString: that.form.randomString}).then((result)=> {
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
    nextStep(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          API.findPwd(this.form).then( (res) => {
            if(res.code == 0) {
              this.$router.replace({
                path: '/regHome/setPwd?code=' + res.data
              })
            } else {
              this.$message.error(res.msg);
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .find-pwd{
    .reg-container{
      margin-left: -260px;
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
      margin: 74px auto;
      text-align: center;
      .el-form-item{
        margin-bottom: 27px;
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
      .tips-title{
        .el-form-item__content{
          font-size: 16px;
          color: #333;
        }
      }
      .el-form-item__label{
        color: #333;
      }
      .el-form-item__content{
        width: 300px;
      }
      .el-input__inner{
        width: 300px;
        height: 35px;
        line-height: 35px;
        border-radius: 5px;
        border-color: #F5F5F5;
        background: #F5F5F5;
      }
      .tips{
        line-height: 1;
        padding-top: 20px;
        font-size: 14px;
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
        height: 47px;
        line-height: 47px;
        padding: 0;
      }
    }
  }
</style>
