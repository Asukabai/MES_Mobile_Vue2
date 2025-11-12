<template>
  <div>
    <!-- 任务信息 -->
    <van-cell-group style="margin-top: 46px;">
      <van-nav-bar title="任务详情" />
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

    <!-- 提交按钮 -->
    <div style="padding: 20px;">
      <van-button type="primary" block @click="submitEvidence" :disabled="isSubmitting">
        {{ isSubmitting ? '处理中...' : '提交' }}
      </van-button>
    </div>

    <!-- 加载遮罩 -->
    <van-overlay :show="isSubmitting">
      <div class="loading-box">正在处理图片，请稍候...</div>
    </van-overlay>
  </div>
</template>


<script>
import SensorRequest from '@/utils/SensorRequest.js';

export default {
  data() {
    return {
      taskName: this.$route.query.taskName || '',
      projectCode: this.$route.query.projectCode || '',
      taskId: this.$route.query.Id || '',
      taskDescription: this.$route.query.taskDescription || '',

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

      this.isSubmitting = true;
      const payload = {
        Id: this.taskId,
        Task_Evidence: this.evidenceList,
        Task_FinishTime: new Date().toISOString(),
        Task_Status: "已完成"
      };

      console.log('📤 提交数据:', payload);

      try {
        await new Promise((resolve, reject) => {
          SensorRequest.TaskFinishUpdateFun(
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
          this.$router.push('/task-manage');
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
      this.evidenceList = [];
      this.fileList = [];
      this.isSubmitting = false;
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
</style>
