/**
 * Copies `dist/control-ui` → `vendor/control-ui` for packaging or a stable path.
 * Run after `npm run control-ui:build`.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'dist', 'control-ui');
const dest = path.join(root, 'vendor', 'control-ui');

if (!fs.existsSync(path.join(src, 'index.html'))) {
  console.error(
    `[sync-control-ui] Missing ${path.join('dist', 'control-ui', 'index.html')}. Run: npm run control-ui:build`
  );
  process.exit(1);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log(`[sync-control-ui] Copied to ${dest}`);
