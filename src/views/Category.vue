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

    <!-- 页面内容 -->
    <div class="content">
      <h1>欢迎来到消息界面</h1>
      <p>这里是你的消息列表或详细信息。</p>
    </div>

    <!-- 底部导航栏 -->
    <main-tab-bar />
  </div>
</template>

<script>
import MainTabBar from '@/components/MainTabBar.vue'
import { NoticeBar, Cell as VanCell } from 'vant' // ✅ 修复：使用 Cell 并重命名为 VanCell

export default {
  name: 'CategoryPage',
  components: {
    VanCell, // ✅ 注册 van-cell 组件
    MainTabBar,
    VanNoticeBar: NoticeBar // 注册 van-notice-bar 组件
  },
  methods: {
    goToNoticeDetail() {
      // 可跳转至通知详情页
      this.$router.push('/notice-detail')
    }
  }
}
</script>

<style scoped>
.category-page {
  padding-bottom: 50px; /* 留出底部 tabbar 的空间 */
}

.content {
  padding: 16px;
}
</style>
