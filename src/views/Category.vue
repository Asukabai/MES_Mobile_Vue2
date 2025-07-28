<template>
  <div class="category-page">
    <!-- 页面标题 -->
    <van-cell
        title="消息通知"
        icon="chat-o"
        :title-style="{ fontWeight: 'bold', fontSize: '16px' }"
    />

    <!-- 顶部通知栏 -->
    <van-notice-bar
        left-icon="volume-o"
        text="欢迎来到消息中心，这里有最新的系统通知。"
        background="#ecf9ff"
        color="#1989fa"
        mode="link"
        @click="goToNoticeDetail"
    />

    <!-- 时间轴消息列表 -->
    <div class="message-timeline">
      <div v-for="(group, index) in messageGroups" :key="index" class="timeline-group">
        <!-- 日期标题 -->
        <van-cell :title="group.date" title-style="color: #666; font-size: 14px;" />

        <!-- 消息卡片列表 -->
        <van-cell-group>
          <van-cell
              v-for="(msg, msgIndex) in group.messages"
              :key="msgIndex"
              is-link
              @click="goToMessageDetail(msg)"
              :title="msg.title"
              :value="msg.time"
              :label="msg.summary"
              clickable
          />
        </van-cell-group>

        <!-- 分割线 -->
        <van-divider />
      </div>
    </div>

    <!-- 底部导航栏 -->
    <main-tab-bar />
  </div>
</template>


<script>
import MainTabBar from '@/components/MainTabBar.vue'
import { NoticeBar, Cell as VanCell, Divider } from 'vant'

export default {
  name: 'CategoryPage',
  components: {
    VanCell,
    MainTabBar,
    VanNoticeBar: NoticeBar,
    VanDivider: Divider
  },
  data() {
    return {
      // 模拟消息数据，按日期分组
      messageGroups: [
        {
          date: '2025-07-02',
          messages: [
            {
              title: '新通知',
              summary: '您收到一条新的系统通知，请及时查看。',
              time: '10:30'
            }
          ]
        },
        {
          date: '2025-07-01',
          messages: [
            {
              title: '系统维护',
              summary: '明天凌晨将进行服务器维护，请注意保存数据。',
              time: '14:20'
            }
          ]
        }
      ]
    }
  },
  methods: {
    goToNoticeDetail() {
      this.$router.push('/sensor_ddingWork/Release/notice-detail')
    },
    goToMessageDetail(message) {
      // 可跳转到具体消息详情页，或弹窗显示
      console.log('点击了消息:', message)
      this.$toast(`进入消息：“${message.title}”`)
    }
  }
}
</script>


<style scoped>
.category-page {
  padding-bottom: 50px;
}

.message-timeline .timeline-group {
  margin-top: 16px;
}

.van-cell__title {
  font-weight: bold;
  font-size: 16px;
}

.van-cell__label {
  white-space: normal;
  color: #666;
  font-size: 14px;
  margin-top: 4px;
}

.van-divider {
  margin: 12px 0;
}
</style>

