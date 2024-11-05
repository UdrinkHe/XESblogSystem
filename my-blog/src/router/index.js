import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthPage from '@/components/mainPage/AuthPage.vue'
import ScheduleBlock from '@/components/mainPage/scheduleBlock.vue'
import TodoList from '@/components/scheduleMain/todoList.vue'
import ScheduleStatistic from '@/components/scheduleMain/scheduleStatistic.vue'
import MySchedule from '@/components/scheduleMain/mySchedule.vue'
import store from '../store'
import EditorBlock from '@/components/mainPage/editorBlock.vue'
import EditorPage from '@/components/creationCenter/editorPage.vue'
import creationManagement from '@/components/creationCenter/creationManagement.vue'
import ViewPage from '@/components/creationCenter/viewPage.vue'
import personalCenter from '@/components/mainPage/personalCenter.vue'
import baseInfo from '@/components/userInfo/baseInfo.vue'
import myCollection from '@/components/userInfo/myCollection.vue'
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/scheduleBlock/mySchedule'
    },
    {
        path: '/auth',
        name: 'Auth',
        component: AuthPage
    },
    {
        path : '/scheduleBlock',
        name : 'scheduleBlock',
        component : ScheduleBlock,
        meta : {
            requiresAuth : true // 标记该路由需要认证
        },
        children : [
            {
                path : 'mySchedule',
                name : 'mySchedule',
                components : {
                    scheduleMain : MySchedule
                }
            },
            {
                path : 'todoList',
                name : 'todoList',
                components : {
                    scheduleMain : TodoList
                }
            },
            {
                path : 'scheduleStatistic',
                name : 'scheduleStatistic',
                components : {
                    scheduleMain : ScheduleStatistic
                }
            }
        ]
    },
    {
        path : '/editorBlock',
        name : 'editorBlock',
        component : EditorBlock,
        meta : {
            requiresAuth : true
        },
        children : [
            {
                path : 'creationManagement',
                name : 'creationManagement',
                component : creationManagement
            },
            
        ]
    },
    {
        path : '/viewPage',
        name : 'viewPage',
        query : {
            articleId : String
        },
        component : ViewPage
    },
    {
        path : '/editorPage',
        name : 'editorPage',
        component : EditorPage,
        meta : {
            requiresAuth : true
        }
    },
    {
        path : '/personalCenter',
        name : 'personalCenter',
        component : personalCenter,
        meta : {
            requiresAuth : true
        },
        children : [
            {
                path : 'baseInfo',
                name : 'baseInfo',
                component : baseInfo,
            },
            {
                path : 'myCollection',
                name : 'myCollection',
                component : myCollection
            }
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // 检查目标路由是否需要身份验证
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    // 从 Vuex store 中获取当前用户的身份验证状态
    const isAuthenticated = store.getters['auth/isAuthenticated'];

    // 如果路由需要身份验证且用户未登录，则重定向到登录页面
    if (requiresAuth && !isAuthenticated) {
        next('/auth');
    } else {
        // 否则，允许导航继续
        next();
    }
});

export default router

