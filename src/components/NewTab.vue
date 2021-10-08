<script setup lang="ts">
import { ref } from "vue";
import FocusOn from './FocusOn.vue'
import Time from './Time.vue'

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <div
    class="background-item"
    style="
      background-image: url('https://momentum.photos/img/2e360214-1827-4879-972f-a207b960ad9e.jpg?momo_cache_bg_uuid=dd62617c-83f3-4c57-9cfb-54a7c65c4b1b');
    "
  ></div>
  <div class="app">
    <div class="top-row"></div>
    <div class="center-above">
      <Time />
      <h1>Hello New Tab !</h1>
      <FocusOn />
    </div>
    <div class="center-below"></div>
    <div class="bottom-row"></div>
  </div>
</template>

<style scoped>
.background-item {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: transparent;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.app {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Neue Haas Grotesk Text Pro",
    "Helvetica Neue", Helvetica, Arial, sans-serif !important;
  display: flex;
  flex-direction: column;
  transition: opacity 0.3s var(--a-curve);
}
.center-above,
.center-below {
  flex: 1 1 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}
.top-row,
.bottom-row {
  height: 60px;
  display: flex;
  justify-content: space-between;
}

</style>
