<template>
  <div class="home-container">
    <!-- 背景图片 -->
    <div class="background"></div>
    <!-- 卡片容器（固定定位） -->
    <div class="card-wrapper">
      <!-- 资产卡片 -->
      <div class="card-section asset-card">
        <van-grid :border="false" :column-num="3">
          <van-grid-item
              v-for="(item, index) in assetItems"
              :key="index"
              :icon="item.icon"
              :text="item.text"
              @click="handleGridClick(item)"
              class="custom-grid-item"
          />
        </van-grid>
      </div>

      <!-- 耗材卡片 -->
      <div class="card-section consumable-card">
        <van-grid :border="false" :column-num="3">
          <van-grid-item
              v-for="(item, index) in consumableItems"
              :key="index"
              :icon="item.icon"
              :text="item.text"
              @click="handleGridClick(item)"
              class="custom-grid-item"
          />
        </van-grid>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <MainTabBar />
  </div>
</template>

<style scoped>
.home-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
}

/* 背景图片 */
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/background.png');
  background-size: cover;
  background-position: center;
}

.welcome-section h1 {
  font-size: 24px;
  margin-bottom: 5px;
}

.welcome-section p {
  font-size: 16px;
}

/* 卡片区域 */
.card-section {
  margin: 20px auto 8px; /* 上下间距增大，居中显示 */
  padding: 8px; /* 减少内边距 */
  width: 84%; /* 卡片宽度适当缩小 */
  max-width: 400px; /* 最大宽度限制，适配移动端 */
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1;
  position: relative;
}

.card-section h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}
.card-wrapper {
  position: fixed;
  top: 160px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 400px;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

/* 六宫格项样式 */
.custom-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}
</style>
<script>
import MainTabBar from '@/components/MainTabBar.vue'
import * as dd from 'dingtalk-jsapi'
import SensorRequest from "@/utils/SensorRequest";
import {key_DingScannedResult, updateCachedProductId} from "@/utils/Dingding";
export default {
  name: 'HomePage',
  metaInfo() {
    return {
      title: '首页'
    }
  },
  components: {
    MainTabBar,
  },
  data() {
    return {
      // 资产相关项
      assetItems: [
        { icon: require('@/assets/项目编码 (2).png'),
          text: '任务日历'
        },
        { icon: require('@/assets/项目管理 (3).png'),
          text: '项目列表'
        },
        { icon: require('@/assets/项目类型统计.png'),
          text: '文件统计'
        },
        { icon: require('@/assets/评论列表-高亮.png'),
          text: '问题反馈'
        },
        { icon: require('@/assets/进度跟踪.png'),
          text: '进度跟踪'
        },
        { icon: require('@/assets/联系人123.png'),
          text: '联系人'
        },
      ],
      // 耗材相关项
      consumableItems: [
        { icon: require('@/assets/单板扫码.png'),
          text: '单板扫码'
        },
        { icon: require('@/assets/批量扫码.png'),
          text: '批量扫码'
        },
        { icon: require('@/assets/日志详情.png'),
          text: '扫码记录'
        },
        { icon: require('@/assets/流程汇总日志.png'),
          text: '扫码配置'
        },
        { icon: require('@/assets/项目总览@3x.png'),
          text: '扫码看板'
        }
      ]
    }
  },
  methods: {
    handleGridClick(item) {
      const basePath = '/sensor_ddingWork/Release'; // 新增基础路径

      if (item.text === '项目编码') {
        this.$router.push(`${basePath}/project-code`)
      }
      if (item.text === '扫码记录') {
        this.$router.push(`${basePath}/code/codeList`)
      }
      if (item.text === '问题反馈') {
        this.$toast.success('感谢您的反馈')
      }
      if (item.text === '文件统计') {
        this.$router.push(`${basePath}/statistical-report`)
      }
      if (item.text === '进度跟踪') {
        this.$router.push(`${basePath}/progress-tracking`)
      }
      if (item.text === '项目列表') {
        this.$router.push(`${basePath}/project-manage`)
      }
      if (item.text === '任务日历') {
        this.$router.push(`${basePath}/task-manage`)
      }
      if (item.text === '单板扫码') {
        this.scanQRCode();
      }
      if (item.text === '批量扫码') {
        this.scanQRCodeList();
      }
      if (item.text === '联系人') {
        this.$toast.success('正在开发中 ！')
      }
      if (item.text === '扫码配置') {
        this.$router.push(`${basePath}/code/config`)
      }
      if (item.text === '扫码看板') {
        this.$toast.success('正在开发中 ！')
      }
    },
    scanQRCode() {
      // 扫码逻辑...
      console.log("开始扫码");
      dd.ready(() => {
        dd.biz.util.scan({
          type: 'qrCode',
          onSuccess: (data) => {
            const result = data.text; // 获取扫描结果
            if (result) {
              const parts = result.split('_');
              if (parts.length < 3) {
                // 扫描结果中没有 '_'
                this.$message({
                  message: '二维码的类型不符，请切换板卡重新扫描!',
                  type: 'info',
                  duration: 2000, // 2秒后自动关闭
                  showClose: true // 显示关闭按钮
                });
                return;
              }
              // 先检查二维码是否存在于数据库中
              SensorRequest.GetAssetInfoByAssetCodeFun(JSON.stringify({ Asset_Code: result }), (response) => {
                // alert("response : "+ response)
                let respone_Object = JSON.parse(response)
                // console.log(respone_Object.Module_Type)
                // console.log(respone_Object.Module_Name)
                // 接受的是一个 对象
                if (respone_Object.Project_Code === '' && respone_Object.Project_Name === ''){
                  // this.$router.push("/sensor_ddingWork/Release/code/AddStored");
                  this.$router.push({
                    path: "/sensor_ddingWork/Release/code/AddStored",
                    query: {
                      Module_Name: respone_Object.Module_Name,
                      Module_Type: respone_Object.Module_Type
                    }
                  });
                }else{
                  // this.$router.push("/sensor_ddingWork/Release/code/AddHistory");
                  this.$router.push({
                    path: "/sensor_ddingWork/Release/code/AddHistory",
                    query: {
                      Module_Name: respone_Object.Module_Name,
                      Module_Type: respone_Object.Module_Type
                    }
                  });
                }
              }, (searchError) => {
                // 处理搜索错误
                console.error(searchError);
                // alert(searchError);
                this.$message({
                  message: '二维码未查询到，请联系管理员配置录入！',
                  type: 'error'
                });
              });
              // 存储扫码结果
              sessionStorage.setItem(key_DingScannedResult, result);
              // 更新全局变量
              updateCachedProductId(result);
            } else {
              alert("扫描的二维码不符合要求，请重新扫描！");
            }
          },
          onFail: (err) => {
            if (err.errorCode !== 300001) {
              // alert("未扫描到二维码！");
              let errorMessage = '未扫描到二维码 ！';
              this.$toast.fail(errorMessage);
            }
          }
        });
      });
    },
    scanQRCodeList() {
      let isScanning = false; // 控制扫描循环的标志
      const scannedResults = []; // 用于存储扫码结果的列表
      let firstPrefix = null; // 存储第一次扫码内容的 _ 前部分
      // let lastResult = null; // 存储上一次的扫码结果
      const scan = () => {
        if (!isScanning) return;
        dd.biz.util.scan({
          type: 'qrCode',
          onSuccess: (data) => {
            const result = data.text; // 获取扫描结果
            if (result) {
              const parts = result.split('_');
              if (parts.length < 3) {
                // 扫描结果中没有 _
                this.$message({
                  message: '二维码的类型不符，请切换板卡重新扫描!',
                  type: 'error',
                  duration: 2000, // 2秒后自动关闭
                  showClose: true // 显示关闭按钮
                });
                return;}
              // const prefix = parts[0]; // 获取 _ 前的部分
              let prefix = parts.slice(0, 2).join('_'); // 拼接第一个和第二个 _ 之间的部分
              // eslint-disable-next-line no-unused-vars
              let param = { 'prefix': prefix };
              // 检查是否重复扫码
              if (scannedResults.includes(result)) {
                // if (lastResult === result) {
                // this.$message({
                //   message: '二维码重复扫描,请重新扫码！',
                //   type: 'info',
                //   duration: 2000, // 2秒后自动关闭
                //   showClose: true // 显示关闭按钮
                // });
                alert("二维码重复扫描,此次记录不算，请重新扫码！")
                scan(); // 重新尝试扫描
                return;}
              // eslint-disable-next-line no-unused-vars
              SensorRequest.GetAssetInfoByAssetCodeFun(JSON.stringify({ Asset_Code: result }), (response) => {
                if (scannedResults.length === 0) {
                  // 第一次扫码
                  firstPrefix = prefix;
                  scannedResults.push(result); // 将结果添加到列表中
                } else {
                  // 从第二次扫码开始
                  if (prefix === firstPrefix) {
                    // 扫描的是相同类型的资产
                    scannedResults.push(result); // 将结果添加到列表中
                  } else {
                    // 扫描的是不同类型的资产
                    alert("扫描了不同类型的资产，请重新扫描相同的资产类型！");
                    isScanning = true; // 重新尝试扫描
                    scan(); // 重新尝试扫描
                    return;
                  }
                }
                // lastResult = result; // 更新上一次的扫码结果
                isScanning = false; // 暂停扫描
                if (confirm("扫码成功！内容是:" + result + "是否继续扫描？")) {
                  isScanning = true; // 用户选择继续扫描
                  scan(); // 用户选择继续扫描
                } else {
                  this.stopScan(scannedResults); // 用户选择停止扫描
                }
                // eslint-disable-next-line no-unused-vars
              }, (error) => {
                this.$message({
                  message: '二维码未查询到，请联系管理员录入！',
                  type:'error'
                });
                isScanning = false; // 停止扫描
              });
            } else {
              this.$message({
                message: '扫描的二维码不符合要求，将自动重新扫描！',
                type: 'info',
                duration: 2000, // 2秒后自动关闭
                showClose: true // 显示关闭按钮
              });
              isScanning = true; // 重新尝试扫描
              scan(); // 重新尝试扫描
            }
          },
          onFail: (err) => {
            if (err.errorCode !== 300001) {
              alert("未扫描到二维码 请退出后继续扫描 ！");
            }
            isScanning = true; // 重新尝试扫描
            scan(); // 重新尝试扫描
          },
          onCancel: () => {
            alert("用户取消扫描时停止扫描二维码 ！");
            this.stopScan(scannedResults); // 用户取消扫描时停止扫描
          }
        });
      };
      dd.ready(() => {
        // 提示用户进入批量扫描模式
        this.$message({
          message: '已进入批量扫码模式，请扫描相同类型资产！',
          type: 'info',
          duration: 2000, // 2秒后自动关闭
          showClose: true // 显示关闭按钮
        });
        isScanning = true; // 开始扫描前设置为 true
        scan(); // 开始第一次扫描
      });
    },
    stopScan(scannedResults) {
      // alert("已停止批量扫描。");
      this.$message({
        message: '已停止批量扫描 ！',
        type: 'info',
        duration: 2000, // 2秒后自动关闭
        showClose: true // 显示关闭按钮
      });
      this.navigateToResultsPage(scannedResults); // 跳转到结果页面
    },
    navigateToResultsPage(scannedResults) {
      this.$router.push({
        path: '/sensor_ddingWork/Release/code/batch_scan_results',
        query: { scannedResults: JSON.stringify(scannedResults) }
      });
    },
  }
}
</script>
