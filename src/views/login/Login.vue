<template>
  <div>
    <h4>欢迎进入晟思工作助手 ！</h4>
  </div>
</template>

<script>
import {GetDingUserToken} from '@/utils/Dingding'

export default {
  name: 'LoginPage',
  data() {
    return {
      code: '',
      isDingDingEnv: false
    }
  },
  mounted() {
    this.checkDingDingEnv()
  },
  methods: {
    checkDingDingEnv() {
      const userAgent = navigator.userAgent.toLowerCase()
      if (userAgent.includes('dingtalk')) {
        this.isDingDingEnv = true
        this.ddFun()
      } else {
        setTimeout(() => {
          this.$router.push('/sensor_ddingWork/Release/cardStorageOperate')
        }, 2000)
      }
    },
    ddFun() {
      const isTestMode = false
      const urlParams = this.$store.state.urlParams

      if (isTestMode) {
        const reqData = {
          ProcessBOM_DrawID: null,
          CodeID: null,
          Phone: null,
          Name: '张学进'
        }

        let targetPath = '/sensor_ddingWork/Release/home'

        // 判断是否带有特定参数，跳转到任务页面
        if (urlParams && urlParams.param1 === 'task') {
          targetPath = '/sensor_ddingWork/Release/task'
        }
        if (urlParams && urlParams.param1 === 'share') {
          targetPath = '/sensor_ddingWork/Release/cart'
        }

        this.$router.push({path: targetPath, query: {name: reqData.Name}}).then(() => {
          console.log('成功跳转到:', targetPath)
        }).catch(error => {
          console.error('跳转失败:', error)
        })
      } else {
        console.log('进入 GetDingUserToken 方法')
        GetDingUserToken(
            (token) => {
              localStorage.setItem('sensor_DingTokenJWT', token)

              let targetPath = '/sensor_ddingWork/Release/home'

              // 判断是否带有特定参数，跳转到任务页面
              if (urlParams && urlParams.param1 === 'task') {
                targetPath = '/sensor_ddingWork/Release/task'
              }
              if (urlParams && urlParams.param1 === 'share') {
                targetPath = '/sensor_ddingWork/Release/cart'
              }

              this.$router.push({path: targetPath}).catch(err => {
                console.error('登录后跳转失败:', err)
              })
            },
            (error) => {
              alert('获取用户令牌失败，请联系管理员 :' + error)
              console.error('获取用户令牌失败:', error)
            }
        )
      }
    }
  }
}
</script>
