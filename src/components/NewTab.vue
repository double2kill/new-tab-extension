<script setup lang="ts">
// import Live2d from './Live2d.vue'
import { NButton, NPopover, NSlider, NSwitch, NInput, NBadge } from 'naive-ui'
import { computed, onMounted, ref, watch } from 'vue'
import { useLocalStorageState } from 'vue-hooks-plus'

import About from './About.vue'
import GoogleSearch from './GoogleSearch.vue'
import LearnCard from './LearnCard/LearnCard.vue'
import LikeImageList from './LikeImageList/LikeImageList.vue'
import TaskList from './TaskList/TaskList.vue'
import Time from './Time.vue'

import VueLive2d from '@/components/VueLive2d/index.vue'
import { useTaskManager } from '@/hooks/useTaskManager'
import { setCursorEffect } from '@/utils/cursorEffect'

const MIN = -120
const MAX = 120

const { unCompletedTaskCount } = useTaskManager()

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

// Search focus state
const isSearchFocused = ref(false)

// Handle search focus change from the GoogleSearch component
const handleSearchFocusChange = (focused: boolean) => {
  isSearchFocused.value = focused
}

// Watch for changes in isSearchFocused and update body class
watch(isSearchFocused, (newValue) => {
  if (newValue) {
    document.body.classList.add('bg-blur')
  } else {
    document.body.classList.remove('bg-blur')
  }
})

const aboutRef = ref()
const hasUpdate = ref(false)

const goToSettings = () => {
  if (location.href.includes('localhost')) {
    window.open('/options')
    return
  }
  if (chrome) {
    const key = chrome.runtime.getManifest().key
    let optionsUrl = '/build/options.html'
    if (key) {
      optionsUrl = optionsUrl.replace('/build/', '/')
    }
    chrome.tabs.create({ url: optionsUrl })
    return
  }
}

const openAbout = () => {
  aboutRef.value?.openAbout()
}
</script>

<template>
  <img v-if="bgImgSrc" class="background-item" :src="bgImgSrc" alt="Bing每日壁纸UHD超高清原图" />

  <!-- 左侧工具栏 -->
  <div class="toolbar">
    <div class="toolbar-item">
      <button
        @click="handleTaskModeChange(false)"
        :class="['toolbar-button', { active: !isTaskMode }]"
        title="时间模式"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path
            d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"
          />
        </svg>
      </button>
    </div>
    <div class="toolbar-item">
      <NBadge
        :value="unCompletedTaskCount"
        :max="99"
        :show-zero="false"
        :offset="[-3, 3]"
        color="#ef4444"
        text-color="white"
      >
        <button
          @click="handleTaskModeChange(true)"
          :class="['toolbar-button', { active: isTaskMode }]"
          title="工作模式"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path
              d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
            />
          </svg>
        </button>
      </NBadge>
    </div>
    <div class="toolbar-item">
      <NBadge
        :value="hasUpdate ? 'NEW' : ''"
        :show-zero="false"
        :offset="[-3, 3]"
        color="#ef4444"
        text-color="white"
        :class="{ 'badge-animation': hasUpdate }"
      >
        <button @click="openAbout" class="toolbar-button relative" title="关于">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path
              d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
            />
          </svg>
          <div
            v-if="hasUpdate"
            class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"
          ></div>
        </button>
      </NBadge>
    </div>
  </div>

  <div class="app flex flex-col gap-8">
    <GoogleSearch @focus-change="handleSearchFocusChange" />
    <div class="flex flex-col items-center justify-center h-full">
      <div v-if="!isTaskMode" class="m-t--16" :style="`transform: rotate(${-randomDeg}deg)`">
        <Time />
        <LearnCard />
      </div>
      <TaskList v-else />
    </div>
    <div v-if="!isTaskMode" class="width-[600]">
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
    <div class="settings">
      <NButton round type="primary" @click="goToSettings"> 设置 </NButton>
      <LikeImageList :bgImgSrc="bgImgSrc" :setBgImgSrc="setBgImgSrc" />
    </div>
    <About ref="aboutRef" @update-status="hasUpdate = $event" />
    <VueLive2d
      class="live2d"
      :width="300"
      :height="300"
      :resolution="2"
      :style="{ position: 'fixed', bottom: 0, right: 0, zIndex: 1 }"
      :api-path="'https://vue-live2d.demo.evgo2017.com/live2d-static-api/indexes'"
      :model="live2dModel"
      :setModel="setLive2dModel"
      :mainShow="live2dMainShow"
      :setMainShow="setLive2dMainShow"
    />
  </div>
</template>

<style>
/* Add global styles that will apply to body */
body.bg-blur {
  overflow: hidden;
}

body.bg-blur::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  z-index: 5;
  pointer-events: none;
}

.background-item {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  transition:
    transform 0.3s ease-out,
    filter 0.3s ease;
  transform-origin: center center;
  will-change: transform;
}

body.bg-blur .background-item {
  transform: scale(1.05);
  filter: brightness(0.9);
}

@keyframes badge-bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-1px);
  }
}

.badge-animation {
  animation: badge-bounce 2s ease-in-out infinite;
}

.toolbar {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 15;
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toolbar-item {
  display: flex;
  justify-content: center;
}

.toolbar-button {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid transparent;
}

.toolbar-button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  transform: scale(1.05);
}

.toolbar-button.active {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  transition: opacity 0.3s var(--a-curve);
  text-shadow:
    0 0 8px #666,
    0 0 2px #666;
  z-index: 10;
}

.center-above {
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
  align-items: center;
}

.mode-switch {
  z-index: 10;
}
</style>
