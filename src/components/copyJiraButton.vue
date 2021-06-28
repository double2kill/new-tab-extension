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
    复制含 Fix Version 信息
  </a-button>
</template>
<script setup>
import {copyCommitInfo} from './jira'
</script>