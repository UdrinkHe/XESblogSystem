<template>
  <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions } from 'vuex'  // 确保这行存在

export default {
  name: 'LoginForm',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapActions('auth', ['login']), // 从 Vuex auth 模块映射 login action
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 如果表单验证通过，尝试登录
          this.login(this.loginForm).then(success => {
            if (success) {
              // 登录成功
              this.$message({
                message: '登录成功',
                type: 'success'
              });
              this.$router.push('/scheduleBlock/mySchedule'); // 导航到日程页面
            } else {
              // 登录失败
              this.$message.error('登录失败，请检查用户名和密码');
            }
          });
        } else {
          // 表单验证失败
          this.$message.error('表单验证失败');
          return false;
        }
      });
    }
  }
};
</script>