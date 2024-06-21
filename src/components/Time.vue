<script setup lang="ts" >
import {onBeforeMount, onUnmounted, ref} from 'vue'
import dayjs from 'dayjs'
import zhCN from 'dayjs/locale/zh-cn';
import { NSwitch } from 'naive-ui'

dayjs.locale(zhCN);

const currentTime = ref('')
const currentDate = ref('')
let intervalId:any = null

function refreshTime() {
    const date = dayjs();
    currentTime.value = date.format('HH:mm')
    currentDate.value = `今天是 <strong>${date.year()}</strong> 年 <strong>${date.month() + 1}</strong> 月 <strong>${date.date()}</strong> 日 <strong>${date.format('dddd')}</strong>`;
}

onBeforeMount(() => {
    refreshTime()
    intervalId = setInterval(refreshTime, 1000)
})

onUnmounted(() => {
    clearInterval(intervalId)
})

</script>

<template>
    <h1>{{currentTime}}</h1>
    <p v-html="currentDate" />
</template>

<style scoped>
    h1 {
        font-size: 6rem;
        margin: 0;
    }
    h4 {
        font-size: 2rem;
    }
    p {
        font-size: 1.5rem;
    }
</style>