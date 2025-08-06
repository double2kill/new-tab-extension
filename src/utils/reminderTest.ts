import logger from './logger'

export const testReminderStatus = async () => {
  console.log('=== 测试提醒状态功能 ===')

  // 模拟一个已提醒的任务
  const testTask = {
    id: 123,
    title: '测试任务',
    description: '这是一个测试任务',
    reminderEnabled: true,
    reminderTime: Date.now() - 60000, // 1分钟前
    reminderShown: true,
    reminderShownTime: Date.now() - 30000 // 30秒前显示
  }

  console.log('测试任务:', testTask)
  console.log('提醒时间:', new Date(testTask.reminderTime).toLocaleString())
  console.log('提醒显示时间:', new Date(testTask.reminderShownTime).toLocaleString())
  console.log('是否已提醒:', testTask.reminderShown)

  // 记录测试日志
  await logger.info(
    '提醒状态测试',
    {
      taskId: testTask.id,
      reminderShown: testTask.reminderShown,
      reminderShownTime: testTask.reminderShownTime
    },
    'Test'
  )

  console.log('=== 测试完成 ===')
}

export const testReminderEdit = async () => {
  console.log('=== 测试编辑提醒重置功能 ===')

  // 模拟编辑提醒的场景
  const originalTask = {
    id: 456,
    title: '编辑测试任务',
    description: '这是一个编辑测试任务',
    reminderEnabled: true,
    reminderTime: Date.now() - 60000, // 1分钟前
    reminderShown: true,
    reminderShownTime: Date.now() - 30000 // 30秒前显示
  }

  console.log('原始任务:', originalTask)
  console.log('原始提醒时间:', new Date(originalTask.reminderTime).toLocaleString())
  console.log('是否已提醒:', originalTask.reminderShown)

  // 模拟编辑后的任务
  const editedTask = {
    ...originalTask,
    reminderTime: Date.now() + 3600000, // 1小时后
    reminderShown: false,
    reminderShownTime: undefined
  }

  console.log('编辑后任务:', editedTask)
  console.log('新提醒时间:', new Date(editedTask.reminderTime).toLocaleString())
  console.log('是否已提醒:', editedTask.reminderShown)

  // 记录测试日志
  await logger.info(
    '编辑提醒重置测试',
    {
      taskId: editedTask.id,
      oldReminderTime: originalTask.reminderTime,
      newReminderTime: editedTask.reminderTime,
      reminderShown: editedTask.reminderShown
    },
    'Test'
  )

  console.log('=== 编辑提醒测试完成 ===')
}

export default testReminderStatus
