import { contextBridge, ipcRenderer } from 'electron';

export type RunUpdateOpenclawResult =
  | { ok: true }
  | { ok: false; error?: string; stderrTail?: string };

contextBridge.exposeInMainWorld('openclawDesktop', {
  runUpdateOpenclaw: (): Promise<RunUpdateOpenclawResult> =>
    ipcRenderer.invoke('desktop:run-update-openclaw'),
});
