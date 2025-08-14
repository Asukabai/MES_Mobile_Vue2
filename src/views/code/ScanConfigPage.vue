<template>
  <div class="scan-config-container">
<!--    <h2>扫码配置</h2>-->

    <van-cell-group inset>
      <!-- 模块编码字段 -->
      <van-field
          label="模块编码"
          v-model="moduleCode"
          readonly
          :right-icon="scanIcon"
          @click-right-icon="handleScanClick"
      >
        <template #label>
          <span style="margin-right: 8px;">模块编码：</span>
          <span style="color: #999; font-size: 12px; white-space: nowrap;">（点击扫码自动生成）</span>
        </template>
      </van-field>

      <!-- 模块名称字段 -->
      <van-cell title="模块名称" is-link :value="moduleName || '请选择模块名称'" @click="showModuleNameSheet = true" />
      <van-action-sheet
          v-model="showModuleNameSheet"
          :actions="moduleNames"
          cancel-text="取消"
          @select="onModuleNameSelect"
      />

      <!-- 模块类型字段 -->
      <van-cell title="模块类型" is-link :value="moduleType || '请选择模块类型'" @click="showModuleTypeSheet = true" />
      <van-action-sheet
          v-model="showModuleTypeSheet"
          :actions="moduleTypes"
          cancel-text="取消"
          @select="onModuleTypeSelect"
      />

      <!-- 操作类型字段 -->
      <van-cell title="模块操作类型" is-link :value="selectedOperationType || '请选择操作类型'" @click="showOperationSheet = true" />
      <van-action-sheet
          v-model="showOperationSheet"
          :actions="operationActions"
          cancel-text="取消"
          @select="onOperationSelect"
      />
    </van-cell-group>

    <!-- 按钮布局 -->
    <van-row gutter="20" style="margin-top: 20px;">
      <van-col span="12">
        <van-button type="info" block @click="submitConfig">提交配置</van-button>
      </van-col>
      <van-col span="12">
        <van-button type="info" block @click="goToConfigList">配置列表</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import moduleNames from '@/assets/config/moduleNames.json';
import moduleTypes from '@/assets/config/moduleTypes.json';
import * as dd from 'dingtalk-jsapi'
import SensorRequest from "@/utils/SensorRequest";
export default {
  name: 'ScanConfigPage',
  data() {
    return {
      scanIcon: require('@/assets/scan_icon.png'),
      moduleCode: '',
      moduleName: '', // 初始为空
      moduleType: '', // 初始为空
      selectedOperationType: '',

      // 控制 ActionSheet 显示
      showModuleNameSheet: false,
      showModuleTypeSheet: false,
      showOperationSheet: false,

      // 配置数据（转换为 { name: 'xxx' } 格式）
      moduleNames: (moduleNames.moduleNames || []).map(name => ({ name })),
      moduleTypes: (moduleTypes.moduleTypes || []).map(name => ({ name })),

      // 操作类型
      operationActions: ['焊接', '测试', '装配', '焊接/装配', '焊接/测试', '装配/测试', '焊接/装配/测试'].map(text => ({ name: text })),
    };
  },
  methods: {
    handleScanClick() {
      this.scanQRCode();
    },
    scanQRCode() {
      // 判断是否在钉钉环境中且为移动端
      if (typeof dd === 'undefined' || !dd.env || dd.env.platform === 'pc') {
        this.$toast.fail('请在钉钉移动端中使用扫码功能');
        // 测试数据赋值（可选）
        this.moduleCode = "测试数据 1";
        return;
      }
      // 调用钉钉扫码功能
      dd.ready(() => {
        dd.biz.util.scan({
          type: 'all', // 只扫描二维码
          onSuccess: (data) => {
            const result = data.text; // 获取扫描结果
            if (!result) {
              this.$toast.fail('未获取到二维码内容');
              return;
            }
            // 解析二维码内容：提取第二个下划线前的所有内容
            const parts = result.split('_');
            if (parts.length < 2) {
              this.$toast.fail('二维码格式错误，请检查后重新扫描');
              return;
            }
            // 拼接第一个和第二个 _ 之间的部分（即前两个片段）
            this.moduleCode = parts.slice(0, 2).join('_');
          },
          onFail: (err) => {
            // console.error('扫码失败:', err);
            // alert('扫码失败:' + (err.errorCode || '') + (err.errorMessage || ''));
            // alert('扫码失败:' + JSON.stringify(err));
            // let errorMessage = '扫码失败，请重试';
            // this.$toast.fail(errorMessage);
            if (err.errorCode !== 300001) {
              // alert("未扫描到二维码！");
              let errorMessage = '未扫描到二维码！';
              this.$toast.fail(errorMessage);
            }
          },
          // onCancel: (err) => {
          //   console.log('用户点击了扫码页面返回按钮', err); // 打印 err 的完整结构
          //   try {
          //     let message = '用户点击了扫码页面返回按钮';
          //     if (err) {
          //       message += '\n' + JSON.stringify(err); // 将 err 对象转换为字符串
          //       if (err.errorCode) {
          //         message += '\nErrorCode: ' + err.errorCode;
          //       }
          //       if (err.errorMessage) {
          //         message += '\nErrorMessage: ' + err.errorMessage;
          //       }
          //     }
          //     alert(message);
          //   } catch (e) {
          //     console.error('处理 onCancel 错误时发生异常:', e);
          //     alert('用户点击了扫码页面返回按钮');
          //   }
          // }
        });
      });
    },

    submitConfig() {
      if (!this.moduleCode) {
        this.$toast.fail('请先扫码获取模块编码 ！');
        return;
      }
      if (!this.moduleName) {
        this.$toast.fail('请选择模块名称 ！');
        return;
      }
      if (!this.moduleType) {
        this.$toast.fail('请选择模块类型 ！ ');
        return;
      }

      // 构造配置对象
      const configData = {
        Module_Code: this.moduleCode,
        Module_Name: this.moduleName,
        Module_Type: this.moduleType,
        Module_OperationType: this.selectedOperationType,
      };

      // 调用接口提交
      SensorRequest.AssetModuleInfoAddFun(JSON.stringify(configData),
          // eslint-disable-next-line no-unused-vars
          (response) => {
            console.log('提交成功:', response);
            // alert('提交成功:'+ response);
            this.$toast.success('配置提交成功 ！');
            setTimeout(() => {
              this.$router.push('/sensor_ddingWork/Release/code/configList');
            }, 1000);
          },
          (error) => {
            console.error('提交失败:', error);
            alert('提交失败:'+ error);
            this.$toast.fail('配置提交失败，请重试 ！');
          }
      );
    },
    onModuleNameSelect(item) {
      this.moduleName = item.name;
      this.showModuleNameSheet = false;
    },
    onModuleTypeSelect(item) {
      this.moduleType = item.name;
      this.showModuleTypeSheet = false;
    },
    onOperationSelect(item) {
      this.selectedOperationType = item.name;
      this.showOperationSheet = false;
    },
    goToConfigList() {
      this.$router.push('/sensor_ddingWork/Release/code/configList');
    },
  },
};
</script>

<style scoped>
.scan-config-container {
  padding: 20px;
}
</style>
