<script setup lang="ts">
// import Live2d from './Live2d.vue'
import {
  Heart,
  HeartOutline,
  ReloadOutline,
  SettingsOutline,
  TrashOutline
} from '@vicons/ionicons5'
import dayjs from 'dayjs'
import {
  NButton,
  NCard,
  NDrawer,
  NDrawerContent,
  NIcon,
  NPopover,
  NSlider,
  NSpace,
  NSwitch,
  NTooltip
} from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useLocalStorageState } from 'vue-hooks-plus'

import Time from './Time.vue'

import VueLive2d from '@/components/VueLive2d/index.vue'

const [list, setList] = useLocalStorageState('new-tab.list', {
  defaultValue: []
})
const active = ref(false)
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

const [waiMode, setWaiMode] = useLocalStorageState('new-tab.wai.mode', {
  defaultValue: 'random'
})

const isWaiFixed = computed(() => {
  return waiMode.value === 'fixed'
})

const bgImgSrc = ref(localStorage.getItem('new-tab.background-image'))
onMounted(() => {
  randomDeg.value = localStorage.getItem('new-tab.wai.deg')
    ? parseInt(localStorage.getItem('new-tab.wai.deg') as string)
    : getRandomInteger(MIN, MAX)
  const today = dayjs().format('YYYY-MM-DD')
  const fetchDate = localStorage.getItem('new-tab.fetch-background-image-date')
  if (fetchDate === today && bgImgSrc.value) {
    return
  }
  fetch('https://api.timelessq.com/bing').then((data) => {
    bgImgSrc.value = data.url
    localStorage.setItem('new-tab.background-image', bgImgSrc.value)
    localStorage.setItem('new-tab.fetch-background-image-date', today)
  })
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

const handleRandom = () => {
  fetch('https://api.timelessq.com/bing/random').then((data) => {
    bgImgSrc.value = data.url
    localStorage.setItem('new-tab.background-image', bgImgSrc.value)
  })
}

const handleLikeOrDislike = () => {
  let likeList = [...list.value]
  if (likeList.includes(bgImgSrc.value)) {
    likeList = likeList.filter((item) => item !== bgImgSrc.value)
  } else {
    likeList.push(bgImgSrc.value)
  }
  setList(likeList)
}

const handleDelete = (link: string) => {
  let likeList = [...list.value]
  likeList = likeList.filter((item) => item !== link)
  setList(likeList)
}

let tips = ref({
  mouseover: [
    {
      selector: '.vue3-live2d',
      texts: ['请查看源代码了解如何修改默认语句']
    }
  ]
})

const handleShowDrawer = () => {
  active.value = true
}

const handleSelect = (link: string) => {
  bgImgSrc.value = link
  localStorage.setItem('new-tab.background-image', bgImgSrc.value)
}

const [live2dModel, setLive2dModel] = useLocalStorageState('new-tab.live2d.model', {
  defaultValue: ['Potion-Maker/Pio', 'school-2017-costume-yellow']
})

const [live2dMainShow, setLive2dMainShow] = useLocalStorageState('new-tab.live2d.visible', {
  defaultValue: true
})
</script>

<template>
  <img v-if="bgImgSrc" class="background-item" :src="bgImgSrc" alt="Bing每日壁纸UHD超高清原图" />
  <div class="app">
    <div class="center-above" :style="`transform: rotate(${-randomDeg}deg)`">
      <Time />
      <!-- <h1>Hello New Tab !</h1> -->
      <!-- <FocusOn /> -->
    </div>
    <div style="width: 600px; margin: 0 auto; margin-bottom: 10px">
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
      <NSpace>
        <NButton round type="primary" @click="handleShowDrawer"> 收藏列表 </NButton>
        <NTooltip trigger="hover">
          <template #trigger>
            <NButton quaternary circle type="success" @click="handleLikeOrDislike">
              <template #icon>
                <NIcon size="30">
                  <Heart v-if="list.includes(bgImgSrc)" />
                  <HeartOutline v-else />
                </NIcon>
              </template>
            </NButton>
          </template>
          {{ list.includes(bgImgSrc) ? '不再喜欢' : '喜欢此背景' }}
        </NTooltip>
        <NTooltip trigger="hover">
          <template #trigger>
            <NButton quaternary circle type="success" @click="handleRandom">
              <template #icon>
                <NIcon size="30"> <ReloadOutline /></NIcon>
              </template>
            </NButton>
          </template>
          随机背景
        </NTooltip>
      </NSpace>
      <NDrawer v-model:show="active" :default-width="400" placement="left" resizable>
        <NDrawerContent title="收藏列表">
          <NCard v-for="(item, index) in list" :key="index" hoverable class="image-item">
            <template #cover>
              <img @click="handleSelect(item)" height="200" :src="item" style="cursor: pointer" />
            </template>
            <NButton quaternary circle type="success" @click="handleDelete(item)">
              <template #icon>
                <NIcon size="20"> <TrashOutline /></NIcon>
              </template>
            </NButton>
          </NCard>
        </NDrawerContent>
      </NDrawer>
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
  flex-direction: column;
}
.top-row,
.bottom-row {
  height: 1000px;
  display: flex;
  justify-content: space-between;
}

.settings {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 20px;
  left: 20px;
}

.n-card.image-item > .n-card__content {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 10px;
}
</style>
