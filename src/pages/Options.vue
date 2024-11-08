<script setup lang="ts">
import { NSelect } from 'naive-ui'

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
  setCursorEffect(value, true)
}
</script>

<template>
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
  </div>
</template>
