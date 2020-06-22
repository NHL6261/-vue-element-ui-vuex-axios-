import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
// 解决 重复点击报错问题
const originalReplace = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalReplace.call(this, location).catch(err => err);
};
const routes = [

    {
        path: '/register',
        name: 'Register',
        component: () =>
            import ('@/page/Register.vue'),
        meta: {
            title: '请您先注册'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('@/page/Login.vue'),
        meta: {
            title: '请您登录'
        }
    },
    {
        path: '/home',
        name: 'Home',
        redirect: '/welcome',
        component: () =>
            import ('@/page/Home.vue'),
        meta: {
            title: '用户主页'
        },
        children: [

            {
                path: '/welcome',
                name: 'Welcome',
                component: () =>
                    import ('@/components/Welcome.vue'),
                meta: {
                    title: 'Welcome your arrival'
                }
            },

            {
                path: '/classer',
                name: 'Classer',
                component: () =>
                    import ('@/components/Classer.vue'),
                meta: {
                    title: 'Classification parameter'
                }
            },

            {
                path: '/datalist',
                name: 'Datalist',
                component: () =>
                    import ('@/components/Datalist.vue'),
                meta: {
                    title: 'Data list'
                }
            },

            {
                path: '/list',
                name: 'List',
                component: () =>
                    import ('@/components/List.vue'),
                meta: {
                    title: 'List of goods'
                }
            },

            {
                path: '/rights',
                name: 'Rights',
                component: () =>
                    import ('../components/Rights.vue'),
                meta: {
                    title: 'Authority management'
                }
            },

            {
                path: '/rols',
                name: 'Rols',
                component: () =>
                    import ('../components/Rols.vue'),
                meta: {
                    title: 'Role list'
                }
            },
            {
                path: '/shclass',
                name: 'Shclass',
                component: () =>
                    import ('../components/Shclass.vue'),
                meta: {
                    title: 'Commodity classification'
                }
            },

            {
                path: '/shop',
                name: 'Shop',
                component: () =>
                    import ('../components/Shop.vue'),
                meta: {
                    title: 'shopping goods'
                }
            },
            {
                path: '/users',
                name: 'Users',
                component: () =>
                    import ('../components/Users.vue'),
                meta: {
                    title: 'User list'
                }
            },
        ]
    },
    {
        path: '/',
        redirect: '/register'
    }
];
const router = new VueRouter({
    mode: 'history',
    routes,
});


router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()

    // to 将要访问的路径,from从哪个路径跳转而来,next 是一个函数表示放行 可以强制绑定跳转地址
    if (to.path === '/register') return next();

    if (to.path === '/login') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')

    if (!tokenStr) return next('/login')
        // 如果有就直接放行
    next()
});
export default router;