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

const options: { label: string; value: string }[] = Object.values(CursorEffectType).map(
  (effect: string) => ({
    label: effect,
    value: effect
  })
)

const handleCursorEffectChange = (value: CursorEffectType) => {
  setNewTabCursorEffect(value)
  setCursorEffect(value, true)
}
</script>

<template>
  <div style="width: 100vw; height: 100vh">
    鼠标效果
    <NSelect
      v-model:value="newTabCursorEffect"
      :options="options"
      @change="handleCursorEffectChange"
    />
  </div>
</template>
