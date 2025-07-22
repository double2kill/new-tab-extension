<script setup lang="ts">
import { Edit, Save, Task, TrashCan, Close } from '@vicons/carbon'
import { NButton, NCard, NIcon, NTooltip } from 'naive-ui'
import { onMounted, ref, nextTick } from 'vue'

import type { TaskItem } from '@/hooks/useTaskManager'

const props = defineProps<{
  data: TaskItem
  saveTask: (newData: TaskItem) => void
  completeTask: (id: number) => void
  deleteTask: (id: number) => void
}>()

const isEditMode = ref(false)
const titleRef = ref<HTMLElement>()
const descriptionRef = ref<HTMLElement>()
const originalData = ref<TaskItem>()

const setEditMode = (value: boolean) => {
  isEditMode.value = value
  if (value) {
    originalData.value = { ...props.data }
    nextTick(() => {
      if (titleRef.value) {
        titleRef.value.focus()
        // 如果标题为空，自动选中占位文本
        if (!props.data.title) {
          selectAllText(titleRef.value)
        }
      }
    })
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
  }
})

const handleTitleFocus = () => {
  if (isEditMode.value && !props.data.title && titleRef.value) {
    nextTick(() => {
      selectAllText(titleRef.value!)
    })
  }
}

const handleSave = () => {
  const title = titleRef.value?.textContent?.trim() || ''
  const description = descriptionRef.value?.textContent?.trim() || ''

  props.saveTask({
    ...props.data,
    title,
    description,
    updateTime: Date.now()
  })
  setEditMode(false)
}

const handleCancel = () => {
  if (titleRef.value && originalData.value) {
    titleRef.value.textContent = originalData.value.title || ''
  }
  if (descriptionRef.value && originalData.value) {
    descriptionRef.value.textContent = originalData.value.description || ''
  }
  setEditMode(false)
}

const completeTask = () => {
  props.completeTask(props.data.id || 0)
}

const deleteTask = () => {
  props.deleteTask(props.data.id || 0)
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
    <NCard class="task-card" :class="{ 'edit-mode': isEditMode }">
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
  transition: all 0.2s ease;
  text-shadow: none;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &.edit-mode {
    border-color: #22c55e;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
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
}
</style>
