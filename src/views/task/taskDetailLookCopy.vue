<template>
  <div class="task-detail-page">
    <van-nav-bar title="任务详情">
      <!-- 左侧返回按钮 -->
      <template #left>
        <span class="nav-text" @click="$router.go(-1)">返回上一页</span>
      </template>

      <!-- 右侧查询按钮 -->
      <template #right>
        <span class="nav-text" @click="handleSearch">查看凭证</span>
      </template>
    </van-nav-bar>

    <van-cell-group v-if="task" class="task-info">
      <van-cell
          v-for="(value, key) in task"
          :key="key"
          :title="formatKey(key)"
          :border="false"
          v-show="shouldShowField(key)"
          class="task-field"
      >
        <!-- 特殊处理负责人和参与者 -->
        <template v-if="key === 'Task_Leader' || key === 'Task_Participant'">
          {{ getPersonName(value) }}
        </template>

        <!-- 基础字段：直接展示 -->
        <template v-else-if="!isComplexValue(value)">
          {{ value || '暂无数据' }}
        </template>

        <!-- 复杂字段：用弹窗展示对象内容 -->
        <template v-else>
          <van-button size="mini" type="info" @click="showDetail(value)">查看详情</van-button>

          <!-- 弹窗 -->
          <van-popup
              v-model="popupVisible"
              position="right"
              :style="{ width: '100%', height: '100%' }"
              :overlay-style="{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }"
          >
            <div class="popup-content">
              <van-nav-bar
                  :title="currentPopupTitle"
                  left-text="返回"
                  @click-left="hideDetail"
                  style="flex-shrink: 0;"
              />

              <div class="content-scroll">
                <van-cell-group>
                  <van-cell
                      v-for="(subValue, subKey) in currentContent"
                      :key="subKey"
                      :title="formatSubKey(subKey)"
                  >
                    <div v-if="typeof subValue === 'object' && subValue !== null">
                      <pre style="white-space: pre-wrap; background: #f9f9f9; padding: 8px; border-radius: 4px; margin: 0;">
                        {{ JSON.stringify(subValue, null, 2) }}
                      </pre>
                    </div>
                    <div v-else>
                      {{ subValue || '暂无数据' }}
                    </div>
                  </van-cell>
                </van-cell-group>
              </div>
            </div>
          </van-popup>
        </template>
      </van-cell>
    </van-cell-group>

    <van-empty v-else description="暂无任务数据" />
  </div>
</template>

<script>
export default {
  name: 'TaskDetail',
  data() {
    return {
      task: null,
      popupVisible: false, // 控制弹窗显示
      currentContent: {}, // 当前要显示的复杂对象内容
      currentPopupTitle: '', // 弹窗标题
      hiddenFields: ['Task_Code', 'ID_TaskInfo', 'Uuid', 'Logic_del', 'Id', 'Task_StageFile', 'Ts_create', 'Ts_edit', 'Task_Files', 'Task_Evidence']
    };
  },
  mounted() {
    this.loadTaskData();
  },
  methods: {
    handleSearch() {
      const taskId = this.task?.Id || '';
      if (!taskId) {
        this.$toast.fail('任务ID不存在，无法查看凭证');
        return;
      }
      // 跳转到凭证详情页，并携带 Id 参数
      this.$router.push({
        path: '/sensor_ddingWork/Release/task/evidence-detail',
        query: { Id: taskId }
      });
    }
,
    shouldShowField(key) {
      return !this.hiddenFields.includes(key);
    },
    isComplexValue(value) {
      return typeof value === 'object' && value !== null;
    },
    showDetail(value) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        this.$toast.fail('该字段不是合法的对象');
        return;
      }
      try {
        let parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
        // eslint-disable-next-line no-inner-declarations
        function deepClone(obj, hash = new WeakMap()) {
          if (obj === null || typeof obj !== 'object') return obj;
          if (hash.has(obj)) return undefined;
          const clone = Array.isArray(obj) ? [] : {};
          hash.set(obj, clone);
          for (let key in obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj.hasOwnProperty(key)) {
              clone[key] = deepClone(obj[key], hash);
            }
          }
          return clone;
        }

        this.currentContent = deepClone(parsedValue);
        this.currentPopupTitle = `内容详情`;
        this.popupVisible = true;
      } catch (e) {
        console.error('解析复杂字段失败:', e);
        this.$toast.fail('该字段无法解析为对象');
      }
    },
    hideDetail() {
      this.popupVisible = false;
      this.currentContent = {};
      this.currentPopupTitle = '';
    },
    loadTaskData() {
      console.log('当前路由参数:', this.$route.query);
      const taskData = this.$route.query.taskData;

      if (taskData) {
        try {
          const decodedData = decodeURIComponent(taskData);
          const parsedData = JSON.parse(decodedData);
          console.log('成功解码的任务数据:', parsedData);
          this.task = parsedData;
        } catch (e) {
          console.error('解析任务数据失败:', e);
        }
      } else {
        console.warn('未接收到 taskData 参数');
        this.task = null;
      }
    },
    formatKey(key) {
      const keyMap = {
        Task_Name: '任务名称',
        Task_Description: '任务描述',
        Project_Code: '项目编号',
        Task_ParentID: '父级任务ID',
        Task_Creator: '创建人',
        Task_Leader: '负责人',
        Task_Participant: '参与者',
        Task_StartTime: '任务开始时间',
        Task_ExEndTime: '任务截止时间',
        Task_FinishTime: '任务完成时间',
        Task_Status: '任务状态'
      };
      return keyMap[key] || key;
    },
    formatSubKey(key) {
      const subKeyMap = {
        id: 'ID',
        name: '名称',
        type: '类型',
        path: '路径',
        url: '链接',
        createTime: '创建时间',
        updateTime: '更新时间'
      };
      return subKeyMap[key] || key;
    },
    getPersonName(value) {
      console.log('传入 getPersonName 的 value:', value);
      try {
        let obj = typeof value === 'string' ? JSON.parse(value) : value;

        // 如果 obj 是数组，则取第一个元素
        if (Array.isArray(obj)) {
          obj = obj[0] || {};
        }

        // 安全访问 Person_Name 属性
        return obj?.Person_Name || '暂无数据';
      } catch (e) {
        console.error('获取 Person_Name 失败:', e);
        return '暂无数据';
      }
    }
  }
};
</script>

<style scoped>

.nav-text {
  color: #1989fa; /* Vant 默认蓝色 */
  font-size: 14px; /* 标题默认字号通常是 16px，这里设为 14px 不超过标题 */
  padding: 8px;
  text-decoration: none;
}

.task-detail-page {
  padding: 16px;
  background-color: #f8f8f8;
}

.task-info {
  margin-top: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.task-field .van-cell__title {
  font-weight: bold;
  flex: 1.5;
}

.task-field .van-cell__value {
  flex: 2;
  color: #333;
}

.van-button--mini {
  padding: 0 8px;
  height: 24px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
}

pre {
  margin: 0;
  font-size: 13px;
}
</style>
