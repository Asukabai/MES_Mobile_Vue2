<template>
  <div class="swiper">
    <van-swipe
        :autoplay="3000"
        indicator-color="#ffffff"
        height="390rpx"
        @change="onChange"
    >
      <van-swipe-item v-for="(item, index) in swiperList" :key="index">
        <img :src="item" alt="" style="width: 100%; height: 390rpx;" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import Banner from '@/assets/backgroundL.png';

export default {
  name: 'MBanner',
  data() {
    return {
      swiperList: [Banner],
      current: 0
    };
  },
  methods: {
    onChange(index) {
      this.current = index;
    },
    onClick() {
      // 处理点击事件
    }
  }
};
</script>

<style scoped>
.swiper {
  /deep/ .van-swipe {
    border-radius: 0;
  }
}
</style>
