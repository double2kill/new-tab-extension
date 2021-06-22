import {storageGet} from './chromeStorage'

let config = {}
export const setInitialConfigFromStorage = async () => {
  config['JIRA_POSITION'] = await storageGet('JIRA_POSITION')
  config['LOCALHOST_ORIGIN'] = await storageGet('LOCALHOST_ORIGIN')
}

export const getInitialConfig = (key) => {
  return config[key]
}

export const isDev = document.getElementById('is-dev')
export const isExtensionEnv = window.chrome && window.chrome.storage