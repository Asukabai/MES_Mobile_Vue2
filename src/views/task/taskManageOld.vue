<!--<template>-->
<!--  <div class="task-list">-->
<!--    &lt;!&ndash; 导航栏 &ndash;&gt;-->
<!--    <van-nav-bar title="任务列表" fixed />-->
<!--    &lt;!&ndash; 加载状态 &ndash;&gt;-->
<!--    <div v-if="loading" style="text-align: center; padding: 20px;">加载中...</div>-->
<!--    &lt;!&ndash; 错误提示 &ndash;&gt;-->
<!--    <div v-else-if="errorMessage" style="color: red; text-align: center; padding: 20px;">-->
<!--      {{ errorMessage }}-->
<!--    </div>-->
<!--    &lt;!&ndash; 空状态 &ndash;&gt;-->
<!--    <van-empty-->
<!--        v-else-if="taskData.length === 0"-->
<!--        description="暂无任务数据"-->
<!--        style="margin-top: 50px;"-->
<!--    />-->
<!--    &lt;!&ndash; 任务列表 &ndash;&gt;-->
<!--    <div v-else>-->
<!--      <van-cell-group-->
<!--          v-for="task in taskData"-->
<!--          :key="task.Id"-->
<!--          class="task-card"-->
<!--      >-->
<!--        &lt;!&ndash; 始终显示的任务标题 &ndash;&gt;-->
<!--        <van-cell>-->
<!--          <template #title>-->
<!--            <span class="task-title">{{ task.Task_Name }}</span>-->
<!--&lt;!&ndash;            <van-tag :type="task.Task_Status === '已完成' ? 'success' : 'primary'" style="margin-left: 10px;">&ndash;&gt;-->
<!--&lt;!&ndash;              {{ task.Task_Status }}&ndash;&gt;-->
<!--&lt;!&ndash;            </van-tag>&ndash;&gt;-->
<!--            <van-tag-->
<!--                :type="getTaskStatusType(task.Task_Status)"-->
<!--                style="margin-left: 10px;"-->
<!--            >-->
<!--              {{ task.Task_Status }}-->
<!--            </van-tag>-->

<!--          </template>-->
<!--          <template #default>-->
<!--            <span style="color: #999; font-size: 20px;" @click="toggleExpand(task)">-->
<!--              {{ task.expanded ? ' ▼' : ' ▶' }}-->
<!--            </span>-->
<!--          </template>-->
<!--        </van-cell>-->

<!--        &lt;!&ndash; 单独展示：开始时间 & 结束时间 &ndash;&gt;-->
<!--        <van-cell title="时间范围">-->
<!--          {{ formatDate(task.Task_StartTime) }} ~ {{ formatDate(task.Task_ExEndTime) }}-->
<!--        </van-cell>-->

<!--        &lt;!&ndash; 始终显示：项目编号 &ndash;&gt;-->
<!--        <van-cell title="项目编号" :value="task.Project_Code" />-->

<!--        &lt;!&ndash; 可折叠内容 &ndash;&gt;-->
<!--        <transition name="slide">-->
<!--          <div v-show="task.expanded" class="collapsible-content">-->
<!--            <van-cell title="负责人" :value="getLeaderName(task)" />-->
<!--            <van-cell title="创建人" :value="getCreatorName(task)" />-->
<!--            <van-cell title="任务描述">-->
<!--              <template #default>-->
<!--                <div class="task-description-wrapper">-->
<!--                  &lt;!&ndash; 有描述时显示更大图标 &ndash;&gt;-->
<!--                  <span-->
<!--                      v-if="task.Task_Description"-->
<!--                      class="expand-icon"-->
<!--                      @click.stop="showFullDescription(task.Task_Description)"          style="font-size: 24px;"-->
<!--                  >-->
<!--        &gt;-->
<!--      </span>-->
<!--                  &lt;!&ndash; 无描述时显示文字 &ndash;&gt;-->
<!--                  <span v-else style="color: #999;">暂无描述</span>-->
<!--                </div>-->
<!--              </template>-->
<!--            </van-cell>-->
<!--          </div>-->
<!--        </transition>-->

<!--        &lt;!&ndash; 更多操作按钮区域 &ndash;&gt;-->
<!--        <div class="task-actions">-->
<!--          <van-icon-->
<!--              name="ellipsis"-->
<!--              size="20px"-->
<!--              color="#666"-->
<!--              @click.stop="showActions(task)"-->
<!--          />-->
<!--        </div>-->
<!--      </van-cell-group>-->

<!--      &lt;!&ndash; 分页组件 &ndash;&gt;-->
<!--      <base-pagination-->
<!--          v-model="currentPage"-->
<!--          :total-items="allTasks.length"-->
<!--          :page-size="pageSize"-->
<!--          @page-change="handlePageChange"-->
<!--          @update:page-size="handlePageSizeChange"-->
<!--      />-->
<!--    </div>-->

<!--    &lt;!&ndash; 弹窗：显示完整任务描述 &ndash;&gt;-->
<!--    <van-popup-->
<!--        v-model="showPopup"-->
<!--        position="center"-->
<!--        :style="{ background: '#fff', zIndex: 9999, padding: '20px' }"-->
<!--        round-->
<!--        :close-on-click-overlay="true"-->
<!--        closeable-->
<!--    >-->
<!--      <div class="popup-content">-->
<!--        <h4 style="margin: 0 0 10px;">任务描述详情</h4>-->
<!--        <div v-for="(line, index) in popupLines" :key="index" class="popup-line">-->
<!--          {{ line }}-->
<!--        </div>-->
<!--      </div>-->
<!--    </van-popup>-->

<!--    &lt;!&ndash; 自定义动作面板 &ndash;&gt;-->
<!--    <van-popup-->
<!--        v-model="showActionSheet"-->
<!--        position="bottom"-->
<!--        :style="{ height: 'auto', paddingBottom: 'env(safe-area-inset-bottom)' }"-->
<!--        :close-on-click-overlay="true"-->
<!--    >-->
<!--      <div class="custom-action-sheet">-->
<!--        <div class="sheet-header">操作列表</div>-->

<!--        <div class="sheet-body">-->
<!--          <div-->
<!--              v-for="(action, index) in actions"-->
<!--              :key="index"-->
<!--              class="sheet-item"-->
<!--              :class="{ active: selectedAction === action }"-->
<!--              @click="selectAction(action)"-->
<!--          >-->
<!--            {{ action.name }}-->
<!--          </div>-->
<!--        </div>-->

<!--        <div class="sheet-footer">-->
<!--          <div class="btn cancel" @click="onActionCancel">取消</div>-->
<!--          <div class="btn confirm" @click="confirmAction">确认</div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </van-popup>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import SensorRequest from '@/utils/SensorRequest.js';-->
<!--import BasePagination from '@/components/BasePagination.vue';-->
<!--import { key_DingName, key_DingUserIndex, key_DingUserPhone } from "@/utils/Dingding";-->
<!--import {-->
<!--  Popup,-->
<!--  NavBar,-->
<!--  Tag,-->
<!--  Cell,-->
<!--  CellGroup,-->
<!--  Toast,-->
<!--  Icon-->
<!--} from 'vant';-->


<!--// 获取本地存储中的用户信息-->
<!--function getLocalUserInfo() {-->
<!--  const name = localStorage.getItem(key_DingName);-->
<!--  const phone = localStorage.getItem(key_DingUserPhone);-->
<!--  const dingID = localStorage.getItem(key_DingUserIndex); // 使用 key_DingUserIndex 作为 DingID-->

<!--  return {-->
<!--    name: name || '',-->
<!--    phone: phone || '',-->
<!--    dingID: dingID || ''-->
<!--  };-->
<!--}-->

<!--export default {-->
<!--  components: {-->
<!--    VanPopup: Popup,-->
<!--    VanNavBar: NavBar,-->
<!--    VanTag: Tag,-->
<!--    VanCell: Cell,-->
<!--    VanCellGroup: CellGroup,-->
<!--    VanIcon: Icon,-->
<!--    BasePagination-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      allTasks: [],     // 存储全部任务数据（用于分页）-->
<!--      taskData: [],     // 当前页展示的任务数据-->
<!--      loading: true,    // 加载状态-->
<!--      errorMessage: '', // 错误提示信息-->
<!--      currentPage: 1,   // 当前页码-->
<!--      pageSize: 5,      // 每页显示的任务数量-->

<!--      showPopup: false, // 控制弹窗是否显示-->
<!--      popupLines: [],   // 弹窗中展示的每一行内容-->

<!--      // 动作面板控制-->
<!--      showActionSheet: false,-->
<!--      selectedTask: null,-->
<!--      selectedAction: null,-->
<!--      actions: [-->
<!--        { name: '提交任务' },-->
<!--      ]-->
<!--    };-->
<!--  },-->
<!--  mounted() {-->
<!--    this.fetchTaskData();-->
<!--  },-->
<!--  methods: {-->
<!--    getTaskStatusType(status) {-->
<!--      switch (status) {-->
<!--        case '已完成':-->
<!--          return 'success'; // 绿色-->
<!--        case '未开始':-->
<!--          return 'primary'; // 蓝色-->
<!--        case '进行中':-->
<!--          return 'warning'; // 黄色-->
<!--        case '搁置':-->
<!--          return 'danger';  // 红色-->
<!--        default:-->
<!--          return 'default';-->
<!--      }-->
<!--    },-->
<!--    // 格式化日期为 YYYY/MM/DD-->
<!--    formatDate(dateString) {-->
<!--      if (!dateString) return '未知时间';-->

<!--      const date = new Date(dateString);-->
<!--      const year = date.getFullYear();-->
<!--      const month = (date.getMonth() + 1).toString().padStart(2, '0');-->
<!--      const day = date.getDate().toString().padStart(2, '0');-->

<!--      return `${year}/${month}/${day}`;-->
<!--    },-->

<!--    // 显示完整描述弹窗-->
<!--    showFullDescription(desc) {-->
<!--      if (!desc) return;-->

<!--      this.popupLines = desc.split(/\r?\n/);-->
<!--      this.showPopup = true;-->
<!--    },-->

<!--    // 获取任务数据-->
<!--    fetchTaskData() {-->
<!--      const userInfo = getLocalUserInfo();-->

<!--      const requestParams = JSON.stringify({-->
<!--        Project_Code: "",-->
<!--        Task_Name: "",-->
<!--        Task_Creator: null,-->
<!--        Task_Leader: [],-->
<!--        Task_Participant: [{-->
<!--          Person_Phone: userInfo.phone,-->
<!--          Person_Name: userInfo.name,-->
<!--          Person_DingID: userInfo.dingID-->
<!--        }]-->
<!--      });-->

<!--      SensorRequest.TaskInfoGetFun(requestParams, (respData) => {-->
<!--        try {-->

<!--          const data = JSON.parse(respData);-->
<!--          console.log(data)-->
<!--          this.allTasks = Array.isArray(data)-->
<!--              ? data.map(task => ({ ...task, expanded: false }))-->
<!--              : [{ ...data, expanded: false }];-->

<!--          // 排序：将 "已完成" 放到数组最后-->
<!--          this.allTasks.sort((a, b) => {-->
<!--            const order = { '已完成': 3, '未开始': 0, '进行中': 1, '搁置': 2 };-->
<!--            return (order[a.Task_Status] || 0) - (order[b.Task_Status] || 0);-->
<!--          });-->

<!--          this.updatePaginatedTasks();-->
<!--          this.loading = false;-->
<!--        } catch (error) {-->
<!--          console.error('解析 JSON 失败:', error);-->
<!--          this.errorMessage = '解析任务数据失败';-->
<!--          this.loading = false;-->
<!--        }-->
<!--      }, (error) => {-->
<!--        console.error('获取任务信息失败:', error);-->
<!--        this.errorMessage = '获取任务信息失败: ' + error.message;-->
<!--        this.loading = false;-->
<!--      });-->
<!--    },-->

<!--    updatePaginatedTasks() {-->
<!--      const start = (this.currentPage - 1) * this.pageSize;-->
<!--      const end = start + this.pageSize;-->
<!--      this.taskData = this.allTasks.slice(start, end);-->
<!--    },-->

<!--    handlePageChange(page) {-->
<!--      this.currentPage = page;-->
<!--      this.updatePaginatedTasks();-->
<!--    },-->

<!--    handlePageSizeChange(size) {-->
<!--      this.pageSize = size;-->
<!--      this.currentPage = 1;-->
<!--      this.updatePaginatedTasks();-->
<!--    },-->

<!--    getCreatorName(task) {-->
<!--      return task.Task_Creator && task.Task_Creator.Person_Name ? task.Task_Creator.Person_Name : '未知';-->
<!--    },-->
<!--    getLeaderName(task) {-->
<!--      return task.Task_Leader && task.Task_Leader.length > 0 && task.Task_Leader[0].Person_Name-->
<!--          ? task.Task_Leader[0].Person_Name-->
<!--          : '未知';-->
<!--    },-->

<!--    toggleExpand(task) {-->
<!--      task.expanded = !task.expanded;-->
<!--    },-->

<!--    // 显示动作面板并绑定当前任务-->
<!--    showActions(task) {-->
<!--      this.selectedTask = task;-->
<!--      this.selectedAction = null;-->
<!--      this.showActionSheet = true;-->
<!--    },-->

<!--    // 选择某个操作项-->
<!--    selectAction(action) {-->
<!--      this.selectedAction = action;-->
<!--    },-->

<!--    // 确认操作-->
<!--    confirmAction() {-->
<!--      const taskName = this.selectedTask?.Task_Name || '';-->
<!--      const taskStatus = this.selectedTask?.Task_Status || '';-->
<!--      const projectCode = this.selectedTask?.Project_Code || '';-->
<!--      const actionName = this.selectedAction?.name || '';-->
<!--      const Id = this.selectedTask?.Id || '';-->
<!--      // 获取任务描述-->
<!--      const taskDescription = this.selectedTask?.Task_Description || '';-->

<!--      if (!actionName) return;-->

<!--      switch (actionName) {-->
<!--        case '拒绝任务':-->
<!--          Toast(`【拒绝任务】任务：${taskName}`);-->
<!--          break;-->
<!--        case '提交任务':-->
<!--          // 判断任务是否已完成-->
<!--          if (taskStatus === '已完成') {-->
<!--            Toast('已完成任务，无法再次提交记录');-->
<!--            return;-->
<!--          }-->
<!--          // Toast(`【接受任务】任务：${taskName}`);-->
<!--          // 跳转并传递参数-->
<!--          this.$router.push({-->
<!--            path: '/sensor_ddingWork/Release/task-detail',-->
<!--            query: {-->
<!--              taskName,projectCode,Id,-->
<!--              taskDescription-->
<!--            }-->
<!--          });-->
<!--          break;-->
<!--        case '编辑':-->
<!--          Toast(`【编辑】任务：${taskName}`);-->
<!--          break;-->
<!--        case '删除':-->
<!--          Toast(`【删除】任务：${taskName}`);-->
<!--          break;-->
<!--      }-->

<!--      // 关闭面板-->
<!--      this.showActionSheet = false;-->
<!--      this.selectedAction = null;-->
<!--    },-->

<!--    // 取消操作-->
<!--    onActionCancel() {-->
<!--      this.showActionSheet = false;-->
<!--      this.selectedAction = null;-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.task-list {-->
<!--  padding-top: 46px; /* 与导航栏高度一致 */-->
<!--}-->
<!--.task-card {-->
<!--  margin-bottom: 15px;-->
<!--  border-radius: 8px;-->
<!--  overflow: hidden;-->
<!--  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);-->
<!--}-->

<!--.task-title {-->
<!--  font-size: 16px;-->
<!--  font-weight: bold;-->
<!--}-->

<!--/* 可折叠内容动画 */-->
<!--.collapsible-content {-->
<!--  overflow: hidden;-->
<!--}-->
<!--.slide-enter-active,-->
<!--.slide-leave-active {-->
<!--  transition: max-height 0.3s ease-out;-->
<!--  max-height: 200px;-->
<!--}-->
<!--.slide-enter,-->
<!--.slide-leave-to {-->
<!--  max-height: 0;-->
<!--}-->

<!--/* 任务描述样式 */-->
<!--.task-description-wrapper {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: flex-end;-->
<!--  min-height: 24px;-->
<!--}-->
<!--.expand-icon {-->
<!--  margin-left: 8px;-->
<!--  color: #1989fa;-->
<!--  cursor: pointer;-->
<!--  font-weight: bold;-->
<!--  user-select: none;-->
<!--}-->

<!--/* 卡片底部按钮区域 */-->
<!--.task-actions {-->
<!--  display: flex;-->
<!--  justify-content: flex-end;-->
<!--  align-items: center;-->
<!--  padding: 10px 16px;-->
<!--  background-color: #f9f9f9;-->
<!--  border-top: 1px solid #ebedf0;-->
<!--}-->

<!--/* 自定义动作面板样式 */-->
<!--.custom-action-sheet {-->
<!--  background-color: #fff;-->
<!--  width: 100%;-->
<!--}-->
<!--.sheet-header {-->
<!--  padding: 16px;-->
<!--  font-size: 16px;-->
<!--  text-align: center;-->
<!--  font-weight: bold;-->
<!--  border-bottom: 1px solid #eee;-->
<!--}-->
<!--.sheet-body {-->
<!--  padding: 10px 0;-->
<!--}-->
<!--.sheet-item {-->
<!--  padding: 14px 16px;-->
<!--  font-size: 16px;-->
<!--  color: #333;-->
<!--}-->
<!--.sheet-item.active {-->
<!--  background-color: #f5f5f5;-->
<!--  color: #1989fa;-->
<!--}-->
<!--.sheet-footer {-->
<!--  display: flex;-->
<!--  border-top: 1px solid #eee;-->
<!--  background-color: #f7f8fa;-->
<!--}-->
<!--.sheet-footer .btn {-->
<!--  flex: 1;-->
<!--  text-align: center;-->
<!--  padding: 14px 0;-->
<!--  font-size: 16px;-->
<!--}-->
<!--.sheet-footer .cancel {-->
<!--  color: #666;-->
<!--}-->
<!--.sheet-footer .confirm {-->
<!--  color: #1989fa;-->
<!--}-->

<!--.popup-content {-->
<!--  min-width: 200px;-->
<!--  max-width: 80vw; /* 控制最大宽度不超过视口的 80% */-->
<!--  max-height: 80vh; /* 控制最大高度不超过视口的 80% */-->
<!--  overflow-y: auto; /* 内容过高时显示滚动条 */-->
<!--  padding: 20px;-->
<!--  box-sizing: border-box;-->
<!--}-->

<!--.popup-line {-->
<!--  white-space: pre-wrap; /* 保留换行符 */-->
<!--  word-break: break-word;-->
<!--}-->

<!--.task-description-wrapper {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: flex-end;-->
<!--}-->

<!--</style>-->
