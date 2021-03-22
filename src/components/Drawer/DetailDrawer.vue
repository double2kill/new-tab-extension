
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
      class="detail-info"
      v-html="detailInfoHTMLText"
    />
  </a-drawer>
</template>

<script setup>
import {detailDrawerVisible, closeDetailDrawer, detailInfoHTMLText} from './index'

</script>

<style>
.detail-info {
    white-space:pre-wrap;
}
</style>