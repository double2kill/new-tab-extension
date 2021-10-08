<script setup lang="ts" >
import {onBeforeMount, onUnmounted, ref} from 'vue'
import dayjs from 'dayjs'

const currentTime = ref('')
let intervalId = null

function refreshTime() {
    currentTime.value = dayjs().format('HH:mm')
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
</template>

<style scoped>
    h1 {
        font-size: 3em;
        margin: 0;
    }
</style>