<template>
  <div class="gantt-chart-container">
    <el-header><h1 class="title">项目进度甘特图</h1></el-header>

    <div class="controls">
      <el-button type="primary" @click="addTask">添加任务</el-button>
      <el-button @click="resetGantt">重置视图</el-button>
    </div>

    <!-- DHTMLX Gantt 图表 -->
    <div ref="ganttContainer" style="height: 500px; margin-top: 20px;"></div>

    <!-- 添加/编辑任务对话框 -->
    <el-dialog :title="editIndex !== -1 ? '编辑任务' : '添加新任务'" :visible.sync="dialogVisible">
      <el-form :model="currentTask" label-position="right" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="currentTask.name" placeholder="请输入任务名称"></el-input>
        </el-form-item>

        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker
              v-model="currentTask.startDate"
              type="datetime"
              placeholder="选择开始时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
              v-model="currentTask.endDate"
              type="datetime"
              placeholder="选择结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="负责人" prop="assignee">
          <el-select v-model="currentTask.assignee" placeholder="请选择负责人">
            <el-option label="张三" value="张三"></el-option>
            <el-option label="李四" value="李四"></el-option>
            <el-option label="王五" value="王五"></el-option>
            <el-option label="赵六" value="赵六"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="currentTask.status" placeholder="请选择状态">
            <el-option label="未开始" value="未开始"></el-option>
            <el-option label="进行中" value="进行中"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTask">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入 dhtmlx-gantt 组件
import 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

export default {
  name: 'GanttChartComponent',
  data() {
    return {
      // 甘特图任务数据
      tasks: [
        {
          id: 1,
          name: '项目启动',
          startDate: '2024-01-01 09:00:00',
          endDate: '2024-01-05 17:00:00',
          assignee: '张三',
          status: '已完成'
        },
        {
          id: 2,
          name: '需求分析',
          startDate: '2024-01-06 09:00:00',
          endDate: '2024-01-10 17:00:00',
          assignee: '李四',
          status: '进行中'
        },
        {
          id: 3,
          name: '系统设计',
          startDate: '2024-01-11 09:00:00',
          endDate: '2024-01-15 17:00:00',
          assignee: '王五',
          status: '未开始'
        },
        {
          id: 4,
          name: '开发实现',
          startDate: '2024-01-16 09:00:00',
          endDate: '2024-01-30 17:00:00',
          assignee: '赵六',
          status: '未开始'
        },
        {
          id: 5,
          name: '测试验证',
          startDate: '2024-01-31 09:00:00',
          endDate: '2024-02-05 17:00:00',
          assignee: '张三',
          status: '未开始'
        }
      ],

      // 对话框状态
      dialogVisible: false,

      // 当前编辑的任务
      currentTask: {
        id: null,
        name: '',
        startDate: '',
        endDate: '',
        assignee: '',
        status: '未开始'
      },

      // 编辑索引
      editIndex: -1
    };
  },

  mounted() {
    this.initGantt();
  },

  methods: {
    // 初始化甘特图
    initGantt() {
      const container = this.$refs.ganttContainer;

      // 直接初始化甘特图
      // eslint-disable-next-line no-undef
      gantt.init(container, {
        task_height: 30,
        scale_height: 40,
        scrollable: true,
        scale_unit: 'day',
        date_format: '%Y-%m-%d',
        min_column_width: 40,
        show_task_progress: true
      });

      // 设置任务数据
      this.setTasksData();

      // 配置甘特图样式
      this.configureGantt();
    },

    // 设置任务数据
    setTasksData() {
      // 转换数据格式
      const formattedTasks = this.tasks.map(task => ({
        id: task.id,
        text: task.name,
        start_date: task.startDate,
        end_date: task.endDate,
        progress: task.status === '已完成' ? 1 : task.status === '进行中' ? 0.5 : 0,
        color: task.status === '已完成' ? '#4CAF50' : task.status === '进行中' ? '#FF9800' : '#9E9E9E',
        custom_data: {
          assignee: task.assignee,
          status: task.status
        }
      }));

      // 清空并加载数据
      // eslint-disable-next-line no-undef
      gantt.clearAll();
      // eslint-disable-next-line no-undef
      gantt.parse(formattedTasks);
    },

    // 配置甘特图样式
    configureGantt() {
      // 自定义任务样式
      // eslint-disable-next-line no-undef
      gantt.attachEvent('onTaskSelected', function(id) {
        const task = this.getTask(id);
        console.log('选中任务:', task.text);
      });

      // 添加任务点击事件
      // eslint-disable-next-line no-undef,no-unused-vars
      gantt.attachEvent('onTaskClick', (id, e) => {
        // eslint-disable-next-line no-unused-vars,no-undef
        const task = gantt.getTask(id);
        this.editTask(this.tasks.findIndex(t => t.id === id));
        return false;
      });
    },

    // 添加新任务
    addTask() {
      this.currentTask = {
        id: null,
        name: '',
        startDate: '',
        endDate: '',
        assignee: '',
        status: '未开始'
      };
      this.editIndex = -1;
      this.dialogVisible = true;
    },

    // 编辑任务
    editTask(index) {
      this.editIndex = index;
      this.currentTask = { ...this.tasks[index] };
      this.dialogVisible = true;
    },

    // 保存任务
    saveTask() {
      if (!this.currentTask.name || !this.currentTask.startDate || !this.currentTask.endDate) {
        this.$message.error('请填写所有必填字段！');
        return;
      }

      if (this.editIndex === -1) {
        // 添加新任务
        this.currentTask.id = Date.now();
        this.tasks.push(this.currentTask);
      } else {
        // 更新现有任务
        this.tasks[this.editIndex] = { ...this.currentTask };
      }

      // 更新甘特图
      this.setTasksData();

      this.dialogVisible = false;
      this.$message.success('任务保存成功！');
    },

    // 删除任务
    deleteTask(index) {
      this.$confirm('确认删除此任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tasks.splice(index, 1);
        this.setTasksData();
        this.$message.success('任务删除成功！');
      });
    },

    // 重置甘特图
    resetGantt() {
      this.tasks = [
        {
          id: 1,
          name: '项目启动',
          startDate: '2024-01-01 09:00:00',
          endDate: '2024-01-05 17:00:00',
          assignee: '张三',
          status: '已完成'
        },
        {
          id: 2,
          name: '需求分析',
          startDate: '2024-01-06 09:00:00',
          endDate: '2024-01-10 17:00:00',
          assignee: '李四',
          status: '进行中'
        }
      ];
      this.setTasksData();
      this.$message.success('甘特图已重置！');
    }
  },

  beforeDestroy() {
    // eslint-disable-next-line no-undef
    if (gantt) {
      // eslint-disable-next-line no-undef
      gantt.destructor();
    }
  }
};
</script>

<style scoped>
.gantt-chart-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.title {
  margin: 0;
  font-size: 24px;
  line-height: 1.5;
  color: #333;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: flex-start;
}

/* 重置默认的 gantt 样式 */
.dhtmlx_gantt {
  border: none !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gantt-chart-container {
    padding: 10px;
  }
}
</style>
