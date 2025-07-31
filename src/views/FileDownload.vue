<template>
  <div class="download-container">
    <div>
      <template v-if="isMobile()">
        <!-- 移动端：直接使用 a 标签触发浏览器下载 -->
        <a :href="fileUrl"
           :download="fileName || '未命名文件'"
           target="_blank">
          移动端请点击该链接<br>跳转至浏览器下载文件<br>(下载后需自定义文件名和文件后缀)<br>
          或请移步PC端钉钉进入小程序下载
        </a>
      </template>
      <template v-else>
        <!-- PC 端：继续使用 Blob 下载方式 -->
        <a href="#" @click.prevent="downloadFile">（PC版钉钉下载，支持进度弹窗显示）</a>
      </template>
    </div>

    <!-- 全局遮罩层 -->
    <div v-if="showGlobalLoading && isSupportedFileType" class="global-overlay">
      <div class="loading-container">
        <van-loading type="spinner" size="24px">{{ downloadStatus }}</van-loading>
        <p>{{ downloadStatus }}</p>
      </div>
    </div>

    <!-- 下载面板 -->
    <div v-if="downloadProgress >= 0 && isSupportedFileType" class="progress-bar">
      <van-progress :percentage="downloadProgress" :show-pivot="false" />
      <p>已下载：{{ downloadProgress }}%</p>
    </div>

    <!-- 下载完成 -->
    <div v-if="downloadComplete && isSupportedFileType" class="download-complete">
      <p>✅ 下载已完成</p>
      <a :href="downloadLink" :download="fileName" target="_blank">点击下载文件</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'FileDownload',
  data() {
    return {
      downloading: false,
      showGlobalLoading: true,
      downloadStatus: '准备下载...',
      downloadProgress: -1,
      downloadComplete: false,
      downloadLink: null,
      fileName: '',
      fileUrl: '',
      isSupportedFileType: true
    }
  },
  mounted() {
    this.initDownload()
  },
  methods: {
    isMobile() {
      return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    },
    async initDownload() {
      const encodedUrl = this.$route.query.fileUrl
      const fileNameFromQuery = this.$route.query.fileName

      if (!encodedUrl) {
        alert('文件地址为空，无法下载')
        this.showGlobalLoading = false
        return
      }
      this.fileUrl = decodeURIComponent(encodedUrl)
      // alert("URL :"+this.fileUrl)
      this.fileName = fileNameFromQuery
          ? decodeURIComponent(fileNameFromQuery)
          : this.getFileNameFromURL(this.fileUrl)

      // 移动端直接使用 <a> 标签下载
      if (this.isMobile()) {
        this.showGlobalLoading = true
        this.downloadStatus = '准备下载...'
        try {
            const downloadLink = document.createElement('a')
            downloadLink.href = this.fileUrl
            downloadLink.textContent = `点击下载 ${this.fileName}`
            downloadLink.setAttribute('download', this.fileName)
            downloadLink.style.display = 'none'
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
          // ✅ 强制跳转浏览器下载
          // window.location.href = this.fileUrl
        } catch (error) {
          alert('文件下载失败，请检查网络')
          console.error('移动端下载失败:', error)
        } finally {
          this.showGlobalLoading = false
        }
        return
      }

      // PC 端走 Blob 下载 + 下载管理器
      const taskId = 'file-download-' + Date.now()

      try {
        this.$downloadManager.addDownloadTask(taskId, this.fileName)
        const response = await axios.get(this.fileUrl, {
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            const percent = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
            this.downloadProgress = percent
            this.downloadStatus = `下载中 ${percent}%`
            this.$downloadManager.updateDownloadTask(taskId, `下载中 ${percent}%`, percent)
          }
        })
        const blob = new Blob([response.data])
        const downloadUrl = window.URL.createObjectURL(blob)
        this.downloadLink = downloadUrl
        const link = document.createElement('a')
        link.href = downloadUrl
        link.setAttribute('download', this.fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.downloadComplete = true
        this.$downloadManager.finishDownloadTask(taskId)
      } catch (error) {
        console.error('文件下载失败:', error)
        this.$downloadManager.finishDownloadTask(taskId, '下载失败，请重试')
        alert('文件下载失败，请检查网络或稍后再试')
      } finally {
        this.showGlobalLoading = false
        this.downloading = false
        window.URL.revokeObjectURL(this.downloadLink)
      }
    },
    getFileNameFromURL(url) {
      try {
        const urlObj = new URL(url)
        const path = urlObj.pathname
        return path.substring(path.lastIndexOf('/') + 1)
      } catch (e) {
        return url.split('/').pop()
      }
    },
    async downloadFile() {
      const taskId = 'file-download-' + Date.now()
      this.$downloadManager.addDownloadTask(taskId, this.fileName)

      try {
        const response = await axios.get(this.fileUrl, {
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            const percent = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
            this.downloadProgress = percent
            this.downloadStatus = `下载中 ${percent}%`
            this.$downloadManager.updateDownloadTask(taskId, `下载中 ${percent}%`, percent)
          }
        })

        const blob = new Blob([response.data])
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.setAttribute('download', this.fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)

        this.downloadComplete = true
        this.downloadProgress = 100
        this.downloadStatus = '下载完成'
        this.$downloadManager.finishDownloadTask(taskId)
      } catch (error) {
        console.error('文件下载失败:', error)
        this.$downloadManager.finishDownloadTask(taskId, '下载失败，请重试')
        alert('文件下载失败，请检查网络或稍后再试')
      } finally {
        this.showGlobalLoading = false
      }
    }
  }
}
</script>

<style scoped>
.download-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.global-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.loading-container p {
  margin-top: 1rem;
  font-size: 16px;
  color: #333;
}

.progress-bar {
  margin-top: 2rem;
  width: 80%;
  margin-left: 10%;
}

.download-complete {
  margin-top: 2rem;
  text-align: center;
}

.download-complete a {
  color: #07c160;
  font-weight: bold;
  display: inline-block;
  margin-top: 1rem;
}

.unsupported {
  padding: 2rem;
  text-align: center;
  color: red;
  font-size: 1.2rem;
}
</style>
