<template>
  <a-button
    type="primary"
    @click="copyCommitInfo"
  >
    复制 commit 信息
  </a-button>
</template>
<script setup>
import {copyCommitInfo} from './jira'
</script>