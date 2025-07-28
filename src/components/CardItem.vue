<template>
  <div class="card-item">
    <div class="card-header">
      <span>记录人 &nbsp;&nbsp; ：{{ record.currentLocation }}</span>
      <span>记录时间  ：{{ record.createTime }}</span></div>
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
<style scoped>
.card-item {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;}
.card-header {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: flex-start; /* 左对齐 */
  background-color: #f5f5f5;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ddd;}
.card-header span {
  margin-bottom: 0.5rem; /* 可以根据需要添加间距 */
}
.card-body {
  flex: 1;
  overflow-y: auto;}
.card-image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 1rem;
  padding: 0.5rem;}
.card-description {
  margin-top: 1rem;
  color: #666;
  line-height: 1.5;}
.left-align {
  text-align: left; /* 左对齐 */
}
</style>
