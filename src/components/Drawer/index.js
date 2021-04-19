import {ref, computed} from 'vue'
import {globalStorage} from '../../utils/chromeStorage'
import linkifyHtml from 'linkifyjs/html'
import {getjiraIdText} from '../jira'

export const jiraIdText = ref('')

export const drawerVisible = ref(false)
export const showDrawer = async ({isGlobal}) => {
  jiraIdText.value = isGlobal ? '' : getjiraIdText()
  await getTableDataFromLocalStorage()
  drawerVisible.value = true
}
export const closeDrawer = () => {
  drawerVisible.value = false
}

export const detailDrawerVisible = ref(false)
export const showDetailDrawer = () => {
  detailDrawerVisible.value = true
}
export const closeDetailDrawer= () => {
  detailDrawerVisible.value = false
}

export const textarea = ref('')

export const setTextArea = (event) => {
  textarea.value = event.target.value
}

export const isAddToListButtonDisabled = computed(() => {
  return textarea.value.trim() === ''
})

export const drawerTitle = computed(() => {
  return jiraIdText.value ? `Jira: ${jiraIdText.value}` : '备忘录'
})

export const tableData = ref([])

export const setTableData = (value) => {
  tableData.value = value
}

export const addToList = async () => {
  const time = new Date().valueOf()
  const text = textarea.value.trim()
  await globalStorage.add(jiraIdText.value, {
    text,
    updateTime: time,
    id: time,
    origin: window.location.origin,
    href: window.location.href
  })
  await getTableDataFromLocalStorage()
  textarea.value = ''
}

export const deleteItem = async (id) => {
  await globalStorage.delete(jiraIdText.value, id)
  await getTableDataFromLocalStorage()
}

export const getTableDataFromLocalStorage = async () => {
  const value = await globalStorage.get(jiraIdText.value)
  setTableData(value)
}

export const detailInfo = ref({})

export const detailInfoHTMLText = computed(() => {
  if (detailInfo.value.text === undefined) {
    return ''
  }
  return linkifyHtml(detailInfo.value.text, {
    target: {
      url: '_blank'
    }
  })
})

export const goToDetail = (id) => {
  detailInfo.value = tableData.value.find(item => item.id === id)
  showDetailDrawer()
}