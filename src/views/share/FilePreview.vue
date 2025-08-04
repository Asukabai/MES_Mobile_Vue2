<!--<template>-->
<!--  <div id="filePreview">-->
<!--    &lt;!&ndash; 全局遮罩层 &ndash;&gt;-->
<!--    <div v-if="showGlobalLoading" class="global-overlay">-->
<!--      <div class="loading-container">-->
<!--        <van-loading type="spinner" size="24px">正在加载中...</van-loading>-->
<!--      </div>-->
<!--    </div>-->

<!--    &lt;!&ndash; 页面标题 &ndash;&gt;-->
<!--    <div class="top">{{ fileName }}</div>-->

<!--    &lt;!&ndash; 不支持的文件类型 &ndash;&gt;-->
<!--&lt;!&ndash;    <div v-if="!isSupportedType" class="unsupported">&ndash;&gt;-->
<!--&lt;!&ndash;      当前不支持在线预览此文件类型：<br>&ndash;&gt;-->
<!--&lt;!&ndash;      <a :href="fileUrl" target="_blank">点击下载文件</a>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->
<!--    &lt;!&ndash; 不支持的文件类型 &ndash;&gt;-->
<!--    <div v-if="!isSupportedType" class="unsupported">-->
<!--      当前不支持在线预览 <strong>.{{ fileExt }}</strong> 文件：<br>-->
<!--      <a href="#" @click.prevent="downloadFile">点击下载文件（暂不支持移动端点击下载，请移步PC版钉钉下载查看）</a>-->
<!--    </div>-->

<!--    &lt;!&ndash; 加载状态 &ndash;&gt;-->
<!--    <div v-else-if="loading && !isText" class="loading-text">-->
<!--      加载中... {{ loadedRatio * 100 | formatPercent }}-->
<!--    </div>-->

<!--    &lt;!&ndash; 文本类文件展示 &ndash;&gt;-->
<!--    <pre v-else-if="isText" class="text-content">{{ fileContent }}</pre>-->

<!--    &lt;!&ndash; PDF 文件展示 &ndash;&gt;-->
<!--    <vue-office-pdf-->
<!--        v-else-if="isPdf"-->
<!--        :src="fileUrl"-->
<!--        style="height: 100vh;"-->
<!--        @rendered="renderedHandler"-->
<!--        @error="errorHandler"-->
<!--    />-->

<!--    &lt;!&ndash; Word 文件使用 vue-office 渲染 &ndash;&gt;-->
<!--    <vue-office-docx-->
<!--        v-else-if="isWord"-->
<!--        :src="fileUrl"-->
<!--        style="height: 100vh;"-->
<!--        @rendered="renderedHandler"-->
<!--        @error="errorHandler"-->
<!--    />-->

<!--    &lt;!&ndash; Excel 使用 vue-office-excel 渲染 &ndash;&gt;-->
<!--    <vue-office-excel-->
<!--        v-else-if="isExcel"-->
<!--        :src="fileUrl"-->
<!--        :options="excelOptions"-->
<!--        style="height: 100vh;"-->
<!--        @rendered="renderedHandler"-->
<!--        @error="excelErrorHandler"-->
<!--    />-->

<!--    &lt;!&ndash; PPT 使用 vue-office-pptx 渲染 &ndash;&gt;-->
<!--    <vue-office-pptx-->
<!--        v-else-if="isPpt"-->
<!--        :src="fileUrl"-->
<!--        class="vue-office-pptx"-->
<!--        style="height: 100vh;"-->
<!--        @rendered="renderedHandler"-->
<!--        @error="pptErrorHandler"-->
<!--    />-->

<!--    &lt;!&ndash; 图片文件展示 &ndash;&gt;-->
<!--    <img-->
<!--        v-else-if="isImage"-->
<!--        :src="fileUrl"-->
<!--        alt="图片加载失败"-->
<!--        class="image-preview"-->
<!--        @load="renderedHandler"-->
<!--        @error="imageErrorHandler"-->
<!--    />-->
<!--    &lt;!&ndash; 视频文件展示 &ndash;&gt;-->
<!--    <video-->
<!--        v-else-if="isVideo"-->
<!--        :src="fileUrl"-->
<!--        controls-->
<!--        class="video-preview"-->
<!--        preload="auto"-->
<!--    webkit-playsinline-->
<!--    playsinline-->
<!--    @loadeddata="renderedHandler"-->
<!--    @error="videoErrorHandler"-->
<!--    >-->
<!--    您的浏览器不支持 video 标签。-->
<!--    </video>-->
<!--  </div>-->
<!--</template>-->


<!--<script>-->
<!--import axios from 'axios'-->
<!--import VueOfficeDocx from '@vue-office/docx'-->
<!--import VueOfficeExcel from '@vue-office/excel'-->
<!--import VueOfficePptx from '@vue-office/pptx'-->
<!--import VueOfficePdf from '@vue-office/pdf'-->
<!--import '@vue-office/docx/lib/index.css'-->
<!--import '@vue-office/excel/lib/index.css'-->

<!--export default {-->
<!--  name: 'FilePreview',-->
<!--  components: {-->
<!--    VueOfficeDocx,-->
<!--    VueOfficeExcel,-->
<!--    VueOfficePptx,-->
<!--    VueOfficePdf-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      downloading: false,-->
<!--      fileName: '',-->
<!--      fileUrl: '',-->
<!--      fileContent: '',-->
<!--      loadedRatio: 0,-->
<!--      loading: true, // 默认为 true，保证一进入页面就显示加载状态-->
<!--      showGlobalLoading: true, // 控制全局遮罩层-->
<!--      isSupportedType: false, // 新增标志位，标识是否是支持的文件类型-->
<!--      excelOptions: {-->
<!--        xls: false,-->
<!--        minColLength: 0,-->
<!--        minRowLength: 0,-->
<!--        widthOffset: 10,-->
<!--        heightOffset: 10,-->
<!--        beforeTransformData: (workbookData) => {-->
<!--          return workbookData-->
<!--        },-->
<!--        transformData: (workbookData) => {-->
<!--          return workbookData-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    fileExt() {-->
<!--      const match = this.fileName.match(/\.([^.]+)$/i)-->
<!--      return match ? match[1].toLowerCase() : ''-->
<!--    },-->
<!--    isText() {-->
<!--      return ['txt', 'log', 'csv', 'json'].includes(this.fileExt)-->
<!--    },-->
<!--    isPdf() {-->
<!--      return ['pdf'].includes(this.fileExt)-->
<!--    },-->
<!--    isWord() {-->
<!--      return ['docx'].includes(this.fileExt)-->
<!--    },-->
<!--    isExcel() {-->
<!--      return ['xls', 'xlsx'].includes(this.fileExt)-->
<!--    },-->
<!--    isPpt() {-->
<!--      return ['ppt', 'pptx'].includes(this.fileExt)-->
<!--    },-->
<!--    isImage() {-->
<!--      return ['png', 'jpg', 'jpeg', 'gif'].includes(this.fileExt)-->
<!--    },-->
<!--    isVideo() {-->
<!--      return ['mp4', 'webm', 'ogg'].includes(this.fileExt)-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    setTimeout(() => {-->
<!--      this.init()-->
<!--    }, 0)-->
<!--  },-->
<!--  methods: {-->
<!--    async downloadFile() {-->
<!--      if (!this.fileUrl) {-->
<!--        alert('文件地址为空，无法下载');-->
<!--        return;-->
<!--      }-->
<!--      if (this.downloading) return; // 防止重复点击-->
<!--      this.downloading = true;-->
<!--      this.showGlobalLoading = true;-->

<!--      const fileName = this.fileName || this.getFileNameFromURL(this.fileUrl);-->

<!--      // 🔁 开始加载提示-->
<!--      this.showGlobalLoading = true;-->

<!--      try {-->
<!--        // 获取文件内容-->
<!--        const response = await axios.get(this.fileUrl, {-->
<!--          responseType: 'blob',-->
<!--          onDownloadProgress: (progressEvent) => {-->
<!--            this.loadedRatio = progressEvent.loaded / progressEvent.total;-->
<!--          }-->
<!--        });-->

<!--        // 创建临时链接-->
<!--        const blob = new Blob([response.data]);-->
<!--        const downloadUrl = window.URL.createObjectURL(blob);-->

<!--        // 创建 a 标签模拟点击下载-->
<!--        const link = document.createElement('a');-->
<!--        link.href = downloadUrl;-->
<!--        link.setAttribute('download', fileName); // 设置下载文件名-->
<!--        document.body.appendChild(link);-->
<!--        link.click();-->

<!--        // 清理-->
<!--        link.remove();-->
<!--        window.URL.revokeObjectURL(downloadUrl);-->

<!--      } catch (error) {-->
<!--        console.error('文件下载失败:', error);-->
<!--        alert('文件下载失败，请重试');-->
<!--      } finally {-->
<!--        // ✅ 隐藏加载提示-->
<!--        this.showGlobalLoading = false;-->
<!--        this.downloading = false;-->
<!--      }-->
<!--    },-->
<!--    async init() {-->
<!--      const encodedUrl = this.$route.query.url-->
<!--      const fileNameFromQuery = this.$route.query.fileName-->

<!--      if (!encodedUrl) {-->
<!--        this.showGlobalLoading = false-->
<!--        alert('文件信息不全，无法预览！')-->
<!--        return-->
<!--      }-->

<!--      this.fileUrl = decodeURIComponent(encodedUrl)-->

<!--      if (fileNameFromQuery) {-->
<!--        this.fileName = decodeURIComponent(fileNameFromQuery)-->
<!--      } else {-->
<!--        this.fileName = this.getFileNameFromURL(this.fileUrl)-->
<!--      }-->

<!--      // 判断是否是支持的文件类型-->
<!--      const allowedExtensions = ['docx', 'xlsx', 'pptx', 'pdf', 'txt', 'jpg', 'jpeg', 'png','mp4', 'webm', 'ogg']-->
<!--      const fileExt = this.fileName.split('.').pop().toLowerCase()-->

<!--      if (!allowedExtensions.includes(fileExt)) {-->
<!--        this.isSupportedType = false-->
<!--        this.loading = false-->
<!--        this.showGlobalLoading = false-->
<!--        return-->
<!--      }-->

<!--      this.isSupportedType = true-->

<!--      if (this.isText) {-->
<!--        await this.fetchTextContent()-->
<!--      } else {-->
<!--        this.loading = false-->
<!--      }-->
<!--    },-->
<!--    getFileNameFromURL(url) {-->
<!--      try {-->
<!--        const urlObj = new URL(url)-->
<!--        const path = urlObj.pathname-->
<!--        return path.substring(path.lastIndexOf('/') + 1)-->
<!--      } catch (e) {-->
<!--        return url.split('/').pop()-->
<!--      }-->
<!--    },-->
<!--    async fetchTextContent() {-->
<!--      try {-->
<!--        const response = await axios.get(this.fileUrl, {-->
<!--          onDownloadProgress: (progressEvent) => {-->
<!--            this.loadedRatio = progressEvent.loaded / progressEvent.total-->
<!--          }-->
<!--        })-->

<!--        if (this.fileExt === 'json') {-->
<!--          this.fileContent = JSON.stringify(response.data, null, 2)-->
<!--        } else {-->
<!--          this.fileContent = response.data-->
<!--        }-->

<!--        this.loading = false-->
<!--        this.showGlobalLoading = false-->
<!--      } catch (error) {-->
<!--        console.error('加载文件失败:', error)-->
<!--        this.fileContent = '无法加载文件内容，请稍后再试。'-->
<!--        this.loading = false-->
<!--        this.showGlobalLoading = false-->
<!--      }-->
<!--    },-->
<!--    renderedHandler() {-->
<!--      this.loading = false-->
<!--      this.showGlobalLoading = false-->
<!--    },-->
<!--    errorHandler(error) {-->
<!--      console.error("Pdf/Word 渲染失败:", error)-->
<!--      this.loading = false-->
<!--      this.showGlobalLoading = false-->
<!--    },-->
<!--    excelErrorHandler(error) {-->
<!--      console.error("Excel 渲染失败:", error)-->
<!--      this.loading = false-->
<!--      this.showGlobalLoading = false-->
<!--    },-->
<!--    pptErrorHandler(error) {-->
<!--      console.error("PPT 渲染失败:", error)-->
<!--      this.loading = false-->
<!--      this.showGlobalLoading = false-->
<!--    },-->
<!--    imageErrorHandler(error) {-->
<!--      console.error("图片加载失败:", error)-->
<!--      this.loading = false-->
<!--      this.showGlobalLoading = false-->
<!--    },-->
<!--    videoErrorHandler(error) {-->
<!--      console.error("视频加载失败:", error)-->
<!--      this.loading = false-->
<!--      this.showGlobalLoading = false-->
<!--      // alert('视频加载失败，请检查文件格式是否为MP4或网络状态是否稳定')-->
<!--      alert('移动端视频组件渲染失败，请移步PC端预览视频')-->
<!--    }-->
<!--  },-->
<!--  filters: {-->
<!--    formatPercent(value) {-->
<!--      return Math.floor(value * 100) + '%'-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->


<!--<style scoped>-->
<!--#filePreview {-->
<!--  font-family: Avenir, Helvetica, Arial, sans-serif;-->
<!--  width: 100%;-->
<!--  margin: 0 auto;-->
<!--  overflow: hidden;-->
<!--  min-height: 97vh;-->
<!--}-->

<!--.top {-->
<!--  text-align: center;-->
<!--  background-color: #c6dad157;-->
<!--  padding: 1rem;-->
<!--  font-size: 1.5rem;-->
<!--  font-weight: bold;-->
<!--}-->

<!--.text-content {-->
<!--  white-space: pre-wrap;-->
<!--  word-wrap: break-word;-->
<!--  padding: 1rem;-->
<!--  font-family: monospace;-->
<!--  background-color: #f9f9f9;-->
<!--  max-height: 80vh;-->
<!--  overflow-y: auto;-->
<!--}-->

<!--.loading-text {-->
<!--  color: #555;-->
<!--  text-align: center;-->
<!--  margin-top: 2rem;-->
<!--  font-size: 1.2rem;-->
<!--  font-weight: bold;-->
<!--}-->

<!--.unsupported {-->
<!--  padding: 2rem;-->
<!--  text-align: center;-->
<!--  color: red;-->
<!--  font-size: 1.2rem;-->
<!--}-->

<!--.image-preview {-->
<!--  max-width: 100%;-->
<!--  height: auto;-->
<!--  margin: 2rem auto;-->
<!--  display: block;-->
<!--  border: 1px solid #ddd;-->
<!--  border-radius: 4px;-->
<!--  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);-->
<!--}-->

<!--/* 全局遮罩样式 */-->
<!--.global-overlay {-->
<!--  position: fixed;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  background-color: rgba(255, 255, 255, 0.9);-->
<!--  z-index: 9999;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--}-->

<!--.loading-container {-->
<!--  text-align: center;-->
<!--  font-size: 14px;-->
<!--  color: #333;-->
<!--}-->
<!--</style>-->
<template>
  <div id="filePreview">
    <!-- 全局遮罩层 -->
    <div v-if="showGlobalLoading" class="global-overlay">
      <div class="loading-container">
        <van-loading type="spinner" size="24px">正在加载中...</van-loading>
      </div>
    </div>

    <!-- 页面标题 -->
    <div class="top">{{ fileName }}</div>

    <!-- 不支持的文件类型 -->
<!--    <div v-if="!isSupportedType" class="unsupported">-->
<!--      当前不支持在线预览 <strong>.{{ fileExt }}</strong> 文件：<br>-->
<!--      <a href="#" @click.prevent="downloadFile">点击下载文件（暂不支持移动端点击下载，请移步PC版钉钉下载查看）</a>-->
<!--    </div>-->
    <!-- 不支持的文件类型 -->
    <div v-if="!isSupportedType" class="unsupported">
      当前不支持在线预览 <strong>.{{ fileExt }}</strong> 文件：<br>

      <template v-if="isMobile()">
        <!-- 移动端：直接使用 a 标签触发浏览器下载 -->
        <a :href="fileUrl"
           :download="$route.query.fileName || '未命名文件'"
           target="_blank">
          移动端请点击该链接<br>跳转至浏览器下载文件<br>(下载后需自定义文件名和文件后缀)
          <br>或请移步PC端钉钉进入小程序下载
        </a>
      </template>

      <template v-else>
        <!-- PC 端：继续使用 Blob 下载方式 -->
        <a href="#" @click.prevent="downloadFile">点击下载文件（PC版钉钉下载，支持进度弹窗显示）</a>
      </template>
    </div>


    <!-- 加载状态 -->
    <div v-else-if="loading && !isText" class="loading-text">
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

    <!-- 视频文件展示 -->
    <video
        v-else-if="isVideo"
        :src="fileUrl"
        controls
        class="video-preview"
        preload="auto"
        webkit-playsinline
        playsinline
        @loadeddata="renderedHandler"
        @error="videoErrorHandler"
    >
      您的浏览器不支持 video 标签。
    </video>

    <!-- 下载任务面板 -->
    <div v-if="$downloadManager && $downloadManager.tasks">
      <download-panel
          :tasks="$downloadManager.tasks"
          :visible.sync="panelVisible"
          :minimized.sync="panelMinimized"
      />
    </div>
    <div v-else>
      <p>没有任务</p>
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
import Vue from "vue";

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
      downloading: false,
      fileName: '',
      fileUrl: '',
      fileContent: '',
      loadedRatio: 0,
      loading: true, // 默认为 true，保证一进入页面就显示加载状态
      showGlobalLoading: true, // 控制全局遮罩层
      isSupportedType: false, // 新增标志位，标识是否是支持的文件类型
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
      },
      panelVisible: false,
      panelMinimized: false
    }
  },
  computed: {
    fileExt() {
      const match = this.fileName.match(/\.([^.]+)$/i)
      const ext = match ? match[1].toLowerCase() : ''
      console.log('📄 解析文件后缀:', ext)
      return ext
    },
    isText() {
      const result = ['txt', 'log', 'csv', 'json'].includes(this.fileExt)
      console.log('📝 isText:', result)
      return result
    },
    isPdf() {
      const result = ['pdf'].includes(this.fileExt)
      console.log('📕 isPdf:', result)
      return result
    },
    isWord() {
      const result = ['docx'].includes(this.fileExt)
      console.log('📘 isWord:', result)
      return result
    },
    isExcel() {
      const result = ['xls', 'xlsx'].includes(this.fileExt)
      console.log('📊 isExcel:', result)
      return result
    },
    isPpt() {
      return ['ppt', 'pptx'].includes(this.fileExt)
    },
    isImage() {
      const result = ['png', 'jpg', 'jpeg', 'gif'].includes(this.fileExt)
      console.log('🖼️ isImage:', result)
      return result
    },
    isVideo() {
      const result = ['mp4', 'webm', 'ogg'].includes(this.fileExt)
      console.log('🎥 isVideo:', result)
      return result
    }
  },
  mounted() {
    setTimeout(() => {
      this.init()
    }, 0)

    // 调试插件是否挂载成功
    console.log('Vue.prototype.$downloadManager:', Vue.prototype.$downloadManager)
    console.log('this.$downloadManager:', this.$downloadManager)
  },
  watch: {
    panelVisible(newVal) {
      console.log('🔔 panelVisible 变化:', newVal)
    },
    panelMinimized(newVal) {
      console.log('🗕 panelMinimized 变化:', newVal)
    },
    '$downloadManager.tasks': {
      // handler(tasks) {
      //   console.group('📋 下载任务更新')
      //   tasks.forEach(task => {
      //     console.log(`ID: ${task.id} | 文件名: ${task.fileName} | 状态: ${task.status} | 进度: ${task.progress}%`)
      //   })
      //   console.groupEnd()
      // },
      // deep: true
      handler(tasks) {
        if (tasks && tasks.length > 0) {
          this.panelVisible = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    isMobile() {
      return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    },
    async downloadFile() {

      console.group('【开始下载文件】')
      console.log('文件地址:', this.fileUrl)
      console.log('文件名:', this.fileName)

      if (!this.fileUrl) {
        alert('文件地址为空，无法下载');
        console.warn('❌ 文件地址为空')
        console.groupEnd()
        return
      }
      if (this.downloading){
        console.log('🚫 正在下载中，防止重复点击')
        console.groupEnd()
        return
      }
      this.downloading = true

      const taskId = 'file-download-' + Date.now()
      const fileName = this.fileName || this.getFileNameFromURL(this.fileUrl)

      console.log('生成的 taskId:', taskId)
      console.log('准备调用下载管理器:', this.$downloadManager)

      this.$downloadManager.addDownloadTask(taskId, fileName)

      try {

        console.log('✅ 开始请求下载:', this.fileUrl)

        const response = await axios.get(this.fileUrl, {
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            const percent = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
            console.log(`📥 下载进度 ${percent}%`, progressEvent)
            this.$downloadManager.updateDownloadTask(taskId, `下载中 ${percent}%`, percent)
          }
        })
        console.log('📦 下载完成，Blob 已创建')
        console.log('Blob 数据大小:', response.data.size)

        const blob = new Blob([response.data])
        const downloadUrl = window.URL.createObjectURL(blob)
        console.log('🔗 创建临时下载链接:', downloadUrl)

        const link = document.createElement('a')
        link.href = downloadUrl
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        console.log('🖱️ 模拟点击下载')

        window.URL.revokeObjectURL(downloadUrl)
        link.remove()
        console.log('🧹 清理临时资源')
        this.$downloadManager.finishDownloadTask(taskId)

      } catch (error) {
        console.error('文件下载失败:', error)
        this.$downloadManager.finishDownloadTask(taskId, '下载失败，请重试')
      } finally {
        this.downloading = false
        console.log('🔚 下载结束')
        console.groupEnd()
      }
    },
    async init() {

      console.group('【FilePreview 初始化】')
      console.log('原始 URL:', this.$route.query.url)
      console.log('原始文件名:', this.$route.query.fileName)

      const encodedUrl = this.$route.query.url
      const fileNameFromQuery = this.$route.query.fileName

      if (!encodedUrl) {
        console.warn('⚠️ 缺少文件地址，无法预览！')
        this.showGlobalLoading = false
        alert('文件信息不全，无法预览！')
        console.groupEnd()
        return
      }

      this.fileUrl = decodeURIComponent(encodedUrl)
      console.log('解码后的 fileUrl:', this.fileUrl)

      if (fileNameFromQuery) {
        this.fileName = decodeURIComponent(fileNameFromQuery)
      } else {
        this.fileName = this.getFileNameFromURL(this.fileUrl) || 'unknown-file'
      }
      console.log('解析出的文件名:', this.fileName)

      // 判断是否是支持的文件类型
      const allowedExtensions = ['docx', 'xlsx', 'pptx', 'pdf', 'txt', 'jpg', 'jpeg', 'png','mp4', 'webm', 'ogg']
      const fileExt = this.fileName.split('.').pop().toLowerCase()

      console.log('文件后缀:', fileExt)
      console.log('是否支持类型:', allowedExtensions.includes(fileExt))
      console.groupEnd()

      if (!allowedExtensions.includes(fileExt)) {
        this.isSupportedType = false
        this.loading = false
        this.showGlobalLoading = false
        return
      }

      this.isSupportedType = true

      if (this.isText) {
        await this.fetchTextContent()
      } else {
        this.loading = false
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
    },
    videoErrorHandler(error) {
      console.error("视频加载失败:", error)
      this.loading = false
      this.showGlobalLoading = false
      // alert('视频加载失败，请检查文件格式是否为MP4或网络状态是否稳定')
      alert('移动端视频组件渲染失败，请移步PC端预览视频')
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
