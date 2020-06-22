import Vue from 'vue';
import Vuex from 'vuex';
import { getLoginInfo } from '@/api'
import { SAVE_LOGININFO } from './mutations_type.js'


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        init: '测试数据', // state 测试数据
        userInfo: [], // 存放 用户信息
    },
    mutations: {
        [SAVE_LOGININFO](state, userInfo) {
            state.userInfo = userInfo
        }
    },
    actions: {
        async getLoginInfoAction({ commit }) {
            let result = await getLoginInfo()
            commit(SAVE_LOGININFO, result.data)
        }
    },
    modules: {},
});