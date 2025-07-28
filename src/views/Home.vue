<template>
  <div>
    <!-- 上部分：顶部图片 -->
    <div class="header-image">
      <img src="../assets/sensor.png" alt="晟思智能工作助手" />
    </div>

    <!-- 中间部分：六宫格 -->
    <div class="grid-section">
      <van-grid :border="false" :column-num="3">
        <van-grid-item
            v-for="(item, index) in gridItems"
            :key="index"
            :icon="item.icon"
            :text="item.text"
            @click="handleGridClick(item)"
            class="custom-grid-item"
        />
      </van-grid>
    </div>

    <!-- 下部分：其他内容（可选） -->
    <div class="footer-section">
      <van-button
          type="primary"
          size="small"
          :disabled="countdown > 0"
          @click="generateSecretKey"
      >
        {{ countdown > 0 ? `重新获取(${countdown})` : '刷新密钥' }}
      </van-button>
      <van-button size="small" @click="copySecretToClipboard">点击复制密钥</van-button>

      <div v-if="secretKey" style="margin-top: 10px;">
        <p>密钥：<strong>{{ secretKey }}</strong></p>
      </div>
    </div>

    <!-- 原有注释部分保留 -->
    <!--
    <div class="footer-section">
      <div v-if="responseTime">
        <p>请求返回的验证码是: {{ responseTime }}</p>
      </div>
    </div>
    -->

    <MainTabBar />
  </div>
</template>

<script>
import MainTabBar from '@/components/MainTabBar.vue'
import { key_DingName, key_DingTokenJWT } from "@/utils/Dingding";
import SensorRequest from "@/utils/SensorRequest";
import {Toast} from "vant";

export default {
  name: 'HomePage',
  components: {
    MainTabBar
  },
  data() {
    return {
      responseTime: '', // 新增字段来存储返回的时间
      secretKey: null,  // 新增字段，用于存储密钥
      countdown: 0,     // 新增字段，控制倒计时
      intervalId: null,
      token: '',
      isTokening: 0,
      gridItems: [
        { icon: 'description-o', text: '项目编码', type: 'txt' },
        { icon: 'newspaper-o', text: '项目创建', type: 'txt' },
        { icon: 'records-o', text: '项目管理', type: 'txt' },
        { icon: 'notes-o', text: '任务下发', type: 'txt' },
        { icon: 'scan', text: '单板扫码', type: 'txt' },
        { icon: 'qr', text: '批量扫码', type: 'txt' },
        { icon: 'orders-o', text: '扫码记录', type: 'txt' },
        { icon: 'bar-chart-o', text: '统计报表', type: 'txt' },
        { icon: 'friends-o', text: '问题反馈', type: 'txt' }
      ]
    }
  },
  mounted() {
    this.fetchDDingCode();
  },
  beforeDestroy() {
    clearInterval(this.intervalId); // 清除定时器
  },
  methods: {
    copySecretToClipboard() {
      const el = document.createElement('textarea');
      el.value = this.secretKey;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      alert('密钥已复制到剪贴板');
    },
    generateSecretKey() {
      if (this.countdown > 0) return;

      this.secretKey = this.generateRandomSecret(); // 生成新密钥
      this.countdown = 5; // 设置倒计时时间

      const timer = setInterval(() => {
        this.countdown--;

        if (this.countdown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    },

    generateRandomSecret() {
      const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    },

    handleGridClick(item) {
      if (item.text === '项目编码') {
        this.$router.push('/project-code');
      }
      if (item.text === '扫码记录') {
        this.$router.push('/code-recode');
      }
      if (item.text === '问题反馈') {
        Toast.success('感谢您的反馈 ！');
      }
      if (item.text === '统计报表') {
        Toast.success('报表正在开发中 ！');
      }
    },

    getUserName() {
      const name = localStorage.getItem(key_DingName);
      if (name) {
        console.log('获取到的缓存 name:', name);
        return name;
      } else {
        console.log('未找到 name，缓存信息已过期，请重新登录');
        alert("缓存信息已过期，请退出系统重新登录");
        return null;
      }
    },

    fetchDDingCode() {
      if (this.isTokening > 0) {
        console.log('isTokening 1 :', this.isTokening);
        return;
      }
      this.isTokening = 1;
      console.log('isTokening 2 :', this.isTokening);

      const name = this.getUserName();
      if (name) {
        SensorRequest.GetDDingCode(
            localStorage.getItem(key_DingTokenJWT),
            (response) => {
              console.log('GetDDingCode Response:', response);
              this.responseTime = response;
              this.isTokening = 0;
              console.log('[成功] isTokening状态已重置为：', this.isTokening);
            },
            (error) => {
              console.log('GetDDingCode Error:', error);
              alert('请求失败: ' + error);
              this.isTokening = 0;
              console.log('[失败] isTokening状态已重置为：', this.isTokening);
            }
        );
      }
    }
  }
}
</script>

<style scoped>
/* 头部图片样式 */
.header-image {
  width: 35%;
  padding: 20px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.header-image img {
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

/* 六宫格容器 */
.grid-section {
  margin-top: 10px;
  background-color: #f5f5f5;
  padding: 10px;
}

/* 自定义每个六宫格项的样式 */
.custom-grid-item {
  border-right: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  background-color: #ffffff;
}

/* 最后一行去掉右侧边框 */
.custom-grid-item:nth-child(3n) {
  border-right: none;
}

/* 最后一排去掉底部边框 */
.custom-grid-item:nth-last-child(-n+3) {
  border-bottom: none;
}

/* 圆角与阴影增强整体层次感 */
.grid-section .van-grid {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* 下方区域样式（可选） */
.footer-section {
  flex: 1;
  padding: 16px;
  background-color: #fff;
  margin-top: 10px;
}
</style>
