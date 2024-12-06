<script setup lang="ts">
import axios from 'axios'
import dayjs from 'dayjs'
import zhCN from 'dayjs/locale/zh-cn'
import { NCard, NSpin } from 'naive-ui'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useLocalStorageState, useRequest } from 'vue-hooks-plus'

import { useChromeStorageState } from '@/hooks/useChromeStorageState'
import { playAudioVoice } from '@/services/tts/volcano'
import { sendGLMMessage } from '@/services/zhipu'

const [apiKey] = useChromeStorageState('NEW_TAB_ZHI_PU_API_KEY', { default: '', chromeDefault: '' })
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

const PROMPT_LIST = [
  '请随机生成一个英语单词。',
  '生成一个与‘自然’相关的英语单词。',
  '生成一个与‘宇宙’相关的英语单词。',
  '生成一个与‘医学’相关的英语单词。',
  '生成一个与‘计算机科学’相关的英语单词。',
  '生成一个与‘法律’相关的英语单词。',
  '生成一个3到5个字母的英语单词。',
  '提供一个至少7个字母的英语单词。',
  '请生成一个抽象的英语单词。',
  '生成一个英语专有名词。',
  '我需要一个物质的英语名词。',
  '在描述‘海洋’时，提供一个相关的英语单词。',
  '关于‘环境保护’，请提供一个英语单词。',
  '在讨论‘古代文明’时，生成一个英语单词。',
  '生成一个以‘A’开头的英语单词。',
  '请提供一个以辅音字母结尾的英语单词。',
  '请生成五个与‘音乐’相关的英语单词。',
  '列出三个与‘运动’相关的英语单词。',
  '生成一个带有正面情感的英语单词。',
  '我需要一个带有负面情感的英语单词。'
]

function getRandomElement(arr: string[]) {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

const { data: englishWord, loading } = useRequest(
  async () => {
    if (!apiKey.value) {
      return
    }
    return sendGLMMessage([
      {
        role: 'system',
        content: '你是一个简单的单词生成助手，每次只需要随机生成一个英语单词'
      },
      {
        role: 'user',
        content: getRandomElement(PROMPT_LIST)
      }
    ])
  },
  {
    refreshDeps: [apiKey]
  }
)
</script>

<template>
  <h1>{{ currentTime }}</h1>
  <p v-html="currentDate" />
  <template v-if="apiKey">
    <NCard class="word-card" title="学单词">
      <div class="word-card__content">
        <NSpin v-if="loading" size="medium" />
        <span v-else>{{ englishWord }}</span>
      </div>
    </NCard>
  </template>
</template>

<style>
h1 {
  font-size: 6rem;
  margin: 0;
}
h4 {
  font-size: 2rem;
}
p {
  font-size: 1.5rem;
}

.word-card {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  &.n-card {
    text-shadow: none;
    color: #333;
    border-radius: 12px;
    background-color: rgba(236, 217, 188, 0.8);
    box-shadow: 0 3px 15px 2px rgba(191, 158, 118, 0.2);
    border: 1px solid rgba(224, 186, 140, 0.62);
  }
  .n-form-item-feedback-wrapper {
    min-height: auto;
  }
  .n-card__content {
    white-space: pre-wrap;
  }
  .word-card__content {
    font-size: 1.5rem;
    font-weight: bold;
  }
}
</style>
