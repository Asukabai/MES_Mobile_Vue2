<template>
  <div class="page-container">
    <van-nav-bar
        title="文件分享"
        left-icon="link-o"
        :right-text="''"
        @click-left="handleTitleClick"
    >
      <template #right>
        <van-icon name="search" size="18" @click="handleSearchIconClick" />
      </template>
    </van-nav-bar>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 搜索组件 -->
      <search-bar
          v-model="searchQuery"
          :sort-order="sortOrder"
          @submit="handleSearchSubmit"
          @reset="resetSearch"
          @update:sort-order="sortOrder = $event"
      />

      <!-- 卡片列表 -->
      <van-row gutter="12" class="card-row">
        <van-col
            v-for="item in paginatedCartList"
            :key="item.id"
            span="12"
            class="card-col"
        >
          <van-card
              :desc="item.desc"
              :title="item.title"
              class="custom-card"
          >
            <!-- 标签 -->
            <template #tags>
              <van-tag plain type="danger" v-for="(tag, index) in item.tags" :key="index">{{ tag }}</van-tag>
            </template>

            <!-- 按钮 -->
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

      <!-- 分页 -->
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
import SensorRequest from '@/utils/SensorRequest'
import MainTabBar from '@/components/MainTabBar.vue'
import BasePagination from '@/components/BasePagination.vue'
import SearchBar from '@/components/SearchBar.vue'
import { key_DingUserPhone} from "@/utils/Dingding";

function getLocalUserInfo() {
  const phone = localStorage.getItem(key_DingUserPhone);
  return {
    phone: phone || '',
  };
}

export default {
  name: 'CartFile',
  components: {
    MainTabBar,
    BasePagination,
    SearchBar
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 4,
      searchQuery: '',
      cartList: [],
      isSearchSubmitted: false,
      searchResults: [],
      sortOrder: 'desc'
    }
  },
  mounted() {
    console.log('📦 页面已挂载，开始请求接口...');
    this.handleSearchSubmit('');
  },
  computed: {
    filteredCartList() {
      let list;
      if (this.isSearchSubmitted) {
        list = this.searchResults;
      } else if (!this.searchQuery.trim()) {
        list = this.cartList;
      } else {
        const query = this.searchQuery.toLowerCase();
        list = this.cartList.filter(
            item => item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
        );
      }

      return [...list].sort((a, b) => {
        const dateA = this.extractDateFromDesc(a.desc);
        const dateB = this.extractDateFromDesc(b.desc);
        return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    },
    paginatedCartList() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredCartList.slice(start, start + this.itemsPerPage);
    }
  },
  methods: {
    // 跳转到记录页
    goToRecord(item) {
      this.$router.push({
        path: '/task-record',
        query: { title: item.title }
      });
    },

    // 请求真实数据
    async fetchRealData() {
      return new Promise((resolve, reject) => {

        // 从缓存中获取用户信息
        const userInfo = getLocalUserInfo();
        // 创建请求参数对象并转换为 JSON 字符串
        const requestParams = JSON.stringify({
            Person_Phone: userInfo.phone,
        });
        console.log('📤 正在调用 GetSharedFileWithMeFun 接口，参数:', requestParams);
        SensorRequest.GetSharedFileWithMeFun(requestParams, respData => {
          if (respData && respData.result === 1) {
            try {
              console.log('📥 接收到原始响应:', respData);

              // ✅ 直接使用 respData.respData，它已经是字符串形式的 JSON 数据
              const rawData = JSON.parse(respData.respData); // ✅ 只需要一次 parse

              if (!Array.isArray(rawData)) {
                throw new Error('接口返回的 respData 不是一个数组');
              }

              // ✅ 调整映射逻辑以适配新接口数据结构
              const formattedData = rawData.map((item, index) => {
                const file = item.Share_Files?.[0] || {};
                const fileName = file.File_Name || '未知文件';
                const uploadTime = file.Upload_Time
                    ? new Date(file.Upload_Time).toLocaleDateString()
                    : '无时间';

                return {
                  id: index + 1,
                  title: fileName,
                  desc: `📌 任务截止时间：${uploadTime}`,
                  tags: ['未查看']
                };
              });

              console.log('📦 格式化后用于渲染的数据:', formattedData);

              resolve(formattedData);
            } catch (e) {
              console.error('💥 解析 respData 失败:', e);
              alert('数据解析失败');
              reject(e);
            }
          } else {
            console.warn('⚠️ 接口返回错误:', respData);
            alert('接口请求失败');
            reject(new Error('接口返回错误'));
          }
        }, err => {
          console.error('🚫 网络请求异常:', err);
          alert('网络请求异常');
          reject(err);
        });
      });
    },


    // 提交搜索
    async handleSearchSubmit(keyword) {
      const finalKeyword = keyword?.trim() || '';

      console.log('📡 正在发送请求，关键词:', finalKeyword);

      try {
        const results = await this.fetchRealData(finalKeyword);
        console.log('✅ 请求成功，返回数据:', results);

        this.searchResults = results;
        this.currentPage = 1;
        this.isSearchSubmitted = true;

        console.log('🔍 当前搜索状态:', {
          isSearchSubmitted: this.isSearchSubmitted,
          searchResultsCount: this.searchResults.length
        });
      } catch (error) {
        console.error('❌ 请求失败:', error.message);
        alert('数据加载失败，请检查网络或重试');
      }
    },

    // 重置搜索
    resetSearch() {
      this.searchQuery = '';
      this.currentPage = 1;
      this.isSearchSubmitted = false;
      this.searchResults = [];
    },

    // 切换排序方式
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },

    // 解析日期
    extractDateFromDesc(desc) {
      const match = desc.match(/(\d{4}-\d{2}-\d{2})/);
      return match ? new Date(match[1]).getTime() : 0;
    },

    // 查看详情
    goToDetail(item) {
      if (!item || !item.title) {
        alert('数据异常，无法获取文件信息');
        return;
      }
      const fileName = item.title;
      const suffixMatch = /\.([a-zA-Z0-9]+)$/.exec(fileName);

      if (!suffixMatch) {
        alert('无法识别文件类型');
        return;
      }
      const suffix = suffixMatch[1].toLowerCase();

      let baseUrl = '';
      switch (suffix) {
        case 'docx':
          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/2.docx';
          break;
        case 'xlsx':
        case 'xls':
          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/2.xlsx';
          break;
        case 'pdf':
          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/2.pdf';
          break;
        case 'pptx':
          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/1.pptx';
          break;
        case 'png':
          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/1.png';
          break;
        case 'txt':
          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/1.txt';
          break;
        default:
          alert('暂不支持该文件类型预览');
          return;
      }

      const encodedUrl = encodeURIComponent(baseUrl);
      this.$router.push(`/preview?url=${encodedUrl}`);
    },

    // 分页方法
    handlePageChange(page) {
      this.currentPage = page;
    },
    updatePageSize(size) {
      this.itemsPerPage = size;
      this.currentPage = 1;
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 2px;
}

.content-wrapper {
  margin-top: 16px;
}

.card-row {
  margin-bottom: -16px;
}

.card-col {
  padding-bottom: 16px;
}

.custom-card {
  width: 100%;
  height: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
}

.custom-card:hover {
  transform: translateY(-2px);
}

.custom-card .van-card__title {
  font-size: 13px;
  line-height: 1.4;
  font-weight: 500;
}

.custom-card .van-card__desc {
  font-size: 12px;
  color: #555;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

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






<!--<template>-->
<!--  <div class="page-container">-->
<!--    <van-nav-bar-->
<!--        title="文件分享"-->
<!--        left-icon="link-o"-->
<!--        :right-text="''"-->
<!--        @click-left="handleTitleClick"-->
<!--    >-->
<!--      &lt;!&ndash; 右侧可选按钮（示例） &ndash;&gt;-->
<!--      <template #right>-->
<!--        <van-icon name="search" size="18" @click="handleSearchIconClick" />-->
<!--      </template>-->
<!--    </van-nav-bar>-->

<!--    &lt;!&ndash; 内容区域 &ndash;&gt;-->
<!--    <div class="content-wrapper">-->
<!--      &lt;!&ndash; 使用搜索组件 &ndash;&gt;-->
<!--      <search-bar-->
<!--          v-model="searchQuery"-->
<!--          :sort-order="sortOrder"-->
<!--          @submit="handleSearchSubmit"-->
<!--          @reset="resetSearch"-->
<!--          @update:sort-order="sortOrder = $event"-->
<!--      />-->

<!--      &lt;!&ndash; 使用 van-row 和 van-col 布局卡片 &ndash;&gt;-->
<!--      <van-row gutter="12" class="card-row">-->
<!--        <van-col-->
<!--            v-for="item in paginatedCartList"-->
<!--            :key="item.id"-->
<!--            span="12"-->
<!--            class="card-col"-->
<!--        >-->
<!--          <van-card-->
<!--              :num="item.num"-->
<!--              :price="item.price"-->
<!--              :desc="item.desc"-->
<!--              :title="item.title"-->
<!--              :thumb="item.thumb"-->
<!--              class="custom-card"-->
<!--          >-->
<!--            &lt;!&ndash; 标签区域 &ndash;&gt;-->
<!--            <template #tags>-->
<!--              <van-tag plain type="danger" v-for="(tag, index) in item.tags" :key="index">{{ tag }}</van-tag>-->
<!--            </template>-->

<!--            &lt;!&ndash; 按钮区域 &ndash;&gt;-->
<!--            <template #footer>-->
<!--              <van-button-->
<!--                  icon="guide-o"-->
<!--                  round-->
<!--                  plain-->
<!--                  size="small"-->
<!--                  type="primary"-->
<!--                  @click="goToDetail(item)"-->
<!--                  class="action-btn view-btn"-->
<!--              >-->
<!--                查看-->
<!--              </van-button>-->
<!--              <van-button-->
<!--                  icon="edit"-->
<!--                  round-->
<!--                  plain-->
<!--                  size="small"-->
<!--                  type="info"-->
<!--                  class="action-btn record-btn"-->
<!--                  @click="goToRecord(item)"-->
<!--              >-->
<!--                记录-->
<!--              </van-button>-->
<!--            </template>-->
<!--          </van-card>-->
<!--        </van-col>-->
<!--      </van-row>-->

<!--      &lt;!&ndash; 分页组件 &ndash;&gt;-->
<!--      <div class="pagination-wrapper">-->
<!--        <base-pagination-->
<!--            v-model="currentPage"-->
<!--            :total-items="filteredCartList.length"-->
<!--            :page-size="itemsPerPage"-->
<!--            @page-change="handlePageChange"-->
<!--            @update:page-size="updatePageSize"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->
<!--    <MainTabBar />-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import {-->
<!--  Card,-->
<!--  Tag,-->
<!--  Button,-->
<!--  Row,-->
<!--  Col, NavBar-->
<!--} from 'vant'-->
<!--import MainTabBar from '@/components/MainTabBar.vue'-->
<!--import BasePagination from '@/components/BasePagination.vue'-->
<!--import SearchBar from '@/components/SearchBar.vue' // 引入新组件-->

<!--export default {-->
<!--  name: 'CartFile',-->
<!--  components: {-->
<!--    VanCard: Card,-->
<!--    VanTag: Tag,-->
<!--    VanButton: Button,-->
<!--    VanRow: Row,-->
<!--    VanCol: Col,-->
<!--    MainTabBar,-->
<!--    BasePagination,-->
<!--    SearchBar ,-->
<!--    VanNavBar: NavBar,-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      // 分页配置-->
<!--      currentPage: 1,-->
<!--      itemsPerPage: 4,-->

<!--      // 搜索相关-->
<!--      searchQuery: '',-->

<!--      // 原始数据-->
<!--      cartList: [-->
<!--        {-->
<!--          id: 1,-->
<!--          desc: '📌 任务截止时间： 2025-04-05 ',-->
<!--          title: '多路输出项目新需求.docx',-->
<!--          tags: ['已完成']-->
<!--        },-->
<!--        {-->
<!--          id: 2,-->
<!--          desc: '📌 任务截止时间： 2025-06-05 ',-->
<!--          title: 'AGV小车软件更新维护.pdf',-->
<!--          tags: ['延期']-->
<!--        },-->
<!--        {-->
<!--          id: 3,-->
<!--          desc: '📌 任务截止时间： 2025-08-05 ',-->
<!--          title: 'P型电源售后机箱维修.png',-->
<!--          tags: ['未查看']-->
<!--        },-->
<!--        {-->
<!--          id: 4,-->
<!--          desc: '📌 任务截止时间： 2025-08-14 ',-->
<!--          title: '屏蔽电源触摸屏软件调试.txt',-->
<!--          tags: ['已完成']-->
<!--        },-->
<!--        {-->
<!--          id: 5,-->
<!--          desc: '📌 任务截止时间： 2025-07-05 ',-->
<!--          title: '工作助手小程序前端页面开发.xlsx',-->
<!--          tags: ['正在进行中']-->
<!--        },-->
<!--        {-->
<!--          id: 6,-->
<!--          desc: '📌 任务截止时间： 2025-09-05 ',-->
<!--          title: '工作助手小程序后端开发.pptx',-->
<!--          tags: ['正在进行中']-->
<!--        },-->
<!--        {-->
<!--          id: 7,-->
<!--          desc: '📌 任务截止时间： 2025-06-05 ',-->
<!--          title: 'AGV小车软件更新维护.pdf',-->
<!--          tags: ['延期']-->
<!--        },-->
<!--        {-->
<!--          id: 8,-->
<!--          desc: '📌 任务截止时间： 2025-08-05 ',-->
<!--          title: 'P型电源售后机箱维修.png',-->
<!--          tags: ['未查看']-->
<!--        },-->
<!--        {-->
<!--          id: 9,-->
<!--          desc: '📌 任务截止时间： 2025-08-14 ',-->
<!--          title: '屏蔽电源触摸屏软件调试.txt',-->
<!--          tags: ['已完成']-->
<!--        },-->
<!--        {-->
<!--          id: 10,-->
<!--          desc: '📌 任务截止时间： 2025-07-05 ',-->
<!--          title: '工作助手小程序前端页面开发.xlsx',-->
<!--          tags: ['正在进行中']-->
<!--        },-->
<!--        {-->
<!--          id: 11,-->
<!--          desc: '📌 任务截止时间： 2025-09-05 ',-->
<!--          title: '工作助手小程序后端开发.pptx',-->
<!--          tags: ['正在进行中']-->
<!--        }-->
<!--      ],-->

<!--      // 新增字段-->
<!--      isSearchSubmitted: false, // 是否已提交搜索-->
<!--      searchResults: [], // 存储接口返回的数据-->
<!--      sortOrder: 'desc' // 排序方式，默认为降序-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    filteredCartList() {-->
<!--      let list-->
<!--      if (this.isSearchSubmitted) {-->
<!--        list = this.searchResults-->
<!--      } else if (!this.searchQuery.trim()) {-->
<!--        list = this.cartList-->
<!--      } else {-->
<!--        const query = this.searchQuery.toLowerCase()-->
<!--        list = this.cartList.filter(-->
<!--            item => item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)-->
<!--        )-->
<!--      }-->

<!--      // 如果启用了排序，则返回已排序列表-->
<!--      return [...list].sort((a, b) => {-->
<!--        const dateA = this.extractDateFromDesc(a.desc)-->
<!--        const dateB = this.extractDateFromDesc(b.desc)-->
<!--        return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA-->
<!--      })-->
<!--    },-->
<!--    paginatedCartList() {-->
<!--      const start = (this.currentPage - 1) * this.itemsPerPage-->
<!--      return this.filteredCartList.slice(start, start + this.itemsPerPage)-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    goToRecord(item) {-->
<!--      this.$router.push({-->
<!--        path: '/Debug/task-record',-->
<!--        query: { title: item.title } // 可以把文件名传过去作为默认值-->
<!--      })-->
<!--    },-->
<!--    // 模拟假接口-->
<!--    mockApiRequest(keyword) {-->
<!--      return new Promise(resolve => {-->
<!--        setTimeout(() => {-->
<!--          const fakeData = [-->
<!--            {-->
<!--              id: 99,-->
<!--              title: `${keyword}相关文档.pdf`,-->
<!--              desc: '📌 任务截止时间：2025-07-05',-->
<!--              tags: ['已完成']-->
<!--            },-->
<!--            {-->
<!--              id: 100,-->
<!--              title: `${keyword}测试报告.xlsx`,-->
<!--              desc: '📌 任务截止时间：2025-08-05',-->
<!--              tags: ['未查看']-->
<!--            }-->
<!--          ]-->
<!--          resolve(fakeData)-->
<!--        }, 500)-->
<!--      })-->
<!--    },-->

<!--    // 输入框变化-->
<!--    handleSearchInput(value) {-->
<!--      this.searchQuery = value-->
<!--    },-->

<!--    // 提交搜索-->
<!--    async handleSearchSubmit(keyword) {-->
<!--      if (!keyword.trim()) {-->
<!--        alert('请输入查询关键词')-->
<!--        return-->
<!--      }-->

<!--      const results = await this.mockApiRequest(keyword)-->
<!--      this.searchResults = results-->
<!--      this.currentPage = 1-->
<!--      this.isSearchSubmitted = true-->
<!--    },-->

<!--    // 重置搜索-->
<!--    resetSearch() {-->
<!--      this.searchQuery = ''-->
<!--      this.currentPage = 1-->
<!--      this.isSearchSubmitted = false-->
<!--      this.searchResults = []-->
<!--    },-->

<!--    // 切换排序方式-->
<!--    toggleSortOrder() {-->
<!--      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'-->
<!--    },-->

<!--    // 解析描述中的日期-->
<!--    extractDateFromDesc(desc) {-->
<!--      const match = desc.match(/(\d{4}-\d{2}-\d{2})/)-->
<!--      return match ? new Date(match[1]).getTime() : 0-->
<!--    },-->

<!--    // 点击查看跳转预览-->
<!--    goToDetail(item) {-->
<!--      if (!item || !item.title) {-->
<!--        alert('数据异常，无法获取文件信息')-->
<!--        return-->
<!--      }-->
<!--      const fileName = item.title-->
<!--      const suffixMatch = /\.([a-zA-Z0-9]+)$/.exec(fileName)-->

<!--      if (!suffixMatch) {-->
<!--        alert('无法识别文件类型')-->
<!--        return-->
<!--      }-->
<!--      const suffix = suffixMatch[1].toLowerCase()-->

<!--      let baseUrl = ''-->
<!--      switch (suffix) {-->
<!--        case 'docx':-->
<!--          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/2.docx'-->
<!--          break-->
<!--        case 'xlsx':-->
<!--        case 'xls':-->
<!--          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/2.xlsx'-->
<!--          break-->
<!--        case 'pdf':-->
<!--          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/2.pdf'-->
<!--          break-->
<!--        case 'pptx':-->
<!--          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/1.pptx'-->
<!--          break-->
<!--        case 'png':-->
<!--          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/1.png'-->
<!--          break-->
<!--        case 'txt':-->
<!--          baseUrl = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/1.txt'-->
<!--          break-->
<!--        default:-->
<!--          alert('暂不支持该文件类型预览')-->
<!--          return-->
<!--      }-->

<!--      const encodedUrl = encodeURIComponent(baseUrl)-->
<!--      this.$router.push(`/preview?url=${encodedUrl}`)-->
<!--    },-->

<!--    // 分页方法-->
<!--    handlePageChange(page) {-->
<!--      this.currentPage = page-->
<!--    },-->
<!--    updatePageSize(size) {-->
<!--      this.itemsPerPage = size-->
<!--      this.currentPage = 1-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->


<!--<style scoped>-->
<!--.page-container {-->
<!--  padding: 20px;-->
<!--}-->

<!--.content-wrapper {-->
<!--  margin-top: 16px;-->
<!--}-->

<!--/* 按钮操作区 */-->
<!--.search-actions {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 12px;-->
<!--  margin-bottom: 16px;-->
<!--  flex-wrap: wrap;-->
<!--}-->

<!--.card-row {-->
<!--  margin-bottom: -16px;-->
<!--}-->

<!--.card-col {-->
<!--  padding-bottom: 16px;-->
<!--}-->

<!--/* 自定义卡片样式 */-->
<!--.custom-card {-->
<!--  width: 100%;-->
<!--  height: auto;-->
<!--  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);-->
<!--  border-radius: 10px;-->
<!--  overflow: hidden;-->
<!--  transition: transform 0.2s ease-in-out;-->
<!--}-->

<!--/* 鼠标悬停放大效果 */-->
<!--.custom-card:hover {-->
<!--  transform: translateY(-2px);-->
<!--}-->

<!--/* 卡片内文字样式 */-->
<!--.custom-card .van-card__title {-->
<!--  font-size: 13px;-->
<!--  line-height: 1.4;-->
<!--  font-weight: 500;-->
<!--}-->

<!--.custom-card .van-card__desc {-->
<!--  font-size: 12px;-->
<!--  color: #555;-->
<!--}-->

<!--/* 分页居中 */-->
<!--.pagination-wrapper {-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  margin-top: 24px;-->
<!--}-->

<!--/* 卡片按钮样式 */-->
<!--.van-card__footer .action-btn {-->
<!--  margin: 0 4px;-->
<!--  font-size: 11px;-->
<!--  padding: 0 10px;-->
<!--}-->

<!--.van-card__footer {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--}-->
<!--</style>-->
