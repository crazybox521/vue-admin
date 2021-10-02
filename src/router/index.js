import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/users/Users.vue'

/* 商品相关的路由 */
import Categories from '../views/goods/Categories.vue'
import Params from '../views/goods/Params.vue'
import Goods from '../views/goods/Goods.vue'


/* 权限相关路由 */
import Rights from '../views/permision/Rights.vue'
import Roles from '../views/permision/Roles.vue'

/* 数据报表 */
import Reports from '../views/reports/Reports.vue'

/* 订单路由 */
import Orders from '../views/orders/Orders.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/home',
        name: 'Home',
        redirect: '/Welcome',
        component: () => import(/* webpackChunkName: "group-home" */ '../views/Home.vue'),
        children: [
            /* 欢迎页 */
            {
                path: '/welcome',
                name: 'Welcome',
                component: Welcome,
            },
            /* 用户管理页 */
            {
                path: '/users',
                name: 'Users',
                component: Users
            },
            /* 角色管理页 */
            {
                path: '/roles',
                name: 'Roles',
                component: Roles
            },
            /*  */
            {
                path: '/categories',
                name: 'Categories',
                component: Categories
            },
            /* 商品列表 */
            {
                path: '/params',
                name: 'Params',
                component: Params
            },
            {
                path: '/goods',
                name: 'Goods',
                component: Goods
            },
            {
                path: '/rights',
                name: 'Rights',
                component: Rights
            },
            {
                path: '/reports',
                name: 'Reports',
                component: Reports
            },
            {
                path: '/orders',
                name: 'Orders',
                component: Orders
            }
        ]
    }

]

const router = new VueRouter({
    routes
})

/* 路由前置守卫 */

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const tokenStr = sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router
