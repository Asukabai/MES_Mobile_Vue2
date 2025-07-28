<template>
  <transition name="slide">
    <div v-if="visible" class="download-panel">
      <div class="header">
        <span>下载任务</span>
        <button @click="toggleMinimize">{{ minimized ? '展开' : '收起' }}</button>
        <button @click="close">❌</button>
      </div>

      <div v-if="!minimized" class="tasks">
        <div v-for="task in tasks" :key="task.id" class="task-item">
          <div class="task-name">{{ task.fileName }}</div>
          <div class="progress-bar">
            <div :style="{ width: task.progress + '%' }"></div>
          </div>
          <div class="status">{{ task.status }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    tasks: { type: Array, required: true },
    visible: { type: Boolean, default: false },
    minimized: { type: Boolean, default: false }
  },
  methods: {
    toggleMinimize() {
      this.$emit('update:minimized', !this.minimized)
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
.download-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  width: 300px;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f7f8fa;
  border-bottom: 1px solid #eee;
  font-weight: bold;
}

.header button {
  background: none;
  border: none;
  cursor: pointer;
}

.tasks {
  padding: 10px;
}

.task-item {
  margin-bottom: 10px;
}

.task-name {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 2px;
}

.progress-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar div {
  height: 100%;
  background: #1989fa;
  transition: width 0.3s ease-in-out;
}

.status {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
