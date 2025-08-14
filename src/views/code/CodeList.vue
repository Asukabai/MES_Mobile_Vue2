<template>
  <div class="welcome-container">
  <div class="container">
<!--    <div class="header">-->
<!--      <h6> &nbsp;&nbsp;&nbsp;&nbsp;本人记录日志时间列表</h6>-->
<!--    </div>-->
    <div class="block" >
      <div class="radio">
        排序方式：
        <el-radio-group v-model="reverse">
          <el-radio :label="true">倒序</el-radio>
          <el-radio :label="false">正序</el-radio>
        </el-radio-group>
      </div>
      <div style="height: 20px;"></div>
      <div class="timeline-container">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp">
            {{activity.content}} :
            {{activity.operation}}
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <p>需上传记录此处才有日志，仅扫码无记录</p>
    <el-button type="primary" @click="goBackFlash" style="width: 27%">刷新列表</el-button>
    <el-button type="primary" @click="goBackMore" style="width: 27%">查看详情</el-button>
  </div>
  </div>
</template>
<script>
// import {key_DingUserPhone
// } from "@/utils/Dingding.js";
import SensorBorderRequest from "../../utils/SensorRequest";
import {key_DingUserPhone} from "@/utils/Dingding";
export default {

  data() {
    return {
      reverse: true,
      activities: [], // 初始化为空数组
      isLoading: true // 加载状态
    };
  },
  methods: {
    formatTimestamp(timestamp) {
      const date = new Date(timestamp); // 解析 ISO 时间
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    },
    goBackHome() {
      this.$router.push({ path: '/ddinguia/web/home' }); },
    goBackMore() {
      this.$router.push({ path: '/ddinguia/web/history222' }); },

    goBackFlash() {
      this.fetchActivities();
      this.$message({
        message: '刷新成功！',
        type: 'success'
      });
    },

    fetchActivities() {
      let key_DingUserPhone1=  localStorage.getItem(key_DingUserPhone);
      const requestParams = JSON.stringify({
        Person_Phone: key_DingUserPhone1,
        // Person_Phone: 18192414283,
      });
      SensorBorderRequest.GetAssetOperationInfoByPersonFun(requestParams, response => {
        console.log('Received response data:', response); // 打印日志
        let parse = JSON.parse(response);
          if (Array.isArray(parse) && parse.length > 0) {
            this.activities = parse.map(item => ({
              operation: item.Operation_Type,     // 操作类型：焊接、入库等
              content: item.Asset_Code,          // 资产编号
              timestamp: this.formatTimestamp(item.Ts_create), // 格式化时间
            })).reverse();
            this.$message({
              message: '查询日志记录时间列表成功 ！',
              type: 'success',
              duration: 2000, // 2秒后自动关闭
              showClose: true // 显示关闭按钮
            });
          } else {
            this.activities = []; // 设置为空数组
            this.$message({
              message: '暂无数据，日志记录时间列表为空 ！',
              type: 'info',
              duration: 2000, // 2秒后自动关闭
              showClose: true // 显示关闭按钮
            });
          }
          this.isLoading = false; // 数据加载完成后将 isLoading 设置为 false
        },
        (error) => {
          console.error(error);
          this.$message({
            message: error,
            type: 'error'
          });
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.fetchActivities(); // 组件挂载时获取数据
  }
};
</script>
<style scoped>
.welcome-container {
    flex-direction: column;
    min-height: 95vh;
    padding: 1rem;
    padding-top: 80px;
}

.header {
  display: block;
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  color: #212529;
  overflow-wrap: break-word;
  max-width: 340px;
}

.container {
  margin-top: -10px; /* 整体下降 300px */
}

.timeline-container {
  max-height: 300px; /* 设置最大高度 */
  overflow-y: auto; /* 添加垂直滚动条 */
  border: 1px solid #c7c9cb; /* 可选：添加边框以便更好地识别区域 */
  padding: 15px 5px; /* 上下内边距为10px，左右内边距为5px */
  margin: 0 15px; /* 可选：设置左右外边距，以进一步减少宽度 */
}
</style>
