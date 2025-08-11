<template>
  <div class="post-detail-page">
    <div class="post-content" v-if="post">
      <van-cell-group>
        <van-cell title="问题名称" :value="post.Error_Name || '未提供'" />
        <van-cell title="错误代码" :value="post.Error_Code || '未提供'" />
        <van-cell title="问题类型" :value="post.Error_Type || '未分类'" />
        <van-cell title="创建时间" :value="formatDate(post.Ts_create)" />
        <van-cell title="更新时间" :value="formatDate(post.Ts_edit)" />
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-cell title="问题描述" />
        <van-cell>
          <div class="description-content">
            {{ post.Error_Description || '暂无描述' }}
          </div>
        </van-cell>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;" v-if="post.Error_Particulars && post.Error_Particulars.length > 0">
        <van-cell title="详细信息" />
        <van-cell v-for="(particular, index) in post.Error_Particulars" :key="index">
          <div class="particular-content">
            {{ particular.Error_Message || particular }}
          </div>
        </van-cell>
      </van-cell-group>


      <!-- 移除了原来的单个文件单元格，改为更详细的文件信息展示-->

      <van-cell-group style="margin-top: 10px;" v-if="post.Error_Solution && post.Error_Solution.length > 0">
        <van-cell title="解决方案文件" />
        <van-cell v-for="(solution, index) in post.Error_Solution" :key="index">
          <div class="file-item">
            <div class="file-info">
              <div class="file-name">{{ solution.File_Name }}</div>
              <div class="file-meta">
                <span class="upload-time" v-if="solution.Upload_Time">上传时间: {{ formatDate(solution.Upload_Time) }}</span>
              </div>
            </div>
            <div class="file-actions">
              <van-button
                  size="small"
                  type="info"
                  class="action-button download-button"
                  @click="handleDownload(solution)"
              >
                <img :src="keyIcon" alt="key" class="button-icon" />
                下载
              </van-button>
              <van-button
                  size="small"
                  type="info"
                  class="action-button preview-button"
                  @click="handlePreview(solution)"
              >
                <img :src="keyIconView" alt="key" class="button-icon1" />
                预览
              </van-button>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </div>

    <div v-else class="loading-container">
      <van-loading size="24px">加载中...</van-loading>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup, Loading, Toast, Button } from 'vant'
import { downloadFile, previewFile } from '@/utils/fileUtils'

export default {
  name: 'PostDetail',
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup,
    VanLoading: Loading,
    VanButton: Button
  },
  data() {
    return {
      post: null,
      keyIcon: require('@/assets/download.png'),
      keyIconView: require('@/assets/scan-4.png')
    }
  },
  created() {
    this.loadPostDetail()
  },
  methods: {
    loadPostDetail() {
      // 从路由查询参数中获取帖子数据
      const postData = this.$route.query.data

      if (postData) {
        try {
          this.post = JSON.parse(postData)
        } catch (e) {
          console.error('解析帖子数据失败:', e)
          Toast.fail('数据解析失败')
        }
      }
    },
    formatDate(dateString) {
      if (!dateString) return '未知时间'
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
    },
    handleDownload(file) {
      downloadFile(file)
    },
    handlePreview(file) {
      previewFile(file)
    }
  }
}
</script>

<style scoped>
.post-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.description-content,
.particular-content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #999999;
}

.file-item {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.file-info {
  margin-bottom: 10px;
}

.file-name {
  font-weight: bold;
  font-size: 14px;
  color: #999999;
  margin-bottom: 5px;
}

.file-meta {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #999;
}

.file-meta span {
  margin-bottom: 3px;
}

.file-actions {
  display: flex;
  justify-content: flex-end;
}

.action-button {
  margin-left: 10px;
}

.download-button {
  background-color: #3f83f8;
  border-color: #3f83f8;
}

.preview-button {
  background-color: #3f83f8;
  border-color: #3f83f8;
}

.button-icon {
  width: 17px;
  height: 17px;
  vertical-align: middle;
  margin-right: 2px;
}

.button-icon1 {
  width: 15px;
  height: 15px;
  vertical-align: middle;
  margin-right: 4px;
}
</style>
