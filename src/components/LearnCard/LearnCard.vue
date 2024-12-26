<script setup lang="ts">
import { Speaker216Regular } from '@vicons/fluent'
import { ReloadOutline } from '@vicons/ionicons5'
import { FlipCameraAndroidFilled } from '@vicons/material'
import { NIcon, NSpin } from 'naive-ui'
import { ref, watch } from 'vue'
import { useRequest } from 'vue-hooks-plus'

import { useChromeStorageState } from '@/hooks/useChromeStorageState'
import { playAudioVoice } from '@/services/tts/volcano'
import { sendGLMMessage } from '@/services/zhipu'

const isCardFlip = ref(false)
const isCardFlipDelay = ref(false)
watch(isCardFlip, (value) => {
  setTimeout(() => {
    isCardFlipDelay.value = value
  }, 400)
})
const [apiKey] = useChromeStorageState('NEW_TAB_ZHI_PU_API_KEY', { default: '', chromeDefault: '' })
type WordInfo = {
  text: string
  addedTime: number
  count: number
}
const [learnHistory, setLearnHistory] = useChromeStorageState<WordInfo[]>('NEW_TAB_LEARN_HISTORY', {
  default: []
})

const PROMPT_LIST = [
  '请再随机生成一个英语单词。',
  '请再生成一个3到5个字母的英语单词。',
  '请再提供一个至少7个字母的英语单词。',
  '请再生成一个抽象的英语单词。',
  '请再生成一个英语专有名词。',
  '请再生成一个带有正面情感的英语单词。',
  '我还需要一个带有负面情感的英语单词。',
  '请再生成一个带有中性情感的英语单词。',
  '请再生成一个带有科技感的英语单词。',
  '请再生成一个带有艺术感的英语单词。',
  '请再生成一个雅思词汇表中的英语单词',
  '请再生成一个托福词汇表中的英语单词',
  '请再生成一个GRE词汇表中的英语单词',
  '请再生成一个考研词汇表中的英语单词',
  '请再生成一个高中词汇表中的英语单词'
]

function getRandomElement(arr: string[]) {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

const addWordToHistory = (word?: string | null) => {
  if (!word) {
    return
  }
  setLearnHistory([
    ...learnHistory.value,
    {
      text: word,
      addedTime: Date.now()
    }
  ])
}

const {
  data: englishWord,
  loading,
  refresh
} = useRequest(
  async () => {
    if (!apiKey.value) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
    const word = await sendGLMMessage([
      {
        role: 'system',
        content: '你是一个简单的单词生成助手，每次只需要随机生成一个新的英语单词, 不能和学过的重复'
      },
      {
        role: 'user',
        content:
          '这些是我学过的单词' +
          learnHistory.value.map((item) => item.text).join(',') +
          getRandomElement(PROMPT_LIST) +
          '\n'
      }
    ])
    addWordToHistory(word)
    return word
  },
  {
    refreshDeps: [apiKey]
  }
)

const { data: chineseWord, loading: chineseWordLoading } = useRequest(
  async () => {
    if (!apiKey.value) {
      return
    }
    return sendGLMMessage([
      {
        role: 'system',
        content: '请将该单词翻译为中文'
      },
      {
        role: 'user',
        content: englishWord.value
      }
    ])
  },
  {
    refreshDeps: [englishWord]
  }
)

const [ttsAccessToken] = useChromeStorageState('NEW_TAB_TTS_ACCESS_TOKEN', {
  default: '',
  chromeDefault: ''
})

const handleSpeak = async (word?: string | null) => {
  if (!word) {
    return
  }
  playAudioVoice(word)
}
</script>

<template>
  <div
    v-if="apiKey"
    class="word-card max-w-100 m-x-[auto] p-4 preserve-3d transition-all duration-1000"
    :class="{ 'transform-rotate-y-180': isCardFlip }"
  >
    <div v-if="!isCardFlipDelay" class="flex flex-col gap-4 relative backface-hidden">
      <div class="h-full w-full">
        <div class="font-size-5">学单词</div>
      </div>
      <div class="whitespace-pre w-full font-size-6 font-bold">
        <NSpin v-if="loading" />
        <span v-else>{{ englishWord }}</span>
      </div>
      <div class="flex gap-2 justify-center">
        <span
          v-if="ttsAccessToken"
          class="m-t-2 hover-color-[#18a058] cursor-pointer inline-flex items-center gap-2 font-size-4"
          @click="handleSpeak(englishWord)"
        >
          <NIcon>
            <Speaker216Regular />
          </NIcon>
          <span class="font-size-3">朗读</span>
        </span>
        <span
          class="m-t-2 hover-color-[#18a058] cursor-pointer inline-flex items-center gap-2 font-size-4"
          @click="
            () => {
              isCardFlip = !isCardFlip
            }
          "
        >
          <NIcon>
            <FlipCameraAndroidFilled />
          </NIcon>
          <span class="font-size-3">查看翻译</span>
        </span>
        <span
          class="m-t-2 hover-color-[#18a058] cursor-pointer inline-flex items-center gap-2 font-size-4"
          :class="{ 'pointer-events-none': loading }"
          @click="refresh"
        >
          <NIcon> <ReloadOutline /></NIcon>
          <span class="font-size-3">刷新</span>
        </span>
      </div>
    </div>
    <div v-else class="backface-hidden transform-rotate-y-180">
      <div class="h-full w-full">
        <div class="font-size-5">翻译</div>
      </div>
      <div class="m-y-8 font-size-4 transition-height duration-300">
        <NSpin v-if="chineseWordLoading" />
        <span else> {{ chineseWord }}</span>
      </div>
      <div
        class="m-x-auto m-t-2 hover-color-[#18a058] cursor-pointer flex justify-center items-center gap-2 font-size-4"
        @click="
          () => {
            isCardFlip = !isCardFlip
          }
        "
      >
        <NIcon>
          <FlipCameraAndroidFilled />
        </NIcon>
        <span class="font-size-3">查看单词</span>
      </div>
    </div>
  </div>
</template>

<style>
.word-card {
  text-shadow: none;
  color: #333;
  border-radius: 12px;
  background-color: rgba(236, 217, 188, 0.8);
  box-shadow: 0 3px 15px 2px rgba(191, 158, 118, 0.2);
  border: 1px solid rgba(224, 186, 140, 0.62);
}
</style>
