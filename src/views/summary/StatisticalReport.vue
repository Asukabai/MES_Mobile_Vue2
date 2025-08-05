<template>
  <div class="statistical-report">
    <!-- 加载动画 -->
    <van-overlay :show="loading" z-index="9999">
      <div class="loading-box">
        <van-loading type="spinner" size="24px">页面加载中...</van-loading>
      </div>
    </van-overlay>

    <!-- 导航栏 -->
<!--    <van-nav-bar title="统计报表" />-->

    <!-- 单独展示：服务器资源 -->
    <div class="server-resource-panel">

      <!-- 环形图整体容器 -->
      <div class="resource-charts-container">
        <div class="chart-item">
          <p class="chart-label">CPU 使用率 {{ serverCpuText }}</p>
          <van-circle
              v-model="serverCpu"
              :rate="100"
              :current-rate="serverCpu"
              :color="getCircleColor(serverCpu)"
              layer-color="#ebedf0"
              size="90px"
              stroke-width="60"
          />
        </div>

        <div class="chart-item">
          <p class="chart-label">内存使用率 {{ serverMemory }}%</p>
          <van-circle
              v-model="serverMemory"
              :rate="100"
              :current-rate="serverMemory"
              :color="getCircleColor(serverMemory)"
              layer-color="#ebedf0"
              size="90px"
              stroke-width="60"
          />
        </div>

        <div class="chart-item">
          <p class="chart-label">硬盘使用率 {{ serverDisk }}%</p>
          <van-circle
              v-model="serverDisk"
              :rate="100"
              :current-rate="serverDisk"
              :color="getCircleColor(serverDisk)"
              layer-color="#ebedf0"
              size="90px"
              stroke-width="60"
          />
        </div>
      </div>
    </div>

    <!-- 时间与服务器信息 -->
    <van-cell-group title="基础信息">
      <van-cell title="本地时间" :value="localTime" />
      <van-cell title="服务器时间" :value="serverTime" />
    </van-cell-group>

    <!-- 文件上传/下载统计 -->
    <van-cell-group title="文件统计">
      <van-cell
          title="上传文件信息汇总"
          is-link
          @click="$router.push('/sensor_ddingWork/Release/upload-summary')"
      />
      <van-cell
          title="下载文件信息汇总"
          is-link
          @click="$router.push('/sensor_ddingWork/Release/upload-summary')"
      />
    </van-cell-group>

    <!-- 日志信息 -->
    <van-cell-group title="最近日志">
      <van-cell title="查看最近日志" is-link @click="$router.push('/sensor_ddingWork/Release/recent-logs')" />
    </van-cell-group>

    <!-- 在线人数 -->
    <van-cell-group title="用户统计">
      <van-cell title="当前在线人数" :value="onlineUsers" />
    </van-cell-group>
  </div>
</template>

<script>
import SensorRequest from '@/utils/SensorRequest';

export default {
  name: 'StatisticalReport',
  data() {
    return {
      localTime: '--',
      serverTime: '--',
      serverCpu: 0,
      serverCpuText: '--',
      serverMemory: 0,
      serverMemoryText: '--',
      serverDisk: 0,
      serverDiskText: '--',
      uploadCount: '--',
      downloadCount: '--',
      onlineUsers: '--',
      loading: false // 控制 loading 显示状态
    };
  },
  mounted() {
    this.showLoadingAndFetch();
  },
  activated() {
    // 如果你使用了 <keep-alive> 缓存组件，这个钩子会在激活时触发
    this.showLoadingAndFetch();
  },
  methods: {
    getCircleColor(percent) {
      if (percent < 60) return '#07c160'; // 绿色
      if (percent < 90) return '#ff9900'; // 橙色
      return '#ff0000'; // 红色
    },

    showLoadingAndFetch() {
      this.loading = true;

      // 延迟执行请求，避免闪屏
      setTimeout(() => {
        this.fetchBasicStats();
      }, 100);
    },

    fetchBasicStats() {
      // 获取本地时间
      this.localTime = new Date().toLocaleString();

      // 获取服务器时间
      SensorRequest.GetServerTime('', res => {
        this.serverTime = res || '--';
        this.hideLoadingWhenAllDone();
      }, err => {
        console.error('🚫 请求 [GetServerTime] 失败:', err);
        this.serverTime = '--';
        this.hideLoadingWhenAllDone();
      });

      // 获取服务器信息
      SensorRequest.GetServerInfo('', res => {
        try {
          const info = JSON.parse(res);
          const cpu = parseFloat(info.CPU_Size);
          this.serverCpu = !isNaN(cpu) ? cpu : 0;
          this.serverCpuText = this.serverCpu + '%';

          const memory = parseFloat(info.Memory_Space_Size);
          this.serverMemory = !isNaN(memory) ? memory : 0;
          this.serverMemoryText = this.serverMemory + '%';

          const disk = parseFloat(info.Harddisk_Space_Size);
          this.serverDisk = !isNaN(disk) ? disk : 0;
          this.serverDiskText = this.serverDisk + '%';
        } catch (e) {
          console.error('解析服务器信息失败:', e);
        }
        this.hideLoadingWhenAllDone();
      }, err => {
        console.error('获取服务器信息失败', err);
        this.hideLoadingWhenAllDone();
      });

      // 获取在线人数
      SensorRequest.GetOnlineUsers('', res => {
        this.onlineUsers = JSON.parse(res) || '--';
        this.hideLoadingWhenAllDone();
      }, err => {
        console.error('获取在线人数失败', err);
        this.hideLoadingWhenAllDone();
      });
    },

    hideLoadingWhenAllDone() {
      // 所有异步完成后隐藏 loading
      setTimeout(() => {
        this.loading = false;
      }, 500); // 防止过快关闭
    }
  }
};
</script>

<style scoped>
.statistical-report {
  padding: 16px;
}

.server-resource-panel {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin-bottom: 20px;
}

.resource-charts-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.chart-item:hover {
  background-color: #f0f0f0;
}

.chart-label {
  font-size: 14px;
  margin-top: 8px;
  color: #333;
}

/* loading 居中蒙层 */
.loading-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  z-index: 9999;
}
</style>
