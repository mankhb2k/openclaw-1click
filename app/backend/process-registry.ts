import type { ChildProcess } from 'child_process';

/** Child processes started by the backend launcher (dashboard + OpenClaw gateway). */
const registered: ChildProcess[] = [];

export function registerChildProcess(child: ChildProcess): void {
  registered.push(child);
}

export function shutdownChildren(): void {
  for (const child of registered) {
    if (child.exitCode === null && !child.signalCode) {
      try {
        child.kill();
      } catch {
        /* ignore */
      }
    }
  }
  registered.length = 0;
}
