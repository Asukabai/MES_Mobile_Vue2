const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  // 修改 publicPath
  publicPath: process.env.NODE_ENV === 'production' ? '/sensor/ddingWork/' : '/',
  transpileDependencies: true,
  devServer: {
    port: 8080,
    historyApiFallback: true, // ⬅️ 添加这一行
    proxy: {
      '/ding/pack': {
        target: 'https://api-v2.sensor-smart.cn:22027/ss-proxy/p35001',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/ding/pack': ''
        }
      }
    }
  }
})
