import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/users/Users.vue'

/* 商品相关的路由 */
import Categories from '../views/goods/Categories.vue'
import Params from '../views/goods/Params.vue'
import Goods from '../views/goods/Goods.vue'
import AddGood from '../views/goods/AddGood.vue'


/* 权限相关路由 */
import Rights from '../views/permision/Rights.vue'
import Roles from '../views/permision/Roles.vue'

/* 数据报表 */
import Reports from '../views/reports/Reports.vue'

/* 订单路由 */
import Orders from '../views/orders/Orders.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/home',
        redirect: '/Welcome',
        component: () => import( /* webpackChunkName: "group-home" */ '../views/Home.vue'),
        children: [
            /* 欢迎页 */
            {
                path: '/welcome',
                component: Welcome,
            },
            /* 用户管理页 */
            {
                path: '/users',
                component: Users
            },
            /* 角色管理页 */
            {
                path: '/roles',
                component: Roles
            },
            /*  */
            {
                path: '/categories',
                component: Categories
            },
            /* 商品列表 */
            {
                path: '/params',
                component: Params
            },
            {
                path: '/goods',
                component: Goods
            },
            {
                path:'/addgood',
                component:AddGood
            },
            {
                path: '/rights',
                component: Rights
            },
            {
                path: '/reports',
                component: Reports
            },
            {
                path: '/orders',
                component: Orders
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
    document.title = '商城管理系统后台'
    next()
})

export default router