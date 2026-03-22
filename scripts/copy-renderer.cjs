const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'app', 'renderer');
const dest = path.join(root, 'dist', 'main', 'renderer');

if (!fs.existsSync(src)) {
  process.exit(0);
}
fs.mkdirSync(dest, { recursive: true });
for (const name of fs.readdirSync(src)) {
  const from = path.join(src, name);
  if (fs.statSync(from).isFile()) {
    fs.copyFileSync(from, path.join(dest, name));
  }
}
