import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import { storageGet } from '@/utils/chromeStorage'

export type TTSSpeaker = {
  name?: string
  gender?: string
  speaker: string
}

const kVolcanoTTSSpeakers: TTSSpeaker[] = [
  {
    name: '灿灿',
    gender: '女',
    speaker: 'BV700_streaming'
  },
  {
    name: '灿灿二',
    gender: '女',
    speaker: 'BV700_V2_streaming'
  },
  {
    name: '梓梓',
    gender: '女',
    speaker: 'BV406_streaming'
  },
  {
    name: '梓梓二',
    gender: '女',
    speaker: 'BV406_V2_streaming'
  },
  {
    name: '燃燃',
    gender: '女',
    speaker: 'BV407_streaming'
  },
  {
    name: '燃燃二',
    gender: '女',
    speaker: 'BV407_V2_streaming'
  },
  {
    name: '炀炀',
    gender: '女',
    speaker: 'BV705_streaming'
  },
  {
    name: '擎苍',
    gender: '女',
    speaker: 'BV701_streaming'
  },
  {
    name: '擎苍二',
    gender: '女',
    speaker: 'BV701_V2_streaming'
  },
  {
    name: '通用女声',
    gender: '女',
    speaker: 'BV001_streaming'
  },
  {
    name: '通用女声二',
    gender: '女',
    speaker: 'BV001_V2_streaming'
  },
  {
    name: '通用男声',
    gender: '男',
    speaker: 'BV002_streaming'
  }
]

const userId = '2109425105'
const appid = '9751273055'

function playBinaryAudio(base64AudioData) {
  // 使用atob函数解码Base64字符串
  const binaryString = atob(base64AudioData)

  // 将解码后的字符串转换为ArrayBuffer
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  // 创建Blob对象
  const blob = new Blob([bytes.buffer], { type: 'audio/mpeg' })

  // 创建URL对象，指向这个Blob
  const audioURL = URL.createObjectURL(blob)

  // 创建Audio对象并播放
  const audio = new Audio(audioURL)
  audio.volume = 0.5
  audio.play()
}

async function checkAudioDevices(): Promise<boolean> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const audioOutputDevices = devices.filter((device) => device.kind === 'audiooutput')
    const defaultAudioDevice = audioOutputDevices.find((device) => device.deviceId === 'default')
    const label = defaultAudioDevice?.label?.toLowerCase() || ''
    return label.includes('bluetooth') || label.includes('headphones')
  } catch (error) {
    console.error('获取音频设备失败：', error)
    return false
  }
}

export const playAudioVoice = async (text: string) => {
  const accessToken = await storageGet('NEW_TAB_TTS_ACCESS_TOKEN')
  if (!accessToken) {
    return
  }
  const canPlay = await checkAudioDevices()
  if (!canPlay) {
    console.log('没有检测到蓝牙耳机或耳机设备')
    return
  }
  const requestId: string = uuidv4()
  const data = {
    app: {
      appid,
      token: accessToken,
      cluster: 'volcano_tts'
    },
    user: {
      uid: userId
    },
    audio: {
      voice_type: 'BV001_streaming',
      encoding: 'mp3',
      compression_rate: 1,
      rate: 24000,
      speed_ratio: 1,
      volume_ratio: 1,
      pitch_ratio: 1,
      emotion: 'happy',
      language: 'cn'
    },
    request: {
      reqid: requestId,
      text,
      text_type: 'plain',
      operation: 'query',
      silence_duration: '125',
      with_frontend: '1',
      frontend_type: 'unitTson',
      pure_english_opt: '1'
    }
  }
  const result = await axios.post('http://tts.greatwebtech.cn/api/v1/tts', data, {
    headers: {
      Authorization: `Bearer;${accessToken}`
    }
  })
  playBinaryAudio(result.data.data)
  return result.data
}
