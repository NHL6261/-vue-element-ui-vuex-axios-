import Vue from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import '@/css/global.css'
import '@/plugins/element.js';
import * as http from '@/api'
import axios from 'axios'
// 适配方案
// import './util/flexible.js'
import TreeTable from 'vue-table-with-tree-grid'
// 富文本编辑器对应 的样式
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
axios.interceptors.request.use(config => {
    // 将请求到的json类型转换成stringify类型 url认识的形式
    // 将token 放到请求头当中
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = http
Vue.prototype.$ajax = axios
Vue.config.productionTip = false;
Vue.component('tree-table', TreeTable)
    // 将富文本编辑器 注册为全局可用的组件
Vue.use(VueQuillEditor)
    // 定义全局过滤器
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
        //  年
    const y = dt.getFullYear()
        // 填充 月份
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
        // 填充日
    const d = (dt.getDate() + '').padStart(2, '0')
        // 填充小时
    const hh = (dt.getHours() + '').padStart(2, '0')
        // 填充分钟
    const mm = (dt.getMinutes() + '').padStart(2, '0')
        // 填充秒
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
    router,
    store,
    render: (h) => h(App),

}).$mount('#app');