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
    // 加载收到的分享文件数据
    loadReceivedData() {
      this.receivedLoading = true;

      const userInfo = getLocalUserInfo();
      const param = {
        Person_Phone: userInfo.phone
      };

      SensorRequest.GetSharedFileWithMeFun(
          JSON.stringify(param),
          (respData) => {
            let JSON_Data =  JSON.parse(respData)
            // 成功回调
            this.receivedList = JSON_Data || [];
            this.receivedLoading = false;
            this.receivedFinished = true;
            this.isLoading = false;
          },
          (error) => {
            // 失败回调
            console.error('获取收到的分享文件失败:', error);
            this.receivedLoading = false;
            this.receivedFinished = true;
            this.isLoading = false;
          }
      );
    },

    // 加载发送的分享文件数据
    loadSentData() {
      this.sentLoading = true;

      const userInfo = getLocalUserInfo();
      const param = {
        Person_Phone: userInfo.phone
      };

      SensorRequest.GetPersonSharedFileFun(
          JSON.stringify(param),
          (respData) => {
            let JSON_Data =  JSON.parse(respData)
            // 成功回调
            this.sentList = JSON_Data || [];
            this.sentLoading = false;
            this.sentFinished = true;
            this.isLoading = false;
          },
          (error) => {
            // 失败回调
            console.error('获取发送的分享文件失败:', error);
            this.sentLoading = false;
            this.sentFinished = true;
            this.isLoading = false;
          }
      );
    },

    // 下拉刷新
    onRefresh() {
      if (this.activeTab === 0) {
        this.loadReceivedData();
      } else {
        this.loadSentData();
      }
    },

    handleDownload(file) {
      utilsDownloadFile(file);
    },

    handlePreview(file) {
      utilsPreviewFile(file);
    },

    formatDesc(item) {
      return `来自: ${item.Sender || '未知'}  ${item.Create_Time || ''}`;
    },

    formatSentDesc(item) {
      return `发送给: ${item.Receiver || '未知'}  ${item.Create_Time || ''}`;
    },

    formatSharedType(type) {
      const types = {
        1: '文件',
        2: '文件夹',
        // 可以根据需要添加更多类型
      };
      return types[type] || '未知';
    },

    getLocalImage(item) {
      // 根据文件类型返回相应的图标
      if (!item || !item.File_Name) {
        return require('@/assets/sensor.png');
      }

      // 获取文件扩展名
      const fileName = item.File_Name;
      const lastDotIndex = fileName.lastIndexOf('.');

      if (lastDotIndex === -1) {
        return require('@/assets/sensor.png');
      }

      const extension = fileName.substring(lastDotIndex + 1).toLowerCase();

      // 根据扩展名返回对应的图标
      const iconMap = {
        'doc': 'word.png',
        'docx': 'word.png',
        'xls': 'excel.png',
        'xlsx': 'excel.png',
        'ppt': 'ppt.png',
        'pptx': 'pptx.png',
        'pdf': 'PDF.png',
        'txt': 'txt.png'
      };

      const iconFile = iconMap[extension];
      if (iconFile) {
        return require(`@/assets/${iconFile}`);
      }

      // 默认返回 sensor.png 图标
      return require('@/assets/sensor.png');
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
