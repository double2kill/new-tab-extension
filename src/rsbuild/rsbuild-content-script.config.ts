import { pluginLess } from '@rsbuild/plugin-less'
import { pluginVue } from '@rsbuild/plugin-vue'

const { defineConfig } = require('@rsbuild/core')

export default defineConfig({
  plugins: [pluginVue(), pluginLess()],
  source: {
    alias: {
      '@': './src'
    },
    entry: {
      cursorEffect: './src/content-script/cursorEffect'
    }
  },
  dev: {
    hmr: false,
    liveReload: false,
    writeToDisk: true
  },
  output: {
    injectStyles: true,
    filenameHash: false,
    cleanDistPath: false,
    legalComments: 'none',
    distPath: {
      root: './build',
      js: '',
      css: ''
    },
    copy: []
  },
  performance: {
    chunkSplit: {
      strategy: 'all-in-one'
    }
  },
  server: {
    port: 3020
  }
})
