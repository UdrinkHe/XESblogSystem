const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {                      //这里就是如果遇到自己要访问的路径里面有'/api'字                                                              //样就自动转化为下面target加在‘/api’去前面
        target: 'http://111.229.128.182:30001/', //这里写要访问的网址和端口
        changeOrigin: true, //用于控制请求头中的host值
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  }
})
