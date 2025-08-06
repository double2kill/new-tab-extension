import logger from './logger'

export const loggerExample = {
  async init() {
    await logger.init()
    await logger.info('日志系统已初始化', null, 'System')
  },

  async logTaskEvents() {
    await logger.info('用户创建了新任务', { taskId: 123, title: '测试任务' }, 'TaskManager')
    await logger.warn('任务即将过期', { taskId: 123, remainingTime: 300000 }, 'TaskManager')
    await logger.error('任务保存失败', { taskId: 123, error: '网络错误' }, 'TaskManager')
  },

  async logReminderEvents() {
    await logger.info('提醒服务启动', { checkInterval: 30000 }, 'ReminderService')
    await logger.info('发送任务提醒', { taskId: 123, title: '测试任务' }, 'ReminderService')
  },

  async logUserActions() {
    await logger.info('用户切换模式', { from: 'time', to: 'task' }, 'UserAction')
    await logger.debug('用户点击按钮', { button: 'settings' }, 'UserAction')
  },

  async getRecentLogs() {
    const logs = await logger.getLogs({ limit: 10 })
    console.log('最近10条日志:', logs)
    return logs
  },

  async getErrorLogs() {
    const errors = await logger.getLogsByLevel('error', 50)
    console.log('错误日志:', errors)
    return errors
  },

  async getTaskManagerLogs() {
    const taskLogs = await logger.getLogsBySource('TaskManager', 100)
    console.log('任务管理日志:', taskLogs)
    return taskLogs
  },

  async getTodayLogs() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const logs = await logger.getLogsByTimeRange(today.getTime(), tomorrow.getTime())
    console.log('今日日志:', logs)
    return logs
  },

  async exportAllLogs() {
    const logsJson = await logger.exportLogs()
    console.log('导出日志:', logsJson)
    return logsJson
  },

  async clearAllLogs() {
    await logger.clearLogs()
    console.log('已清空所有日志')
  }
}

export default loggerExample
