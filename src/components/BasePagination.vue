<template>
  <div class="base-pagination">
    <van-row type="flex" justify="center" align="center" gutter="10">
      <!-- 上一页按钮 -->
      <van-col>
        <van-button :disabled="currentPage === 1" @click="prevPage" size="small" type="info">上一页</van-button>
      </van-col>

      <!-- 当前页 / 总页数 -->
      <van-col>
        <span class="page-info">第{{ currentPage }}页 / 共{{ totalPages }}页</span>
      </van-col>

      <!-- 每页数量选择（使用小按钮展示） -->
      <van-col>
        <van-button
            size="small"
            type="default"
            @click="showPopup = true"
            style="width: 60px; padding: 0 5px; font-size: 12px;"
        >
          {{ localPageSize }}
        </van-button>

        <van-popup v-model="showPopup" position="bottom">
          <van-picker
              show-toolbar
              :columns="pageSizeOptions"
              @cancel="showPopup = false"
              @confirm="onPageSizeConfirm"
          />
        </van-popup>
      </van-col>

      <!-- 下一页按钮 -->
      <van-col>
        <van-button :disabled="currentPage === totalPages" @click="nextPage" size="small" type="info">下一页</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import { Button, Row, Col, Popup, Picker } from 'vant'
import 'vant/lib/button/style'
import 'vant/lib/row/style'
import 'vant/lib/col/style'
import 'vant/lib/popup/style'
import 'vant/lib/picker/style'

export default {
  name: 'BasePagination',
  components: {
    VanButton: Button,
    VanRow: Row,
    VanCol: Col,
    VanPopup: Popup,
    VanPicker: Picker
  },
  props: {
    value: { type: Number, default: 1 },
    totalItems: { type: Number, required: true },
    pageSize: { type: Number, default: 10 }
  },
  data() {
    return {
      currentPage: this.value,
      localPageSize: this.pageSize,
      showPopup: false,
      pageSizeOptions: [3,5, 10, 15, 20]
    }
  },
  watch: {
    value(newVal) {
      this.currentPage = newVal
    },
    currentPage(newVal) {
      this.$emit('input', newVal)
    },
    pageSize(newVal) {
      this.localPageSize = newVal
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.localPageSize) || 1
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        const prev = this.currentPage - 1
        this.currentPage = prev
        this.$emit('page-change', prev)
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        const next = this.currentPage + 1
        this.currentPage = next
        this.$emit('page-change', next)
      }
    },
    onPageSizeConfirm(value) {
      this.localPageSize = value
      this.showPopup = false
      this.$emit('update:page-size', value)
      this.$emit('page-change', 1)
    }
  }
}
</script>

<style scoped>
.base-pagination {
  margin-top: 16px;
  text-align: center;
}

.page-info {
  font-size: 14px;
  color: #666;
  margin: 0 8px;
}

@media (max-width: 768px) {
  .base-pagination .van-row {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 8px 0;
  }

  .base-pagination .van-col {
    flex-shrink: 0;
    margin-right: 8px;
  }

  .page-info {
    font-size: 12px;
  }
}
</style>
