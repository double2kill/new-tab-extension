<script setup lang="ts">
import NewTab from './components/NewTab.vue'
</script>

<template>
  <NewTab />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size: 16px;
}

body {
  background-color: #f3f5fc;
}

@media screen and (max-height: 439px) {
  :root {
    font-size: 6px;
  }
}

@media screen and (min-height: 440px) and (max-height: 539px) {
  :root {
    font-size: 8px;
  }
}

@media screen and (min-height: 540px) and (max-height: 639px) {
  :root {
    font-size: 10px;
  }
}

@media screen and (min-height: 640px) and (max-height: 739px) {
  :root {
    font-size: 12px;
  }
}

@media screen and (min-height: 740px) and (max-height: 839px) {
  :root {
    font-size: 14px;
  }
}

@media screen and (min-height: 840px) and (max-height: 939px) {
  :root {
    font-size: 15px;
  }
}

@media screen and (min-height: 940px) {
  :root {
    font-size: 16px;
  }
}
</style>
