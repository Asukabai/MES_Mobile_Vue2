<!-- src/views/home/components/m-menu.vue -->
<template>
  <div class="menu">
    <div class="menu-item" v-for="item in menuList" :key="item.title" @click="onClick(item)">
      <div class="icon-wrapper">
        <img class="icon" :src="item.icon" />
      </div>
      <div class="title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
import taskCalendarIcon from '@/assets/项目编码 (2).png'
import projectListIcon from '@/assets/项目管理.png'
import fileStatIcon from '@/assets/项目类型统计.png'
import feedbackIcon from '@/assets/评论列表-高亮.png'
import progressTrackIcon from '@/assets/进度跟踪.png'
import contactIcon from '@/assets/联系人123.png'
import singleScanIcon from '@/assets/单板扫码.png'
import batchScanIcon from '@/assets/批量扫码.png'
import scanRecordIcon from '@/assets/日志详情.png'
import scanConfigIcon from '@/assets/流程汇总日志.png'
import scanDashboardIcon from '@/assets/项目总览@3x.png'

export default {
  name: 'MMenu',
  data() {
    return {
      menuList: [
        {
          icon: taskCalendarIcon,
          title: '任务日历',
          path: '',
        },
        {
          icon: projectListIcon,
          title: '项目列表',
          path: '',
        },
        {
          icon: fileStatIcon,
          title: '文件统计',
          path: '',
        },
        {
          icon: feedbackIcon,
          title: '问题反馈',
          path: '',
        },
        {
          icon: progressTrackIcon,
          title: '进度跟踪',
          path: '',
        },
        {
          icon: contactIcon,
          title: '联系人',
          path: '',
        },
        {
          icon: scanConfigIcon,
          title: '单板扫码',
          path: '',
        },
        {
          icon: scanRecordIcon,
          title: '批量扫码',
          path: '',
        },
        {
          icon: batchScanIcon,
          title: '扫码记录',
          path: '',
        },
        {
          icon: singleScanIcon,
          title: '扫码配置',
          path: '',
        },
        {
          icon: scanDashboardIcon,
          title: '扫码看板',
          path: '',
        },
      ]
    };
  },
  methods: {
    onClick() {
    }
  }
};
</script>

<style scoped >
.menu {
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
  padding: 40rpx 10rpx;
  gap: 10rpx 0;
}

.menu-item {
  width: calc(100% / 6);

  .icon-wrapper {
    font-size: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      width: 35rpx;
      height: 35rpx;
    }
  }

  .title {
    font-size: 11rpx;
    text-align: center;
    margin-top: 10rpx;
  }
}
</style>
