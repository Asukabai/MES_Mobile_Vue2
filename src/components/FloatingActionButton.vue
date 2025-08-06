<!--创建了一个新的可复用组件 FloatingActionButton.vue，它包含以下特性：
可拖拽的悬浮按钮
可自定义初始位置
点击事件通过 $emit('click') 传递给父组件
完整的触摸交互逻辑
防止拖拽时误触发点击事件

这样，其他页面也可以通过引入 FloatingActionButton 组件来使用这个悬浮按钮功能，
只需传递初始位置和监听点击事件即可。
-->
<template>
  <div
      class="floating-action-button"
      :style="{ bottom: position.bottom + 'px', right: position.right + 'px' }"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @click="handleClick"
  >
    <van-icon name="plus" size="20px" color="#fff" />
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'FloatingActionButton',
  components: {
    VanIcon: Icon
  },
  props: {
    // 初始位置
    initialPosition: {
      type: Object,
      default: () => ({
        bottom: 80,
        right: 20
      })
    }
  },
  data() {
    return {
      position: { ...this.initialPosition },
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
    handleClick() {
      // 只有在非拖拽状态下才触发点击事件
      if (!this.touchState.isDragging) {
        this.$emit('click');
      }
    },
    onTouchStart(event) {
      const touch = event.touches[0]
      this.touchState.startX = touch.clientX
      this.touchState.startY = touch.clientY
      this.touchState.initialBottom = this.position.bottom
      this.touchState.initialRight = this.position.right
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
      this.position.bottom = newBottom
      this.position.right = newRight
    },
    onTouchEnd() {
      // 延迟重置拖拽状态，确保点击事件能正确处理
      setTimeout(() => {
        this.touchState.isDragging = false
      }, 100)
    },
    updateScreenSize() {
      this.screenSize.width = window.innerWidth
      this.screenSize.height = window.innerHeight
    }
  }
}
</script>

<style scoped>

/* 悬浮按钮样式 */
.floating-action-button{
  position: fixed;
  width: 40px; /* 缩小按钮宽度 */
  height: 40px; /* 缩小按钮高度 */
  background-color: #1989fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  user-select: none; /* 防止拖动时选中文字 */
  touch-action: none; /* 禁用默认触摸行为 */
  //z-index: 999;
}
</style>
