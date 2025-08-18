<template>
  <div>
    <h4>欢迎进入晟思工作助手 ！</h4>
  </div>
</template>

<script>
import {GetDingUserToken} from '@/utils/Dingding'

export default {
  name: 'LoginPage',
  metaInfo() {
    return {
      title: '登录'
    }
  },
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
    // 检查是否处于钉钉环境
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

        // 钉钉免登的逻辑和过程
        // 1.用户在钉钉客户端中打开应用 , 系统通过GetDingUserToken函数尝试获取用户令牌
        // 如果本地缓存的令牌有效，则直接使用
        // 如果令牌无效或不存在，则通过GetDingCode获取授权码
        // 使用授权码向后端服务器换取用户令牌 ,将用户信息存储到本地缓存并完成登录

        GetDingUserToken(
            // 获取用户令牌成功
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
