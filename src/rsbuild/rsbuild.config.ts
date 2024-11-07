import { defineConfig } from '@rsbuild/core'
import { pluginLess } from '@rsbuild/plugin-less'
import { pluginVue } from '@rsbuild/plugin-vue'
import { codeInspectorPlugin } from 'code-inspector-plugin'

export default defineConfig({
  plugins: [pluginVue(), pluginLess()],
  source: {
    alias: {
      '@': './src'
    },
    entry: {
      index: './src/main',
      options: './src/pages/options'
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
  },
  tools: {
    rspack: {
      plugins: [
        codeInspectorPlugin({
          bundler: 'rspack',
          hotKeys: ['altKey'],
          hideDomPathAttr: true,
          showSwitch: true
        })
      ]
    }
  }
})
