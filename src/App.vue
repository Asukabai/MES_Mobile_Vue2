<template>
  <div id="app">
    <div class="app-content">
      <div class="main-content">
        <router-view />
      </div>
      <div
          class="tabbar-content"
          :class="{ 'ios-tabbar': isIOS, 'android-tabbar': !isIOS }"
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
      isIOS: false
    }
  },
  mounted() {
    this.detectOS();
  },
  methods: {
    detectOS() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      this.isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
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

html, body {
  height: 100%;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
}

* {
  box-sizing: border-box;
}
</style>
