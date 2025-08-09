<template>
  <div class="user-page-wrapper" :class="{ 'safe-area-bottom': isIOS }">
    <div class="user-content">
      <van-cell
          :title-style="{ fontWeight: 'bold', fontSize: '16px' }"
      />
      <!-- 用户信息卡片 -->
      <van-cell-group class="user-card">
        <van-cell class="user-card-background">
          <div style="display: flex; align-items: center;">
<!--            <div class="user-avatar">-->
<!--              <van-image-->
<!--                  round-->
<!--                  width="50px"-->
<!--                  height="50px"-->
<!--                  :src="require('@/assets/企业头像.png')"-->
<!--              />-->
<!--            </div>-->
            <div class="user-details">
              <p v-if="!userInfo.name">正在加载用户信息...</p>
              <p v-else><strong>姓名：</strong>{{ userInfo.name }}</p>
              <p><strong>手机号：</strong>{{ userInfo.phone }}</p>
              <p><strong>企业：</strong>陕西晟思智能测控有限公司 </p>
            </div>
          </div>
        </van-cell>
        <!-- 下部分：验证码区域 -->
        <div class="footer-section">
          <VerificationCode />
        </div>
      </van-cell-group>


      <!-- 其他功能入口 -->
      <van-cell-group style="margin-top: 15px;">
        <van-cell title="个人资料" is-link @click="$router.push('/sensor_ddingWork/Release/profile')" />
        <van-cell title="缓存清理" is-link @click="handleInviteClick" />
        <van-cell title="推送通知" is-link @click="handlePushNotification" />
        <van-cell title="在线支持" is-link @click="handleOnlineSupport" />
        <!--      <van-cell title="问题反馈" is-link @click="handleFeedback" />-->
        <!--      <van-cell title="设置" is-link @click="handleSettings" />-->
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import * as dd from 'dingtalk-jsapi'
// import { Cell, CellGroup, Image,Toast } from 'vant'
import { Cell, CellGroup, Toast } from 'vant'
import VerificationCode from "@/components/VerificationCode.vue";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "MyUser",
  components: {
    VerificationCode,
    VanCell: Cell,
    VanCellGroup: CellGroup,

  },
  data() {
    return {
      userInfo: {
        name: '',
        phone: ''
      },
      isIOS: false
    };
  },
  mounted() {
    this.loadUserInfo();
    this.detectIOS();
  },
  methods: {
    detectIOS() {
      // 检测是否为iOS设备
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      this.isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    },
    loadUserInfo() {
      const name = localStorage.getItem('sensor_DingName'); // 从缓存中获取姓名
      const phone = localStorage.getItem('key_DingUserPhone'); // 假设手机号也已保存

      this.userInfo = {
        name: name || '未知用户',
        phone: phone || '未绑定手机号'
      };
    },
    handleInviteClick() {
      this.$dialog.confirm({
        title: '提示',
        message: '确定要清除所有本地缓存吗？',
      }).then(() => {

        // 判断是否在钉钉客户端环境中
        if (typeof dd === 'undefined') {
          console.warn('当前环境不支持 dd API，dd 未定义');
          this.$toast.fail('请在钉钉客户端中操作');
          return;
        }

        try {
          // 调用钉钉同步清除缓存方法
          const result = dd.clearStorage;

          // 打印结果
          console.log("清理结果:", result);
          console.log("result.errMsg:", result.errMsg);

          if (result && result.errMsg === 'clearStorageSync:ok') {
            this.$toast.success('缓存已清除');
            this.loadUserInfo(); // 可选：重新加载用户信息
          } else {
            this.$toast.fail('清除缓存失败');
            console.warn('清除缓存返回:', result);
          }
        } catch (e) {
          console.error('调用 clearStorageSync 出错:', e);
          this.$toast.fail('清除缓存失败，请稍后再试');
        }

      }).catch(() => {
        // 用户点击取消
        console.log('用户取消清除操作');
      });
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
      this.$router.push('/sensor_ddingWork/Release/settings'); // 跳转到设置页面
    }
  }
};
</script>

<style scoped>.user-page-wrapper {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.user-content {
  padding: 0 0 10px 0;
  min-height: 100%;
}

.user-card {
  margin: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.user-card-background {
  background-image: url('../../assets/background-2.png'); /* 替换为您的背景图片路径 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 150px;
  position: relative;
}

.user-card-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2); /* 半透明白色遮罩 */
  z-index: 1;
}

.user-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.user-avatar {
  margin-bottom: 15px;
  position: relative;
  z-index: 2;
}

.user-details {
  text-align: left;
  position: relative;
  z-index: 2;
  width: 100%;
}

.user-details p {
  background-color: rgba(255, 255, 255, 0.7); /* 为文字添加轻微背景以提高可读性 */
  padding: 10px 10px;
  border-radius: 15px;
  display: block;
  margin: 8px 0;
  text-align: left;
}

/* 确保最后的内容不会被底部导航栏遮挡 */
.van-cell-group:last-child {
  margin-bottom: 20px;
}
</style>