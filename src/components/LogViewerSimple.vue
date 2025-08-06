<script setup lang="ts">
import { NButton, NSelect, NInput, NSpace, NCard, NTag, NDivider, NEmpty } from 'naive-ui'
import { ref, onMounted, computed } from 'vue'

import logger, { type LogEntry } from '@/utils/logger'

const logs = ref<LogEntry[]>([])
const loading = ref(false)
const levelFilter = ref<string>('all')
const sourceFilter = ref<string>('all')
const limit = ref(20)
const showDrawer = ref(false)
const selectedLog = ref<LogEntry | null>(null)

const levelOptions = [
  { label: '全部级别', value: 'all' },
  { label: '信息', value: 'info' },
  { label: '警告', value: 'warn' },
  { label: '错误', value: 'error' },
  { label: '调试', value: 'debug' }
]

const sourceOptions = ref([{ label: '全部来源', value: 'all' }])

const filteredLogs = computed(() => {
  return logs.value.filter((log) => {
    if (levelFilter.value !== 'all' && log.level !== levelFilter.value) return false
    if (sourceFilter.value !== 'all' && log.source !== sourceFilter.value) return false
    return true
  })
})

const loadLogs = async () => {
  loading.value = true
  try {
    const allLogs = await logger.getLogs({ limit: limit.value })
    logs.value = allLogs

    const sources = new Set(allLogs.map((log) => log.source).filter(Boolean))
    sourceOptions.value = [
      { label: '全部来源', value: 'all' },
      ...Array.from(sources).map((source) => ({ label: source, value: source }))
    ]
  } catch (error) {
    console.error('加载日志失败:', error)
  } finally {
    loading.value = false
  }
}

const clearLogs = async () => {
  if (confirm('确定要清空所有日志吗？')) {
    await logger.clearLogs()
    await loadLogs()
  }
}

const exportLogs = async () => {
  const logsJson = await logger.exportLogs()
  const blob = new Blob([logsJson], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `logs-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'error':
      return 'error'
    case 'warn':
      return 'warning'
    case 'info':
      return 'info'
    case 'debug':
      return 'default'
    default:
      return 'default'
  }
}

const getLevelText = (level: string) => {
  switch (level) {
    case 'error':
      return '错误'
    case 'warn':
      return '警告'
    case 'info':
      return '信息'
    case 'debug':
      return '调试'
    default:
      return level
  }
}

const handleLogClick = (log: LogEntry) => {
  selectedLog.value = log
  showDrawer.value = true
}

onMounted(() => {
  loadLogs()
})
</script>

<template>
  <NCard title="系统日志" class="log-viewer-simple">
    <NSpace vertical>
      <NSpace>
        <NSelect
          v-model:value="levelFilter"
          :options="levelOptions"
          placeholder="选择日志级别"
          style="width: 120px"
        />
        <NSelect
          v-model:value="sourceFilter"
          :options="sourceOptions"
          placeholder="选择来源"
          style="width: 150px"
        />
        <NInput v-model:value="limit" type="number" placeholder="限制数量" style="width: 100px" />
        <NButton @click="loadLogs" :loading="loading">刷新</NButton>
        <NButton @click="exportLogs">导出</NButton>
        <NButton @click="clearLogs" type="error">清空</NButton>
      </NSpace>

      <NDivider />

      <div class="log-container">
        <div class="log-list" :class="{ 'with-drawer': showDrawer }">
          <div
            v-for="log in filteredLogs"
            :key="log.id"
            class="log-item"
            :class="{ selected: selectedLog?.id === log.id }"
            @click="handleLogClick(log)"
          >
            <NTag :type="getLevelColor(log.level)" size="small">
              {{ getLevelText(log.level) }}
            </NTag>
            <span class="log-time">{{ formatTime(log.timestamp) }}</span>
            <span v-if="log.source" class="log-source">{{ log.source }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>

          <NEmpty v-if="filteredLogs.length === 0" description="暂无日志数据" />
        </div>

        <div v-if="showDrawer" class="log-drawer">
          <div class="drawer-header">
            <button @click="showDrawer = false" class="close-btn">✕</button>
            <span class="drawer-title">日志详情</span>
          </div>
          <div class="drawer-content">
            <div v-if="selectedLog">
              <div class="detail-item">
                <strong>级别:</strong>
                <NTag :type="getLevelColor(selectedLog.level)" size="small">
                  {{ getLevelText(selectedLog.level) }}
                </NTag>
              </div>

              <div class="detail-item">
                <strong>时间:</strong>
                <span>{{ formatTime(selectedLog.timestamp) }}</span>
              </div>

              <div class="detail-item" v-if="selectedLog.source">
                <strong>来源:</strong>
                <span class="log-source">{{ selectedLog.source }}</span>
              </div>

              <div class="detail-item">
                <strong>消息:</strong>
                <div class="message-content">{{ selectedLog.message }}</div>
              </div>

              <div class="detail-item" v-if="selectedLog.data">
                <strong>数据:</strong>
                <div class="data-content">
                  <pre>{{ JSON.stringify(selectedLog.data, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NSpace>
  </NCard>
</template>

<style lang="less" scoped>
.log-viewer-simple {
  .log-container {
    position: relative;
    display: flex;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    min-height: 400px;
  }

  .log-list {
    flex: 1;
    max-height: 400px;
    overflow-y: auto;
    padding: 12px;
    transition: all 0.3s ease;

    &.with-drawer {
      flex: 0 0 60%;
    }
  }

  .log-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    padding: 8px 12px;
    background: #f9fafb;
    border-radius: 4px;
    border-left: 3px solid #3b82f6;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #f3f4f6;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    &.selected {
      background: #dbeafe;
      border-left-color: #2563eb;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
    }

    &:last-child {
      margin-bottom: 0;
    }

    .log-time {
      font-size: 11px;
      color: #6b7280;
      white-space: nowrap;
      min-width: 120px;
    }

    .log-source {
      font-size: 11px;
      color: #059669;
      background: #d1fae5;
      padding: 2px 6px;
      border-radius: 3px;
      white-space: nowrap;
    }

    .log-message {
      font-size: 13px;
      color: #374151;
      line-height: 1.3;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .log-drawer {
    flex: 0 0 40%;
    background: #ffffff;
    border-left: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    animation: slideInRight 0.3s ease;

    .drawer-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;

      .drawer-title {
        font-size: 16px;
        font-weight: 600;
        color: #374151;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 16px;
        color: #6b7280;
        padding: 6px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 28px;
        min-height: 28px;
        transition: all 0.2s ease;

        &:hover {
          color: #374151;
          background: #f3f4f6;
        }
      }
    }

    .drawer-content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.detail-item {
  margin-bottom: 16px;

  strong {
    display: block;
    margin-bottom: 4px;
    color: #374151;
  }

  .log-source {
    font-size: 12px;
    color: #059669;
    background: #d1fae5;
    padding: 2px 6px;
    border-radius: 3px;
  }

  .message-content {
    font-size: 14px;
    color: #374151;
    line-height: 1.5;
    word-break: break-word;
  }

  .data-content {
    background: #f3f4f6;
    border-radius: 6px;
    padding: 12px;
    font-size: 12px;
    color: #6b7280;
    overflow-x: auto;
    border: 1px solid #e5e7eb;

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New',
        monospace;
    }
  }
}
</style>
