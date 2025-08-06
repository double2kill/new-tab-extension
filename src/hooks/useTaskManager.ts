import { computed } from 'vue'
import { useLocalStorageState } from 'vue-hooks-plus'

export type TaskItem = {
  id: number
  title: string
  description: string
  updateTime?: number
  completedTime?: number
  reminderTime?: number
  reminderEnabled?: boolean
  reminderType?: 'minute' | 'hour' | 'day' | 'custom'
  reminderShown?: boolean
  reminderShownTime?: number
}

// 任务数据标准化函数 - 统一处理所有数据修复逻辑
const normalizeTaskItem = (item: any, index: number = 0): TaskItem => {
  const now = Date.now()
  return {
    id: item.id || now + index, // 确保id唯一
    title: item.title || '',
    description: item.description || '',
    updateTime: item.updateTime || now, // 确保有updateTime，避免被误判为新任务
    completedTime: item.completedTime || 0,
    reminderTime: item.reminderTime || undefined,
    reminderEnabled: item.reminderEnabled || false,
    reminderType: item.reminderType || 'hour',
    reminderShown: item.reminderShown || false,
    reminderShownTime: item.reminderShownTime || undefined
  }
}

// 验证任务数据是否有效
const isValidTaskItem = (item: any): boolean => {
  return item && typeof item === 'object' && item.id && typeof item.id === 'number'
}

// 创建单例的状态实例
const [taskList, setTaskList] = useLocalStorageState<TaskItem[]>('new-tab.task-list', {
  defaultValue: []
})

// 计算属性 - 添加错误处理
const unCompletedTaskCount = computed(() => {
  try {
    return taskList.value?.filter((item) => !item.completedTime)?.length || 0
  } catch (error) {
    console.error('计算未完成任务数量时出错:', error)
    return 0
  }
})

const unCompletedTaskList = computed(() => {
  try {
    return taskList.value?.filter((item) => !item.completedTime) || []
  } catch (error) {
    console.error('获取未完成任务列表时出错:', error)
    return []
  }
})

// 操作函数 - 添加错误处理
const handleSaveTask = (taskData: TaskItem) => {
  try {
    // 使用统一的数据标准化
    const normalizedTask = normalizeTaskItem(taskData)

    setTaskList((prev: TaskItem[] = []) => {
      const index = prev.findIndex((item) => item.id === normalizedTask.id)
      if (index !== -1) {
        prev[index] = normalizedTask
      } else {
        prev.push(normalizedTask)
      }
      return [...prev]
    })
  } catch (error) {
    console.error('保存任务时出错:', error)
  }
}

const handleCompleteTask = (id: number) => {
  try {
    setTaskList((prev: TaskItem[] = []) => {
      const index = prev.findIndex((item) => item.id === id)
      if (index !== -1) {
        prev[index] = { ...prev[index], completedTime: Date.now() }
      }
      return [...prev]
    })
  } catch (error) {
    console.error('完成任务时出错:', error)
  }
}

const handleAddTask = () => {
  try {
    // 创建新任务的基础数据，不包含updateTime（标识为新任务）
    const newTaskData = {
      id: Date.now(),
      title: '',
      description: '',
      completedTime: 0
    }

    // 使用统一的数据标准化，但保持新任务的特征
    const newTask = normalizeTaskItem(newTaskData)
    // 移除updateTime，保持新任务状态
    delete newTask.updateTime

    setTaskList((prev: TaskItem[] = []) => [...prev, newTask])
  } catch (error) {
    console.error('添加任务时出错:', error)
  }
}

const handleDeleteTask = (id: number) => {
  try {
    setTaskList((prev: TaskItem[] = []) => prev.filter((item) => item.id !== id))
  } catch (error) {
    console.error('删除任务时出错:', error)
  }
}

const resetTaskReminder = (id: number) => {
  try {
    setTaskList((prev: TaskItem[] = []) => {
      const index = prev.findIndex((item) => item.id === id)
      if (index !== -1) {
        const task = prev[index]
        prev[index] = {
          ...task,
          reminderShown: false,
          reminderShownTime: undefined
        }
        console.log('已重置任务提醒:', task.title)
      }
      return [...prev]
    })
  } catch (error) {
    console.error('重置任务提醒时出错:', error)
  }
}

const initializeTaskList = () => {
  try {
    if (!Array.isArray(taskList.value)) {
      console.warn('任务列表数据格式错误，重置为空数组')
      setTaskList([])
      return
    }

    // 使用统一的数据标准化和验证逻辑
    const validTaskList = taskList.value
      .map((item, index) => normalizeTaskItem(item, index))
      .filter(isValidTaskItem)

    setTaskList(validTaskList)
    console.log(`已标准化 ${validTaskList.length} 个任务`)
  } catch (error) {
    console.error('初始化任务列表时出错:', error)
    // 如果出错，重置为空数组
    setTaskList([])
  }
}

// 修复损坏的任务数据 - 可以被外部调用
const fixCorruptedTasks = () => {
  try {
    const rawData = localStorage.getItem('new-tab.task-list')
    if (!rawData) {
      console.log('没有找到任务数据')
      return []
    }

    const parsedData = JSON.parse(rawData)
    if (!Array.isArray(parsedData)) {
      console.warn('任务数据格式错误，重置为空数组')
      setTaskList([])
      return []
    }

    // 使用统一的数据标准化逻辑
    const fixedTasks = parsedData
      .map((item, index) => normalizeTaskItem(item, index))
      .filter(isValidTaskItem)

    setTaskList(fixedTasks)
    console.log(`已修复并标准化 ${fixedTasks.length} 个任务:`, fixedTasks)
    return fixedTasks
  } catch (error) {
    console.error('修复数据失败:', error)
    setTaskList([])
    return []
  }
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
    resetTaskReminder,
    initializeTaskList,
    fixCorruptedTasks,
    // 暴露内部函数供调试使用
    normalizeTaskItem,
    isValidTaskItem
  }
}
