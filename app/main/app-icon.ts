import * as fs from 'fs';
import * as path from 'path';

/**
 * OpenClaw window/taskbar icon (copied from Control UI favicon at build time).
 * Windows prefers .ico; other platforms fall back to .png.
 */
export function resolveWindowIconPath(): string | undefined {
  const base = path.join(__dirname, 'assets');
  if (process.platform === 'win32') {
    const ico = path.join(base, 'openclaw-window.ico');
    if (fs.existsSync(ico)) {
      return ico;
    }
  }
  const png = path.join(base, 'openclaw-window.png');
  if (fs.existsSync(png)) {
    return png;
  }
  const ico = path.join(base, 'openclaw-window.ico');
  if (fs.existsSync(ico)) {
    return ico;
  }
  return undefined;
}
