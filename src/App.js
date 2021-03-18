import {reactive, ref} from 'vue'
import Localstorage from 'localstorage'

export const jiraPositionLocalStorage = new Localstorage('JIRA_POSITION')
export const position = reactive({ x: 0, y: 0})
export const mainButtonRef = ref(null)

let prevX, prevY
export const onMove = (event) => {
  const diffY = event.clientY - prevY
  const diffX = event.clientX - prevX

  position.y += diffY
  position.x += diffX

  prevY = event.clientY
  prevX = event.clientX
}

export const onEnd = (event) => {
  document.removeEventListener('pointermove', onMove)
  document.removeEventListener('mouseup', onEnd)
  jiraPositionLocalStorage.put(undefined, position)
  event.stopPropagation()
}

export const onStart = (event) => {
  document.addEventListener('pointermove', onMove)
  document.addEventListener('mouseup', onEnd)
  prevY = event.clientY
  prevX = event.clientX
}