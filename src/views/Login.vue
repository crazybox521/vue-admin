<template>
  <div class="login-container">
    <div class="login-box">
      <div class="img-wrap">
        <img src="../assets/login.png" alt="" />
      </div>
      <div class="form-wrap">
        <h2>后台管理</h2>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          class="login-form"
        >
          <!-- 账号 -->
          <el-form-item prop="username">
            <el-input
              type="username"
              v-model="ruleForm.username"
              autocomplete="off"
            >
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
            >
              <i slot="prefix" class="el-input__icon el-icon-key"></i>
            </el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item>
            <el-button
              style="width: 100%"
              type="primary"
              @click="login('ruleForm')"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
        <div class="icon-wrap">
          <div class="icon-wrap-item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-QQ"></use>
            </svg>
          </div>
          <div class="icon-wrap-item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-weixin"></use>
            </svg>
          </div>
          <div class="icon-wrap-item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-facebook1"></use>
            </svg>
          </div>
          <div class="icon-wrap-item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-google"></use>
            </svg>
          </div>
          <div class="icon-wrap-item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-weibo1"></use>
            </svg>
          </div>
          <div class="icon-wrap-item">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhifubaorenzheng"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { doLogin } from '../api/user'
export default {
  name: 'Login',
  data() {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      /* 校验规则 */
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.ruleForm.username = 'admin'
    this.ruleForm.password = '123456'
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await doLogin(this.ruleForm).then((res) => {
            console.log(res)
            const data = res.data
            if (data.meta.status !== 200) return this.$message.error('登陆失败')
            this.$message({
              message: '登陆成功',
              type: 'success'
            })
            sessionStorage.setItem('userName',this.ruleForm.username)
            sessionStorage.setItem('token', data.data.token)
            this.$router.push('/home')
          })
          console.log('222')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  // background-image: linear-gradient(40deg, #ecf5ff, #66b1ff);
  background-image: url('../assets/bg-login.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .login-box {
    width: 800px;
    height: 460px;
    border-radius: 10px;
    box-shadow: -3px 5px 8px 0 #777;
    // background: rgba(255, 255, 255, 0.4);
    // backdrop-filter: blur(20px);
    background-color: #fff;
    display: flex;
    .img-wrap {
      box-sizing: border-box;
      width: 480px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 400px;
      }
    }
    .form-wrap {
      box-sizing: border-box;
      padding-top: 50px;
      width: 320px;
      text-align: center;
      .login-form {
        width: 280px;
        margin: 0 auto;
      }
      .icon-wrap{
        display: flex;
        width: 200px;
        margin: 0 auto;
        justify-content: space-around;
        &-item{
          font-size: 20px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>