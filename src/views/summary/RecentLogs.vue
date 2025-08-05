<template>
  <div class="recent-logs-page">
    <!-- 导航栏 -->
    <van-nav-bar>
<!--      &lt;!&ndash; 标题插槽：加粗字体 &ndash;&gt;-->
<!--      <template #title>-->
<!--        <span class="nav-title">系统日志</span>-->
<!--      </template>-->

      <!-- 排序图标 -->
      <template #left>
        <van-icon
            :name="sortOrder === 'asc' ? 'ascending' : 'descending'"
            @click="toggleSort"
        />
      </template>
    </van-nav-bar>

    <!-- 时间筛选器 -->
    <van-dropdown-menu class="filter-menu">
      <van-dropdown-item
          v-model="timeFilter"
          :options="timeOptions"
          @change="onTimeFilterChange"
          :class="{ 'active-filter': timeFilter !== 'all' }"
      />
    </van-dropdown-menu>

    <!-- 日志列表 -->
    <van-list
        :loading="loading"
        :finished="finished"
        finished-text="没有更多日志了"
        @load="onLoad"
    >
      <van-cell
          v-for="(log, index) in displayedLogs"
          :key="index"
          :title="log.title"
          :label="log.time"
      />
    </van-list>
  </div>
</template>

<script>
import SensorRequest from '@/utils/SensorRequest';

export default {
  name: 'RecentLogs',
  data() {
    return {
      logs: [],
      loading: false,
      finished: false,
      hasMore: true,
      sortOrder: 'asc', // 排序方式，默认升序
      timeFilter: 'all', // 默认不筛选
      timeOptions: [
        { text: '全部', value: 'all' },
        { text: '今天', value: 'today' },
        { text: '本周', value: 'week' },
        { text: '本月', value: 'month' }
      ]
    };
  },
  computed: {
    // 计算属性：根据筛选和排序显示日志
    displayedLogs() {
      const now = new Date();
      let filteredLogs = [...this.logs];

      // 时间筛选
      if (this.timeFilter !== 'all') {
        filteredLogs = filteredLogs.filter(log => {
          const logDate = new Date(log.time);
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const logDay = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate()).getTime();

          if (this.timeFilter === 'today') {
            return logDay >= today.getTime();
          } else if (this.timeFilter === 'week') {
            const dayOfWeek = now.getDay();
            const firstDayOfWeek = new Date(today);
            firstDayOfWeek.setDate(today.getDate() - dayOfWeek);
            return logDay >= firstDayOfWeek.getTime();
          } else if (this.timeFilter === 'month') {
            return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
          }
          return true;
        });
      }

      // 时间排序
      return filteredLogs.sort((a, b) => {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        return this.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });
    }
  },
  mounted() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      if (!this.hasMore) return;

      this.loading = true;

      // 调用日志接口
      SensorRequest.GetRecentLogs('', res => {
        try {
          const rawLogs = JSON.parse(res) || [];

          // 解析每条日志
          const parsedLogs = rawLogs.map(logStr => {
            const match = logStr.match(/(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2})\s+(.+?)\s+(.+)/);
            if (match) {
              const time = match[1];
              const user = match[2];
              const action = match[3];
              return {
                time,
                user,
                action,
                title: `${user} ${action}`
              };
            }
            return {
              time: '--',
              user: '--',
              action: '--',
              title: '未知日志'
            };
          });

          if (parsedLogs.length === 0) {
            this.hasMore = false;
            this.finished = true;
          } else {
            this.logs = [...this.logs, ...parsedLogs];
          }
        } catch (e) {
          console.error('解析日志失败:', e);
        } finally {
          this.loading = false;
        }
      }, err => {
        console.error('获取日志失败', err);
        this.loading = false;
        this.finished = true;
      });
    },

    // 切换排序方式 + 提示
    toggleSort() {
      const newOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.sortOrder = newOrder;
      this.$toast({
        message: newOrder === 'asc' ? '已切换为升序排列' : '已切换为降序排列',
        duration: 1000
      });
    },

    // 筛选条件变化时触发
    onTimeFilterChange(value) {
      this.$toast({
        message: `已筛选：${this.timeOptions.find(opt => opt.value === value)?.text}`,
        duration: 1000
      });
    }
  }
};
</script>

<style scoped>
.recent-logs-page {
  padding: 16px;
}

.nav-title {
  font-weight: bold;
  font-size: 18px;
}

.van-nav-bar__title {
  font-weight: bold;
  font-size: 18px;
}

.van-nav-bar__left .van-icon,
.van-nav-bar__right .van-icon {
  font-size: 18px;
}

.filter-menu {
  margin-bottom: 10px;
}

/* 筛选器激活样式 */
.van-dropdown-item__option--active {
  color: #1989fa !important; /* 高亮当前选中项 */
  font-weight: bold;
}
</style>
