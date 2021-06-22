import {ref} from 'vue'
import {storageSet} from '../../utils/chromeStorage'
import { notification } from 'ant-design-vue'

export const isSettingsVisible = ref(false)

export const openSettingsDrawer = () => {
  isSettingsVisible.value = true
}

export const closeSettingsDrawer = () => {
  isSettingsVisible.value = false
}

export const localhostOriginInputValue = ref('')
export const localhostOrigin = ref('')

export const setInitialLocalhostOrigin = (value) => {
  localhostOriginInputValue.value = value
  localhostOrigin.value = value
}

export const setLocalhostOrigin = async () => {
  const {value} = localhostOriginInputValue
  localhostOrigin.value = value
  await storageSet('LOCALHOST_ORIGIN', value)
  notification.success({
    message: '设置成功',
    duration: 1,
  })
}