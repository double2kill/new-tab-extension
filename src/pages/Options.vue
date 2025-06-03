<script setup lang="ts">
import { createDiscreteApi, NConfigProvider, NInput, NSelect, NSwitch, zhCN } from 'naive-ui'

import { useChromeStorageState } from '@/hooks/useChromeStorageState'
import { CursorEffectType, setCursorEffect } from '@/utils/cursorEffect'

const [newTabCursorEffect, setNewTabCursorEffect] = useChromeStorageState<CursorEffectType>(
  'NEW_TAB_CURSOR_EFFECT',
  {
    onMounted: (value) => {
      if (value) {
        setCursorEffect(value)
      }
    }
  }
)

const [apiKey, setApiKey] = useChromeStorageState('NEW_TAB_ZHI_PU_API_KEY', {
  default: '',
  chromeDefault: ''
})
const [ttsAccessToken, setTtsAccessToken] = useChromeStorageState('NEW_TAB_TTS_ACCESS_TOKEN', {
  default: '',
  chromeDefault: ''
})

const [audioPlayActive, setAudioPlayActive] = useChromeStorageState('NEW_TAB_AUDIO_PLAY_ACTIVE', {
  default: false,
  chromeDefault: false
})

const options: { label: string; value: string }[] = [
  { label: '无效果', value: '' },
  { value: CursorEffectType.springyEmojiCursor, label: '弹性表情光标' },
  { value: CursorEffectType.fairyDustCursor, label: '仙女粉尘光标' },
  { value: CursorEffectType.snowflakeCursor, label: '雪花光标' },
  { value: CursorEffectType.characterCursor, label: '字符光标' },
  { value: CursorEffectType.trailingCursor, label: '拖尾光标' },
  { value: CursorEffectType.followingDotCursor, label: '跟随光标' },
  { value: CursorEffectType.bubbleCursor, label: '气泡光标' },
  { value: CursorEffectType.emojiCursor, label: '表情光标' },
  { value: CursorEffectType.ghostCursor, label: '幽灵光标' },
  { value: CursorEffectType.rainbowCursor, label: '彩虹光标' },
  { value: CursorEffectType.clockCursor, label: '时钟光标' },
  { value: CursorEffectType.textFlag, label: '文字旗帜' }
]

const handleCursorEffectChange = (value: CursorEffectType) => {
  setNewTabCursorEffect(value)
  setCursorEffect(value)
}

const handleAudioPlayChange = async (value: boolean) => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    if (value && devices.filter((device) => device.kind === 'audioinput')?.length <= 1) {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    }
    setAudioPlayActive(value)
  } catch (error) {
    const { message } = createDiscreteApi(['message'])
    message.error('请允许浏览器访问麦克风')
    setAudioPlayActive(false)
  }
}
</script>

<template>
  <NConfigProvider :locale="zhCN">
    <div style="width: 100vw; height: 100vh">
      <div style="margin: 20px">
        鼠标效果
        <NSelect
          clearable
          v-model:value="newTabCursorEffect"
          :options="options"
          @change="handleCursorEffectChange"
        />
      </div>
      <div style="margin: 20px">
        智谱 API Key
        <a href="https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys" target="_blank">点击获取</a>
        <NInput clearable v-model:value="apiKey" @update:value="setApiKey" />
      </div>
      <div style="margin: 20px">
        <NSwitch v-model:value="audioPlayActive" @change="handleAudioPlayChange" />
        播放声音(仅在耳机模式或者蓝牙模式下生效)
        <div style="margin-top: 10px" v-if="audioPlayActive">
          火山引擎 TTS accessToken
          <a href="https://console.volcengine.com/speech/app" target="_blank">点击获取</a>
          <NInput clearable v-model:value="ttsAccessToken" @update:value="setTtsAccessToken" />
        </div>
      </div>
    </div>
  </NConfigProvider>
</template>
