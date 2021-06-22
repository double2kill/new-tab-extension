<template>
  <a-drawer
    title="设置"
    placement="right"
    width="50%"
    :closable="true"
    :visible="isSettingsVisible"
    @close="closeSettingsDrawer"
  >
    <div>
      localhost地址:
      <a-input
        v-model:value="localhostOriginInputValue"
        style="width:400px"
        placeholder="输入本地地址, 默认是 https://localhost"
        @pressEnter="setLocalhostOrigin"
      />
      <a-button
        type="primary"
        :disabled="isAddToListButtonDisabled"
        @click="setLocalhostOrigin"
      >
        设置
      </a-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { localhostOriginInputValue,localhostOrigin, isSettingsVisible, closeSettingsDrawer, setLocalhostOrigin, setInitialLocalhostOrigin } from './index'
import { defineProps, onMounted } from 'vue'
import { getInitialConfig } from '../../utils/configs'

onMounted(() => {
  const localhostOrigin = getInitialConfig('LOCALHOST_ORIGIN') || ''
  setInitialLocalhostOrigin(localhostOrigin)
})
</script>