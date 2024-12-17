<script setup lang="ts">
import { ArrowDownOutline } from '@vicons/ionicons5'
import { NCard, NIcon, NSpin } from 'naive-ui'
import { ref } from 'vue'
import { useRequest } from 'vue-hooks-plus'

import { useChromeStorageState } from '@/hooks/useChromeStorageState'
import { sendGLMMessage } from '@/services/zhipu'

const isCardExpanded = ref(false)
const [apiKey] = useChromeStorageState('NEW_TAB_ZHI_PU_API_KEY', { default: '', chromeDefault: '' })

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
  '请生成一个与‘音乐’相关的英语单词。',
  '列出一个与‘运动’相关的英语单词。',
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
        content: '随机因子：' + Math.random() + '\n' + getRandomElement(PROMPT_LIST)
      }
    ])
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
</script>

<template>
  <div v-if="apiKey" class="word-card max-w-100 m-x-[auto] p-4">
    <div class="font-size-5 m-b-2">学单词</div>
    <div class="flex flex-col gap-4">
      <div class="whitespace-pre w-full font-size-6 font-bold">
        <NSpin v-if="loading" />
        <span v-else>{{ englishWord }}</span>
      </div>
      <div class="font-size-4 transition-height duration-300" v-if="isCardExpanded">
        <NSpin v-if="chineseWordLoading" />
        <span else> {{ chineseWord }}</span>
      </div>
      <div
        class="m-x-auto m-b--2 hover-color-[#18a058] cursor-pointer flex justify-center items-center gap-2 font-size-4"
        @click="
          () => {
            isCardExpanded = !isCardExpanded
          }
        "
      >
        <NIcon
          class="transition-all duration-300"
          :class="{ 'transform-rotate-180': isCardExpanded }"
        >
          <ArrowDownOutline />
        </NIcon>
        <span class="font-size-3">{{ isCardExpanded ? '收起' : '展开查看翻译' }}</span>
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
  .word-card__content {
    font-size: 1.5rem;
    font-weight: bold;
  }
}
</style>
