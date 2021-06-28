import { notification } from 'ant-design-vue'
import { isDev } from '../utils/configs'
import { fetch } from '../utils/functions'
import { currentGoToLocalhostUrl } from '../App.js'
import { localhostOrigin } from './Settings/index'

export const getjiraIdText = () => {
  const jiraIdElement = document.querySelector('#issue-content a#key-val')
  return jiraIdElement && jiraIdElement.text || ''
}

export const getCurrentEnvApiUrl = async (currentOrigin) => {
  if (isDev) {
    return 'http://intapi-webft3xmn.lab.nordigy.ru:8082'
  }
  if (!currentOrigin.includes('ai')) {
    return ''
  }
  const {groups} = await fetch('https://i18n.lab.nordigy.ru/api/ags/groupList')
  const currentEnvGroup = groups.find(group => group.aiUrl === currentOrigin)
  if (!currentEnvGroup) {
    return ''
  }
  return currentEnvGroup.apiUrl
}

export const getCommitText = ({jiraIdText, jiraTitleText, fixVersionNumber}, withFixVersion = false) => {
  if (withFixVersion) {
    return {
      plainText: `${jiraIdText} ${jiraTitleText}(${fixVersionNumber})`,
      htmlText: `<a href="https://jira.ringcentral.com/browse/${jiraIdText}">${jiraIdText}</a> ${jiraTitleText}(${fixVersionNumber})`
    }
  }
  return {
    plainText: `${jiraIdText} ${jiraTitleText}`,
    htmlText: `<a href="https://jira.ringcentral.com/browse/${jiraIdText}">${jiraIdText}</a> ${jiraTitleText}`
  }
}

export const copyCommitInfo = (withFixVersion = false) => {
  const jiraIdText = getjiraIdText()

  const jiraTitleElement = document.querySelector('#issue-content h1#summary-val')
  const jiraTitleText = jiraTitleElement && jiraTitleElement.innerText

  const fixVersionElement = document.querySelector('#fixVersions-field')
  const fixVersionNumber = fixVersionElement && fixVersionElement.innerText.replace(/[^\d.]/g,'')

  const {plainText, htmlText} = getCommitText({jiraIdText, jiraTitleText, fixVersionNumber}, withFixVersion)

  if (plainText.includes('null')) {
    notification.error({
      message: '复制失败',
      description: '没有找到元素',
      duration: 1.5,
    })
    throw new Error()
  }
  var handleCopyEvent = (event) => {
    event.clipboardData.setData('text/plain', plainText)
    event.clipboardData.setData('text/html', htmlText)
    event.preventDefault()
  }
  window.addEventListener('copy', handleCopyEvent)
  document.execCommand('Copy', false, null)
  notification.success({
    message: '复制成功',
    description: plainText,
    duration: 1.5,
  })
  window.removeEventListener('copy', handleCopyEvent)
}

export const loginToLocalhost = () => {
  const apiUrl = currentGoToLocalhostUrl.value

  const matchResult = location.search.match(/\+\+\+\+\+\+\+\+([0-9]*)/)
  if (!matchResult) {
    notification.error({
      message: '跳转失败',
      description: '没有找到accountId',
      duration: 1.5,
    })
    return
  }
  const accountId = matchResult[1]
  const scsUrl = localhostOrigin.value || 'https://localhost'
  const params = {
    accountId,
    scsUrl,
    apiUrl
  }
  const query = Object.entries(params)
    .map(([key, value]) => {
      return `${key}=${encodeURIComponent(value)}`
    }).join('&')
  window.open(`https://i18n.lab.nordigy.ru/api/ags/loginViaOAuth?${query}`)
}
