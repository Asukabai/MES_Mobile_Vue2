<template>
  <div style="padding-top: 60px;">
    <div style="text-align: center;">
      <h2>晟思资产记录表单</h2>
    </div>
    <el-form ref="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="资产编号:">
            <span>{{ form.productId }}</span>
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
              <el-image :src="file.content" v-if="file.type === 'image'"
                        style="max-width: 100px; max-height: 100px;"></el-image>
              <video v-else-if="file.type === 'video'" :src="file.content" controls
                     style="max-width: 100px; max-height: 100px;"></video>
              <i class="el-icon-delete" @click="deleteFile(index)"></i>
            </div>
            <div style="display: block; font-size: 12px; color: #888;" >
              支持一次上传一个/多个文件，但不是必选项，若无法描述清楚，或需操作多步骤时应拍照/视频
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="">
            <el-button @click="clearFiles"  style="width: 60%" >清除所有选择文件</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="* 说明备注:">
            <el-select v-model="form.operation" style="width: 80%" placeholder="请选择操作类型">
              <el-option label="入库" value="入库"></el-option>
              <el-option label="领用" value="领用"></el-option>
              <el-option label="焊接" value="焊接"></el-option>
              <el-option label="测试" value="测试"></el-option>
              <el-option label="装配" value="装配"></el-option>
              <el-option label="其他" value="其他"></el-option>
              <el-option label="问题描述" value="问题描述"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.operation === '焊接'" label="* 焊接内容:">
            <el-select
                v-model="form.weldingContent" multiple style="width: 80%" placeholder="请选择焊接内容">
              <el-option label="连接器" value="连接器"></el-option>
              <el-option label="电源模块" value="电源模块"></el-option>
              <el-option label="电阻" value="电阻"></el-option>
              <el-option label="电容" value="电容"></el-option>
              <el-option label="线缆" value="线缆"></el-option>
              <el-option label="底板" value="底板"></el-option>
              <el-option label="芯片" value="芯片"></el-option>
              <el-option label="继电器" value="继电器"></el-option>
              <el-option label="mos管" value="mos管"></el-option>
              <el-option label="拆器件" value="拆器件"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.operation === '装配'" label="* 装配内容:">
            <el-select
                v-model="form.assembleContent" multiple style="width: 80%" placeholder="请选择装配内容">
              <el-option label="风扇" value="风扇"></el-option>
              <el-option label="散热片" value="散热片"></el-option>
              <el-option label="挡板" value="挡板"></el-option>
              <el-option label="螺柱" value="螺柱"></el-option>
              <el-option label="螺丝" value="螺丝"></el-option>
              <el-option label="线缆" value="线缆"></el-option>
              <el-option label="面板" value="面板"></el-option>
              <el-option label="导热硅脂" value="导热硅脂"></el-option>
              <el-option label="涂胶" value="涂胶"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.operation === '测试'" label="* 测试结果:">
            <el-radio-group v-model="form.testingContent" >
              <el-radio label="成功">成功</el-radio>
              <el-radio label="失败">失败</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.testingContent === '失败'&& form.operation === '测试'" label="* 失败原因:">
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
            <el-button type="primary" @click="saveDataToBackend" :loading="loading" style="width: 25%">
              <span v-if="!loading">保存</span>
              <span v-else>上传中<i class="el-icon-loading"></i></span>
            </el-button>
            <el-button @click="goBack" style="width: 50%" >返回查看页面</el-button>
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
} from "@/utils/Dingding.js";
export default {
  data() {
    return {
      form: {
        productId: this.getProductId(), // 调用方法获取产品 ID,
        currentLocation: this.getProductPerson(),
        fileList: [],
        operation: '', // 添加操作种类
        weldingContent: [], // 焊接内容
        testingContent: '', // 测试结果
        failureReason: '', // 测试失败原因
        questReason: '', // 问题描述
        assembleContent: [] // 装配描述
      },
      loading: false,
    };
  },
  methods: {
    getProductId() {
      const storedProductId = sessionStorage.getItem(key_DingScannedResult) || cachedProductId;
      console.log('cachedProductId 是: ',cachedProductId);
      // alert(cachedProductId);
      return storedProductId; // 返回存储的产品 ID 或者 cachedProductId
    },
    getPersonIndex() {
      const storedPersonIndex = sessionStorage.getItem(key_DingUserIndex) || cachedPersonIndex;
      console.log('cachedProductId 是: ',cachedPersonIndex);
      // alert(cachedPersonIndex);
      return storedPersonIndex; // 返回存储的产品 ID 或者 cachedProductId
    },
    getProductPerson() {
      const storedProductPerson = sessionStorage.getItem(key_DingName) || cachedProductPerson;
      console.log('cachedProductPerson 是: ',cachedProductPerson);
      // alert(cachedProductPerson)
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
        }; reader.readAsDataURL(file);
      }
    },
    toBase64(url, callback) {
      console.log('开始转换文件为Base64编码');
      const reader = new FileReader();
      reader.readAsDataURL(url);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        callback(base64);
      };
      reader.onerror = error => {
        console.error('Error converting file to base64:', error);
      };
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
      this.form.testingContent = '';
      this.form.failureReason = '';
      this.form.questReason = '';
      this.form.assembleContent = '';
    },
    saveDataToBackend() {
      console.log('开始保存数据到后端');
      if (!this.form.operation) {
        alert('请完成备注后再保存！');
        return;
      }
      this.loading = true; // 开始保存时显示loading图标
      const reqData = {
        productId: this.form.productId,
        currentLocation: this.form.currentLocation,
        operation: this.form.operation, // 添加操作种类
        fileList: this.form.fileList.length === 0 ? null : [], // 根据文件列表是否为空初始化 fileList
        userIndex: this.getPersonIndex(),
        weldingContent: this.form.weldingContent, // 焊接具体内容
        testingContent: this.form.testingContent, // 测试具体内容
        failureReason: this.form.failureReason, // 测试失败原因
        questReason: this.form.questReason, // 问题描述
        assembleContent: this.form.assembleContent // 装配描述
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
        Promise.all(promises)
            .then(() => {
              // 发送请求到后端
              return SensorBorderRequest.SaveAllCardRecords(reqData);
            })
            .then(response => {
              console.log('保存成功:', response);
              this.$message.success('保存成功!');
              setTimeout(() => {
                this.resetTestingFields(); // 重置表单字段
                this.$router.push("/ddinguia/web/history");
                // const department = getCurrentDepartment();
                // const basePath = getBasePathByDepartment (department);
                // router.push({path: `${basePath}/code/configList`});// 跳转回扫码页面
              }, 500); // 0.5 秒后跳转
            })
            .catch(error => {
              console.error('保存失败:', error);
              this.$message.error('保存失败！');
            })
            .finally(() => {
              this.loading = false; // 保存完成后取消loading状态
            });
      } else {
        // 如果 fileList 为空，直接发送请求
        SensorBorderRequest.SaveAllCardRecords(reqData)
            .then(response => {
              console.log('保存成功:', response);
              this.$message.success('保存成功!');
              setTimeout(() => {
                this.resetTestingFields(); // 重置表单字段
                this.$router.push("/ddinguia/web/history");
              }, 500); // 0.5 秒后跳转
            })
            .catch(error => {
              console.error('保存失败:', error);
              this.$message.error('保存失败！');
            })
            .finally(() => {
              this.loading = false; // 保存完成后取消loading状态
            });
      }
    }
    ,
    goBack() { this.$router.push({ path: '/ddinguia/web/history' }); },
  },
};
</script>
