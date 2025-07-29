interface ManifestInfo {
  version: string
}

interface UpdateInfo {
  hasUpdate: boolean
  latestVersion: string
  currentVersion: string
  releaseUrl: string
  publishedAt: string
}

const GITHUB_MANIFEST_URL =
  'https://raw.githubusercontent.com/double2kill/new-tab-extension/master/manifest.json'

export const checkForUpdates = async (currentVersion: string): Promise<UpdateInfo> => {
  try {
    const response = await fetch(GITHUB_MANIFEST_URL)

    if (!response.ok) {
      throw new Error(`GitHub manifest error: ${response.status}`)
    }

    const manifest: ManifestInfo = await response.json()

    const latestVersion = manifest.version
    const hasUpdate = compareVersions(latestVersion, currentVersion) > 0

    return {
      hasUpdate,
      latestVersion,
      currentVersion,
      releaseUrl: 'https://github.com/double2kill/new-tab-extension',
      publishedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('检查更新失败:', error)
    return {
      hasUpdate: false,
      latestVersion: currentVersion,
      currentVersion,
      releaseUrl: '',
      publishedAt: ''
    }
  }
}

const compareVersions = (version1: string, version2: string): number => {
  const v1Parts = version1.split('.').map(Number)
  const v2Parts = version2.split('.').map(Number)

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1 = v1Parts[i] || 0
    const v2 = v2Parts[i] || 0

    if (v1 > v2) return 1
    if (v1 < v2) return -1
  }

  return 0
}

export const getStoredUpdateInfo = (): UpdateInfo | null => {
  try {
    const stored = localStorage.getItem('new-tab.update-info')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const setStoredUpdateInfo = (info: UpdateInfo): void => {
  try {
    localStorage.setItem('new-tab.update-info', JSON.stringify(info))
  } catch (error) {
    console.error('保存更新信息失败:', error)
  }
}
