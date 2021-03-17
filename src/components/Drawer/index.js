import {ref} from 'vue'
import Localstorage from 'localstorage'
export const jiraLocalStorage = new Localstorage('JIRA')

export const drawerVisible = ref(false)
export const showDrawer = () => {
  drawerVisible.value = true
}
export const closeDrawer = () => {
  drawerVisible.value = false
}

export const drawerText = ref('')

export const setDrawerText = (text) => {
  drawerText.value = text
}

export const hanldeTextChange = (event) => {
  const jiraIdElement = document.querySelector('#issue-content a#key-val')
  const jiraIdText = jiraIdElement && jiraIdElement.text
  jiraLocalStorage.put(jiraIdText, event.target.value)
}