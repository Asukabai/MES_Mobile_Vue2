<template>
  <div class="search-bar">
    <div class="search-container">
      <!-- 搜索输入框 -->
      <van-search
          v-model="searchQuery"
          placeholder="请输入文件名称或文件关键字"
          @input="$emit('input', $event)"
      />

      <!-- 查询、重置、排序按钮组 -->
      <div class="search-actions">
        <van-button type="primary" size="small" @click="submitSearch">查询</van-button>
        <van-button size="small" plain @click="resetSearch">重置</van-button>
        <van-button
            size="small"
            plain
            @click="toggleSortOrder"
            style="display: flex; align-items: center;"
        >
          <van-icon name="clock-o" />&nbsp;
          {{ sortOrder === 'asc' ? '升序排列' : '降序排列' }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Search, Icon } from 'vant'
import { Toast } from 'vant'

export default {
  name: 'SearchBar',
  components: {
    VanButton: Button,
    VanSearch: Search,
    VanIcon: Icon
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    sortOrder: {
      type: String,
      default: 'desc',
      validator: value => ['asc', 'desc'].includes(value)
    }
  },
  computed: {
    searchQuery: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    // 提交搜索
    submitSearch() {
      if (this.searchQuery.trim()) {
        // 模拟接口请求延迟
        setTimeout(() => {
          const fakeData = [
            {
              id: 99,
              title: `${this.searchQuery}相关文档.pdf`,
              desc: '📌 任务截止时间：2025-07-05',
              tags: ['已完成']
            },
            {
              id: 100,
              title: `${this.searchQuery}测试报告.xlsx`,
              desc: '📌 任务截止时间：2025-08-05',
              tags: ['未查看']
            }
          ]
          this.$emit('submit', fakeData)
          Toast.success('查询成功')
        }, 500)
      } else {
        Toast.fail('请输入文件名或关键词')
        this.$emit('submit', [])
      }
    },

    // 重置搜索
    resetSearch() {
      Toast.info('已重置搜索条件')
      this.$emit('reset')
    },

    // 切换排序方式
    toggleSortOrder() {
      const newOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      this.$emit('update:sort-order', newOrder)
      Toast.info(`${newOrder === 'asc' ? '升序排列' : '降序排列'}`)
    }
  }
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.van-search {
  width: 100%;
  margin-bottom: 8px;
}

.search-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
