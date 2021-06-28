<template>
  <div
    ref="mainButtonRef"
    class="draggble"
    :class="{
      'touch-top': position.touchBorder === 'top' && position.dragging === false,
      'touch-right': position.touchBorder === 'right' && position.dragging === false,
      'touch-bottom': position.touchBorder === 'bottom' && position.dragging === false,
      'touch-left': position.touchBorder === 'left' && position.dragging === false,
      'hover-when-leave': isHoverAtContainerWhenLeave,
    }"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
  >
    <a-card
      class="jira-extension-card"
      size="small"
      style="width: 200px"
      head-style="text-align: center;"
    >
      <template #title>
        <div
          class="jira-extension-card__title"
          @mousedown="onStart"
        >
          <DragOutlined />
          jira 插件
        </div>
      </template>
      <CopyJiraButton />
      <DrawerButton />
      <GoToLocalHostButton v-if="!!currentGoToLocalhostUrl" />
    </a-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { DragOutlined } from '@ant-design/icons-vue'
import CopyJiraButton from './components/CopyJiraButton.vue'
import DrawerButton from './components/Drawer/DrawerButton.vue'
import GoToLocalHostButton from './components/GoToLocalHostButton.vue'
import {
  position,
  mainButtonRef,
  onMove,
  onEnd,
  onStart,
  isHoverAtContainerWhenLeave,
  addEventsToDocument,
  setJiraPosition,
  currentGoToLocalhostUrl,
  getCurrentGoToLocalhostUrl
} from './App'

onMounted(() => {
  setJiraPosition()
  getCurrentGoToLocalhostUrl(window.location.origin)
})
</script>

<style>
.no-select {
  user-select: none;
}
.draggble {
  position: fixed;
  z-index: 100000;
  transition: transform 0.5s;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}
.jira-extension-card {
  box-shadow: 0 2px 8px rgb(0 0 0 / 18%);
}
.jira-extension-card.ant-card-small > .ant-card-head {
  padding: 0;
}
.jira-extension-card.ant-card-small > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title {
  padding: 0;
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
  padding: 8px 0;
}

.touch-top {
  transform: translateY(-95%);
}
.touch-right {
  transform: translateX(95%);
}
.touch-bottom {
  transform: translateY(95%);
}
.touch-left {
  transform: translateX(-95%);
}

.draggble:hover {
  transform: translateX(0%);
  transform: translateY(0%);
}

.hover-when-leave {
  transform: translateX(0%);
  transform: translateY(0%);
}
.ant-drawer,
.ant-notification {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}

.ant-drawer a {
  color: #1890ff;
}

.ant-drawer TH, .ant-drawer TD {
  font-family: inherit;
  font-size: 14px;
}
</style>