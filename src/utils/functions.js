import { isExtensionEnv } from './configs'
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