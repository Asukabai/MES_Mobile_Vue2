<template>
  <div>
    <van-tabbar v-model="active">
      <van-tabbar-item
          v-for="(item, index) in tabbars"
          :key="index"
          :to="item.path"
          :icon="item.icon"
      >
        {{ item.title }}
      </van-tabbar-item>
    </van-tabbar>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabbars: [
        { title: '消息', icon: 'envelop-o', path: '/category' },
        { title: '任务', icon: 'todo-list-o', path: '/task' },
        { title: '工作台', icon: 'home-o', path: '/home' },
        { title: '分享', icon: 'share-o', path: '/cart' },
        { title: '我的', icon: 'user-circle-o', path: '/user' }
      ],
      active: 0 // 初始值会在 created/mounted 中更新
    }
  },
  watch: {
    '$route.path': function (newPath) {
      this.updateActiveTab(newPath)
    }
  },
  methods: {
    updateActiveTab(path) {
      const index = this.tabbars.findIndex(item => item.path === path)
      if (index !== -1) {
        this.active = index
      }
    }
  },
  mounted() {
    // 初始化时根据当前路径设置 active
    this.updateActiveTab(this.$route.path)
  }
}
</script>
