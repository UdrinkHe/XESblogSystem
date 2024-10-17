import Vue from 'vue'

export default {
  namespaced: true, // 启用命名空间，避免与其他模块冲突
  state: {
    token: localStorage.getItem('token') || '', // 从本地存储获取token，如果没有则为空字符串
    user:null, // 存储用户信息,
    profileUrl:null, // 存储用户头像
    username:null // 存储用户名
  },
  getters: {
    // 检查用户是否已认证
    isAuthenticated: state => !!state.token,
    // 获取用户信息
    user: state => state.user,
    profileUrl: state => state.profileUrl,
    username: state => state.username
  },
  actions: {
    // 登录操作,要重新获取用户信息，因为app.vue中created钩子中会调用getUserInfo方法,但是只有一次
    async login({ commit,dispatch }, credentials) {
      try {
        const response = await Vue.prototype.$axios.post('/api/user/auth/login', credentials);
        const token = response.data.token;
        //先清除之前的token
        localStorage.removeItem('token');
        localStorage.setItem('token', token); // 将token保存到本地存储
        //重新调用fetchUser方法获取用户信息
        await dispatch('fetchUser');
        commit('SET_TOKEN', token);
        return true;
      } catch (error) {
        console.error('登录失败:', error);
        return false;
      }
    },
    
    // 登出操作
    async logout({ commit }) {
      commit('CLEAR_AUTH');
    },
    
    // 获取用户信息
    async fetchUser({ commit }) {
      try {
        const response = await Vue.prototype.$axios.post('/api/user/auth/getUserInfo');
        if(response.status === 200){
          console.log('获取用户信息成功')
          console.log(response.data)
          commit('SET_USER', response.data.userInfo);
          commit('SET_PROFILE_URL', response.data.userBaseInfo.profileUrl);
          commit('SET_USERNAME', response.data.userBaseInfo.name);
        }
      } catch (error) {
        if(error.response && error.response.status === 401){ 
          console.log('token失效，请重新登录')
          commit('CLEAR_AUTH')
        }
      }
    }
  },
  mutations: {
    // 设置token
    SET_TOKEN(state, token) {
      state.token = token;
    },
    // 设置用户信息
    SET_USER(state, user) {
      state.user = user;
    },
    // 设置用户头像
    SET_PROFILE_URL(state, profileUrl) {
      state.profileUrl = profileUrl;
    },
    //设置用户名
    SET_USERNAME(state, username) {
      state.username = username;
    },
    // 清除认证信息
    CLEAR_AUTH(state) {
      state.token = '';
      state.user = {};
      localStorage.removeItem('token');
    }
  }
};