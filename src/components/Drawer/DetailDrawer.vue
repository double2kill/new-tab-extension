
<template>
  <a-drawer
    title="详情"
    placement="right"
    width="50%"
    :closable="true"
    :visible="detailDrawerVisible"
    @close="closeDetailDrawer"
  >
    <p
      v-if="!isDetailModeEditStatus"
      class="detail-info"
      v-html="detailInfoHTMLText"
    />
    <a-button
      v-if="!isDetailModeEditStatus"
      type="primary"
      @click="switchDetailModeToEditStatus"
    >
      编辑详情
    </a-button>
    <p v-if="isDetailModeEditStatus">
      <a-textarea
        :value="detailPageTextarea"
        width="50%"
        placeholder="请输入备忘录文本"
        rows="4"
        @change="setDetailPageTextarea"
      />
    </p>
    <p
      v-if="isDetailModeEditStatus"
      style="text-align: right"
    >
      <a-button
        type="primary"
        :disabled="!detailPageTextarea"
        @click="saveDetailInfo"
      >
        保存
      </a-button>
    </p>
  </a-drawer>
</template>

<script setup>
import {
  detailDrawerVisible,
  closeDetailDrawer,
  detailInfoHTMLText,
  switchDetailModeToEditStatus,
  isDetailModeEditStatus,
  detailPageTextarea,
  setDetailPageTextarea,
  saveDetailInfo
} from './index'

</script>

<style>
.detail-info {
    white-space:pre-wrap;
}
</style>