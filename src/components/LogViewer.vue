<script setup lang="ts">
import { NButton, NSelect, NInput, NDatePicker, NSpace, NCard, NTag } from 'naive-ui'
import { ref, onMounted, computed } from 'vue'
import logger, { type LogEntry } from '@/utils/logger'

const logs = ref<LogEntry[]>([])
const loading = ref(false)
const levelFilter = ref<string>('all')
const sourceFilter = ref<string>('all')
const limit = ref(50)

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

onMounted(() => {
  loadLogs()
})
</script>

<template>
  <div class="log-viewer">
    <NCard title="日志查看器" class="log-card">
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

        <div class="log-list">
          <div v-for="log in filteredLogs" :key="log.id" class="log-item">
            <div class="log-header">
              <NTag :type="getLevelColor(log.level)" size="small">
                {{ log.level.toUpperCase() }}
              </NTag>
              <span class="log-time">{{ formatTime(log.timestamp) }}</span>
              <span v-if="log.source" class="log-source">{{ log.source }}</span>
            </div>
            <div class="log-message">{{ log.message }}</div>
            <div v-if="log.data" class="log-data">
              <pre>{{ JSON.stringify(log.data, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <div v-if="filteredLogs.length === 0" class="no-logs">暂无日志数据</div>
      </NSpace>
    </NCard>
  </div>
</template>

<style lang="less" scoped>
.log-viewer {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.log-card {
  .log-list {
    max-height: 600px;
    overflow-y: auto;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
  }

  .log-item {
    margin-bottom: 16px;
    padding: 12px;
    background: #f9fafb;
    border-radius: 6px;
    border-left: 4px solid #3b82f6;

    &:last-child {
      margin-bottom: 0;
    }

    .log-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;

      .log-time {
        font-size: 12px;
        color: #6b7280;
      }

      .log-source {
        font-size: 12px;
        color: #059669;
        background: #d1fae5;
        padding: 2px 6px;
        border-radius: 4px;
      }
    }

    .log-message {
      font-size: 14px;
      color: #374151;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .log-data {
      background: #f3f4f6;
      border-radius: 4px;
      padding: 8px;
      font-size: 12px;
      color: #6b7280;
      overflow-x: auto;

      pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
  }

  .no-logs {
    text-align: center;
    color: #9ca3af;
    padding: 40px;
    font-size: 14px;
  }
}
</style>
