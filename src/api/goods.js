import http from '../service/http.js'

/* 商品分类页 */

/* 获取商品分类列表 */
export const getCataList = ({ type, pagenum, pagesize }) => http.get('/categories', { params: { type, pagenum, pagesize } })

/* 添加商品分类 */
export const addCate = ({ cat_pid, cat_name, cat_level }) => http.post('/categories', { cat_pid, cat_name, cat_level })

/* 删除商品分类 */
export const deleteCate = (id) => http.delete('categories/' + id)

/* 根据ID查找对应分类信息 */
export const queryCateById = (id) => http.get('categories/' + id)

/* 编辑分类提交更新 */
export const editCate = (id, cat_name) => http.put('categories/' + id, { cat_name })

/* 获取动态参数/静态属性列表 */
export const getParamsList = (id, sel) => http.get(`categories/${id}/attributes`, { params: { sel } })

/* 添加动态或静态参数 */
export const addParam = (id, attr_name, attr_sel) => http.post(`categories/${id}/attributes`, { attr_name, attr_sel })

/* 删除动态或静态参数 */
export const delParam = (id, attrid) => http.delete(`categories/${id}/attributes/${attrid}`)

/* 根据ID查询参数 */
export const queryParamById = (id, attrId) => http.get(`categories/${id}/attributes/${attrId}`)

/* 编辑参数提交 */
export const editParam = (id, attrId, attr_name, attr_sel) => http.put(`categories/${id}/attributes/${attrId}`, { attr_name, attr_sel })

/* 商品管理 */

/* 获取商品列表 */
export const getGoodsList = (obj) => http.get('goods', { params: obj })

/* 删除商品*/
export const deleteGood = (id) => http.delete('goods/' + id)

/* 添加商品 */
export const addGood = ({ goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs }) =>
    http.post('goods', { goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs })