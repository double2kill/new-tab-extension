import axios from 'axios'
import OpenAI from 'openai'

import { storageGet } from '@/utils/chromeStorage'

export enum ModelType {
  GLM_4_Flash = 'glm-4-flash',
  GLM_4_Assistant = 'glm-4-assistant',
  GLM_4 = 'glm-4'
}

type Options = {
  model?: ModelType
  apiKey?: string
}

export const sendGLMMessage = async (
  messages: any[],
  { model = ModelType.GLM_4_Flash }: Options = {}
) => {
  const apiKey = await storageGet('NEW_TAB_ZHI_PU_API_KEY')
  const client = new OpenAI({
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
    apiKey,
    dangerouslyAllowBrowser: true
  })
  const result = await client.chat.completions.create({
    model,
    messages
  })
  return result.choices[0].message?.content
}

export const sendGLMAssistantMessage = async (messages: string, { apiKey }: Options) => {
  return axios.post(
    'https://open.bigmodel.cn/api/paas/v4/assistant',
    {
      model: ModelType.GLM_4_Assistant,
      messages,
      stream: true,
      assistant_id: '65a265419d72d299a9230616'
    },
    {
      // responseType: 'stream',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    }
  )
}
