<template>
  <div 
    ref="mainButtonRef"
    class="draggble"
    :style="{
      left: position.x,
      top: position.y
    }"
    :draggable="true"
    @dragstart="onStart"
    @dragend="onEnd"
  >
    <copy-jira-button />
  </div>
</template>

<script setup>
import {reactive, onMounted, ref} from 'vue'
import CopyJiraButton from './components/copyJiraButton.vue'
const position = reactive({ x: undefined, y: undefined })
const mainButtonRef = ref(null)

onMounted(() => {
  const INITIAL_RIGHT = 50
  const INITIAL_BOTTOM = 50
  const {offsetWidth, offsetHeight} = document.body
  const {width, height} = mainButtonRef.value.getBoundingClientRect()
  position.x = `${offsetWidth - width - INITIAL_RIGHT}px`
  position.y = `${offsetHeight - height - INITIAL_BOTTOM}px`
})

let shiftX, shiftY
const onStart = (event) => {
  const {clientX, clientY, target} = event
  shiftX = clientX - target.getBoundingClientRect().left
  shiftY = clientY - target.getBoundingClientRect().top
}
const onEnd = (event) => {
  const {clientX, clientY, target} = event
  position.x = `${clientX - shiftX}px`
  position.y = `${clientY - shiftY}px`
}
</script>

<style>
.draggble {
  position: fixed;
}
</style>