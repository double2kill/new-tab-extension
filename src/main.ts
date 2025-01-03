import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import { createApp } from 'vue'

import App from './App.vue'

dayjs.extend(isToday)

createApp(App).mount('#app')
