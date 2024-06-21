<script setup lang="ts">
import { onMounted, ref } from "vue";
import FocusOn from './FocusOn.vue'
import Time from './Time.vue'
import { NSwitch } from "naive-ui";

const waiTransform = ref(localStorage.getItem('new-tab.wai') !== 'disabled')
const bgImgSrc = ref(localStorage.getItem('new-tab.background-image'))
onMounted(() => {
  fetch('https://api.timelessq.com/bing').then(data => {
    bgImgSrc.value = data.url
    localStorage.setItem('new-tab.background-image', bgImgSrc.value)
  })
})

const handleChange = (value: boolean) => {
  localStorage.setItem('new-tab.background-image', !value ? 'disabled': '')
}

const getRandomInteger = (min: number, max: number) => {
  // 确保min和max是整数
  min = Math.ceil(min);
  max = Math.floor(max);
  // Math.floor(Math.random() * (max - min + 1)) + min 将生成一个[min, max]之间的随机整数
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomDeg = ref(getRandomInteger(-90, 90))

// const count = ref(0);
</script>

<template>
  <img v-if="bgImgSrc" class="background-item" :src="bgImgSrc" alt="Bing每日壁纸UHD超高清原图" />
  <div class="app">
    <div class="center-above" :style="`transform: rotate(${randomDeg}deg)`">
      <Time />
      <!-- <h1>Hello New Tab !</h1> -->
      <!-- <FocusOn /> -->
    </div>
    <!-- <div class="center-below"></div>
    <div class="bottom-row"></div> -->
    <div class="settings">
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
  position: absolute;
  bottom: 10px;
  right: 10px;
}

</style>
