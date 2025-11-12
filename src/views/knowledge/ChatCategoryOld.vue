<!--<template>-->
<!--  <div class="knowledge-base-page">-->
<!--    &lt;!&ndash; 经验贴列表 &ndash;&gt;-->
<!--    <van-list-->
<!--        v-model="loading"-->
<!--        :finished="finished"-->
<!--        finished-text="没有更多了"-->
<!--        @load="onLoad"-->
<!--    >-->
<!--      <van-cell-->
<!--          v-for="(post, index) in posts"-->
<!--          :key="index"-->
<!--          :title="post.title"-->
<!--          :label="post.summary"-->
<!--          is-link-->
<!--          @click="viewPostDetail(post)"-->
<!--      />-->
<!--    </van-list>-->
<!--    &lt;!&ndash; 底部导航栏 &ndash;&gt;-->
<!--    <main-tab-bar />-->

<!--    &lt;!&ndash; 悬浮加号圆形按钮 &ndash;&gt;-->
<!--    <floating-action-button-->
<!--        :initial-position="buttonPosition"-->
<!--        @click="goToCreatePost"-->
<!--    />-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import MainTabBar from '@/components/MainTabBar.vue'-->
<!--import FloatingActionButton from '@/components/FloatingActionButton.vue'-->
<!--import { List, Cell } from 'vant'-->

<!--export default {-->
<!--  name: 'KnowledgeBasePage',-->
<!--  components: {-->
<!--    VanList: List,-->
<!--    VanCell: Cell,-->
<!--    MainTabBar,-->
<!--    FloatingActionButton-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      posts: [-->
<!--        // 模拟的经验贴数据-->
<!--        {-->
<!--          title: '如何解决常见问题',-->
<!--          summary: '这篇文章介绍了如何解决一些常见的技术问题...',-->
<!--          id: 1-->
<!--        },-->
<!--        {-->
<!--          title: '快速上手指南',-->
<!--          summary: '这篇经验贴为新手提供了一些快速上手的技巧...',-->
<!--          id: 2-->
<!--        }-->
<!--      ],-->
<!--      loading: false,-->
<!--      finished: true,-->
<!--      // 悬浮按钮的初始位置-->
<!--      buttonPosition: {-->
<!--        bottom: 80,-->
<!--        right: 20-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    goToCreatePost() {-->
<!--      this.$router.push('/sensor_ddingWork/Release/create_post') // 跳转到创建页面-->
<!--    },-->
<!--    viewPostDetail(post) {-->
<!--      this.$router.push(`/sensor_ddingWork/Release/post-detail/${post.id}`)-->
<!--    },-->
<!--    onLoad() {-->
<!--      // 模拟加载更多数据-->
<!--      setTimeout(() => {-->
<!--        this.loading = false-->
<!--        this.finished = true-->
<!--      }, 1000)-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.knowledge-base-page {-->
<!--  padding-bottom: 50px;-->
<!--}-->

<!--.van-cell__title {-->
<!--  font-weight: bold;-->
<!--  font-size: 16px;-->
<!--}-->

<!--.van-cell__label {-->
<!--  white-space: normal;-->
<!--  color: #666;-->
<!--  font-size: 14px;-->
<!--  margin-top: 4px;-->
<!--}-->
<!--</style>-->
