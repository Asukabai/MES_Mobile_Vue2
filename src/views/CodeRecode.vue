<template>
  <div class="project-code-container">
    <!-- 页面标题 -->
    <van-cell title="扫码记录" icon="description-o" :title-style="{ fontWeight: 'bold', fontSize: '16px' }" />

    <!-- 搜索框 -->
    <van-search v-model="searchQuery" placeholder="请输入项目名称或编号" @input="handleSearch" />

    <!-- 排序按钮 -->
    <van-button type="default" size="small" @click="toggleSort">{{ sortButtonText }}</van-button>

    <!-- 列表区域 -->
    <van-cell v-for="(item, index) in paginatedList" :key="index">
      <div class="list-item">
        <strong>板卡编号：</strong>{{ item.code }}<br />
        <strong>板卡名称：</strong>{{ item.name }}<br />
        <strong>状态：</strong>
        <van-tag :type="item.status === '已完成' ? 'success' : 'warning'">{{ item.status }}</van-tag>
      </div>
    </van-cell>
<!--    <p style="text-align: center; font-size: 14px; color: #999;">-->
<!--      共 {{ filteredAndSorted.length }} 条数据-->
<!--    </p>-->

    <!-- 使用封装好的分页组件 -->
    <BasePagination
        v-model="currentPage"
        :total-items="filteredAndSorted.length"
        :page-size="pageSize"
        @page-change="handlePageChange"
        @update:page-size="handlePageSizeChange"
    />
    <BaseFooter/>
  </div>
</template>


<script>
import 'vant/lib/pagination/style'
import BasePagination from "@/components/BasePagination.vue";
import BaseFooter from "@/components/BaseFooter.vue";

export default {
  name: 'ProjectCode',
  components: {
    BasePagination,
    BaseFooter
  },
  data() {
    return {
      list: [],              // 原始数据
      filteredAndSorted: [], // 过滤+排序后的数据
      paginatedList: [],     // 当前页展示的数据
      searchQuery: '',       // 搜索关键词
      currentPage: 1,
      pageSize: 4,
      sortByDate: 'desc',    // 可选值：'asc' / 'desc'
      sortButtonText: '按时间倒序'
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 初始化数据并添加模拟时间字段
    initData() {
      const fakeData = [
        { code: 'P2025-001', name: '晟思智能管理系统开发', status: '进行中', createTime: '2024-10-01' },
        { code: 'P2025-002', name: 'AGV机器人调试项目', status: '已完成', createTime: '2024-10-05' },
        { code: 'P2025-003', name: '传感器云端平台升级', status: '待启动', createTime: '2024-09-28' },
        { code: 'P2025-004', name: '钉钉工作助手优化', status: '进行中', createTime: '2024-10-07' },
        { code: 'P2025-005', name: '小程序 UI 重构', status: '已完成', createTime: '2024-10-03' },
        { code: 'P2025-006', name: '电源模块测试任务', status: '待启动', createTime: '2024-09-30' },
        { code: 'P2025-007', name: '自动化测试脚本编写', status: '进行中', createTime: '2024-10-06' },
        { code: 'P2025-008', name: '客户反馈系统搭建', status: '已完成', createTime: '2024-10-04' },
        { code: 'P2025-009', name: '云服务器扩容计划', status: '待启动', createTime: '2024-09-29' },
        { code: 'P2025-010', name: '代码审核与优化', status: '进行中', createTime: '2024-10-02' }
      ]

      this.list = fakeData
      this.handleSearch()
    },

    // 处理每页数量变化
    handlePageSizeChange(size) {
      this.pageSize = size;
      // this.currentPage = 1; // 回到第一页
      this.paginatedList = this.getPageData(this.currentPage);
    },

    handleSearch() {
      const query = this.searchQuery.toLowerCase().trim()
      let result = [...this.list]

      if (query) {
        result = result.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.code.toLowerCase().includes(query)
        )
      }

      result.sort((a, b) => {
        const timeA = new Date(a.createTime)
        const timeB = new Date(b.createTime)
        return this.sortByDate === 'desc' ? timeB - timeA : timeA - timeB
      })

      this.filteredAndSorted = result
      this.currentPage = 1
      this.paginatedList = this.getPageData(this.currentPage)
    },

    getPageData(page) {
      const start = (page - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredAndSorted.slice(start, end)
    },

    handlePageChange(page) {
      const totalPages = Math.ceil(this.filteredAndSorted.length / this.pageSize)
      const safePage = Math.max(1, Math.min(page, totalPages))
      this.currentPage = safePage
      this.paginatedList = this.getPageData(safePage)
    },

    toggleSort() {
      this.sortByDate = this.sortByDate === 'desc' ? 'asc' : 'desc'
      this.sortButtonText = this.sortByDate === 'desc' ? '按时间倒序' : '按时间正序'
      this.handleSearch()
    }
  }
}
</script>

<style scoped>
.project-code-container {
  padding: 16px;
}

.van-button {
  margin: 10px 0;
}

.list-item {
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 10px;
  line-height: 1.5;
}
</style>
