import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

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
        component: () => import(/* webpackChunkName: "group-home" */ '../views/Home.vue')
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
