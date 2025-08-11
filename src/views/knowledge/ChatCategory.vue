<template>
  <div class="knowledge-base-page">
    <!-- 搜索栏 -->
    <van-search
        v-model="searchParams.Error_Name"
        placeholder="请输入问题名称（支持模糊匹配-换行自动搜索）"
        @search="onSearch"
        class="custom-search"
    />

    <!-- 错误列表 -->
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
<!--      :title="post.Error_Name || post.Error_Code || '未知错误'"-->
      <van-cell
          v-for="(post, index) in posts"
          :key="index"
          :title="`问题名称: ${post.Error_Name || post.Error_Code || '未知错误'}`"
          :label="`类型: ${post.Error_Type || '未分类'}`"
          is-link
          @click="viewPostDetail(post)"
          class="custom-cell"
      />
    </van-list>
  </div>
</template>

<!--根据是否有搜索关键词来决定使用哪个接口：
当搜索框有内容时，使用ErrorRepositorySelectFun接口进行模糊查询
当搜索框无内容时，使用原来的ErrorRepositoryGetFun接口加载数据-->

<script>
import { List, Cell, Search } from 'vant'
import SensorRequest from '@/utils/SensorRequest.js'

export default {
  name: 'KnowledgeBasePage',
  components: {
    VanList: List,
    VanCell: Cell,
    VanSearch: Search,
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
      // 传递整个post对象到详情页
      this.$router.push({
        path: `/sensor_ddingWork/Release/post-detail`,
        query: {
          data: JSON.stringify(post)
        }
      })
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

      // 判断是否是搜索模式
      if (this.searchParams.Error_Name) {
        // 搜索模式，使用ErrorRepositorySelectFun接口
        // 构造搜索参数
        const searchParam = {
          Error_Name: this.searchParams.Error_Name,
          Error_Type: ""
        }
        // 将参数转换为JSON字符串
        const param = JSON.stringify(searchParam)

        // 使用ErrorRepositorySelectFun接口进行搜索
        SensorRequest.ErrorRepositorySelectFun(
            param,
            (respData) => {
              console.log("search_respData: "+respData)
              let search_respData =  JSON.parse(respData)
              this.loading = false
              if (respData && Array.isArray(search_respData)) {
                // 如果返回的是数组，直接赋值
                if (this.posts.length === 0) {
                  this.posts = search_respData
                } else {
                  this.posts = [...this.posts, ...search_respData]
                }
                // 假设每次返回10条数据，如果没有更多数据则finished设为true
                this.finished = search_respData.length < 10
              } else if (respData) {
                // 如果返回的是单个对象
                this.posts = [search_respData]
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
      } else {
        // 正常加载模式，使用原来的ErrorRepositoryGetFun接口
        // 将参数转换为JSON字符串
        const param = JSON.stringify(this.searchParams)

        SensorRequest.ErrorRepositoryGetFun(
            param,
            (respData) => {
              console.log("chat_respData: "+respData)
              let chat_respData =  JSON.parse(respData)
              this.loading = false
              if (respData && Array.isArray(chat_respData)) {
                // 如果返回的是数组，直接赋值
                if (this.posts.length === 0) {
                  this.posts = chat_respData
                } else {
                  this.posts = [...this.posts, ...chat_respData]
                }
                // 假设每次返回10条数据，如果没有更多数据则finished设为true
                this.finished = chat_respData.length < 10
              } else if (respData) {
                // 如果返回的是单个对象
                this.posts = [chat_respData]
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
}
</script>

<style scoped>
.knowledge-base-page {
  padding-bottom: 50px;
}

.custom-search {
  padding: 10px;
  background-color: #4c87ee;
  border-radius: 20px;
  margin: 10px;
}

.custom-search ::v-deep .van-search__content {
  border: 2px solid #ffffff;
  border-radius: 20px;
  background-color: #e6f0ff;
}

.custom-search ::v-deep .van-field__left-icon {
  color: #ffffff;
}

.custom-search ::v-deep .van-field__control {
  color: #333333;
}

.custom-search ::v-deep .van-field__control::placeholder {
  color: #666666;
}

.custom-search ::v-deep .van-search__action {
  color: #ffffff;
  background-color: #3f83f8;
  border-radius: 0 18px 18px 0;
}

.custom-cell {
  background-color: #ffffff;
  margin: 10px auto;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(69, 125, 222, 0.4); /* 改为淡蓝色阴影 */
  transition: all 0.3s ease;
  width: 95%;
}

.custom-cell ::v-deep .van-cell__title {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.custom-cell ::v-deep .van-cell__label {
  white-space: normal;
  color: #666;
  font-size: 14px;
  margin-top: 4px;
}

.custom-cell:active {
  background-color: #88b1ef;
  transform: scale(0.98);
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
