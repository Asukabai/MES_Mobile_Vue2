<template>
  <div style="padding-top: 60px; transform: scale(0.9); transform-origin: top left;">
    <div style="text-align: center;">
      <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;晟思资产出入库表单</h2>
    </div>
    <el-form ref="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="资产编号:">
            <span>{{ form.productId }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="资产类型:">
            <span>{{ form.productType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="资产状态:">
            <span>未入库-未领用</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="记录人:">
            <span>{{ form.currentLocation }}</span>
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
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  key_DingName,
  key_DingScannedResult,
  key_DingUserIndex,
  cachedProductId,
  cachedProductPerson,
  cachedPersonIndex,
  key_DingResponseStored, key_DingResponseUsed, cachedResponseStored, cachedResponseUsed, key_DingUserPhone
} from "@/utils/Dingding";
import SensorRequest from "@/utils/SensorRequest";
function getLocalUserInfo() {
  const name = localStorage.getItem(key_DingName);
  const phone = localStorage.getItem(key_DingUserPhone);
  const dingID = localStorage.getItem(key_DingUserIndex); // 使用 key_DingUserIndex 作为 DingID

  return {
    name: name || '',
    phone: phone || '',
    dingID: dingID || ''
  };
}
export default {
  data() {
    return {
      form: {
        productType:'',
        productId: this.getProductId(), // 调用方法获取产品 ID,
        currentLocation: this.getProductPerson(),
        fileList: [],
        operation: '', // 添加操作种类
        productState:this.getProductState(),
        belongContent:'' //归属项目
      },
      loading: false,
      operationOptions: [
        { label: '入库并领用', value: '入库并领用' }],
      belongContents:[], //获取领用时候 的归属项目
      productType:'',
    };
  },
  created() {
    // 直接从路由参数中获取 Module_Type
    const moduleType = this.$route.query.Module_Type;
    const moduleName = this.$route.query.Module_Name;

    if (moduleType && moduleName) {
      this.form.productType = `${moduleType} - ${moduleName}`;
    } else if (moduleType) {
      this.form.productType = moduleType;
    } else {
      this.form.productType = '暂无配置，无法获取';
    }
    this.fetchBelongOptions();
    this.fetchWeldingOptions();
    this.fetchAssembleOptions();
  },
  methods: {

    getProductId() {
      const storedProductId = sessionStorage.getItem(key_DingScannedResult) || cachedProductId;
      console.log('cachedProductId 是: ', cachedProductId);
      return storedProductId; // 返回存储的产品 ID 或者 cachedProductId
    },

    getPersonIndex() {
      const storedPersonIndex = sessionStorage.getItem(key_DingUserIndex) || cachedPersonIndex;
      console.log('cachedPersonIndex 是: ', cachedPersonIndex);
      return storedPersonIndex;
    },
    getProductPerson() {
      const storedProductPerson = localStorage.getItem(key_DingName) ;
      console.log('cachedProductPerson 是: ', cachedProductPerson);
      return storedProductPerson;
    },
    getProductState() {
      const storedProductState = sessionStorage.getItem(key_DingResponseStored)+ "—" + sessionStorage.getItem(key_DingResponseUsed) || cachedResponseStored+ "-"+cachedResponseUsed;
      console.log('getProductState 是: ', storedProductState);
      return storedProductState;
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
    resetTestingFields() {
      this.form.weldingContent = '';
      this.form.testingContent = '';
      this.form.failureReason = '';
      this.form.questReason = '';
      this.form.assembleContent = '';
    },
    fetchBelongOptions() {
      SensorRequest.ProjectInfoGetFun(
      '',
      (respData) => {
        // alert("data" + respData);
        console.log("respData", respData);
        const data = JSON.parse(respData);
        const list = Array.isArray(data) ? data : [data];
        this.belongContents = list.map(item => {
          // alert(item.Project_Code)
          let code = item.Project_Code
          let name = item.Project_Name
          return {
            label: `${code} - ${name}`,  // 使用Project_Code作为显示文本
            value:  JSON.stringify({ Project_Code: code, Project_Name: name }) // 存储结构化数据  // 使用Project_Code作为绑定值
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
    fetchWeldingOptions() {
    },
    fetchAssembleOptions() {
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
      const selectedProject = this.form.belongContent ? JSON.parse(this.form.belongContent) : {};
      // alert(selectedProject.Project_Name)
      // alert(selectedProject.Project_Code)

      const reqData = {
        Asset_Code: this.form.productId,
        Project_Name: selectedProject.Project_Name || "", // 从 belongContent 提取 Project_Name
        Project_Code: selectedProject.Project_Code || "", // 从 belongContent 提取 Project_Code
        Asset_Remarks: this.form.operation === "入库并领用" ? "入库并领用" : "", // 固定值
        Asset_Status: "0",
        Operation_Type: "入库并领用",
        Operation_Description: "入库并领用",
        Operation_User: {
          Person_DingID: getLocalUserInfo().dingID, // 从缓存获取id
          Person_Phone: getLocalUserInfo().phone,
          Person_Name: getLocalUserInfo().name // 记录人名称
        }
      };
        // 如果 fileList 为空，直接发送请求
      SensorRequest.AssetInfoAddFun(JSON.stringify(reqData))
            .then(response => {
              console.log('保存成功:', response);
              this.$message.success('保存成功!');
              setTimeout(() => {
                this.resetTestingFields(); // 重置表单字段
                this.$router.push("/sensor_ddingWork/Release/code/HistoryView");
              }, 500); // 0.5 秒后跳转
            })
            .catch(error => {
              console.error('保存失败:', error);
              alert('保存失败:'+  error);
              this.$message.error('保存失败！');
            })
            .finally(() => {
              this.loading = false; // 保存完成后取消loading状态
            });
    },
    goBack() {
      this.$router.push({ path: "/sensor_ddingWork/Release/code/HistoryView" });
    }
  },
};
</script>
