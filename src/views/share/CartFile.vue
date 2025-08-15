<template>
  <div class="page-container">
    <!--    <van-nav-bar title="文件分享" />-->
    <!-- 标签页固定在顶部 -->
    <van-tabs v-model="activeTab" animated swipeable class="share-tabs" sticky>
      <!-- 收到的分享文件 -->
      <van-tab title="收到的分享">
        <!-- 下拉刷新组件 -->
        <van-pull-refresh v-model="receivedRefreshing" @refresh="onReceivedRefresh">
          <div class="cards-container">
            <van-list
                :loading="receivedLoading"
                :finished="receivedFinished"
                finished-text="没有更多了"
                @load="loadReceivedData"
            >
              <van-card
                  v-for="item in receivedList"
                  :key="item.ID_SharedFileInfo"
                  :title="`文件名称：${item.File_Name || '未命名文件'}`"
                  :desc="formatDesc(item)"
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
          </div>
        </van-pull-refresh>
      </van-tab>

      <!-- 发送的分享文件 -->
      <van-tab title="发送的分享">
        <!-- 下拉刷新组件 -->
        <van-pull-refresh v-model="sentRefreshing" @refresh="onSentRefresh">
          <div class="cards-container">
            <van-empty description="" v-if="sentList.length === 0 && !sentLoading && sentFinished" />
            <van-list
                :loading="sentLoading"
                :finished="sentFinished"
                finished-text="没有更多了"
                @load="loadSentData"
            >
<!--              <van-card-->
<!--                  v-for="item in sentList"-->
<!--                  :key="item.ID_SharedFileInfo"-->
<!--                  :title="item.File_Name"-->
<!--                  :desc="formatSentDesc(item)"-->
<!--                  class="share-card"-->
<!--              >-->
                <van-card
                  v-for="item in sentList"
                  :key="item.ID_SharedFileInfo"
                  :title="`文件名称：${item.File_Name || '未命名文件'}`"
                  :desc="formatSentDesc(item)"
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
          </div>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
import SensorRequest from '@/utils/SensorRequest';
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
      receivedRefreshing: false,
      sentRefreshing: false,
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
            console.log("加载收到的分享文件数据 JSON_Data : "+respData)
            // 成功回调
            this.receivedList = JSON_Data || [];
            this.receivedLoading = false;
            this.receivedFinished = true;
            this.receivedRefreshing = false;
          },
          (error) => {
            // 失败回调
            console.error('获取收到的分享文件失败:', error);
            this.receivedLoading = false;
            this.receivedFinished = true;
            this.receivedRefreshing = false;
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
            console.log("加载发送的分享文件数据 JSON_Data : "+respData)
            // 成功回调
            // 按时间由近到远排序（假设 Shared_Time 是时间字段）
            if (Array.isArray(JSON_Data)) {
              JSON_Data.sort((a, b) => {
                // 将时间字符串转换为时间戳进行比较
                const timeA = new Date(a.Shared_Time).getTime();
                const timeB = new Date(b.Shared_Time).getTime();
                // 降序排列（由近到远）
                return timeB - timeA;
              });
            }
            this.sentList = JSON_Data || [];
            this.sentLoading = false;
            this.sentFinished = true;
            this.sentRefreshing = false;
          },
          (error) => {
            // 失败回调
            console.error('获取发送的分享文件失败:', error);
            this.sentLoading = false;
            this.sentFinished = true;
            this.sentRefreshing = false;
          }
      );
    },

    // 下拉刷新 - 收到的分享
    onReceivedRefresh() {
      this.receivedRefreshing = true;
      // 重置状态以重新加载数据
      this.receivedFinished = false;
      this.loadReceivedData();
    },

    // 下拉刷新 - 发送的分享
    onSentRefresh() {
      this.sentRefreshing = true;
      // 重置状态以重新加载数据
      this.sentFinished = false;
      this.loadSentData();
    },

    handleDownload(file) {
      utilsDownloadFile(file);
    },

    handlePreview(file) {
      utilsPreviewFile(file);
    },

    formatDesc(item) {
      return `来自: ${item.Person_Name || '未知'} -  ${item.Shared_Time || ''}`;
    },

    formatSentDesc(item) {
      // 获取接收人信息
      let receiver = '未知';
      if (item.Shared_Filebelonginfo && item.Shared_Filebelonginfo.length > 0) {
        // 如果有多个接收人，显示第一个并标明数量
        if (item.Shared_Filebelonginfo.length === 1) {
          receiver = item.Shared_Filebelonginfo[0].Person_Name || item.Shared_Filebelonginfo[0].BelongPerson_Phone || '未知';
        } else {
          receiver = `${item.Shared_Filebelonginfo[0].Person_Name || item.Shared_Filebelonginfo[0].BelongPerson_Phone || '未知'} 等${item.Shared_Filebelonginfo.length}人`;
        }
      } else if (item.Shared_Type === 1) {
        // 公开文件没有特定接收人
        receiver = '所有人';
      }

      let desc = `发送给: ${receiver} -  ${item.Shared_Time || ''}`;

      return desc;
    },

    formatSharedType(type) {
      const types = {
        0: '非公开文件',
        1: '公开文件',
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
      // 图片类型扩展名
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
      if (imageExtensions.includes(extension)) {
        return require('@/assets/image.png');
      }
      // 视频类型扩展名
      const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
      if (videoExtensions.includes(extension)) {
        return require('@/assets/video.png');
      }
      // 默认返回 sensor.png 图标
      return require('@/assets/sensor.png');
    }
  }
};
</script>

<style scoped>
.page-container {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.share-tabs {
  margin-top: 0;
}

.cards-container {
  padding: 10px 2.5%; /* 2.5%的左右padding实现95%宽度 */
}

.share-card {
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 16px; /* 更加圆润 */
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff, #f8f9fa); /* 渐变背景 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
  box-shadow: 0 5px 10px rgba(69, 125, 222, 0.6); /* 改为淡蓝色阴影 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.share-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1); /* 半透明白色遮罩 */
  z-index: 1;
}

.share-card >>> .van-card__content {
  position: relative;
  z-index: 2;
}

.share-card >>> .van-card__header {
  position: relative;
  z-index: 2;
}

.share-card >>> .van-card__body {
  position: relative;
  z-index: 2;
}

.share-card >>> .van-card__footer {
  position: relative;
  z-index: 2;
}

.share-card >>> .van-card__title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.share-card >>> .van-card__desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.share-card:hover {
  transform: translateY(-2px); /* 悬停时轻微上移 */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.van-card__thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px; /* 缩略图也更加圆润 */
}

.van-card__footer .van-button {
  font-size: 12px;
  padding: 0 12px;
  height: 30px;
  margin-left: 8px;
}

.van-tag {
  border-radius: 8px; /* 标签也更加圆润 */
}
</style>
