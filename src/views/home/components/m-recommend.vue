<template>
  <div class="recommend">
    <div class="header">
      <div class="left">
        <div class="title">今日主推</div>
      </div>
      <div class="right" @click="goMore">
        <span>更多</span>
        <van-icon name="arrow" size="16px" />
      </div>
    </div>
    <div class="list-wrapper">
      <div class="list">
        <div class="item" v-for="item in contentList" :key="item.id">
          <div class="banner-wrapper">
            <img class="banner" :src="item.banner" />
          </div>
          <div class="title">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconTitle from '@/assets/icon-title-act.svg';
import BgDemo1 from '@/assets/bg-demo1.jpg';
import BgDemo2 from '@/assets/bg-demo2.jpg';
import BgDemo3 from '@/assets/bg-demo3.jpg';

export default {
  name: 'MRecommend',
  data() {
    return {
      IconTitle,
      contentList: [
        {
          id: 1,
          title: '文章标题',
          banner: BgDemo1,
        },
        {
          id: 2,
          title: '文章标题',
          banner: BgDemo2,
        },
        {
          id: 3,
          title: '文章标题',
          banner: BgDemo3,
        },
        {
          id: 4,
          title: '文章标题',
          banner: BgDemo2,
        },
      ]
    };
  },
  methods: {
    goMore() {
      // 跳转到更多页面
    },
    goActivityList() {
      // 跳转到活动清单
    }
  }
};
</script>

<style scoped>
.recommend {
  padding: 10px 15px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .left {
    .title {
      font-size: 18px;
      color: #01050c;
    }
  }

  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #01050c;
    font-size: 13px;
  }
}

.list-wrapper {
  overflow: hidden;
  margin-top: 30px;
}

.list {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: auto;
  gap: 20px;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    display: none; /* 隐藏滚动条 */
  }

  -ms-overflow-style: none; /* IE and Edge 隐藏滚动条 */
  scrollbar-width: none; /* Firefox 隐藏滚动条 */

  .item {
    width: 100px;
    flex-shrink: 0; /* 防止项目被压缩 */

    .banner-wrapper {
      font-size: 0;
      .banner {
        width: 100px;
        height: 140px;
        border-radius: 4px;
      }
    }

    .title {
      @include line-clamp-2();
      font-size: 12px;
      color: #01050c;
      margin-top: 15px;
    }
  }
}
</style>
