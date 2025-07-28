<template>
  <div class="custom-calendar">
    <!-- 年份和月份切换 -->
<!--    <div class="calendar-header">-->
<!--      <button @click="changeMonth(-1)">❮</button>-->
<!--      <button @click="changeYear(-1)"><<</button>-->
<!--      <span v-if="showMonthDays">{{ currentYear }}年{{ selectedMonth }}月</span>-->
<!--      <span v-else>{{ currentYear }}年</span>-->
<!--      <button @click="changeYear(1)">>></button>-->
<!--      <button @click="changeMonth(1)">❯</button>-->
<!--    </div>-->
<!--    在 Vue 模板中，HTML 解析器会把 << 或 >> 识别为非法标签名，因为 < 是 HTML 标签的开始符号，而 << 会被误认为是标签的开始，从而导致解析错误。-->

    <div class="calendar-header">
      <button @click="changeMonth(-1)">❮</button>
      <button @click="changeYear(-1)">&lt;&lt;</button>
      <span v-if="showMonthDays">{{ currentYear }}年{{ selectedMonth }}月</span>
      <span v-else>{{ currentYear }}年</span>
      <button @click="changeYear(1)">&gt;&gt;</button>
      <button @click="changeMonth(1)">❯</button>
    </div>


    <!-- 月份切换视图 -->
    <div class="calendar-months" v-if="!showMonthDays">
      <div
          v-for="m in months"
          :key="m"
          :class="['month-item', { active: m === selectedMonth }]"
          @click="selectMonth(m)"
      >
        {{ m }}月
      </div>
    </div>

    <!-- 日期视图 -->
    <div v-else class="calendar-days">
      <!-- 星期标题 -->
      <div class="calendar-weekdays">
        <div v-for="day in ['日','一','二','三','四','五','六']" :key="day">{{ day }}</div>
      </div>

      <!-- 日历天数 -->
      <div class="calendar-days-grid">
        <div
            v-for="(day, index) in monthDays"
            :key="index"
            :class="{
            'day': true,
            'has-task': day.hasTask,
            'selected': selectedDate === day.dateStr,
            'today': isToday(day.dateStr),
            'empty': !day.date
          }"
            @click="selectDay(day)"
        >
          <span v-if="day.date">{{ day.date }}</span>
        </div>
      </div>
    </div>

    <!-- 按钮区域 -->
    <div class="calendar-footer">
      <span @click="toggleMonthView">
        {{ showMonthDays ? '切换到月份视图' : '切换到日历视图' }}
      </span>
      <span style="margin-left: 15px; color: #07c160" @click="goToToday">返回今天</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomCalendar',
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1, // 1~12
      showMonthDays: true,
      selectedDate: this.formatDate(new Date())
    };
  },
  computed: {
    months() {
      return Array.from({ length: 12 }, (_, i) => i + 1);
    },
    monthDays() {
      const year = this.currentYear;
      const month = this.selectedMonth;
      const firstDay = new Date(year, month - 1, 1).getDay();
      const lastDate = new Date(year, month, 0).getDate();
      const days = [];

      // 填充前导空白
      for (let i = 0; i < firstDay; i++) {
        days.push({ date: null });
      }

      // 填充日期
      for (let i = 1; i <= lastDate; i++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const hasTask = this.tasks.some(task => task.date === dateStr);
        days.push({ date: i, dateStr, hasTask });
      }

      return days;
    }
  },
  methods: {
    formatDate(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    },
    changeYear(delta) {
      this.currentYear += delta;
      this.showMonthDays = true;
      this.selectedDate = this.formatDate(new Date(this.currentYear, this.selectedMonth - 1, 1));
      this.$emit('select-date', this.selectedDate);
    },
    changeMonth(delta) {
      const newDate = new Date(this.currentYear, this.selectedMonth - 1 + delta, 1);
      this.currentYear = newDate.getFullYear();
      this.selectedMonth = newDate.getMonth() + 1;
      this.showMonthDays = true;
      this.selectedDate = this.formatDate(newDate);
      this.$emit('select-date', this.selectedDate);
    },
    selectMonth(month) {
      this.selectedMonth = month;
      this.showMonthDays = true;
    },
    selectDay(day) {
      if (day.date) {
        this.selectedDate = day.dateStr;
        this.$emit('select-date', day.dateStr);
      }
    },
    toggleMonthView() {
      this.showMonthDays = !this.showMonthDays;
    },
    goToToday() {
      const today = new Date();
      this.currentYear = today.getFullYear();
      this.selectedMonth = today.getMonth() + 1;
      this.showMonthDays = true;
      this.selectedDate = this.formatDate(today);
      this.$emit('select-date', this.selectedDate);
    },
    isToday(dateStr) {
      const todayStr = this.formatDate(new Date());
      return dateStr === todayStr;
    }
  }
};
</script>

<style scoped>
.custom-calendar {
  font-family: Arial, sans-serif;
  max-width: 100%;
  margin: 0 auto;
  padding: 10px;
}

.calendar-header {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0 5px;
}

.calendar-months {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 10px;
}

.month-item {
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  background-color: #f9f9f9;
}

.month-item.active {
  background-color: #1989fa;
  color: white;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
}

.calendar-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day {
  text-align: center;
  padding: 10px 5px;
  position: relative;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px; /* 固定最小高度 */
}

.day:hover {
  background-color: #f0f0f0;
}

.day.empty {
  pointer-events: none;
  background-color: transparent;
}

.day.has-task {
  color: #1989fa;
  font-weight: bold;
}

.day.selected {
  background-color: #1989fa;
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 25px;
  margin: 0 auto;
}

.day.today {
  border: 1px solid #07c160;
  color: #07c160;
  font-weight: bold;
}

.calendar-footer {
  margin-top: 10px;
  text-align: center;
  color: #1989fa;
  cursor: pointer;
  font-size: 14px;
}
</style>
