import Vue from 'vue'
import VueRouter from 'vue-router'
//登录
import Login from '../components/Login.vue'
// 主页
import Home from '../components/Home.vue'
// 欢迎页面
import Welcome from '../components/Welcome.vue'

//商品列表
const Goods = () =>
    import ('@/components/goods/Goods.vue')

// sku管理
const Sku = () =>
    import ('@/components/sku/Sku')

// 店铺管理
const Store = () =>
    import ('@/components/store/Store')

// 订单管理
const Order = () =>
    import ('@/components/order/Order')

// 运费管理
const Freight = () =>
    import ('@/components/freight/Freight')


Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', name: 'Welcome', component: Welcome },
            { path: '/goods', name: 'Good', component: Goods },
            { path: '/sku', name: 'Sku', component: Sku },
            { path: '/store', name: 'Store', component: Store },
            { path: '/order', name: 'Order', component: Order },
            { path: '/freight', name: 'Freight', component: Freight }
        ],
    },
]

const router = new VueRouter({
    routes,
})

//添加路由守卫
router.beforeEach((to, form, next) => {
    //1.to 将要访问的路径
    //2.form 从哪个路径过来
    //3.next 是一个函数    next（）表示放行    next（'/login'）表示强制跳转

    //如果用户要访问登录路径，直接放行
    if (to.path === '/login') return next()
        //从sessionSTory中获取保存的token值

    var tokenStr = window.sessionStorage.getItem('token')
        //如果token不存在 跳转到登录界面
    if (!tokenStr) return next('/login')
        //如果token存在  放行
    next()
})

export default router