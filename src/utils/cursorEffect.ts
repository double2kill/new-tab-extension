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
import { createDiscreteApi } from 'naive-ui'

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

const { message } = createDiscreteApi(['message'])

export const setCursorEffect = async (type?: CursorEffectType, shouldShowMessage?: boolean) => {
  let cursorType = type
  cursorInstance?.destroy()
  if (!cursorType) {
    cursorType = await storageGet('NEW_TAB_CURSOR_EFFECT')
  }
  if (!cursorType) {
    return
  }

  if (shouldShowMessage) {
    message.info('鼠标效果修改后需要刷新页面才能生效')
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
