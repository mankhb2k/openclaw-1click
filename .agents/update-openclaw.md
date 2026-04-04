# Hướng dẫn cập nhật OpenClaw

> **Dành cho agent:** Đọc toàn bộ file này trước khi bắt đầu. Thực hiện từng bước theo thứ tự. Mỗi bước có lệnh cụ thể và cách kiểm tra kết quả.

---

## Kiến trúc cần nắm

```
openclaw-version.pin                 ← version cần đồng bộ (source of truth)
package.json                         ← "openclaw": "<version>" phải khớp pin
node_modules/openclaw/dist/          ← binary gateway cần được patch sau install
patches/openclaw+<VER>.patch         ← ghi lại patch đã áp, đặt tên theo version
scripts/apply-openclaw-desktop-update.mjs   ← script patch binary (chạy qua postinstall)
scripts/align-openclaw-version.mjs   ← đồng bộ npm với pin file
openclaw-src/                        ← source tham chiếu, @openclaw/* alias trong control-ui
control-ui/                          ← UI source (Vite + Lit)
vendor/control-ui/                   ← UI đã build, dùng khi đóng gói
```

**Hai patch cần áp sau mỗi lần cập nhật:**

| Patch | Mục đích | Script xử lý |
|-------|----------|--------------|
| `desktopAppRoot` block vào `runGatewayUpdate` | Khi user bấm Update trong app, gateway cũng update desktop package | `patchUpdateRunnerFiles()` trong `apply-openclaw-desktop-update.mjs` |
| `windowsHide: true` vào spawn/execFile | Không flash cửa sổ console đen trên Windows | `patchExecChunks()` — từ 2026.4.2 upstream đã tích hợp native, không cần patch nữa |

---

## Quy trình cập nhật (thực hiện theo thứ tự)

### Bước 1 — Xác định version mới

```bash
# Version hiện tại đang dùng
cat openclaw-version.pin

# Version mới nhất trên npm
npm show openclaw version

# Xem tất cả version gần đây
npm show openclaw versions --json | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); console.log(JSON.parse(d).slice(-5).join('\n'))"
```

Ghi nhớ NEW_VERSION (ví dụ: `2026.4.2`) để dùng trong các bước sau.

---

### Bước 2 — Cập nhật version pin

```bash
# Thay 2026.X.X bằng version thực tế
echo "2026.X.X" > openclaw-version.pin
```

---

### Bước 3 — Cài npm package và áp patch binary

```bash
# Script này: đọc pin → install nếu lệch → postinstall tự chạy apply-openclaw-desktop-update.mjs
npm run align:openclaw
```

**Kiểm tra sau bước này:**

```bash
# 1. Version đã cài đúng chưa
node -e "console.log(require('./node_modules/openclaw/package.json').version)"
# Phải in ra: 2026.X.X

# 2. Patch gateway đã áp chưa (tìm MARKER trong dist)
node -e "
const fs = require('fs');
const dist = './node_modules/openclaw/dist';
const MARKER = 'desktop app root update';
const found = fs.readdirSync(dist).filter(f => {
  if (!f.endsWith('.js')) return false;
  return fs.readFileSync(dist+'/'+f,'utf8').includes(MARKER);
});
console.log('MARKER found in:', found.length ? found : 'NONE — patch FAILED');
"
```

Nếu MARKER không tìm thấy → chạy thủ công:

```bash
node scripts/apply-openclaw-desktop-update.mjs
# Phải in: [apply-openclaw-desktop-update] patched node_modules/openclaw/dist/<TÊN FILE>
```

Nếu script không in gì (không có file nào khớp) → xem **Mục: Xử lý sự cố patch** bên dưới.

---

### Bước 4 — Cập nhật patch file

Patch file đặt tên theo version và lưu lại để tham chiếu. Sau khi patch thành công:

```bash
# 4a. Xóa patch file của version cũ
rm patches/openclaw+<VERSION_CU>.patch

# 4b. Tạo patch file cho version mới bằng script sau
node -e "
const fs = require('fs');
const path = require('path');

const dist = 'node_modules/openclaw/dist';
const ver = fs.readFileSync('openclaw-version.pin','utf8').trim().split('\n').find(l=>l&&!l.startsWith('#'));
const patchFile = 'patches/openclaw+' + ver + '.patch';

const MARKER = 'desktop app root update';
const BLOCK_START = '\tconst desktopAppRoot = process.env.OPENCLAW_DESKTOP_APP_ROOT?.trim();';
const NEEDLE = '\treturn {\n\t\tstatus: \"skipped\",\n\t\tmode: \"unknown\",\n\t\troot: pkgRoot,\n\t\treason: \"not-git-install\",';

// Tìm file đã được patch
const targetFile = fs.readdirSync(dist).find(f => {
  if (!f.endsWith('.js')) return false;
  return fs.readFileSync(path.join(dist,f),'utf8').includes(MARKER);
});
if (!targetFile) { console.error('No patched file found'); process.exit(1); }

const patched = fs.readFileSync(path.join(dist, targetFile), 'utf8');
const blockIdx = patched.indexOf(BLOCK_START);
const needleIdx = patched.indexOf(NEEDLE);
const original = patched.slice(0, blockIdx) + patched.slice(needleIdx);
const linesBeforePatch = original.slice(0, original.indexOf(NEEDLE)).split('\n').length;
const hunkStart = linesBeforePatch - 1;
const contextBefore = original.split('\n').slice(Math.max(0, hunkStart - 3), hunkStart);
const insertedLines = patched.slice(blockIdx, needleIdx).split('\n').filter((_,i,a)=> i < a.length-1);

let diff = 'diff --git a/node_modules/openclaw/dist/' + targetFile + ' b/node_modules/openclaw/dist/' + targetFile + '\n';
diff += '--- a/node_modules/openclaw/dist/' + targetFile + '\n';
diff += '+++ b/node_modules/openclaw/dist/' + targetFile + '\n';
diff += '@@ -' + (hunkStart-2) + ',3 +' + (hunkStart-2) + ',' + (3 + insertedLines.length) + ' @@\n';
contextBefore.forEach(l => diff += ' ' + l + '\n');
insertedLines.forEach(l => diff += '+' + l + '\n');

fs.writeFileSync(patchFile, diff, 'utf8');
console.log('Patch saved:', patchFile, '| lines added:', insertedLines.length);
"
```

**Kiểm tra:**

```bash
ls patches/
# Phải có: openclaw+2026.X.X.patch
# Không còn: openclaw+<VERSION_CU>.patch
```

---

### Bước 5 — Build

```bash
# Build TypeScript (main process + backend)
npm run build:ts

# Build control-ui
npm run control-ui:build

# Sync build vào vendor/ (dùng khi đóng gói)
node scripts/sync-control-ui.cjs
```

**Kiểm tra:**

```bash
# control-ui build tồn tại
ls dist/control-ui/index.html && echo "OK" || echo "FAIL — chạy npm run control-ui:build"

# vendor đã sync
ls vendor/control-ui/index.html && echo "OK" || echo "FAIL — chạy node scripts/sync-control-ui.cjs"
```

---

### Bước 6 — Chạy test tự động

```bash
npm run test --prefix control-ui
```

Các test quan trọng nhất:

| File | Kiểm tra |
|------|----------|
| `src/ui/app-gateway.node.test.ts` | Kết nối WebSocket, handshake |
| `src/ui/controllers/control-ui-bootstrap.test.ts` | Bootstrap JSON contract |
| `src/ui/views/overview.node.test.ts` | Panel overview |
| `src/ui/views/agents.test.ts` | Agents view |
| `src/ui/views/chat.test.ts` | Chat view |

---

### Bước 7 — Chạy thử và kiểm tra thủ công

```bash
npm run dev
```

Trong app đang chạy, kiểm tra:

```bash
# Gateway RPC cơ bản
openclaw gateway call health
openclaw gateway call channels.status
openclaw gateway call config.get
openclaw gateway call models.list
openclaw gateway call sessions.list

# Bootstrap contract (thay PORT bằng port thực)
curl http://localhost:<PORT>/__openclaw/control-ui-config.json
```

**Checklist thủ công trong control-ui:**

```
[ ] Tab Channels: mỗi kênh hiển thị đúng trạng thái
[ ] Tab Channels → Telegram: kết nối, gửi tin thử
[ ] Tab Channels → Discord: auth, gửi tin thử
[ ] Tab Channels → Slack: OAuth flow
[ ] Tab Agents: danh sách hiển thị, tạo session được
[ ] Tab Chat: gửi tin, nhận phản hồi
[ ] Settings → Update: bấm "Check for updates" không lỗi
[ ] DevTools console: không có lỗi đỏ
```

---

### Bước 8 — Cập nhật openclaw-version.pin (xác nhận cuối)

Sau khi tất cả test pass:

```bash
cat openclaw-version.pin
# Phải là version mới đã pin từ Bước 2
```

---

## Xử lý sự cố patch

### `apply-openclaw-desktop-update.mjs` không tìm thấy file để patch

**Triệu chứng:** Script chạy không in gì, hoặc in "patched 0 files".

**Nguyên nhân:** Upstream đổi tên bundle. Script tìm file chứa needle `reason: "not-git-install"` trong `runGatewayUpdate`. Kiểm tra:

```bash
node -e "
const fs = require('fs');
const dist = './node_modules/openclaw/dist';
const needle = 'not-git-install';
const found = fs.readdirSync(dist).filter(f => {
  if (!f.endsWith('.js')) return false;
  return fs.readFileSync(dist+'/'+f,'utf8').includes(needle);
});
console.log(found);
"
```

Nếu có file → script sẽ tìm thấy (logic dùng content, không dùng tên). Nếu không có file nào → upstream đã refactor logic `runGatewayUpdate`, cần kiểm tra lại source và cập nhật `apply-openclaw-desktop-update.mjs`.

### Lỗi TypeScript khi build control-ui

**Triệu chứng:** `npm run control-ui:build` thất bại với lỗi type.

**Nguyên nhân:** API `@openclaw/gateway/*` thay đổi. Kiểm tra file bị lỗi và đối chiếu với source mới trong `openclaw-src/`:

```bash
# Xem import nào bị lỗi
npm run control-ui:build 2>&1 | grep "error TS"

# File control-ui dùng @openclaw/gateway
grep -r "@openclaw/gateway" control-ui/src/ --include="*.ts" -l
```

Cập nhật `openclaw-src/` theo binary mới hoặc sửa type trong [control-ui/src/ui/types.ts](../control-ui/src/ui/types.ts).

### Bootstrap contract lỗi (control-ui trắng khi load)

```bash
# Kiểm tra response
curl -s http://localhost:<PORT>/__openclaw/control-ui-config.json | node -e "
const d = require('fs').readFileSync('/dev/stdin','utf8');
console.log(JSON.stringify(JSON.parse(d), null, 2));
"
```

Đối chiếu với [control-ui/src/ui/controllers/control-ui-bootstrap.ts](../control-ui/src/ui/controllers/control-ui-bootstrap.ts) để xem field nào bị thiếu.

---

## Lệnh tổng hợp (khi không có vấn đề)

```bash
# === UPDATE NHANH ===
echo "2026.X.X" > openclaw-version.pin
npm run align:openclaw
npm run build:ts
npm run control-ui:build
node scripts/sync-control-ui.cjs
npm run test --prefix control-ui
npm run dev

# === ĐÓNG GÓI SAU KHI TEST PASS ===
npm run dist:installer   # Windows NSIS
npm run dist:portable    # Windows portable
```

---

## Bảng kiểm tra nhanh sau mỗi lần cập nhật

| Hạng mục | Lệnh kiểm tra | Kết quả mong đợi |
|----------|---------------|------------------|
| Version pin | `cat openclaw-version.pin` | Version mới |
| Version installed | `node -e "console.log(require('./node_modules/openclaw/package.json').version)"` | Khớp pin |
| Patch gateway | tìm MARKER `desktop app root update` trong dist | Có trong ít nhất 1 file |
| windowsHide | `exec-nWahKiCu.js` (từ 2026.4.2) | `windowsHide: true` native |
| Patch file | `ls patches/` | `openclaw+<VER>.patch` mới |
| Build OK | `ls dist/control-ui/index.html` | File tồn tại |
| Test pass | `npm run test --prefix control-ui` | 0 failures |
