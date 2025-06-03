import {
  bubbleCursor,
  characterCursor,
  clockCursor,
  emojiCursor,
  fairyDustCursor,
  followingDotCursor,
  ghostCursor,
  rainbowCursor,
  snowflakeCursor,
  springyEmojiCursor,
  textFlag,
  trailingCursor
} from 'cursor-effects'

import { storageGet } from './chromeStorage'

export enum CursorEffectType {
  springyEmojiCursor = 'springyEmojiCursor',
  fairyDustCursor = 'fairyDustCursor',
  snowflakeCursor = 'snowflakeCursor',
  characterCursor = 'characterCursor',
  trailingCursor = 'trailingCursor',
  followingDotCursor = 'followingDotCursor',
  bubbleCursor = 'bubbleCursor',
  emojiCursor = 'emojiCursor',
  ghostCursor = 'ghostCursor',
  rainbowCursor = 'rainbowCursor',
  clockCursor = 'clockCursor',
  textFlag = 'textFlag'
}

let cursorInstance: any = null

export const setCursorEffect = async (type?: CursorEffectType) => {
  let cursorType = type
  cursorInstance?.destroy()
  if (!cursorType) {
    cursorType = await storageGet('NEW_TAB_CURSOR_EFFECT')
  }
  if (!cursorType) {
    return
  }

  switch (cursorType) {
    case 'springyEmojiCursor':
      cursorInstance = springyEmojiCursor({})
      return
    case 'fairyDustCursor':
      cursorInstance = fairyDustCursor({})
      return
    case 'snowflakeCursor':
      cursorInstance = snowflakeCursor({})
      return
    case 'characterCursor':
      cursorInstance = characterCursor({})
      return
    case 'trailingCursor':
      cursorInstance = trailingCursor({})
      return
    case 'followingDotCursor':
      cursorInstance = followingDotCursor({})
      return
    case 'bubbleCursor':
      cursorInstance = bubbleCursor({})
      return
    case 'emojiCursor':
      cursorInstance = emojiCursor({})
      return
    case 'ghostCursor':
      cursorInstance = ghostCursor({})
      return
    case 'rainbowCursor':
      cursorInstance = rainbowCursor({})
      return
    case 'clockCursor':
      cursorInstance = clockCursor({})
      return
    case 'textFlag':
      cursorInstance = textFlag({})
      return
    default:
      break
  }
}

function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

const debouncedSetCursorEffect = debounce(setCursorEffect, 200)

const onFocus = () => {
  debouncedSetCursorEffect()
}
window.addEventListener('focus', onFocus)

const onBlur = () => {
  cursorInstance?.destroy()
}
window.addEventListener('blur', onBlur)

const onKeydown = () => {
  cursorInstance?.destroy()
}
window.addEventListener('keydown', onKeydown)

const onKeyup = () => {
  debouncedSetCursorEffect()
}
window.addEventListener('keyup', onKeyup)
