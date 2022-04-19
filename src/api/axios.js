import http from "../service/http.js"

/* 订单管理 */

/* 获取订单列表 */
export const getOrders = ({ query, pagenum, pagesize }) => http.get("orders", { params: { query, pagenum, pagesize }, })

/* 获取物流信息 已失效 */
/* export const getWuliuById = () => {
    return http.get('/kuaidi/1106975712662')
} */

/* 获取统计数据 */
export const getReportsdata = () => http.get("/reports/type/1")