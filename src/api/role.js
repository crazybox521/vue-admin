import http from '../service/http.js'
/* 获取权限列表 */
export const getRightsList = (type) => http.get(`/rights/${type}`)

/* 获取角色列表 */
export const getRoles = () => http.get('/roles')

/* 添加角色 */
export const addRole = ({ roleName, roleDesc }) => {
    return http.post('/roles', { roleName, roleDesc })
}

/* 根据ID获取角色信息 */
export const getRoleById = (id) => http.get(`roles/${id}`)

/* 提交编辑角色 */
export const editRole = ({ roleId, roleName, roleDesc }) => http.put(`roles/${roleId}`, { roleName, roleDesc })

/* 删除角色 */
export const deleteRole = (id) => http.delete('roles/' + id)

/* 移除角色下某一权限 */
export const deleteRoleRight = (roleId, rightId) => http.delete(`roles/${roleId}/rights/${rightId}`)

/* 分配权限提交 */
export const setRoleRight = (id, rids) => http.post(`/roles/${id}/rights`, { rids })

/* 设置用户角色 */
export const setUserRole = (id, rid) => http.put(`/users/${id}/role`, { rid })