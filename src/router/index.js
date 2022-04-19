import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    /* 根路径 */
    {
        path: '/',
        redirect: '/login',
    },
    {
        /* 登录页 */
        path: '/login',
        /* 路由懒加载 */
        component: () => import( /* webpackChunkName: "group-home" */ '../views/Login.vue'),
    },
    {
        /* 首页 */
        path: '/home',
        redirect: '/Welcome',
        component: () => import( /* webpackChunkName: "group-home" */ '../views/Home.vue'),
        children: [
            /* 欢迎页 */
            {
                path: '/welcome',
                component: () => import( /* webpackChunkName: "group-home" */ '../views/Welcome.vue'),
            },
            /* 用户管理页 */
            {
                path: '/users',
                component: () => import( /* webpackChunkName: "group-users" */ '../views/users/Users.vue')
            },
            /* 角色管理页 */
            {
                path: '/roles',
                component: () => import( /* webpackChunkName: "group-permision" */ '../views/permision/Roles.vue')
            },
            /* 权限页 */
            {
                path: '/rights',
                component: () => import( /* webpackChunkName: "group-permision" */ '../views/permision/Rights.vue')
            },
            /* 商品分类 */
            {
                path: '/categories',
                component: () => import( /* webpackChunkName: "group-goods" */ '../views/goods/Categories.vue')
            },
            /* 商品参数 */
            {
                path: '/params',
                component: () => import( /* webpackChunkName: "group-goods" */ '../views/goods/Params.vue')
            },
            /* 商品 */
            {
                path: '/goods',
                component: () => import( /* webpackChunkName: "group-goods" */ '../views/goods/Goods.vue')
            },
            /* 添加商品 */
            {
                path: '/addgood',
                component: () => import( /* webpackChunkName: "group-goods" */ '../views/goods/AddGood.vue')
            },
            /* 数据报表 */
            {
                path: '/reports',
                component: () => import( /* webpackChunkName: "group-reports" */ '../views/reports/Reports.vue')
            },
            /* 订单 */
            {
                path: '/orders',
                component: () => import( /* webpackChunkName: "group-orders" */ '../views/orders/Orders.vue')
            },
            {
                path:'/settings',
                component:()=>import( /* webpackChunkName: "group-orders" */ '../views/setting/SystemSetting.vue')
            }
        ]
    }

]

const router = new VueRouter({
    mode: 'hash',
    routes
})

/* 路由前置守卫 */

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        document.title = '登录'
        return next()
    }

    const tokenStr = sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    document.title = '依云商城管理系统'
    next()
})

export default router