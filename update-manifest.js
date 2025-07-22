const fs = require('fs')
const path = require('path')

const manifestPath = path.join(__dirname, 'manifest.json')

function updateManifest() {
  try {
    const manifestJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    const currentVersion = manifestJson.version

    const versionParts = currentVersion.split('.')
    const lastPart = parseInt(versionParts[versionParts.length - 1])
    versionParts[versionParts.length - 1] = (lastPart + 1).toString()

    const newVersion = versionParts.join('.')

    manifestJson.version = newVersion
    fs.writeFileSync(manifestPath, JSON.stringify(manifestJson, null, 2) + '\n')
    console.log(`✅ 已更新 manifest.json 版本: ${currentVersion} → ${newVersion}`)
  } catch (error) {
    console.error('❌ 更新 manifest.json 失败:', error.message)
    process.exit(1)
  }
}

updateManifest()
