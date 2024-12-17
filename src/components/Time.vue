<script setup lang="ts">
import axios from 'axios'
import dayjs from 'dayjs'
import zhCN from 'dayjs/locale/zh-cn'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useLocalStorageState } from 'vue-hooks-plus'

import { playAudioVoice } from '@/services/tts/volcano'

const DEFAULT_SKIP_TIMES = 10
const [audioSkipTimes, setAudioSkipTimes] = useLocalStorageState('new-tab.audio.skip-times', {
  defaultValue: 0
})

dayjs.locale(zhCN)

const currentTime = ref('')
const currentDate = ref('')
let intervalId: any = null

function refreshTime() {
  const date = dayjs()
  currentTime.value = date.format('HH:mm')
  currentDate.value = `今天是 <strong>${date.year()}</strong> 年 <strong>${date.month() + 1}</strong> 月 <strong>${date.date()}</strong> 日 <strong>${date.format('dddd')}</strong>`
}

onBeforeMount(() => {
  refreshTime()
  intervalId = setInterval(refreshTime, 1000)
})

onMounted(async () => {
  if (audioSkipTimes.value > 0) {
    setAudioSkipTimes(audioSkipTimes.value - 1)
    return
  }
  setAudioSkipTimes(DEFAULT_SKIP_TIMES)
  const { data: greetingMessageData } = await axios.get(
    'https://api.kuleu.com/api/getGreetingMessage'
  )
  playAudioVoice(greetingMessageData)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <h1 class="font-size-24 m-0">{{ currentTime }}</h1>
  <p v-html="currentDate" class="font-size-6" />
</template>
