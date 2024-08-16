import { defineConfig } from '@rsbuild/core'
import { pluginLess } from '@rsbuild/plugin-less'
import { pluginVue } from '@rsbuild/plugin-vue'

export default defineConfig({
  plugins: [pluginVue(), pluginLess()],
  source: {
    alias: {
      '@': './src'
    },
    entry: {
      index: './src/main'
    }
  },
  output: {
    assetPrefix: '.',
    filenameHash: false,
    legalComments: 'none',
    cleanDistPath: false,
    distPath: {
      root: './build',
      js: 'js',
      css: 'css'
    }
  },
  html: {
    mountId: 'app',
    template: './src/index.html',
    title: 'New Tab'
  }
})
