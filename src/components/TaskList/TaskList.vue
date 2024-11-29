<script setup lang="ts">
import { AddOutline } from '@vicons/ionicons5'
import { NButton, NIcon } from 'naive-ui'
import { computed, onMounted } from 'vue'
import { useLocalStorageState } from 'vue-hooks-plus'

import TaskCard from './TaskCard.vue'
import type { TaskItem } from './type'

const [taskList, setTaskList] = useLocalStorageState<TaskItem[]>('new-tab.task-list', {
  defaultValue: []
})
const handleSaveTas = (taskData: TaskItem) => {
  setTaskList((prev: TaskItem[] = []) => {
    const index = prev.findIndex((item) => item.id === taskData.id)
    if (index !== -1) {
      prev.splice(index, 1, taskData)
    } else {
      prev.push(taskData)
    }
    return [...prev]
  })
}
const handleCompleteTask = (id: number) => {
  setTaskList((prev: TaskItem[] = []) => {
    const index = prev.findIndex((item) => item.id === id)
    if (index !== -1) {
      prev.splice(index, 1, { ...prev[index], completedTime: Date.now() })
    }
    return [...prev]
  })
}
const handleAddTask = () => {
  setTaskList((prev: TaskItem[] = []) => {
    return [
      ...prev,
      {
        id: Date.now(),
        title: '',
        description: '',
        completedTime: 0
      }
    ]
  })
}

onMounted(() => {
  const validTaskList = taskList.value?.filter((item) => item.updateTime)
  setTaskList(validTaskList)
})
const unCompletedTaskList = computed(() => taskList.value?.filter((item) => !item.completedTime))
</script>
<template>
  <div class="task-list">
    <TaskCard
      v-for="taskItem in unCompletedTaskList"
      :key="taskItem.id"
      :data="taskItem"
      :saveTask="handleSaveTas"
      :completeTask="handleCompleteTask"
    />
    <NButton class="task-card add-new-card" secondary @click="handleAddTask">
      <NIcon size="24"> <AddOutline /> </NIcon> 添加任务
    </NButton>
  </div>
</template>

<style lang="less">
.add-new-card.n-button {
  color: rgb(51, 54, 57);
  background-color: rgba(236, 217, 188, 0.8);
  box-shadow: 0 3px 15px 2px rgba(191, 158, 118, 0.2);
  border: 1px solid rgba(224, 186, 140, 0.62);
  text-shadow: none;

  &:focus,
  &:hover {
    color: rgb(51, 54, 57);
    background-color: rgba(236, 217, 188, 0.9);
    box-shadow: 0 3px 15px 2px rgba(191, 158, 118, 0.2);
    border: 1px solid rgba(224, 186, 140, 0.62);
  }
}
.task-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
  width: 80%;
}
</style>
