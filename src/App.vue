<template>
  <div
    ref="mainButtonRef"
    class="draggble"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`
    }"
  >
    <a-card
      class="jira-extension-card"
      size="small"
      style="width: 200px"
      head-style="text-align: center;"
    >
      <template #title>
        <span
          class="jira-extension-card__title"
          @mousedown="onStart"
        >
          <DragOutlined />
          jira 插件
        </span>
      </template>
      <CopyJiraButton />
      <DrawerButton />
    </a-card>
  </div>
</template>

<script setup>
import {onMounted} from 'vue'
import {DragOutlined} from '@ant-design/icons-vue'
import CopyJiraButton from './components/CopyJiraButton.vue'
import DrawerButton from './components/Drawer/DrawerButton.vue'
import {position, mainButtonRef, onMove, onEnd, onStart, jiraPositionLocalStorage} from './App'

onMounted(() => {
  const [error, positionValue] = jiraPositionLocalStorage.get()
  if (positionValue) {
    position.x = positionValue.x
    position.y = positionValue.y
    return
  }
  const INITIAL_RIGHT = 50
  const INITIAL_BOTTOM = 50
  const {offsetWidth, offsetHeight} = document.body
  const {width, height} = mainButtonRef.value.getBoundingClientRect()
  position.x = offsetWidth - width - INITIAL_RIGHT
  position.y = offsetHeight - height - INITIAL_BOTTOM
})

</script>

<style>
.draggble {
  position: fixed;
  z-index: 1000;
}
.jira-extension-card{
  box-shadow: 0 2px 8px rgb(0 0 0 / 18%);
}
.jira-extension-card .ant-card-body {
  display: flex;
  flex-direction: column;
}
.jira-extension-card .ant-card-body > button + button {
  margin-top: 10px;
}
.jira-extension-card__title {
  cursor: pointer;
}
</style>