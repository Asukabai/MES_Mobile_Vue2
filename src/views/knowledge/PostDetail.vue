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

      <van-cell-group style="margin-top: 10px;" v-if="post.Error_Solution && post.Error_Solution.length > 0">
        <van-cell title="解决方案文件" />
        <van-cell
            v-for="(solution, index) in post.Error_Solution"
            :key="index"
            :title="solution.File_Name"
            is-link
            @click="downloadFile(solution)"
        >
          <template #right-icon>
            <van-icon name="arrow" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div v-else class="loading-container">
      <van-loading size="24px">加载中...</van-loading>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup, Icon, Loading, Toast } from 'vant'

export default {
  name: 'PostDetail',
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup,
    VanIcon: Icon,
    VanLoading: Loading
  },
  data() {
    return {
      post: null
    }
  },
  created() {
    this.loadPostDetail()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    loadPostDetail() {
      // 从路由参数中获取帖子ID
      // eslint-disable-next-line no-unused-vars
      const postId = this.$route.params.id

      // 实际项目中需要通过API获取数据
      // 示例代码：
      /*
      SensorRequest.getErrorDetail(postId, (respData) => {
        this.post = JSON.parse(respData)
      }, (errorMsg) => {
        Toast.fail('获取详情失败: ' + errorMsg)
      })
      */

      // 模拟数据用于演示
      this.post = {
        "Error_Name": "ERP与MES数据同步失败",
        "Error_Code": null,
        "Error_Type": "其他",
        "Error_Description": "MES系统未能将生产订单数据同步至ERP系统，导致库存数据不一致。",
        "Error_Creator": null,
        "Error_Particulars": [],
        "Error_Solution": [
          {
            "File_Name": "模块流程图对应mermaid代码.txt",
            "File_Md5": "62cefc3d4e903725e2852e1868dfd443",
            "File_Base64": "",
            "Upload_Time": "2025-07-16T09:39:11.837Z"
          }
        ],
        "Error_Keyword": null,
        "Id": "6891da77f70ab43e1786fcd7",
        "Uuid": "1402234308273373185",
        "Ts_create": "2025-08-05T10:18:31.347Z",
        "Ts_edit": "2025-08-05T10:18:31.347Z",
        "Logic_del": 0
      }
    },
    formatDate(dateString) {
      if (!dateString) return '未知时间'
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
    },
    downloadFile(solution) {
      Toast('下载文件: ' + solution.File_Name)
      // 实际项目中应该实现文件下载逻辑
      // 例如通过solution.File_Md5或其他标识符下载文件
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
  color: #333;
}
</style>
