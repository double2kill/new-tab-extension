import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

import { defineConfig } from '@rsbuild/core'
import { pluginLess } from '@rsbuild/plugin-less'
import { pluginVue } from '@rsbuild/plugin-vue'
import { DefinePlugin } from '@rspack/core'
import { codeInspectorPlugin } from 'code-inspector-plugin'

function getManifestVersion() {
  try {
    const manifestPath = join(process.cwd(), 'manifest.json')
    const manifestContent = readFileSync(manifestPath, 'utf8')
    const manifest = JSON.parse(manifestContent)
    return manifest.version
  } catch {
    return '0.0.0'
  }
}

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
        }),
        new DefinePlugin({
          __MANIFEST_VERSION__: JSON.stringify(getManifestVersion()),
          __BUILD_TIME__: JSON.stringify(
            new Date().toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
          )
        })
      ]
    }
  }
})
