<template>
  <div class="set-pwd">
    <div class="w1200">
      <div class="flex-wrp reg-container">
        <el-form class="form" :model="form" :rules="rules" ref="form" label-width="130px">
          <el-form-item class="tips-title">设置密码</el-form-item>
          <el-form-item label="登录密码" prop="newPwd">
            <el-input type="password" v-model="form.newPwd" placeholder="" maxlength="16" show-password></el-input>
            <p class="tips">密码6-16个字符，建议由字母、数字组成，注意区分大小写！</p>
          </el-form-item>
          <el-form-item label="确认密码" prop="renewPwd">
            <el-input type="password" v-model="form.renewPwd" placeholder="" maxlength="16" show-password></el-input>
            <p class="tips">请确认密码</p>
          </el-form-item>
          <el-form-item>
            <el-button class="btn-submit" type="primary" @click="save('form')">保存</el-button>
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
      } else  if(value != this.form.newPwd){
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    return{
      form:{
        password:'',
        repassword:''
      },
      code: '',
      rules:{
        newPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: regPwd, trigger: 'blur' }
        ],
        renewPwd:[
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: regPwd2, trigger: 'blur' }
        ],
      }
    }
  },
  mounted(){
    let code = this.$route.query.code;
    if(code != "") {
      this.code= code;
    }
  },
  methods:{
    save(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          API.resetPwd({code: this.code,newPwd : this.form.newPwd}).then( (res) => {
            if(res.code == 0) {
              this.$router.replace({
                path: '/regHome/setPwdSuc'
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
  .set-pwd{
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
      background: #ccc;
    }
    .form{
      margin: 74px auto;
      text-align: center;
      .el-form-item{
        margin-bottom: 27px;
      }
      .tips-title{
        font-size: 16px;
        color: #333;
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
        padding-top: 13px;
        font-size: 12px;
        color: #666;
        white-space: nowrap;
      }
      .el-form-item__error{
        padding-left: 10px;
        left: 100%;
        top:10px;
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
