<template>
  <div class="project-detail-container">
    <!-- 合并项目信息和任务统计表格为一个卡片 -->
    <div class="project-card">
      <div class="project-info">
        <h4>{{ project.name }}</h4>
        <p>项目编码: {{ project.id }}</p>
        <van-progress :percentage="project.progress" :color="project.color" />
        <p>项目总进度：{{ project.progress }}%</p>
      </div>

      <!-- 新增任务统计表格 -->
      <div class="task-stats">
        <table class="stats-table">
          <thead>
          <tr>
            <th>已完成任务</th>
            <th>进行中任务</th>
            <th>未开始任务</th>
            <th>延期任务</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{ taskStats.completed }}</td>
            <td>{{ taskStats.inProgress }}</td>
            <td>{{ taskStats.notStarted }}</td>
            <td>{{ taskStats.delayed }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="chart-section">
      <h4>任务进度分布</h4>
      <canvas ref="pieChart"></canvas>
    </div>

    <!-- 新增图例卡片 -->
    <div class="legend-card">
      <div class="legend-list">
        <div v-for="(task, index) in tasks" :key="index" class="legend-item">
          <span class="legend-color" :style="{ backgroundColor: task.color }"></span>
          <span class="legend-text">{{ task.name }}</span>
        </div>
      </div>
    </div>

    <div class="task-list">
      <h4>任务列表</h4>
      <div v-for="(task, index) in tasks" :key="index" class="task-item">
        <p>
          <strong class="task-name">{{ task.name }}</strong>
          <span class="status-tag" :class="`status-${task.status}`">{{ task.status }}</span>
        </p>
        <van-progress :percentage="task.progress" :color="task.color" />
        <p style="color: #999">进度：{{ task.progress }}% | 负责人：{{ task.owner }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ProjectDetail',
  data() {
    return {
      // 模拟接收的项目数据
      project: {
        id: this.$route.params.id,
        name: this.$route.query.name || '未知项目',
        progress: 65,
        color: '#1989fa'
      },
      // 模拟任务数据（新增 status 字段）
      tasks: [
        { name: '需求分析', progress: 100, owner: '张三', color: '#07c160', status: '已完成' },
        { name: 'UI设计', progress: 80, owner: '李四', color: '#ff976a', status: '进行中' },
        { name: '后端开发', progress: 50, owner: '王五', color: '#ee0a24', status: '延期' },
        { name: '前端开发', progress: 20, owner: '赵六', color: '#1989fa', status: '未开始' }
      ],
      pieChart: null
    };
  },
  computed: {
    taskStats() {
      const completed = this.tasks.filter(t => t.status === '已完成').length;
      const inProgress = this.tasks.filter(t => t.status === '进行中').length;
      const notStarted = this.tasks.filter(t => t.status === '未开始').length;
      const delayed = this.tasks.filter(t => t.status === '延期').length;
      return {
        completed,
        inProgress,
        notStarted,
        delayed
      };
    }
  },
  mounted() {
    this.renderPieChart();
    window.addEventListener('resize', this.resizePieChart);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizePieChart);
    if (this.pieChart) {
      this.pieChart.dispose();
    }
  },
  methods: {
    renderPieChart() {
      const chartDom = this.$refs.pieChart;
      this.pieChart = echarts.init(chartDom, null, {
        devicePixelRatio: window.devicePixelRatio
      });

      const option = {
        legend: {
          show: false,
          data: this.tasks.map(task => task.name),
          bottom: '15%',
          left: 'center',
          orient: 'horizontal',
          itemGap: 20,
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '任务进度',
            type: 'pie',
            radius: ['0%', '80%'],
            center: ['50%', '40%'],
            label: {
              show: true,
              position: 'outside',
              formatter: '{d}%'
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 10
            },
            data: this.tasks.map(task => ({
              value: task.progress,
              name: task.name,
              itemStyle: { color: task.color }
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        mediaQuery: [
          {
            query: {
              maxWidth: 768
            },
            option: {
              series: [
                {
                  radius: ['0%', '100%'],
                  center: ['50%', '35%']
                }
              ],
              legend: {
                bottom: '10%',
                itemGap: 10,
                textStyle: {
                  fontSize: 10
                }
              }
            }
          }
        ]
      };

      this.pieChart.setOption(option);
    },
    resizePieChart() {
      if (this.pieChart) {
        this.pieChart.resize();
      }
    }
  }
};
</script>

<style scoped>
.project-detail-container {
  padding: 10px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 新增项目卡片样式 */
.project-card {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.project-info {
  margin-bottom: 16px;
}

/* 新增任务统计表格样式 */
.task-stats {
  margin-top: 16px;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 14px;
}

.stats-table th,
.stats-table td {
  border: 1px solid #ebedf0;
  padding: 8px 4px;
}

.stats-table th {
  background-color: #f7f8fa;
  color: #333;
}

.task-list {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.task-name {
  font-size: 14px;
  font-weight: 600;
}

.task-item {
  margin-bottom: 16px;
}

.status-tag {
  margin-left: 10px;
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 4px;
  color: #fff;
  display: inline-block;
}

.status-已完成 {
  background-color: #07c160;
}

.status-进行中 {
  background-color: #1989fa;
}

.status-未开始 {
  background-color: #969799;
}

.status-延期 {
  background-color: #ee0a24;
}

.chart-section {
  background-color: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.chart-section canvas {
  width: 100%;
  height: auto;
  max-width: 100%;
  display: block;
}

/* 新增图例卡片样式 */
.legend-card {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.legend-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.legend-color {
  width: 12px;
  height: 12px;
  margin-right: 8px;
  display: inline-block;
  border-radius: 2px;
}

.legend-text {
  color: #333;
}
</style>
