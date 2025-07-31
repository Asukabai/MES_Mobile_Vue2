<template>
  <div class="evidence-detail-page">
<!--    <van-nav-bar title="凭证详情" left-text="返回到上一页" @click-left="$router.go(-1)" />-->

    <!-- 加载中提示 -->
    <van-loading size="24px" vertical v-if="loading">加载中...</van-loading>

    <!-- 错误提示 -->
    <van-empty v-if="error" description="数据加载失败" />

    <!-- 基础信息 -->
    <van-cell-group v-if="taskData && !loading && !error">
      <van-cell title="任务名称">
        <div class="cell-content">{{ taskData.Task_Name || '暂无数据' }}</div>
      </van-cell>

      <van-cell title="项目编号">
        <div class="cell-content">{{ taskData.Project_Code || '暂无数据' }}</div>
      </van-cell>
    </van-cell-group>

    <!-- 阶段卡片列表 -->
<!--    <div v-for="(stage, index) in stageList" :key="index" class="stage-card">-->
<!--      <van-cell-group>-->
<!--        <van-cell title="任务进度">-->
<!--          <div class="cell-content">{{ stage.TaskStageFile_Progress || '0' }}%</div>-->
<!--        </van-cell>-->

<!--        <van-cell title="任务备注">-->
<!--          <div class="cell-content">{{ stage.TaskStageFile_Remark || '暂无备注' }}</div>-->
<!--        </van-cell>-->

<!--        <van-cell title="上传凭证">-->
<!--          <div class="image-list" v-if="Array.isArray(stage.TaskStage_Files) && stage.TaskStage_Files.length">-->
<!--            <div v-for="(file, idx) in stage.TaskStage_Files" :key="idx" class="image-item">-->
<!--              <van-image-->
<!--                  width="80"-->
<!--                  height="80"-->
<!--                  :src="file.File_Base64 || placeholderImage"-->
<!--                  @click="previewImage(file.File_Base64)"-->
<!--              />-->
<!--              <div class="upload-time">{{ file.Upload_Time_Formatted || '暂无时间' }}</div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div v-else class="cell-content" style="color: #999;">暂无图片</div>-->
<!--        </van-cell>-->
<!--      </van-cell-group>-->
<!--    </div>-->
    <!-- 阶段卡片列表 -->
    <div v-if="stageList.length > 0">
      <div v-for="(stage, index) in stageList" :key="index" class="stage-card">
        <van-cell-group>
          <van-cell title="任务进度">
<!--            <div class="cell-content">{{ stage.TaskStageFile_Progress || '0' }}%</div>-->
            <div class="progress-container">
              <van-progress
                  :percentage="parseFloat(stage.TaskStageFile_Progress) || 0"
                  :show-pivot="true"
                  :pivot-text="`${stage.TaskStageFile_Progress || '0'}%`"
                  :stroke-width="10"
                  color="#1989fa"
              />
            </div>
          </van-cell>

          <van-cell title="任务备注">
            <div class="cell-content">{{ stage.TaskStageFile_Remark || '暂无备注' }}</div>
          </van-cell>

          <van-cell title="提交人员">
            <div class="cell-content">{{ stage.StageFile_Creator || '暂无人员' }}</div>
          </van-cell>

          <van-cell title="上传凭证">
            <div class="image-list" v-if="Array.isArray(stage.TaskStage_Files) && stage.TaskStage_Files.length">
              <div v-for="(file, idx) in stage.TaskStage_Files" :key="idx" class="image-item">
                <van-image
                    width="80"
                    height="80"
                    :src="file.File_Base64 "
                    @click="previewImage(file.File_Base64)"
                />
                <div class="upload-time">{{ file.Upload_Time_Formatted || '暂无时间' }}</div>
              </div>
            </div>
            <van-empty
                v-else
                description="暂无凭证提交"
                image="https://fastly.jsdelivr.net/npm/@vant/assets/cat.png"
                image-size="80"
                class="empty-placeholder"
            />
          </van-cell>
        </van-cell-group>
      </div>
    </div>

    <!-- 新增：任务进度为100%的凭证卡片 -->
    <div v-if="finalEvidenceList.length > 0">
      <div class="stage-card" style="margin-top: 24px;">
        <van-cell-group>
          <van-cell title="任务进度">
<!--            <div class="cell-content">100%</div>-->
            <div class="progress-container">
              <van-progress
                  :percentage="100"
                  :show-pivot="true"
                  pivot-text="100%"
                  :stroke-width="10"
                  color="#1989fa"
              />
            </div>
          </van-cell>

          <van-cell title="任务成员">
            <div class="cell-content">
              <template v-if="participantNames.length > 0">
            <span v-for="(name, index) in participantNames" :key="index">
              {{ name }}
              <!-- 如果不是最后一个名字且索引为偶数，则添加换行符 -->
              <template v-if="index < participantNames.length - 1 && (index + 1) % 2 === 0"><br></template>
              <!-- 如果不是最后一个名字且索引为奇数，则添加逗号 -->
              <template v-else-if="index < participantNames.length - 1">, </template>
            </span>
              </template>
              <template v-else>
                暂无成员
              </template>
            </div>
          </van-cell>

          <van-cell title="上传凭证">
            <div class="image-list" v-if="finalEvidenceList.length > 0">
              <div v-for="(file, idx) in finalEvidenceList" :key="idx" class="image-item">
                <van-image
                    width="80"
                    height="80"
                    :src="file.File_Base64 "
                    @click="previewImage(file.File_Base64)"
                />
                <div class="upload-time">{{ file.Upload_Time_Formatted || '暂无时间' }}</div>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </div>
    </div>


    <!-- 空状态：当整个 stageList 为空时显示 -->
    <van-empty
        v-else
        description="暂无凭证提交"
        :image="noEvidenceImg"
        image-size="80"
        class="empty-placeholder"
    />
  </div>
</template>


<script>
import SensorRequest from "@/utils/SensorRequest"
import noEvidenceImg from '@/assets/智能办公.png'
import { ImagePreview } from "vant"

export default {
  name: "EvidenceDetail",
  props: {
    taskId: {
      type: [String, Number],
      required: false,
      default: null
    }
  },
  data() {
    return {
      // 如果没有传入 taskId，则尝试从 query 获取
      internalTaskId: this.taskId || "未知ID",
      taskData: {
        Task_Name: "",
        Project_Code: ""
      },
      stageList: [],
      finalEvidenceList: [],
      loading: false,
      error: false,
      participantNames: [] // 新增属性
    }
  },
  computed: {
    noEvidenceImg() {
      return noEvidenceImg
    }
  },
  mounted() {
    if (this.internalTaskId && this.internalTaskId !== "未知ID") {
      this.fetchTaskInfo()
    }

    console.log("🧾 mounted 中的 taskData:", this.taskData)
  },
  methods: {
    fetchTaskInfo() {
      this.loading = true
      this.error = false

      const param = {
        Id: this.internalTaskId
      }

      SensorRequest.GetTaskInfoByIDFun(
          JSON.stringify(param),
          (response) => {
            console.log("✅ 接口返回数据--查看凭证:", response)

            try {
              const task = JSON.parse(response) || {}
              console.log("📂 解析出的 data:", task)

              this.taskData = {
                Task_Name: task.Task_Name || "暂无数据",
                Project_Code: task.Project_Code || "暂无数据"
              }

              // 处理 Task_Evidence 数据
              const evidenceFiles = Array.isArray(task.Task_Evidence) ? task.Task_Evidence : [];

              this.finalEvidenceList = evidenceFiles.map(file => ({
                ...file,
                Upload_Time_Formatted: this.formatDate(file.Upload_Time)
              }));


              // 处理 Task_Participant 数据
              const participants = Array.isArray(task.Task_Participant) ? task.Task_Participant : [];
              this.participantNames = participants.map(participant => participant.Person_Name);



              const stageFiles = Array.isArray(task.Task_StageFile) ? task.Task_StageFile : []

              this.stageList = stageFiles.map(stage => {
                const formattedFiles = (Array.isArray(stage.TaskStage_Files) ? stage.TaskStage_Files : []).map(file => ({
                  ...file,
                  Upload_Time_Formatted: this.formatDate(file.Upload_Time)
                }))

                return {
                  StageFile_Creator:stage.StageFile_Creator.Person_Name,
                  TaskStageFile_Progress: stage.TaskStageFile_Progress || "0",
                  TaskStageFile_Remark: stage.TaskStageFile_Remark || "暂无备注",
                  TaskStage_Files: formattedFiles
                }
              })

              console.log("📦 最终赋值的 stageList:", this.stageList)

            } catch (e) {
              console.error("❌ 解析数据失败:", e)
              this.$toast.fail("数据解析失败")
              this.error = true
            }

            this.loading = false
          },
          (error) => {
            console.error("❌ 请求失败:", error)
            this.$toast.fail("网络请求失败")
            this.error = true
            this.loading = false
          }
      )
    },
    previewImage(base64) {
      if (!base64) {
        this.$toast("暂无图片可预览")
        return
      }

      ImagePreview([base64])
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }
  }
}
</script>



<style scoped>
.evidence-detail-page {
  background-color: #f8f8f8;
  padding: 16px;
}

.cell-content {
  text-align: right;
  color: #333;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* 调整间距 */
}

.progress-container {
  width: 100%;
  padding: 5px 0;
}


.image-item {
  text-align: center; /* 居中对齐 */
}

.van-image {
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.stage-card {
  margin-top: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  padding: 12px;
}

.upload-time {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}
</style>

