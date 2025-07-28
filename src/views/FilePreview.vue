<template>
  <div id="filePreview">
    <!-- 全局遮罩层 -->
    <div v-if="showGlobalLoading" class="global-overlay">
      <div class="loading-container">
        <van-loading type="spinner" size="24px">正在加载文件...</van-loading>
      </div>
    </div>

    <!-- 页面标题 -->
    <div class="top">{{ fileName }}</div>

    <!-- 加载状态 -->
    <div v-if="loading && !isText" class="loading-text">
      加载中... {{ loadedRatio * 100 | formatPercent }}
    </div>

    <!-- 文本类文件展示 -->
    <pre v-else-if="isText" class="text-content">{{ fileContent }}</pre>

    <!-- PDF 文件展示 -->
    <vue-office-pdf
        v-else-if="isPdf"
        :src="fileUrl"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="errorHandler"
    />

    <!-- Word 文件使用 vue-office 渲染 -->
    <vue-office-docx
        v-else-if="isWord"
        :src="fileUrl"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="errorHandler"
    />

    <!-- Excel 使用 vue-office-excel 渲染 -->
    <vue-office-excel
        v-else-if="isExcel"
        :src="fileUrl"
        :options="excelOptions"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="excelErrorHandler"
    />

    <!-- PPT 使用 vue-office-pptx 渲染 -->
    <vue-office-pptx
        v-else-if="isPpt"
        :src="fileUrl"
        class="vue-office-pptx"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="pptErrorHandler"
    />

    <!-- 图片文件展示 -->
    <img
        v-else-if="isImage"
        :src="fileUrl"
        alt="图片加载失败"
        class="image-preview"
        @load="renderedHandler"
        @error="imageErrorHandler"
    />

    <!-- 不支持的文件类型 -->
    <div v-else class="unsupported">
      当前不支持在线预览此文件类型：<br>
      <a :href="fileUrl" target="_blank">点击下载文件</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import VueOfficeDocx from '@vue-office/docx'
import VueOfficeExcel from '@vue-office/excel'
import VueOfficePptx from '@vue-office/pptx'
import VueOfficePdf from '@vue-office/pdf'
import '@vue-office/docx/lib/index.css'
import '@vue-office/excel/lib/index.css'

export default {
  name: 'FilePreview',
  components: {
    VueOfficeDocx,
    VueOfficeExcel,
    VueOfficePptx,
    VueOfficePdf
  },
  data() {
    return {
      fileName: '',
      fileUrl: '',
      fileContent: '',
      loadedRatio: 0,
      loading: true, // 默认为 true，保证一进入页面就显示加载状态
      showGlobalLoading: true, // 控制全局遮罩层
      excelOptions: {
        xls: false,
        minColLength: 0,
        minRowLength: 0,
        widthOffset: 10,
        heightOffset: 10,
        beforeTransformData: (workbookData) => {
          return workbookData
        },
        transformData: (workbookData) => {
          return workbookData
        }
      }
    }
  },
  computed: {
    fileExt() {
      const match = this.fileName.match(/\.([^.]+)$/i)
      return match ? match[1].toLowerCase() : ''
    },
    isText() {
      return ['txt', 'log', 'csv', 'json'].includes(this.fileExt)
    },
    isPdf() {
      return ['pdf'].includes(this.fileExt)
    },
    isWord() {
      return ['doc', 'docx'].includes(this.fileExt)
    },
    isExcel() {
      return ['xls', 'xlsx'].includes(this.fileExt)
    },
    isPpt() {
      return ['ppt', 'pptx'].includes(this.fileExt)
    },
    isImage() {
      return ['png', 'jpg', 'jpeg', 'gif'].includes(this.fileExt)
    }
  },
  mounted() {
    // 延迟执行 init，确保 DOM 渲染出遮罩层
    setTimeout(() => {
      this.init()
    }, 0)
  },
  methods: {
    async init() {
      // 优先从 query 获取 url
      const encodedUrl = this.$route.query.url

      if (encodedUrl) {
        this.fileUrl = decodeURIComponent(encodedUrl)
        this.fileName = this.getFileNameFromURL(this.fileUrl)
      } else {
        // 如果没有提供 url，则回退到原始逻辑（可选）
        this.fileName = decodeURIComponent(this.$route.params.filename || 'unknown')
        this.fileUrl = `https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/${this.fileName}`
      }

      if (this.isText) {
        await this.fetchTextContent()
      } else {
        this.loading = false
      }
    },
    // 从 URL 提取文件名
    getFileNameFromURL(url) {
      try {
        const urlObj = new URL(url)
        const path = urlObj.pathname
        return path.substring(path.lastIndexOf('/') + 1)
      } catch (e) {
        return url.split('/').pop()
      }
    },
    async fetchTextContent() {
      try {
        const response = await axios.get(this.fileUrl, {
          onDownloadProgress: (progressEvent) => {
            this.loadedRatio = progressEvent.loaded / progressEvent.total
          }
        })

        if (this.fileExt === 'json') {
          this.fileContent = JSON.stringify(response.data, null, 2)
        } else {
          this.fileContent = response.data
        }

        this.loading = false
        this.showGlobalLoading = false
      } catch (error) {
        console.error('加载文件失败:', error)
        this.fileContent = '无法加载文件内容，请稍后再试。'
        this.loading = false
        this.showGlobalLoading = false
      }
    },
    renderedHandler() {
      this.loading = false
      this.showGlobalLoading = false
    },
    errorHandler(error) {
      console.error("Pdf/Word 渲染失败:", error)
      this.loading = false
      this.showGlobalLoading = false
    },
    excelErrorHandler(error) {
      console.error("Excel 渲染失败:", error)
      this.loading = false
      this.showGlobalLoading = false
    },
    pptErrorHandler(error) {
      console.error("PPT 渲染失败:", error)
      this.loading = false
      this.showGlobalLoading = false
    },
    imageErrorHandler(error) {
      console.error("图片加载失败:", error)
      this.loading = false
      this.showGlobalLoading = false
    }
  },
  filters: {
    formatPercent(value) {
      return Math.floor(value * 100) + '%'
    }
  }
}
</script>

<style scoped>
#filePreview {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  min-height: 97vh;
}

.top {
  text-align: center;
  background-color: #c6dad157;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.text-content {
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 1rem;
  font-family: monospace;
  background-color: #f9f9f9;
  max-height: 80vh;
  overflow-y: auto;
}

.loading-text {
  color: #555;
  text-align: center;
  margin-top: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.unsupported {
  padding: 2rem;
  text-align: center;
  color: red;
  font-size: 1.2rem;
}

.image-preview {
  max-width: 100%;
  height: auto;
  margin: 2rem auto;
  display: block;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* 全局遮罩样式 */
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
}

.loading-container {
  text-align: center;
  font-size: 14px;
  color: #333;
}
</style>
