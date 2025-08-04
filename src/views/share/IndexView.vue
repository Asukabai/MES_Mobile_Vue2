<template>

    <div class="home">
      <h1>{{ fileType }}在线文件预览</h1>

      <!-- 使用 vant 的 van-field 替代原生 input -->
      <van-cell-group inset>
        <van-field
            v-model="fileUrl"
            label=""
            placeholder="请输入文件地址，例如：https://example.com/file.docx"
            clearable
        />
      </van-cell-group>

      <!-- 使用 vant 的按钮 -->
      <van-button type="primary" block @click="previewFile">预览文件</van-button>

      <!-- 示例链接部分 -->
      <div class="example-link">
        <p>你可以复制下面的示例链接进行测试：</p>
        <div class="example-url" ref="exampleUrl">
          {{ exampleUrlText }}
        </div>
        <van-button size="normal" @click="copyExampleUrl" block class="copy-btn">
          {{ copyButtonText }}
        </van-button>
      </div>
    </div>

</template>


<script>
import { Field, CellGroup, Button } from 'vant'

export default {
  name: 'IndexView',
  components: {
    vanField: Field,
    vanCellGroup: CellGroup,
    vanButton: Button,
  },
  created() {
    const fileType = this.$route.query.type;
    console.log('接收到的文件类型:', fileType);
    if (fileType) {
      this.fileType = fileType; // ✅ 关键修复：将参数赋值给 data 中的 fileType
      switch (fileType) {
        case 'word':
          this.exampleUrlText = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/2.docx';
          break;
        case 'excel':
          this.exampleUrlText = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/2.xlsx';
          break;
        case 'pdf':
          this.exampleUrlText = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/2.pdf';
          break;
        case 'ppt':
          this.exampleUrlText = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/1.pptx';
          break;
        case 'png':
          this.exampleUrlText = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/1.png';
          break;
        case 'txt':
          this.exampleUrlText = 'https://api-v2.sensor-smart.cn:29028/sensorclouddisk3/static/tmp/FileFolder/1.txt';
          break;
      }
    }
  },
  data() {
    return {
      fileType: '',
      fileUrl: '',
      exampleUrlText: '',
      copyButtonText: '复制示例链接',
      showCopySuccess: false
    }
  },
  methods: {
    previewFile() {
      if (!this.fileUrl.trim()) {
        alert('请输入有效的文件地址')
        return
      }

      const encodedUrl = encodeURIComponent(this.fileUrl)
      this.$router.push(`/preview?url=${encodedUrl}`)
    },
    async copyExampleUrl() {
      try {
        if (navigator.clipboard) {
          // 使用现代剪贴板 API
          await navigator.clipboard.writeText(this.exampleUrlText);
          this.showCopyNotification('✅ 已复制到剪贴板');
        } else {
          // 回退到 document.execCommand（适用于旧浏览器）
          const textArea = document.createElement("textarea");
          textArea.value = this.exampleUrlText;
          textArea.style.position = "fixed";
          textArea.style.top = 0;
          textArea.style.left = 0;
          textArea.style.opacity = 0;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (successful) {
            this.showCopyNotification('✅ 已复制（旧版浏览器）');
          } else {
            throw new Error('document.execCommand 失败');
          }
        }
      } catch (err) {
        console.error('复制失败:', err);
        alert('请手动复制示例链接内容');
      }
    },
    showCopyNotification(message) {
      this.copyButtonText = message;
      this.showCopySuccess = true;

      setTimeout(() => {
        this.copyButtonText = '复制示例链接';
        this.showCopySuccess = false;
      }, 2000);
    }
  }
}
</script>

<style scoped>
.home {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  padding: 2rem;
  text-align: center;
}

h1 {
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
}

/* 示例链接部分 */
.example-link {
  margin-top: 3rem;
}

.example-url {
  margin: 1rem auto;
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  word-break: break-all;
  max-width: 80%;
  font-size: 0.9rem;
}

.copy-btn {
  margin-top: 1rem;
}
</style>
