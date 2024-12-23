import { onMounted, ref, type Ref, type UnwrapRef } from 'vue'

import { storageGet, storageSet } from '../utils/chromeStorage'

export type LOCATION = {
  LOCAL: 'local'
  SYNC: 'sync'
  MANAGED: 'managed'
  SESSION: 'session'
}

type ChromeStorageStateOption<P> = {
  default?: P
  chromeDefault?: P
  onMounted?: (value: any) => void
  location?: LOCATION
}

export const useChromeStorageState = <P = any>(
  key: string,
  option: ChromeStorageStateOption<P> = {}
): [Ref<UnwrapRef<P>>, (value: any, isSkipUpdateState?: boolean) => void] => {
  const state = ref<P>(option.default)

  const updateState = (value: any, isSkipUpdateState = false) => {
    if (!isSkipUpdateState) {
      state.value = value
    }
    storageSet(key, value)
  }

  onMounted(async () => {
    const initialState = (await storageGet(key)) ?? option.default ?? option.chromeDefault
    state.value = initialState
    option.onMounted?.(initialState)
  })

  return [state, updateState]
}
