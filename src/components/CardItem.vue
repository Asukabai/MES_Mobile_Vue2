<template>
  <div class="card-item">
    <div class="card-header">
      <span>记录人 &nbsp;&nbsp; ：{{ record.currentLocation }}</span>
      <span>记录时间  ：{{ formattedTime }}</span></div>
    <div class="card-body">
      <div v-if="Array.isArray(record.files)">
        <div class="card-image-grid">
          <template v-for="file in record.files">
            <img v-if="file.type === 'image'"
                 :key="file.id"
                 :src="getFileObject(file.fileUrl, 'image/jpg')"
                 @click="openImageLightbox(getFileObject(file.fileUrl, 'image/jpeg'))"
                 style="max-width: 100%; height: auto; object-fit: cover; cursor: pointer;">
            <video v-else-if="file.type === 'video'"
                   :key="file.id"
                   controls
                   style="max-width: 100%; height: auto; object-fit: contain;">
                   <source :src="getFileObject(file.fileUrl, 'video/mp4')" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </template>
        </div>
      </div>
      <p class="card-description left-align">操作分类：{{ record.operation }}</p>
      <p class="card-description left-align">说明备注：{{ record.description }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    record: {
      type: Object,
      required: true}
  }, data() {
    return {baseUrl: process.env.VUE_APP_BASEURL};},
  computed: {
    formattedTime() {
      if (!this.record.createTime) return '';
      const date = new Date(this.record.createTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  },
  methods: {
    getFileObject(fileUrl, fileType) {
      const byteCharacters = atob(fileUrl);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileType });
      return URL.createObjectURL(blob);
    },
    getFileUrl(fileUrl) {
      return `${this.baseUrl}`+ fileUrl;},
    openImageLightbox(imageUrl) {
      if (document.querySelector('.lightbox')) {
        return;}
      const lightbox = document.createElement('div');
      lightbox.classList.add('lightbox');
      lightbox.style.position = 'fixed';
      lightbox.style.top = '0';
      lightbox.style.left = '0';
      lightbox.style.width = '100%';
      lightbox.style.height = '100%';
      lightbox.style.background = 'rgba(0, 0, 0, 0.8)';
      lightbox.style.display = 'flex';
      lightbox.style.justifyContent = 'center';
      lightbox.style.alignItems = 'center';
      const image = document.createElement('img');
      image.src = imageUrl;
      image.style.maxWidth = '80%';
      image.style.maxHeight = '80%';
      lightbox.appendChild(image);
      lightbox.addEventListener('click', () => {
        lightbox.remove();
      });
      document.body.appendChild(lightbox);}}};
</script>
// ... existing code ...
<style scoped>
.card-item {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  width: 95%;
  max-width: 100%; /* 确保不会超出容器 */
  box-sizing: border-box; /* 包含边框和内边距 */
  margin-left: auto;
  margin-right: auto;
}

/* 为移动端优化显示 */
@media (max-width: 768px) {
  .card-item {
    width: 98%;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }
}

@media (max-width: 480px) {
  .card-item {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
}

.card-header {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: flex-start; /* 左对齐 */
  background-color: #f5f5f5;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ddd;
  width: 100%; /* 确保标题占满卡片宽度 */
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .card-header {
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 480px) {
  .card-header {
    padding: 0.5rem;
  }
}

.card-header span {
  margin-bottom: 0.5rem; /* 可以根据需要添加间距 */
  word-wrap: break-word; /* 长文本自动换行 */
  word-break: break-all;
}

.card-body {
  flex: 1;
  overflow-y: auto;
  width: 100%; /* 确保内容占满卡片宽度 */
  box-sizing: border-box;
}

/* 移动端优化网格布局 */
.card-image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 1rem;
  padding: 0.5rem;
  width: 100%; /* 确保网格占满卡片宽度 */
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .card-image-grid {
    grid-gap: 0.75rem;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .card-image-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-gap: 0.5rem;
    padding: 0.25rem;
  }
}

/* 确保图片不会超出容器 */
.card-image-grid img,
.card-image-grid video {
  max-width: 100%;
  height: auto;
  object-fit: cover;
  box-sizing: border-box;
}

.card-description {
  margin-top: 1rem;
  color: #666;
  line-height: 1.5;
  width: 100%; /* 确保描述占满卡片宽度 */
  box-sizing: border-box;
  word-wrap: break-word; /* 长文本自动换行 */
  word-break: break-all;
}

@media (max-width: 768px) {
  .card-description {
    margin-top: 0.75rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .card-description {
    margin-top: 0.5rem;
    font-size: 0.85rem;
  }
}

.left-align {
  text-align: left; /* 左对齐 */
}
</style>


