<template>
  <div class="tabbar-wrapper">
    <van-tabbar v-model="active" class="fixed-tabbar" :safe-area-inset-bottom="true">
      <van-tabbar-item
          v-for="(item, index) in tabbars"
          :key="index"
          :to="item.path"
          :badge="item.badge"
      >
        <!-- 自定义图标 -->
        <template #icon="{ active }">
          <img
              :src="active ? item.iconActive : item.iconInactive"
              :alt="item.title"
              style="width: 24px; height: 24px;"
          />
        </template>

        <!-- 文字标题 -->
        <span>{{ item.title }}</span>
      </van-tabbar-item>
    </van-tabbar>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 基础路径和当前激活的 tab 索引
      basePath: '/sensor_ddingWork/Release/',
      active: 0,

      // 图标资源路径（可以统一管理或按需加载）
      icons: {
        message: {
          active: require('@/assets/icons/message-active.png'),
          inactive: require('@/assets/icons/message-inactive.png')
        },
        task: {
          active: require('@/assets/icons/task-active.png'),
          inactive: require('@/assets/icons/task-inactive.png')
        },
        home: {
          active: require('@/assets/icons/home-active.png'),
          inactive: require('@/assets/icons/home-inactive.png')
        },
        share: {
          active: require('@/assets/icons/share-active.png'),
          inactive: require('@/assets/icons/share-inactive.png')
        },
        user: {
          active: require('@/assets/icons/user-active.png'),
          inactive: require('@/assets/icons/user-inactive.png')
        }
      }
    };
  },
  computed: {
    tabbars() {
      const base = this.basePath;
      return [
        {
          title: '知识库',
          path: base + 'chat_category',
          iconActive: this.icons.message.active,
          iconInactive: this.icons.message.inactive
        },
        {
          title: '任务',
          path: base + 'task',
          iconActive: this.icons.task.active,
          iconInactive: this.icons.task.inactive
        },
        {
          title: '工作台',
          path: base + 'home',
          iconActive: this.icons.home.active,
          iconInactive: this.icons.home.inactive
        },
        {
          title: '分享',
          path: base + 'cart',
          iconActive: this.icons.share.active,
          iconInactive: this.icons.share.inactive
        },
        {
          title: '我的',
          path: base + 'user',
          iconActive: this.icons.user.active,
          iconInactive: this.icons.user.inactive
        }
      ];
    }
  },
  watch: {
    '$route.path': function (newPath) {
      this.updateActiveTab(newPath);
    }
  },
  methods: {
    updateActiveTab(path) {
      const index = this.tabbars.findIndex(item => item.path === path);
      if (index !== -1) {
        this.active = index;
      }
    }
  },
  mounted() {
    this.updateActiveTab(this.$route.path);
  }
};
</script>

<style scoped>
.tabbar-wrapper {
  padding-bottom: env(safe-area-inset-bottom);
}

.fixed-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom); /* 避开 Home Indicator */
  background-color: #fff; /* 确保背景色防止透明 */
}

/* 可选：添加图标过渡效果 */
.van-tabbar-item__icon img {
  transition: all 0.2s ease-in-out;
}
</style>
