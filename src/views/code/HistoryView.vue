<template>
  <div>
    <!-- 添加加载状态的判断 -->
    <div v-if="isLoading">
      <h3 style="text-align: center;">{{ boardID }}记录列表</h3>
      <div class="loading-message">
        数据加载中...
      </div>
    </div>
    <!-- 数据加载完成后显示最近的三条内容，如果点击查看所有历史内容可以另外点击 -->
    <div v-else>
      <h3 style="text-align: center;">{{ boardID }}记录列表</h3>
      <div class="return-button-container">
        <div class="button-row">
          <el-button  @click="goBackQR">返回扫码界面</el-button>
          <el-button  @click="resetForm">重置表单记录</el-button>
        </div>
        <div style="height: 5px;"></div>
      </div>
      <div  v-if="count !== 0" class="empty-message" >
        该资产的操作记录数量为：{{ count }} 条
      </div>
      <!-- 添加虚线分隔 -->
      <div class="separator"></div>
      <div class="card-list-container">
        <CardItem v-for="(record, index) in cardRecords" :key="index" :record="record"/>
      </div>
      <!-- 添加条件判断，当数据为空时展示提示信息 -->
      <div v-if="cardRecords.length === 0" class="empty-message">
        暂无记录数据，请上传数据后再查看。
      </div>
      <!-- 显示所有内容的提示 -->
      <div v-if="cardRecords.length > 0" style="display: block; font-size: 12px; color: #888; text-align: center; margin-top: 10px;">
        以上为该资产的所有操作记录
      </div>
    </div>
  </div>
</template>
<script>
import CardItem from '../../components/CardItem.vue'; // 引入 CardItem 组件
import systemConfigure, {
  cachedProductId,
  key_DingScannedResult
} from "../../utils/Dingding.js";
import SensorRequest from "@/utils/SensorRequest";

export default {
  components: {
    CardItem },
  data() {
    return {
      isLoading: true,
      cardRecords: [] ,// 记录列表数据
      boardID: this.getProductId(), // 调用方法获取产品 ID,
      selectedCategory: '',
      categories: [
        { value: '入库', label: '入库' },
        { value: '领用', label: '领用' },
        { value: '焊接', label: '焊接' },
        { value: '测试', label: '测试' },
        { value: '装配', label: '装配' },
        { value: '其他', label: '其他' },
        { value: '问题描述', label: '问题描述' },
        { value: '全部', label: '全部' }
      ],
      count: 0 };
  },
  created() {
    this.getAllCardRecordsWithImages();
  },
  methods: {
    getProductId() {
      // alert(cachedProductId);
      return sessionStorage.getItem(key_DingScannedResult) || cachedProductId; // 返回存储的产品 ID 或者 cachedProductId
    },
    goBackQR() {
      this.$router.push({path:"/home"})},

    resetForm(){
      this.count = 0; // 正确重置 count
      this.getAllCardRecordsWithImages();
      this.$message({
        message: '重置记录成功 ！',
        type: 'success',
        duration: 2000, // 2秒后自动关闭
        showClose: true // 显示关闭按钮
      })
    },
    getAllCardRecordsWithImages() {
      const requestData = {
        Asset_Code: this.boardID
      };
      SensorRequest.GetAssetOperationInfoByAssetCodeFun(JSON.stringify(requestData), response => {
        if (systemConfigure.isDebugMode) {
          console.log('Received response data: ' + JSON.stringify(response));
        }
        console.log('Received response data :', response); // 打印日志
        // alert('Received response data :'+ response); // 打印日志
        let JSON_response = JSON.parse(response);
        if (Array.isArray(JSON_response) && JSON_response.length > 0) {
          // 确保处理所有返回的数据
          this.cardRecords = JSON_response.map(item => this.parseData(item)).reverse();
          this.count = this.cardRecords.length; // 更新计数
        } else {
          // alert('Error fetching card records: Data is empty')
          console.error('Error fetching card records: Data is empty');
          this.cardRecords = []; // 确保在没有数据时清空数组
          this.count = 0;
        }
        // 数据加载完成后将 isLoading 设置为 false
        this.isLoading = false;
      }, error => {
        console.error('Error fetching card records:', error);
        this.isLoading = false;
        this.cardRecords = []; // 出错时清空数组
        this.count = 0;
      });
    },
    parseData(data) {
      // 修复：正确解析数据格式，特别是Operation_Evidence部分
      const files = [];
      // 处理Operation_Evidence可能为null的情况
      if (data.Operation_Evidence && Array.isArray(data.Operation_Evidence)) {
        data.Operation_Evidence.forEach((evidence, index) => {
          // 检查是否有实际的Base64数据
          if (evidence.File_Base64 && evidence.File_Base64 !== "") {
            // 根据文件名确定MIME类型，如果没有文件名则默认为image/jpeg
            let mimeType = 'image/jpeg';
            if (evidence.File_Name) {
              if (evidence.File_Name.match(/\.(jpg|jpeg)$/i)) {
                mimeType = 'image/jpeg';
              } else if (evidence.File_Name.match(/\.png$/i)) {
                mimeType = 'image/png';
              } else if (evidence.File_Name.match(/\.gif$/i)) {
                mimeType = 'image/gif';
              } else if (evidence.File_Name.match(/\.(mp4|avi|mov)$/i)) {
                mimeType = 'video/mp4';
              }
            }

            files.push({
              id: index,
              fileUrl: evidence.File_Base64,
              type: mimeType.includes('image') ? 'image' : 'video'
            });
          }
        });
      }

      return {
        currentLocation: data.Operation_User?.Person_Name || '', // record.currentLocation 对应的是 Person_Name
        createTime: data.Ts_create || '', // record.createTime 对应的是 Ts_create
        operation: data.Operation_Type || '', // 操作分类 record.operation 对应的是 Operation_Type
        description: data.Operation_Description || '', // record.description 对应的是 Operation_Description
        files: files // 正确解析文件数据
      };
    }
  }
};
</script>
<style scoped>
.empty-message {
  text-align: center;
  color: #999;
  margin-top: 20px;
}

.container {
  padding: 20px;
}

.loading-container {
  text-align: center;
}

.separator {
  border-top: 1px dashed #ccc; /* 虚线分隔 */
  margin: 20px 0; /* 上下间隔 */
}

.card-list {
  margin-top: 10px;
  width: 100%; /* 确保卡片列表占满容器宽度 */
  box-sizing: border-box; /* 包含内边距和边框 */
  padding: 0; /* 移除默认内边距 */
}

/* 移动端优化 */
@media (max-width: 768px) {
  .card-list {
    padding: 0 5px; /* 小屏幕上的小内边距 */
  }
}

@media (max-width: 480px) {
  .card-list {
    padding: 0; /* 超小屏幕上无内边距 */
  }
}

.info-message {
  display: block;
  font-size: 12px;
  color: #888;
  margin-top: 10px;
}

.return-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box; /* 包含内边距和边框 */
}

.button-row {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  width: 100%; /* 确保按钮行占满容器宽度 */
  box-sizing: border-box;
}

.button-row el-button,
.button-row el-select {
  margin: 0 5px;
}

/* 父组件根元素样式 */
div[style*="text-align: center;"]:first-of-type {
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
}

/* 为整个组件添加响应式容器 */
div > div:not(.card-list):not(.lightbox) {
  width: 100%;
  box-sizing: border-box;
}
</style>
