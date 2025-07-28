const {defineConfig} = require("@vue/cli-service");
module.exports = defineConfig({
  // publicPath: './',
  publicPath: '/sensor_ddingWork/Release/',
  transpileDependencies: true,
  devServer: {
    port: 8080,
    historyApiFallback: true, // ⬅️ 添加这一行
    proxy: {
      '/ding/pack': { // 匹配所有以 '/ss-proxy' 开头的请求
        target: 'https://api-v2.sensor-smart.cn:22027/ss-proxy/p35001', // 目标服务器地址   https://api-v2.sensor-smart.cn:22027/ding/pack
        //  target: 'https://api-v2.sensor-smart.cn:22027/ding/pack', // 目标服务器地址   https://api-v2.sensor-smart.cn:22027/ding/pack
        changeOrigin: true, // 是否更改请求头中的 origin
        secure: false, // 如果是 https 接口，需要设置为 true
        pathRewrite: {
          '^/ding/pack': '' // 请求路径中去掉 '/ss-proxy'
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html')
        .tap(args => {
          args[0].title = "晟思工作助手";
          return args;
        })
  }
})
