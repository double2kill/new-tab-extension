import { computed } from 'vue'
import { useLocalStorageState } from 'vue-hooks-plus'

export type TaskItem = {
  id: number
  title: string
  description: string
  updateTime?: number
  completedTime?: number
}

// 创建单例的状态实例
const [taskList, setTaskList] = useLocalStorageState<TaskItem[]>('new-tab.task-list', {
  defaultValue: []
})

// 计算属性
const unCompletedTaskCount = computed(() => {
  return taskList.value?.filter((item) => !item.completedTime)?.length || 0
})

const unCompletedTaskList = computed(
  () => taskList.value?.filter((item) => !item.completedTime) || []
)

// 操作函数
const handleSaveTask = (taskData: TaskItem) => {
  setTaskList((prev: TaskItem[] = []) => {
    const index = prev.findIndex((item) => item.id === taskData.id)
    if (index !== -1) {
      prev[index] = taskData
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
      prev[index] = { ...prev[index], completedTime: Date.now() }
    }
    return [...prev]
  })
}

const handleAddTask = () => {
  const newTask: TaskItem = {
    id: Date.now(),
    title: '',
    description: '',
    completedTime: 0
  }
  setTaskList((prev: TaskItem[] = []) => [...prev, newTask])
}

const handleDeleteTask = (id: number) => {
  setTaskList((prev: TaskItem[] = []) => prev.filter((item) => item.id !== id))
}

const initializeTaskList = () => {
  const validTaskList =
    taskList.value?.filter((item) => item.id && typeof item.id === 'number') || []
  setTaskList(validTaskList)
}

// 导出函数返回共享的状态和方法
export const useTaskManager = () => {
  return {
    taskList,
    unCompletedTaskCount,
    unCompletedTaskList,
    handleSaveTask,
    handleCompleteTask,
    handleAddTask,
    handleDeleteTask,
    initializeTaskList
  }
}
