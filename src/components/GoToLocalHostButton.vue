<template>
  <div class="item">
    <a-button
      @click="loginToLocalhost"
    >
      登录到 Localhost
    </a-button>
    <a-button @click="openSettingsDrawer">
      <template
        #icon
      >
        <SettingOutlined />
      </template>
    </a-button>
    <SettingsDrawer />
  </div>
</template>
<script setup>
import { loginToLocalhost } from './jira'
import { SettingOutlined } from '@ant-design/icons-vue'
import { openSettingsDrawer, localhostOrigin } from './Settings/index'
import SettingsDrawer from './Settings/SettingsDrawer.vue'

</script>
<style scoped>
  .item {
    margin-top: 10px;
    display: flex;
  }
</style>