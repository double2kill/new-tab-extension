<script setup lang="ts">
import { Alarm } from '@vicons/carbon'
import { NIcon } from 'naive-ui'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  reminderTime: number
  reminderEnabled: boolean
  reminderShown?: boolean
  reminderShownTime?: number
}

const props = defineProps<Props>()

const currentTime = ref(Date.now())

// 计算剩余时间到提醒
const remainingTime = computed(() => {
  if (!props.reminderEnabled || !props.reminderTime) {
    return null
  }

  // 如果提醒已经显示过，显示已提醒状态
  if (props.reminderShown) {
    return '已提醒'
  }

  const remaining = props.reminderTime - currentTime.value
  if (remaining <= 0) {
    return '已过期'
  }

  const minutes = Math.floor(remaining / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}天${hours % 24}小时`
  } else if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`
  } else {
    return `${minutes}分钟`
  }
})

// 格式化提醒时间显示
const formatReminderTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// 定时更新当前时间
let timeInterval: NodeJS.Timeout | null = null

onMounted(() => {
  // 启动定时器更新当前时间
  timeInterval = setInterval(() => {
    currentTime.value = Date.now()
  }, 60000) // 每分钟更新一次
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
    timeInterval = null
  }
})
</script>

<template>
  <div v-if="reminderEnabled && reminderTime" class="reminder-info">
    <div class="reminder-display">
      <NIcon size="12" class="reminder-icon"><Alarm /></NIcon>
      <span class="reminder-text">
        <template v-if="remainingTime === '已过期'">
          <span class="reminder-overdue">{{ remainingTime }}</span>
          <span class="reminder-time">({{ formatReminderTime(reminderTime) }})</span>
        </template>
        <template v-else-if="remainingTime === '已提醒'">
          <span class="reminder-shown">{{ remainingTime }}</span>
          <span v-if="reminderShownTime" class="reminder-time">
            ({{ formatReminderTime(reminderShownTime) }})
          </span>
        </template>
        <template v-else>
          <span class="reminder-countdown">{{ remainingTime }}后提醒</span>
          <span class="reminder-time">({{ formatReminderTime(reminderTime) }})</span>
        </template>
      </span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.reminder-info {
  margin-bottom: 12px;
  padding: 6px 8px;
  background: #f8fafc;
  border-radius: 4px;
  border-left: 3px solid #3b82f6;

  .reminder-display {
    display: flex;
    align-items: center;
    gap: 6px;

    .reminder-icon {
      color: #3b82f6;
      flex-shrink: 0;
    }

    .reminder-text {
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;

      .reminder-countdown {
        color: #059669;
        font-weight: 500;
      }

      .reminder-overdue {
        color: #dc2626;
        font-weight: 500;
      }

      .reminder-shown {
        color: #059669;
        font-weight: 500;
      }

      .reminder-time {
        color: #6b7280;
        font-size: 11px;
      }
    }
  }
}
</style>
