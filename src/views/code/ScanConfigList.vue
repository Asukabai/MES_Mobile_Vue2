<template>
  <div class="config-list-container">
<!--    <h2>配置列表</h2>-->

<!--    <van-loading v-if="loading" type="spinner" style="margin: 20px auto">加载中...</van-loading>-->
    <van-empty v-if="!loading && list.length === 0" description="暂无数据" />

    <van-list
        :loading="loading"
        :finished="finished"
        finished-text="没有更多了"
    >
      <van-cell v-for="(item, index) in list" :key="index">
        <van-row gutter="10">
          <van-col span="24"><strong>模块编码：</strong>{{ item.moduleCode }}</van-col>
          <van-col span="24"><strong>模块名称：</strong>{{ item.moduleName }}</van-col>
          <van-col span="24"><strong>模块类型：</strong>{{ item.moduleType }}</van-col>
          <van-col span="24"><strong>操作类型：</strong>{{ item.operationType }}</van-col>
          <van-col span="24" style="color: #888; font-size: 12px;">
            创建时间：{{ formatTime(item.tsCreate) }}
          </van-col>
          <van-col span="24" style="text-align: right;">
            <!-- 删除按钮 -->
            <van-button size="mini" @click="onDelete(item.id)" type="danger" plain>删除</van-button>
          </van-col>
        </van-row>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { Dialog } from 'vant';
import SensorRequest from "@/utils/SensorRequest";

export default {
  name: 'ScanConfigList',
  data() {
    return {
      list: [],
      loading: false,
      finished: false
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;

      // 调用接口获取资产模块信息
      SensorRequest.AssetModuleInfoGetFun(
          '', // 参数为空
          (response) => {
            console.log('查询结果:', response);

            let json_response;
            try {
              json_response = JSON.parse(response);
            } catch (e) {
              this.$toast.fail("数据格式错误");
              this.loading = false;
              this.finished = true;
              return;
            }

            if (!Array.isArray(json_response)) {
              this.$toast.fail("数据格式错误");
              this.loading = false;
              this.finished = true;
              return;
            }

            // 字段映射 + 格式转换
            this.list = json_response.map(item => ({
              moduleCode: item.Module_Code || '-',
              moduleName: item.Module_Name || '-',
              moduleType: item.Module_Type || '-',
              operationType: item.Module_OperationType || '-',
              id: item.Id,
              uuid: item.Uuid,
              tsCreate: item.Ts_create,
              tsEdit: item.Ts_edit,
              logicDel: item.Logic_del
            }));

            this.loading = false;
            this.finished = true;
          },
          (error) => {
            console.error('查询失败:', error);
            this.$toast.fail('加载失败，请稍后再试');
            this.loading = false;
            this.finished = true;
          }
      );
    },

    /**
     * 时间格式化函数
     */
    formatTime(timeStr) {
      if (!timeStr) return '-';
      const date = new Date(timeStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    /**
     * 删除操作 - 弹窗确认
     */
    onDelete(id) {
      Dialog.confirm({
        title: '提示',
        message: '确定要删除这条配置吗？'
      }).then(() => {
        this.deleteConfig(id);
      }).catch(() => {
        // 取消删除操作
      });
    },

    /**
     * 实际调用删除接口的方法
     */
    deleteConfig(id) {
      console.log('即将删除的ID:', id); // ✅ 打印传入的 id 到控制台
      this.loading = true;

      // 调用删除接口
      SensorRequest.AssetModuleInfoDeleteFun(
          JSON.stringify({ Id: id }), // 🔥 转为 JSON 字符串
          (response) => {
            console.log('删除响应:', response);
            this.$toast.success("删除成功");

            // 更新页面数据
            this.list = this.list.filter(item => item.id !== id);
            this.loading = false;
          },
          (error) => {
            console.error('删除失败:', error);
            this.$toast.fail('删除失败，请重试');
            this.loading = false;
          }
      );
    }
  }
};
</script>

<style scoped>
.config-list-container {
  padding: 20px;
}
.van-cell {
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>
