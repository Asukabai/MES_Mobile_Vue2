<template>
  <van-popup
      v-model="showPopup"
      position="bottom"
      :style="{ height: 'auto', paddingBottom: 'env(safe-area-inset-bottom)' }"
      :close-on-click-overlay="true"
      :closeable="false"
  >
    <div class="custom-action-sheet">
      <div class="sheet-header">
        <div class="header-title">{{ title }}</div>
        <div class="header-close" @click="onCancel">×</div>
      </div>

      <div class="sheet-body">
        <div
            v-for="(action, index) in actions"
            :key="index"
            class="sheet-item"
            :class="{ active: selectedAction === action }"
            @click="handleSelectAction(action)"
        >
          <span class="action-name">{{ action.name }}</span>
          <van-icon
              v-if="selectedAction === action"
              name="success"
              class="check-icon"
          />
        </div>
      </div>

      <div class="sheet-footer">
        <div class="btn cancel" @click="onCancel">取消</div>
        <div class="btn confirm" @click="onConfirm">确认</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'CustomActionSheet',
  components: {
    VanIcon: Icon
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    actions: {
      type: Array,
      required: true,
      default: () => []
    },
    selectedAction: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: '操作列表'
    }
  },
  computed: {
    showPopup: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    handleSelectAction(action) {
      // 修复：确保事件正确触发
      this.$emit('update:selectedAction', action);
    },
    onConfirm() {
      if (this.selectedAction) {
        this.$emit('confirm', this.selectedAction);
      }
    },
    onCancel() {
      this.$emit('cancel');
      this.$emit('update:selectedAction', null);
    }
  }
};
</script>

<style scoped>
/* 保留原有样式，无需修改 */
</style>
