<template>
  <a-button @click="showDrawer({isGlobal: true})">
    打开备忘录
  </a-button>
  <a-button @click="showDrawer({isGlobal: false})">
    打开ID备忘录
  </a-button>
  <Drawer
    :visible="drawerVisible"
  />
</template>
<script setup>
import Drawer from './Drawer.vue'
import {drawerVisible, showDrawer, closeDrawer} from './index.js'
</script>