<template>
  <div style="padding-top: 0px; transform: scale(0.9); transform-origin: center;">
    <el-form ref="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="资产编号:">
            <span>{{ form.productId }}</span>
          </el-form-item>
        </el-col>
        <!-- 添加新的显示项 -->
        <el-col :span="24">
          <el-form-item label="归属项目:">
            <span>{{ form.projectName }}—{{ form.projectCode }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属模块:">
            <span>{{ form.moduleType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模块名称:">
            <span>{{ form.moduleName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="操作类型:">
            <span>{{ form.moduleOperationType }}</span>
          </el-form-item>
        </el-col>
        <!-- 结束添加 -->
        <el-col :span="24">
          <el-form-item label="记录人员:">
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
          <el-form-item v-if="form.operation === '焊接'" label="* 焊接内容:">
            <el-input
                v-model="form.weldingContentText"
                type="textarea"
                style="width: 80%"
                placeholder="请输入焊接内容，多个内容请用逗号分隔">
            </el-input>
          </el-form-item>
          <el-form-item v-if="form.operation === '装配'" label="* 装配内容:">
            <el-input
                v-model="form.assembleContentText"
                type="textarea"
                style="width: 80%"
                placeholder="请输入装配内容，多个内容请用逗号分隔">
            </el-input>
          </el-form-item>
          <el-form-item v-if="form.operation === '测试'" label="* 测试结果:">
            <el-radio-group v-model="form.testingContent">
              <el-radio label="成功">成功</el-radio>
              <el-radio label="失败">失败</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.testingContent === '失败' && form.operation === '测试'" label="* 失败原因:">
            <el-input type="textarea" v-model="form.failureReason" style="width: 80%"
                      placeholder="请简述失败原因"></el-input>
          </el-form-item>
          <el-form-item v-if="form.operation === '问题描述'" label="* 问题描述:">
            <el-input type="textarea" v-model="form.questReason" style="width: 80%"
                      placeholder="请简述遇到的问题/操作"></el-input>
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
import SensorRequest from "../../utils/SensorRequest.js";
import {
  key_DingName,
  key_DingScannedResult,
  key_DingUserIndex,
  cachedProductId,
  cachedProductPerson,
  cachedPersonIndex,
  key_DingResponseStored,
  key_DingResponseUsed,
  cachedResponseStored,
  cachedResponseUsed,
} from "@/utils/Dingding.js";

export default {
  data() {
    return {
      form: {
        productId: this.getProductId(), // 调用方法获取产品 ID,
        currentLocation: this.getProductPerson(),
        productState:this.getProductState(),
        fileList: [],
        operation: '', // 添加操作种类
        weldingContent: [], // 焊接内容（保留用于兼容性）
        weldingContentText: '', // 焊接内容文本
        testingContent: '', // 测试结果
        failureReason: '', // 测试失败原因
        questReason: '', // 问题描述
        assembleContent: [], // 装配描述（保留用于兼容性）
        assembleContentText: '', // 装配内容文本
        projectName: '', // 项目名称
        projectCode: '', // 项目编码
        moduleType: '', // 模块类型
        moduleName: '', // 模块名称
        moduleOperationType: '' // 模块操作类型
      },
      loading: false,
      operationOptions: [
        { label: '焊接', value: '焊接' },
        { label: '测试', value: '测试' },
        { label: '装配', value: '装配' },
        { label: '其他', value: '其他' },
        { label: '问题描述', value: '问题描述' }],
      weldingOptions: [], // 获取 焊接时候的 下拉框内容
      assembleOptions: [], // 获取 装配时候的 下拉框内容
      belongContents:[], //获取领用时候 的归属项目
      isUsed: sessionStorage.getItem(key_DingResponseUsed) || cachedResponseUsed,
      isStored: sessionStorage.getItem(key_DingResponseStored) || cachedResponseStored
    };
  },
  created() {
    this.fetchAssetInfo(); // 添加获取资产信息的调用
  },
  watch: {
    'form.operation': function(newVal) {
      // alert('新的操作类型:'+  newVal);
      this.resetFieldsBasedOnOperation(newVal);
    }
  },
  methods: {
    // 添加获取资产信息的方法
    fetchAssetInfo() {
      const storedProductId = sessionStorage.getItem(key_DingScannedResult) || cachedProductId;
      const param = { Asset_Code: storedProductId };
      // alert("param : "+ JSON.stringify(param))

      SensorRequest.GetAssetInfoByAssetCodeFun(JSON.stringify(param), (response) => {
        let JSON_response = JSON.parse(response)
        // alert("JSON_response :" + response)
        let assetInfo = null;
        // 判断后端返回的数据类型
        if (Array.isArray(JSON_response)) {
          // 如果是数组，取第一个元素
          if (response.length > 0) {
            assetInfo = response[0];
          }
        } else if (JSON_response && typeof JSON_response === 'object') {
          // 如果是对象，直接使用
          assetInfo = JSON_response;
        }
        // 从assetInfo中提取数据
        if (assetInfo) {
          this.form.projectName = assetInfo.Project_Name || '';
          this.form.projectCode = assetInfo.Project_Code || '';
          this.form.moduleType = assetInfo.Module_Type || '';
          this.form.moduleName = assetInfo.Module_Name || '';
          this.form.moduleOperationType = assetInfo.Module_OperationType || '';
        } else {
          this.$message({
            message: '数据解析失败',
            type: 'warning'
          });
        }
      }, (error) => {
        console.error(error);
        this.$message({
          message: '获取资产信息失败: ' + error,
          type: 'error'
        });
      });
    },
    resetFieldsBasedOnOperation(operation) {
      if (operation === '焊接') {
        // alert(operation);
        this.form.testingContent = '';
        this.form.failureReason = '';
        this.form.questReason = '';
        this.form.assembleContent = [];
        this.form.assembleContentText = '';
      } else if (operation === '测试') {
        this.form.weldingContent = [];
        this.form.weldingContentText = '';
        this.form.questReason = '';
        this.form.assembleContent = [];
        this.form.assembleContentText = '';
      } else if (operation === '装配') {
        this.form.weldingContent = [];
        this.form.weldingContentText = '';
        this.form.testingContent = '';
        this.form.failureReason = '';
        this.form.questReason = '';
      } else if (operation === '问题描述') {
        this.form.weldingContent = [];
        this.form.weldingContentText = '';
        this.form.testingContent = '';
        this.form.failureReason = '';
        this.form.assembleContent = [];
        this.form.assembleContentText = '';
      }else if (operation === '其他') {
        this.form.weldingContent = [];
        this.form.weldingContentText = '';
        this.form.testingContent = '';
        this.form.failureReason = '';
        this.form.questReason = '';
        this.form.assembleContent = [];
        this.form.assembleContentText = '';
      }
    },

    getProductState() {
      const storedProductState = sessionStorage.getItem(key_DingResponseStored)+ "—" + sessionStorage.getItem(key_DingResponseUsed) || cachedResponseStored+ "-"+cachedResponseUsed;
      // const storedProductState = cachedResponseStored+ "—" +cachedResponseUsed;
      console.log('getProductState 是: ', storedProductState);
      return storedProductState;
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
      const storedProductPerson = localStorage.getItem(key_DingName) ;
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
      this.form.weldingContent = '';
      this.form.weldingContentText = '';
      this.form.testingContent = '';
      this.form.failureReason = '';
      this.form.questReason = '';
      this.form.assembleContent = '';
      this.form.assembleContentText = '';
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

      // 构造请求体
      const reqData = {
        Asset_Code: this.form.productId,
        Operation_Type: this.form.operation,
        Operation_Description: this.getOperationDescription(),
        Operation_User: {
          Person_DingID: this.getPersonIndex() || "",
          Person_Phone: "",
          Person_Name: this.form.currentLocation || ""
        },
        Operation_Evidence: this.getOperationEvidence()
      };

      // 调用新的接口保存数据
      SensorRequest.AssetOperationInfoAddFun(JSON.stringify(reqData), (response) => {
        console.log('保存成功:', response);
        this.$message.success('保存成功!');
        setTimeout(() => {
          this.resetTestingFields(); // 重置表单字段
          this.$router.push("/code/HistoryView");
        }, 500); // 0.5 秒后跳转
      }, (error) => {
        console.error('保存失败:', error);
        this.$message.error('保存失败！');
        this.loading = false; // 保存完成后取消loading状态
      });
    },
    getOperationDescription() {
      let description = this.form.operation;

      if (this.form.operation === '焊接' && this.form.weldingContentText) {
        description += ": " + this.form.weldingContentText;
      } else if (this.form.operation === '装配' && this.form.assembleContentText) {
        description += ": " + this.form.assembleContentText;
      } else if (this.form.operation === '测试') {
        description += ": " + this.form.testingContent;
        if (this.form.testingContent === '失败' && this.form.failureReason) {
          description += " - " + this.form.failureReason;
        }
      } else if (this.form.operation === '问题描述' && this.form.questReason) {
        description += ": " + this.form.questReason;
      }

      return description;
    },
    getOperationEvidence() {
      // 如果没有上传文件，返回包含空字符串的对象
      if (this.form.fileList.length === 0) {
        return [{
          File_Name: "",
          File_Base64: "",
          File_Md5: "",
          Upload_Time: ""
        }];
      }

      // 如果有上传文件，转换为Base64并构造证据对象
      const evidenceList = [];

      const promises = this.form.fileList.map((file, index) => {
        return new Promise((resolve) => {
          this.toBase64(file.file, base64 => {
            evidenceList.push({
              File_Name: file.file.name || `file_${index}`,
              File_Base64: base64,
              File_Md5: "",
              Upload_Time: new Date().toISOString()
            });
            resolve();
          });
        });
      });

      // 等待所有文件转换完成
      Promise.all(promises).then(() => {
        // 文件转换完成后，可以使用evidenceList
      });

      return evidenceList;
    },
    goBack() {
      this.$router.push({ path: '/code/HistoryView' });
    },
    goBack1() {
      this.$router.push({ path: '/home' });
    },
  },
};
</script>
