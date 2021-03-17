<template>
  <a-button @click="showDrawer">
    打开面板
  </a-button>
  <Drawer 
    :visible="drawerVisible"
  />
</template>
<script setup>
import Drawer from './Drawer.vue'
import {drawerVisible, showDrawer, closeDrawer} from './index.js'
</script>