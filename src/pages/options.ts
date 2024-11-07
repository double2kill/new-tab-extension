import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import { createApp } from 'vue'

import Options from './Options.vue'

dayjs.extend(isToday)

createApp(Options).mount('#app')
