<script setup lang="ts">
import { AddOutline } from '@vicons/ionicons5'
import { NButton, NIcon } from 'naive-ui'
import { onMounted, ref, onErrorCaptured } from 'vue'

import TaskCard from './TaskCard.vue'

import { useTaskManager } from '@/hooks/useTaskManager'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((error) => {
  console.error('TaskList组件错误:', error)
  hasError.value = true
  errorMessage.value = error.message || '未知错误'
  return false
})

const {
  unCompletedTaskCount,
  unCompletedTaskList,
  handleSaveTask,
  handleCompleteTask,
  handleAddTask,
  handleDeleteTask,
  resetTaskReminder,
  initializeTaskList
} = useTaskManager()

onMounted(() => {
  try {
    initializeTaskList()
  } catch (error) {
    console.error('初始化任务列表失败:', error)
    hasError.value = true
    errorMessage.value = '初始化失败'
  }
})
</script>

<template>
  <div class="task-container">
    <div v-if="hasError" class="error-container">
      <div class="error-message">
        <h3>加载失败</h3>
        <p>{{ errorMessage }}</p>
        <NButton
          @click="
            () => {
              hasError = false
              initializeTaskList()
            }
          "
        >
          重试
        </NButton>
      </div>
    </div>

    <div v-else>
      <div class="task-header">
        <h2 class="task-title">📝 我的任务</h2>
        <span class="task-count">{{ unCompletedTaskCount }} 个待完成</span>
      </div>

      <div class="task-list">
        <transition-group name="task" tag="div" class="task-grid">
          <TaskCard
            v-for="taskItem in unCompletedTaskList"
            :key="taskItem.id"
            :data="taskItem"
            :saveTask="handleSaveTask"
            :completeTask="handleCompleteTask"
            :deleteTask="handleDeleteTask"
            :resetReminder="resetTaskReminder"
          />
        </transition-group>

        <div class="add-task-wrapper">
          <NButton class="add-new-card" dashed @click="handleAddTask">
            <template #icon>
              <NIcon size="20"><AddOutline /></NIcon>
            </template>
            添加新任务
          </NButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.task-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-shadow: none;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;

  .error-message {
    text-align: center;
    padding: 20px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 12px;

    h3 {
      color: #dc2626;
      margin: 0 0 8px 0;
      font-size: 18px;
    }

    p {
      color: #7f1d1d;
      margin: 0 0 16px 0;
      font-size: 14px;
    }
  }
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 8px;

  .task-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 8px;
    text-shadow: none;
  }

  .task-count {
    font-size: 14px;
    color: #64748b;
    background: #f1f5f9;
    padding: 4px 12px;
    border-radius: 12px;
    font-weight: 500;
    text-shadow: none;
  }
}

.task-list {
  .task-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }
}

.add-task-wrapper {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.add-new-card.n-button {
  min-height: 60px;
  width: 100%;
  max-width: 320px;
  border: 2px dashed #d1d5db;
  background: #fafafa;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  text-shadow: none;

  &:hover {
    border-color: #22c55e;
    color: #16a34a;
    background: #f0fdf4;
  }

  &:active {
    transform: translateY(1px);
  }
}

.task-enter-active,
.task-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.task-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.task-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 768px) {
  .task-container {
    padding: 20px;
    margin: 16px;
    border-radius: 20px;
  }

  .task-list .task-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .task-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .task-title {
      font-size: 20px;
    }
  }
}
</style>
