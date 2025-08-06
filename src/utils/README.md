# 日志系统使用说明

## 概述

这是一个基于 IndexedDB 的日志存储系统，用于记录应用中的各种事件和错误信息。

## 主要功能

- **持久化存储**: 使用 IndexedDB 在浏览器中持久化存储日志
- **多级别日志**: 支持 info、warn、error、debug 四个级别
- **来源标记**: 可以为每条日志标记来源模块
- **自动清理**: 超过最大数量时自动清理旧日志
- **查询过滤**: 支持按级别、来源、时间范围查询
- **导入导出**: 支持日志的导入导出功能

## 基本使用

### 1. 初始化

```typescript
import logger from '@/utils/logger'

// 初始化数据库
await logger.init()
```

### 2. 记录日志

```typescript
// 记录信息日志
await logger.info('用户登录成功', { userId: 123 }, 'Auth')

// 记录警告日志
await logger.warn('API 响应较慢', { responseTime: 5000 }, 'API')

// 记录错误日志
await logger.error('网络请求失败', { error: 'Connection timeout' }, 'Network')

// 记录调试日志
await logger.debug('组件渲染完成', { component: 'TaskList' }, 'Component')
```

### 3. 查询日志

```typescript
// 获取最近的日志
const recentLogs = await logger.getLogs({ limit: 50 })

// 按级别查询
const errorLogs = await logger.getLogsByLevel('error', 100)

// 按来源查询
const authLogs = await logger.getLogsBySource('Auth', 50)

// 按时间范围查询
const todayLogs = await logger.getLogsByTimeRange(
  new Date().setHours(0, 0, 0, 0),
  new Date().setHours(23, 59, 59, 999)
)

// 获取日志数量
const count = await logger.getLogCount()
```

### 4. 管理日志

```typescript
// 清空所有日志
await logger.clearLogs()

// 删除指定时间范围的日志
await logger.deleteLogsByTimeRange(startTime, endTime)

// 导出日志
const logsJson = await logger.exportLogs()

// 导入日志
await logger.importLogs(logsJson)
```

## 在项目中的集成

### 1. 在组件中使用

```typescript
// 在 Vue 组件中
import logger from '@/utils/logger'

export default {
  async mounted() {
    await logger.init()
    await logger.info('组件已加载', null, 'ComponentName')
  },

  methods: {
    async handleUserAction() {
      await logger.info('用户执行操作', { action: 'click' }, 'ComponentName')
    }
  }
}
```

### 2. 在 Hook 中使用

```typescript
// 在自定义 Hook 中
import logger from '@/utils/logger'

export const useCustomHook = () => {
  const someFunction = async () => {
    try {
      // 业务逻辑
      await logger.info('操作成功', { result: 'success' }, 'CustomHook')
    } catch (error) {
      await logger.error('操作失败', { error: error.message }, 'CustomHook')
    }
  }

  return { someFunction }
}
```

## 日志查看器组件

项目中还包含了一个 `LogViewer.vue` 组件，提供了图形化的日志查看界面：

- 支持按级别和来源过滤
- 实时刷新日志数据
- 导出日志文件
- 清空日志功能

## 配置选项

### 数据库配置

```typescript
class Logger {
  private dbName = 'NewTabLogger' // 数据库名称
  private dbVersion = 1 // 数据库版本
  private storeName = 'logs' // 存储对象名称
  private maxLogs = 1000 // 最大日志数量
}
```

### 索引配置

系统会自动创建以下索引：

- `timestamp`: 时间戳索引，用于时间范围查询
- `level`: 级别索引，用于按级别查询
- `source`: 来源索引，用于按来源查询

## 最佳实践

### 1. 日志级别使用

- **info**: 记录重要的业务事件
- **warn**: 记录可能的问题或异常情况
- **error**: 记录错误和异常
- **debug**: 记录调试信息

### 2. 来源标记

建议使用有意义的来源名称：

- `ComponentName`: 组件名称
- `ServiceName`: 服务名称
- `HookName`: Hook 名称
- `Utils`: 工具函数

### 3. 数据结构

```typescript
interface LogEntry {
  id?: number
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: number
  data?: any // 额外的数据，建议使用对象格式
  source?: string // 来源标识
}
```

### 4. 性能考虑

- 日志记录是异步操作，不会阻塞主线程
- 自动清理机制防止日志过多影响性能
- 查询时建议使用合理的限制数量

## 注意事项

1. **浏览器兼容性**: 需要支持 IndexedDB 的现代浏览器
2. **存储限制**: 受浏览器存储限制影响
3. **隐私考虑**: 日志数据存储在本地，注意敏感信息
4. **调试模式**: 生产环境建议关闭 debug 级别日志

## 故障排除

### 常见问题

1. **数据库打开失败**

   - 检查浏览器是否支持 IndexedDB
   - 检查是否有足够的存储空间

2. **日志写入失败**

   - 检查数据库是否已初始化
   - 检查存储空间是否充足

3. **查询结果为空**
   - 确认数据库中有日志数据
   - 检查查询条件是否正确

### 调试方法

```typescript
// 检查数据库状态
const count = await logger.getLogCount()
console.log('当前日志数量:', count)

// 导出所有日志查看
const logs = await logger.exportLogs()
console.log('所有日志:', logs)
```
