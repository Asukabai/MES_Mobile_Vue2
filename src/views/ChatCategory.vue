<template>
  <div class="knowledge-base-page">
    <!-- 页面标题 -->
    <van-nav-bar
        title="知识库"
    />

    <!-- 经验贴列表 -->
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <van-cell
          v-for="(post, index) in posts"
          :key="index"
          :title="post.title"
          :label="post.summary"
          is-link
          @click="viewPostDetail(post)"
      />
    </van-list>

    <!-- 底部导航栏 -->
    <main-tab-bar />

    <!-- 悬浮加号圆形按钮 -->
    <div
        class="floating-button"
        :style="{ bottom: buttonPosition.bottom + 'px', right: buttonPosition.right + 'px' }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
    >
      <van-icon name="plus" size="20px" color="#fff" />
    </div>
  </div>
</template>

<script>
import MainTabBar from '@/components/MainTabBar.vue'
import { NavBar, List, Cell, Icon } from 'vant'

export default {
  name: 'KnowledgeBasePage',
  components: {
    VanNavBar: NavBar,
    VanList: List,
    VanCell: Cell,
    VanIcon: Icon,
    MainTabBar
  },
  data() {
    return {
      posts: [
        // 模拟的经验贴数据
        {
          title: '如何解决常见问题',
          summary: '这篇文章介绍了如何解决一些常见的技术问题...',
          id: 1
        },
        {
          title: '快速上手指南',
          summary: '这篇经验贴为新手提供了一些快速上手的技巧...',
          id: 2
        }
      ],
      loading: false,
      finished: true,
      // 悬浮按钮的初始位置
      buttonPosition: {
        bottom: 80,
        right: 20
      },
      // 触摸状态
      touchState: {
        startX: 0,
        startY: 0,
        initialBottom: 0,
        initialRight: 0,
        isDragging: false
      },
      // 屏幕尺寸
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  },
  mounted() {
    // 监听窗口大小变化，动态更新屏幕尺寸
    window.addEventListener('resize', this.updateScreenSize)
  },
  beforeDestroy() {
    // 移除监听器
    window.removeEventListener('resize', this.updateScreenSize)
  },
  methods: {
    goToCreatePost() {
      this.$router.push('/create-post')
    },
    viewPostDetail(post) {
      this.$router.push(`/post-detail/${post.id}`)
    },
    onLoad() {
      // 模拟加载更多数据
      setTimeout(() => {
        this.loading = false
        this.finished = true
      }, 1000)
    },
    onTouchStart(event) {
      const touch = event.touches[0]
      this.touchState.startX = touch.clientX
      this.touchState.startY = touch.clientY
      this.touchState.initialBottom = this.buttonPosition.bottom
      this.touchState.initialRight = this.buttonPosition.right
      this.touchState.isDragging = true
    },
    onTouchMove(event) {
      if (!this.touchState.isDragging) return

      const touch = event.touches[0]
      const deltaX = touch.clientX - this.touchState.startX
      const deltaY = touch.clientY - this.touchState.startY

      // 计算新的按钮位置
      let newBottom = this.touchState.initialBottom - deltaY
      let newRight = this.touchState.initialRight - deltaX

      // 限制按钮的活动范围
      const buttonRadius = 32 // 按钮半径（包括 padding 和 border）
      newBottom = Math.max(buttonRadius, Math.min(newBottom, this.screenSize.height - buttonRadius))
      newRight = Math.max(buttonRadius, Math.min(newRight, this.screenSize.width - buttonRadius))

      // 更新按钮位置
      this.buttonPosition.bottom = newBottom
      this.buttonPosition.right = newRight
    },
    onTouchEnd() {
      this.touchState.isDragging = false
    },
    updateScreenSize() {
      this.screenSize.width = window.innerWidth
      this.screenSize.height = window.innerHeight
    }
  }
}
</script>

<style scoped>
.knowledge-base-page {
  padding-bottom: 50px;
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

/* 悬浮按钮样式 */
.floating-button {
  position: fixed;
  width: 46px; /* 缩小按钮宽度 */
  height: 46px; /* 缩小按钮高度 */
  background-color: #1989fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  user-select: none; /* 防止拖动时选中文字 */
  touch-action: none; /* 禁用默认触摸行为 */
}
</style>
