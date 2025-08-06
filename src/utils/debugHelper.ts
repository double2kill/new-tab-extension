export const debugHelper = {
  // 检查localStorage数据
  checkLocalStorage() {
    try {
      const taskList = localStorage.getItem('new-tab.task-list')
      if (taskList) {
        const parsed = JSON.parse(taskList)
        console.log('任务列表数据:', parsed)
        console.log('任务数量:', parsed.length)
        return parsed
      }
      return null
    } catch (error) {
      console.error('检查localStorage失败:', error)
      return null
    }
  },

  // 清理损坏的数据
  clearCorruptedData() {
    try {
      localStorage.removeItem('new-tab.task-list')
      console.log('已清理任务数据')
    } catch (error) {
      console.error('清理数据失败:', error)
    }
  },

  // 检查性能
  checkPerformance() {
    const start = performance.now()
    const taskList = this.checkLocalStorage()
    const end = performance.now()
    console.log(`数据读取耗时: ${end - start}ms`)
    return taskList
  },

  // 修复损坏的任务数据 - 使用 useTaskManager 的统一逻辑
  async fixCorruptedTasks() {
    try {
      // 动态导入 useTaskManager 以避免循环依赖
      const { useTaskManager } = await import('@/hooks/useTaskManager')
      const { fixCorruptedTasks } = useTaskManager()

      const fixedTasks = fixCorruptedTasks()
      console.log('已使用 useTaskManager 修复任务数据')
      console.log('请刷新页面查看效果')
      return fixedTasks
    } catch (error) {
      console.error('修复数据失败:', error)
      // 降级处理
      this.clearCorruptedData()
    }
  },

  // 重置到默认状态
  resetToDefault() {
    try {
      localStorage.setItem('new-tab.task-list', JSON.stringify([]))
      localStorage.setItem('new-tab.work.mode', 'time')
      console.log('已重置到默认状态')
    } catch (error) {
      console.error('重置失败:', error)
    }
  }
}

// 在控制台暴露调试工具
if (typeof window !== 'undefined') {
  ;(window as any).debugHelper = debugHelper
}
