import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  content: {
    filesystem: ['./src/**/*.{html,js,vue}'],
  },
  presets: [presetUno()],
})
