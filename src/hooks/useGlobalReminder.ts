import { onMounted, onUnmounted, ref } from 'vue'

import type { TaskItem } from './useTaskManager'
import logger from '@/utils/logger'

let globalCheckInterval: number | null = null
const checkIntervalMs = 30000
const isActive = ref(false)
let isInitialized = false

const checkReminders = async () => {
  try {
    const taskList = getTaskList()
    const now = Date.now()
    let hasReminders = false

    taskList.forEach(async (task) => {
      if (task.reminderEnabled && task.reminderTime && !task.completedTime && !task.reminderShown) {
        hasReminders = true
        const timeDiff = task.reminderTime - now

        if (timeDiff <= 0) {
          console.log('触发提醒:', task.title, '时间差:', timeDiff, 'ms')
          await logger.info(
            '触发任务提醒',
            { taskId: task.id, title: task.title, timeDiff },
            'ReminderService'
          )
          showNotification(task)
          markReminderShown(task)
        } else {
          console.log('检查提醒:', task.title, '剩余时间:', Math.floor(timeDiff / 1000), '秒')
        }
      }
    })

    // 保持检查运行，不要因为暂时没有提醒就停止
    // 用户可能会添加新的提醒任务
  } catch (error) {
    console.error('检查提醒时出错:', error)
    await logger.error('检查提醒时出错', { error: error.message }, 'ReminderService')
  }
}

const getTaskList = (): TaskItem[] => {
  try {
    const stored = localStorage.getItem('new-tab.task-list')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('获取任务列表失败:', error)
    return []
  }
}

const showNotification = async (task: TaskItem) => {
  try {
    if (!('Notification' in window)) return

    if (Notification.permission === 'granted') {
      new Notification('⏰ 任务提醒', {
        body: `${task.title}\n${task.description || '无描述'}`,
        icon: '/favicon.ico',
        tag: `task-${task.id}`,
        requireInteraction: true,
        badge: '/favicon.ico',
        vibrate: [200, 100, 200]
      })

      console.log('已发送任务提醒:', task.title)
      await logger.info(
        '已发送任务提醒通知',
        { taskId: task.id, title: task.title },
        'ReminderService'
      )
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(async (permission) => {
        if (permission === 'granted') {
          showNotification(task)
        } else {
          console.log('用户拒绝了通知权限')
          await logger.warn('用户拒绝了通知权限', null, 'ReminderService')
        }
      })
    } else {
      console.log('通知权限被拒绝，无法显示提醒')
      await logger.warn('通知权限被拒绝，无法显示提醒', null, 'ReminderService')
    }
  } catch (error) {
    console.error('显示通知失败:', error)
    await logger.error('显示通知失败', { error: error.message }, 'ReminderService')
  }
}

const markReminderShown = (task: TaskItem) => {
  try {
    const taskList = getTaskList()
    const index = taskList.findIndex((t) => t.id === task.id)

    if (index !== -1) {
      taskList[index] = {
        ...taskList[index],
        reminderShown: true,
        reminderShownTime: Date.now()
      }

      localStorage.setItem('new-tab.task-list', JSON.stringify(taskList))
      console.log('已标记提醒为已显示:', task.title)
    }
  } catch (error) {
    console.error('标记提醒已显示时出错:', error)
  }
}

const requestPermission = () => {
  try {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  } catch (error) {
    console.error('请求通知权限失败:', error)
  }
}

const start = () => {
  if (globalCheckInterval || isInitialized) return

  try {
    globalCheckInterval = window.setInterval(() => {
      checkReminders()
    }, checkIntervalMs)

    checkReminders()
    isActive.value = true
    isInitialized = true
  } catch (error) {
    console.error('启动提醒服务失败:', error)
    isActive.value = false
  }
}

const stop = () => {
  if (globalCheckInterval) {
    clearInterval(globalCheckInterval)
    globalCheckInterval = null
  }
  isActive.value = false
}

export const useGlobalReminder = () => {
  onMounted(async () => {
    // 延迟启动，避免阻塞页面加载
    setTimeout(async () => {
      requestPermission()
      start()
      console.log('全局提醒服务已启动')
      await logger.info('全局提醒服务已启动', { checkInterval: checkIntervalMs }, 'ReminderService')
    }, 1000)
  })

  onUnmounted(async () => {
    stop()
    console.log('全局提醒服务已停止')
    await logger.info('全局提醒服务已停止', null, 'ReminderService')
  })

  return {
    isActive,
    start,
    stop,
    requestPermission
  }
}
