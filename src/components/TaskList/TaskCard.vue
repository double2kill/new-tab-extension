<script setup lang="ts">
import { Edit, Save, Task } from '@vicons/carbon'
import { NButton, NCard, NForm, NFormItem, NIcon, NInput, NTooltip } from 'naive-ui'
import { onMounted, ref, toRaw } from 'vue'

import type { TaskItem } from './type'

const props = defineProps<{
  data: TaskItem
  saveTask: (newData: TaskItem) => void
  completeTask: (id: number) => void
}>()

const isEditMode = ref(false)
const formValue = ref<Partial<TaskItem>>({})

const setEditMode = (value: boolean) => {
  isEditMode.value = value
  if (value) {
    formValue.value = { ...props.data }
  }
}

onMounted(() => {
  if (!props.data.updateTime) {
    setEditMode(true)
  }
})

const rules = {
  description: {
    required: true,
    message: '请输入任务内容',
    trigger: 'blur'
  }
}
const handleSave = () => {
  const newValue = toRaw(formValue.value)
  props.saveTask({
    ...newValue,
    id: props.data.id || Date.now(),
    title: newValue.title || '',
    description: newValue.description || '',
    updateTime: Date.now()
  })
  setEditMode(false)
}

const completeTask = () => {
  props.completeTask(props.data.id || 0)
}
</script>

<template>
  <NForm :model="formValue" :rules="rules" class="task-card" :show-label="false">
    <NCard size="small">
      <template #header>
        <template v-if="!isEditMode">
          {{ data.title }}
        </template>
        <template v-else>
          <NFormItem path="title">
            <NInput v-model:value="formValue.title" placeholder="输入任务标题" />
          </NFormItem>
        </template>
      </template>
      <template #header-extra>
        <template v-if="!isEditMode">
          <NTooltip trigger="hover">
            <template #trigger>
              <NButton quaternary size="small" style="padding: 6px" @click="setEditMode(true)">
                <NIcon size="18"> <Edit /> </NIcon>
              </NButton>
            </template>
            修改任务
          </NTooltip>
          <NTooltip trigger="hover">
            <template #trigger>
              <NButton quaternary size="small" style="padding: 6px" @click="completeTask()">
                <NIcon size="18" color="#0e7a0d"> <Task /> </NIcon>
              </NButton>
            </template>
            任务完成
          </NTooltip>
        </template>
        <template v-else>
          <NTooltip trigger="hover">
            <template #trigger>
              <NButton quaternary size="small" style="padding: 6px" @click="handleSave">
                <NIcon size="18" color="#0e7a0d"> <Save /> </NIcon>
              </NButton>
            </template>
            保存
          </NTooltip>
        </template>
      </template>
      <span v-if="!isEditMode">
        {{ data.description }}
      </span>
      <NFormItem v-else path="description">
        <NInput
          v-model:value="formValue.description"
          placeholder="输入任务内容"
          type="textarea"
          :autosize="{ minRows: 1 }"
        />
      </NFormItem>
    </NCard>
  </NForm>
</template>

<style lang="less">
.task-card {
  width: 100%;
  max-width: 300px;
  .n-card {
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
}
</style>
