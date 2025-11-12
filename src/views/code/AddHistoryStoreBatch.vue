<template>
  <div style="padding-top: 60px; transform: scale(0.9); transform-origin: top left;">
    <div style="text-align: center;">
      <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;晟思资产批量出入库表单</h2>
    </div>
    <el-form ref="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="资产编号:">
            <el-input v-model="form.productIds" type="textarea" placeholder="资产编号列表" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="资产类型:">
            <span>{{ form.productType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="资产状态:">
            <span>{{ form.productState }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="记录人:">
            <span>{{ form.currentLocation }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传文件:">
            <el-button type="primary" @click="handleFileSelect">拍照/视频</el-button>
            <input id="fileInput" type="file" ref="fileInput" multiple accept="image/*,video/*"
                   @change="handleFileChange" style="display: none;">
            <div v-for="(file, index) in form.fileList" :key="index">
              <el-image :src="file.content" v-if="file.type === 'image'"                style="max-width: 100px; max-height: 100px;"></el-image>
              <video v-else-if="file.type === 'video'" :src="file.content" controls                style="max-width: 100px; max-height: 100px;"></video>
              <i class="el-icon-delete" @click="deleteFile(index)"></i>
            </div>
            <div style="display: block; font-size: 12px; color: #888;">
              支持一次上传一个/多个文件，但不是必选项，若无法描述清楚，或需操作多步骤时应拍照/视频
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="">
            <el-button @click="clearFiles" style="width: 60%">
              清除所有选择文件
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="* 说明备注:">
            <el-select v-model="form.operation" style="width: 80%" placeholder="请选择操作类型">
              <el-option
                v-for="option in operationOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.operation === '入库并领用'" label="* 归属项目:">
            <el-select
              v-model="form.belongContent" style="width: 80%" placeholder="请选择所属项目">
              <el-option v-for="option in belongContents" :key="option.value" :label="option.label" :value="option.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <div style="text-align: center;">
              <el-button  type="primary" @click="saveDataToBackend" :loading="loading" style="margin-bottom: 10px; width: 27%">
                <span v-if="!loading">保存</span>
                <span v-else>上传中<i class="el-icon-loading"></i></span>
              </el-button>
              <el-button @click="goBack" style="margin-bottom: 10px; width: 50%">
                返回查看页面
              </el-button>
              <el-button @click="goBack1" style="margin-bottom: 30px; width: 83%">
                返回扫码首页
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import SensorBorderRequest from "../../utils/sensorBorder.js";
import {
  key_DingName,
  key_DingScannedResult,
  key_DingUserIndex,
  cachedProductId,
  cachedProductPerson,
  cachedPersonIndex,
  key_DingResponseStored, key_DingResponseUsed, cachedResponseStored, cachedResponseUsed
} from "@/utils/Dingding";

export default {
  data() {
    return {
      form: {
        productType:'',
        productIds:'',
        productState:this.getProductState(),
        currentLocation: this.getProductPerson(),
        fileList: [],
        operation: '', // 添加操作种类
        productBelong:null,  //具体归属项目
        belongContent:'' //归属项目
      },
      loading: false,
      operationOptions: [
        // { label: '入库', value: '入库' },
        { label: '入库并领用', value: '入库并领用' }],
      belongContents:[] //获取领用时候的归属项目
    };
  },
  created() {
    // 从查询参数中获取扫码结果
    this.form.productIds = this.$route.query.results || '';
    this.fetchObjectTypeBatch();
    this.getProductState();
    this.fetchBelongOptions();

  },
  methods: {
    fetchBelongOptions() {

      SensorBorderRequest.fetchBelongContent((response) => {
        // this.belongContents = response; // 将成功返回的数据赋值到 belongContents
        // 假设返回的内容是一个字符串，我们需要将其转换为对象数组
        const respData = response;
        console.log("respData",respData)
        // 将数组转换为对象数组
        this.belongContents = respData.map(item => {
          return {
            label: item, // 显示的文本
            value: item  // 绑定的值
          };
        });
      }, (error) => {
        console.error(error);
        this.$message({
          message: error,
          type: 'error'
        });
      });
    },
    getProductState() {
      const storedProductState = sessionStorage.getItem(key_DingResponseStored)+ "—" + sessionStorage.getItem(key_DingResponseUsed) || cachedResponseStored+ "-"+cachedResponseUsed;
      // const storedProductState = cachedResponseStored+ "—" +cachedResponseUsed;
      console.log('getProductState 是: ', storedProductState);
      return storedProductState;
    },

    fetchObjectTypeBatch() {

      const results = this.$route.query.results || '';
      let storedProductId = '';
      if (results) {
        try {
          const parsedResults = JSON.parse(results);
          if (Array.isArray(parsedResults) && parsedResults.length > 0) {
            storedProductId = parsedResults[0];
            // alert('storedProductId:'+ storedProductId)
          } else {
            alert('解析结果为空或不是数组');
          }
        } catch (error) {
          alert('解析 JSON 字符串时出错:'+ error);
        }
      }
      if (!storedProductId) {
        storedProductId = '暂无配置，无法获取';
      }
      let param = { 'storedProductId': storedProductId };
      SensorBorderRequest.fetchObjectTypeContent(param, (response) => {
        // 假设返回的数据是一个数组
        if (Array.isArray(response) && response.length > 0) {
          this.form.productType = response[0]; // 将第一个字符串赋值给 productType
          console.log("response[0] 是：", response[0]);
        } else { // 如果数组为空，设置默认值
          this.form.productType = '暂无配置，无法获取';
        }
      }, (error) => {
        console.error(error);
        this.$message({
          message: error,
          type: 'error'
        });
      });
  },
    getProductId() {
      const storedProductId = sessionStorage.getItem(key_DingScannedResult) || cachedProductId;
      console.log('cachedProductId 是: ', cachedProductId);
      return storedProductId; // 返回存储的产品 ID 或者 cachedProductId
    },
    getPersonIndex() {
      const storedPersonIndex = sessionStorage.getItem(key_DingUserIndex) || cachedPersonIndex;
      console.log('cachedPersonIndex 是: ', cachedPersonIndex);
      return storedPersonIndex; // 返回存储的产品 ID 或者 cachedPersonIndex
    },
    getProductPerson() {
      const storedProductPerson = sessionStorage.getItem(key_DingName) || cachedProductPerson;
      console.log('cachedProductPerson 是: ', cachedProductPerson);
      return storedProductPerson;
    },
    handleFileSelect() {
      console.log('文件选择操作触发');
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      console.log('文件改变事件触发');
      let files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // 检查文件类型是否符合要求
        if (!this.checkFileType(file)) {
          alert('文件格式不符合要求，图片只能识别png、jpg、jpeg，视频只能识别mp4、avi、mov !');
          continue;
        }
        const reader = new FileReader();
        reader.onload = e => {
          let fileType = file.type.includes('video') ? 'video' : 'image';
          this.form.fileList.push({ content: e.target.result, type: fileType, file: file });
        };
        reader.readAsDataURL(file);
      }
    },
    checkFileType(file) {
      const imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      const videoTypes = ['video/mp4', 'video/avi', 'video/quicktime'];
      if (file.type.includes('image')) {
        return imageTypes.includes(file.type);
      } else if (file.type.includes('video')) {
        return videoTypes.includes(file.type);
      }
      return false;
    },
    cancel() {
      this.form.fileList = [];
      this.form.desc = '';
    },
    deleteFile(index) {
      this.form.fileList.splice(index, 1);
    },
    clearFiles() {
      this.form.fileList = [];
    },
    resetTestingFields() {
    },
    fetchProductBelongOptions() {

      const storedProductId = sessionStorage.getItem(key_DingScannedResult) || cachedProductId;
      let param = { 'storedProductId': storedProductId };
      SensorBorderRequest.fetchProductBelongContent(param,(response) => {
        console.log("respData",response)
        const respData = response;
        console.log('from before assignment:', this.form); // 调试信息
        this.form.productBelong = respData; // 将成功返回的数据赋值到 productBelong 上
      }, (error) => {
        console.error(error);
        this.$message({
          message: error,
          type: 'error'
        });
      });
    },
    fetchWeldingOptions() {
      const storedProductId = sessionStorage.getItem(key_DingScannedResult) || cachedProductId;
      let param = { 'storedProductId': storedProductId };
      SensorBorderRequest.fetchWeldingOptionContent(param,(response) => {
        // this.belongContents = response; // 将成功返回的数据赋值到 belongContents
        // 假设返回的内容是一个字符串，我们需要将其转换为对象数组
        const respData = response;
        console.log("respData",respData)
        // 将数组转换为对象数组
        this.weldingOptions = respData.map(item => {
          return {
            label: item, // 显示的文本
            value: item  // 绑定的值
          };
        });
      }, (error) => {
        console.error(error);
        this.$message({
          message: error,
          type: 'error'
        });
      });
    },
    fetchAssembleOptions() {
      const storedProductId = sessionStorage.getItem(key_DingScannedResult) || cachedProductId;
      let param = { 'storedProductId': storedProductId };
      SensorBorderRequest.fetchAssembleOptionContent(param,(response) => {
        // this.belongContents = response; // 将成功返回的数据赋值到 belongContents
        // 假设返回的内容是一个字符串，我们需要将其转换为对象数组
        const respData = response;
        console.log("respData",respData)
        // 将数组转换为对象数组
        this.assembleOptions = respData.map(item => {
          return {
            label: item, // 显示的文本
            value: item  // 绑定的值
          };
        });
      }, (error) => {
        console.error(error);
        this.$message({
          message: error,
          type: 'error'
        });
      });
    },
    toBase64(file, callback) {
      console.log('开始转换文件为Base64编码');
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        callback(base64);
      };
      reader.onerror = error => {
        console.error('Error converting file to base64:', error);
      };
    },
    saveDataToBackend() {
      console.log('开始保存数据到后端');
      if (!this.form.operation) {
        alert('请完成备注后再保存！');
        return;
      }
      this.loading = true; // 开始保存时显示loading图标

      const productIds = this.form.productIds.split('\n').map(id => id.trim()).filter(id => id);

      if (productIds.length === 0) {
        alert('请至少输入一个资产编号！');
        this.loading = false;
        return;
      }

      const savePromises = productIds.map(productId => {
        const reqData = {
          productId: productId,
          currentLocation: this.form.currentLocation,
          operation: this.form.operation, // 添加操作种类
          fileList: this.form.fileList.length === 0 ? null : [], // 根据文件列表是否为空初始化 fileList
          userIndex: this.getPersonIndex(),
          weldingContent: this.form.weldingContent, // 焊接具体内容
          testingContent: this.form.testingContent, // 测试具体内容
          failureReason: this.form.failureReason, // 测试失败原因
          questReason: this.form.questReason, // 问题描述
          assembleContent: this.form.assembleContent, // 装配描述
          isUsed: sessionStorage.getItem(key_DingResponseUsed) || cachedResponseUsed,
          isStored: sessionStorage.getItem(key_DingResponseStored) || cachedResponseStored,
          belongContent: this.form.belongContent // 归属项目
        };

        // 如果 fileList 不为空，进行 Base64 转换
        if (this.form.fileList.length > 0) {
          const promises = this.form.fileList.map(file => {
            return new Promise((resolve) => {
              this.toBase64(file.file, base64 => {
                reqData.fileList.push({
                  content: base64,
                  type: file.type,
                });
                resolve();
              });
            });
          });
          // 等待所有文件转换完成后再发送请求
          return Promise.all(promises)
            .then(() => {
              // 发送请求到后端
              return SensorBorderRequest.SaveAllCardRecords(reqData);
            });
        } else {
          // 如果 fileList 为空，直接发送请求
          return SensorBorderRequest.SaveAllCardRecords(reqData);
        }
      });
      // 等待所有保存请求完成
      Promise.all(savePromises)
        .then(responses => {
          console.log('所有记录保存成功:', responses);
          this.$message.success('所有记录保存成功!');
          setTimeout(() => {
            this.resetTestingFields(); // 重置表单字段
            this.$router.push("/ddinguia/web/history222");
          }, 500); // 0.5 秒后跳转
        })
        .catch(error => {
          console.error('保存失败:', error);
          this.$message.error('保存失败！');
        })
        .finally(() => {
          this.loading = false; // 保存完成后取消loading状态
        });
    },
    goBack() {
      this.$router.push({ path: '/ddinguia/web/history222' });
    },
    goBack1() {
      this.$router.push({ path: '/ddinguia/web/home' });
    },
  },
};
</script>
