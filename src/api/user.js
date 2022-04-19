import http from '../service/http.js'


/* 登录请求 */
export const doLogin = ({ username, password }) => http.post('/login', { username, password })

/* 导航 */
export const getPermission = () => http.get('/menus')

/* 用户页 */

/* 用户列表 */
export const getUsers = ({ query, pagenum, pagesize }) => http.get('/users', { params: { query, pagenum, pagesize } })

/* 改变用户状态 */
export const setUserState = (id, type) => http.put(`/users/${id}/state/${type}`)

/* 添加用户 */
export const addUser = ({ username, password, email, mobile }) => http.post('/users', { username, password, email, mobile })

/* 根据ID查找用户 */
export const queryUserById = (id) => http.get(`/users/${id}`)

/* 提交编辑信息 */
export const editUserSubmit = ({ id, email, mobile }) => http.put(`/users/${id}`, { mobile, email })

/* 删除用户 */
export const deleteUser = (id) => http.delete(`/users/${id}`)
