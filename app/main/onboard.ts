/**
 * First-launch onboarding: local BrowserWindow + non-interactive `openclaw onboard`.
 */
import { BrowserWindow, ipcMain, app, shell, type WebContents } from 'electron';
import { resolveWindowIconPath } from './app-icon';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFile, spawn } from 'child_process';
import { promisify } from 'util';
import type { DesktopPaths } from '../backend/config';
import {
  buildOpenClawEnv,
  ensureDataLayout,
  ensureGatewayDesktopAuth,
  resolveDesktopPaths,
} from '../backend/config';

const MARKER_FILE = '.openclaw-desktop-onboarded';
const ENV_GATEWAY_NODE = 'OPENCLAW_GATEWAY_NODE';
const DEFAULT_ONBOARD_GATEWAY_PORT = '18789';

const ALLOWED_OLLAMA_MODEL_IDS = new Set([
  'deepseek-r1:1.5b',
  'deepseek-r1:8b',
  'deepseek-r1:14b',
]);

const execFileAsync = promisify(execFile);

export function onboardingMarkerPath(dataRoot: string): string {
  return path.join(dataRoot, MARKER_FILE);
}

export function needsOnboarding(dataRoot: string): boolean {
  return !fs.existsSync(onboardingMarkerPath(dataRoot));
}

function resolveOpenClawCliScript(appRoot: string): string {
  return path.join(appRoot, 'node_modules', 'openclaw', 'openclaw.mjs');
}

function buildOnboardBaseArgs(workspaceDir: string): string[] {
  return [
    'onboard',
    '--non-interactive',
    '--accept-risk',
    '--mode',
    'local',
    '--flow',
    'quickstart',
    '--workspace',
    workspaceDir,
    '--gateway-port',
    DEFAULT_ONBOARD_GATEWAY_PORT,
    '--gateway-bind',
    'loopback',
    '--no-install-daemon',
    '--skip-daemon',
    '--skip-channels',
    '--skip-skills',
    '--skip-health',
    '--skip-ui',
    '--secret-input-mode',
    'plaintext',
  ];
}

function buildOnboardArgs(
  workspaceDir: string,
  target:
    | { kind: 'ollama'; modelId: string }
    | { kind: 'api'; provider: string; apiKey: string },
): string[] {
  const base = buildOnboardBaseArgs(workspaceDir);
  if (target.kind === 'ollama') {
    return [...base, '--auth-choice', 'ollama', '--custom-model-id', target.modelId];
  }
  const { provider, apiKey } = target;
  if (provider === 'anthropic') {
    return [...base, '--auth-choice', 'apiKey', '--anthropic-api-key', apiKey];
  }
  if (provider === 'gemini') {
    return [...base, '--auth-choice', 'gemini-api-key', '--gemini-api-key', apiKey];
  }
  if (provider === 'openai') {
    return [...base, '--auth-choice', 'openai-api-key', '--openai-api-key', apiKey];
  }
  throw new Error(`Unknown provider: ${provider}`);
}

function appendCapped(buffer: string, chunk: string, max: number): string {
  const next = buffer + chunk;
  return next.length > max ? next.slice(next.length - max) : next;
}

function isOllamaReachabilityFailure(output: string): boolean {
  const lower = output.toLowerCase();
  return (
    lower.includes('ollama could not be reached') ||
    lower.includes('no ollama models are available') ||
    lower.includes('pull a model first')
  );
}

/** Quick check before running a long onboard + model pull. */
async function probeOllamaReachable(): Promise<boolean> {
  try {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), 4000);
    const res = await fetch('http://127.0.0.1:11434/api/tags', { signal: ac.signal });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

function formatOllamaOnboardFailureMessage(output: string): string {
  const trimmed = output.trim();
  if (!trimmed) return 'Onboard thất bại.';
  if (!isOllamaReachabilityFailure(trimmed)) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();
  const lines = [
    'Không kết nối được Ollama tại http://127.0.0.1:11434 (ứng dụng Ollama chưa chạy hoặc cổng bị chặn).',
    'Lỗi này không do chọn model 1.5B hay 8B — cần Ollama đang lắng nghe cổng mặc định.',
    '',
    '• Cài và mở Ollama: https://ollama.com/download',
    '• Kiểm tra Ollama đang chạy (biểu tượng khay hệ thống) hoặc thử lệnh: ollama serve',
  ];

  if (
    process.platform === 'win32' ||
    lower.includes('windows detected') ||
    lower.includes('wsl2') ||
    lower.includes('docs.openclaw.ai/windows')
  ) {
    lines.push(
      '',
      'Trên Windows, OpenClaw thường gợi ý WSL2 nếu bản native gặp khó:',
      'https://docs.openclaw.ai/windows',
    );
  }

  lines.push('', '— Chi tiết từ công cụ —', '', trimmed);
  return lines.join('\n');
}

type RunOnboardCliInput =
  | {
      appRoot: string;
      paths: DesktopPaths;
      gatewayToken: string;
      kind: 'ollama';
      modelId: string;
    }
  | {
      appRoot: string;
      paths: DesktopPaths;
      gatewayToken: string;
      kind: 'api';
      provider: string;
      apiKey: string;
    };

function runOnboardCli(opts: RunOnboardCliInput): Promise<{ ok: boolean; output: string }> {
  const { appRoot, paths, gatewayToken } = opts;
  const cliScript = resolveOpenClawCliScript(appRoot);
  if (!fs.existsSync(cliScript)) {
    return Promise.resolve({ ok: false, output: `Không tìm thấy OpenClaw CLI: ${cliScript}` });
  }

  const args =
    opts.kind === 'ollama'
      ? [cliScript, ...buildOnboardArgs(paths.workspaceDir, { kind: 'ollama', modelId: opts.modelId })]
      : [
          cliScript,
          ...buildOnboardArgs(paths.workspaceDir, {
            kind: 'api',
            provider: opts.provider,
            apiKey: opts.apiKey,
          }),
        ];

  const gatewayNodeBin = process.env[ENV_GATEWAY_NODE]?.trim();
  const useSystemNode = Boolean(gatewayNodeBin && fs.existsSync(gatewayNodeBin));
  const runner = useSystemNode ? gatewayNodeBin! : process.execPath;

  const tokenEnv = gatewayToken.length > 0 ? gatewayToken : undefined;
  const env: NodeJS.ProcessEnv = {
    ...buildOpenClawEnv(paths, tokenEnv, appRoot),
    OPENCLAW_APP_ROOT: appRoot,
  };
  if (useSystemNode) {
    delete env.ELECTRON_RUN_AS_NODE;
  } else {
    env.ELECTRON_RUN_AS_NODE = '1';
  }

  return new Promise((resolve) => {
    let out = '';
    const onChunk = (chunk: Buffer) => {
      out = appendCapped(out, chunk.toString(), 14_000);
    };
    const child = spawn(runner, args, {
      cwd: appRoot,
      env,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stdout?.on('data', onChunk);
    child.stderr?.on('data', onChunk);
    child.on('error', (err) => {
      resolve({ ok: false, output: appendCapped(out, `\n${err.message}`, 14_000) });
    });
    child.on('close', (code) => {
      if (code === 0) {
        resolve({ ok: true, output: out });
      } else {
        const tail = out.trim().length > 0 ? out : `Thoát mã ${code}.`;
        resolve({ ok: false, output: tail });
      }
    });
  });
}

function onboardHtmlPath(): string {
  return path.join(__dirname, 'renderer', 'onboard.html');
}

function preloadOnboardPath(): string {
  return path.join(__dirname, 'preload-onboard.js');
}

function isAllowedExternalHttpUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Trang onboard (file://): mở http(s) trong trình duyệt hệ thống, không dùng cửa sổ Electron mới. */
function wireOnboardExternalLinks(wc: WebContents): void {
  wc.setWindowOpenHandler(({ url }) => {
    if (isAllowedExternalHttpUrl(url)) {
      void shell.openExternal(url);
    }
    return { action: 'deny' };
  });
  wc.on('will-navigate', (event, url) => {
    try {
      const u = new URL(url);
      if (u.protocol === 'file:') {
        return;
      }
      if (isAllowedExternalHttpUrl(url)) {
        event.preventDefault();
        void shell.openExternal(url);
      }
    } catch {
      /* ignore malformed URL */
    }
  });
}

type OnboardHardwareInfo = {
  totalMemoryBytes: number;
  platform: NodeJS.Platform;
  cpuCores: number;
  /** Dedicated / adapter VRAM in bytes when detected; `null` if unknown */
  vramBytes: number | null;
  gpuLabel: string | null;
};

function tryReadLinuxDrmVramBytes(): number | undefined {
  if (process.platform !== 'linux') return undefined;
  try {
    const drm = '/sys/class/drm';
    if (!fs.existsSync(drm)) return undefined;
    let max = 0;
    for (const name of fs.readdirSync(drm)) {
      if (!name.startsWith('card') || name.includes('-')) continue;
      const p = path.join(drm, name, 'device', 'mem_info_vram_total');
      if (!fs.existsSync(p)) continue;
      const raw = parseInt(fs.readFileSync(p, 'utf8').trim(), 10);
      if (Number.isFinite(raw) && raw > max) max = raw;
    }
    return max > 0 ? max : undefined;
  } catch {
    return undefined;
  }
}

async function tryWindowsAdapterVramBytes(): Promise<number | undefined> {
  if (process.platform !== 'win32') return undefined;
  try {
    const { stdout } = await execFileAsync(
      'powershell.exe',
      [
        '-NoProfile',
        '-Command',
        '$m = (Get-CimInstance Win32_VideoController | Where-Object { $_.AdapterRAM -and $_.AdapterRAM -gt 0 } | Select-Object -ExpandProperty AdapterRAM | Measure-Object -Maximum).Maximum; if ($m) { [string][int64]$m } else { "" }',
      ],
      { timeout: 4500, windowsHide: true, encoding: 'utf8' },
    );
    const n = Number(String(stdout).trim());
    return Number.isFinite(n) && n > 0 ? n : undefined;
  } catch {
    return undefined;
  }
}

function pickGpuLabelFromInfo(gpu: Record<string, unknown>): string | null {
  const devices = gpu.gpuDevice;
  if (!Array.isArray(devices) || devices.length === 0) return null;
  type Dev = Record<string, unknown>;
  const active = (devices as Dev[]).find((d) => d && d.active === true) ?? (devices as Dev[])[0];
  if (!active || typeof active !== 'object') return null;
  const cand =
    (typeof active.deviceString === 'string' && active.deviceString) ||
    (typeof active.deviceDescription === 'string' && active.deviceDescription) ||
    (typeof active.driverVersion === 'string' && active.driverVersion);
  return cand ? String(cand).trim().slice(0, 120) : null;
}

function pickVramBytesFromGpuInfoObject(gpu: Record<string, unknown>): number | undefined {
  const devices = gpu.gpuDevice;
  if (!Array.isArray(devices)) return undefined;
  let best: number | undefined;
  for (const raw of devices) {
    if (!raw || typeof raw !== 'object') continue;
    const d = raw as Record<string, unknown>;
    for (const [k, v] of Object.entries(d)) {
      if (typeof v !== 'number') continue;
      const kl = k.toLowerCase();
      if (
        !(
          kl.includes('memory') ||
          kl.includes('vram') ||
          kl.includes('video') ||
          kl.includes('dedicated') ||
          kl.includes('adapterram')
        )
      ) {
        continue;
      }
      let b = v;
      if (kl.includes('kb') || kl.includes('kilobyte')) b = v * 1024;
      if (b >= 256 * 1024 * 1024 && b <= 96 * 1024 * 1024 * 1024) {
        best = best == null ? Math.floor(b) : Math.max(best, Math.floor(b));
      }
    }
  }
  return best;
}

async function collectOnboardHardwareInfo(): Promise<OnboardHardwareInfo> {
  const totalMemoryBytes = os.totalmem();
  const cpuCores = Math.max(1, os.cpus()?.length ?? 1);
  let vramBytes: number | undefined;
  let gpuLabel: string | null = null;

  try {
    const gpu = await Promise.race([
      app.getGPUInfo('complete'),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('gpu-timeout')), 2800)),
    ]);
    if (gpu && typeof gpu === 'object') {
      const g = gpu as Record<string, unknown>;
      gpuLabel = pickGpuLabelFromInfo(g);
      vramBytes = pickVramBytesFromGpuInfoObject(g);
    }
  } catch {
    // Chromium may omit VRAM; fall through to OS probes
  }

  if (vramBytes == null) {
    const linux = tryReadLinuxDrmVramBytes();
    if (linux != null) vramBytes = linux;
  }
  if (vramBytes == null && process.platform === 'win32') {
    const w = await tryWindowsAdapterVramBytes();
    if (w != null) vramBytes = w;
  }

  return {
    totalMemoryBytes,
    platform: process.platform,
    cpuCores,
    vramBytes: vramBytes ?? null,
    gpuLabel,
  };
}

type OnboardRunBody =
  | {
      kind: 'ollama';
      ollamaModelId?: string;
      acceptRisk?: boolean;
    }
  | {
      kind: 'api';
      provider?: string;
      apiKey?: string;
      acceptRisk?: boolean;
    };

/**
 * If a marker file is missing, shows the onboarding window and blocks until skip or success.
 * Closing the window without finishing quits the app.
 */
export async function runFirstLaunchOnboardingIfNeeded(opts: {
  dataRoot: string;
  getAppRoot: () => string;
}): Promise<void> {
  const { dataRoot, getAppRoot } = opts;
  if (!needsOnboarding(dataRoot)) return;

  const paths = resolveDesktopPaths(dataRoot);
  ensureDataLayout(paths);
  const appRoot = getAppRoot();
  const { tokenForUrl } = ensureGatewayDesktopAuth(paths, appRoot);
  const marker = onboardingMarkerPath(dataRoot);

  const htmlPath = onboardHtmlPath();
  if (!fs.existsSync(htmlPath)) {
    console.error(`[onboard] Missing UI file: ${htmlPath}`);
    fs.writeFileSync(marker, `skipped-missing-ui:${new Date().toISOString()}\n`, 'utf8');
    return;
  }

  await new Promise<void>((resolve) => {
    let finished = false;
    let win: BrowserWindow | null = null;

    const cleanupIpc = () => {
      ipcMain.removeHandler('onboard:system-info');
      ipcMain.removeHandler('onboard:probe-ollama');
      ipcMain.removeHandler('onboard:skip');
      ipcMain.removeHandler('onboard:run');
      ipcMain.removeHandler('onboard:open-external');
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      cleanupIpc();
      resolve();
    };

    const safeCloseWindow = () => {
      if (win && !win.isDestroyed()) win.close();
    };

    ipcMain.handle('onboard:system-info', () => collectOnboardHardwareInfo());

    ipcMain.handle('onboard:probe-ollama', async () => ({
      ok: await probeOllamaReachable(),
    }));

    ipcMain.handle('onboard:open-external', async (_e, url: unknown) => {
      const s = typeof url === 'string' ? url.trim() : '';
      if (!isAllowedExternalHttpUrl(s)) {
        return { ok: false as const };
      }
      try {
        await shell.openExternal(s);
        return { ok: true as const };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return { ok: false as const, message: msg };
      }
    });

    ipcMain.handle('onboard:skip', async () => {
      try {
        fs.writeFileSync(marker, `${new Date().toISOString()}\n`, 'utf8');
        finish();
        safeCloseWindow();
        return { ok: true };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return { ok: false, message: msg };
      }
    });

    ipcMain.handle(
      'onboard:run',
      async (_e, body: OnboardRunBody): Promise<{ ok: boolean; message?: string }> => {
        try {
          if (!body?.acceptRisk) {
            return { ok: false, message: 'Cần xác nhận rủi ro.' };
          }

          if (body.kind === 'ollama') {
            const modelId = String(body.ollamaModelId || '').trim();
            if (!ALLOWED_OLLAMA_MODEL_IDS.has(modelId)) {
              return { ok: false, message: 'Model Ollama không hợp lệ.' };
            }
            if (!(await probeOllamaReachable())) {
              return {
                ok: false,
                message: formatOllamaOnboardFailureMessage(
                  'Ollama could not be reached at http://127.0.0.1:11434.',
                ),
              };
            }
            const result = await runOnboardCli({
              appRoot,
              paths,
              gatewayToken: tokenForUrl,
              kind: 'ollama',
              modelId,
            });
            if (!result.ok) {
              return { ok: false, message: formatOllamaOnboardFailureMessage(result.output) };
            }
            fs.writeFileSync(marker, `${new Date().toISOString()}\n`, 'utf8');
            finish();
            safeCloseWindow();
            return { ok: true };
          }

          if (body.kind === 'api') {
            const provider = String(body.provider || '').trim();
            const apiKey = String(body.apiKey || '').trim();
            if (!apiKey) {
              return { ok: false, message: 'Thiếu API key.' };
            }
            if (!['anthropic', 'gemini', 'openai'].includes(provider)) {
              return { ok: false, message: 'Nhà cung cấp không hợp lệ.' };
            }
            const result = await runOnboardCli({
              appRoot,
              paths,
              gatewayToken: tokenForUrl,
              kind: 'api',
              provider,
              apiKey,
            });
            if (!result.ok) {
              return { ok: false, message: result.output.trim() || 'Onboard thất bại.' };
            }
            fs.writeFileSync(marker, `${new Date().toISOString()}\n`, 'utf8');
            finish();
            safeCloseWindow();
            return { ok: true };
          }

          return { ok: false, message: 'Thiếu loại thiết lập.' };
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          return { ok: false, message: msg };
        }
      },
    );

    const windowIcon = resolveWindowIconPath();
    win = new BrowserWindow({
      width: 560,
      height: 820,
      resizable: true,
      minimizable: true,
      maximizable: false,
      fullscreenable: false,
      title: 'OpenClaw — Thiết lập lần đầu',
      show: false,
      ...(windowIcon ? { icon: windowIcon } : {}),
      webPreferences: {
        preload: preloadOnboardPath(),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    win.once('ready-to-show', () => win?.show());

    win.on('closed', () => {
      if (!finished) {
        finished = true;
        cleanupIpc();
        app.quit();
      }
    });

    wireOnboardExternalLinks(win.webContents);

    void win.loadFile(htmlPath);
  });
}
