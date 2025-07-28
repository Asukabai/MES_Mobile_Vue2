<template>
  <div class="notice-detail">
    <h2>通知详情</h2>
    <p>这是某条通知的具体内容。</p>
    <van-button type="primary" block @click="$router.back()">返回</van-button>
  </div>
</template>

<script>
export default {
  name: 'NoticeDetail'
}
</script>
