/**
 * First-launch onboarding: local BrowserWindow + non-interactive `openclaw onboard`.
 */
import { BrowserWindow, ipcMain, app } from 'electron';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawn } from 'child_process';
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

const ALLOWED_OLLAMA_MODEL_IDS = new Set(['deepseek-r1:1.5b', 'deepseek-r1:8b']);

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
    ...buildOpenClawEnv(paths, tokenEnv),
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

    ipcMain.handle('onboard:system-info', async () => ({
      totalMemoryBytes: os.totalmem(),
      platform: process.platform,
    }));

    ipcMain.handle('onboard:probe-ollama', async () => ({
      ok: await probeOllamaReachable(),
    }));

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

    win = new BrowserWindow({
      width: 560,
      height: 740,
      resizable: true,
      minimizable: true,
      maximizable: false,
      fullscreenable: false,
      title: 'OpenClaw — Thiết lập lần đầu',
      show: false,
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

    void win.loadFile(htmlPath);
  });
}
