import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // 确保引入了 Vuex Store

// 引入 Vant 及其样式
import Vant from 'vant'
import 'vant/lib/index.css'
import downloadManager from './plugins/downloadManager'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(Vant)
Vue.use(downloadManager)
Vue.config.productionTip = false

// 解析 URL 查询参数
function getURLParams() {
  const search = window.location.search || window.location.hash.split('?')[1] || ''
  const params = new URLSearchParams(search)
  return {
    param1: params.get('param1'),
    param2: params.get('param2'),
    param3: params.get('param3')
  }
}

const urlParams = getURLParams()

// 将参数保存到 Vuex 中
if (urlParams.param1 || urlParams.param2 || urlParams.param3) {
  store.commit('SET_URL_PARAMS', urlParams)
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

// 可选：用于调试插件是否正确挂载
Vue.mixin({
  created() {
    if (this.$downloadManager) {
      console.log('✅ $downloadManager 已挂载')
    } else {
      console.warn('❌ $downloadManager 未挂载')
    }
  }
})
