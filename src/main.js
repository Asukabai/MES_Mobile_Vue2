import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

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

// 解析 URL 中的部门信息  /sensor/ddingWork/xian/index.html
function getDepartmentFromURL() {
  // 将当前页面路径按 '/' 分割成数组 ['', 'sensor', 'ddingWork', 'xian', 'index.html']
  const pathParts = window.location.pathname.split('/')
  console.log('路径分割结果:', pathParts); // 调试信息：显示完整的路径分割数组

  // 查找 'ddingWork' 在路径数组中的索引位置 indexOf('ddingWork') 找到索引为 2
  const basePathIndex = pathParts.indexOf('ddingWork')
  console.log('ddingWork 索引位置:', basePathIndex); // 调试信息：显示 ddingWork 的索引位置

  // 检查是否找到了 'ddingWork' 且其后面还有路径段 basePathIndex + 1 等于 3
  if (basePathIndex !== -1 && pathParts[basePathIndex + 1]) {
    const department = pathParts[basePathIndex + 1];
    console.log('获取到的部门信息:', department); // 调试信息：显示获取到的部门信息
    // 返回 'ddingWork' 后面的路径段作为部门信息
    return department;
  }

  console.log('未找到有效的部门信息'); // 调试信息：未找到部门信息时的提示
  // 如果没找到或后面没有路径段，返回 null
  return null;
}

const urlParams = getURLParams()
const department = getDepartmentFromURL()

// 将参数保存到 Vuex 中
if (urlParams.param1 || urlParams.param2 || urlParams.param3) {
  store.commit('SET_URL_PARAMS', urlParams)
}

// 如果从 URL 中获取到部门信息，设置到 store 中
if (department) {
  console.log('保存部门信息到 Vuex:', department); // 调试日志
  store.commit('SET_DEPARTMENT', department)
  // 同时保存到 localStorage
  localStorage.setItem('department', department)
  console.log('部门信息保存完成，当前 store 状态:', store.state.department); // 调试日志
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
