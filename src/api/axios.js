import axios from 'axios'
import NProgress from 'nprogress'

/* 根路径 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1';
// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/* 配置拦截器，在config中给header添加Authorization */
axios.interceptors.request.use((config) => {
    NProgress.start();
    config.headers.Authorization = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : ''
    return config
})

axios.interceptors.response.use((config) => {
    NProgress.done();
    return config
})


/* 分别暴露各api请求 */

/* 登录请求 */
export const doLogin = (obj) => {
    let {
        username,
        password
    } = obj
    return axios({
        method: 'post',
        url: '/login',
        data: {
            username,
            password
        }
    })
}

/* 导航 */
export const getPermission = () => {
    return axios.get('/menus')
}

/* 用户页 */

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
    const {
        id,
        email,
        mobile
    } = obj
    return axios.put(`/users/${id}`, {
        mobile,
        email
    })
}

/* 删除用户 */
export const deleteUser = (id) => {
    return axios.delete('/users/' + id)
}

/* 权限页 */

/* 获取权限列表 */
export const getRightsList = (type) => {
    return axios.get('/rights/' + type)
}

/* 角色页 */

/* 获取角色列表 */
export const getRoles = () => {
    return axios.get('/roles')
}

/* 添加角色 */
export const addRole = (obj) => {
    return axios.post('/roles', obj)
}

/* 根据ID获取角色信息 */
export const getRoleById = (id) => {
    return axios.get(`roles/${id}`)
}

/* 提交编辑角色 */
export const editRole = (roleId, roleName, roleDesc) => {
    return axios.put(`roles/${roleId}`, {
        roleName,
        roleDesc
    })
}

/* 删除角色 */
export const deleteRole = (id) => {
    return axios.delete('roles/' + id)
}

/* 移除角色下某一权限 */
export const deleteRoleRight = (roleId, rightId) => {
    return axios.delete(`roles/${roleId}/rights/${rightId}`)
}

/* 分配权限提交 */
export const setRoleRight = (id, roleId) => {
    return axios.post(`/roles/${id}/rights`, {
        roleId
    })
}

/* 设置用户角色 */
export const setUserRole = (id, rid) => {
    return axios.put(`/users/${id}/role`, {
        rid
    })
}

/* 商品分类页 */

/* 获取商品分类列表 */
export const getCataList = (obj) => {
    return axios.get('/categories', {
        params: obj
    })
}

/* 添加商品分类 */
export const addCate = (obj) => {
    return axios.post('/categories', obj)
}

/* 删除商品分类 */
export const deleteCate = (id) => {
    return axios.delete('categories/' + id)
}

/* 根据ID查找对应分类信息 */
export const queryCateById = (id) => {
    return axios.get('categories/' + id)
}

/* 编辑分类提交更新 */
export const editCate = (id, cat_name) => {
    return axios.put('categories/' + id, {
        cat_name
    })
}

/* 获取动态参数/静态属性列表 */
export const getParamsList = (id, sel) => {
    return axios.get(`categories/${id}/attributes`, {
        params: {
            sel
        }
    })
}

/* 添加动态或静态参数 */
export const addParam = (id, attr_name, attr_sel) => {
    return axios.post(`categories/${id}/attributes`, {
        attr_name,
        attr_sel
    })
}

/* 删除动态或静态参数 */
export const delParam = (id, attrid) => {
    return axios.delete(`categories/${id}/attributes/${attrid}`)
}

/* 根据ID查询参数 */
export const queryParamById = (id, attrId) => {
    return axios.get(`categories/${id}/attributes/${attrId}`)
}

/* 编辑参数提交 */
export const editParam = (id, attrId, attr_name, attr_sel) => {
    return axios.put(`categories/${id}/attributes/${attrId}`, {
        attr_name,
        attr_sel
    })
}

/* 商品管理 */

/* 获取商品列表 */
export const getGoodsList =(obj) => {
    return axios.get('goods',{
        params:obj
    })
}

/* 删除商品*/
export const deleteGood =(id) => {
    return axios.delete('goods/'+id)
}

/* 添加商品 */
export const addGood =(addGoodObj) => {
    return axios.post('goods',addGoodObj)
}
 
/* 订单管理 */

/* 获取订单列表 */
export const getOrders =(obj) => {
    return axios.get('orders',{
        params:obj
    })
}

/* 获取物流信息 */
export const getWuliuById =() => {
    return axios.get('/kuaidi/1106975712662')
}

/* 获取统计数据 */
export const getReportsdata = () => {
    return axios.get('/reports/type/1')
}