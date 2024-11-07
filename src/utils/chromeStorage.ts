export const isExtensionEnv = window.chrome && window.chrome.storage
export class ChromeStorageList {
  namespace: string

  constructor(namespace: string) {
    this.namespace = namespace || ''
  }
  async get() {
    const result = await storageGet(this.namespace)
    return result || []
  }
  async set(value: any) {
    storageSet(this.namespace, value)
  }
  async add(value: any) {
    const list = await this.get()
    storageSet(this.namespace, [...list, value])
  }
  async delete(id: string) {
    const list = await this.get()
    const newList = list.filter((item: any) => item.id !== id)
    storageSet(this.namespace, newList)
  }
  async edit(id: string, value: any) {
    const list = await this.get()
    const targetIndex = list.findIndex((item: any) => item.id === id)
    list[targetIndex] = value
    storageSet(this.namespace, list)
  }
}

const mockStorage = {
  set(key: string, value: any) {
    value = typeof value === 'object' ? JSON.stringify(value) : value
    window.localStorage.setItem(key, value)
  },
  async get(key: string) {
    const result = window.localStorage.getItem(key)
    try {
      return JSON.parse(result as any)
    } catch (error) {
      return result
    }
  }
}

export const storageSet = (key: string, value: any) => {
  if (isExtensionEnv) {
    window.chrome.storage.local.set({ [key]: value })
  } else {
    mockStorage.set(key, value)
  }
}

export const storageGet = (key: string) => {
  if (isExtensionEnv) {
    return new Promise((res) => {
      window.chrome.storage.local.get([key], (result) => {
        res(result[key])
      })
    })
  } else {
    return mockStorage.get(key)
  }
}
