import Localstorage from 'localstorage'
import { isExtensionEnv } from './configs'
export const JIRA_POSITION = 'JIRA_POSITION'
export const JIRA = 'JIRA'
export const GLOBAL = 'GLOBAL'

export const jiraPositionLocalStorage = new Localstorage(JIRA_POSITION)
export const jiraLocalStorage = new Localstorage(JIRA)

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

export const storageSet = (key, value) => {
  if (isExtensionEnv) {
    window.chrome.storage.local.set({[key]: value})
  } else {
    mockStorage.set(key, value)
  }
}

export const storageGet = (key) => {
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

export class ChromeStorageList {
  constructor (namespace) {
    this.namespace = namespace || ''
  }
  async get (key) {
    const storageKey = `${this.namespace}|${key}`
    const result = await storageGet(storageKey)
    return result || []
  }
  async set (key, value) {
    const storageKey = `${this.namespace}|${key}`
    storageSet(storageKey, value)
  }
  async add (key, value) {
    const storageKey = `${this.namespace}|${key}`
    const list = await this.get(key)
    storageSet(storageKey, [...list, value])
  }
  async delete (key, id) {
    const storageKey = `${this.namespace}|${key}`
    const list = await this.get(key)
    const newList = list.filter(item => item.id !== id)
    storageSet(storageKey, newList)
  }
  async edit (key, id, value) {
    const storageKey = `${this.namespace}|${key}`
    const list = await this.get(key)
    const targetIndex = list.findIndex(item => item.id === id)
    list[targetIndex] = value
    storageSet(storageKey, list)
  }
}

export const globalStorage = new ChromeStorageList(GLOBAL)

const migrateData = async () => {
  const data = await storageGet(JIRA_POSITION)
  if (data) {
    return
  }
  const [error, dataFromOldStorage] = jiraPositionLocalStorage.get()
  if (dataFromOldStorage) {
    await storageSet(JIRA_POSITION, dataFromOldStorage)
  }
}

const migrateJiraData = async (jiraKey) => {
  const storageKey = `${GLOBAL}|${jiraKey}`
  const data = await storageGet(storageKey)
  if (data) {
    return
  }
  const [error, dataFromOldStorage] = jiraLocalStorage.get(jiraKey)
  if (dataFromOldStorage instanceof Array) {
    await storageSet(storageKey, dataFromOldStorage)
  }
}

const migrateALLJiraData = async () => {
  for (let i = 0; i< window.localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith('JIRA\u0000')) {
      const jiraKey = key.replace('JIRA\u0000','')
      await migrateJiraData(jiraKey)
    }
  }
}

export const doDataMigrationToChromeStorage = async () => {
  await migrateData()
  await migrateALLJiraData()
}