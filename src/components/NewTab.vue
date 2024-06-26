<script setup lang="ts">
import { onMounted, ref } from "vue";
import Time from './Time.vue'
import { NButton, NSwitch } from "naive-ui";
import dayjs from "dayjs";
import { useLocalStorageState } from "vue-hooks-plus";

const [waiTransform, setWaiTransform] = useLocalStorageState('new-tab.wai', {
  defaultValue: true,
})

const bgImgSrc = ref(localStorage.getItem('new-tab.background-image'))
onMounted(() => {
  const today = dayjs().format('YYYY-MM-DD')
  const fetchDate = localStorage.getItem('new-tab.fetch-background-image-date')
  if(fetchDate === today && bgImgSrc.value) {
    return
  }
  fetch('https://api.timelessq.com/bing').then(data => {
    bgImgSrc.value = data.url
    localStorage.setItem('new-tab.background-image', bgImgSrc.value)
    localStorage.setItem('new-tab.fetch-background-image-date', today)
  })
})

const handleChange = (value: boolean) => {
  setWaiTransform(value)
}

const getRandomInteger = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomDeg = ref(getRandomInteger(-90, 90))

const handleRandom = () => {
  fetch('https://api.timelessq.com/bing/random').then(data => {
    bgImgSrc.value = data.url
    localStorage.setItem('new-tab.background-image', bgImgSrc.value)
  })
}

</script>

<template>
  <img v-if="bgImgSrc" class="background-item" :src="bgImgSrc" alt="Bing每日壁纸UHD超高清原图" />
  <div class="app">
    <div class="center-above" :style="waiTransform ? `transform: rotate(${randomDeg}deg)`: ''">
      <Time />
      <!-- <h1>Hello New Tab !</h1> -->
      <!-- <FocusOn /> -->
    </div>
    <!-- <div class="center-below"></div>
    <div class="bottom-row"></div> -->
    <div class="settings">
      <NButton @click="handleRandom" quaternary type="primary" color="white">
        随机背景
      </NButton>
      <NSwitch v-model:value="waiTransform" @update:value="handleChange">
        <template #checked>
        歪脖子
        </template>
        <template #unchecked>
        歪脖子
        </template>
      </NSwitch>
    </div>
  </div>
</template>

<style scoped>
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
  font-family: Hiragino Sans GB, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;;
  display: flex;
  flex-direction: column;
  transition: opacity 0.3s var(--a-curve);
  text-shadow: 0 0 8px #666, 0 0 2px #666
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
  bottom: 10px;
  right: 10px;
}

</style>
