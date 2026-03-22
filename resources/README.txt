OpenClaw Desktop — bundled templates (read-only in the installer)

Your live workspace, OpenClaw state, and logs are stored under the app user data folder
(Windows: %APPDATA%\OpenClaw Desktop\), not next to this file.

Subfolders there (relative to that root):
  workspace/  — agent workspace (MEMORY.md, skills, projects, …)
  openclaw/   — OPENCLAW_DIR (agents, cron, config)
  logs/       — launcher and service logs

Troubleshooting (dev):
- OpenClaw gateway needs Node.js 22.12+. Electron 34 ships Node 20 — close the app, run "npm install"
  so Electron 35 is installed, or set env OPENCLAW_GATEWAY_NODE to a full path to node.exe 22+.
- If "npm install" fails with EBUSY, quit every OpenClaw Desktop / Electron window first.
- DevTools: set OPENCLAW_DESKTOP_DEVTOOLS=1 to auto-open on launch, or press F12 / Ctrl+Shift+I (Cmd+Shift+I on macOS)
  when the main window is focused. (Electron logs harmless "Autofill.enable" DevTools warnings if DevTools is open.)
- Blank / black window: run `npm run control-ui:build`, then `npm run dev`. Check the terminal for `[main] Control UI failed to load`
  or `[control-ui]` errors. On some Windows GPUs try: set OPENCLAW_DESKTOP_DISABLE_GPU=1 then `npm run dev`.

Customizing the Control UI (advanced):
- Copy node_modules/openclaw/dist/control-ui to a folder under your data root (or ship a baseline in resources).
- In openclaw/openclaw.json set gateway.controlUi.root to the absolute path of that folder.
- After upgrading the "openclaw" npm package, re-merge your changes into the copied assets if needed.
