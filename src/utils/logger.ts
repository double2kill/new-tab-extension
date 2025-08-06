export interface LogEntry {
  id?: number
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: number
  data?: any
  source?: string
}

class Logger {
  private dbName = 'NewTabLogger'
  private dbVersion = 1
  private storeName = 'logs'
  private db: IDBDatabase | null = null
  private maxLogs = 1000

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        console.error('打开日志数据库失败:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: 'id',
            autoIncrement: true
          })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('level', 'level', { unique: false })
          store.createIndex('source', 'source', { unique: false })
        }
      }
    })
  }

  private async ensureDB(): Promise<void> {
    if (!this.db) {
      await this.init()
    }
  }

  async log(level: LogEntry['level'], message: string, data?: any, source?: string): Promise<void> {
    try {
      await this.ensureDB()

      const logEntry: LogEntry = {
        level,
        message,
        timestamp: Date.now(),
        data,
        source
      }

      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)

      await new Promise<void>((resolve, reject) => {
        const request = store.add(logEntry)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })

      await this.cleanupOldLogs()
    } catch (error) {
      console.error('写入日志失败:', error)
    }
  }

  async getLogs(
    options: {
      level?: LogEntry['level']
      source?: string
      startTime?: number
      endTime?: number
      limit?: number
      offset?: number
    } = {}
  ): Promise<LogEntry[]> {
    try {
      await this.ensureDB()

      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('timestamp')

      const logs: LogEntry[] = []
      const limit = options.limit || 100
      let count = 0
      let offset = options.offset || 0

      return new Promise((resolve, reject) => {
        const request = index.openCursor(null, 'prev')

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (!cursor) {
            resolve(logs)
            return
          }

          const log = cursor.value as LogEntry

          if (offset > 0) {
            offset--
            cursor.continue()
            return
          }

          if (count >= limit) {
            resolve(logs)
            return
          }

          if (options.level && log.level !== options.level) {
            cursor.continue()
            return
          }

          if (options.source && log.source !== options.source) {
            cursor.continue()
            return
          }

          if (options.startTime && log.timestamp < options.startTime) {
            cursor.continue()
            return
          }

          if (options.endTime && log.timestamp > options.endTime) {
            cursor.continue()
            return
          }

          logs.push(log)
          count++
          cursor.continue()
        }

        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('获取日志失败:', error)
      return []
    }
  }

  async getLogsByLevel(level: LogEntry['level'], limit = 100): Promise<LogEntry[]> {
    try {
      await this.ensureDB()

      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('level')

      return new Promise((resolve, reject) => {
        const request = index.getAll(level, limit)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('按级别获取日志失败:', error)
      return []
    }
  }

  async getLogsBySource(source: string, limit = 100): Promise<LogEntry[]> {
    try {
      await this.ensureDB()

      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('source')

      return new Promise((resolve, reject) => {
        const request = index.getAll(source, limit)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('按来源获取日志失败:', error)
      return []
    }
  }

  async getLogsByTimeRange(startTime: number, endTime: number): Promise<LogEntry[]> {
    try {
      await this.ensureDB()

      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('timestamp')

      return new Promise((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.bound(startTime, endTime))
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('按时间范围获取日志失败:', error)
      return []
    }
  }

  async getLogCount(): Promise<number> {
    try {
      await this.ensureDB()

      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)

      return new Promise((resolve, reject) => {
        const request = store.count()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('获取日志数量失败:', error)
      return 0
    }
  }

  async clearLogs(): Promise<void> {
    try {
      await this.ensureDB()

      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)

      await new Promise<void>((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('清空日志失败:', error)
    }
  }

  async deleteLogsByTimeRange(startTime: number, endTime: number): Promise<void> {
    try {
      await this.ensureDB()

      const logs = await this.getLogsByTimeRange(startTime, endTime)
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)

      for (const log of logs) {
        if (log.id) {
          await new Promise<void>((resolve, reject) => {
            const request = store.delete(log.id)
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
          })
        }
      }
    } catch (error) {
      console.error('删除时间范围日志失败:', error)
    }
  }

  private async cleanupOldLogs(): Promise<void> {
    try {
      const count = await this.getLogCount()
      if (count > this.maxLogs) {
        const logs = await this.getLogs({ limit: count - this.maxLogs })
        const transaction = this.db!.transaction([this.storeName], 'readwrite')
        const store = transaction.objectStore(this.storeName)

        for (const log of logs) {
          if (log.id) {
            await new Promise<void>((resolve, reject) => {
              const request = store.delete(log.id)
              request.onsuccess = () => resolve()
              request.onerror = () => reject(request.error)
            })
          }
        }
      }
    } catch (error) {
      console.error('清理旧日志失败:', error)
    }
  }

  async exportLogs(): Promise<string> {
    try {
      const logs = await this.getLogs({ limit: 1000 })
      return JSON.stringify(logs, null, 2)
    } catch (error) {
      console.error('导出日志失败:', error)
      return '[]'
    }
  }

  async importLogs(logsJson: string): Promise<void> {
    try {
      const logs: LogEntry[] = JSON.parse(logsJson)
      for (const log of logs) {
        await this.log(log.level, log.message, log.data, log.source)
      }
    } catch (error) {
      console.error('导入日志失败:', error)
    }
  }

  info(message: string, data?: any, source?: string): Promise<void> {
    return this.log('info', message, data, source)
  }

  warn(message: string, data?: any, source?: string): Promise<void> {
    return this.log('warn', message, data, source)
  }

  error(message: string, data?: any, source?: string): Promise<void> {
    return this.log('error', message, data, source)
  }

  debug(message: string, data?: any, source?: string): Promise<void> {
    return this.log('debug', message, data, source)
  }
}

export const logger = new Logger()

export default logger
