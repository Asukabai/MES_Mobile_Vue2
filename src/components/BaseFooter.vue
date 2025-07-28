<template>
  <footer class="footer">
    <p>&copy; {{ currentYear }} 晟思智能工作助手小程序 V1.0.1</p>
  </footer>
</template>

<script>
export default {
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
};
</script>

<style scoped>.footer {
  margin-top: 20px;
  font-size: 13px; /* 字号缩小 */
  color: #666;
  text-align: center; /* 文字居中 */
  width: 100%; /* 确保宽度撑满 */
}
</style>
