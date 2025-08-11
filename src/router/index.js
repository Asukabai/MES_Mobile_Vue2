import Vue from 'vue'
import Router from 'vue-router'
import * as dd from 'dingtalk-jsapi'

// 导入视图组件...
import Home from '../views/home/Home.vue'
import CartFile from '../views/share/CartFile.vue'
import User from '../views/user/User.vue'
import Task from "@/views/task/Task.vue";
import IndexView from "@/views/share/IndexView.vue";
import Login from "@/views/login/Login.vue";
import StatisticalReport from "@/views/summary/StatisticalReport.vue";
import UploadSummary from "@/views/summary/UploadSummary.vue";
import ChatCategory from "@/views/knowledge/ChatCategory.vue";
import CreatePost from "@/views/knowledge/CreatePost.vue";
import PostDetail from "@/views/knowledge/PostDetail.vue";

Vue.use(Router)

// 获取全局路径前缀
const basePath = process.env.VUE_APP_BASE_PATH

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: basePath,
      redirect: `${basePath}login`
    },
    {
      path: `${basePath}login`,
      name: 'Login',
      component: Login,
      meta: { title: '登录' }
    },
    {
      path: `${basePath}home`,
      name: 'Home',
      component: Home,
      meta: { title: '首页' }
    },
    {
      path: `${basePath}chat_category`,
      name: 'ChatCategory',
      component: ChatCategory,
      meta: { title: '知识库' }
    },
    {
      path: `${basePath}create_post`,
      name: 'CreatePost',
      component: CreatePost,
      meta: { title: '创建帖子' }
    },
    {
      path: `${basePath}post-detail/:id`,
      name: 'PostDetail',
      component: PostDetail,
      meta: { title: '详情信息' }
    },
    {
      path: `${basePath}cart`,
      name: 'CartFile',
      component: CartFile,
      meta: { title: '文件分享' }
    },
    {
      path: `${basePath}user`,
      name: 'User',
      component: User,
      meta: { title: '用户中心' }
    },
    {
      path: `${basePath}task`,
      name: 'Task',
      component: Task,
      meta: { title: '任务管理' }
    },
    {
      path: `${basePath}index`,
      name: 'IndexView',
      component: IndexView,
      meta: { title: '首页111' }
    },
    {
      path: `${basePath}preview`,
      name: 'FilePreview',
      component: () => import('@/views/share/FilePreview.vue'),
      meta: { title: '文件预览' }
    },
    {
      path: `${basePath}dd-preview`,
      name: 'DingtalkFilePreview',
      component: () => import('@/views/share/DingtalkFilePreview.vue'),
      meta: { title: '钉钉文件预览' }
    },
    {
      path: `${basePath}download`,
      name: 'FileDownload',
      component: () => import('@/views/share/FileDownload.vue'),
      meta: { title: '文件下载' }
    },
    {
      path: `${basePath}profile`,
      name: 'Profile',
      component: () => import('@/views/user/Profile.vue'),
      meta: { title: '个人资料' }
    },
    {
      path: `${basePath}project-code`,
      name: 'ProjectCode',
      component: () => import('@/views/project/ProjectCode.vue'),
      meta: { title: '项目编码' }
    },
    {
      path: `${basePath}code-recode`,
      name: 'CodeRecode',
      component: () => import('@/views/share/CodeRecode.vue'),
      meta: { title: '编码记录' }
    },
    {
      path: `${basePath}notice-detail`,
      name: 'NoticeDetail',
      component: () => import('../components/NoticeDetail.vue'),
      meta: { title: '公告详情', showTabBar: false }
    },
    {
      path: `${basePath}task-record`,
      name: 'taskRecord',
      component: () => import('../views/task/taskRecord.vue'),
      meta: { title: '任务记录' }
    },
    {
      path: `${basePath}statistical-report`,
      name: 'StatisticalReport',
      component: StatisticalReport,
      meta: { title: '统计报表' }
    },
    {
      path: `${basePath}upload-summary`,
      name: 'UploadSummary',
      component: UploadSummary,
      meta: { title: '上传文件信息汇总' }
    },
    {
      path: `${basePath}file-type-stats`,
      name: 'FileTypeStats',
      component: () => import('@/views/summary/FileTypeStats.vue'),
      meta: { title: '文件类型统计' }
    },
    {
      path: `${basePath}recent-logs`,
      name: 'RecentLogs',
      component: () => import('@/views/summary/RecentLogs.vue'),
      meta: { title: '系统日志' }
    },
    {
      path: `${basePath}project-manage`,
      name: 'projectManage',
      component: () => import('@/views/project/projectManage.vue'),
      meta: { title: '项目列表' }
    },
    {
      path: `${basePath}task-manage`,
      name: 'taskManage',
      component: () => import('@/views/task/taskManage.vue'),
      meta: { title: '任务日历' }
    },
    {
      path: `${basePath}task-detail`,
      name: 'TaskDetail',
      component: () => import('@/views/task/taskDetail.vue'),
      meta: { title: '任务详情' }
    },
    {
      path: `${basePath}task-detail-last`,
      name: 'TaskDetailLast',
      component: () => import('@/views/task/taskDetailLast.vue'),
      meta: { title: '任务完成提交表单' }
    },
    {
      path: `${basePath}task-detail-progress`,
      name: 'TaskDetailProgress',
      component: () => import('@/views/task/taskDetailProgress.vue'),
      meta: { title: '任务进度提交表单' }
    },
    {
      path: `${basePath}task-detail-look`,
      name: 'TaskDetailLook',
      component: () => import('@/views/task/taskDetailLook.vue'),
      meta: { title: '查看任务详情' }
    },
    {
      path: "/sensor_ddingWork/Release/cardStorageOperate",
      name: 'CardStorageOperate',
      component: () => import('@/views/code/CardStorageOperate.vue'),
      meta: { title: '卡片存储操作' }
    },
    {
      path: "/sensor_ddingWork/Release/task/evidence-detail",
      name: 'EvidenceDetail',
      component: () => import('@/views/task/EvidenceDetail.vue'),
      meta: { title: '证据详情' },
    },
    {
      path: "/sensor_ddingWork/Release/code/codeList",
      name: 'CodeList',
      component: () => import('@/views/code/CodeList.vue'),
      meta: { title: '编码列表' }
    },
    {
      path: "/sensor_ddingWork/Release/code/config",
      name: 'ScanConfigPage',
      component: () => import('@/views/code/ScanConfigPage.vue'),
      meta: { title: '扫码配置' }
    },
    {
      path: "/sensor_ddingWork/Release/code/configList",
      name: 'ScanConfigList',
      component: () => import('@/views/code/ScanConfigList.vue'),
      meta: { title: '配置列表' }
    },
    {
      path: "/sensor_ddingWork/Release/code/batch_scan_results",
      name: 'ScanConfigList',
      component: () => import('@/views/code/BatchScanResults.vue'),
      meta: { title: '批量扫码结果' }
    },
    {
      path: "/sensor_ddingWork/Release/code/AddStored",
      name: 'AddStored',
      component: () => import('@/views/code/AddStored.vue'),
      meta: { title: '添加存储' }
    },
    {
      path: "/sensor_ddingWork/Release/code/AddHistory",
      name: 'AddHistory',
      component: () => import('@/views/code/AddHistory.vue'),
      meta: { title: '资产记录表单' }
    },
    {
      path: "/sensor_ddingWork/Release/code/HistoryView",
      name: 'HistoryView',
      component: () => import('@/views/code/HistoryView.vue'),
      meta: { title: '资产记录详情' }
    },
    {
      path: '/sensor_ddingWork/Release/progress-tracking',
      name: 'ProgressTracking',
      component: () => import('@/views/project/ProgressTracking.vue'),
      meta: { title: '进度跟踪' }
    },
    {
      path: '/sensor_ddingWork/Release/project-detail/:id',
      name: 'ProjectDetail',
      component: () => import('@/views/project/ProjectDetail.vue'),
      meta: { title: '项目详情' }
    },
    // 捕获非法路径，重定向到登录页
    {
      path: '*',
      redirect: `${basePath}login`
    }
  ]
})

// 动态设置标题 - 适配钉钉环境
router.beforeEach((to, from, next) => {
  console.log('=== 路由守卫 beforeEach ===');
  console.log('从路由:', from.path);
  console.log('到路由:', to.path);
  console.log('路由元信息:', to.meta);

  const title = to.meta.title || '工作助手';
  console.log('应设置的标题:', title);

  // 设置页面标题（普通浏览器）
  document.title = title;
  console.log('document.title 已设置为:', document.title);

  // 适配钉钉环境
  updatePageTitle(title);

  next();
});

// 路由切换完成后再次设置（确保生效）
router.afterEach((to) => {
  console.log('=== 路由守卫 afterEach ===');
  console.log('当前路由:', to.path);

  Vue.nextTick(() => {
    const title = to.meta.title || '工作助手';
    document.title = title;
    console.log('afterEach 中 document.title 设置为:', document.title);
    updatePageTitle(title);
  });
});

// 统一的页面标题更新函数
function updatePageTitle(title) {
  console.log('=== updatePageTitle 函数 ===');
  console.log('尝试设置标题:', title);

  // 首先设置文档标题
  document.title = title;
  console.log('document.title =', document.title);

  // 检查是否在钉钉环境中
  console.log('dd 对象是否存在:', typeof dd !== 'undefined');

  if (typeof dd !== 'undefined') {
    console.log('调用钉钉 API 设置标题');
    dd.biz.navigation.setTitle({
      title: title
    }).then(() => {
      console.log('钉钉标题设置成功:', title);
    }).catch((error) => {
      console.warn('钉钉标题设置失败:', error);
    });
  } else {
    console.log('不在钉钉环境中，跳过钉钉 API 调用');
  }
}

export default router;
