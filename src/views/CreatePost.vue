<template>
  <div class="create-post-page">
    <!-- 页面标题 -->
    <van-nav-bar
        title="知识库提交表单"
    />

    <!-- 表单内容 -->
    <van-form @submit="onSubmit" class="form-container">
      <van-field
          v-model="form.title"
          name="title"
          label="标题"
          placeholder="请输入标题"
          :rules="[{ required: true, message: '请填写标题' }]"
      />
      <van-field
          v-model="form.author"
          name="author"
          label="作者"
          placeholder="请输入您的名字"
          :rules="[{ required: true, message: '请填写作者名字' }]"
      />
      <van-field
          v-model="form.content"
          rows="4"
          autosize
          type="textarea"
          name="content"
          label="内容"
          placeholder="请输入经验贴内容"
          :rules="[{ required: true, message: '请填写内容' }]"
      />
      <van-field
          v-model="form.tags"
          name="tags"
          label="标签"
          placeholder="请输入标签，用逗号分隔"
      />

      <!-- 关联到项目的开关 -->
      <van-cell title="是否关联到项目">
        <template #right-icon>
          <van-switch v-model="isAssociatedWithProject" size="30px" />
        </template>
      </van-cell>

      <!-- 关联项目列表（动态显示） -->
      <van-field
          v-if="isAssociatedWithProject"
          v-model="form.associatedProject"
          name="associatedProject"
          label="关联的项目"
          placeholder="请选择要关联的项目"
          readonly
          clickable
          @click="showProjectPicker = true"
      />
      <van-popup v-model="showProjectPicker" position="bottom">
        <van-picker
            show-toolbar
            :columns="projectList"
            @confirm="onProjectConfirm"
            @cancel="showProjectPicker = false"
        />
      </van-popup>

      <!-- 文件上传 -->
      <van-uploader
          v-model="fileList"
          multiple
          :max-count="5"
          :after-read="onAfterRead"
          :before-delete="beforeDelete"
          preview-size="80px"
          class="upload-section"
      >
        <template #default>
          <div class="upload-placeholder">
            <van-icon name="plus" size="24px" color="#999" />
            <p>上传照片或文件</p>
          </div>
        </template>
      </van-uploader>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button
            type="info"
            style=" border-radius: 20px; width: 40%;"
            native-type="submit"
        >
          提交
        </van-button>
        <div style="width: 10%;"></div> <!-- 中间间隙 -->
        <van-button
            type="info"
            style="border-radius: 20px; width: 40%; border: 1px solid #ccc;"
            @click="onCancel"
        >
          取消并返回
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { NavBar, Form, Field, Uploader, Button, Icon, Toast, Cell, Switch, Popup, Picker } from 'vant'

export default {
  name: 'CreatePostPage',
  components: {
    VanNavBar: NavBar,
    VanForm: Form,
    VanField: Field,
    VanUploader: Uploader,
    VanButton: Button,
    VanIcon: Icon,
    VanCell: Cell,
    VanSwitch: Switch,
    VanPopup: Popup,
    VanPicker: Picker
  },
  data() {
    return {
      form: {
        title: '',
        author: '',
        content: '',
        tags: '',
        attachments: [],
        associatedProject: '' // 关联项目字段
      },
      fileList: [], // 存储上传的文件列表
      isAssociatedWithProject: false, // 是否关联到项目
      showProjectPicker: false, // 是否显示项目选择器
      projectList: ['项目A', '项目B', '项目C'] // 示例项目列表
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    onSubmit() {
      // 检查表单是否有效
      if (!this.form.title || !this.form.author || !this.form.content) {
        Toast.fail('请填写完整信息')
        return
      }

      // 构造提交数据
      const postData = {
        ...this.form,
        tags: this.form.tags.split(',').map(tag => tag.trim())
      }

      console.log('提交的数据:', postData)

      // TODO: 调用 API 提交数据到后端
      Toast.success('提交成功')
      this.$router.push('/knowledge-base') // 返回知识库页面
    },
    onAfterRead(file) {
      // 处理文件读取后的逻辑
      this.form.attachments.push(file)
      console.log('已添加文件:', file)
    },
    beforeDelete(file) {
      // 删除文件前的确认逻辑
      const index = this.form.attachments.indexOf(file)
      if (index > -1) {
        this.form.attachments.splice(index, 1)
      }
      console.log('已删除文件:', file)
      return true
    },
    onCancel() {
      // 清空表单内容
      this.form = {
        title: '',
        author: '',
        content: '',
        tags: '',
        attachments: []
      }
      this.fileList = []

      // 返回上一页
      this.goBack()
    },
    onProjectConfirm(value) {
      this.form.associatedProject = value
      this.showProjectPicker = false
      Toast(`已选择项目: ${value}`)
    }
  }
}
</script>

<style scoped>
.create-post-page {
  padding: 0px;
}

.form-container {
  max-width: 90%;
  margin: 0 auto; /* 居中对齐 */
  background-color: #fff;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.upload-section {
  margin-top: 16px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  color: #999;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
}

.van-field {
  margin-bottom: 16px;
  border-radius: 8px;
  background-color: #f7f8fa;
  padding: 10px;
}
</style>
