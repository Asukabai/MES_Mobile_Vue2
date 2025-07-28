<template>
  <div class="verification-code">
    <!-- 刷新按钮 -->
    <van-button
        type="info"
        size="small"
        :disabled="isRefreshing"
        @click="fetchDDingCode"
    >
      {{ isRefreshing ? `请等待(${refreshCountdown}s)` : '获取密钥' }}
    </van-button>

    <!-- 验证码显示 -->
    <div class="code-display">
      <p v-if="ddingCode">
        MFA密钥 ：<strong>{{ ddingCode }}</strong>
        <span v-if="countdownVisible" class="countdown-text">（{{ countdownTime }}s 过期）</span>
      </p>
      <p v-else class="placeholder-text">***********</p>
    </div>
  </div>
</template>

<script>
import { key_DingTokenJWT } from '@/utils/Dingding'
import SensorRequest from '@/utils/SensorRequest'
import { Toast } from 'vant'

export default {
  name: 'VerificationCode',
  data() {
    return {
      ddingCode: '',
      isRefreshing: false,
      refreshCountdown: 10, // 获取按钮倒计时
      intervalId: null,

      // 新增字段：用于控制密钥隐藏倒计时
      countdownTime: 30,
      countdownVisible: false,
      hideInterval: null
    }
  },
  methods: {
    fetchDDingCode() {
      if (this.isRefreshing) return

      this.isRefreshing = true
      this.refreshCountdown = 10

      // 按钮禁用倒计时
      const timer = setInterval(() => {
        this.refreshCountdown--
        if (this.refreshCountdown <= 0) {
          this.isRefreshing = false
          clearInterval(timer)
        }
      }, 1000)

      // 发起请求
      const token = localStorage.getItem(key_DingTokenJWT)
      SensorRequest.GetDDingCode(
          token,
          (response) => {
            console.log("验证码："+response)
            try {
              this.ddingCode = response || '未知码'
              // 开始隐藏倒计时
              this.countdownTime = 30
              this.countdownVisible = true

              // 清除旧定时器，避免重复
              if (this.hideInterval) clearInterval(this.hideInterval)

              this.hideInterval = setInterval(() => {
                this.countdownTime--
                if (this.countdownTime <= 0) {
                  this.ddingCode = ''
                  this.countdownVisible = false
                  clearInterval(this.hideInterval)
                }
              }, 1000)
            } catch (e) {
              this.ddingCode = '解析失败'
              console.error('响应内容无法解析为JSON', response)
            }
          },
          (error) => {
            this.ddingCode = '获取失败'
            Toast.fail('请求失败：' + error)
          }
      )
    }
  },
  beforeDestroy() {
    if (this.intervalId) clearInterval(this.intervalId)
    if (this.hideInterval) clearInterval(this.hideInterval)
  }
}
</script>

<style scoped>
.verification-code {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.code-display {
  font-size: 14px;
  color: #333;
  margin-left: 16px;
  min-width: 120px;
  display: flex;
  align-items: center;
}

.placeholder-text {
  font-size: 16px;
  font-weight: bold;
  color: #999;
}

.countdown-text {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
}

.van-button--small {
  height: 30px;
  font-size: 12px;
  padding: 0 10px;
  white-space: nowrap;
}
</style>
