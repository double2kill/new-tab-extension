import { createApp } from 'vue'
import { Button, Card, Drawer, Input, Table, Divider, Pagination } from 'ant-design-vue'
import App from './App.vue'
import CopyJiraButton from './components/CopyJiraButton.vue'
import {doDataMigrationToChromeStorage} from './utils/chromeStorage'
import {setInitialConfigFromStorage} from './utils/configs'
import 'ant-design-vue/lib/button/style/index.less'
import 'ant-design-vue/lib/card/style/index.less'
import 'ant-design-vue/lib/drawer/style/index.less'
import 'ant-design-vue/lib/input/style/index.less'
import 'ant-design-vue/lib/table/style/index.less'
import 'ant-design-vue/lib/divider/style/index.less'
import 'ant-design-vue/lib/pagination/style/index.less'
import 'ant-design-vue/lib/notification/style/index.less'
import 'ant-design-vue/lib/icon/style/index.less'

const app = document.createElement('div')
app.id = 'chrome-copy-jira'

document.body.appendChild(app)

const main = async () => {
  await doDataMigrationToChromeStorage()
  await setInitialConfigFromStorage()
  createApp(App)
    .use(Button)
    .use(Card)
    .use(Drawer)
    .use(Input)
    .use(Table)
    .use(Divider)
    .use(Pagination)
    .mount('#chrome-copy-jira')

  const buttonSpan = document.createElement('span')
  buttonSpan.id = 'chrome-copy-jira-inner'

  var headerElement = document.querySelector('#issue-content .aui-page-header-main')
  if (headerElement) {
    headerElement.appendChild(buttonSpan)
    createApp(CopyJiraButton)
      .use(Button)
      .mount('#chrome-copy-jira-inner')
  }
}

main()