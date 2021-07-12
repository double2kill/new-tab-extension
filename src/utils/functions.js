import { isExtensionEnv } from './configs'
import { notification } from 'ant-design-vue'

export function fetch (url) {
  if (!isExtensionEnv) {
    if (url.includes('/api')) {
      url = url.replace('https://i18n.lab.nordigy.ru', '')
    }
    return window.fetch(url).then(response => response.json())
  }
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      type: 'fetch',
      url,
    }, (data) => {
      resolve(data)
    })
  })
}
export function copyTextToClipboard ({plainText, htmlText=plainText}) {
  const handleCopyEvent = (event) => {
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