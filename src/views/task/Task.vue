<template>
  <div class="task-page page-container">
    <!-- 页面标题 -->
    <!--    <van-nav-bar-->
    <!--        title="任务"-->
    <!--        @click-left="handleSearchClick"-->
    <!--        @click-right="handleAddClick"-->
    <!--    >-->
    <!--      <template #left>-->
    <!--        <van-icon name="filter-o" size="18" />-->
    <!--      </template>-->
    <!--      <template #right>-->
    <!--        <van-icon name="apps-o" size="18" />-->
    <!--      </template>-->
    <!--    </van-nav-bar>-->

    <!-- 过滤器按钮 -->
    <div v-if="showFilters" class="filter-buttons">
      <van-button
          v-for="status in ['已完成', '进行中', '未开始', '搁置']"
          :key="status"
          :type="activeFilters.includes(status) ? 'primary' : 'default'"
          size="small"
          @click="toggleFilter(status)"
      >
        {{ status }}
      </van-button>
    </div>

    <!-- 标签页 -->
    <van-tabs
        v-model="activeTab"
        animated
        swipeable
        class="share-tabs task-tabs"
        sticky
    >
      <van-tab title="我参与的">
        <van-pull-refresh
            v-model="participatedRefreshing"
            @refresh="onParticipatedRefresh">
          <div class="cards-container">
            <van-list
                :loading="participatedLoading"
                :finished="participatedFinished"
                finished-text="没有更多了"
                @load="loadParticipatedTasks"
            >
              <van-card
                  v-for="item in participatedList"
                  :key="item.ID_TaskInfo"
                  :title="`任务名称：${item.Task_Name || '未命名任务'}`"
                  :desc="formatParticipatedDesc(item)"
                  class="task-card share-card"
              >

                <!-- 标签 -->
                <template #tags>
                  <van-tag
                      :type="getTaskStatusType(item.Task_Status)"
                  >
                    {{ item.Task_Status }}
                  </van-tag>
                  <van-tag plain type="primary">
                    {{ formatDateRange(item.Task_StartTime, item.Task_ExEndTime) }}
                  </van-tag>
                </template>

                <template #footer>
                  <van-button
                      icon="flag-o"
                      round
                      size="small"
                      :disabled="isTaskCompleted(item.Task_Status)"
                      @click="handleTaskButtonClick(item, '完成提交')"
                  >
                    完成提交
                  </van-button>
                  <van-button
                      icon="award-o"
                      round
                      size="small"
                      :disabled="isTaskCompleted(item.Task_Status)"
                      @click="handleTaskButtonClick(item, '进度提交')"
                  >
                    进度提交
                  </van-button>
                  <van-button
                      icon="eye-o"
                      round
                      size="small"
                      @click="goToTaskDetailLook(item)"
                  >
                    查看
                  </van-button>
                </template>
              </van-card>
            </van-list>
          </div>
        </van-pull-refresh>
      </van-tab>

      <!-- 我负责的 -->
      <van-tab title="我负责的">
        <van-pull-refresh
            v-model="responsibleRefreshing"
            @refresh="onResponsibleRefresh">
          <div class="cards-container">
            <van-list
                :loading="responsibleLoading"
                :finished="responsibleFinished"
                finished-text="没有更多了"
                @load="loadResponsibleTasks"
            >
              <van-card
                  v-for="item in responsibleList"
                  :key="item.ID_TaskInfo"
                  :title="`任务名称：${item.Task_Name || '未命名任务'}`"
                  :desc="formatParticipatedDesc(item)"
                  class="task-card share-card"
              >
                <!-- 标签 -->
                <template #tags>
                  <van-tag
                      :type="getTaskStatusType(item.Task_Status)"
                  >
                    {{ item.Task_Status }}
                  </van-tag>
                  <van-tag plain type="primary">
                    {{ formatDateRange(item.Task_StartTime, item.Task_ExEndTime) }}
                  </van-tag>
                </template>

                <template #footer>
                  <van-button
                      icon="eye-o"
                      round size="small"
                      @click="goToTaskDetailLook(item)">
                    查看
                  </van-button>
                </template>
              </van-card>
            </van-list>
          </div>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import SensorRequest from '@/utils/SensorRequest';
import { Toast } from 'vant';
import { key_DingUserPhone } from '@/utils/Dingding';

function getLocalUserInfo() {
  const phone = localStorage.getItem(key_DingUserPhone);
  return {
    phone: phone || '',
  };
}

export default {
  name: 'TaskPage',
  data() {
    return {
      activeTab: 0, // 默认激活第一个 tab

      // 我参与的任务数据
      participatedList: [],
      participatedLoading: false,
      participatedFinished: false,
      participatedRefreshing: false,

      // 我负责的任务数据
      responsibleList: [],
      responsibleLoading: false,
      responsibleFinished: false,
      responsibleRefreshing: false,

      sortByDate: 'desc', // 排序方式：'asc' 正序, 'desc' 逆序
      showFilters: false, // 是否显示过滤器
      activeFilters: [] // 激活的过滤器
    };
  },
  mounted() {
    // 页面加载时请求 "我参与的" 和 "我负责的" 任务数据
    this.loadParticipatedTasks();
    this.loadResponsibleTasks();
  },
  methods: {

    // 切换排序方式
    toggleSortOrder() {
      this.sortByDate = this.sortByDate === 'asc' ? 'desc' : 'asc';
      this.applySortAndFilter();
    },

    // 应用排序和过滤
    applySortAndFilter() {
      // 对我参与的任务进行排序和过滤
      let participatedList = [...this.participatedList];

      // 过滤
      if (this.activeFilters.length > 0) {
        participatedList = participatedList.filter(item =>
            this.activeFilters.includes(item.Task_Status)
        );
      }

      // 排序
      participatedList.sort((a, b) => {
        const dateA = new Date(a.Task_ExEndTime);
        const dateB = new Date(b.Task_ExEndTime);

        if (this.sortByDate === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });

      this.participatedList = participatedList;

      // 我负责的任务也可以类似处理，根据需求决定是否添加排序和过滤
      // let responsibleList = [...this.responsibleListOriginal];
      // ...
      // this.responsibleList = responsibleList;
    },

    // 切换过滤器显示
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },

    // 切换特定过滤器
    toggleFilter(status) {
      const index = this.activeFilters.indexOf(status);
      if (index === -1) {
        this.activeFilters.push(status);
      } else {
        this.activeFilters.splice(index, 1);
      }
      this.applySortAndFilter();
    },

    // 下拉刷新 - 我参与的
    onParticipatedRefresh() {
      this.participatedRefreshing = true;
      this.participatedFinished = false;
      this.participatedList = [];
      this.loadParticipatedTasks();
    },

    // 下拉刷新 - 我负责的
    onResponsibleRefresh() {
      this.responsibleRefreshing = true;
      this.responsibleFinished = false;
      this.responsibleList = [];
      this.loadResponsibleTasks();
    },

    getTaskStatusType(status) {
      switch (status) {
        case '已完成':
          return 'success';
        case '进行中':
          return 'primary';
        case '未开始':
          return 'default';
        case '搁置':
          return 'warning';
      }
    },
    // 判断任务是否已完成
    isTaskCompleted(status) {
      return status === "已完成";
    },

    // 处理任务按钮点击
    handleTaskButtonClick(item, action) {
      if (this.isTaskCompleted(item.Task_Status)) {
        this.$toast({
          message: "已完成的任务无法再次提交",
          duration: 2000,
          forbidClick: true
        });
        return;
      }

      if (action === "完成提交") {
        this.goToTaskDetail(item);
      } else if (action === "进度提交") {
        this.goToTaskDetailProgress(item);
      } else if (action === "查看") {
        this.goToTaskDetailLook(item);
      }
    },


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
        console.log("加载我参与的任务-原始响应数据:", respData);
        console.log("加载我参与的任务-解析后的文件列表:", tasks);
        // 打印完整数据结构到控制台
        console.table(tasks); // 表格形式展示
        console.log("JSON 格式输出:\n", JSON.stringify(tasks, null, 2));
        this.participatedList = [...this.participatedList, ...tasks];
      } catch (error) {
        console.error('加载我参与的任务失败:', error);
        alert('加载我参与的任务失败');
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

        console.log("加载我负责的任务:", tasks);
        this.responsibleList = [...this.responsibleList, ...tasks];
      } catch (error) {
        console.error('加载我负责的任务失败:', error);
        alert('加载我负责的任务失败');
      } finally {
        this.responsibleLoading = false;
        this.responsibleFinished = true;
        this.responsibleRefreshing = false;
      }
    },

    // 辅助方法：格式化 "我参与的" 任务描述
    formatParticipatedDesc(item) {
      return `任务创建人: ${item.Task_Creator?.Person_Name || '未知'} `;
    },

    // 新增方法：格式化起止时间范围（精确到天）
    formatDateRange(startDate, endDate) {
      if (!startDate || !endDate) return '时间未设置';

      const start = new Date(startDate).toLocaleDateString();
      const end = new Date(endDate).toLocaleDateString();

      return `时间范围：${start} 至 ${end}`;
    },

    // 跳转到任务提交页面
    goToTaskDetail(item) {
      console.log("跳转到任务提交页面:", item);
      // 提取需要的参数
      const taskName = item.Task_Name || '';
      const projectCode = item.Project_Code || '';
      const taskId = item.Id || '';
      console.log("跳转到任务提交页面:-- taskId: "+taskId)
      const taskDescription = item.Task_Description || '';
      // 构建查询参数
      const query = {
        taskName: taskName,
        projectCode: projectCode,
        Id: taskId, // 注意这里使用 "Id" 而不是 "taskId"
        taskDescription: taskDescription
      };
      this.$router.push({
        path: '/sensor_ddingWork/Release/task-detail-last',
        query: query
      });
    },    // 跳转到任务提交页面
    goToTaskDetailProgress(item) {
      console.log("跳转到任务提交页面:", item);
      // 提取需要的参数
      const taskName = item.Task_Name || '';
      const projectCode = item.Project_Code || '';
      const taskId = item.Id || '';
      console.log("跳转到任务提交页面:-- taskId: "+taskId)
      const taskDescription = item.Task_Description || '';
      // 构建查询参数
      const query = {
        taskName: taskName,
        projectCode: projectCode,
        Id: taskId, // 注意这里使用 "Id" 而不是 "taskId"
        taskDescription: taskDescription
      };
      this.$router.push({
        path: '/sensor_ddingWork/Release/task-detail-progress',
        query: query
      });
    },
    // 跳转到任务详情页
    goToTaskDetailLook(item) {
      console.log("跳转到任务详情页面:", item);

      this.$router.push({
        path: '/sensor_ddingWork/Release/task-detail-look',
        query: {
          taskId: item.ID_TaskInfo,
          taskData: encodeURIComponent(JSON.stringify(item)) // 新增：传递完整对象
        }
      });
    },

    handleSearchClick() {
      // 跳转到搜索页面，例如：
      // this.$router.push('/task-search') // 假设你的搜索页路径为 /task-search

      // 或者执行其他查询逻辑，比如弹出搜索框、触发 API 请求等
      console.log('执行查询任务操作')
      // alert('执行查询任务操作')
      Toast.success('执行查询任务操作 !')
    },
    handleAddClick() {
      console.log('点击了新增按钮')
      // alert('新增任务功能暂未实现')
      Toast.success('点击了新增按钮 ！')
    }
  }
}
</script>

<style scoped>

.page-container {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.share-tabs {
  margin-top: 0;
}

.cards-container {
  padding: 10px 2.5%; /* 2.5%的左右padding实现95%宽度 */
}

.share-card {
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 16px; /* 更加圆润 */
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff, #f8f9fa); /* 渐变背景 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
  background-image: url('../../assets/background-8.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.share-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1); /* 半透明白色遮罩 */
  z-index: 1;
}

.share-card >>> .van-card__content {
  position: relative;
  z-index: 2;
}

.share-card >>> .van-card__header {
  position: relative;
  z-index: 2;
}

.share-card >>> .van-card__body {
  position: relative;
  z-index: 2;
}

.share-card >>> .van-card__footer {
  position: relative;
  z-index: 2;
}

.share-card >>> .van-card__title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.share-card >>> .van-card__desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.share-card:hover {
  transform: translateY(-2px); /* 悬停时轻微上移 */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.van-card__thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px; /* 缩略图也更加圆润 */
}

.van-card__footer .van-button {
  font-size: 12px;
  padding: 0 12px;
  height: 30px;
  margin-left: 8px;
}

.van-tag {
  border-radius: 8px; /* 标签也更加圆润 */
}

/* 保留原有的部分样式 */
.filter-buttons {
  padding: 10px;
}

.filter-buttons .van-button {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
