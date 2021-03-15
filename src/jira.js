import { message } from 'ant-design-vue'

export const copyCommitInfo = () => {
  const jiraIdElement = document.querySelector('#issue-content a#key-val')
  const jiraTitleElement = document.querySelector('#issue-content h1#summary-val')
  
  const jiraIdText = jiraIdElement && jiraIdElement.text
  const jiraTitleText = jiraTitleElement && jiraTitleElement.innerText
  
  const commitText = `${jiraIdText} ${jiraTitleText}`
  if (commitText.includes('null')) {
    message.error(
      `复制失败: 没有找到元素`,
      2,
    )
    throw new Error()
  }
  message.success(
    `复制成功: ${commitText}`,
    2,
  )
  return commitText
}