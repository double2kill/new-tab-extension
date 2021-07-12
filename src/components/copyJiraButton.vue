<template>
  <a-button
    type="primary"
    @click="copyCommitInfo(false)"
  >
    复制 commit 信息
  </a-button>
  <a-button
    type="primary"
    @click="copyCommitInfo(true)"
  >
    复制含 Release 的信息
  </a-button>
  <a-button
    type="primary"
    @click="copySWEntry"
  >
    复制 Service Web 入口
  </a-button>
</template>
<script setup>
import {copyCommitInfo, copySWEntry} from './jira'
</script>

<style>
#chrome-copy-jira-inner button+button {
  margin-left: 10px;
}
</style>