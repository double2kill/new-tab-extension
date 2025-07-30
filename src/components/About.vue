<script setup lang="ts">
import { NModal, NButton } from 'naive-ui'
import { ref, onMounted } from 'vue'

import { checkForUpdates, getStoredUpdateInfo, setStoredUpdateInfo } from '@/services/updateChecker'

const showAbout = ref(false)
const hasUpdate = ref(false)
const updateInfo = ref<any>(null)

const version = typeof __MANIFEST_VERSION__ !== 'undefined' ? __MANIFEST_VERSION__ : '0.0.0'
const buildTime =
  typeof __BUILD_TIME__ !== 'undefined'
    ? __BUILD_TIME__
    : new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

const openAbout = async () => {
  showAbout.value = true
  await checkUpdate()
}

const emit = defineEmits(['update-status'])

const checkUpdate = async () => {
  const info = await checkForUpdates(version)
  hasUpdate.value = info.hasUpdate
  updateInfo.value = info

  setStoredUpdateInfo(info)
  localStorage.setItem('new-tab.last-update-check', Date.now().toString())
  emit('update-status', hasUpdate.value)
}

const openUpdateUrl = () => {
  if (updateInfo.value?.releaseUrl) {
    window.open(updateInfo.value.releaseUrl, '_blank')
  }
}

const exportLocalStorageData = () => {
  const data: Record<string, any> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) || '')
      } catch {
        data[key] = localStorage.getItem(key)
      }
    }
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `new-tab-extension-data-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const importLocalStorageData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          Object.keys(data).forEach((key) => {
            if (typeof data[key] === 'object') {
              localStorage.setItem(key, JSON.stringify(data[key]))
            } else {
              localStorage.setItem(key, String(data[key]))
            }
          })
          alert('数据导入成功！')
          location.reload()
        } catch (error) {
          alert('导入失败：文件格式错误')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

onMounted(() => {
  const storedInfo = getStoredUpdateInfo()
  if (storedInfo) {
    hasUpdate.value = storedInfo.hasUpdate
    updateInfo.value = storedInfo
    emit('update-status', hasUpdate.value)
  }
})

defineExpose({
  openAbout,
  hasUpdate
})
</script>

<template>
  <NModal v-model:show="showAbout" preset="card" title="关于" style="width: 600px">
    <div class="py-5">
      <div
        class="text-center mb-8 p-5 bg-gradient-to-br from-gray-50 to-blue-100 rounded-2xl shadow-lg"
      >
        <div class="mb-4 text-blue-500">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
            <path
              d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"
            />
          </svg>
        </div>
        <div class="text-3xl font-bold text-gray-800 mb-2 tracking-tight">New Tab Extension</div>
        <div class="my-3 flex flex-col gap-1.5 items-center">
          <div
            class="text-lg text-gray-600 font-mono font-semibold bg-white/80 px-3 py-1 rounded-full inline-block my-2"
          >
            v{{ version }}
          </div>
          <div
            class="flex items-center gap-2 text-xs text-gray-500 bg-white/60 px-2.5 py-1 rounded-xl backdrop-blur-sm"
          >
            <span class="font-semibold text-gray-600">Build:</span>
            <span class="font-mono font-medium text-gray-800">{{ buildTime }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="hasUpdate"
        class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 mb-6 text-white text-center shadow-xl relative overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-10 animate-pulse"
        ></div>
        <div class="mb-3 relative z-10">
          <div class="text-base font-bold mb-2 text-white drop-shadow">有新版本可用</div>
          <div class="mb-3">
            <div class="text-sm mb-1 opacity-95 font-medium">
              最新版本: v{{ updateInfo?.latestVersion }}
            </div>
            <div class="text-xs opacity-85">
              发布时间: {{ new Date(updateInfo?.publishedAt).toLocaleDateString('zh-CN') }}
            </div>
          </div>
        </div>
        <button
          @click="openUpdateUrl"
          class="update-button bg-white/20 border border-white/30 text-white backdrop-blur-lg transition-all duration-300 relative z-10 px-3 py-1.5 rounded-md text-sm cursor-pointer inline-flex items-center gap-1"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path
              d="M14,3V7H17.59L7.76,16.83L9.17,18.24L19,8.41V12H23V3M19,19H5V5H12V1H5A2,2 0 0,0 3,3V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
            />
          </svg>
          查看更新
        </button>
      </div>

      <div
        class="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-5 text-center shadow-lg"
      >
        <div class="mb-3">
          <div class="text-base font-bold mb-2 text-gray-800">数据管理</div>
          <div class="text-sm text-gray-600 mb-4">导出扩展的所有本地存储数据</div>
        </div>
        <div class="flex gap-3 justify-center">
          <NButton
            @click="exportLocalStorageData"
            type="success"
            ghost
            size="medium"
            class="export-button"
          >
            <template #icon>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path
                  d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                />
              </svg>
            </template>
            导出数据
          </NButton>
          <NButton
            @click="importLocalStorageData"
            type="info"
            ghost
            size="medium"
            class="import-button"
          >
            <template #icon>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path
                  d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                />
              </svg>
            </template>
            导入数据
          </NButton>
        </div>
      </div>
    </div>
  </NModal>
</template>

<style scoped>
.update-button:hover {
  @apply bg-white/30 -translate-y-0.5 shadow-lg;
}
</style>
