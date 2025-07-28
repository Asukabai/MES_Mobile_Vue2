<template>
  <div class="page-container">
    <van-nav-bar title="文件分享" />

    <!-- 下拉刷新组件 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 标签页 -->
      <van-tabs v-model="activeTab" animated swipeable class="share-tabs">
        <!-- 收到的分享文件 -->
        <van-tab title="收到的分享">
          <van-list
              :loading="receivedLoading"
              :finished="receivedFinished"
              finished-text="没有更多了"
              @load="loadReceivedData"
          >
            <van-card
                v-for="item in receivedList"
                :key="item.ID_SharedFileInfo"
                :title="item.File_Name"
                :desc="formatDesc(item)"
                :thumb="getLocalImage(item)"
                class="share-card"
            >
              <template #tags>
                <van-tag plain type="danger" style="margin-right: 8px; margin-bottom: 8px;">{{ formatSharedType(item.Shared_Type) }}</van-tag>
                <van-tag plain type="success" v-if="item.Expire_Time" style="margin-right: 8px; margin-bottom: 8px;">有效期至：{{ item.Expire_Time }}</van-tag>
                <van-tag plain type="primary" v-else style="margin-right: 8px; margin-bottom: 8px;">分享文件永久有效</van-tag>
              </template>

              <template #footer>
                <van-button
                    icon="down"
                    round
                    size="small"
                    type="info"
                    @click="handleDownload(item)"
                >下载</van-button>
                <van-button
                    icon="guide-o"
                    round
                    size="small"
                    type="info"
                    @click="handlePreview(item)"
                >预览</van-button>
              </template>
            </van-card>
          </van-list>
        </van-tab>

        <!-- 发送的分享文件 -->
        <van-tab title="发送的分享">
          <van-empty description="" v-if="sentList.length === 0 && !sentLoading" />
          <van-list
              :loading="sentLoading"
              :finished="sentFinished"
              finished-text="没有更多了"
              @load="loadSentData"
          >
            <van-card
                v-for="item in sentList"
                :key="item.ID_SharedFileInfo"
                :title="item.File_Name"
                :desc="formatSentDesc(item)"
                :thumb="getLocalImage(item)"
                class="share-card"
            >
              <template #tags>
                <van-tag plain type="danger" style="margin-right: 8px; margin-bottom: 8px;">{{ formatSharedType(item.Shared_Type) }}</van-tag>
                <van-tag plain type="success" v-if="item.Expire_Time" style="margin-right: 8px; margin-bottom: 8px;">有效期至：{{ item.Expire_Time }}</van-tag>
                <van-tag plain type="primary" v-else style="margin-right: 8px; margin-bottom: 8px;">分享文件永久有效</van-tag>
              </template>

              <template #footer>
                <van-button
                    icon="down"
                    round
                    size="small"
                    type="info"
                    @click="handleDownload(item)"
                >下载</van-button>
                <van-button
                    icon="guide-o"
                    round
                    size="small"
                    type="info"
                    @click="handlePreview(item)"
                >预览</van-button>
              </template>
            </van-card>
          </van-list>
        </van-tab>
      </van-tabs>
    </van-pull-refresh>

    <!-- 底部导航栏 -->
    <MainTabBar />
  </div>
</template>

<script>
import SensorRequest from '@/utils/SensorRequest';
import MainTabBar from '@/components/MainTabBar.vue';
import { key_DingUserPhone } from '@/utils/Dingding';
import { downloadFile as utilsDownloadFile, previewFile as utilsPreviewFile } from '@/utils/fileUtils';

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
  },
  data() {
    return {
      activeTab: 0, // 当前选中的 tab index

      // 收到的分享数据
      receivedList: [],
      receivedLoading: false,
      receivedFinished: false,

      // 发送的分享数据
      sentList: [],
      sentLoading: false,
      sentFinished: false,

      // 下拉刷新状态
      isLoading: false,
    };
  },
  mounted() {
    this.loadReceivedData();
    this.loadSentData(); // 页面加载时也请求发送的数据
  },
  methods: {
    handleDownload(file) {
      console.log('下载文件:', file);
      // 实现文件下载逻辑，例如通过后端接口获取文件流
      alert('正在下载文件...');
    },
    handlePreview(file) {
      console.log('预览文件:', file);
      // 实现文件预览逻辑，例如跳转到预览页面或调用预览接口
      alert('正在预览文件...');
    }
  }
};
</script>

<style scoped>
.page-container {
  padding: 0;
}

.share-tabs {
  margin-top: 16px;
}

.share-card {
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.van-card__title {
  font-size: 14px;
  font-weight: bold;
}

.van-card__desc {
  font-size: 12px;
  color: #666;
}

.van-card__thumb {
  width: 73px;
  height: 73px;
  object-fit: cover;
  border-radius: 4px;
}

.van-card__footer .van-button {
  font-size: 11px;
  padding: 0 8px;
}
</style>
