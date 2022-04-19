import axios from 'axios'
import NProgress from 'nprogress'

const http = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1',
    timeout: 3000,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
});


/* 配置拦截器，在config中给header添加Authorization */
http.interceptors.request.use((config) => {
    NProgress.start();
    config.headers.Authorization = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : ''
    return config
})

http.interceptors.response.use((config) => {
    NProgress.done();
    return config
})

export default http