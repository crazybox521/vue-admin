<template>
  <div class="login-container">
    <div class="login-box">
      <!-- logo区域 -->
      <div class="logo-box">
        <img src="../assets/logo.png" alt="logo.png" />
      </div>
      <!-- 标题区域 -->
      <div class="login-header">
        <h1>后台管理系统</h1>
      </div>
      <!-- 表单区域 -->
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
          <el-button type="primary" @click="login('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { doLogin } from '../api/axios'
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
  methods: {
    login(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await doLogin(this.ruleForm).then((res) => {
            console.log(res)
            const data = res.data
            console.log('111')
            if (data.meta.status !== 200) return this.$message.error('登陆失败')
            this.$message({
              message: '登陆成功',
              type: 'success'
            })
            sessionStorage.setItem('token', data.data.token)
            this.$router.push('/home')
          })
          console.log('222')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  display: -webkit-flex;
  display: flex;
  height: 100%;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background-color: #264a6b;
  .login-box {
    border: 1px solid black;
    width: 600px;
    height: 400px;
    background-color: #fff;
    border-radius: 20px;
    text-align: center;

    .logo-box {
      border-radius: 50%;
      margin: 0 auto;
      width: 200px;
      height: 200px;
      margin-top: -60px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .login-form {
      width: 300px;
      margin: 10px auto 0;
    }
  }
}
</style>