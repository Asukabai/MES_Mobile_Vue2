<!-- src/views/home/Home.vue -->
<template>
  <div class="container">
    <m-banner />
    <div class="wrapper">
      <m-menu />
      <m-recommend />
      <m-ad />
    </div>
  </div>
</template>

<script>
import MBanner from './components/m-banner.vue';
import MMenu from './components/m-menu.vue';
import MRecommend from './components/m-recommend.vue';
import MAd from './components/m-ad.vue';

export default {
  name: 'HomePage',
  components: {
    MBanner,
    MMenu,
    MRecommend,
    MAd
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #EDF2FA;
  padding-bottom: 1px;
}

.wrapper {
  border-radius: 25px 25px 0 0;
  min-height: 200px;
  background: #EDF2FA;
  position: relative;
  top: -10px;
}
</style>
