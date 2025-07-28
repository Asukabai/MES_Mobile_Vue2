<template>
  <div>
    <!-- 添加加载状态的判断 -->
    <div v-if="isLoading">
      <h2>{{ boardID }}资产记录列表</h2>
      <div class="loading-message">
        数据加载中...
      </div>
    </div>
    <!-- 数据加载完成后显示最近的三条内容，如果点击查看所有历史内容可以另外点击 -->
    <div v-else>
      <h2>{{ boardID }}资产记录列表</h2>
      <div class="return-button-container">
        <div class="button-row">
          <el-button  @click="goBackQR">返回扫码界面</el-button>
          <el-button  @click="resetForm">重置表单记录</el-button>
          <!--          <el-button  @click="goBackADD">继续新增记录</el-button>-->
        </div>
        <!--        <div class="button-row">-->
        <!--&lt;!&ndash;          <el-button  @click="queryByPerson">查看本人记录</el-button>&ndash;&gt;-->
        <!--          <el-button  @click="resetForm">重置表单记录</el-button>-->
        <!--        </div>-->
        <div style="height: 5px;"></div>
        <div class="button-row">
          <el-select v-model="selectedCategory" placeholder="请选择分类" style="margin-left: 5px;">
            <el-option
                v-for="item in categories"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <el-button size="small" @click="queryByCategory">分类加载记录</el-button>
        </div>
      </div>
      <div  v-if="count !== 0" class="empty-message" >
        该分类下的记录数量为：{{ count }} 条
      </div>
      <!-- 添加虚线分隔 -->
      <div class="separator"></div>
      <div class="card-list">
        <CardItem v-for="(record, index) in cardRecords" :key="index" :record="record"/>
      </div>
      <!-- 添加条件判断，当数据为空时展示提示信息 -->
      <div v-if="cardRecords.length === 0" class="empty-message">
        暂无记录数据，请上传数据后再查看。
      </div>
      <!-- 显示最近的三条内容提示，条件为 cardRecords.length 不为空 且 selectedCategory 为空 -->
      <div v-if="cardRecords.length > 0 && !selectedCategory" style="display: block; font-size: 12px; color: #888;" >
        默认显示最近一条记录，若查看所有记录，可分类加载。
      </div>
    </div>
  </div>
</template>
<script>
import CardItem from '../../components/CardItem.vue'; // 引入 CardItem 组件
import SensorBorderRequest from "../../utils/sensorBorder.js";
import systemConfigure, {
  cachedProductId,
  cachedProductPerson,
  key_DingName,
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
      this.$router.push({path:"/sensor_ddingWork/Release/home"})},

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
        Asset_Code: this.boardID};
      SensorRequest.GetAssetOperationInfoByAssetCodeFun(JSON.stringify(requestData), response => {
        if (systemConfigure.isDebugMode) {
          console.log('Received response data: ' + JSON.stringify(response)); }
        console.log('Received response data :', response); // 打印日志
        alert('Received response data :'+ response); // 打印日志
        let   JSON_response  = JSON.parse(response);
        if (Array.isArray(JSON_response) && JSON_response.length > 0) {
          this.cardRecords = JSON_response.map(item => this.parseData(item)).reverse();} else {
          alert('Error fetching card records: Data is empty')
          console.error('Error fetching card records: Data is empty');
        }
        // 数据加载完成后将 isLoading 设置为 false
        this.isLoading = false;
      }, error => {
        console.error('Error fetching card records:', error);
        this.isLoading = false;
      });},
    queryByCategory() {
      const requestData = {
        productId: this.boardID,
        selectedCategory:this.selectedCategory};
      if (this.selectedCategory) {
        SensorBorderRequest.GetCategoryRecords(requestData, response => {
          if (systemConfigure.isDebugMode) {
            console.log('Received response data: ' + JSON.stringify(response)); }
          console.log('Received response data :', response); // 打印日志
          if (Array.isArray(response) && response.length > 0) {
            // 提取 count 字段
            this.count = response.length;
            this.cardRecords = response.map(item => this.parseData(item)).reverse();
            console.log("保存 count:"+response.length);
            this.$message({
              message: '分类加载成功 ！',
              type: 'success',
              duration: 2000, // 2秒后自动关闭
              showClose: true // 显示关闭按钮
            })
          } else {
            this.count = response.length;
            this.cardRecords = []; // 设置为空数组
            this.$message({
              message: '此分类数据: Data is empty ！',
              type: 'info',
              duration: 2000, // 2秒后自动关闭
              showClose: true // 显示关闭按钮
            })}
          // 数据加载完成后将 isLoading 设置为 false
          this.isLoading = false;
        }, error => {
          console.error('Error fetching card records:', error);
          this.$message({
            message: error,
            type: 'error',
            duration: 2000, // 2秒后自动关闭
            showClose: true // 显示关闭按钮
          })
          this.isLoading = false;})
      } else {
        this.$message({
          message: '请先选择分类！',
          type: 'info',
          duration: 2000, // 2秒后自动关闭
          showClose: true // 显示关闭按钮
        })
      }
    },
    queryByPerson() {
      const storedProductPerson = sessionStorage.getItem(key_DingName) || cachedProductPerson;
      const requestData = {
        storedProductPerson:storedProductPerson};
      SensorBorderRequest.GetPersonRecords(requestData, response => {
            if (systemConfigure.isDebugMode) {
              console.log('Received response data: ' + JSON.stringify(response)); }
            console.log('Received response data :', response); // 打印日志
            if (Array.isArray(response) && response.length > 0) {
              // 提取 count 字段
              this.count = response.length;
              this.cardRecords = response.map(item => this.parseData(item)).reverse();
              console.log("保存 count:"+response.length);
              this.$message({
                message: '查询本人记录成功 ！',
                type: 'success',
                duration: 2000, // 2秒后自动关闭
                showClose: true // 显示关闭按钮
              })
            } else {
              this.count = response.length;
              this.cardRecords = []; // 设置为空数组
              // 数据加载完成后将 isLoading 设置为 false
              this.$message({
                message: '本人表单记录为空: Data is empty ！',
                type: 'info',
                duration: 2000, // 2秒后自动关闭
                showClose: true // 显示关闭按钮
              });}
            this.isLoading = false;
          },
          (error) => {
            console.error(error);
            this.$message({
              message: error,
              type: 'error'
            });
            this.isLoading = false;
          });
    },
    parseData(data) {
      return {
        currentLocation: data.Operation_User.Person_Name, // record.currentLocation 对应的是 Person_Name
        createTime: data.Ts_create, // record.createTime 对应的是 Ts_create
        operation: data.Operation_Type, // 操作分类 record.operation 对应的是 Operation_Type
        description: data.Operation_Description, // record.description 对应的是 Operation_Description
        files: data.Operation_Evidence ? [ // record.files 文件对应的是 Operation_Evidence
          {
            id: 0,
            fileUrl: data.Operation_Evidence,
            type: 'image' // 默认为图片，可以根据实际需求调整
          }
        ] : [] // 如果为 null，说明没有要解析的文件，就不用展示了
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
  width: 100%; /* 设置宽度以对齐三行 */
}

.button-row {
  display: flex;
  justify-content: center; /* 居中排列 */
  margin-bottom: 10px; /* 每行之间的间距 */
}

.button-row el-button,
.button-row el-select {
  margin: 0 5px; /* 按钮和下拉框之间的间距 */
}
</style>
