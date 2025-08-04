<template>
  <div class="task-detail-page">
    <van-nav-bar title="任务详情"></van-nav-bar>

    <!-- Tab 标签页 -->
    <van-tabs v-model="activeTab" sticky animated swipeable class="task-tabs">
      <!-- Tab 1: 任务详情 -->
      <van-tab title="任务信息">
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
<!--                  <van-nav-bar-->
<!--                      :title="currentPopupTitle"-->
<!--                      left-text="返回"-->
<!--                      @click-left="hideDetail"-->
<!--                      style="flex-shrink: 0;"-->
<!--                  />-->
                  <van-nav-bar
                      left-text="返回到上一页"
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
          <van-cell
              v-if="task && task.Task_Files"
              title="任务附件"
              :border="false"
              class="task-field"
          >
            <div v-if="task.Task_Files.length === 0">
              暂无数据
            </div>
            <div v-else>
              <van-button
                  size="mini"
                  type="info"
                  @click="showFilePopup"
              >查看附件</van-button>
            </div>
          </van-cell>

          <!-- 文件弹窗 -->
          <van-popup
              v-model="filePopupVisible"
              position="right"
              :style="{ width: '100%', height: '100%' }"
              :overlay-style="{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }"
          >
            <div class="popup-content">
<!--              <van-nav-bar
                  title="任务附件"
                  left-text="返回"
                  @click-left="hideFilePopup"
                  style="flex-shrink: 0;"
              />-->
            <van-nav-bar
                  left-text="返回到上一页"
                  @click-left="hideFilePopup"
                  style="flex-shrink: 0;"
              />
              <div class="content-scroll">
                <div
                    v-for="(file, index) in task.Task_Files"
                    :key="index"
                    style="display: flex; align-items: center; margin-bottom: 8px;"
                >
                  <span style="flex: 1;">{{ file.File_Name }}</span>
                  <van-button
                  icon="down"
                  size="mini"
                  type="primary"
                  style="margin-left: 8px;"
                  @click="downloadFile(file)"
              >下载</van-button>
                <van-button
                    icon="guide-o"
                    size="mini"
                    type="info"
                    style="margin-left: 8px;"
                    @click="previewFile(file)"
                >预览</van-button>
              </div>
              </div>
            </div>
          </van-popup>
        </van-cell-group>

        <van-empty v-else description="暂无任务数据" />
      </van-tab>

      <!-- Tab 2: 凭证详情 -->
      <van-tab title="凭证详情">
        <evidence-detail :task-id="taskId" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import EvidenceDetail from '@/views/share/EvidenceDetail.vue'
import { downloadFile as utilsDownloadFile, previewFile as utilsPreviewFile } from '@/utils/fileUtils';
export default {
  name: 'TaskDetail',
  components: {
    EvidenceDetail
  },
  data() {
    return {
      activeTab: 0,
      task: null,
      taskId: null,
      popupVisible: false,
      currentContent: {},
      currentPopupTitle: '',
      filePopupVisible: false,
      hiddenFields: ['Task_Code', 'ID_TaskInfo', 'Uuid', 'Logic_del', 'Id', 'Task_StageFile', 'Ts_create', 'Ts_edit', 'Task_Files', 'Task_Evidence']
    }
  },
  mounted() {
    this.loadTaskData()
  },
  methods: {
    shouldShowField(key) {
      return !this.hiddenFields.includes(key)
    },
    isComplexValue(value) {
      return typeof value === 'object' && value !== null
    },
    showDetail(value) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        this.$toast.fail('该字段不是合法的对象')
        return
      }
      try {
        let parsedValue = typeof value === 'string' ? JSON.parse(value) : value

        // 调用组件方法 deepClone
        this.currentContent = this.deepClone(parsedValue)
        this.currentPopupTitle = `内容详情`
        this.popupVisible = true
      } catch (e) {
        console.error('解析复杂字段失败:', e)
        this.$toast.fail('该字段无法解析为对象')
      }
    },
    hideDetail() {
      this.popupVisible = false
      this.currentContent = {}
      this.currentPopupTitle = ''
    },
    loadTaskData() {
      console.log('当前路由参数:', this.$route.query)
      const taskData = this.$route.query.taskData

      if (taskData) {
        try {
          const decodedData = decodeURIComponent(taskData)
          const parsedData = JSON.parse(decodedData)
          console.log('成功解码的任务数据:', parsedData)
          this.task = parsedData
          this.taskId = parsedData.Id // 保存 taskId 用于凭证组件
        } catch (e) {
          console.error('解析任务数据失败:', e)
        }
      } else {
        console.warn('未接收到 taskData 参数')
        this.task = null
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
      }
      return keyMap[key] || key
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
      }
      return subKeyMap[key] || key
    },
    // getPersonName(value) {
    //   console.log('传入 getPersonName 的 value:', value)
    //   try {
    //     let obj = typeof value === 'string' ? JSON.parse(value) : value
    //
    //     if (Array.isArray(obj)) {
    //       obj = obj[0] || {}
    //     }
    //
    //     return obj?.Person_Name || '暂无数据'
    //   } catch (e) {
    //     console.error('获取 Person_Name 失败:', e)
    //     return '暂无数据'
    //   }
    // },

    getPersonName(value) {
      console.log('传入 getPersonName 的 value:', value);
      try {
        // 解析输入值
        let obj = typeof value === 'string' ? JSON.parse(value) : value;

        // 检查是否为数组
        if (Array.isArray(obj)) {
          // 提取数组中所有对象的 Person_Name 属性值
          const names = obj.map(item => item?.Person_Name).filter(name => name); // 过滤掉空值
          return names.length > 0 ? names.join(', ') : '暂无数据'; // 拼接成字符串
        }

        // 如果不是数组，直接返回单个对象的 Person_Name
        return obj?.Person_Name || '暂无数据';
      } catch (e) {
        console.error('获取 Person_Name 失败:', e);
        return '暂无数据';
      }
    },

    // ✅ 安全调用 hasOwnProperty，避免 ESLint 报错
    deepClone(obj, hash = new WeakMap()) {
      if (obj === null || typeof obj !== 'object') return obj
      if (hash.has(obj)) return undefined
      const clone = Array.isArray(obj) ? [] : {}
      hash.set(obj, clone)

      for (let key in obj) {
        // ✅ 使用标准方式调用 hasOwnProperty
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          clone[key] = this.deepClone(obj[key], hash)
        }
      }
      return clone
    },
    downloadFile(file) {
      utilsDownloadFile(file);
    },
    previewFile(file) {
      utilsPreviewFile(file);
    },
    showFilePopup() {
      this.filePopupVisible = true;
    },
    hideFilePopup() {
      this.filePopupVisible = false;
    }
  }
}
</script>


<style scoped>
.nav-text {
  color: #1989fa;
  font-size: 14px;
  padding: 8px;
  text-decoration: none;
}

.task-detail-page {
  padding: 0;
  background-color: #f8f8f8;
}

.task-tabs {
  margin-top: 8px;
  background-color: #fff;
}

.van-tabs__wrap {
  background-color: #f5f5f5;
}

.van-cell-group {
  background-color: #fff;
  margin-top: 16px;
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
