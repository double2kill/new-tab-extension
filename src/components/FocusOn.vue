<script setup lang="ts">
import { onMounted } from 'vue'

import { focusOnTodayText, fetchFocusOnToday, setFocusOnToday } from './newTab'
onMounted(() => {
  fetchFocusOnToday()
})
</script>

<template>
  <div class="focus-on">
    <template v-if="focusOnTodayText">
      <div>TODAY</div>
      <h3>{{ focusOnTodayText }}</h3>
    </template>
    <template v-else>
      <h3>What is your main focus for today?</h3>
      <a-input
        class="focus-on-input"
        type="text"
        autocomplete="off"
        @pressEnter="setFocusOnToday"
      />
    </template>
  </div>
</template>

<style scoped>
.focus-on {
  font-weight: bold;
}

.focus-on h4 {
  font-size: 150%;
  margin: 10px;
}

.focus-on h3 {
  font-size: 200%;
  margin: 10px;
}

.focus-on-input {
  width: 100%;
  padding-top: 4px;
  display: block;
  background: 0;
  border: 0;
  border-bottom: 2px solid #fff;
  color: #fff;
  font-size: 2.25em;
  line-height: 1.2;
  font-weight: 500;
  outline: none;
  text-align: center;
  transition: border-color 0.2s ease;
}

.focus-on-input:hover {
  border-color: inherit;
  border-right-width: none !important;
}

.focus-on-input:focus {
  border-color: inherit;
  border-right-width: none !important;
  outline: none;
  box-shadow: none;
}
</style>
