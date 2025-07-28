<template>
  <div>
    <!-- 用户信息卡片 -->
    <van-cell-group class="user-card">
      <van-cell
          title="用户信息"
          icon="user-o"
          :title-style="{ fontWeight: 'bold', fontSize: '16px' }"
      />
      <van-cell>
        <div style="display: flex; align-items: center;">
          <div class="user-avatar">
            <van-image round width="50px" height="50px" src="https://img.yzcdn.cn/vant/cat.jpeg" />
          </div>
          <div class="user-details">
            <p v-if="!userInfo.name">正在加载用户信息...</p>
            <p v-else><strong>姓名：</strong>{{ userInfo.name }}</p>
            <p><strong>手机号：</strong>{{ userInfo.phone }}</p>
          </div>
        </div>
      </van-cell>
    </van-cell-group>
    <!-- 其他功能入口 -->
    <van-cell-group style="margin-top: 15px;">
      <van-cell title="个人资料" is-link @click="$router.push('/profile')" />
      <van-cell title="邀请成员" is-link @click="handleInviteClick" />
      <van-cell title="推送通知" is-link @click="handlePushNotification" />
      <van-cell title="在线支持" is-link @click="handleOnlineSupport" />
<!--      <van-cell title="问题反馈" is-link @click="handleFeedback" />-->
<!--      <van-cell title="设置" is-link @click="handleSettings" />-->
    </van-cell-group>
    <MainTabBar/>
  </div>
</template>

<script>
import { Cell, CellGroup, Image,Toast } from 'vant'
import MainTabBar from '@/components/MainTabBar.vue'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "MyUser",
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup,
    VanImage: Image,
    MainTabBar
  },
  data() {
    return {
      userInfo: {
        name: '',
        phone: ''
      }
    };
  },
  mounted() {
    this.loadUserInfo();
  },
  methods: {
    loadUserInfo() {
      const name = localStorage.getItem('sensor_DingName'); // 从缓存中获取姓名
      const phone = localStorage.getItem('key_DingUserPhone'); // 假设手机号也已保存

      this.userInfo = {
        name: name || '未知用户',
        phone: phone || '未绑定手机号'
      };
    },
    handleInviteClick() {
      Toast.success('功能开发中：邀请成员');
    },
    handlePushNotification() {
      Toast.success('推送通知已开启');
    },
    handleOnlineSupport() {
      Toast.loading({
        message: '正在连接客服...',
        forbidClick: true,
        duration: 2000
      });
    },
    handleFeedback() {
      Toast.success('感谢您的反馈！');
    },
    handleSettings() {
      this.$router.push('/settings'); // 跳转到设置页面
    }
  }
};
</script>


<style scoped>
.user-card .van-cell__value {
  display: flex;
  align-items: center;
}

.user-avatar {
  margin-right: 25px;
}

.user-details {
  text-align: left;
}
</style>
