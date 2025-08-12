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

    <!-- 连接处美化元素 -->
    <div class="calendar-task-divider">
      <div class="divider-wave"></div>
    </div>

    <!-- 任务展示卡片 -->
    <div class="task-card-container">
      <!-- 当两个卡片都有内容或至少一个有内容时显示 -->
      <template v-if="responsibleTasksForDate.length > 0 || participatedTasksForDate.length > 0">
        <!-- 我负责的任务 -->
        <div v-if="responsibleTasksForDate.length > 0">
          <div class="section-title">我负责的</div>
          <div class="task-card" v-for="(task, index) in responsibleTasksForDate" :key="'responsible-'+index">
            <h4>任务名称：{{ task.title }}</h4>
            <p>描述：{{ task.description }}</p>
            <p>状态：{{ task.status }}</p>
            <p>日期：{{ task.date }}</p>
            <!--            <div class="task-actions">-->
            <!--              <button class="submit-button" @click="goToTaskDetail">提交任务</button>-->
            <!--            </div>-->
            <div class="task-actions">
              <button class="submit-button" @click="goToTaskDetail">
                <img src="@/assets/upload_task.png" alt="提交任务" class="button-icon">
                提交任务
              </button>
            </div>
          </div>
        </div>

        <!-- 我负责的无任务提示 -->
        <div v-else>
          <div class="section-title">我负责的</div>
          <div class="task-card">
            <h4>暂无任务</h4>
            <p>今天可以休息哦 ^_^</p>
          </div>
        </div>

        <!-- 我参与的任务 -->
        <div v-if="participatedTasksForDate.length > 0">
          <div class="section-title">我参与的</div>
          <div class="task-card" v-for="(task, index) in participatedTasksForDate" :key="'participated-'+index">
            <h4>任务名称：{{ task.title }}</h4>
            <p>描述：{{ task.description }}</p>
            <p>状态：{{ task.status }}</p>
            <p>日期：{{ task.date }}</p>
            <!--            <div class="task-actions">-->
            <!--              <van-button-->
            <!--                  icon="eye-o"-->
            <!--                  round size="small"-->
            <!--                  @click="goToTaskDetail">提交任务-->
            <!--              </van-button>-->
            <!--            </div>-->
            <div class="task-actions">
              <button class="submit-button" @click="goToTaskDetail">
                <img src="@/assets/upload_task.png" alt="提交任务" class="button-icon">
                提交任务
              </button>
            </div>
          </div>
        </div>

        <!-- 我参与的无任务提示 -->
        <div v-else>
          <div class="section-title">我参与的</div>
          <div class="task-card">
            <h4>暂无任务</h4>
            <p>今天可以休息哦 ^_^</p>
          </div>
        </div>
      </template>

      <!-- 当两个卡片都无内容时显示 -->
      <div v-else class="task-card">
        <h4>暂无任务</h4>
        <p>今天可以休息哦 ^_^</p>
      </div>
    </div>
  </div>
</template>


<script>
import CustomCalendar from '@/components/CustomCalendar.vue';
import SensorRequest from "@/utils/SensorRequest";
import {key_DingUserPhone} from "@/utils/Dingding";


function getLocalUserInfo() {
  const phone = localStorage.getItem(key_DingUserPhone);
  return {
    phone: phone || '',
  };
}
export default {
  components: {
    CustomCalendar
  },
  data() {
    return {
      currentMonth: new Date(),
      taskData: [],
      selectedDate: this.formatDate(new Date()),
      responsibleTasksForDate: [],
      participatedTasksForDate: [],
      participatedList: [],
      responsibleList: [],
      participatedLoading: false,
      responsibleLoading: false,
      participatedFinished: false,
      responsibleFinished: false,
      participatedRefreshing: false,
      responsibleRefreshing: false
    };
  },
  created() {
    this.onDateSelected(this.formatDate(new Date()));
  },
  mounted() {
    // 页面加载时请求 "我参与的" 和 "我负责的" 任务数据
    this.loadParticipatedTasks();
    this.loadResponsibleTasks();
  },
  methods: {
    // 加载 "我参与的" 任务（调用 GetTaskInfoWithMeFun 接口）
    async loadParticipatedTasks() {
      this.participatedLoading = true;

      const userInfo = getLocalUserInfo();
      const requestParams = JSON.stringify({
        Person_Phone: userInfo.phone,
      });

      try {
        const respData = await new Promise((resolve, reject) => {
          SensorRequest.GetTaskInfoWithMeFun(requestParams, resolve, reject);
        });

        const tasks = JSON.parse(respData);
        console.log("任务日历-加载我参与的任务-原始响应数据:", respData);
        console.log("任务日历-加载我参与的任务-解析后的文件列表:", tasks);
        // 打印完整数据结构到控制台
        console.table(tasks); // 表格形式展示
        console.log("任务日历-JSON 格式输出:\n", JSON.stringify(tasks, null, 2));
        this.participatedList = [...this.participatedList, ...tasks];
        this.processTaskData();
      } catch (error) {
        console.error('任务日历-加载我参与的任务失败:', error);
        alert('任务日历-加载我参与的任务失败');
      } finally {
        this.participatedLoading = false;
        this.participatedFinished = true;
        this.participatedRefreshing = false;
      }
    },

    // 加载 "我负责的" 任务（调用 GetPersonTaskInfoFun 接口）
    async loadResponsibleTasks() {
      this.responsibleLoading = true;

      const userInfo = getLocalUserInfo();
      const requestParams = JSON.stringify({
        Person_Phone: userInfo.phone,
      });

      try {
        const respData = await new Promise((resolve, reject) => {
          SensorRequest.GetPersonTaskInfoFun(requestParams, resolve, reject);
        });

        const tasks = JSON.parse(respData);

        console.log("任务日历-加载我负责的任务:", tasks);
        this.responsibleList = [...this.responsibleList, ...tasks];
        this.processTaskData();
      } catch (error) {
        console.error('任务日历-加载我负责的任务失败:', error);
        alert('任务日历-加载我负责的任务失败');
      } finally {
        this.responsibleLoading = false;
        this.responsibleFinished = true;
        this.responsibleRefreshing = false;
      }
    },

    // 处理任务数据，将后端返回的数据转换为日历组件需要的格式
    processTaskData() {
      // 处理我负责的任务
      const processedResponsibleTasks = [];
      this.responsibleList.forEach(task => {
        // 解析后端返回的字段
        const title = task.Task_Name || '';
        const description = task.Task_Description || '';
        const status = task.Task_Status || '未知';
        const startTime = task.Task_StartTime ? new Date(task.Task_StartTime) : new Date();
        const endTime = task.Task_ExEndTime ? new Date(task.Task_ExEndTime) : new Date();

        // 计算任务持续天数
        const timeDiff = endTime.getTime() - startTime.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const duration = Math.max(1, daysDiff); // 至少1天

        // 为任务持续的每一天生成一条记录
        for (let i = 0; i < duration; i++) {
          const currentDate = new Date(startTime);
          currentDate.setDate(startTime.getDate() + i);
          const dateStr = this.formatDate(currentDate);

          processedResponsibleTasks.push({
            title: title,
            description: description,
            status: status,
            date: dateStr
          });
        }
      });

      // 处理我参与的任务
      const processedParticipatedTasks = [];
      this.participatedList.forEach(task => {
        // 解析后端返回的字段
        const title = task.Task_Name || '';
        const description = task.Task_Description || '';
        const status = task.Task_Status || '未知';
        const startTime = task.Task_StartTime ? new Date(task.Task_StartTime) : new Date();
        const endTime = task.Task_ExEndTime ? new Date(task.Task_ExEndTime) : new Date();

        // 计算任务持续天数
        const timeDiff = endTime.getTime() - startTime.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const duration = Math.max(1, daysDiff); // 至少1天

        // 为任务持续的每一天生成一条记录
        for (let i = 0; i < duration; i++) {
          const currentDate = new Date(startTime);
          currentDate.setDate(startTime.getDate() + i);
          const dateStr = this.formatDate(currentDate);

          processedParticipatedTasks.push({
            title: title,
            description: description,
            status: status,
            date: dateStr
          });
        }
      });

      this.taskData = [...processedResponsibleTasks, ...processedParticipatedTasks];
      this.filterTasksByDate(this.selectedDate);
    },

    onDateSelected(dateStr) {
      this.selectedDate = dateStr;
      this.filterTasksByDate(dateStr);
    },

    filterTasksByDate(dateStr) {
      // 清空之前的筛选结果
      this.responsibleTasksForDate = [];
      this.participatedTasksForDate = [];

      // 筛选我负责的任务
      this.responsibleList.forEach(task => {
        const title = task.Task_Name || '';
        const description = task.Task_Description || '';
        const status = task.Task_Status || '未知';
        const startTime = task.Task_StartTime ? new Date(task.Task_StartTime) : new Date();
        const endTime = task.Task_ExEndTime ? new Date(task.Task_ExEndTime) : new Date();

        // 计算任务持续天数
        const timeDiff = endTime.getTime() - startTime.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const duration = Math.max(1, daysDiff); // 至少1天

        // 检查所选日期是否在任务期间
        for (let i = 0; i < duration; i++) {
          const currentDate = new Date(startTime);
          currentDate.setDate(startTime.getDate() + i);
          const currentDateStr = this.formatDate(currentDate);

          if (currentDateStr === dateStr) {
            this.responsibleTasksForDate.push({
              title: title,
              description: description,
              status: status,
              date: dateStr
            });
            break; // 找到匹配就跳出循环
          }
        }
      });

      // 筛选我参与的任务
      this.participatedList.forEach(task => {
        const title = task.Task_Name || '';
        const description = task.Task_Description || '';
        const status = task.Task_Status || '未知';
        const startTime = task.Task_StartTime ? new Date(task.Task_StartTime) : new Date();
        const endTime = task.Task_ExEndTime ? new Date(task.Task_ExEndTime) : new Date();

        // 计算任务持续天数
        const timeDiff = endTime.getTime() - startTime.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const duration = Math.max(1, daysDiff); // 至少1天

        // 检查所选日期是否在任务期间
        for (let i = 0; i < duration; i++) {
          const currentDate = new Date(startTime);
          currentDate.setDate(startTime.getDate() + i);
          const currentDateStr = this.formatDate(currentDate);

          if (currentDateStr === dateStr) {
            this.participatedTasksForDate.push({
              title: title,
              description: description,
              status: status,
              date: dateStr
            });
            break; // 找到匹配就跳出循环
          }
        }
      });
    },
    goToTaskDetail() {
      this.$router.push('/sensor_ddingWork/Release/task');
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
  border-radius: 16px 16px 0 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin: 10px 10px 0 10px;
}

/* 新增的连接处美化样式 */
.calendar-task-divider {
  position: relative;
  height: 20px;
  display: flex;
  justify-content: center;
  z-index: 10;
}

.divider-wave {
  width: 100%;
  height: 20px;
  background-size: cover;
  margin-top: -1px;
}

.task-card-container {
  flex: 1;
  overflow-y: auto;
  padding: 25px 15px 15px 15px;
  background-color: #f9f9f9;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  margin-top: -10px;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0 5px 0;
  color: #333;
}

.task-actions {
  text-align: right;
  margin-top: 10px;
}

.task-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.submit-button {
  background-color: #3f83f8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: inline-flex;
  align-items: center;
}

.button-icon {
  width: 14px;
  height: 14px;
  margin-right: 5px;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
