<template>
  <el-container>
    <el-main>
      <el-card>
        <div style="margin-bottom: 10px;">
          <strong>共计: {{ count }} 条</strong>
        </div>
        <el-list>
          <el-list-item v-for="(result, index) in results" :key="index">
            {{ result }}
          </el-list-item>
        </el-list>
      </el-card>
      <div style="margin-top: 20px; display: flex; justify-content: space-between;">
        <el-button type="primary" @click="clearAndRescan" style="flex: 1; margin-right: 10px;">清空列表重新扫码</el-button>
        <el-button type="primary" @click="navigateToForm" style="flex: 1;">确定</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import SensorBorderRequest from "../../utils/sensorBorder";
import {
  key_DingResponseStored,
  key_DingResponseUsed,
  updateCachedResponseStored,
  updateCachedResponseUsed
} from "@/utils/Dingding";


export default {
  data() {
    return {
      results: [],
      count: 0 // 添加 count 属性
    };
  },
  created() {
    // 从查询参数中获取扫码结果
    this.results = JSON.parse(this.$route.query.scannedResults || '[]');
    this.count = this.results.length; // 初始化 count 值
  },
  methods: {
    clearAndRescan() {
      this.results = []; // 清空结果列表
      this.$router.push('/home'); // 跳转回扫码页面
    },
    navigateToForm() {
      if (this.results.length > 0) {
        const results = this.results;
        // 先将所有的扫码内容放到数据库中去查询这些板卡是否是都是属于同一个项目的，如果不是则应该给出提示，并不行页面跳转
        SensorBorderRequest.scanResults(
          { 'results': results },
            // eslint-disable-next-line no-unused-vars
          (response) => {
            // if (Array.isArray(response) && response.length > 0) {
            // 获取每条数据的 _ 前部分
            const prefixes = this.results.map(result => result.split('_')[0]);
            // 检查所有前缀是否相同
            const allPrefixesSame = prefixes.every(prefix => prefix === prefixes[0]);
            if (allPrefixesSame) {
              SensorBorderRequest.scanListOperation( // 传入一个list 判断每个 二维码的两个状态值，若每个二维码状态值都一致，则可进行批量操作，否则不行
                { 'results': results },
                (response) => {
                  // 接受的是一个 list map
                  // console.log(response);
                  // alert(response[0].isStored);
                  // alert(response[0].isUsed);
                  sessionStorage.setItem(key_DingResponseStored, response[0].isStored);
                  // 调用更新函数
                  updateCachedResponseStored(response[0].isStored);
                  sessionStorage.setItem(key_DingResponseUsed, response[0].isUsed);
                  // 调用更新函数
                  updateCachedResponseUsed(response[0].isUsed);
                  // 检查数据库返回的状态
                  if (response[0].isStored === '已入库' && response[0].isUsed === '已领用') {
                    // 跳转到资产操作页面
                    this.$router.push({
                      path: '/code/add_history_storedBatch', // 目标页面的路径
                      query: { results: JSON.stringify(this.results) } // 传递 results 数据
                    });
                  } else {
                    // 跳转到出入库登记页面
                    this.$router.push({
                      path: '/code/add_history_batch', // 目标页面的路径
                      query: { results: JSON.stringify(this.results) } // 传递 results 数据
                    });
                  }
                },
                (error) => {
                  // 处理错误
                  // alert(error);
                  this.$message({
                    message: error,
                    type: 'error'
                  });
                }
              );
            } else {
              this.$message.error('扫描了不同类型的资产，请重新扫描相同的资产类型！');
            }
          },
            // eslint-disable-next-line no-unused-vars
          (error) => {
            // 处理错误
            // alert(error);
            this.$message({
              message: '列表中有不同项目板卡，请确保所有扫描板卡都属于同一个项目！' ,
              type: 'error'
            });
          }
        )
      }else{
        this.$message({
          message: '二维码信息异常，未查询到，请联系管理员录入！电话：19979900109 ',
          type: 'error'
        });
      }
    }
  }
};
</script>

<style scoped>
.el-header {
  background-color: #409EFF; /* Element UI 默认蓝色 */
  padding: 20px;
  text-align: center;
}
.el-card {
  margin: 20px;
  padding: 20px;
}
.el-list {
  padding: 0;
}
</style>
