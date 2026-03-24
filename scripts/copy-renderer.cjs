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

/** Window/taskbar .ico: single source = control-ui/public/favicon.ico (overrides app/assets copy). */
const controlUiFaviconIco = path.join(root, 'control-ui', 'public', 'favicon.ico');
const windowIcoDest = path.join(assetsDest, 'openclaw-window.ico');
if (fs.existsSync(controlUiFaviconIco)) {
  fs.mkdirSync(assetsDest, { recursive: true });
  fs.copyFileSync(controlUiFaviconIco, windowIcoDest);
}
