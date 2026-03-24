import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

const WINDOW_ICO = 'openclaw-window.ico';
const WINDOW_PNG = 'openclaw-window.png';

/**
 * OpenClaw BrowserWindow / taskbar icon.
 * `copy-renderer.cjs` copies `control-ui/public/favicon.ico` → `dist/main/assets/openclaw-window.ico`.
 *
 * Packaged Windows: paths inside `app.asar` are not valid for native icon APIs — use
 * `app.asar.unpacked` (see `asarUnpack` in electron-builder.yml).
 */
export function resolveWindowIconPath(): string | undefined {
  if (process.platform === 'win32' && app.isPackaged) {
    const unpacked = path.join(
      process.resourcesPath,
      'app.asar.unpacked',
      'dist',
      'main',
      'assets',
      WINDOW_ICO,
    );
    if (fs.existsSync(unpacked)) {
      return unpacked;
    }
  }

  const base = path.join(__dirname, 'assets');
  if (process.platform === 'win32') {
    const ico = path.join(base, WINDOW_ICO);
    if (fs.existsSync(ico)) {
      return ico;
    }
  }
  const png = path.join(base, WINDOW_PNG);
  if (fs.existsSync(png)) {
    return png;
  }
  const ico = path.join(base, WINDOW_ICO);
  if (fs.existsSync(ico)) {
    return ico;
  }
  return undefined;
}
