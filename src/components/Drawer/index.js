import {ref} from 'vue'
import Localstorage from 'localstorage'

const jiraIdElement = document.querySelector('#issue-content a#key-val')
export const jiraIdText = jiraIdElement && jiraIdElement.text

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
  jiraLocalStorage.put(jiraIdText, event.target.value)
}