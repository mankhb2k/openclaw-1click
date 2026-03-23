import { contextBridge, ipcRenderer } from 'electron';

export type OnboardSystemInfo = {
  totalMemoryBytes: number;
  platform: NodeJS.Platform;
  cpuCores: number;
  /** Bytes of dedicated VRAM when detected; `null` if unknown */
  vramBytes: number | null;
  gpuLabel: string | null;
};

export type OnboardRunPayload =
  | {
      kind: 'ollama';
      ollamaModelId: string;
      acceptRisk: boolean;
    }
  | {
      kind: 'api';
      provider: 'anthropic' | 'gemini' | 'openai';
      apiKey: string;
      acceptRisk: boolean;
    };

contextBridge.exposeInMainWorld('openclawDesktopOnboard', {
  getSystemInfo: (): Promise<OnboardSystemInfo> => ipcRenderer.invoke('onboard:system-info'),
  probeOllama: (): Promise<{ ok: boolean }> => ipcRenderer.invoke('onboard:probe-ollama'),
  openExternal: (url: string): Promise<{ ok: boolean; message?: string }> =>
    ipcRenderer.invoke('onboard:open-external', url),
  skip: (): Promise<{ ok: boolean; message?: string }> => ipcRenderer.invoke('onboard:skip'),
  run: (payload: OnboardRunPayload): Promise<{ ok: boolean; message?: string }> =>
    ipcRenderer.invoke('onboard:run', payload),
});
