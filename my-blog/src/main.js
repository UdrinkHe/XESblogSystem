import Vue from 'vue'
import App from './App.vue'
import myRouter from './router/index.js'
import store from './store/index.js'
import Element from "element-ui";
import axios from 'axios';
import "element-ui/lib/theme-chalk/index.css";
import './css/common.css'
import { mavonEditor } from 'mavon-editor';
import 'mavon-editor/dist/css/index.css'; // 引入样式

Vue.config.productionTip = false
axios.defaults.baseURL = '/'
axios.defaults.headers.post['Content-Type'] = 'application/json'

Vue.component('mavonEditor', mavonEditor)
Vue.use(Element)
// 将 axios 直接挂载到 Vue 原型上的 $axios 属性
Vue.prototype.$axios = axios

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 获取当前请求的 URL 路径
    const path = config.url.split('/').pop()
    
    // 如果不是登录或注册请求，则添加 token 到请求头
    if (path !== 'login' && path !== 'register') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.log('token失效,请重新登录')
      //清除token
      localStorage.removeItem('token')
      store.commit('auth/CLEAR_AUTH')
      //注意判断存在多个请求触发后端401状态时不要重复路由操作
      if(myRouter.currentRoute.path !== '/auth'){
        myRouter.push('/auth')
      }
      else{
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

new Vue({
  render: h => h(App),
  router:myRouter,
  store,
}).$mount('#app')