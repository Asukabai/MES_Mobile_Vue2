<template>
  <div class="profile-container">
    <!-- 用户信息区域 -->
    <div class="user-info-section">
      <h3>用户信息</h3>
      <div class="info-item"><strong>姓名：</strong>{{ userInfo.name }}</div>
      <div class="info-item"><strong>手机号：</strong>{{ userInfo.phone }}</div>
      <div class="info-item"><strong>用户ID：</strong>{{ userInfo.id }}</div>
    </div>

    <!-- 系统秘钥区域 -->
<!--    <div class="secret-key-section">-->
<!--      <h4>系统秘钥</h4>-->
<!--      <div class="key-display" @click="copySecretKey">{{ secretKey }}</div>-->
<!--      <van-button type="primary" @click="refreshSecretKey">刷新秘钥</van-button>-->
<!--    </div>-->
  </div>
</template>

<script>
import { Toast } from 'vant'

export default {
  name: "ProfilePage",
  data() {
    return {
      // 用户信息
      userInfo: {
        name: localStorage.getItem('sensor_DingName') || '未知用户',
        phone: localStorage.getItem('key_DingUserPhone') || '未绑定手机号',
        id: localStorage.getItem('key_DingUserIndex') || '无ID'
      },
      // 秘钥信息
      secretKey: ''
    };
  },
  mounted() {
    this.loadSecretKey();
  },
  methods: {
    // 模拟从接口获取秘钥（实际应调用 API）
    loadSecretKey() {
      this.secretKey = this.generateRandomKey();
    },

    // 刷新秘钥
    refreshSecretKey() {
      this.loadSecretKey();
      Toast.success('秘钥已刷新');
    },

    // 生成随机秘钥字符串（仅示例）
    generateRandomKey(length = 16) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let key = '';
      for (let i = 0; i < length; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return key;
    },

    // 复制秘钥到剪贴板
    copySecretKey() {
      const text = this.secretKey;
      navigator.clipboard.writeText(text)
          .then(() => {
            Toast.success('复制成功');
          })
          .catch(err => {
            console.error('复制失败:', err);
            Toast.fail('复制失败');
          });
    }
  }
};
</script>

<style scoped>
.profile-container {
  padding: 16px;
}

.user-info-section,
.secret-key-section {
  border: 1px solid #ebedf0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.info-item {
  margin-bottom: 10px;
}

.key-display {
  font-family: monospace;
  margin-bottom: 16px;
  word-break: break-all;
  cursor: pointer;
  color: #1989fa;
  user-select: text;
  padding: 8px;
  border-radius: 4px;
}

.key-display:hover {
  background-color: #e8f4ff;
  text-decoration: underline;
}
</style>
