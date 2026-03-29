# OpenClaw Gateway — tài liệu kho mã & Control UI

Tài liệu này mô tả **một** dịch vụ runtime: **OpenClaw Gateway** (lệnh `openclaw gateway run`), được triển khai chủ yếu trong `openclaw-src/gateway/`. Đây không phải nhiều “gateway” độc lập, mà **một gateway** gồm nhiều **mô-đun** (HTTP, WebSocket, RPC, Control UI tĩnh, v.v.).

---

## 1. Cấu trúc thư mục `openclaw-src/gateway`

| Khu vực | Đường dẫn | Vai trò tóm tắt |
|--------|-----------|------------------|
| **Giao thức** | `protocol/` | Định nghĩa `connect`, schema JSON (TypeBox/AJV), mã lỗi, kiểu dữ liệu RPC; `client-info` (id client như `openclaw-control-ui`). |
| | `protocol/schema/` | Schema frame: `ConnectParams`, snapshot, chat, v.v. |
| **Máy chủ lõi** | `server/` | Lắng nghe HTTP/WebSocket, TLS, auth HTTP, plugin HTTP, readiness, presence, đóng kết nối, v.v. |
| | `server/ws-connection/` | Bắt tay WebSocket, chính sách `connect`, xử lý tin nhắn, auth handshake. |
| **RPC** | `server-methods/` | Triển khai từng method gateway (`config.get`, `sessions.send`, …); có `AGENTS.md` ghi chú nội bộ. |
| **Mặt phẳng điều khiển** | *(file gốc)* `control-ui*.ts` | Phục vụ Control UI: route, CSP, bootstrap JSON, asset tĩnh. |
| **Phiên / chat / node** | *(file gốc)* `session-*.ts`, `sessions-*.ts`, `server-chat.ts`, `node-*.ts`, … | Session, transcript, node invoke/pairing, chat gateway. |
| **Kênh & công cụ** | *(file gốc)* `channel-*.ts`, `tools-invoke-http.ts`, … | Sức khỏe kênh, gọi tool qua HTTP, v.v. |
| **Auth & an toàn** | *(file gốc)* `auth*.ts`, `device-auth.ts`, `connection-auth.ts`, `origin-check.ts`, `control-plane-*.ts`, … | Token, device, rate limit, audit. |
| **Khởi động & cấu hình** | `boot.ts`, `server-startup*.ts`, `config-reload*.ts`, `startup-*.ts` | Boot process, reload config, origins Control UI. |
| **Client phía CLI** | `client.ts`, `call.ts`, `probe.ts`, … | Mã client dùng từ CLI / công cụ, kết nối tới cùng gateway. |
| **Sự kiện** | `events.ts` | Hằng số tên sự kiện (ví dụ cập nhật). |
| **Hợp đồng Control UI** | `control-ui-contract.ts` | Đường dẫn bootstrap: `/__openclaw/control-ui-config.json`. |

Còn **hàng trăm file** `.ts` ở gốc `gateway/` (helper, test harness, OpenAI HTTP, cron, wizard, …); bảng trên là **nhóm chức năng** chính, không liệt kê từng file.

**Điểm vào runtime (tham chiếu):** `server.ts`, `server.impl.ts`, `boot.ts`.

---

## 2. Phương thức WebSocket RPC (cơ sở)

Danh sách **cơ sở** được khai báo trong `openclaw-src/gateway/server-methods-list.ts` (`BASE_METHODS`). Các plugin kênh có thể **bổ sung** thêm tên method qua `listChannelPlugins()`.

**Cơ sở (trích `server-methods-list.ts`):**

- `health`, `doctor.memory.status`, `logs.tail`
- `channels.status`, `channels.logout`, `status`
- `usage.status`, `usage.cost`
- `tts.status`, `tts.providers`, `tts.enable`, `tts.disable`, `tts.convert`, `tts.setProvider`
- `config.get`, `config.set`, `config.apply`, `config.patch`, `config.schema`, `config.schema.lookup`
- `exec.approvals.*`, `exec.approval.*`
- `wizard.*`, `talk.*`
- `models.list`, `tools.catalog`
- `agents.*`, `skills.*`, `update.run`, `voicewake.*`
- `secrets.reload`, `secrets.resolve`
- `sessions.*` (list, subscribe, messages, preview, create, send, abort, patch, reset, delete, compact, …)
- `last-heartbeat`, `set-heartbeats`, `wake`
- `node.pair.*`, `node.list`, `node.describe`, `node.pending.*`, `node.invoke*`, `node.event`, `node.canvas.capability.refresh`
- `device.pair.*`, `device.token.rotate`, `device.token.revoke`, `node.rename`
- `cron.*`
- `gateway.identity.get`, `system-presence`, `system-event`, `send`, `agent`, `agent.identity.get`, `agent.wait`, `browser.request`
- WebChat: `chat.history`, `chat.abort`, `chat.send`

Hàm `listGatewayMethods()` trả về **hợp nhất** `BASE_METHODS` + method từ plugin kênh.

---

## 3. Sự kiện WebSocket (từ `GATEWAY_EVENTS`)

`openclaw-src/gateway/server-methods-list.ts` export `GATEWAY_EVENTS`, gồm các tên như:

`connect.challenge`, `agent`, `chat`, `session.message`, `session.tool`, `sessions.changed`, `presence`, `tick`, `talk.mode`, `shutdown`, `health`, `heartbeat`, `cron`, `node.pair.requested`, `node.pair.resolved`, `node.invoke.request`, `device.pair.requested`, `device.pair.resolved`, `voicewake.changed`, `exec.approval.requested`, `exec.approval.resolved`, và sự kiện cập nhật (hằng `GATEWAY_EVENT_UPDATE_AVAILABLE` từ `events.ts`).

---

## 4. Control UI — mô-đun `@openclaw/gateway/*` được import

Control UI resolve `@openclaw` → `openclaw-src` qua `control-ui/vite.config.ts` (`alias: { "@openclaw": openclawSrc }`).

Chỉ các import **trực tiếp** dưới namespace **`@openclaw/gateway/`** (không tính `@openclaw/agents`, `@openclaw/shared`, …):

| Module import | File Control UI dùng |
|---------------|----------------------|
| `@openclaw/gateway/device-auth.js` | `src/ui/gateway.ts` |
| `@openclaw/gateway/protocol/client-info.js` | `src/ui/gateway.ts` |
| `@openclaw/gateway/protocol/connect-error-details.js` | `src/ui/gateway.ts`, `connect-error.ts`, `views/overview-hints.ts`, `views/overview.node.test.ts`, `app-gateway.node.test.ts` |
| `@openclaw/gateway/events.js` | `src/ui/app-gateway.ts`, `app-gateway.node.test.ts` |
| `@openclaw/gateway/protocol/schema/types.js` | `src/ui/types.ts` (kiểu tool catalog) |
| `@openclaw/gateway/control-ui-contract.js` | `src/ui/controllers/control-ui-bootstrap.ts`, `control-ui-bootstrap.test.ts` |

**Lưu ý:** Control UI còn import nhiều package **`@openclaw/...`** khác (infra, shared, agents, routing, sessions, cron, …) — chúng **không** nằm trong thư mục `gateway/` nhưng vẫn là mã nguồn OpenClaw dùng chung.

---

## 5. Kết nối runtime

- **Gateway:** process chạy HTTP + WebSocket (cổng cấu hình trong config gateway, ví dụ `18789`).
- **Control UI (Electron hoặc trình duyệt):** mở UI tĩnh; **WebSocket client** trong `control-ui/src/ui/gateway.ts` gọi method `connect` với `client.id` hợp lệ (chuẩn schema: `openclaw-control-ui` cho Control UI), sau đó dùng các RPC như `config.get`, `sessions.send`, …

---

*Tài liệu sinh từ trạng thái repo tại thời điểm tạo file; khi thêm method/sự kiện mới, cập nhật `server-methods-list.ts` và import Control UI tương ứng.*
