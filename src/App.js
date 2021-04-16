import {reactive, ref} from 'vue'
import { storageSet} from './utils/chromeStorage'

export const position = reactive({ x: 0, y: 0, touchBorder: 'none', dragging: false})
export const mainButtonRef = ref(null)
export const isHoverAtContainerWhenLeave = ref(false)

const DETECT_TOLERANCE = 10
let diffY, diffX

const getMaxInfo = () => {
  const {width, height} = mainButtonRef.value.getBoundingClientRect()
  const { innerWidth, innerHeight } = window
  const maxY = innerHeight - height
  const maxX = innerWidth - width
  return {
    maxX, maxY
  }
}

const checkTouchWindowBorder = () => {
  const {maxX, maxY} = getMaxInfo()
  if (position.y === 0) {
    position.touchBorder = 'top'
    return
  }
  if (position.x === maxX) {
    position.touchBorder = 'right'
    return
  }
  if (position.y === maxY) {
    position.touchBorder = 'bottom'
    return
  }
  if (position.x === 0) {
    position.touchBorder = 'left'
    return
  }
  position.touchBorder = 'none'
}

const adjustPositionInWindow = () => {
  const {maxX, maxY} = getMaxInfo()
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
  position.dragging = true
  position.y = event.clientY - diffY
  position.x = event.clientX - diffX
  adjustPositionInWindow()
}

export const onEnd = (event) => {
  position.dragging = false
  document.removeEventListener('pointermove', onMove)
  document.removeEventListener('mouseup', onEnd)
  checkTouchWindowBorder()
  storageSet('JIRA_POSITION', position)
  event.stopPropagation()
}

export const onStart = (event) => {
  document.addEventListener('pointermove', onMove)
  document.addEventListener('mouseup', onEnd)
  diffY = event.clientY - position.y
  diffX = event.clientX - position.x
  document.body.classList.add('no-select')
}

document.addEventListener('mouseleave', (event) => {
  // 当鼠标移出窗口时，hover不会触发，所以需要多一个状态来标记 Hover .
  const {clientX, clientY} = event
  const {width, height} = mainButtonRef.value.getBoundingClientRect()

  const insideAtX = clientX > position.x && clientX < position.x + width
  const insideAtY = clientY > position.y && clientY < position.y + height

  const isLeaveFromTop = insideAtX && clientY < DETECT_TOLERANCE && position.touchBorder === 'top'
  const isLeaveFromRight = insideAtY && clientX > width - DETECT_TOLERANCE && position.touchBorder === 'right'
  const isLeaveFromBottom = insideAtX && clientY > height - DETECT_TOLERANCE && position.touchBorder === 'bottom'
  const isLeaveFromLeft = insideAtY && clientX < DETECT_TOLERANCE && position.touchBorder === 'left'

  if (isLeaveFromTop || isLeaveFromRight || isLeaveFromBottom || isLeaveFromLeft) {
    isHoverAtContainerWhenLeave.value = true
    return
  }
})

document.addEventListener('mouseenter', () => {
  isHoverAtContainerWhenLeave.value = false
})