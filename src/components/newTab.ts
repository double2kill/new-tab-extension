import {ref} from 'vue'
import {focusOnList} from '../utils/storageList'
import dayjs from 'dayjs'

export const focusOnTodayText = ref('')
export const fetchFocusOnToday = async () => {
    const list = await focusOnList.get()
    list.some(item => {
        if(dayjs(item.id).isToday()) {
            focusOnTodayText.value = item.focusOn
        }
    })
}

export const setFocusOnToday = async (e)=> {
    const value = e.target.value
    const time = new Date().valueOf()
    const newData = {
        id: time,
        focusOn: value,
    }
    await focusOnList.add(newData)
    await fetchFocusOnToday()
}