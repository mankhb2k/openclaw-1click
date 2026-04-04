# OpenClaw Gateway — Quy tắc cho Agent

Tài liệu này tổng hợp các pattern đúng khi làm việc với OpenClaw Gateway trong dự án `openclaw-desktop`. Mục tiêu: giúp agent tránh lỗi cấu hình, kết nối và encoding.

---

## Nhóm 1: Gateway Connection — Spawn Process

### Cách spawn đúng

Gateway được spawn trong `app/backend/start.ts` bởi backend launcher (chính nó được spawn bởi Electron với `ELECTRON_RUN_AS_NODE=1`).

```typescript
spawn(
  gatewayRunner,                   // Electron exe (ELECTRON_RUN_AS_NODE=1) hoặc Node 22+
  [cliScript, 'gateway', 'run', '--port', String(gatewayPort), '--allow-unconfigured'],
  {
    cwd: gatewayCwd,
    env: gatewayEnv,               // bắt buộc gồm các biến OPENCLAW_* bên dưới
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  }
)
```

### Biến môi trường bắt buộc (buildOpenClawEnv)

| Biến | Mục đích |
|------|----------|
| `OPENCLAW_DIR` | Thư mục state gateway (`<dataRoot>/openclaw/`) |
| `OPENCLAW_STATE_DIR` | Alias của `OPENCLAW_DIR` |
| `OPENCLAW_CONFIG` | Đường dẫn file config JSON |
| `OPENCLAW_CONFIG_PATH` | Alias của `OPENCLAW_CONFIG` |
| `OPENCLAW_WORKSPACE` | Thư mục workspace agent |
| `WORKSPACE_DIR` | Alias của `OPENCLAW_WORKSPACE` |
| `OPENCLAW_GATEWAY_TOKEN` | Token auth (nếu mode=token) |
| `ELECTRON_RUN_AS_NODE` | `"1"` khi dùng Electron làm Node runner |

> **ĐỪNG** truyền `--config` qua CLI arg. Config path phải qua env `OPENCLAW_CONFIG`.

### Port allocation

- Port mặc định: **18789**, fallback đến +40
- Sau spawn: dùng `waitForTcpPort('127.0.0.1', port, 120_000)` để chờ gateway ready
- Gateway write `launcher-ready.json` khi đã sẵn sàng

### Khi gateway restart (code 1012)

Gateway gửi close code **1012** khi config thay đổi (sau `config.apply`). Client phải tự reconnect — không hiển thị như lỗi.

```typescript
if (code !== 1012) {
  host.lastError = error?.message ?? `disconnected (${code})`;
} else {
  host.lastError = null; // restart mong đợi, không phải lỗi
}
```

---

## Nhóm 2: WebSocket Auth — Connect Frame Format

### Flow kết nối đúng

```
Client opens WebSocket
  → Gateway gửi event: connect.challenge { nonce: "..." }
  → Client gọi RPC: connect(params) với nonce đã ký
  → Gateway trả res: { ok: true, payload: GatewayHelloOk }
  → Client lưu deviceToken từ hello.auth.deviceToken
```

**KHÔNG** gọi `connect` trước khi nhận `connect.challenge`. Nonce bắt buộc cho device identity signing.

### Connect params chuẩn

```typescript
// Dùng constants — KHÔNG dùng string literal
import {
  GATEWAY_CLIENT_CAPS,
  GATEWAY_CLIENT_MODES,
  GATEWAY_CLIENT_NAMES,
} from "@openclaw/gateway/protocol/client-info.js";

const params = {
  minProtocol: 3,
  maxProtocol: 3,
  client: {
    id: GATEWAY_CLIENT_NAMES.CONTROL_UI,  // "openclaw-control-ui"
    version: clientVersion,
    platform: navigator.platform ?? "web",
    mode: GATEWAY_CLIENT_MODES.WEBCHAT,   // "webchat"
    instanceId: instanceId,
  },
  role: "operator",
  scopes: ["operator.admin", "operator.approvals", "operator.pairing"],
  device: { id, publicKey, signature, signedAt, nonce }, // chỉ khi isSecureContext
  caps: [GATEWAY_CLIENT_CAPS.TOOL_EVENTS],               // "tool-events"
  auth: { token, deviceToken, password },
  userAgent: navigator.userAgent,
  locale: navigator.language,
};
```

> **SAI:** `clientName: "openclaw-control-ui"` (literal string)
> **ĐÚNG:** `clientName: GATEWAY_CLIENT_NAMES.CONTROL_UI` (constant từ SDK)

### Token — nguồn và thứ tự ưu tiên

| Ưu tiên | Nguồn | Ghi chú |
|---------|-------|---------|
| 1 | Device identity + Ed25519 signature | Chỉ trong secure context (localhost/HTTPS) |
| 2 | URL hash `#token=<value>` | Electron truyền vào URL, stripped sau khi đọc |
| 3 | Device auth token cached | localStorage `openclaw.device.auth.v1` |
| 4 | Password | Fallback cuối cùng |

**Token phải lấy từ URL hash `#token=...`** (không phải query param `?token=`). Fragment tránh server-side logging.

```typescript
// app-settings.ts — đọc token đúng cách
const hashParams = new URLSearchParams(url.hash.slice(1));
const tokenRaw = hashParams.get("token") ?? params.get("token");
// → Xóa token khỏi URL sau khi đọc (replaceState)
```

**Token KHÔNG lưu vào localStorage** — chỉ sessionStorage (scoped theo gateway URL).

### Device Token Retry

- Chỉ retry **1 lần** (`deviceTokenRetryBudgetUsed`)
- Chỉ retry với endpoint **trusted** (loopback hoặc same-origin)
- Không retry nếu lỗi `AUTH_TOKEN_MISSING`, `AUTH_PASSWORD_MISMATCH`, `PAIRING_REQUIRED`, `DEVICE_IDENTITY_REQUIRED`

### Frame format (request/response/event)

```typescript
// Request
{ type: "req", id: "<uuid>", method: "config.get", params: {} }

// Response (ok)
{ type: "res", id: "<uuid>", ok: true, payload: {...} }

// Response (error)
{ type: "res", id: "<uuid>", ok: false, error: { code: "...", message: "...", details: {...} } }

// Event
{ type: "event", event: "chat", payload: {...}, seq: 42 }
```

Timeout mặc định: **30 giây** (`DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS`).

---

## Nhóm 3: Config File — Validate, CLI, Hot Reload

### RPC methods config

| Method | Mục đích | Restart gateway? |
|--------|----------|-----------------|
| `config.get` | Lấy config hiện tại + hash | Không |
| `config.set` | Lưu config (không reload ngay) | Không |
| `config.apply` | Lưu + reload gateway | **Có** (code 1012) |
| `config.schema` | Lấy JSON schema để validate form | Không |
| `config.schema.lookup` | Tìm schema theo path | Không |
| `config.patch` | Patch một phần config | Không |

### baseHash — bắt buộc cho mọi lần ghi

**Mọi request** `config.set` và `config.apply` phải kèm `baseHash` (lấy từ `config.get` response). Thiếu hash → từ chối ghi (optimistic concurrency).

```typescript
const baseHash = state.configSnapshot?.hash;
if (!baseHash) {
  state.lastError = "Config hash missing; reload and retry.";
  return;
}
await client.request("config.set", { raw, baseHash });
```

### Coerce types trước khi submit

HTML `<input>` luôn trả `string`. Dùng `coerceFormValues(form, schema)` trước khi gửi lên gateway để tránh lỗi validation type mismatch:

```typescript
const form = schema ? coerceFormValues(state.configForm, schema) : state.configForm;
const raw = serializeConfigForm(form);
await client.request("config.set", { raw, baseHash });
```

### Hot reload flow

```
user nhấn Apply
  → config.apply { raw, baseHash, sessionKey }
  → gateway lưu + restart
  → WebSocket close code 1012
  → Client auto-reconnect
  → Sau khi connected: loadConfig() để lấy state mới
```

### config.openFile — không phải BASE_METHOD

`config.openFile` không có trong `BASE_METHODS` của gateway. Xử lý fallback:

```typescript
try {
  await client.request("config.openFile", {});
} catch {
  // fallback: copy path to clipboard
  await navigator.clipboard.writeText(state.configSnapshot?.path ?? "");
}
```

---

## Nhóm 4: Encoding Tiếng Việt

### Quy tắc encoding

1. **Tất cả file `.ts` phải UTF-8** (không BOM). Đây là mặc định của TypeScript/Vite.
2. **File I/O trong Node.js** luôn chỉ định `'utf8'` encoding:
   ```typescript
   fs.writeFileSync(path, content, 'utf8');  // ✓
   fs.appendFileSync(path, line, 'utf8');    // ✓
   ```
3. **JSON write** dùng `writeJsonAtomic()` đã có `'utf8'` — không cần thêm.

### i18n — KHÔNG hardcode chuỗi Vietnamese trong code logic

```typescript
// SAI — hardcode Vietnamese, không dịch được cho user ngôn ngữ khác
state.lastError = "Cập nhật thất bại: gateway không trả về dữ liệu.";

// ĐÚNG — dùng hệ thống i18n
import { t } from "../../i18n/index";
state.lastError = t("config.update.failedNoData");
```

Locale mặc định: **Vietnamese (`vi`)**, fallback: **English (`en`)**. Default này nằm trong `i18n/lib/registry.ts`.

### Strings trong Electron main (ngoại lệ hợp lý)

Electron main process (`app/main/main.ts`) không có access vào hệ thống i18n của Control UI. Các string hardcode Vietnamese trong main.ts là chấp nhận được cho OS-level dialogs:
- `"Auto-update chỉ hỗ trợ bản cài NSIS, không hỗ trợ bản portable."`
- `"Đang cài đặt bản mới và khởi động lại ứng dụng."`

### Key mismatch phát hiện được

Locale file `vi.ts` (4045 dòng) là reference đầy đủ nhất. Các locale khác (`en`, `zh-CN`, `de`, `es`, `pt-BR`) ít keys hơn. Khi thêm key mới:
1. Thêm vào `vi.ts` trước
2. Thêm vào `en.ts` (fallback locale)
3. Các locale khác optional (sẽ fallback về `en`)

---

## Nhóm 5: Kiến trúc Codebase — Ranh giới sửa đổi

### Nguyên tắc cốt lõi: KHÔNG bao giờ sửa node_modules

> **TUYỆT ĐỐI KHÔNG** sửa bất kỳ file nào trong `node_modules/`, kể cả `node_modules/openclaw/`.

**Lý do:**
- `npm install` hoặc `npm update` sẽ **ghi đè toàn bộ** thay đổi, không có cảnh báo
- Không thể commit vào git (thường bị `.gitignore`)
- Tạo ra trạng thái không nhất quán giữa các máy developer
- Gây khó debug vì trông giống code gốc nhưng thực ra đã bị vá tay

**Ngoại lệ duy nhất chấp nhận được:** `patch-package` tạo patch file được commit — nhưng dự án này KHÔNG dùng `patch-package`.

---

### Hiểu đúng: gateway chạy từ đâu?

```
node_modules/openclaw/openclaw.mjs   ← Gateway thực tế đang chạy (npm package đã build)
openclaw-src/                        ← Source để publish lên npm, KHÔNG compile local
app/**/*.ts                          ← Electron shell code, được compile bởi build:ts
control-ui/src/                      ← Control UI (Lit + Vite), được build bởi control-ui:build
```

**`build:ts` KHÔNG compile `openclaw-src/`** — chỉ compile `app/**/*.ts`.

Vì vậy:
- Sửa `openclaw-src/plugins/*.ts` → **vô hiệu** với gateway đang chạy
- Sửa `node_modules/openclaw/dist/**/*.js` → **rủi ro cao**, bị ghi đè khi update
- Sửa `control-ui/src/**` + build → **đúng**, deploy ngay vào `vendor/control-ui/`

---

### Quy tắc chọn layer để sửa

| Loại vấn đề | Layer đúng để sửa | KHÔNG sửa ở |
|-------------|-------------------|-------------|
| UI hiển thị sai (model list, label, filter) | `control-ui/src/` | node_modules, openclaw-src |
| Logic xử lý event/RPC trong UI | `control-ui/src/` | node_modules, openclaw-src |
| Config Electron (spawn, env, paths) | `app/` | node_modules |
| Gateway behavior (API logic, provider) | Mở issue upstream / chờ version mới | **KHÔNG** sửa node_modules |

---

### Case study: Filter model dropdown Google

**Vấn đề:** Google API trả 404 cho một số model cũ (ví dụ: `gemini-1.5-flash`). Dropdown UI vẫn hiển thị các model không còn tồn tại.

**Cách sai đã thử:**
```
✗ Sửa openclaw-src/plugins/provider-catalog-metadata.ts
  → Vô hiệu: gateway không đọc file này
✗ Sửa node_modules/openclaw/dist/extensions/google/index.js
  → Rủi ro: bị ghi đè khi npm update
```

**Cách đúng:**
```
✓ Sửa control-ui/src/ui/views/agents-utils.ts
  → filterCatalogByProviders() chạy client-side
  → Lọc model trước khi render dropdown
  → Không cần thay đổi gateway
```

```typescript
// agents-utils.ts — pattern đúng để filter model khỏi dropdown
const HIDDEN_GOOGLE_MODEL_IDS = new Set<string>([
  "gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro",
  // ... các model đã bị Google xóa
]);

function filterDeprecatedModels(catalog: ModelCatalogEntry[]): ModelCatalogEntry[] {
  return catalog.filter((entry) => {
    if (entry.provider !== "google") return true;
    if (HIDDEN_GOOGLE_MODEL_IDS.has(entry.id)) return false;
    if (entry.id.startsWith("gemini-live-")) return false;
    return true;
  });
}

export function filterCatalogByProviders(catalog, configuredProviders) {
  const active = filterDeprecatedModels(catalog); // ← lọc deprecated trước
  if (!configuredProviders) return active;
  return active.filter((entry) => configuredProviders.has(entry.provider));
}
```

> **Nguyên tắc:** Control UI nhận catalog từ `models.list` RPC và có toàn quyền quyết định *hiển thị* cái gì. Đây là điểm duy nhất cần thay đổi cho mọi vấn đề liên quan đến model display.

---

### Pipeline build Control UI

Khi sửa `control-ui/src/`, phải build và deploy để thấy thay đổi:

```bash
npm run control-ui:build    # Vite build → control-ui/dist/
npm run control-ui:vendor   # Copy dist/ → vendor/control-ui/ (gateway serve từ đây)
```

Gateway serve Control UI từ `vendor/control-ui/` (cấu hình trong `openclaw.json` tại `gateway.controlUi.root`). Không cần restart gateway sau khi cập nhật static files.

---

## Tổng hợp: Lỗi thường gặp & cách tránh

| Lỗi | Nguyên nhân | Cách tránh |
|-----|-------------|------------|
| Gateway không start | Thiếu `OPENCLAW_CONFIG` env | Dùng `buildOpenClawEnv()` |
| Auth fail ngay lần đầu | Gọi `connect` trước `connect.challenge` | Chờ event challenge rồi mới gọi |
| Token không load | Đọc từ `?token=` thay vì `#token=` | Ưu tiên hashParams trước params |
| Validation lỗi type | Form gửi string thay vì number/bool | Dùng `coerceFormValues(form, schema)` |
| Config save fail | Thiếu `baseHash` | Luôn lấy hash từ `config.get` trước |
| UI không reload sau apply | Không xử lý close code 1012 | Reconnect sau 1012 là expected behavior |
| Vietnamese bị vỡ | Hardcode bypass i18n | Dùng `t("key")` cho mọi user-visible string |
| Literal `"openclaw-control-ui"` | Không dùng constant | Import `GATEWAY_CLIENT_NAMES.CONTROL_UI` |
| Literal `"tool-events"` | Không dùng constant | Import `GATEWAY_CLIENT_CAPS.TOOL_EVENTS` |
| Literal `"webchat"` | Không dùng constant | Import `GATEWAY_CLIENT_MODES.WEBCHAT` |
| Sửa `openclaw-src/*.ts` để fix UI | Nhầm layer — file không được compile | Sửa `control-ui/src/` + rebuild |
| Sửa `node_modules/openclaw/**` | Nghĩ là "nhanh nhất" | Không bao giờ sửa node_modules |
| Model cũ vẫn hiện trong dropdown | Chưa filter deprecated models | Thêm vào `HIDDEN_GOOGLE_MODEL_IDS` trong `agents-utils.ts` |
| Model 404 khi call API | Default model trong config là model đã bị xóa | Cập nhật `agents.defaults.model.primary` trong `openclaw.json` |

---

## References

- Gateway spawn: `app/backend/start.ts`
- Config management: `app/backend/config.ts`
- WebSocket client: `control-ui/src/ui/gateway.ts`
- Auth connect logic: `control-ui/src/ui/app-gateway.ts`
- Token từ URL: `control-ui/src/ui/app-settings.ts` → `applySettingsFromUrl()`
- Storage/token scope: `control-ui/src/ui/storage.ts`
- i18n system: `control-ui/src/i18n/lib/`
- Gateway constants: `openclaw-src/gateway/protocol/client-info.ts`
- Gateway events: `openclaw-src/gateway/server-methods-list.ts`
- Docs kho mã: `docs/gateway-inventory.md`
- Model catalog filter: `control-ui/src/ui/views/agents-utils.ts` → `filterCatalogByProviders()`
- Model switching + auto-save: `control-ui/src/ui/app-render.helpers.ts` → `switchChatModel()`
- Gateway binary (chạy thực tế): `node_modules/openclaw/openclaw.mjs` — chỉ đọc, không sửa
