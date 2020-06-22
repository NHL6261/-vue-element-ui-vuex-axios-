import Vue from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import '@/css/global.css'
import '@/plugins/element.js';
import * as http from '@/api'
Vue.prototype.$http = http
import axios from 'axios'
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
axios.interceptors.request.use(config => {
    // 将请求到的json类型转换成stringify类型 url认识的形式
    // 将token 放到请求头当中
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

Vue.prototype.$ajax = axios
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');