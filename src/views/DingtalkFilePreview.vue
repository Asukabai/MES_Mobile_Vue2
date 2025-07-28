<template>
  <div class="preview-container">
<!--    <van-nav-bar-->
<!--        :title="fileName"-->
<!--        left-text="返回"-->
<!--        left-arrow-->
<!--        @click-left="goBack"-->
<!--    />-->
    
    <div class="preview-content">
      <div v-if="loading" class="loading-container">
        <van-loading size="24px" vertical>文件加载中...</van-loading>
      </div>
      
      <div v-else-if="previewError" class="error-container">
        <van-icon name="warning-o" size="40" />
        <p class="error-text">{{ previewError }}</p>
        <van-button type="primary" @click="retryPreview">重试</van-button>
      </div>
      
      <div v-else-if="previewSuccess" class="success-container">
        <van-icon name="checked" size="40" color="#07c160" />
        <p class="success-text">文件已在钉钉中打开预览</p>
      </div>
      
      <div v-else class="info-container">
        <van-icon name="info-o" size="40" />
        <p class="info-text">即将使用钉钉文档预览功能打开文件</p>
        <van-button type="primary" @click="previewFile">开始预览</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as dd from 'dingtalk-jsapi';

export default {
  name: 'DingtalkFilePreview',
  data() {
    return {
      fileName: '',
      fileUrl: '',
      loading: false,
      previewError: '',
      previewSuccess: false
    };
  },
  
  mounted() {
    // 获取URL参数
    const encodedUrl = this.$route.query.url;
    const fileName = this.$route.query.fileName;
    
    if (!encodedUrl || !fileName) {
      this.previewError = '缺少文件信息，无法预览';
      return;
    }
    
    this.fileUrl = decodeURIComponent(encodedUrl);
    this.fileName = decodeURIComponent(fileName);
  },
  
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    
    async previewFile() {
      this.loading = true;
      this.previewError = '';
      this.previewSuccess = false;
      
      try {
        // 判断是否为图片文件
        const fileExt = this.getFileExtension(this.fileName).toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        
        if (imageExtensions.includes(fileExt)) {
          // 图片文件直接展示
          this.previewImage(this.fileUrl);
          return;
        }
        
        // 使用钉钉API下载文件到临时路径
        const downloadRes = await dd.downloadFile({
          url: this.fileUrl,
          header: { 'Content-Type': 'application/octet-stream' }
        });
        
        if (downloadRes && downloadRes.filePath) {
          // 调用钉钉API打开文档预览
          await dd.openDocument({
            filePath: downloadRes.filePath,
            fileType: fileExt,
            fileName: this.fileName
          });
          
          this.previewSuccess = true;
        } else {
          throw new Error('文件下载失败');
        }
      } catch (err) {
        console.error('预览失败:', err);
        this.previewError = this.formatErrorMessage(err);
      } finally {
        this.loading = false;
      }
    },
    
    previewImage(imageUrl) {
      this.previewSuccess = true;
      this.$nextTick(() => {
        const imgPreview = document.createElement('img');
        imgPreview.src = imageUrl;
        imgPreview.style.maxWidth = '100%';
        imgPreview.style.height = 'auto';
        document.querySelector('.success-container').appendChild(imgPreview);
      });
    },
    
    retryPreview() {
      this.previewFile();
    },
    
    getFileExtension(fileName) {
      return fileName.split('.').pop();
    },
    
    formatErrorMessage(error) {
      if (typeof error === 'string') {
        return error;
      }
      
      if (error.errMsg) {
        return error.errMsg;
      }
      
      if (error.message) {
        return error.message;
      }
      
      return '文件预览失败，请稍后重试';
    }
  }
};
</script>

<style scoped>
.preview-container {
  height: 100vh;
  background-color: #f5f5f5;
}

.preview-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 46px);
  padding: 20px;
}

.loading-container, .error-container, .success-container, .info-container {
  text-align: center;
  background: white;
  padding: 30px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.error-text, .success-text, .info-text {
  margin: 15px 0;
  font-size: 16px;
  color: #333;
}

.error-text {
  color: #ee0a24;
}

.success-text {
  color: #07c160;
}

.info-text {
  color: #666;
}
</style>