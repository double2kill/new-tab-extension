import Localstorage from 'localstorage'
export const JIRA_POSITION = 'JIRA_POSITION'

export const jiraPositionLocalStorage = new Localstorage(JIRA_POSITION)

const mockStorage = {
  set (key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  },
  async get (key) {
    return JSON.parse(window.localStorage.getItem(key))
  }
}

const isExtensionEnv = window.chrome && window.chrome.storage
console.log(isExtensionEnv)

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
        console.log(result[key])
        debugger
        res(result[key])
      })
    })
  } else {
    return mockStorage.get(key)
  }
}

export const doDataMigrationToChromeStorage = async () => {
  let positionData = await storageGet(JIRA_POSITION)
  if (positionData) {
    return
  }
  const [error, positionDataFromOldStorage] = jiraPositionLocalStorage.get()
  if (positionDataFromOldStorage) {
    await storageSet(JIRA_POSITION, positionDataFromOldStorage)
  }
}