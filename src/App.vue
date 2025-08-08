<template>
  <div id="app">
    <router-view />
    <MainTabBar />
  </div>
</template>

<script>
import MainTabBar from '@/components/MainTabBar.vue'

export default {
  name: 'App',
  components: {
    MainTabBar
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  /* 防止iOS Safari地址栏隐藏/显示时的页面跳动 */
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 防止iOS Safari地址栏隐藏/显示时的页面跳动 */
html, body {
  height: 100%;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>
