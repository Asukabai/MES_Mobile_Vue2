<template>
  <div>
    <div class="login"></div>
    <h4>欢迎进入晟思工作助手 ！</h4>
  </div>
</template>

<script>
import {GetDingUserToken} from '@/utils/Dingding'

export default {
  name: 'LoginPage',
  data() {
    return {
      code: '', // 添加 code 变量定义
    };
  },
  mounted() {
    this.ddFun();
  },
  methods: {
    ddFun() {
      // const isTestMode = false; // 设置为 true 表示测试模式，设置为 false 表示真实模式
      const isTestMode = true; // 设置为 true 表示测试模式，设置为 false 表示真实模式
      if (isTestMode) {
        const reqData = {
          "ProcessBOM_DrawID": null,
          "CodeID": null,
          "Phone": null,
          "Name": "张学进"
        };
        // 直接使用假数据进行页面跳转并传递参数
        this.$router.push({ path: '/home', query: { name: reqData.Name } }).then(() => {
          console.log('成功跳转到 /home');
        }).catch(error => {
          console.error('跳转到 /home 失败:', error);
        });
      } else {
        // alert("进入 GetDingUserToken 方法")
        console.log("进入 GetDingUserToken 方法");
        GetDingUserToken(
          (token) => {
            // alert('Login reqData:' + token)
            console.log('Login reqData:', token); // 使用 console.log 替代 alert
            // 保存 token 到 localStorage
            localStorage.setItem('sensor_DingTokenJWT', token);
            this.$router.push({path: '/home'});
          },
          (error) => {
            // alert('获取用户令牌失败:' + error)
            console.error('获取用户令牌失败:', error); // 添加错误处理逻辑
            // 可以在这里添加更多用户友好的错误提示
          }
        );
      }
    }
  }
};
</script>
