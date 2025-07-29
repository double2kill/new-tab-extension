const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', '..', 'manifest.json');
const destDir = path.join(__dirname, '..', '..', 'build');
const dest = path.join(destDir, 'manifest.json');
const pubKeyPath = path.join(__dirname, '..', '..', 'public_key.txt');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

let content = fs.readFileSync(src, 'utf-8');
content = content.replaceAll('/build/', '/');

let manifest = JSON.parse(content);

if (fs.existsSync(pubKeyPath)) {
  const pubKey = fs.readFileSync(pubKeyPath, 'utf-8').trim();
  manifest.key = pubKey;
}

fs.writeFileSync(dest, JSON.stringify(manifest, null, 2), 'utf-8');
console.log('⭐ manifest.json 已复制到 build/manifest.json');
