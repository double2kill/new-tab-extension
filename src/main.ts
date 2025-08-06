import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import { createApp } from 'vue'

import App from './App.vue'
import './utils/debugHelper'

dayjs.extend(isToday)

createApp(App).mount('#app')
