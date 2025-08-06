<script setup lang="ts">
import { Edit, Save, Task, TrashCan, Close, Time, Calendar } from '@vicons/carbon'
import { NButton, NCard, NIcon, NTooltip, NTag } from 'naive-ui'
import { onMounted, ref, nextTick, computed } from 'vue'

import ReminderCountdown from './ReminderCountdown.vue'
import ReminderEditor from './ReminderEditor.vue'

import type { TaskItem } from '@/hooks/useTaskManager'
import logger from '@/utils/logger'

const props = defineProps<{
  data: TaskItem
  saveTask: (newData: TaskItem) => void
  completeTask: (id: number) => void
  deleteTask: (id: number) => void
  resetReminder?: (id: number) => void
}>()

const isEditMode = ref(false)
const titleRef = ref<HTMLElement>()
const descriptionRef = ref<HTMLElement>()
const originalData = ref<TaskItem>()

// 编辑模式下的本地数据状态
const editData = ref<TaskItem>({} as TaskItem)

// 快速标签卡功能
const isNewTask = computed(() => !props.data.updateTime)
const showQuickTags = computed(() => isNewTask.value && isEditMode.value)
const selectedQuickTag = ref<string | null>('hour')

// 计算卡片应该显示的颜色类型
const cardColorType = computed(() => {
  if (isEditMode.value && selectedQuickTag.value) {
    return selectedQuickTag.value
  }

  const data = isEditMode.value ? editData.value : props.data
  if (data.reminderEnabled && data.reminderTime) {
    const now = Date.now()
    const timeDiff = data.reminderTime - now

    if (data.reminderType === 'day') {
      return 'day'
    } else if (data.reminderType === 'hour') {
      if (timeDiff <= 3600000) {
        // 1小时内
        return 'hour'
      } else if (timeDiff <= 7200000) {
        // 2小时内
        return '2hour'
      }
    }
  }

  return null
})

// 提醒时间相关
const showReminderEditor = ref(false)

// 处理提醒更新
const handleReminderUpdate = async (data: {
  reminderTime: number
  reminderEnabled: boolean
  reminderType: 'minute' | 'hour' | 'day' | 'custom'
}) => {
  // 在展示模式下直接保存任务
  if (!isEditMode.value) {
    props.saveTask({
      ...props.data,
      reminderTime: data.reminderTime,
      reminderEnabled: data.reminderEnabled,
      reminderType: data.reminderType,
      reminderShown: false,
      reminderShownTime: undefined
    })

    await logger.info(
      '用户更新任务提醒',
      {
        taskId: props.data.id,
        title: props.data.title,
        oldReminderTime: props.data.reminderTime,
        newReminderTime: data.reminderTime,
        reminderType: data.reminderType
      },
      'TaskCard'
    )
  } else {
    // 在编辑模式下更新本地数据
    editData.value.reminderTime = data.reminderTime
    editData.value.reminderEnabled = data.reminderEnabled
    editData.value.reminderType = data.reminderType
    editData.value.reminderShown = false
    editData.value.reminderShownTime = undefined
  }
}

// 取消提醒
const handleReminderCancel = async () => {
  // 在展示模式下直接保存任务
  if (!isEditMode.value) {
    props.saveTask({
      ...props.data,
      reminderEnabled: false,
      reminderTime: undefined,
      reminderShown: false,
      reminderShownTime: undefined
    })

    await logger.info(
      '用户取消任务提醒',
      {
        taskId: props.data.id,
        title: props.data.title
      },
      'TaskCard'
    )
  } else {
    // 在编辑模式下更新本地数据
    editData.value.reminderEnabled = false
    editData.value.reminderTime = undefined
    editData.value.reminderShown = false
    editData.value.reminderShownTime = undefined
  }
}

const handleQuickTag = (type: 'hour' | 'day' | '2hour') => {
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

  // 更新本地编辑数据
  editData.value.reminderTime = reminderTime
  editData.value.reminderEnabled = true
  editData.value.reminderType = reminderType
  editData.value.reminderShown = false
  editData.value.reminderShownTime = undefined
  selectedQuickTag.value = type

  console.log('设置快速提醒:', type, '时间:', new Date(reminderTime).toLocaleString())
}

const setEditMode = (value: boolean) => {
  isEditMode.value = value
  if (value) {
    originalData.value = { ...props.data }
    // 初始化编辑数据
    editData.value = { ...props.data }
    // 只有新建任务时才重置选中状态，但保留默认提醒
    if (!props.data.updateTime && !props.data.reminderTime) {
      selectedQuickTag.value = null
    }
    nextTick(() => {
      if (titleRef.value) {
        titleRef.value.focus()
        // 如果标题为空，自动选中占位文本
        if (!props.data.title) {
          selectAllText(titleRef.value)
        }
      }
    })
  } else {
    // 退出编辑模式时关闭提醒编辑器
    showReminderEditor.value = false
  }
}

const selectAllText = (element: HTMLElement) => {
  const range = document.createRange()
  range.selectNodeContents(element)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

const handleDescriptionFocus = () => {
  if (isEditMode.value && !props.data.description && descriptionRef.value) {
    nextTick(() => {
      selectAllText(descriptionRef.value!)
    })
  }
}

onMounted(() => {
  if (!props.data.updateTime) {
    setEditMode(true)
    // 只在真正的新任务（没有标题和描述）时设置默认提醒
    nextTick(() => {
      if (!props.data.title && !props.data.description) {
        handleQuickTag('hour')
      }
    })
  } else {
    // 对于已存在的任务，根据提醒时间设置颜色
    if (props.data.reminderEnabled && props.data.reminderTime) {
      const now = Date.now()
      const timeDiff = props.data.reminderTime - now

      if (props.data.reminderType === 'day') {
        selectedQuickTag.value = 'day'
      } else if (props.data.reminderType === 'hour') {
        if (timeDiff <= 3600000) {
          // 1小时内
          selectedQuickTag.value = 'hour'
        } else if (timeDiff <= 7200000) {
          // 2小时内
          selectedQuickTag.value = '2hour'
        }
      }
    }
  }
})

const handleTitleFocus = () => {
  if (isEditMode.value && !props.data.title && titleRef.value) {
    nextTick(() => {
      selectAllText(titleRef.value!)
    })
  }
}

const handleSave = async () => {
  const title = titleRef.value?.textContent?.trim() || ''
  const description = descriptionRef.value?.textContent?.trim() || ''

  // 确保提醒状态被重置
  const taskData = {
    ...editData.value,
    title,
    description,
    updateTime: Date.now(),
    reminderShown: false,
    reminderShownTime: undefined
  }

  props.saveTask(taskData)
  setEditMode(false)

  // 记录保存日志
  await logger.info(
    '用户保存任务',
    {
      taskId: taskData.id,
      title: taskData.title,
      hasReminder: taskData.reminderEnabled,
      reminderTime: taskData.reminderTime
    },
    'TaskCard'
  )

  // 根据实际的提醒时间类型设置selectedQuickTag，而不是重置为null
  if (editData.value.reminderEnabled && editData.value.reminderTime) {
    const now = Date.now()
    const timeDiff = editData.value.reminderTime - now

    if (editData.value.reminderType === 'day') {
      selectedQuickTag.value = 'day'
    } else if (editData.value.reminderType === 'hour') {
      if (timeDiff <= 3600000) {
        // 1小时内
        selectedQuickTag.value = 'hour'
      } else if (timeDiff <= 7200000) {
        // 2小时内
        selectedQuickTag.value = '2hour'
      }
    }
  } else {
    selectedQuickTag.value = null
  }
}

const handleCancel = () => {
  if (originalData.value) {
    editData.value = { ...originalData.value }
    if (titleRef.value) {
      titleRef.value.textContent = originalData.value.title || ''
    }
    if (descriptionRef.value) {
      descriptionRef.value.textContent = originalData.value.description || ''
    }
  }
  setEditMode(false)
  selectedQuickTag.value = null // 重置选中状态
}

const completeTask = () => {
  props.completeTask(props.data.id || 0)
}

const deleteTask = () => {
  props.deleteTask(props.data.id || 0)
}

const resetReminder = async () => {
  if (props.resetReminder) {
    props.resetReminder(props.data.id || 0)
    await logger.info(
      '用户重置任务提醒',
      { taskId: props.data.id, title: props.data.title },
      'TaskCard'
    )
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault()
    handleSave()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    handleCancel()
  }
}

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') || ''
  document.execCommand('insertText', false, text)
}
</script>

<template>
  <div class="task-card-wrapper">
    <NCard
      class="task-card"
      :class="{
        'edit-mode': isEditMode,
        'selected-hour': cardColorType === 'hour',
        'selected-2hour': cardColorType === '2hour',
        'selected-day': cardColorType === 'day'
      }"
    >
      <!-- 快速标签卡 - 移到header前面 -->
      <div v-if="showQuickTags" class="quick-tags">
        <div class="quick-tags-buttons">
          快速提醒
          <NTag
            type="error"
            size="small"
            class="quick-tag"
            :class="{ selected: selectedQuickTag === 'hour' }"
            @click="handleQuickTag('hour')"
          >
            <template #icon>
              <NIcon size="12"><Time /></NIcon>
            </template>
            1小时
          </NTag>
          <NTag
            type="warning"
            size="small"
            class="quick-tag"
            :class="{ selected: selectedQuickTag === '2hour' }"
            @click="handleQuickTag('2hour')"
          >
            <template #icon>
              <NIcon size="12"><Time /></NIcon>
            </template>
            2小时
          </NTag>
          <NTag
            size="small"
            class="quick-tag"
            :class="{ selected: selectedQuickTag === 'day' }"
            @click="handleQuickTag('day')"
          >
            <template #icon>
              <NIcon size="12"><Calendar /></NIcon>
            </template>
            当天
          </NTag>
        </div>
      </div>

      <!-- 提醒时间显示 - 移到header前面 -->
      <ReminderCountdown
        :reminder-enabled="(isEditMode ? editData : data).reminderEnabled"
        :reminder-time="(isEditMode ? editData : data).reminderTime"
        :reminder-shown="(isEditMode ? editData : data).reminderShown"
        :reminder-shown-time="(isEditMode ? editData : data).reminderShownTime"
      />

      <div class="task-header">
        <div class="task-title-area">
          <h3
            ref="titleRef"
            class="task-title"
            :class="{ 'empty-title': !data.title }"
            :contenteditable="isEditMode"
            @keydown="handleKeydown"
            @paste="handlePaste"
            @blur="
              isEditMode &&
                titleRef?.textContent?.trim() === '' &&
                (titleRef.textContent = data.title || '')
            "
            @focus="handleTitleFocus"
          >
            {{ data.title || '未命名任务' }}
          </h3>
        </div>

        <div class="action-buttons">
          <template v-if="!isEditMode">
            <!-- 展示模式下的提醒按钮 -->
            <ReminderEditor
              v-model="showReminderEditor"
              :reminder-enabled="data.reminderEnabled"
              :reminder-time="data.reminderTime"
              :reminder-type="data.reminderType"
              @update:reminder="handleReminderUpdate"
              @cancel="handleReminderCancel"
            />

            <NTooltip trigger="hover" placement="top">
              <template #trigger>
                <NButton size="small" circle class="action-btn edit-btn" @click="setEditMode(true)">
                  <NIcon size="14"><Edit /></NIcon>
                </NButton>
              </template>
              编辑
            </NTooltip>

            <NTooltip trigger="hover" placement="top">
              <template #trigger>
                <NButton
                  size="small"
                  circle
                  class="action-btn complete-btn"
                  @click="completeTask()"
                >
                  <NIcon size="14"><Task /></NIcon>
                </NButton>
              </template>
              完成
            </NTooltip>

            <NTooltip trigger="hover" placement="top">
              <template #trigger>
                <NButton size="small" circle class="action-btn delete-btn" @click="deleteTask()">
                  <NIcon size="14"><TrashCan /></NIcon>
                </NButton>
              </template>
              删除
            </NTooltip>

            <NTooltip v-if="data.reminderShown" trigger="hover" placement="top">
              <template #trigger>
                <NButton size="small" circle class="action-btn reset-btn" @click="resetReminder()">
                  <NIcon size="14"><Time /></NIcon>
                </NButton>
              </template>
              重置提醒
            </NTooltip>
          </template>

          <template v-else>
            <NTooltip trigger="hover" placement="top">
              <template #trigger>
                <NButton size="small" circle class="action-btn save-btn" @click="handleSave">
                  <NIcon size="14"><Save /></NIcon>
                </NButton>
              </template>
              保存 (Ctrl+Enter)
            </NTooltip>

            <NTooltip trigger="hover" placement="top">
              <template #trigger>
                <NButton size="small" circle class="action-btn cancel-btn" @click="handleCancel">
                  <NIcon size="14"><Close /></NIcon>
                </NButton>
              </template>
              取消 (Esc)
            </NTooltip>
          </template>
        </div>
      </div>

      <div class="task-content">
        <p
          ref="descriptionRef"
          class="task-description"
          :class="{ 'empty-description': !data.description }"
          :contenteditable="isEditMode"
          @keydown="handleKeydown"
          @paste="handlePaste"
          @blur="
            isEditMode &&
              descriptionRef?.textContent?.trim() === '' &&
              (descriptionRef.textContent = data.description || '')
          "
          @focus="handleDescriptionFocus"
        >
          {{ data.description || '点击编辑按钮添加描述...' }}
        </p>
      </div>
    </NCard>
  </div>
</template>

<style lang="less">
.task-card-wrapper {
  width: 100%;
}

.task-card.n-card {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  text-shadow: none;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &.edit-mode {
    border-color: #22c55e;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
  }

  // 选中状态的颜色变化 - 按时间紧迫性排序
  &.selected-hour {
    border-color: #dc2626;
    background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
    box-shadow:
      0 0 0 2px rgba(220, 38, 38, 0.2),
      0 4px 12px rgba(220, 38, 38, 0.1);
  }

  &.selected-2hour {
    border-color: #f59e0b;
    background: linear-gradient(135deg, #ffffff 0%, #fef3c7 100%);
    box-shadow:
      0 0 0 2px rgba(245, 158, 11, 0.2),
      0 4px 12px rgba(245, 158, 11, 0.1);
  }

  &.selected-day {
    border-color: #6b7280;
    background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
    box-shadow:
      0 0 0 2px rgba(107, 114, 128, 0.2),
      0 4px 12px rgba(107, 114, 128, 0.1);
  }

  .n-card__content {
    padding: 16px;
  }
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.task-title-area {
  flex: 1;
  min-width: 0;

  .task-title {
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    color: #111827;
    line-height: 1.4;
    text-shadow: none;
    outline: none;
    transition: all 0.2s ease;

    &.empty-title {
      color: #9ca3af;
      font-style: italic;
    }

    &[contenteditable='true'] {
      background-color: #f9fafb;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      padding: 4px 6px;

      &:focus {
        border-color: #22c55e;
        box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
        background-color: #ffffff;
      }
    }
  }
}

.action-buttons {
  display: flex;
  gap: 4px;
  flex-shrink: 0;

  .action-btn {
    border: none;
    text-shadow: none;
    width: 28px;
    height: 28px;

    &.edit-btn {
      background: #f9fafb;
      color: #6b7280;

      &:hover {
        background: #f3f4f6;
        color: #374151;
      }
    }

    &.complete-btn {
      background: #f0fdf4;
      color: #16a34a;

      &:hover {
        background: #dcfce7;
        color: #15803d;
      }
    }

    &.delete-btn {
      background: #fef2f2;
      color: #dc2626;

      &:hover {
        background: #fee2e2;
        color: #b91c1c;
      }
    }

    &.reset-btn {
      background: #f0fdf4;
      color: #059669;

      &:hover {
        background: #dcfce7;
        color: #047857;
      }
    }

    &.save-btn {
      background: #f0fdf4;
      color: #16a34a;

      &:hover {
        background: #dcfce7;
        color: #15803d;
      }
    }

    &.cancel-btn {
      background: #f9fafb;
      color: #6b7280;

      &:hover {
        background: #f3f4f6;
        color: #374151;
      }
    }
  }
}

.task-content {
  .task-description {
    margin: 0;
    color: #6b7280;
    line-height: 1.5;
    white-space: pre-wrap;
    font-size: 13px;
    text-shadow: none;
    outline: none;
    transition: all 0.2s ease;
    min-height: 20px;

    &.empty-description {
      color: #9ca3af;
      font-style: italic;
    }

    &[contenteditable='true'] {
      background-color: #f9fafb;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      padding: 6px 8px;
      min-height: 40px;

      &:focus {
        border-color: #22c55e;
        box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
        background-color: #ffffff;
      }

      &.empty-description {
        color: #9ca3af;
      }
    }
  }
}

.quick-tags {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  .quick-tags-title {
    font-size: 13px;
    color: #374151;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .quick-tags-buttons {
    display: flex;
    gap: 8px;

    .quick-tag {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      &:active {
        transform: translateY(0);
      }

      &.selected {
        border-color: currentColor;
        box-shadow: 0 0 0 2px currentColor;
        font-weight: 600;
        transform: scale(1.05);
      }
    }
  }
}

@media (max-width: 768px) {
  .task-card.n-card {
    .n-card__content {
      padding: 12px;
    }
  }

  .task-header {
    margin-bottom: 10px;
    gap: 8px;
  }

  .action-buttons {
    gap: 2px;

    .action-btn {
      width: 26px;
      height: 26px;
    }
  }

  .quick-tags {
    .quick-tags-buttons {
      flex-wrap: wrap;
      gap: 6px;

      .quick-tag {
        font-size: 11px;
      }
    }
  }
}
</style>
