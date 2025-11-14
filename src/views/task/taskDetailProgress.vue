<template>
  <div>
    <!-- 标题 -->
    <!--    <van-nav-bar title="任务过程提交表单" fixed />-->
    <!-- 所有表单内容的卡片 -->
    <div class="card-container" style="margin-top: 0px; padding-bottom: 20px;">
      <van-cell title="任务名称" :value="taskName" />
      <van-cell title="项目编号" :value="projectCode" />
      <van-cell title="任务描述">
        <template #default>
          <div class="task-description" v-if="taskDescriptionLines.length">
            <p v-for="(line, index) in taskDescriptionLines" :key="index">{{ line }}</p>
          </div>
          <div v-else style="color: #999;">暂无描述</div>
        </template>
      </van-cell>
      <!--滑块的最大值为 90%-->
      <van-cell title="任务进度"></van-cell>
      <van-cell :border="false" style="padding: 0 16px;">
        <template #default>
          <div class="slider-wrapper">
            <van-slider
                v-model="taskProgress"
                :min="-10"
                :max="90"
                :step="10"
                @change="onProgressChange"
                style="transition: all 0.3s ease;"
            />
            <div class="slider-ticks">
              <span v-for="tick in 10" :key="tick" :style="{ left: `${(tick - 1) * 10}%` }"></span>
            </div>
          </div>
        </template>
      </van-cell>
      <van-cell :border="false" style="text-align: right; padding-top: 8px;">
        <span>{{ taskProgress }}%</span>
      </van-cell>

      <van-cell title="任务备注">
        <template #default>
          <van-field
              v-model="taskRemark"
              rows="2"
              autosize
              type="textarea"
              maxlength="50"
              placeholder="请输入备注信息（最多50字，若无异常可仅上传凭证）"
              show-word-limit
          />
        </template>
      </van-cell>

      <van-cell title="上传凭证">
        <template #label>
          <span class="upload-note">支持点击图标上传任何格式文件，但总大小不得超过10M，文件总数不得超过5个</span>
        </template>
      </van-cell>
      <van-uploader
          v-model="fileList"
          :after-read="onAfterRead"
          multiple
          :max-count="5"
          upload-text="上传文件"
          accept="*"
      >
        <!-- 自定义上传区域内容 -->
        <div class="custom-upload-area">
          <img src="@/assets/custom-upload-icon2.png" alt="上传图标" style="width: 88px; height: 88px;" />
        </div>
      </van-uploader>

    </div>

    <!-- 提交按钮组 -->
    <div style="padding: 15px; display: flex; gap: 25px; justify-content: center; margin-top: 5px;">
      <van-button
          type="info"
          style="width: 40%; font-size: 14px; padding: 8px 20px; margin-right: 5px;"
          @click="submitEvidence"
          :disabled="isSubmitting"
      >
        {{ isSubmitting ? '处理中...' : '提交' }}
      </van-button>

      <van-button
          type="default"
          style="width: 40%; font-size: 14px; padding: 8px 20px; margin-left: 5px;"
          @click="cancelAndGoBack"
          :disabled="isSubmitting"
      >
        取消并返回
      </van-button>
    </div>

    <!-- 加载遮罩 -->
    <van-overlay :show="isSubmitting">
      <div class="loading-box">正在处理中，请稍候...</div>
    </van-overlay>
  </div>
</template>

<script>
import SensorRequest from "@/utils/SensorRequest";
import {
  departmentPrefix,
  key_DingName,
  key_DingUserIndex,
  key_DingUserPhone
} from "@/utils/Dingding";
import uploadUtils from "@/utils/uploadUtils"; // 引入上传工具

function getLocalUserInfo() {
  const name = localStorage.getItem(key_DingName);
  const phone = localStorage.getItem(key_DingUserPhone);
  const dingID = localStorage.getItem(key_DingUserIndex); // 使用 key_DingUserIndex 作为 DingID

  return {
    name: name || '',
    phone: phone || '',
    dingID: dingID || ''
  };
}

export default {
  data() {
    return {
      taskName: this.$route.query.taskName || '',
      projectCode: this.$route.query.projectCode || '',
      taskId: this.$route.query.Id || '',
      taskDescription: this.$route.query.taskDescription || '',
      taskProgress: 0,
      taskRemark: '',
      fileList: [],
      evidenceList: [],
      isSubmitting: false
    };
  },
  computed: {
    taskDescriptionLines() {
      return this.taskDescription ? this.taskDescription.split(/\r?\n/) : [];
    }
  },
  methods: {
    setProgress(value) {
      this.taskProgress = value;
      this.onProgressChange(value);
    },

    onProgressChange(value) {
      console.log('当前任务进度:', value + '%');
    },

    onAfterRead(files) {
      console.log('【onAfterRead】开始处理文件:', files);
      // 修改为使用二进制方式处理文件
      uploadUtils.processFilesBinary(files, 20 * 1024 * 1024)
          .then(list => {
            this.evidenceList = list;
            console.log('✅ 文件处理完成:', list);
          })
          .catch(error => {
            this.$toast.fail(error.message);
          });
    },

    async submitEvidence() {
      if (this.isSubmitting) {
        this.$toast('请勿重复提交');
        return;
      }

      if (this.fileList.length === 0) {
        this.$toast.fail('请至少上传一个文件');
        return;
      }

      if (this.evidenceList.length < this.fileList.length) {
        this.$toast('正在加载中，请稍等...');
        try {
          await uploadUtils.waitForAllImagesLoaded(this.evidenceList, this.fileList);
        } catch (error) {
          this.$toast.fail('加载失败，请重试');
          this.isSubmitting = false;
          return;
        }
      }

      if (this.evidenceList.length === 0) {
        this.$toast.fail('请至少上传一个文件');
        return;
      }

      if (this.taskProgress <= 0) {
        this.$toast.fail('进度不能为0%，请滑动进度条后提交');
        return;
      }

      this.isSubmitting = true;
      const userInfo = getLocalUserInfo();
      const creatorFromCache = {
        Person_Phone: userInfo.phone,
        Person_Name: userInfo.name,
        Person_DingID: userInfo.dingID,
        Person_Department: null
      };

      const payload = {
        Id: this.taskId,
        Task_StageFile: [
          {
            TaskStageFile_Progress: this.taskProgress.toString(),
            TaskStageFile_Remark: this.taskRemark || '暂无备注信息记录',
            TaskStage_Files: this.evidenceList.map(e => ({
              File_Name: e.File_Name,
              File_Md5: "",
              File_Base64: e.File_Base64 || "multipart/form-data", // 支持Base64和二进制
              // 添加二进制文件数据（如果存在）
              File_Blob: e.File_Blob || null,
              Upload_Time: e.Upload_Time
            })),
            StageFile_Creator: creatorFromCache
          }
        ]
      };

      try {
        await new Promise((resolve, reject) => {
          SensorRequest.TaskInfoStageFileAddFun(
              JSON.stringify(payload),
              resolve,
              (error) => reject(new Error(error.message))
          );
        });
        this.$toast.success('提交成功');
        uploadUtils.resetForm(this.fileList, this.evidenceList);
        setTimeout(() => {
          this.$router.push(`/${departmentPrefix}/task`);
        }, 1000);
      } catch (error) {
        this.$toast.fail('提交失败：' + error.message);
      } finally {
        this.isSubmitting = false;
      }
    },

    cancelAndGoBack() {
      if (this.isSubmitting) {
        this.$toast('请勿操作，当前正在提交中');
        return;
      }
      uploadUtils.resetForm(this.fileList, this.evidenceList);
      this.$router.go(-1);
    },

    generateSimpleMd5(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash).toString(16);
    }
  }
};
</script>

<style scoped>
.card-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 10px;
  padding: 10px;
}

.upload-note {
  font-size: 12px; /* 设置字体大小 */
  color: #999; /* 设置字体颜色为灰色 */
}

.loading-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 16px;
  text-align: center;
  padding: 20px;
}
.van-button--default {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
}
.slider-wrapper {
  position: relative;
  width: 100%;
  height: 15px; /* 给 wrapper 一个固定高度，便于定位 */
}

.van-slider {
  width: 100%;
  margin-top: 20px;
}

.van-slider__track {
  height: 12px;
  background-color: #e0e0e0;
  border-radius: 5px;
}

.van-slider__bar {
  height: 12px;
  background-color: #1989fa; /* 保持蓝色高亮 */
  border-radius: 5px;
}

.van-slider__button {
  width: 20px;
  height: 20px;
  background-color: #ffffff;
  border: 3px solid #1989fa;
  box-shadow: 0 2px 6px rgba(25, 137, 250, 0.4);
  transition: transform 0.2s ease-in-out;
}
.slider-ticks {
  position: absolute;
  top: 0; /* 改为 0，贴着进度条顶部 */
  left: 0;
  right: 0;
  height: 6px;
  pointer-events: none;
  z-index: 1; /* 提升层级，避免被滑块按钮遮挡 */
}

.slider-ticks span {
  position: absolute;
  bottom: 0;
  width: 1px;
  height: 6px;
  background-color: #999;
  opacity: 0.6; /* 添加透明度，使刻度线更柔和 */
  transform: translateX(-50%);
}
</style>