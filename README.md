# OpenClaw Desktop

Electron desktop shell for the **[openclaw](https://www.npmjs.com/package/openclaw)** gateway and Control UI. It starts the **OpenClaw gateway** locally, serves the **Control UI** (dashboard), and wraps the experience in a native Windows window.

---

## Features

| Area | Description |
|------|-------------|
| **Bundled gateway** | The main process spawns a launcher (`app/backend/start.ts`) that runs `openclaw gateway` from the app’s `node_modules`, using `ELECTRON_RUN_AS_NODE` where appropriate. |
| **Control UI** | The official web UI is built from `control-ui/` (Vite + Lit) into `dist/control-ui/` and loaded in a `BrowserWindow`. The gateway serves it and handles WebSocket RPC. |
| **First-run onboarding** | Optional guided setup (`app/main/onboard.ts`) before the main window opens. |
| **Desktop updates (Windows NSIS)** | Packaged **NSIS** builds use `electron-updater` + GitHub Releases (see `electron-builder.yml` `publish`). **Portable** builds do not use auto-update. **Dev** (`!app.isPackaged`) uses the normal npm/OpenClaw update flow, not the NSIS updater. |
| **Data layout** | Per-user data (config, workspace, logs) lives under a dedicated **data root** (packaged: `app.getPath('userData')`; dev: `.openclaw-desktop-data` under the repo). |
| **Security-oriented defaults** | External links open in the system browser; Control UI origin checks are enforced by the gateway. |

---

## Requirements

- **Windows** (primary target for installers in this repo; Electron and `electron-builder` configs are Windows-focused).
- **Node.js** (for development and for building the app).
- A compatible **`openclaw`** npm dependency (see `package.json`; `npm run align:openclaw` can align the semver range with the lockfile).

---

## Repository layout

```
openclaw-app/
├── app/
│   ├── main/              # Electron main process (window, menu, IPC, desktop updater)
│   ├── backend/           # Gateway launcher (spawn openclaw, ports, paths, Control UI URL)
│   └── shared/            # Shared path/helpers for main + backend
├── control-ui/            # Control UI source (Vite); output → ../dist/control-ui/
├── openclaw-src/          # Vendored / linked OpenClaw source (resolved as @openclaw in control-ui)
├── dist/                  # Build output (main, backend, control-ui) — produced by scripts
├── release/               # electron-builder output (installer, portable exe)
├── resources/             # Extra files packaged under resources/
├── scripts/               # postinstall patches, copy-renderer, sync-control-ui, etc.
├── electron-builder.yml   # Windows NSIS + portable targets, publish, asarUnpack rules
├── package.json           # Root desktop app metadata and npm scripts
└── docs/                  # Additional documentation (e.g. gateway inventory)
```

---

## For developers

### Install

```bash
npm install
npm run control-ui:install   # first time, for control-ui dependencies
```

### Build TypeScript (main + backend)

```bash
npm run build:ts
```

### Build Control UI

```bash
npm run control-ui:build
```

### Run in development

```bash
npm run dev
```

Uses the local gateway + bundled Control UI build. For iterative UI work you can use `npm run control-ui:dev` (Vite dev server) in another terminal if your workflow expects it; the Electron app normally loads the built `dist/control-ui` via the gateway.

### Watch mode

```bash
npm run dev:watch
```

### Production installers (Windows)

```bash
npm run dist:installer   # NSIS installer (auto-update capable when publish is configured)
npm run dist:portable    # Portable .exe (no NSIS auto-update)
npm run dist             # Default electron-builder targets from electron-builder.yml
```

Artifacts land under `release/`. Code signing uses `CSC_LINK` / `CSC_KEY_PASSWORD` when set.

### Useful scripts

| Script | Purpose |
|--------|---------|
| `npm run update:openclaw` | Update the `openclaw` dependency in this repo |
| `npm run align:openclaw` | Align openclaw version with the lockfile helper |
| `npm run control-ui:vendor` | Sync vendor control-ui (see `scripts/sync-control-ui.cjs`) |

### Environment variables (selected)

| Variable | Role |
|----------|------|
| `OPENCLAW_DESKTOP_DATA_ROOT` | Override absolute data root |
| `OPENCLAW_DESKTOP_CONTROL_UI_ROOT` | Custom Control UI static root (must contain `index.html`) |
| `OPENCLAW_DESKTOP_SKIP_CUSTOM_CONTROL_UI` | `1` / `true` to force bundled Control UI only |
| `OPENCLAW_GATEWAY_NODE` | Optional path to Node 22+ for gateway only |
| `OPENCLAW_SKIP_WINDOWS_UPDATE_SIGNATURE` | `1` skips Windows update signature verify (unsigned NSIS only; security trade-off) |

---

## For end users

1. **Install** the NSIS installer or use the portable executable from your distribution channel (e.g. GitHub Releases).
2. **First launch** may run onboarding; then the main window opens to the **Dashboard** (Control UI).
3. **Connect to the gateway** using the WebSocket URL and token (or password) as shown in the app or in the OpenClaw docs — typically the gateway is already started by the desktop app on `127.0.0.1` on the configured port (often `18789` unless changed in config).
4. **Updates (NSIS build)** — when an update is available, follow the in-app banner; after download, restart to install when prompted.

If **connection fails** with `invalid connect params` / `client.id`, ensure the **desktop app and the `openclaw` gateway package** are compatible (same era of protocol). Updating the app or running `npm update openclaw` on the machine that runs the gateway may be required.

---

## License

Apache License 2.0. See [`LICENSE`](LICENSE) for the full text and [`NOTICE`](NOTICE) for copyright and attribution.

---

## Related docs

- [`docs/gateway-inventory.md`](docs/gateway-inventory.md) — OpenClaw gateway modules and Control UI `@openclaw/gateway/*` imports.
