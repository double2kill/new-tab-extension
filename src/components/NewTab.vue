<script setup lang="ts">
// import Live2d from './Live2d.vue'
import { NButton, NPopover, NSlider, NSwitch } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useLocalStorageState } from 'vue-hooks-plus'

import LikeImageList from './LikeImageList/LikeImageList.vue'
import TaskList from './TaskList/TaskList.vue'
import Time from './Time.vue'

import VueLive2d from '@/components/VueLive2d/index.vue'
import { setCursorEffect } from '@/utils/cursorEffect'

const MIN = -180
const MAX = 180

const getRandomInteger = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randomDeg = ref()

const handleSetDeg = () => {
  localStorage.setItem('new-tab.wai.deg', randomDeg.value.toString())
}

enum WorkMode {
  Time = 'time',
  Task = 'task'
}

const [workMode, setWorkMode] = useLocalStorageState('new-tab.work.mode', {
  defaultValue: WorkMode.Time
})

onMounted(() => {
  setWorkMode(Math.random() > 0.5 ? WorkMode.Time : WorkMode.Task)
})

const [waiMode, setWaiMode] = useLocalStorageState('new-tab.wai.mode', {
  defaultValue: 'random'
})
const [bgImgSrc, setBgImgSrc] = useLocalStorageState('new-tab.background-image', {
  defaultValue: ''
})

const isTaskMode = computed(() => {
  return workMode.value === WorkMode.Task
})

const handleTaskModeChange = (value: boolean) => {
  setWorkMode(value ? WorkMode.Task : WorkMode.Time)
}

const isWaiFixed = computed(() => {
  return waiMode.value === 'fixed'
})

onMounted(async () => {
  setCursorEffect()
  randomDeg.value = localStorage.getItem('new-tab.wai.deg')
    ? parseInt(localStorage.getItem('new-tab.wai.deg') as string)
    : getRandomInteger(MIN, MAX)
})

const handleChange = (value: boolean) => {
  if (value) {
    setWaiMode('fixed')
    localStorage.setItem('new-tab.wai.deg', randomDeg.value.toString())
    return
  }
  setWaiMode('random')
  localStorage.removeItem('new-tab.wai.deg')
  randomDeg.value = getRandomInteger(MIN, MAX)
}

let tips = ref({
  mouseover: [
    {
      selector: '.vue3-live2d',
      texts: ['请查看源代码了解如何修改默认语句']
    }
  ]
})

const [live2dModel, setLive2dModel] = useLocalStorageState('new-tab.live2d.model', {
  defaultValue: ['Potion-Maker/Pio', 'school-2017-costume-yellow']
})

const [live2dMainShow, setLive2dMainShow] = useLocalStorageState('new-tab.live2d.visible', {
  defaultValue: true
})

const goToSettings = () => {
  if (chrome) {
    chrome.tabs.create({ url: '/build/options.html' })
    return
  }
  if (location.href.includes('localhost')) {
    window.open('/options')
  }
}
</script>

<template>
  <img v-if="bgImgSrc" class="background-item" :src="bgImgSrc" alt="Bing每日壁纸UHD超高清原图" />
  <div class="app">
    <NSwitch
      class="mode-switch"
      v-model:value="isTaskMode"
      @update:value="handleTaskModeChange"
      style="margin-bottom: 10px"
    >
      <template #checked> 工作模式 </template>
      <template #unchecked> 时间模式</template>
    </NSwitch>
    <div class="center-above">
      <div v-if="!isTaskMode" :style="`transform: rotate(${-randomDeg}deg)`">
        <Time />
      </div>
      <TaskList v-else />
    </div>
    <div v-if="!isTaskMode" class="ai-mode-switch">
      <NSwitch v-model:value="isWaiFixed" @update:value="handleChange" style="margin-bottom: 10px">
        <template #checked>
          <NPopover>
            <template #trigger> 固定角度 </template>
            <div style="width: 200px">
              <NSlider
                v-model:value="randomDeg"
                :min="MIN"
                :max="MAX"
                @update:value="handleSetDeg"
              />
            </div>
          </NPopover>
        </template>
        <template #unchecked> 随机角度 </template>
      </NSwitch>
    </div>
    <!-- <div class="center-below"></div>
    <div class="bottom-row"></div> -->
    <div class="settings">
      <NButton round type="primary" @click="goToSettings"> 设置 </NButton>
      <LikeImageList :bgImgSrc="bgImgSrc" :setBgImgSrc="setBgImgSrc" />
    </div>
    <VueLive2d
      class="live2d"
      :width="300"
      :height="300"
      :resolution="2"
      :style="{ position: 'fixed', bottom: 0, right: 0, zIndex: 1 }"
      :api-path="'https://evgo2017.com/api/live2d-static-api/indexes'"
      :model="live2dModel"
      :setModel="setLive2dModel"
      :mainShow="live2dMainShow"
      :setMainShow="setLive2dMainShow"
    />
  </div>
</template>

<style>
.background-item {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}
.app {
  overflow: hidden;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  color: white;
  font-family:
    Hiragino Sans GB,
    Microsoft YaHei,
    WenQuanYi Micro Hei,
    sans-serif;
  display: flex;
  flex-direction: column;
  transition: opacity 0.3s var(--a-curve);
  text-shadow:
    0 0 8px #666,
    0 0 2px #666;
}
.center-above,
.center-below {
  max-width: 100%;
  max-height: 100%;
  flex: 1 1 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: row;
}
.top-row,
.bottom-row {
  height: 1000px;
  display: flex;
  justify-content: space-between;
}

.settings {
  display: flex;
  gap: 15px;
  position: absolute;
  bottom: 20px;
  left: 20px;
}
.mode-switch {
  z-index: 10;
  margin-top: 20px;
}
.wai-mode-switch {
  width: 600px;
  margin: 0 auto;
  margin-bottom: 10px;
}
</style>
