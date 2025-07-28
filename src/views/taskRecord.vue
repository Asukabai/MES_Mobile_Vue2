<template>
  <div class="record-page">
    <!-- 导航栏 -->
    <van-nav-bar title="任务记录" left-text="返回" left-arrow @click-left="$router.back()" />

    <!-- 表单内容 -->
    <van-form @submit="onSubmit" class="record-form">
      <!-- 对应项目 -->
      <van-field name="project" label="对应项目" rules="[{ required: true, message: '请选择项目' }]">
        <template #input>
          <van-select v-model="formData.project" placeholder="请选择项目">
            <van-option
                v-for="item in projectOptions"
                :key="item.id"
                :label="item.title"
                :value="item.title"
            />
          </van-select>
        </template>
      </van-field>

      <!-- 任务完成情况 -->
      <van-field name="status" label="任务完成情况" rules="[{ required: true, message: '请选择完成情况' }]">
        <template #input>
          <van-select v-model="formData.status" placeholder="请选择状态">
            <van-option label="已完成" value="已完成" />
            <van-option label="进行中" value="进行中" />
            <van-option label="延期" value="延期" />
          </van-select>
        </template>
      </van-field>

      <!-- 是否遇到异常 -->
      <van-field name="abnormal" label="是否遇到异常" rules="[{ required: true, message: '请选择是否有异常' }]">
        <template #input>
          <van-radio-group v-model="formData.abnormal">
            <van-cell-group inset>
              <van-cell title="是" :value-icon-size="18">
                <template #right-icon>
                  <van-radio name="是">是</van-radio>
                </template>
              </van-cell>
              <van-cell title="否" :value-icon-size="18">
                <template #right-icon>
                  <van-radio name="否">否</van-radio>
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </template>
      </van-field>

      <!-- 图片上传 -->
      <van-field name="uploader" label="上传照片">
        <template #input>
          <van-uploader
              v-model="formData.images"
              :max-count="1"
              capture="camera"
              upload-text="拍照"
              :after-read="afterRead"
          />
        </template>
      </van-field>

      <!-- 操作按钮 -->
      <div style="margin: 20px;">
        <van-button round block type="primary" native-type="submit">提交</van-button>
        <van-button round block type="default" @click="$router.back()">取消</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { Toast} from 'vant'

export default {
  name: 'taskRecord',
  data() {
    return {
      // 假设这是从 cartList 获取的项目列表
      projectOptions: [
        { id: 1, title: '多路输出项目新需求.docx' },
        { id: 2, title: 'AGV小车软件更新维护.pdf' },
        { id: 3, title: 'P型电源售后机箱维修.png' },
        { id: 4, title: '屏蔽电源触摸屏软件调试.txt' }
      ],
      formData: {
        project: '', // 默认为空
        status: '',
        abnormal: '否',
        images: []
      }
    }
  },
  methods: {
    // 页面加载时可以接收参数
    initFormData() {
      const title = this.$route.query.title
      if (title) {
        this.formData.project = title
      }
    },
    onSubmit(values) {
      console.log('表单数据:', values)
      console.log('本地存储的数据:', this.formData)

      if (this.formData.images.length === 0) {
        Toast.fail('请上传一张照片')
        return
      }

      Toast.success('提交成功！')
      this.$router.back()
    },
    afterRead(file) {
      // file 是上传的文件对象
      console.log('上传的照片:', file)
      // 可在此处调用接口上传
    }
  },
  mounted() {
    this.initFormData()
  }
}
</script>

<style scoped>
.record-page {
  padding: 16px;
}

.record-form {
  margin-top: 16px;
}
</style>
