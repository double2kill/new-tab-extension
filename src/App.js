import {reactive, ref} from 'vue'
import Localstorage from 'localstorage'

export const jiraPositionLocalStorage = new Localstorage('JIRA_POSITION')
export const position = reactive({ x: 0, y: 0})
export const mainButtonRef = ref(null)

let diffY, diffX
const adjustPositionInWindow = () => {
  const {width, height} = mainButtonRef.value.getBoundingClientRect()
  const {offsetWidth, offsetHeight} = document.body
  const maxY = offsetHeight - height
  const maxX = offsetWidth - width
  // move to top of window
  position.y = Math.max(position.y, 0)
  // move to right of window
  position.x = Math.min(position.x, maxX)
  // move to bottom of window
  position.y = Math.min(position.y, maxY)
  // move to left of window
  position.x = Math.max(position.x, 0)
}

export const onMove = (event) => {
  position.y = event.clientY - diffY
  position.x = event.clientX - diffX
  adjustPositionInWindow()
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
  diffY = event.clientY - position.y
  diffX = event.clientX - position.x
  document.body.classList.add('no-select')
}