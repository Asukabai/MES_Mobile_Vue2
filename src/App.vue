<template>
  <div id="app">
    <div class="app-content">
      <div class="main-content">
        <router-view />
      </div>
      <div
          class="tabbar-content"
          :class="{ 'ios-tabbar': isIOS, 'android-tabbar': !isIOS && !isHarmonyOS, 'harmony-tabbar': isHarmonyOS }"
      >
        <MainTabBar />
      </div>
    </div>
  </div>
</template>

<script>
import MainTabBar from '@/components/MainTabBar.vue'

export default {
  name: 'App',
  components: {
    MainTabBar
  },
  data() {
    return {
      isIOS: false,
      isHarmonyOS: false
    }
  },
  mounted() {
    this.detectOS();
  },
  methods: {
    // 使用 Vue 的条件渲染通过 JavaScript 检测操作系统比 CSS 媒体查询更准确   可扩展性：可以在 JavaScript 中进行更多与平台相关的逻辑处理   可维护性：逻辑集中在一个地方，便于维护和修改   灵活性：可以根据需要添加更多的平台特定逻辑
    detectOS() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      this.isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

      // 检测鸿蒙系统
      this.isHarmonyOS = /HarmonyOS|OpenHarmony/i.test(userAgent);  // 兼容新旧版本标识
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100vh;
  overflow: hidden;
}

.app-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.tabbar-content {
  height: 50px;
  flex-shrink: 0;
}

.tabbar-content.ios-tabbar {
  height: 80px;
}

.tabbar-content.android-tabbar {
  height: 50px;
}

.tabbar-content.harmony-tabbar {
  height: 60px;
}

html, body {
  height: 100%;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
}

* {
  box-sizing: border-box;
}
</style>
