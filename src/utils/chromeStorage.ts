export const isExtensionEnv = window.chrome && window.chrome.storage
export class ChromeStorageList {
  constructor (namespace) {
    this.namespace = namespace || ''
  }
  async get () {
    const result = await storageGet(this.namespace)
    return result || []
  }
  async set (value) {
    storageSet(this.namespace, value)
  }
  async add (value) {
    const list = await this.get(this.namespace)
    storageSet(this.namespace, [...list, value])
  }
  async delete (id) {
    const list = await this.get(this.namespace)
    const newList = list.filter(item => item.id !== id)
    storageSet(this.namespace, newList)
  }
  async edit (id, value) {
    const list = await this.get(this.namespace)
    const targetIndex = list.findIndex(item => item.id === id)
    list[targetIndex] = value
    storageSet(this.namespace, list)
  }
}

const mockStorage = {
  set (key, value) {
    value = typeof value === 'object' ? JSON.stringify(value) : value
    window.localStorage.setItem(key, value)
  },
  async get (key) {
    const result = window.localStorage.getItem(key)
    try {
      return JSON.parse(result)
    } catch (error) {
      return result
    }
  }
}

const storageSet = (key, value) => {
  if (isExtensionEnv) {
    window.chrome.storage.local.set({[key]: value})
  } else {
    mockStorage.set(key, value)
  }
}

const storageGet = (key) => {
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