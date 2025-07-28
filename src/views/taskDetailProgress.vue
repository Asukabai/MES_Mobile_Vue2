<template>
  <div>
    <!-- 任务信息 -->
    <van-cell-group style="margin-top: 0;">
      <van-nav-bar title="任务过程提交表单" />
      <van-cell title="任务名称" :value="taskName" />
      <van-cell title="项目编号" :value="projectCode" />
    </van-cell-group>

    <!-- 新增：任务描述 -->
    <van-cell-group style="margin-top: 15px;">
      <van-cell title="任务描述">
        <template #default>
          <div class="task-description" v-if="taskDescriptionLines.length">
            <p v-for="(line, index) in taskDescriptionLines" :key="index">{{ line }}</p>
          </div>
          <div v-else style="color: #999;">暂无描述</div>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 新增：任务进度 -->
<!--    <van-cell title="任务进度">-->
<!--      <template #default>-->
<!--        <van-slider v-model="taskProgress" :min="0" :max="100" @change="onProgressChange" />-->
<!--      </template>-->
<!--    </van-cell>-->

<!--     修改：任务进度，显示当前百分比 -->
<!--    <van-cell title="任务进度">-->
<!--      <template #default>-->
<!--        <div style="display: flex; align-items: center;">-->
<!--          <van-slider v-model="taskProgress" :min="0" :max="99" @change="onProgressChange" />-->
<!--          <span style="margin-left: 10px;">{{ taskProgress }}%</span>-->
<!--        </div>-->
<!--      </template>-->
<!--    </van-cell>-->

<!--    <van-cell title="任务进度">-->
<!--      <template #default>-->
<!--        <div style="display: flex; align-items: center;">-->
<!--          <div class="slider-wrapper">-->
<!--            <van-slider v-model="taskProgress" :min="0" :max="99" :step="10" @change="onProgressChange" />-->
<!--            <div class="slider-ticks">-->
<!--              <span v-for="tick in 10" :key="tick" :style="{ left: `${(tick - 1) * 10}%` }">-->
<!--                {{ (tick - 1) * 10 }}%-->
<!--              </span>-->
<!--            </div>-->
<!--          </div>-->
<!--          <span style="margin-left: 10px;">{{ taskProgress }}%</span>-->
<!--        </div>-->
<!--      </template>-->
<!--    </van-cell>-->

<!--    <van-cell title="任务进度"></van-cell>-->

<!--    <van-cell :border="false" style="padding: 0 16px;">-->
<!--      <template #default>-->
<!--        <div style="display: flex; flex-direction: column; align-items: stretch;">-->
<!--          <van-slider-->
<!--              v-model="taskProgress"-->
<!--              :min="0"-->
<!--              :max="99"-->
<!--              :step="10"-->
<!--              @change="onProgressChange"-->
<!--              style="margin-top: 10px;"-->
<!--          />-->
<!--        </div>-->
<!--        <span v-for="tick in 10" :key="tick" :style="{ left: `${(tick - 1) * 10}%` }">-->
<!--      |-->
<!--    </span>-->
<!--      </template>-->
<!--    </van-cell>-->
<!--&lt;!&ndash;    <van-cell :border="false" style="text-align: right; padding-top: 8px;">&ndash;&gt;-->
<!--&lt;!&ndash;      <span>{{ taskProgress }}%</span>&ndash;&gt;-->
<!--&lt;!&ndash;    </van-cell>&ndash;&gt;-->


    <van-cell title="任务进度"></van-cell>

    <van-cell :border="false" style="padding: 0 16px;">
      <template #default>
        <div class="slider-wrapper">
          <van-slider
              v-model="taskProgress"
              :min="0"
              :max="99"
              :step="10"
              @change="onProgressChange"  style="transition: all 0.3s ease;"
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

    <!-- 新增：任务备注 -->
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


    <!-- 图片上传区域 -->
    <van-cell-group style="margin-top: 15px;">
      <van-cell title="上传凭证（一次性上传不得超过5张图片，暂不支持上传动态照片和视频）" />
      <van-uploader
          v-model="fileList"
          :after-read="onAfterRead"
          multiple
          :max-count="5"
          upload-text="上传图片"
          accept="image/*"
      />
    </van-cell-group>

    <!-- 提交按钮组 -->
    <div style="padding: 20px; display: flex; justify-content: space-between;">
      <van-button
          type="info"
          style="flex: 1; margin-right: 10px;"
          @click="submitEvidence"
          :disabled="isSubmitting"
      >
        {{ isSubmitting ? '处理中...' : '提交' }}
      </van-button>

      <van-button
          type="default"
          style="flex: 1; margin-left: 10px;"
          @click="resetForm"
          :disabled="isSubmitting"
      >
        取消
      </van-button>
    </div>

    <!-- 加载遮罩 -->
    <van-overlay :show="isSubmitting">
      <div class="loading-box">正在处理图片，请稍候...</div>
    </van-overlay>
  </div>
</template>

<script>
import SensorRequest from "@/utils/SensorRequest";
import {key_DingName, key_DingUserIndex, key_DingUserPhone} from "@/utils/Dingding";
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

      taskProgress: 0,     // 默认任务进度为 0%
      taskRemark: '',      // 默认备注为空
      fileList: [],         // van-uploader 文件列表
      evidenceList: [],     // 存储处理后的证据数据
      isSubmitting: false   // 是否正在提交中
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
      // 可以在这里做额外处理，例如触发自动保存等
    },
    onAfterRead(files) {
      console.log('【onAfterRead】开始处理文件:', files);

      if (Array.isArray(files)) {
        files.forEach(file => this.processSingleFile(file));
        return;
      }

      this.processSingleFile(files);
    },


    processSingleFile(file) {
      console.log('处理文件:', file);

      if (!file || !file.file || !(file.file instanceof File)) {
        console.warn('⚠️ 文件无效或不是 File 对象');
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const base64 = e.target.result;

        const md5 = this.generateSimpleMd5(base64);

        this.evidenceList.push({
          File_Name: file.file.name,
          File_Base64: base64,
          File_Md5: md5,
          Upload_Time: new Date().toISOString()
        });

        console.log('更新后的 evidenceList:', this.evidenceList);
        this.$nextTick(() => {
          console.log('🔄 数据已刷新');
        });
      };

      reader.onerror = () => {
        console.error('❌ 文件读取失败:', file.file.name);
        this.$toast.fail(`"${file.file.name}" 读取失败`);
      };

      reader.readAsDataURL(file.file);
    },

    async submitEvidence() {
      if (this.isSubmitting) {
        this.$toast('请勿重复提交');
        return;
      }

      if (this.fileList.length === 0) {
        this.$toast.fail('请至少上传一张图片');
        return;
      }

      if (this.evidenceList.length < this.fileList.length) {
        this.$toast('图片正在加载中，请稍等...');
        try {
          await this.waitForAllImagesLoaded();
        } catch (error) {
          this.$toast.fail('图片加载失败，请重试');
          this.isSubmitting = false;
          return;
        }
      }

      if (this.evidenceList.length === 0) {
        this.$toast.fail('请至少上传一张图片');
        return;
      }

      // 校验：任务进度必须大于 0%
      if (this.taskProgress <= 0) {
        this.$toast.fail('进度不能为0%，请滑动进度条后提交');
        return;
      }

      this.isSubmitting = true;
      const userInfo = getLocalUserInfo();
      // 模拟从缓存中读取的用户信息
      const creatorFromCache = {
        Person_Phone: userInfo.phone,
        Person_Name: userInfo.name,
        Person_DingID: userInfo.dingID,
        Person_Department: null
      };

      // 构造新的 payload 结构
      const payload = {
        Id: this.taskId,
        Task_StageFile: [
          {
            TaskStageFile_Progress: this.taskProgress.toString(),
            TaskStageFile_Remark: this.taskRemark || '暂无备注信息记录',
            TaskStage_Files: this.evidenceList.map(e => ({
              File_Name: e.File_Name,
              File_Md5: e.File_Md5,
              File_Base64: e.File_Base64, // 如果接口允许为空可设为 ''
              Upload_Time: e.Upload_Time
            })),
            StageFile_Creator: creatorFromCache
          }
        ]
      };

      console.log('📤 提交数据:', payload);

      try {
        await new Promise((resolve, reject) => {
          SensorRequest.TaskInfoStageFileAddFun(
              JSON.stringify(payload),
              resolve,
              (error) => reject(new Error(error.message))
          );
        });

        console.info('✅ 提交成功');
        this.$toast.success('提交成功');
        this.resetForm();
        // 新增：提交成功后延迟 1 秒跳转
        setTimeout(() => {
          this.$router.push('/sensor_ddingWork/Release/task');
        }, 1000);
      } catch (error) {
        console.error('❌ 提交失败:', error.message);
        this.$toast.fail('提交失败：' + error.message);
      } finally {
        this.isSubmitting = false;
      }
    },

    waitForAllImagesLoaded(timeout = 5000) {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const interval = setInterval(() => {
          if (this.evidenceList.length >= this.fileList.length) {
            clearInterval(interval);
            resolve();
          }

          if (Date.now() - startTime > timeout) {
            clearInterval(interval);
            reject(new Error('等待图片加载超时'));
          }
        }, 200);
      });
    },

    resetForm() {
      if (this.isSubmitting) {
        this.$toast('请勿操作，当前正在提交中');
        return;
      }

      this.evidenceList = [];
      this.fileList = [];
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
