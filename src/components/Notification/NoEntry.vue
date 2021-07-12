<template>
  <div>
    <p>
      没有找到当前页面对应入口
    </p>
    <div>
      <a-button
        type="default"
        @click="copyCurrentPath"
      >
        复制当前路径
      </a-button>
      <a-button
        type="default"
        style="margin-left: 10px"
        @click="openGoogleSheet"
      >
        添加到谷歌表格
      </a-button>
    </div>
  </div>
</template>

<script setup>
import {Button as AButton} from 'ant-design-vue'
import {copyCurrentPath, openGoogleSheet} from './noEntry.js'

</script>