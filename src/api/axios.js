import axios from 'axios'

/* 根路径 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1';
// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/* 配置拦截器，在config中给header添加Authorization */
axios.interceptors.request.use((config) => {
    config.headers.Authorization = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : ''
    return config
})


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

/* 导航 */
export const getPermission = () => {
    return axios.get('/menus')
}

/* 用户列表 */
export const getUsers = (obj) => {
    return axios.get('/users', {
        params: obj
    })
}

/* 改变用户状态 */
export const setUserState = (id, type) => {
    return axios.put(`/users/${id}/state/${type}`)
}

/* 添加用户 */
export const addUser = (obj) => {
    return axios.post('/users', obj)

}

/* 根据ID查找用户 */
export const queryUserById = (id) => {
    return axios.get(`/users/${id}`)
}

/* 提交编辑信息 */
export const editUserSubmit = (obj) => {
    const { id, email, mobile } = obj
    return axios.put(`/users/${id}`, {
        mobile, email
    })
}

/* 删除用户 */
export const deleteUser =(id) => {
    return axios.delete('/users/'+id)
}