<template>
  <div v-if="isDingDingEnv">
    <h4>欢迎进入工作助手 ！</h4>
  </div>
  <div v-else>
    <p>请使用钉钉打开此应用</p>
  </div>
</template>

<script>
import { GetDingUserToken,departmentPrefix } from '@/utils/Dingding'

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
        // 非钉钉环境下根据路由参数判断跳转路径
        alert('请使用钉钉，打开小程序使用');
        // 设置标志位阻止页面渲染主要内容
        this.isDingDingEnv = false;
      }
    },
    ddFun() {
      const isTestMode = false
      // 从路由参数中获取部门和类型信息
      const type = this.$route.params.type
      if (isTestMode) {
        const reqData = {
          ProcessBOM_DrawID: null,
          CodeID: null,
          Phone: null,
          Name: '张学进'
        }

        // 根据路由参数确定目标路径
        let targetPath = `/${departmentPrefix}/index`
        if (type === 'task') {
          targetPath = `/${departmentPrefix}/task`
        }
        if (type === 'share') {
          targetPath = `/${departmentPrefix}/cart`
        }

        // 避免重复导航
        if (this.$route.path !== targetPath) {
          this.$router.push({ path: targetPath, query: { name: reqData.Name } }).then(() => {
            console.log('成功跳转到:', targetPath)
          }).catch(error => {
            console.error('跳转失败:', error)
          })
        }
      } else {
        console.log('进入 GetDingUserToken 方法')

        GetDingUserToken(
            (token) => {
              localStorage.setItem('sensor_DingTokenJWT', token)

              // 根据路由参数确定目标路径
              let targetPath = `/${departmentPrefix}/index`
              if (type === 'task') {
                targetPath = `/${departmentPrefix}/task`
              }
              if (type === 'share' ) {
                targetPath = `/${departmentPrefix}/cart`
              }

              // 避免重复导航
              if (this.$route.path !== targetPath) {
                this.$router.push({ path: targetPath }).catch(err => {
                  console.error('登录后跳转失败:', err)
                })
              }
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
