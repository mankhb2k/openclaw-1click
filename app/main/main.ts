/**
 * Electron main process: spawns the OpenClaw gateway launcher (ELECTRON_RUN_AS_NODE),
 * then loads the official Control UI in a BrowserWindow.
 */
import {
  app,
  BrowserWindow,
  Menu,
  dialog,
  globalShortcut,
  shell,
  type Event as ElectronEvent,
  type WebContentsConsoleMessageEventParams,
} from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import treeKill from 'tree-kill';
import { ENV_DATA_ROOT } from '../backend/config';
import { runFirstLaunchOnboardingIfNeeded } from './onboard';
import { ENV_DESKTOP_RESOURCES } from '../backend/config';

/**
 * Smallest window size the user can resize to (matches Control UI layout floor).
 * Keep roughly in sync with `control-ui/src/styles/base.css` `--app-min-width` (1020px)
 * plus a little slack for window chrome / scrollbars.
 */
const MAIN_WINDOW_MIN_WIDTH = 1060;
const MAIN_WINDOW_MIN_HEIGHT = 700;

let mainWindow: BrowserWindow | null = null;

/**
 * On Windows/Linux, `window-all-closed` quits the app. During first launch the
 * onboarding window closes before the Control UI window exists — without this
 * guard that event would quit the app instead of continuing to `createWindow()`.
 */
let quitAppWhenAllWindowsClosed = false;

if (app.isPackaged) {
  process.env[ENV_DESKTOP_RESOURCES] = process.resourcesPath;
}

/** Windows: some GPUs/drivers leave the WebContents black until this is set (try if the UI stays blank). */
if (process.env.OPENCLAW_DESKTOP_DISABLE_GPU === '1') {
  app.disableHardwareAcceleration();
}

let backendLauncher: ChildProcess | null = null;

function getProjectRoot(): string {
  if (app.isPackaged) {
    return app.getAppPath();
  }
  return path.resolve(__dirname, '..', '..');
}

function getDataRoot(): string {
  const override = process.env[ENV_DATA_ROOT]?.trim();
  if (override) return path.resolve(override);
  if (!app.isPackaged) {
    return path.resolve(getProjectRoot(), '.openclaw-desktop-data');
  }
  return app.getPath('userData');
}

function resolveOpenClawCliScript(appRoot: string): string {
  return path.join(appRoot, 'node_modules', 'openclaw', 'openclaw.mjs');
}

function readReadyState(dataRoot: string): { controlUiUrl: string; gatewayPort: number } {
  const readyFile = path.join(dataRoot, 'launcher-ready.json');
  const raw = fs.readFileSync(readyFile, 'utf8');
  const parsed = JSON.parse(raw) as {
    controlUiUrl?: string;
    /** @deprecated */
    dashboardUrl?: string;
    gatewayPort?: number;
  };
  const controlUiUrl = parsed.controlUiUrl || parsed.dashboardUrl;
  if (!controlUiUrl || typeof parsed.gatewayPort !== 'number') {
    throw new Error('Invalid launcher-ready.json');
  }
  return { controlUiUrl, gatewayPort: parsed.gatewayPort };
}

async function waitForLauncherReady(dataRoot: string, timeoutMs: number): Promise<void> {
  const readyFile = path.join(dataRoot, 'launcher-ready.json');
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if (fs.existsSync(readyFile)) {
        readReadyState(dataRoot);
        return;
      }
    } catch {
      /* keep waiting until JSON is valid */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('Backend launcher did not become ready in time');
}

async function ensureBackendAndGetUrl(dataRoot: string): Promise<string> {
  const readyFile = path.join(dataRoot, 'launcher-ready.json');
  if (
    backendLauncher &&
    backendLauncher.exitCode === null &&
    fs.existsSync(readyFile)
  ) {
    try {
      return readReadyState(dataRoot).controlUiUrl;
    } catch {
      /* stale file; restart launcher below */
    }
  }
  startBackendLauncher(dataRoot);
  await waitForLauncherReady(dataRoot, 90_000);
  return readReadyState(dataRoot).controlUiUrl;
}

function startBackendLauncher(dataRoot: string): void {
  const startScript = path.join(__dirname, '..', 'backend', 'start.js');
  const appRoot = getProjectRoot();
  const cliScript = resolveOpenClawCliScript(appRoot);

  fs.mkdirSync(dataRoot, { recursive: true });

  try {
    if (fs.existsSync(path.join(dataRoot, 'launcher-ready.json'))) {
      fs.unlinkSync(path.join(dataRoot, 'launcher-ready.json'));
    }
  } catch {
    /* ignore */
  }

  const seedWorkspace = app.isPackaged
    ? path.join(process.resourcesPath, 'resources', 'workspace')
    : path.resolve(getProjectRoot(), 'resources', 'workspace');

  backendLauncher = spawn(process.execPath, [startScript], {
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      [ENV_DATA_ROOT]: dataRoot,
      OPENCLAW_APP_ROOT: appRoot,
      OPENCLAW_CLI_SCRIPT: cliScript,
      OPENCLAW_SEED_WORKSPACE: fs.existsSync(seedWorkspace) ? seedWorkspace : '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  const forward = (label: string, chunk: Buffer) => {
    process.stdout.write(`[backend] ${label} ${chunk.toString()}`);
  };
  backendLauncher.stdout?.on('data', (c) => forward('out', c));
  backendLauncher.stderr?.on('data', (c) => forward('err', c));
  backendLauncher.on('exit', (code, signal) => {
    console.error(`[backend] launcher exited code=${code} signal=${signal}`);
    backendLauncher = null;
  });
}

async function openControlUiInBrowser(): Promise<void> {
  const dataRoot = getDataRoot();
  const readyPath = path.join(dataRoot, 'launcher-ready.json');
  if (!fs.existsSync(readyPath)) {
    dialog.showErrorBox(
      'OpenClaw Control UI',
      'launcher-ready.json was not found. Wait until the app has finished starting the backend.',
    );
    return;
  }
  let controlUiUrl: string;
  try {
    ({ controlUiUrl } = readReadyState(dataRoot));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    dialog.showErrorBox('OpenClaw Control UI', `Could not read launcher state: ${msg}`);
    return;
  }
  try {
    await shell.openExternal(controlUiUrl);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    dialog.showErrorBox('OpenClaw Control UI', `Could not open browser: ${msg}`);
  }
}

/**
 * macOS: chỉ giữ menu tên app + Edit (chuẩn hệ thống). Windows/Linux: ẩn hẳn thanh menu.
 * Mở Control UI trong browser: phím Ctrl+Shift+O / Cmd+Shift+O (globalShortcut).
 */
function buildApplicationMenu(): void {
  if (process.platform === 'darwin') {
    const openControlUi: Electron.MenuItemConstructorOptions = {
      label: 'Open OpenClaw Control UI in browser…',
      accelerator: 'CmdOrCtrl+Shift+O',
      click: () => {
        void openControlUiInBrowser();
      },
    };
    Menu.setApplicationMenu(
      Menu.buildFromTemplate([
        {
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            openControlUi,
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
        {
          label: 'Edit',
          submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
          ],
        },
      ])
    );
  } else {
    Menu.setApplicationMenu(null);
  }
}

/** Windows/Linux: không có menu File nên đăng ký phím tắt toàn cục. macOS dùng accelerator trong menu app. */
function registerGlobalShortcuts(): void {
  if (process.platform === 'darwin') return;
  const registered = globalShortcut.register('CommandOrControl+Shift+O', () => {
    void openControlUiInBrowser();
  });
  if (!registered) {
    console.warn('[main] Could not register global shortcut CommandOrControl+Shift+O');
  }
}

function killBackendTree(): void {
  if (backendLauncher?.pid) {
    try {
      treeKill(backendLauncher.pid, 'SIGTERM', (err) => {
        if (err) console.error('[backend] tree-kill:', err.message);
      });
    } catch (e) {
      console.error('[backend] kill failed', e);
    }
  }
  backendLauncher = null;
}

async function createWindow(): Promise<void> {
  const dataRoot = getDataRoot();
  const controlUiUrl = await ensureBackendAndGetUrl(dataRoot);

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: MAIN_WINDOW_MIN_WIDTH,
    minHeight: MAIN_WINDOW_MIN_HEIGHT,
    show: false,
    backgroundColor: '#0e1015',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (isMainFrame) {
      console.error('[main] Control UI failed to load:', { errorCode, errorDescription, validatedURL });
    }
  });
  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    console.error('[main] renderer crashed:', details);
  });
  mainWindow.webContents.on(
    'console-message',
    (e: ElectronEvent<WebContentsConsoleMessageEventParams>) => {
      if (e.level === 'warning' || e.level === 'error') {
        console.error(
          '[control-ui]',
          e.message,
          e.sourceId ? `(${e.sourceId}:${e.lineNumber})` : '',
        );
      }
    },
  );

  mainWindow.once('ready-to-show', () => mainWindow?.show());
  quitAppWhenAllWindowsClosed = true;
  await mainWindow.loadURL(controlUiUrl);

  if (!app.isPackaged) {
    // Auto-opening DevTools spams the terminal with harmless Chromium noise:
    // Autofill.enable / Autofill.setAddresses (-32601) — DevTools CDP not fully wired in Electron.
    if (process.env.OPENCLAW_DESKTOP_DEVTOOLS === '1') {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
    mainWindow.webContents.on('before-input-event', (_event, input) => {
      if (input.type !== 'keyDown') return;
      if (input.key === 'F12') {
        mainWindow?.webContents.toggleDevTools();
        return;
      }
      const mod = process.platform === 'darwin' ? input.meta : input.control;
      if (mod && input.shift && input.key.toLowerCase() === 'i') {
        mainWindow?.webContents.toggleDevTools();
      }
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    buildApplicationMenu();
    registerGlobalShortcuts();
    const dataRoot = getDataRoot();
    void runFirstLaunchOnboardingIfNeeded({
      dataRoot,
      getAppRoot: getProjectRoot,
    })
      .then(() =>
        createWindow().catch((err) => {
          console.error(err);
          app.quit();
        })
      )
      .catch((err) => {
        console.error(err);
        app.quit();
      });
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow().catch(console.error);
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin' && quitAppWhenAllWindowsClosed) {
      app.quit();
    }
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });

  app.on('before-quit', () => {
    killBackendTree();
  });
}
