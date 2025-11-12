import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        urlParams: null, // 存储从 URL 获取的参数
        department: null // 需要添加部门状态
    },
    mutations: {
        SET_DEPARTMENT(state, department) {
            state.department = department;
        },
        SET_URL_PARAMS(state, params) {
            state.urlParams = params
        }
    },
    actions: {},
    modules: {}
})
