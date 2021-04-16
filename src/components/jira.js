import { notification } from 'ant-design-vue'
import { copyText } from 'vue3-clipboard'

export const getjiraIdText = () => {
  const jiraIdElement = document.querySelector('#issue-content a#key-val')
  return jiraIdElement && jiraIdElement.text || ''
}

export const copyCommitInfo = () => {
  const jiraTitleElement = document.querySelector('#issue-content h1#summary-val')

  const jiraIdText = getjiraIdText()
  const jiraTitleText = jiraTitleElement && jiraTitleElement.innerText

  const commitText = `${jiraIdText} ${jiraTitleText}`
  if (commitText.includes('null')) {
    notification.error({
      message: '复制失败',
      description: '没有找到元素',
      duration: 1.5,
    })
    throw new Error()
  }
  copyText(commitText, undefined, (error, event) => {
    if (error) {
      notification.error({
        message: '复制失败',
        duration: 1.5,
      })
    } else {
      notification.success({
        message: '复制成功',
        description: commitText,
        duration: 1.5,
      })
    }
  })
}