<template>
  <div class="knowledge-base-page">
    <!-- 搜索栏 -->
    <van-search
        v-model="searchParams.Error_Name"
        placeholder="请输入错误名称"
        @search="onSearch"
    />

    <!-- 错误列表 -->
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <van-cell
          v-for="(post, index) in posts"
          :key="index"
          :title="post.Error_Name || post.Error_Code || '未知错误'"
          :label="post.Error_Description || '暂无描述'"
          is-link
          @click="viewPostDetail(post)"
      />
    </van-list>
    <!-- 底部导航栏 -->
    <main-tab-bar />
  </div>
</template>

<script>
import MainTabBar from '@/components/MainTabBar.vue'
import { List, Cell, Search } from 'vant'
import SensorRequest from '@/utils/SensorRequest.js'

export default {
  name: 'KnowledgeBasePage',
  components: {
    VanList: List,
    VanCell: Cell,
    VanSearch: Search,
    MainTabBar
  },
  data() {
    return {
      posts: [],
      loading: false,
      finished: false,
      searchParams: {
        Error_Name: "",
        Error_Code: "",
        Error_Creator: {
          Person_Name: ""
        }
      },
      // 悬浮按钮的初始位置
      buttonPosition: {
        bottom: 80,
        right: 20
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    goToCreatePost() {
      this.$router.push('/sensor_ddingWork/Release/create_post') // 跳转到创建页面
    },
    viewPostDetail(post) {
      // 根据实际返回数据结构调整跳转逻辑
      this.$router.push(`/sensor_ddingWork/Release/post-detail/${post.id || post.Error_ID}`)
    },
    onSearch() {
      this.posts = []
      this.finished = false
      this.loadData()
    },
    onLoad() {
      this.loadData()
    },
    loadData() {
      this.loading = true
      // 将参数转换为JSON字符串
      const param = JSON.stringify(this.searchParams)

      SensorRequest.ErrorRepositoryGetFun(
          param,
          (respData) => {
            this.loading = false
            if (respData && Array.isArray(respData)) {
              // 如果返回的是数组，直接赋值
              if (this.posts.length === 0) {
                this.posts = respData
              } else {
                this.posts = [...this.posts, ...respData]
              }
              // 假设每次返回10条数据，如果没有更多数据则finished设为true
              this.finished = respData.length < 10
            } else if (respData) {
              // 如果返回的是单个对象
              this.posts = [respData]
              this.finished = true
            } else {
              // 没有数据返回
              this.finished = true
            }
          },
          (errorMsg) => {
            this.loading = false
            this.finished = true
            console.error('获取数据失败:', errorMsg)
            // 可以添加错误提示
          }
      )
    }
  }
}
</script>

<style scoped>
.knowledge-base-page {
  padding-bottom: 50px;
}

.van-cell__title {
  font-weight: bold;
  font-size: 16px;
}

.van-cell__label {
  white-space: normal;
  color: #666;
  font-size: 14px;
  margin-top: 4px;
}
</style>
