<template>
  <div class="ad">
    <img class="bg" :src="BgAd" alt="广告图片" />
  </div>
</template>

<script>
import BgAd from '@/assets/bg-ad.jpg';

export default {
  name: 'MAd',
  data() {
    return {
      BgAd
    };
  }
};
</script>

<style scoped>
.ad {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
}
</style>
