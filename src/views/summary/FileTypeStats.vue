<template>
  <div class="file-type-stats">
    <!-- 导航栏 -->
    <van-nav-bar title="文件类型统计" left-text="返回" left-arrow @click-left="$router.back()" />

    <!-- 时间选择器 -->
    <van-cell-group title="请选择时间范围">
      <van-cell title="开始时间" :value="startTime" @click="showStartPicker = true" />
      <van-cell title="结束时间" :value="endTime" @click="showEndPicker = true" />
      <van-button type="primary" block @click="onSearch">查询</van-button>
    </van-cell-group>

    <!-- 弹出开始时间选择器 -->
    <van-popup v-model="showStartPicker" position="bottom">
      <van-datetime-picker
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onStartConfirm"
          @cancel="showStartPicker = false"
      />
    </van-popup>

    <!-- 弹出结束时间选择器 -->
    <van-popup v-model="showEndPicker" position="bottom">
      <van-datetime-picker
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onEndConfirm"
          @cancel="showEndPicker = false"
      />
    </van-popup>

    <!-- 文件类型统计 -->
    <van-cell-group title="文件类型分布">
      <van-cell title="上传类型统计" :value="uploadFileTypes" />
      <van-cell title="下载类型统计" :value="downloadFileTypes" />
    </van-cell-group>
  </div>
</template>

<script>
import SensorRequest from '@/utils/SensorRequest';
import moment from 'moment';

export default {
  name: 'FileTypeStats',
  data() {
    return {
      uploadFileTypes: '--',
      downloadFileTypes: '--',

      startTime: '请选择开始时间',
      endTime: '请选择结束时间',
      showStartPicker: false,
      showEndPicker: false,
      minDate: new Date(2024, 0, 1),
      maxDate: new Date(2026, 11, 31)
    };
  },
  methods: {
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD');
    },

    onStartConfirm(date) {
      this.startTime = this.formatDate(date);
      this.showStartPicker = false;
    },

    onEndConfirm(date) {
      this.endTime = this.formatDate(date);
      this.showEndPicker = false;
    },

    onSearch() {
      if (!this.startTime || !this.endTime) {
        this.$toast.fail('请先选择完整的时间范围');
        return;
      }

      const params = {
        StartTime: this.startTime,
        EndTime: this.endTime
      };

      this.fetchFileTypeStats(params);
    },

    fetchFileTypeStats(params) {
      // 获取上传文件类型
      SensorRequest.GetUploadFileTypeStats(params, res => {
        if (res.result === 1 && res.respData) {
          const types = JSON.parse(res.respData);
          this.uploadFileTypes = Object.entries(types)
              .map(([type, count]) => `${type}: ${count}`)
              .join(', ') || '--';
        }
      }, err => {
        console.error('获取上传文件类型失败', err);
      });

      // 获取下载文件类型
      SensorRequest.GetDownloadFileTypeStats(params, res => {
        if (res.result === 1 && res.respData) {
          const types = JSON.parse(res.respData);
          this.downloadFileTypes = Object.entries(types)
              .map(([type, count]) => `${type}: ${count}`)
              .join(', ') || '--';
        }
      }, err => {
        console.error('获取下载文件类型失败', err);
      });
    }
  }
};
</script>

<style scoped>
.file-type-stats {
  padding: 16px;
}
</style>
