<template>
  <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
    <el-form-item prop="username">
      <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="registerForm.password" type="password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="email">
      <el-input v-model="registerForm.email" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item prop="verificationCode">
      <el-input v-model="registerForm.verificationCode" placeholder="验证码">
        <el-button slot="append" @click="sendVerificationCode" :disabled="cooldown > 0">
          {{ cooldown > 0 ? `${cooldown}秒后重试` : '发送验证码' }}
        </el-button>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="toRegister()">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        email: '',
        verificationCode: ''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      cooldown: 0
    };
  },
  methods: {
    
    sendVerificationCode() {//发送验证码
      // 在这里添加发送验证码的逻辑
      this.$axios.post('api/user/auth/send-verification-code', {email:this.registerForm.email}).then(()=>{
        this.$message({
          message: `发送验证码到 ${this.registerForm.email}`,
          type: 'info'
        });
        this.cooldown = 60;
        const timer = setInterval(() => {
          this.cooldown--;
          if (this.cooldown <= 0) {
          clearInterval(timer);
          }
        }, 1000);
      }).catch(()=>{
        this.$message.error('发送验证码失败');
      })
     
    },
    toRegister(){
      //验证表单中的数据不为空
      if(this.registerForm.username === '' || this.registerForm.password === '' || this.registerForm.email === '' || this.registerForm.verificationCode === ''){
        this.$message.error('表单数据不能为空');
        return;
      }
      const {username,password,email, verificationCode:code } = this.registerForm
      this.$axios.post('api/user/auth/register',{username,password,email, code }).then(()=>{
        this.$message.success('注册成功');
        this.$emit('registerSuccess');
      }).catch(()=>{
        this.$message.error('注册失败');
      })
    }
  }
};
</script>