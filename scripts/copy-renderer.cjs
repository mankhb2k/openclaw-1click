const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'app', 'renderer');
const dest = path.join(root, 'dist', 'main', 'renderer');

if (fs.existsSync(src)) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    if (fs.statSync(from).isFile()) {
      fs.copyFileSync(from, path.join(dest, name));
    }
  }
}

const assetsSrc = path.join(root, 'app', 'assets');
const assetsDest = path.join(root, 'dist', 'main', 'assets');
if (fs.existsSync(assetsSrc)) {
  fs.mkdirSync(assetsDest, { recursive: true });
  for (const name of fs.readdirSync(assetsSrc)) {
    const from = path.join(assetsSrc, name);
    if (fs.statSync(from).isFile()) {
      fs.copyFileSync(from, path.join(assetsDest, name));
    }
  }
}
