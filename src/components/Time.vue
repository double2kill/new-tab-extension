<script setup lang="ts">
import dayjs from 'dayjs'
import zhCN from 'dayjs/locale/zh-cn'
import { NCard, NSpin } from 'naive-ui'
import { onBeforeMount, onUnmounted, ref } from 'vue'
import { useRequest } from 'vue-hooks-plus'

import { useChromeStorageState } from '@/hooks/useChromeStorageState'
import { sendGLMMessage } from '@/services/zhipu'

const [apiKey] = useChromeStorageState('NEW_TAB_ZHI_PU_API_KEY', { default: '', chromeDefault: '' })

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

onUnmounted(() => {
  clearInterval(intervalId)
})

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
        content: '随机生成一个单词'
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
