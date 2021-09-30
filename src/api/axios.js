import axios from 'axios'

/* 根路径 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1';
/* axios.defaults.headers.common['Authorization'] = AUTH_TOKEN; */
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


/* 分别暴露各api请求 */

export const doLogin = (obj) => {
    let { username, password } = obj
    return axios({
        method: 'post',
        url: '/login',
        data: {
            username, password
        }
    })
}