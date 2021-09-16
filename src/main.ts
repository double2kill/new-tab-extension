import { createApp } from 'vue'
import { Input } from 'ant-design-vue'
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday'
import App from './App.vue'

dayjs.extend(isToday)

createApp(App).use(Input).mount('#app')
