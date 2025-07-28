// src/router/index.js

import Vue from 'vue'
import Router from 'vue-router'

// 导入视图组件...
import Home from '../views/Home.vue'
import Category from '../views/Category.vue'
import CartFile from '../views/CartFile.vue'
import User from '../views/User.vue'
import Task from "@/views/Task.vue";
import IndexView from "@/views/IndexView.vue";
import Login from "@/views/Login.vue";
import StatisticalReport from "@/views/StatisticalReport.vue";
import UploadSummary from "@/views/UploadSummary.vue";

Vue.use(Router)

// 获取全局路径前缀
const basePath = process.env.VUE_APP_BASE_PATH
// const basePath = process.env.VUE_APP_BASE_PATH || '/sensor_ddingWork/Debug/'

export default new Router({
  mode: 'history',
  routes: [
    {
      path: basePath,
      redirect: `${basePath}login`
    },
    {
      path: `${basePath}login`,
      name: 'Login',
      component: Login
    },
    {
      path: `${basePath}home`,
      name: 'Home',
      component: Home
    },
    {
      path: `${basePath}category`,
      name: 'Category',
      component: Category
    },
    {
      path: `${basePath}cart`,
      name: 'CartFile',
      component: CartFile
    },
    {
      path: `${basePath}user`,
      name: 'User',
      component: User
    },
    {
      path: `${basePath}task`,
      name: 'Task',
      component: Task
    },
    {
      path: `${basePath}index`,
      name: 'IndexView',
      component: IndexView
    },
    {
      path: `${basePath}preview`,
      name: 'FilePreview',
      component: () => import('@/views/FilePreview.vue')
    },
    {
      path: `${basePath}dd-preview`,
      name: 'DingtalkFilePreview',
      component: () => import('@/views/DingtalkFilePreview.vue')
    },
    {
      path: `${basePath}download`,
      name: 'FileDownload',
      component: () => import('@/views/FileDownload.vue')
    },
    {
      path: `${basePath}profile`,
      name: 'Profile',
      component: () => import('@/views/Profile.vue')
    },
    {
      path: `${basePath}project-code`,
      name: 'ProjectCode',
      component: () => import('@/views/ProjectCode.vue')
    },
    {
      path: `${basePath}code-recode`,
      name: 'CodeRecode',
      component: () => import('@/views/CodeRecode.vue')
    },
    {
      path: `${basePath}notice-detail`,
      name: 'NoticeDetail',
      component: () => import('../components/NoticeDetail.vue'),
      meta: { showTabBar: false }
    },
    {
      path: `${basePath}task-record`,
      name: 'taskRecord',
      component: () => import('../views/taskRecord.vue')
    },
    {
      path: `${basePath}statistical-report`,
      name: 'StatisticalReport',
      component: StatisticalReport
    },
    {
      path: `${basePath}upload-summary`,
      name: 'UploadSummary',
      component: UploadSummary
    },
    {
      path: `${basePath}file-type-stats`,
      name: 'FileTypeStats',
      component: () => import('@/views/FileTypeStats.vue')
    },
    {
      path: `${basePath}recent-logs`,
      name: 'RecentLogs',
      component: () => import('@/views/RecentLogs.vue')
    },
    {
      path: `${basePath}project-manage`,
      name: 'projectManage',
      component: () => import('@/views/projectManage.vue')
    },
    {
      path: `${basePath}task-manage`,
      name: 'taskManage',
      component: () => import('@/views/taskManage.vue')
    },
    {
      path: `${basePath}task-detail`,
      name: 'TaskDetail',
      component: () => import('@/views/taskDetail.vue')
    },
    {
      path: `${basePath}task-detail-last`,
      name: 'TaskDetailLast',
      component: () => import('@/views/taskDetailLast.vue')
    },
    {
      path: `${basePath}task-detail-progress`,
      name: 'TaskDetailProgress',
      component: () => import('@/views/taskDetailProgress.vue')
    },
    {
      path: `${basePath}task-detail-look`,
      name: 'TaskDetailLook',
      component: () => import('@/views/taskDetailLook.vue')
    },
    {
      path: "/sensor_ddingWork/Release/cardStorageOperate",
      name: 'CardStorageOperate',
      component: () => import('@/views/code/CardStorageOperate.vue')
    },
    {
      path: "/sensor_ddingWork/Release/task/evidence-detail",
      name: 'EvidenceDetail',
      component: () => import('@/views/EvidenceDetail.vue')
    },
    {
      path: "/sensor_ddingWork/Release/code/codeList",
      name: 'CodeList',
      component: () => import('@/views/code/CodeList.vue')
    },
    {
      path: "/sensor_ddingWork/Release/code/config",
      name: 'ScanConfigPage',
      component: () => import('@/views/code/ScanConfigPage.vue')
    },
    {
      path: "/sensor_ddingWork/Release/code/configList",
      name: 'ScanConfigList',
      component: () => import('@/views/code/ScanConfigList.vue')
    },
    {
      path: "/sensor_ddingWork/Release/code/AddStored",
      name: 'AddStored',
      component: () => import('@/views/code/AddStored.vue')
    },
    {
      path: "/sensor_ddingWork/Release/code/AddHistory",
      name: 'AddHistory',
      component: () => import('@/views/code/AddHistory.vue')
    },
    {
      path: "/sensor_ddingWork/Release/code/HistoryView",
      name: 'HistoryView',
      component: () => import('@/views/code/HistoryView.vue')
    },
    {
      path: '/sensor_ddingWork/Release/progress-tracking',
      name: 'ProgressTracking',
      component: () => import('@/views/ProgressTracking.vue')
    },
    {
      path: '/sensor_ddingWork/Release/project-detail/:id',
      name: 'ProjectDetail',
      component: () => import('@/views/ProjectDetail.vue')
    },
    // 捕获非法路径，重定向到登录页
    {
      path: '*',
      redirect: `${basePath}login`
    }
  ]
})
