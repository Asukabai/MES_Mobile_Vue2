<template>
  <div class="project-manage">
<!--    <van-nav-bar title="项目列表" fixed />-->
    <div class="content">
      <!-- 加载状态 -->
      <div v-if="loading" style="text-align: center; padding: 20px;">加载中...</div>
      <!-- 错误提示 -->
      <div v-else-if="errorMessage" style="color: red; text-align: center; padding: 20px;">
        {{ errorMessage }}
      </div>
      <!-- 项目列表 -->
      <van-list
          v-for="(project) in projects"
          :key="project.Id"
          class="project-card"
      >
        <van-cell-group
            :border="false"
            @click="toggleExpand(project)"
        >
          <!-- 基础信息始终显示 -->
          <van-cell title="项目编号">
            <template #default>
              <span class="highlight-code">{{ project.Project_Code || '暂无数据' }}</span>
            </template>
          </van-cell>

          <!-- 项目名称 + 展开箭头 -->
          <van-cell title="项目名称" :value="project.Project_Name || '暂无数据'">
            <template #right-icon>
              <span style="color: #999; font-size: 14px;">
                {{ project.expanded ? ' ▼' : ' ▶' }}
              </span>
            </template>
          </van-cell>

          <!-- 扩展内容带动画 -->
          <transition name="slide">
            <div v-show="project.expanded">
              <!-- 项目描述 -->
              <van-cell title="项目描述" :value="project.Project_Description || '暂无描述'" />

              <!-- 负责人 -->
              <van-cell
                  title="负责人"
                  :value="formatLeaders(project.Project_Leader)"
                  is-link
                  @click.stop="showLeaderDetail(project.Project_Leader)"
              />

              <!-- 参与者 -->
              <van-cell
                  title="参与者"
                  :value="formatParticipantCount(project.Project_Participant)"
                  is-link
                  @click.stop="showParticipantDetail(project.Project_Participant)"
              />

              <!-- 开始时间 -->
              <van-cell title="开始时间" :value="formatDate(project.Project_StartTime)" />

              <!-- 预计结束时间 -->
              <van-cell title="预计结束时间" :value="formatDate(project.Project_ExEndTime)" />

              <!-- 状态 -->
              <van-cell title="状态">
                <template #default>
                  <span :class="['status-text', getStatusClass(project.Project_Status)]">
                    {{ project.Project_Status }}
                  </span>
                </template>
              </van-cell>

              <!-- 文件列表 -->
              <van-cell
                  title="文件列表"
                  :value="formatFileCount(project.Project_Files)"
                  :is-link="canShowFile(project.Project_Files)"
                  @click="canShowFile(project.Project_Files) ? showFileDialog(project.Project_Files) : null"
              />
            </div>
          </transition>
        </van-cell-group>
      </van-list>
      <!-- 分页组件 -->
      <base-pagination
          v-model="currentPage"
          :total-items="allProjects.length"
          :page-size="pageSize"
          @page-change="handlePageChange"
          @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script>import SensorRequest from '@/utils/SensorRequest';
import BasePagination from '@/components/BasePagination.vue';

export default {
  name: 'ProjectManage',
  components: {
    BasePagination
  },
  data() {
    return {
      allProjects: [], // 存储全部项目数据（用于分页）
      projects: [],    // 当前页展示的数据
      loading: true,
      errorMessage: '',
      currentPage: 1,  // 当前页码
      pageSize: 5      // 每页条数
    };
  },
  mounted() {
    this.fetchProjectData();
    window.vueApp = this; // 挂载到 window，供 HTML 调用
  },
  methods: {
    downloadFile(fileMd5) {
      if (!fileMd5) {
        this.$toast.fail('无法获取文件标识，请联系管理员');
        return;
      }
      const requestParam = JSON.stringify({
        remoteLocation: fileMd5,
      });
      SensorRequest.Minio_PresignedDownloadUrl5B(
          requestParam,
          (respData) => {
            let result;
            try {
              result = respData;
            } catch (e) {
              this.$toast.fail('服务器返回数据异常');
              console.error('接口返回数据不是合法 JSON', e);
              return;
            }

            const fileUrl = result;
            if (!fileUrl) {
              this.$toast.fail('未能获取文件下载地址');
              console.error('接口未返回有效 URL', result);
              return;
            }

            // 替换域名和端口
            const signPart = fileUrl.split('http://127.0.0.1:9000')[1];
            const finalUrl = `https://api-v2.sensor-smart.cn:22027${signPart}`;

            // 打开下载链接
            window.open(finalUrl, '_blank');
          },
          (error) => {
            this.$toast.fail('加载下载链接失败，请检查网络或稍后再试');
            console.error('获取下载链接失败:', error);
          }
      );
    },
    fetchProjectData() {
      SensorRequest.ProjectInfoGetFun(
          '',
          (respData) => {
            console.log("respData", respData);
            const data = JSON.parse(respData);
            const list = Array.isArray(data) ? data : [data];

            // 初始化 expanded 字段并确保所有字段都可响应
            this.allProjects = list.map(p => ({
              Id: p.Id,
              Project_Code: p.Project_Code,
              Project_Name: p.Project_Name,
              Project_Description: p.Project_Description,
              Project_Leader: p.Project_Leader,
              Project_Participant: p.Project_Participant,
              Project_StartTime: p.Project_StartTime,
              Project_ExEndTime: p.Project_ExEndTime,
              Project_Status: p.Project_Status,
              Project_Files: p.Project_Files,
              expanded: false
            }));

            this.updatePaginatedProjects(); // 初始更新分页数据

            this.loading = false;
          },
          (error) => {
            this.errorMessage = '获取项目信息失败: ' + error.message;
            this.loading = false;
          }
      );
    },

    updatePaginatedProjects() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.projects = this.allProjects.slice(start, end);
    },

    handlePageChange(page) {
      this.currentPage = page;
      this.updatePaginatedProjects();
    },

    handlePageSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.updatePaginatedProjects();
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())}`;
    },
    padZero(value) {
      return value.toString().padStart(2, '0');
    },

    // 控制卡片展开/收起
    toggleExpand(project) {
      const index = this.projects.findIndex(p => p.Id === project.Id);
      if (index > -1) {
        const current = this.projects[index];
        this.$set(this.projects, index, {
          ...current,
          expanded: !current.expanded
        });
      }
    },

    // 格式化参与者数量
    formatParticipantCount(participants) {
      return participants && participants.length > 0 ? `共 ${participants.length} 位参与者` : '暂无参与者';
    },
    // 显示参与者详情（弹窗）
    showParticipantDetail(participants) {
      const content = participants.map(p => `${p.Person_Name} (${p.Person_Phone})`).join('<br>');
      this.$dialog.alert({
        title: '参与者列表',
        message: content,
        dangerouslyUseHTMLString: true
      });
    },
    canShowFile(files) {
      return files && files.length > 0;
    },
    // 返回状态文本对应 class
    getStatusClass(status) {
      switch (status) {
        case '进行中':
          return 'status-running';
        case '已完成':
          return 'status-finished';
        case '已延期':
          return 'status-delayed';
        case '已开始':
          return 'status-started';
        default:
          return 'status-default';
      }
    },
    // 格式化负责人显示
    formatLeaders(leaders) {
      if (!leaders || leaders.length === 0) return '暂无负责人';
      const count = leaders.length;
      if (count <= 3) {
        return leaders.map(l => l.Person_Name).join('、');
      }
      return `${leaders.slice(0, 3).map(l => l.Person_Name).join('、')} 等 ${count} 人`;
    },
    // 显示负责人详情（弹窗）
    showLeaderDetail(leaders) {
      const content = leaders.map(l => `${l.Person_Name} (${l.Person_Phone})`).join('<br>');
      this.$dialog.alert({
        title: '负责人列表',
        message: content,
        dangerouslyUseHTMLString: true
      });
    },
    // 格式化文件数量
    formatFileCount(files) {
      return files && files.length > 0 ? `共 ${files.length} 个文件` : '暂无文件';
    },
    // 查看文件详情（弹窗）
    // showFileDialog(files) {
    //   const content = files.map(f => `${f.File_Name}（上传时间：${this.formatDate(f.Upload_Time)}）`).join('<br>');
    //   this.$dialog.alert({
    //     title: '文件列表',
    //     message: content,
    //     dangerouslyUseHTMLString: true
    //   });
    // }

    showFileDialog(files) {
      const content = files.map(f => {
        return `<a href="javascript:void(0);" onclick="window.vueApp.downloadFile('${f.File_Md5}')">${f.File_Name}（上传时间：${this.formatDate(f.Upload_Time)}）</a>`;
      }).join('<br>');

      this.$dialog.alert({
        title: '文件列表',
        message: content,
        dangerouslyUseHTMLString: true
      });
    }
  },
  watch: {
    allProjects: {
      deep: true,
      handler() {
        this.updatePaginatedProjects(); // 如果 allProjects 更新，重新计算分页
      }
    }
  },
  computed: {
    paginatedProjects() {
      return this.projects;
    }
  }
};
</script>

<style scoped>
.highlight-code {
  padding: 4px 10px;
  border-radius: 4px;
  background-color: #ffe066; /* 黄色系高亮背景 */
  color: #333;
  font-weight: bold;
}

.status-text {
  font-weight: bold;
  padding: 0 4px;
}

.status-running {
  color: #1989fa; /* 进行中 - 蓝色 */
}

.status-finished {
  color: #07c160; /* 已完成 - 绿色 */
}

.status-delayed {
  color: #ff3333; /* 已延期 - 红色 */
}

.status-started {
  color: #f0a100; /* 已开始 - 橙色 */
}

.status-default {
  color: #666; /* 默认 - 灰色 */
}

.project-manage {
  padding-top: 10px; /* 与导航栏高度一致 */
}

.content {
  padding: 10px;
}

/* 卡片样式 */
.project-card {
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 默认阴影 */
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.project-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 悬停时更强的阴影 */
}

.project-card:active {
  transform: scale(0.99); /* 点击时轻微缩放 */
}

/* 过渡动画 */
.slide-enter-active,
.slide-leave-active {
  max-height: 200px;
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-enter,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
