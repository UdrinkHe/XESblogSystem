<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="auth-title">欢迎</h1>
      <el-tabs v-model="activeTab" class="custom-tabs">
        <el-tab-pane label="登录" name="login">
          <login-form></login-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
          <register-form @registerSuccess="turnToLogin"></register-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';

export default {
  name: 'AuthPage',
  components: {
    LoginForm,
    RegisterForm
  },
  data() {
    return {
      activeTab: 'login'
    };
  },
  methods: {
    turnToLogin() {
      this.activeTab = 'login';
    }
  }
};
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-container {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
}

.auth-title {
  text-align: center;
  color: #333;
  font-size: 28px;
  margin-bottom: 30px;
}

.custom-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.custom-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #e0e0e0;
}

.custom-tabs :deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px;
}

.custom-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  color: #666;
  padding: 0 20px 12px;
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  color: #409EFF;
  font-weight: 600;
}
</style>