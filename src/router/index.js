// src/router/index.js

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
import ChatCategory from "@/views/share/ChatCategory.vue";
import CreatePost from "@/views/share/CreatePost.vue";

Vue.use(Router)

// 获取全局路径前缀
const basePath = process.env.VUE_APP_BASE_PATH
// const basePath = process.env.VUE_APP_BASE_PATH || '/sensor_ddingWork/Debug/'

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
      path: `${basePath}cart`,
      name: 'CartFile',
      component: CartFile,
      meta: { title: '分享文件' }
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
      meta: { title: '上传汇总' }
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
      meta: { title: '近期日志' }
    },
    {
      path: `${basePath}project-manage`,
      name: 'projectManage',
      component: () => import('@/views/project/projectManage.vue'),
      meta: { title: '项目管理' }
    },
    {
      path: `${basePath}task-manage`,
      name: 'taskManage',
      component: () => import('@/views/task/taskManage.vue'),
      meta: { title: '任务管理' }
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
      meta: { title: '最终任务详情' }
    },
    {
      path: `${basePath}task-detail-progress`,
      name: 'TaskDetailProgress',
      component: () => import('@/views/task/taskDetailProgress.vue'),
      meta: { title: '任务进度详情' }
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
      meta: { title: '扫描配置' }
    },
    {
      path: "/sensor_ddingWork/Release/code/configList",
      name: 'ScanConfigList',
      component: () => import('@/views/code/ScanConfigList.vue'),
      meta: { title: '配置列表' }
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
      meta: { title: '添加历史' }
    },
    {
      path: "/sensor_ddingWork/Release/code/HistoryView",
      name: 'HistoryView',
      component: () => import('@/views/code/HistoryView.vue'),
      meta: { title: '历史查看' }
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

// 动态设置标题
// router.beforeEach((to, from, next) => {
//   // const moduleNames = process.env.MODULE_NAMES;
//
//   let moduleNames = {};
//   try {
//     moduleNames = JSON.parse(process.env.VUE_APP_MODULE_NAMES || '{}');
//   } catch (e) {
//     alert('解析MODULE_NAMES失败:'+  e);
//   }
//
//   alert('Current path 3 :'+  to.path)
//   alert('Module names 4 :'+  moduleNames); // 打印模块名称配置
//   alert('Module names keys 5:'+ Object.keys(moduleNames)); // 打印 moduleNames 的所有键
//   alert('Resolved title 6:'+ moduleNames[to.path]); // 打印匹配到的标题
//   // 如果没有匹配到，则使用默认标题
//   // document.title = moduleNames[to.path] || "工作助手";
//   // next();
//   // const title = moduleNames[to.path] || "工作助手11";
//   // // 延迟设置标题，确保不会被覆盖
//   // next(() => {
//   //   document.title = title;
//   // });
//
//   // 改进的路径匹配逻辑：支持前缀匹配
//   let title = "工作助手";
//   if (moduleNames[to.path]) {
//     // 精确匹配
//     title = moduleNames[to.path];
//   } else {
//     // 前缀匹配
//     for (const path in moduleNames) {
//       if (to.path.startsWith(path)) {
//         title = moduleNames[path];
//         break;
//       }
//     }
//   }
//
//   // 使用next回调确保在路由切换完成后设置标题
//   // next(() => {
//   //   // 延迟设置确保标题被正确更新
//   //   Vue.nextTick(() => {
//   //     document.title = title;
//   //   });
//   // });
//   // 将标题存储在路由meta中，供vue-meta使用
//   to.meta.title = title;
//   next();
//
// });

// 使用 afterEach 钩子确保在路由切换完成后设置标题
// router.afterEach((to) => {
//   if (to.meta.title) {
//     document.title = to.meta.title;
//   }
// });


// router.beforeEach((to, from, next) => {
//   const moduleNames = process.env.MODULE_NAMES ;
//   let title = "工作助手";
//
//   // 尝试匹配完整路径
//   if (moduleNames[to.path]) {
//     title = moduleNames[to.path];
//   } else {
//     // 尝试匹配部分路径
//     for (const path in moduleNames) {
//       if (to.path.startsWith(path)) {
//         title = moduleNames[path];
//         break;
//       }
//     }
//   }
//
//   console.log('Resolved title:', title); // 打印解析后的标题
//   alert('Resolved title:' + title); // 弹窗显示解析后的标题
//
//   document.title = title;
//   next();
//
//   // 延迟设置标题，确保不会被覆盖
//   // next(() => {
//   //   document.title = title;
//   // });
// });


// 动态设置标题
// router.beforeEach((to, from, next) => {
//   // 设置页面标题
//   document.title = to.meta.title || '工作助手';
//   next();
// });


// router.beforeEach((to, from, next) => {
//   // 添加调试信息
//   console.log('路由跳转到:', to.path);
//   alert('路由跳转到:'+ to.path);
//   console.log('路由元信息:', to.meta);
//   alert('路由元信息:'+ to.meta);
//   console.log('标题应该设置为:', to.meta.title || '工作助手');
//   alert('标题应该设置为:'+ to.meta.title || '工作助手');
//
//   // 设置页面标题
//   document.title = to.meta.title || '工作助手';
//
//   // 添加设置后的标题验证
//   alert('实际设置的标题:'+ document.title);
//
//   next();
// });

// 动态设置标题 - 适配钉钉环境
// router.beforeEach((to, from, next) => {
//   const title = to.meta.title || '工作助手';
//   // 设置页面标题（普通浏览器）
//   document.title = title;
//   // 适配钉钉环境
//   setDingTalkTitle(title);
//   next();
// });
//
// // 路由切换完成后再次设置（确保生效）
// router.afterEach((to) => {
//   Vue.nextTick(() => {
//     const title = to.meta.title || '工作助手';
//     document.title = title;
//     setDingTalkTitle(title);
//   });
// });
//
// // 专门用于设置钉钉标题的函数
// function setDingTalkTitle(title) {
//   // 检查是否在钉钉环境中
//   if (typeof window.dd !== 'undefined' && dd.ready) {
//     try {
//       // 使用钉钉 API 设置标题
//       dd.ready(() => {
//         dd.biz.navigation.setTitle({
//           title: title
//         }).catch((error) => {
//           console.error('钉钉标题设置失败:', error);
//         });
//       });
//     } catch (e) {
//       console.error('调用钉钉API异常:', e);
//     }
//   }
// }



// ... existing code ...
// 动态设置标题 - 适配钉钉环境
// router.beforeEach((to, from, next) => {
//   console.log('=== 路由守卫 beforeEach ===');
//   alert('从路由:'+ from.path);
//   alert('到路由:'+ to.path);
//   alert('路由元信息:'+ to.meta);
//
//   const title = to.meta.title || '工作助手';
//   alert('应设置的标题:'+ title);
//
//   // 设置页面标题（普通浏览器）
//   document.title = title;
//   alert('document.title 已设置为:'+ document.title);
//
//   // 适配钉钉环境
//   updatePageTitle(title);
//
//   next();
// });
//
// // 路由切换完成后再次设置（确保生效）
// router.afterEach((to) => {
//   alert('=== 路由守卫 afterEach ===');
//   alert('DD当前路由:'+  to.path);
//
//   Vue.nextTick(() => {
//     const title = to.meta.title || '工作助手';
//     document.title = title;
//     alert('afterEach 中 document.title 设置为:'+ document.title);
//     updatePageTitle(title);
//   });
// });
//
// // 统一的页面标题更新函数
// function updatePageTitle(title) {
//   alert('=== updatePageTitle 函数 ===');
//   alert('尝试设置标题:'+ title);
//
//   // 首先设置文档标题
//   document.title = title;
//   alert('document.title ='+ document.title);
//
//   // 检查是否在钉钉环境中
//   alert('dd 对象是否存在:'+ typeof dd !== 'undefined');
//
//   if (typeof dd !== 'undefined') {
//     alert('调用钉钉 API 设置标题');
//     dd.biz.navigation.setTitle({
//       title: title
//     }).then(() => {
//       alert('钉钉标题设置成功:'+ title);
//     }).catch((error) => {
//       alert('钉钉标题设置失败:'+ error);
//     });
//   } else {
//     alert('不在钉钉环境中，跳过钉钉 API 调用');
//   }
// }
// ... existing code ...

// ... existing code ...
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
// ... existing code ...


export default router;
