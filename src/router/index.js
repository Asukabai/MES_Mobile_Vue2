import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Category from '../views/Category.vue'
import CartFile from '../views/CartFile.vue'
import User from '../views/User.vue'
import Task from "@/views/Task.vue";
import IndexView from "@/views/IndexView.vue";
import Login from "@/views/Login.vue";  // 新增引入

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/category',
      name: 'Category',
      component: Category
    },
    {
      path: '/cart',
      name: 'CartFile',
      component: CartFile
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/task',
      name: 'Task',
      component: Task
    },
    {
      path: '/index',
      name: 'IndexView',
      component: IndexView  // 注册新路由
    },  {
      path: '/preview',
      name: 'FilePreview',
      component: () => import('@/views/FilePreview.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue')
    },{
      path: '/project-code',
      name: 'ProjectCode',
      component: () => import('@/views/ProjectCode.vue')
    },{
      path: '/code-recode',
      name: 'CodeRecode',
      component: () => import('@/views/CodeRecode.vue')
    },
    {
      path: '/notice-detail',
      name: 'NoticeDetail',
      component: () => import('../components/NoticeDetail.vue'),
      meta: { showTabBar: false } // 不显示底部导航
    },
    {
      path: '/task-record',
      name: 'taskRecord',
      component: () => import('../views/taskRecord.vue')
    }

  ]
})
