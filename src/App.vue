<template>
  <div 
    ref="mainButtonRef"
    class="draggble"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`
    }"
    @mousedown="onStart"
  >
    <CopyJiraButton />
    <DrawerButton />
  </div>
</template>

<script setup>
import {reactive, onMounted, ref} from 'vue'
import CopyJiraButton from './components/CopyJiraButton.vue'
import DrawerButton from './components/Drawer/DrawerButton.vue'

const position = reactive({ x: 0, y: 0, isDragging: false })
const isDragging = reactive(false)
const mainButtonRef = ref(null)

onMounted(() => {
  const INITIAL_RIGHT = 50
  const INITIAL_BOTTOM = 50
  const {offsetWidth, offsetHeight} = document.body
  const {width, height} = mainButtonRef.value.getBoundingClientRect()
  position.x = offsetWidth - width - INITIAL_RIGHT
  position.y = offsetHeight - height - INITIAL_BOTTOM
})

let prevX, prevY
const onMove = (event) => {
  const diffY = event.clientY - prevY
  const diffX = event.clientX - prevX

  position.y += diffY
  position.x += diffX

  prevY = event.clientY
  prevX = event.clientX
}
const onEnd = (event) => {
  document.removeEventListener('pointermove', onMove)
  document.removeEventListener('mouseup', onEnd)
  event.stopPropagation()
}
const onStart = (event) => {
  document.addEventListener('pointermove', onMove)
  document.addEventListener('mouseup', onEnd)
  prevY = event.clientY
  prevX = event.clientX
  position.isDragging = true
}
</script>

<style>
.draggble {
  display: flex;
  flex-direction: column;
  position: fixed;
}
.draggble > button + button {
  margin-top: 10px;
}
</style>