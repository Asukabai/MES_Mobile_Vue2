<template>
  <div class="upload-summary">
    <!-- 导航栏 -->
    <van-nav-bar title="上传文件信息汇总" />

    <!-- 总览 -->
    <van-cell-group title="信息总览">
      <van-cell title="总上传文件数" :value="totalUploadCount" />
      <van-cell title="总上传文件大小" :value="formatFileSize(totalUploadSize)" />
      <van-cell title="文件总上传人数" :value="totalUserCount" />
      <van-cell title="在线人数" :value="onlineUserCount" />
    </van-cell-group>

    <!-- 图表区域 -->
    <van-cell-group title="上传统计图表">
      <div id="chart-container" style="width: 100%; height: 300px; overflow-x: auto;"></div>
    </van-cell-group>

    <!-- 筛选控件 -->
    <van-cell-group>
      <van-cell title="筛选模式（具体在线人员）">
        <template #default>
          <van-switch v-model="showOnlineOnly" active-color="#07c160" />
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 用户上传明细 -->
    <van-cell-group title="用户上传明细">
      <van-cell v-for="(user, index) in displayedUsers" :key="index">
        <van-card
            :title="user.Person_Name"
            :desc="`最后上传时间：${user.Last_Fileupload_Time}`"
        >
          <!-- 自定义 num 插槽 -->
          <template #num>
            上传次数：{{ user.Total_Fileupload_Count }}
          </template>

          <!-- 自定义 price 插槽 -->
          <template #price>
            登录次数：{{ user.Total_Login_Count }}
          </template>

          <!-- 自定义 tags 插槽 -->
          <template #tags>
            <van-tag plain type="primary" v-if="user.Login_Status === 1">在线</van-tag>
            <van-tag plain type="default" v-else>离线</van-tag>
          </template>
        </van-card>
      </van-cell>
    </van-cell-group>

      <!-- 分页器 -->
      <base-pagination
          v-model="currentPage"
          :total-items="filteredUsers.length"
          :page-size="pageSize"
          @page-change="handlePageChange"
          @update:page-size="handlePageSizeChange"
      />

<!--    &lt;!&ndash; 导出按钮 &ndash;&gt;-->
<!--    <van-button type="primary" block @click="exportToExcel">导出 Excel</van-button>-->
  </div>
</template>

<script>
import SensorRequest from '@/utils/SensorRequest';
import * as echarts from 'echarts';

// 引入 BasePagination 组件
import BasePagination from '@/components/BasePagination.vue';

// 引入 Excel 导出库
import { utils, writeFile } from 'xlsx';

export default {
  name: 'UploadSummary',
  components: {
    BasePagination
  },
  data() {
    return {
      userList: [],
      filteredUsers: [], // 过滤后的数据
      displayedUsers: [], // 当前页数据

      totalUploadCount: 0,
      totalUploadSize: 0,

      currentPage: 1,
      pageSize: 5,

      showOnlineOnly: false // 是否只显示在线用户
    };
  },
  mounted() {
    this.fetchUploadSummary();
  },
  methods: {
    formatFileSize(sizeInKB) {
      const units = ['MB', 'GB'];
      let index = 0;
      while (sizeInKB >= 1024 && index < units.length - 1) {
        sizeInKB /= 1024;
        index++;
      }
      return `${sizeInKB.toFixed(2)} ${units[index]}`;
    },
    fetchUploadSummary() {
      SensorRequest.GetUploadSummary('', res => {
        console.log("res 请求成功 :"+res)
        try {
          const data = JSON.parse(res);

          // 排序：按上传次数从高到低
          this.userList = data.sort((a, b) => b.Total_Fileupload_Count - a.Total_Fileupload_Count);
          this.applyFilters();

          // 初始化页面数据
          this.handlePageChange(1);

          // 计算总数
          this.totalUploadCount = this.filteredUsers.reduce(
              (sum, item) => sum + item.Total_Fileupload_Count,
              0
          );
          this.totalUploadSize = this.filteredUsers.reduce(
              (sum, item) => sum + item.Total_Fileupload_Size,
              0
          );

          // 初始化图表
          this.$nextTick(() => {
            this.initChart();
          });
        } catch (e) {
          console.error('解析上传数据失败:', e);
        }
      }, err => {
        console.error('获取上传文件数失败', err);
      });
    },

    applyFilters() {
      let result = [...this.userList];

      // 过滤在线用户
      if (this.showOnlineOnly) {
        result = result.filter(user => user.Login_Status === 1);
      }

      this.filteredUsers = result;
    },

    handlePageChange(page) {
      this.currentPage = page;
      const start = (page - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.displayedUsers = this.filteredUsers.slice(start, end);
    },

    handlePageSizeChange(size) {
      this.pageSize = size;
      this.handlePageChange(1);
    },

    initChart() {
      const chartDom = document.getElementById('chart-container');
      if (!chartDom) return;

      const myChart = echarts.init(chartDom);

      const names = this.filteredUsers.map(user => user.Person_Name);
      const counts = this.filteredUsers.map(user => user.Total_Fileupload_Count);

      // 根据设备动态调整字体大小
      const labelFontSize = window.innerWidth < 768 ? 10 : 12;

      const option = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: names,
          axisLabel: {
            rotate: 45,           // 避免文字重叠
            interval: 0,          // 显示全部标签
            fontSize: labelFontSize // 动态字体大小
          }
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [{
          name: '上传次数',
          type: 'bar',
          data: counts,
          itemStyle: { color: '#07c160' },
          barWidth: 12 // 更窄的柱形，适合小屏
        }],
        dataZoom: [{
          type: 'slider', // 支持滑动查看
          start: 0,
          // end: Math.min(100, 50) // 默认显示一半数据
          end: 10 // 默认显示前 1/3 的数据
        }],
        grid: {
          left: '8%',
          right: '8%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        }
      };

      myChart.setOption(option);

      // 监听窗口变化，自动重绘图表
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },

    exportToExcel() {
      const ws = utils.aoa_to_sheet([
        ['姓名', '上传次数', '上传大小 (KB)', '登录次数', '最后上传时间', '状态']
      ].concat(
          this.filteredUsers.map(user => [
            user.Person_Name,
            user.Total_Fileupload_Count,
            user.Total_Fileupload_Size,
            user.Total_Login_Count,
            user.Last_Fileupload_Time,
            user.Login_Status === 1 ? '在线' : '离线'
          ])
      ));

      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, '上传明细');

      writeFile(wb, '上传文件统计.xlsx');
    }
  },
  computed: {
    // 总人数（原始数据长度）
    totalUserCount() {
      return this.userList ? this.userList.length : 0;
    },

    // 在线人数
    onlineUserCount() {
      return this.userList.filter(u => u.Login_Status === 1).length;
    }
  },
  watch: {
    showOnlineOnly() {
      this.applyFilters();
      this.handlePageChange(1);
    }
  }
};
</script>

<style scoped>
.van-card__title {
  font-weight: bold;
}

.van-card__desc {
  color: #666;
  margin-top: 4px;
}

.van-card__num {
  color: #333;
}

.van-card__price {
  color: #999;
}
</style>
