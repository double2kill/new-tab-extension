<script setup lang="ts">
import { Alarm } from '@vicons/carbon'
import { NButton, NIcon, NTooltip, NTag, NPopover, NDatePicker, NText, NSpace } from 'naive-ui'
import { ref, computed } from 'vue'

interface ReminderEditorProps {
  modelValue: boolean
  reminderEnabled: boolean
  reminderTime?: number
  reminderType?: 'minute' | 'hour' | 'day' | 'custom'
}

interface ReminderEditorEmits {
  (e: 'update:modelValue', value: boolean): void
  (
    e: 'update:reminder',
    data: {
      reminderTime: number
      reminderEnabled: boolean
      reminderType: 'minute' | 'hour' | 'day' | 'custom'
    }
  ): void
  (e: 'cancel'): void
}

const props = defineProps<ReminderEditorProps>()
const emit = defineEmits<ReminderEditorEmits>()

const customReminderTime = ref<number | null>(null)

// 计算属性
const showEditor = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 快速提醒设置
const setQuickReminder = (type: 'hour' | '2hour' | 'day') => {
  const now = Date.now()
  let reminderTime: number
  let reminderType: 'hour' | 'day'

  switch (type) {
    case 'hour':
      reminderTime = now + 3600000 // 1小时后
      reminderType = 'hour'
      break
    case '2hour':
      reminderTime = now + 7200000 // 2小时后
      reminderType = 'hour'
      break
    case 'day':
      // 当天结束时间（23:59:59）
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      reminderTime = today.getTime()
      reminderType = 'day'
      break
  }

  emit('update:reminder', {
    reminderTime,
    reminderEnabled: true,
    reminderType
  })
  showEditor.value = false
}

// 设置自定义提醒时间
const setCustomReminder = () => {
  if (customReminderTime.value) {
    emit('update:reminder', {
      reminderTime: customReminderTime.value,
      reminderEnabled: true,
      reminderType: 'custom'
    })
    showEditor.value = false
  }
}

// 取消提醒
const cancelReminder = () => {
  emit('cancel')
  showEditor.value = false
}

// 初始化自定义时间
const initCustomTime = () => {
  if (props.reminderEnabled && props.reminderTime) {
    customReminderTime.value = props.reminderTime
  } else {
    customReminderTime.value = null
  }
}

// 监听编辑器打开，初始化值
const handleEditorToggle = () => {
  if (showEditor.value) {
    initCustomTime()
  }
}
</script>

<template>
  <NPopover trigger="click" placement="bottom" :show="showEditor" @update:show="handleEditorToggle">
    <template #trigger>
      <NTooltip trigger="hover" placement="top">
        <template #trigger>
          <NButton
            size="small"
            circle
            :class="['action-btn', 'reminder-btn', { 'reminder-active': reminderEnabled }]"
            @click="showEditor = !showEditor"
          >
            <NIcon size="14"><Alarm /></NIcon>
          </NButton>
        </template>
        {{ reminderEnabled ? '编辑提醒' : '设置提醒' }}
      </NTooltip>
    </template>

    <div class="reminder-editor">
      <!-- 快速提醒选项 -->
      <div class="quick-reminder-section">
        <NText depth="3" style="font-size: 12px; margin-bottom: 8px">快速提醒</NText>
        <div class="quick-reminder-buttons">
          <NTag
            type="error"
            size="small"
            class="quick-reminder-tag"
            @click="setQuickReminder('hour')"
          >
            1小时
          </NTag>
          <NTag
            type="warning"
            size="small"
            class="quick-reminder-tag"
            @click="setQuickReminder('2hour')"
          >
            2小时
          </NTag>
          <NTag
            type="info"
            size="small"
            class="quick-reminder-tag"
            @click="setQuickReminder('day')"
          >
            当天
          </NTag>
        </div>
      </div>

      <!-- 自定义时间选择 -->
      <div class="custom-reminder-section">
        <NText depth="3" style="font-size: 12px; margin: 12px 0 8px 0">自定义时间</NText>
        <NDatePicker
          v-model:value="customReminderTime"
          type="datetime"
          size="small"
          style="width: 100%"
          placeholder="选择提醒时间"
        />
      </div>

      <!-- 操作按钮 -->
      <NSpace style="margin-top: 12px" justify="end">
        <NButton v-if="reminderEnabled" size="small" @click="cancelReminder"> 取消提醒 </NButton>
        <NButton
          size="small"
          type="primary"
          @click="setCustomReminder"
          :disabled="!customReminderTime"
        >
          确定
        </NButton>
      </NSpace>
    </div>
  </NPopover>
</template>

<style lang="less" scoped>
.reminder-editor {
  width: 240px;
  padding: 16px;

  .quick-reminder-section {
    margin-bottom: 12px;

    .quick-reminder-buttons {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      .quick-reminder-tag {
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }

  .custom-reminder-section {
    border-top: 1px solid #e5e7eb;
    padding-top: 12px;
  }
}

.action-btn {
  border: none;
  text-shadow: none;
  width: 28px;
  height: 28px;

  &.reminder-btn {
    background: #f8fafc;
    color: #6b7280;

    &:hover {
      background: #f1f5f9;
      color: #3b82f6;
    }

    &.reminder-active {
      background: #dbeafe;
      color: #3b82f6;

      &:hover {
        background: #bfdbfe;
      }
    }
  }
}
</style>
