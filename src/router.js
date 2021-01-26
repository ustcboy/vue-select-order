import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

export var cRouters = [
    {
        path:'home',
        component:()=>import('@/views/home'),
        meta:{title:'系统首页', icon:'el-icon-s-home', role:['user', 'admin']}
    },
    {
        path:'user',
        component:()=>import('@/views/user'),
        meta:{title:'用户管理', icon:'el-icon-user-solid', role:['admin']}
    },
    {
        path:'device',
        component:()=>import('@/views/device'),
        meta:{title:'设备管理', icon:'el-icon-s-platform', role:['admin']}
    },
    {
        path:'deviceStore',
        component:()=>import('@/views/device'),
        meta:{title:'设备仓库', icon:'el-icon-s-platform', role:['user']}
    },
    {
        path:'order',
        component:()=>import('@/views/order'),
        meta:{title:'订单管理', icon:'el-icon-s-order', role:['user', 'admin']}
    }
]

export default new Router({
    routes:[
        {
            path:'/',
            redirect:'/home'
        },
        {
            path:'/',
            component:Layout,
            meta:{title:''},
            children:cRouters
        },
        {
            path: '/login',
            component: () => import('@/views/login'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})