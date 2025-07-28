<template>
  <div class="page-container">
    <!-- 页面标题 -->
<!--    <van-cell-->
<!--        title="文件分享"-->
<!--        icon="link-o"-->
<!--        :title-style="{ fontWeight: 'bold', fontSize: '16px' }"-->
<!--    />-->
    <!-- 页面标题：使用 van-nav-bar 替代 van-cell -->
    <van-nav-bar
        title="文件分享"
        left-icon="link-o"
        :right-text="''"
        @click-left="handleTitleClick"
    >
      <!-- 右侧可选按钮（示例） -->
      <template #right>
        <van-icon name="search" size="18" @click="handleSearchIconClick" />
      </template>
    </van-nav-bar>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 使用搜索组件 -->
      <search-bar
          v-model="searchQuery"
          :sort-order="sortOrder"
          @submit="handleSearchSubmit"
          @reset="resetSearch"
          @update:sort-order="sortOrder = $event"
      />

      <!-- 使用 van-row 和 van-col 布局卡片 -->
      <van-row gutter="12" class="card-row">
        <van-col
            v-for="item in paginatedCartList"
            :key="item.id"
            span="12"
            class="card-col"
        >
          <van-card
              :num="item.num"
              :price="item.price"
              :desc="item.desc"
              :title="item.title"
              :thumb="item.thumb"
              class="custom-card"
          >
            <!-- 标签区域 -->
            <template #tags>
              <van-tag plain type="danger" v-for="(tag, index) in item.tags" :key="index">{{ tag }}</van-tag>
            </template>

            <!-- 按钮区域 -->
            <template #footer>
              <van-button
                  icon="guide-o"
                  round
                  plain
                  size="small"
                  type="primary"
                  @click="goToDetail(item)"
                  class="action-btn view-btn"
              >
                查看
              </van-button>
              <van-button
                  icon="edit"
                  round
                  plain
                  size="small"
                  type="info"
                  class="action-btn record-btn"
                  @click="goToRecord(item)"
              >
                记录
              </van-button>
            </template>
          </van-card>
        </van-col>
      </van-row>

      <!-- 分页组件 -->
      <div class="pagination-wrapper">
        <base-pagination
            v-model="currentPage"
            :total-items="filteredCartList.length"
            :page-size="itemsPerPage"
            @page-change="handlePageChange"
            @update:page-size="updatePageSize"
        />
      </div>
    </div>
    <MainTabBar />
  </div>
</template>

<script>
import {
  Card,
  Tag,
  Button,
  Row,
  Col, NavBar
} from 'vant'
import MainTabBar from '@/components/MainTabBar.vue'
import BasePagination from '@/components/BasePagination.vue'
import SearchBar from '@/components/SearchBar.vue' // 引入新组件

export default {
  name: 'CartFile',
  components: {
    VanCard: Card,
    VanTag: Tag,
    VanButton: Button,
    VanRow: Row,
    VanCol: Col,
    MainTabBar,
    BasePagination,
    SearchBar ,
    VanNavBar: NavBar,
  },
  data() {
    return {
      // 分页配置
      currentPage: 1,
      itemsPerPage: 4,

      // 搜索相关
      searchQuery: '',

      // 原始数据
      cartList: [
        {
          id: 1,
          desc: '📌 任务截止时间： 2025-04-05 ',
          title: '多路输出项目新需求.docx',
          tags: ['已完成']
        },
        {
          id: 2,
          desc: '📌 任务截止时间： 2025-06-05 ',
          title: 'AGV小车软件更新维护.pdf',
          tags: ['延期']
        },
        {
          id: 3,
          desc: '📌 任务截止时间： 2025-08-05 ',
          title: 'P型电源售后机箱维修.png',
          tags: ['未查看']
        },
        {
          id: 4,
          desc: '📌 任务截止时间： 2025-08-14 ',
          title: '屏蔽电源触摸屏软件调试.txt',
          tags: ['已完成']
        },
        {
          id: 5,
          desc: '📌 任务截止时间： 2025-07-05 ',
          title: '工作助手小程序前端页面开发.xlsx',
          tags: ['正在进行中']
        },
        {
          id: 6,
          desc: '📌 任务截止时间： 2025-09-05 ',
          title: '工作助手小程序后端开发.pptx',
          tags: ['正在进行中']
        },
        {
          id: 7,
          desc: '📌 任务截止时间： 2025-06-05 ',
          title: 'AGV小车软件更新维护.pdf',
          tags: ['延期']
        },
        {
          id: 8,
          desc: '📌 任务截止时间： 2025-08-05 ',
          title: 'P型电源售后机箱维修.png',
          tags: ['未查看']
        },
        {
          id: 9,
          desc: '📌 任务截止时间： 2025-08-14 ',
          title: '屏蔽电源触摸屏软件调试.txt',
          tags: ['已完成']
        },
        {
          id: 10,
          desc: '📌 任务截止时间： 2025-07-05 ',
          title: '工作助手小程序前端页面开发.xlsx',
          tags: ['正在进行中']
        },
        {
          id: 11,
          desc: '📌 任务截止时间： 2025-09-05 ',
          title: '工作助手小程序后端开发.pptx',
          tags: ['正在进行中']
        }
      ],

      // 新增字段
      isSearchSubmitted: false, // 是否已提交搜索
      searchResults: [], // 存储接口返回的数据
      sortOrder: 'desc' // 排序方式，默认为降序
    }
  },
  computed: {
    filteredCartList() {
      let list
      if (this.isSearchSubmitted) {
        list = this.searchResults
      } else if (!this.searchQuery.trim()) {
        list = this.cartList
      } else {
        const query = this.searchQuery.toLowerCase()
        list = this.cartList.filter(
            item => item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
        )
      }

      // 如果启用了排序，则返回已排序列表
      return [...list].sort((a, b) => {
        const dateA = this.extractDateFromDesc(a.desc)
        const dateB = this.extractDateFromDesc(b.desc)
        return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      })
    },
    paginatedCartList() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredCartList.slice(start, start + this.itemsPerPage)
    }
  },
  methods: {
    goToRecord(item) {
      this.$router.push({
        path: '/task-record',
        query: { title: item.title } // 可以把文件名传过去作为默认值
      })
    },
    // 模拟假接口
    mockApiRequest(keyword) {
      return new Promise(resolve => {
        setTimeout(() => {
          const fakeData = [
            {
              id: 99,
              title: `${keyword}相关文档.pdf`,
              desc: '📌 任务截止时间：2025-07-05',
              tags: ['已完成']
            },
            {
              id: 100,
              title: `${keyword}测试报告.xlsx`,
              desc: '📌 任务截止时间：2025-08-05',
              tags: ['未查看']
            }
          ]
          resolve(fakeData)
        }, 500)
      })
    },

    // 输入框变化
    handleSearchInput(value) {
      this.searchQuery = value
    },

    // 提交搜索
    async handleSearchSubmit(keyword) {
      if (!keyword.trim()) {
        alert('请输入查询关键词')
        return
      }

      const results = await this.mockApiRequest(keyword)
      this.searchResults = results
      this.currentPage = 1
      this.isSearchSubmitted = true
    },

    // 重置搜索
    resetSearch() {
      this.searchQuery = ''
      this.currentPage = 1
      this.isSearchSubmitted = false
      this.searchResults = []
    },

    // 切换排序方式
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
    },

    // 解析描述中的日期
    extractDateFromDesc(desc) {
      const match = desc.match(/(\d{4}-\d{2}-\d{2})/)
      return match ? new Date(match[1]).getTime() : 0
    },

    // 点击查看跳转预览
    goToDetail(item) {
      if (!item || !item.title) {
        alert('数据异常，无法获取文件信息')
        return
      }
      const fileName = item.title
      const suffixMatch = /\.([a-zA-Z0-9]+)$/.exec(fileName)

      if (!suffixMatch) {
        alert('无法识别文件类型')
        return
      }
      const suffix = suffixMatch[1].toLowerCase()

      let baseUrl = ''
      switch (suffix) {
        case 'docx':
          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/2.docx'
          break
        case 'xlsx':
        case 'xls':
          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/2.xlsx'
          break
        case 'pdf':
          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/2.pdf'
          break
        case 'pptx':
          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/1.pptx'
          break
        case 'png':
          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/1.png'
          break
        case 'txt':
          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/1.txt'
          break
        default:
          alert('暂不支持该文件类型预览')
          return
      }

      const encodedUrl = encodeURIComponent(baseUrl)
      this.$router.push(`/preview?url=${encodedUrl}`)
    },

    // 分页方法
    handlePageChange(page) {
      this.currentPage = page
    },
    updatePageSize(size) {
      this.itemsPerPage = size
      this.currentPage = 1
    }
  }
}
</script>


<style scoped>
.page-container {
  padding: 20px;
}

.content-wrapper {
  margin-top: 16px;
}

/* 按钮操作区 */
.search-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.card-row {
  margin-bottom: -16px;
}

.card-col {
  padding-bottom: 16px;
}

/* 自定义卡片样式 */
.custom-card {
  width: 100%;
  height: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
}

/* 鼠标悬停放大效果 */
.custom-card:hover {
  transform: translateY(-2px);
}

/* 卡片内文字样式 */
.custom-card .van-card__title {
  font-size: 13px;
  line-height: 1.4;
  font-weight: 500;
}

.custom-card .van-card__desc {
  font-size: 12px;
  color: #555;
}

/* 分页居中 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* 卡片按钮样式 */
.van-card__footer .action-btn {
  margin: 0 4px;
  font-size: 11px;
  padding: 0 10px;
}

.van-card__footer {
  display: flex;
  justify-content: space-between;
}
</style>
