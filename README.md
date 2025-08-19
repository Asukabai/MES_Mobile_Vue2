# MES系统移动端 - 钉钉小程序 📌

## 项目简介 📒
本项目是基于 Vue2 和 [Vant2](https://vant-ui.github.io/vant/v2/#/zh-CN/) 开发的MES系统移动端解决方案，集成于钉钉小程序平台。

这是一个用于制造企业的移动办公解决方案，实现了任务管理、文件共享、项目跟踪和扫码功能等核心功能。
用户可以在移动端接收查看PC端下发的任务或分享的文件，支持移动端提交任务或下载、预览分享的文件，同时可以查看项目和任务进度情况。

【补充：MES是制造执行系统（Manufacturing Execution System）缩写，是一种用于管理和监控制造过程软件系统。】

## 核心功能模块 💡

### 1. 任务管理
- &zwnj;**任务看板**&zwnj;：可视化展示待办/进行中/已完成任务
- &zwnj;**进度追踪**&zwnj;：支持图表形式展示任务进度


### 2. 文件分享  📁
- 多格式预览(支持PDF/Word/txt/图片等文件形式)
- 文件下载功能（支持移动端下和PC端下载）

### 3. 项目监控 🔍
- 项目里程碑展示——项目进度跟踪
- 资源分配视图——饼图，条形图，环形图展示
- 风险预警提示（后续添加）

## 技术栈 📋

- &zwnj;**前端框架**&zwnj;: Vue 2.x
- &zwnj;**UI组件库**&zwnj;: Vant UI 2.x
- &zwnj;**开发平台**&zwnj;: dingtalk-jsapi 3.1.1
- &zwnj;**构建工具**&zwnj;: Webpack
- &zwnj;**状态管理**&zwnj;: Vuex
- &zwnj;**路由管理**&zwnj;: Vue Router
- &zwnj;**HTTP客户端**&zwnj;: Axios
- &zwnj;**图表库**&zwnj;: ECharts (用于数据可视化)

## 功能模块 📢

### 1. 任务管理模块 🔥

- &zwnj;**任务列表**&zwnj;: 分页展示所有任务，支持按状态、优先级筛选
- &zwnj;**任务详情**&zwnj;: 查看任务详细信息、附件和相关信息
- &zwnj;**任务提交**&zwnj;: 支持提交阶段性成果和最终成果
- &zwnj;**任务日历**&zwnj;: 可视化展示任务时间分布（便于查看）
- &zwnj;**进度跟踪**&zwnj;: 图形化展示任务完成进度

### 2. 文件共享模块 🚀

- &zwnj;**文件列表**&zwnj;: 分类展示所有共享文件
- &zwnj;**文件预览**&zwnj;: 支持常见格式(文档、图片、PDF等)在线预览
- &zwnj;**文件下载**&zwnj;: 支持文件下载到本地
- &zwnj;**文件搜索**&zwnj;: 按名称、类型、上传时间等条件搜索

### 3. 项目管理模块

- &zwnj;**项目列表**&zwnj;: 展示所有参与的项目
- &zwnj;**项目详情**&zwnj;: 查看项目基本信息、成员和进度
- &zwnj;**进度统计**&zwnj;: 图表展示项目整体进度和各任务完成情况

### 4. 知识库模块

- &zwnj;**文档分类**&zwnj;: 按类别组织知识文档
- &zwnj;**文档检索**&zwnj;: 全文搜索知识文档
- &zwnj;**文档收藏**&zwnj;: 收藏常用文档方便快速访问

### 5. 扫码功能

- &zwnj;**资产扫码**&zwnj;: 扫描资产二维码查看详细信息
- &zwnj;**流转记录**&zwnj;: 查看资产历史流转记录
- &zwnj;**批量操作**&zwnj;: 通过批量扫码快速执行相关操作（增加效率）

## 项目结构 🌳
```
mes-dingtalk-miniapp/
├── public/                  # 静态资源
├── src/
│   ├── assets/              # 静态资源
│   ├── components/          # 公共组件
│   │   ├── TaskCard.vue     # 任务卡片组件
│   │   ├── FileItem.vue     # 文件列表项组件
│   │   ├── ProgressChart.vue # 进度图表组件
│   │    └── ...              
│   ├── views/               # 页面组件
│   │   ├── task/            # 任务相关页面
│   │   ├── file/            # 文件相关页面
│   │   ├── project/         # 项目相关页面
│   │   ├── knowledge/       # 知识库页面
│   │   ├── login/           # 登录页面
│   │   ├── user/            # 用户页面
│   │   ├── summary/         # 统计页面
│   ├── router/              # 路由配置
│   ├── store/               # Vuex状态管理
│   ├── utils/               # 工具函数
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── .env                     # 环境变量
├── package.json             # 项目配置
└── README.md                # 项目说明

```

## 技术实现 🔔

| 技术栈       | 版本   | 用途说明            |
|--------------|--------|---------------------|
| Vue          | 2.6.x  | 前端框架             |
| Vant         | 2.12.x | 移动端UI组件库       |
| ECharts      | 5.3.x  | 数据可视化           |
| Axios        | 0.27.x | HTTP请求库          |
|dingtalk-jsapi| 3.1.x  | 钉钉API请求库       |

## 部署指南  🚫

1. &zwnj;**环境准备**&zwnj;
   ```bash
   node >= 14.0
   npm >= 6.0

<img width="591" height="349" alt="image" src="https://github.com/user-attachments/assets/15cb86df-d7d4-43a3-ab51-47b66f148fda" />

这个README.md文件包含了项目的完整说明文档，包括：🔗
1. 项目概述和技术栈介绍
2. 详细的功能模块说明
3. 项目结构目录说明
4. 开发环境搭建指南
5. 钉钉小程序配置要求
6. 接口规范说明
7. 特色功能和兼容性说明
8. 未来发展规划
9. 贡献指南和许可证信息

钉钉免登前端流程图：

<img width="740" height="603" alt="image" src="https://github.com/user-attachments/assets/456dbeb4-d183-4b22-988c-2392686da7ed" />

钉钉免登后端流程图：

<img width="738" height="655" alt="image" src="https://github.com/user-attachments/assets/c0523661-2de2-431b-a205-5f4191a7608e" />



