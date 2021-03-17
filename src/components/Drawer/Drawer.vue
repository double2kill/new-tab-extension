<template>
  <a-drawer
    title="Jira"
    placement="right"
    width="50%"
    :closable="true"
    :visible="visible"
    @close="closeDrawer"
  >
    <p>
      <a-textarea
        :default-value="drawerText"
        placeholder="请输入备忘录"
        :auto-size="{ minRows: 3 }"
        @change="hanldeTextChange"
      />
    </p>
  </a-drawer>
</template>

<script setup>
import { defineProps, onMounted } from 'vue'
import Localstorage from 'localstorage'
import {jiraLocalStorage, hanldeTextChange, drawerText, setDrawerText, closeDrawer} from './index'

onMounted(() => {
  const jiraIdElement = document.querySelector('#issue-content a#key-val')
  const jiraIdText = jiraIdElement && jiraIdElement.text
  const [error, value] = jiraLocalStorage.get(jiraIdText)
  setDrawerText(value)
})

defineProps({
  visible: Boolean,
  onClose: Function
})


</script>