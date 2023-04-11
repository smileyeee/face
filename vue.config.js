const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {// 跨域代理
      '/api': {
        // target: 'http://' + env.VUE_APP_BASE_API,
        target: 'http://localhost:8000', //
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
      // 代理 WebSocket 或 socket
      // '/socket.io': {
      //   target: 'ws://localhost:3000',
      //   ws: true
      //  }
    }
  }
})
