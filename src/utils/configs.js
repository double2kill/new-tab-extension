import {storageGet} from './chromeStorage'

let config = {}
export const setInitialConfigFromStorage = async () => {
  const jiraPosition = await storageGet('JIRA_POSITION')
  config['JIRA_POSITION'] = jiraPosition
}

export const getInitialConfig = (key) => {
  return config[key]
}