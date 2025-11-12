<template>
  <div class="progress-tracking-container">
    <div class="content">
      <!-- 仪表盘 -->
      <div class="board-section">
        <h4>项目仪表盘</h4>
        <div class="dashboard">
          <div v-for="(item, index) in dashboardData" :key="index" class="dashboard-item">
            <canvas :id="'chart-' + index" width="200" height="200" style="width: 100px; height: 100px"></canvas>
            <p>{{ item.label }}</p>
          </div>
        </div>
      </div>

      <!-- 项目负责人条形图 -->
      <div class="board-section">
        <h4>项目负责人条形图</h4>
        <div class="chart-wrapper">
          <div class="chart-container-responsive" ref="barChartContainer">
            <canvas id="ownerBarChart"></canvas>
          </div>
        </div>
      </div>

      <!-- 项目进度看板 -->
      <div class="board-section">
        <div class="board-header">
          <h3>项目进度看板</h3>
          <!-- 查看更多按钮放在同一行 -->
          <div v-if="shouldShowViewMore" class="view-more-btn" @click="toggleExpand">
            {{ isExpanded ? '收起' : '查看更多' }}
          </div>
        </div>

        <!-- 卡片内容区域 -->
        <van-row gutter="10">
          <van-col span="12" v-for="(item, index) in displayedTaskProgressData" :key="index">
            <div class="card">
              <p>{{ item.name }}</p>
              <van-progress :percentage="item.progress" :color="item.color" />
              <p style="color: #999">{{ item.progress }}%</p>
              <!-- 添加项目状态标签 -->
              <van-tag :type="getTagType(item.status)" style="margin-top: 5px;">
                {{ item.status }}
              </van-tag>
              <!-- 添加跳转图标 -->
              <div class="card-more" @click="goToProjectDetail(item)">
                <van-icon name="ellipsis" />
              </div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import SensorRequest from '@/utils/SensorRequest';

export default {
  name: 'ProgressTracking',
  data() {
    return {
      taskProgressData: [], // 清空假数据
      isExpanded: false,
      superintendentData: [], // 清空负责人数据假数据
      dashboardData: [
        { label: '进行率', value: 75 },
        { label: '完成率', value: 25 },
        { label: '延期率', value: 10 }
      ],
      charts: []
    };
  },
  mounted() {
    this.renderCharts();
    this.fetchProjectData(); // 获取项目数据
    this.fetchBarChartData(); // 获取后端数据
    window.addEventListener('resize', this.resizeCharts);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts);
    this.charts.forEach(chart => chart.dispose());
  },
  computed: {
    displayedTaskProgressData() {
      return this.isExpanded ? this.taskProgressData : this.taskProgressData.slice(0, 2);
    },
    shouldShowViewMore() {
      return this.taskProgressData.length > 2;
    }
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    goToProjectDetail(item) {
      this.$router.push({
        path: `/project-detail/${item.id}`,
        query: { name: item.name }
      });
    },
    // 获取项目数据
    fetchProjectData() {
      SensorRequest.GetAllProjectInfoStateFun("", respData => {
        console.log("项目数据:", respData);
        let JSON_respData =  JSON.parse(respData)
        // 检查返回的数据是否为数组
        if (Array.isArray(JSON_respData)) {
          // 处理数据，将后端数据转换为前端需要的格式
          this.taskProgressData = JSON_respData.map(item => ({
            id: item.Id,
            name: item.Project_Name,
            progress: parseInt(item.Project_Progress) || 0,
            color: this.getStatusColor(item.Project_Status),
            status: item.Project_Status
          }));
        } else {
          console.warn('返回的项目数据结构不符合预期:', respData);
        }
      }, error => {
        console.error('获取项目数据失败:', error);
      });
    },
    // 根据项目状态获取对应的颜色
    getStatusColor(status) {
      switch (status) {
        case '已完成':
          return '#07c160';
        case '进行中':
          return '#1989fa';
        case '未开始':
          return '#969799';
        case '延期':
          return '#ee0a24';
        default:
          return '#1989fa';
      }
    },
    // 根据项目状态获取标签类型
    getTagType(status) {
      switch (status) {
        case '已完成':
          return 'success';
        case '进行中':
          return 'primary';
        case '未开始':
          return 'default';
        case '延期':
          return 'danger';
        default:
          return 'default';
      }
    },
    // 获取条形图数据
    fetchBarChartData() {
      SensorRequest.GetAllProjectParticipantFun("", respData => {
        // 直接使用返回的数据，它就是一个数组
        console.log("respData:", respData);
        let JSON_respData =  JSON.parse(respData)
        // 检查返回的数据是否为数组
        if (Array.isArray(JSON_respData)) {
          // 处理数据，CountString 中的四个值分别代表：其他、进行中、已完成、延期
          this.superintendentData = JSON_respData.map(item => ({
            owner: item.PersonName,
            other: item.CountString[0],
            inProgress: item.CountString[1],
            onTime: item.CountString[2],
            delayed: item.CountString[3]
          }));
          
          // 数据获取成功后重新渲染条形图
          this.$nextTick(() => {
            this.renderBarChart();
          });
        } else {
          console.warn('返回的数据结构不符合预期:', respData);
        }
      }, error => {
        console.error('获取项目负责人数据失败:', error);
      });
    },
    renderCharts() {
      this.dashboardData.forEach((item, index) => {
        const chartDom = document.getElementById(`chart-${index}`);
        if (!chartDom) return;
        const myChart = echarts.init(chartDom, null, {
          devicePixelRatio: window.devicePixelRatio
        });

        this.charts.push(myChart);

        const option = {
          title: {
            text: `${item.value}%`,
            left: 'center',
            top: 'center',
            fontSize: 14
          },
          tooltip: { show: false },
          series: [
            {
              type: 'pie',
              radius: ['70%', '95%'],
              avoidLabelOverlap: false,
              label: { show: false },
              data: [
                { value: item.value, name: '占比', itemStyle: { color: '#1989fa' } },
                { value: 100 - item.value, name: '剩余', itemStyle: { color: '#ebedf0' } }
              ],
              emphasis: { scale: false }
            }
          ]
        };

        myChart.setOption(option);
      });
    },
    renderBarChart() {
      const chartDom = document.getElementById('ownerBarChart');
      if (!chartDom) return;

      // 使用新的数据结构
      const owners = this.superintendentData.map(item => item.owner);
      
      // 获取容器宽度，适配屏幕
      const containerWidth = this.$refs.barChartContainer.clientWidth;
      const chartHeight = Math.max(200, 50 + owners.length * 25); // 增加高度

      // 设置 canvas 尺寸
      chartDom.width = containerWidth;
      chartDom.height = chartHeight;

      const myChart = echarts.init(chartDom, null, {
        devicePixelRatio: window.devicePixelRatio
      });
      this.charts.push(myChart);

      // 根据新数据结构提取各类状态数据
      const onTimeData = this.superintendentData.map(item => item.onTime);
      const delayedData = this.superintendentData.map(item => item.delayed);
      const inProgressData = this.superintendentData.map(item => item.inProgress);
      const otherData = this.superintendentData.map(item => item.other);

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: ['已完成', '延期', '进行中', '其他'],
          top: 10,
          textStyle: { fontSize: 10 }
        },
        title: {
          text: '项目数量',
          left: 'right',
          bottom: 0,
          textStyle: {
            fontSize: 10,
            color: '#666'
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          top: 40,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            interval: 0,
            rotate: 0,
            margin: 10
          }
        },
        yAxis: {
          type: 'category',
          data: owners,
          axisLabel: {
            fontSize: 10,
            rotate: 30,
            formatter: function(value) {
              return value.length > 4 ? value.slice(0, 4) + '...' : value;
            }
          }
        },
        series: [
          {
            name: '已完成',
            type: 'bar',
            stack: '总量',
            itemStyle: { color: '#07c160' },
            data: onTimeData,
            smooth: true,
            sampling: 'lttb'
          },
          {
            name: '延期',
            type: 'bar',
            stack: '总量',
            itemStyle: { color: '#ee0a24' },
            data: delayedData,
            smooth: true,
            sampling: 'lttb'
          },
          {
            name: '进行中',
            type: 'bar',
            stack: '总量',
            itemStyle: { color: '#1989fa' },
            data: inProgressData,
            smooth: true,
            sampling: 'lttb'
          },
          {
            name: '其他',
            type: 'bar',
            stack: '总量',
            itemStyle: { color: '#ff976a' },
            data: otherData,
            smooth: true,
            sampling: 'lttb'
          }
        ]
      };

      myChart.setOption(option);
    },
    resizeCharts() {
      this.charts.forEach(chart => chart.resize());
      this.renderBarChart(); // 重新渲染条形图尺寸
    }
  }
};
</script>

<style scoped>
.progress-tracking-container {
  padding-top: 1px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
.content {
  padding: 10px;
}
.board-section {
  margin-bottom: 24px;
}

/* 项目进度看板头部样式 */
.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.board-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}
.view-more-btn {
  font-size: 14px;
  color: #1989fa;
  cursor: pointer;
}

/* 卡片样式 */
.card {
  position: relative;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}
.card p:first-child {
  font-size: 13px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 10px;
}
.card .van-progress {
  margin: 10px 0;
}
.card-more {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 16px;
  color: #999;
  cursor: pointer;
}

/* 仪表盘样式 */
.dashboard {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.dashboard-item {
  text-align: center;
  margin-bottom: 16px;
  width: 100px;
}
.dashboard-item canvas {
  width: 100px;
  height: 100px;
}

/* 条形图样式 */
.chart-wrapper {
  width: 95%;
  padding: 0 1px;
}
.chart-container-responsive {
  background-color: #fff;
  padding: 8px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  max-width: 100%;
  min-height: 200px;
}
.chart-container-responsive canvas {
  min-width: 200px;
  width: 100%;
  max-width: 100%;
  height: auto;
}
</style>
