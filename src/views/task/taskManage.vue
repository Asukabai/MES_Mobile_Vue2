<template>
  <div class="task-calendar">
    <!-- 自定义日历组件 -->
    <div class="calendar-scroll-container">
      <custom-calendar
          :current-month="currentMonth"
          :tasks="taskData"
          @select-date="onDateSelected"
      />
    </div>

    <!-- 任务展示卡片 -->
    <div class="task-card-container">
      <div class="task-card">
        <h4>任务名称：{{ selectedTask.title }}</h4>
        <p>描述：{{ selectedTask.description }}</p>
        <p>状态：{{ selectedTask.status }}</p>
        <p>日期：{{ selectedTask.date }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import CustomCalendar from '@/components/CustomCalendar.vue';

export default {
  components: {
    CustomCalendar
  },
  data() {
    return {
      currentMonth: new Date(),
      taskData: [
        { title: "任务一", description: "这是一个测试任务", status: "进行中", date: "2023-10-15" },
        { title: "任务二", description: "另一个测试任务", status: "已完成", date: "2023-10-16" }
      ],
      selectedTask: {}
    };
  },
  created() {
    this.onDateSelected(this.formatDate(new Date()));
  },
  methods: {
    onDateSelected(dateStr) {
      const task = this.taskData.find(task => task.date === dateStr);
      this.selectedTask = task || {
        title: "暂无任务",
        description: "当前日期没有安排任务",
        status: "无",
        date: dateStr
      };
    },
    formatDate(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  }
};
</script>

<style scoped>
.task-calendar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.calendar-scroll-container {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #ebedf0;
}

.task-card-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: #f9f9f9;
}

.task-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>

