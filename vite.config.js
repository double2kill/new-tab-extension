import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'build',
    assetsDir: '',
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: '[name].js',
        format: 'iife'
      },
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'link-color': '#3572b0',
        },
        javascriptEnabled: true
      }
    }
  }
})