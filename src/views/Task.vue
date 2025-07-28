<template>
  <div class="task-page">
    <!-- 页面标题 -->
    <van-nav-bar
        title="任务"
        @click-left="handleSearchClick"
        @click-right="handleAddClick"
    >
      <!-- 左侧：搜索图标 -->
      <template #left>
        <van-icon name="search" size="18" />
      </template>
      <!-- 右侧：新增按钮 -->
      <template #right>
        <van-icon name="plus" size="18" />
      </template>
    </van-nav-bar>



    <!-- 标签页 -->
<!--
        background="#f5f5f5"          背景色
    color="#1989fa"              激活项颜色
    title-active-color="#1989fa" 选中文字颜色
    title-inactive-color="#666"  未选中文字颜色
    line-width="30px"            滑块宽度
    line-height="3px"            滑块高度 -->
    <van-tabs
        v-model="activeTab"
        animated
        swipeable
        class="task-tabs"
        background="#f5f5f5"
    color="#1989fa"
    title-active-color="#1989fa"
    title-inactive-color="#666"
    line-width="30px"
    line-height="3px"
    >
    <van-tab title="我参与的">
      <div class="tab-content">
        <p>这里是“我参与的”任务列表。</p>
      </div>
    </van-tab>
    <van-tab title="我负责的">
      <div class="tab-content">
        <p>这里是“我负责的”任务列表。</p>
      </div>
    </van-tab>
    <van-tab title="我分配的">
      <div class="tab-content">
        <p>这里是“我分配的”任务列表。</p>
      </div>
    </van-tab>
    <van-tab title="我创建的">
      <div class="tab-content">
        <p>这里是“我创建的”任务列表。</p>
      </div>
    </van-tab>
    <van-tab title="状态审批">
      <div class="tab-content">
        <p>这里是“状态审批”任务列表。</p>
      </div>
    </van-tab>
    </van-tabs>

    <!-- 底部导航栏 -->
    <main-tab-bar />
  </div>
</template>

<script>
import MainTabBar from '@/components/MainTabBar.vue'
import {NavBar, Tabs, Tab, Icon,Toast} from 'vant'

export default {
  name: 'TaskPage',
  components: {
    MainTabBar,
    VanNavBar: NavBar,
    VanTabs: Tabs,
    VanTab: Tab,
    VanIcon: Icon
  },
  data() {
    return {
      activeTab: 0 // 默认激活第一个 tab
    }
  },
  methods: {
    handleSearchClick() {
      // 跳转到搜索页面，例如：
      // this.$router.push('/task-search') // 假设你的搜索页路径为 /task-search

      // 或者执行其他查询逻辑，比如弹出搜索框、触发 API 请求等
      console.log('执行查询任务操作')
      // alert('执行查询任务操作')
      Toast.success('执行查询任务操作 !')
    },
    handleAddClick() {
      console.log('点击了新增按钮')
      // alert('新增任务功能暂未实现')
      Toast.success('点击了新增按钮 ！')
    }
  }
}
</script>

<style scoped>
.task-page {
  padding-bottom: 50px; /* 留出底部 tabbar 的空间 */
}

/* 可选：修改 van-nav-bar 样式 */
.van-nav-bar {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.van-nav-bar__title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 标签页样式 */
.task-tabs {
  margin-top: 10px;
  padding: 0 10px;
  --van-tabs-card-background: #f5f5f5; /* 卡片模式下背景色 */
}

.task-tabs /deep/ .van-tab__title {
  font-size: 14px;
  font-weight: normal;
}

.task-tabs /deep/ .van-tab--active .van-tab__title {
  font-weight: bold;
  color: #1989fa !important;
}

.tab-content {
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>
