import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import CopyJiraButton from './components/CopyJiraButton.vue'
import { VueDraggableNext } from 'vue-draggable-next'
import {doDataMigrationToChromeStorage} from './utils/chromeStorage'
import {setInitialConfigFromStorage} from './utils/configs'
import 'ant-design-vue/dist/antd.less'

const app = document.createElement('div')
app.id = 'chrome-copy-jira'

document.body.appendChild(app)

const main = async () => {
  await doDataMigrationToChromeStorage()
  await setInitialConfigFromStorage()
  createApp(App)
    .use(Antd)
    .component('draggable', VueDraggableNext)
    .mount('#chrome-copy-jira')

  const buttonSpan = document.createElement('span')
  buttonSpan.id = 'chrome-copy-jira-inner'

  var headerElement = document.querySelector('#issue-content .aui-page-header-main')
  if (headerElement) {
    headerElement.appendChild(buttonSpan)
    createApp(CopyJiraButton)
      .use(Antd)
      .mount('#chrome-copy-jira-inner')
  }
}

main()