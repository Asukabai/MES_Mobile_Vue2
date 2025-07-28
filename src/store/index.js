import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        urlParams: null, // 存储从 URL 获取的参数
    },
    mutations: {
        SET_URL_PARAMS(state, params) {
            state.urlParams = params
        }
    },
    actions: {},
    modules: {}
})
