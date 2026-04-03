# Hướng dẫn sử dụng Agent trong Dashboard

## Mục lục

1. [Tổng quan về Agent](#1-tổng-quan-về-agent)
2. [Các tab trong Agent](#2-các-tab-trong-agent)
   - [Overview (Tổng quan)](#21-overview-tổng-quan)
   - [Files (Tệp cấu hình)](#22-files-tệp-cấu-hình)
   - [Tools (Công cụ)](#23-tools-công-cụ)
   - [Skills (Kỹ năng)](#24-skills-kỹ-năng)
   - [Channels (Kênh)](#25-channels-kênh)
   - [Cron (Lịch tự động)](#26-cron-lịch-tự-động)
3. [Thêm API Provider](#3-thêm-api-provider)
   - [Các provider hỗ trợ](#31-các-provider-hỗ-trợ)
   - [Cách thêm API key](#32-cách-thêm-api-key)
4. [Kết nối Ollama Local](#4-kết-nối-ollama-local)
   - [Cài đặt Ollama](#41-cài-đặt-ollama)
   - [Pull model DeepSeek (hoặc model khác)](#42-pull-model-deepseek-hoặc-model-khác)
   - [Thêm Ollama vào Dashboard](#43-thêm-ollama-vào-dashboard)
5. [Chọn Model cho Agent](#5-chọn-model-cho-agent)
6. [Câu hỏi thường gặp](#6-câu-hỏi-thường-gặp)

---

## 1. Tổng quan về Agent

Agent là đơn vị xử lý trung tâm trong OpenClaw. Mỗi agent:

- Có **workspace** riêng (thư mục làm việc)
- Sử dụng một **model AI** cụ thể để xử lý yêu cầu
- Có thể được gắn với **kênh** (WhatsApp, Telegram, Discord, v.v.)
- Có thể chạy các **tác vụ theo lịch** (Cron)
- Được trang bị **tools** và **skills** để mở rộng khả năng

Để vào giao diện Agent: Nhấn **Agent** trong thanh điều hướng trái → chọn agent từ danh sách.

---

## 2. Các tab trong Agent

### 2.1 Overview (Tổng quan)

Tab mặc định khi mở agent. Hiển thị:

| Thông tin | Mô tả |
|-----------|-------|
| **Workspace** | Thư mục làm việc của agent, nhấn để mở tab Files |
| **Primary Model** | Model AI đang được dùng |
| **Skills Filter** | Số skills đang được bật hoặc "Tất cả" |

**Chọn Model:**
- Dropdown hiện danh sách model từ các **provider đã cấu hình API**
- Models được nhóm theo provider (OpenAI, Google, Ollama, v.v.)
- Nếu chưa có provider nào, dropdown sẽ trống kèm thông báo — nhấn **Add API Provider**

**Model Fallback:**
- Nhập model ID phụ để agent dùng khi model chính lỗi
- Nhấn `Enter` hoặc `,` để thêm nhiều fallback
- Ví dụ: nhập `gemini/gemini-1.5-flash` rồi Enter

**Lưu thay đổi:** Nhấn **Save** sau khi chỉnh sửa. Nếu có thay đổi chưa lưu, thanh cảnh báo vàng sẽ hiện.

---

### 2.2 Files (Tệp cấu hình)

Quản lý các file cấu hình trong workspace của agent:

- Xem danh sách file trong workspace
- Chỉnh sửa trực tiếp nội dung file (editor có highlight)
- **Preview** trước khi lưu để kiểm tra thay đổi
- **Reset** để hoàn lại nội dung gốc nếu chỉnh sai
- **Save** để lưu vĩnh viễn

> Các file thường gặp: `system-prompt.md`, `agent.yaml`, các file context tùy chỉnh.

---

### 2.3 Tools (Công cụ)

Cấu hình quyền truy cập công cụ cho agent:

- **Tool Profile:** Chọn bộ quyền mặc định (minimal, standard, full, v.v.)
- **Allow thêm:** Thêm tool cụ thể ngoài profile
- **Deny:** Chặn tool dù profile cho phép

Mỗi tool hiển thị:
- Badge `core` / `plugin:xxx` để biết nguồn gốc
- Badge `optional` nếu tool không bắt buộc
- Trạng thái **Allowed** / **Denied** theo policy hiện tại

---

### 2.4 Skills (Kỹ năng)

Skills là các khả năng mở rộng được cài thêm vào agent:

- Xem danh sách skills đang có trong hệ thống
- **Enable/Disable** từng skill cho agent
- **Enable All / Disable All** để quản lý hàng loạt
- Mỗi skill hiển thị trạng thái: active, missing dependency, error

> Skills giúp agent tích hợp với dịch vụ ngoài như web search, image generation, v.v.

---

### 2.5 Channels (Kênh)

Hiển thị trạng thái kết nối của agent với các kênh nhắn tin:

- Xem kênh nào đang kết nối (WhatsApp, Telegram, Discord, Slack, v.v.)
- Trạng thái: **Running** (xanh), **Stopped** (đỏ), **Not configured** (xám)
- Nhấn tên kênh để chuyển sang trang cấu hình kênh đó

> Để thêm kênh mới, vào **Kênh** trong thanh điều hướng trái.

---

### 2.6 Cron (Lịch tự động)

Cấu hình các tác vụ chạy tự động theo lịch:

- Xem danh sách Cron jobs đang có
- Mỗi job hiển thị: tên, lịch chạy (cron expression), trạng thái enabled/disabled
- **Run Now:** Chạy job ngay lập tức không cần chờ lịch
- Xem thống kê: tổng job, số job đang bật, thời gian chạy tiếp theo

> Ví dụ cron expression: `0 9 * * 1-5` = 9 giờ sáng các ngày trong tuần.

---

## 3. Thêm API Provider

API Provider cung cấp các model AI cloud. Bạn cần API key từ nhà cung cấp để sử dụng.

### 3.1 Các provider hỗ trợ

| Provider | Model tiêu biểu | Lấy API key tại |
|----------|----------------|-----------------|
| **OpenAI** | GPT-4o, GPT-4.1 | platform.openai.com |
| **Anthropic** | Claude Sonnet, Claude Opus | console.anthropic.com |
| **Google (Gemini)** | Gemini 2.0 Flash, Gemini 1.5 Pro | aistudio.google.com |
| **OpenRouter** | Hàng trăm model đa dạng | openrouter.ai |
| **Mistral** | Mistral Large, Codestral | console.mistral.ai |
| **xAI (Grok)** | Grok-2, Grok-3 | console.x.ai |
| **Together AI** | Llama, Mixtral, v.v. | api.together.xyz |
| **Groq** | Llama ultra-fast | console.groq.com |
| **Kilocode** | Models tổng hợp | kilocode.ai |

### 3.2 Cách thêm API key

1. Vào tab **Agent** → chọn agent → tab **Overview**
2. Nhấn nút **Add API Provider** (cạnh dòng "Model Selection")
3. Chọn **Provider** từ dropdown
4. Dán **API Key** vào ô input
5. Nhấn **Add Provider**

Gateway sẽ tự động khởi động lại và load danh sách model từ provider vừa thêm. Dropdown model sẽ cập nhật trong vài giây.

> **Lưu ý bảo mật:** API key được lưu trong file config của gateway (không phải trong trình duyệt). Chỉ những ai có quyền truy cập vào thư mục cài đặt mới đọc được.

---

## 4. Kết nối Ollama Local

Ollama cho phép chạy các model AI **trên máy tính của bạn** mà không cần internet hay API key. Phù hợp để dùng với DeepSeek, Llama, Qwen, v.v.

### 4.1 Cài đặt Ollama

**Windows / macOS / Linux:**

Tải và cài tại: https://ollama.com/download

Sau khi cài, Ollama tự chạy ở nền. Kiểm tra bằng lệnh:

```bash
ollama --version
```

Mặc định Ollama lắng nghe tại: `http://127.0.0.1:11434`

---

### 4.2 Pull model DeepSeek (hoặc model khác)

Mở terminal và chạy lệnh pull model trước khi thêm vào dashboard:

```bash
# DeepSeek R1 — model suy luận 7B (nhẹ, phù hợp máy 16GB RAM)
ollama pull deepseek-r1:7b

# DeepSeek R1 14B (cần 16GB RAM trở lên)
ollama pull deepseek-r1:14b

# DeepSeek Coder cho lập trình
ollama pull deepseek-coder-v2

# Các model phổ biến khác
ollama pull llama3.2:3b        # Meta Llama 3.2 3B (nhẹ)
ollama pull qwen2.5:7b         # Alibaba Qwen 2.5 7B
ollama pull mistral:7b         # Mistral 7B
```

Kiểm tra model đã pull:

```bash
ollama list
```

---

### 4.3 Thêm Ollama vào Dashboard

1. **Đảm bảo Ollama đang chạy** (kiểm tra bằng `ollama list`)
2. Vào tab **Agent** → chọn agent → tab **Overview**
3. Nhấn **Add API Provider**
4. Chọn **Ollama (Local)** trong dropdown Provider
5. Kiểm tra **Ollama Base URL** — mặc định là `http://127.0.0.1:11434`
   - Nếu Ollama chạy ở port khác hoặc máy khác, sửa lại URL
6. Nhấn **Add Provider**

Gateway sẽ kết nối đến Ollama, lấy danh sách model đã pull và hiện trong dropdown.

**Ví dụ Base URL theo tình huống:**

| Tình huống | Base URL |
|------------|----------|
| Ollama trên cùng máy (mặc định) | `http://127.0.0.1:11434` |
| Ollama chạy port khác | `http://127.0.0.1:8080` |
| Ollama trên máy khác trong LAN | `http://192.168.1.100:11434` |
| Ollama qua ngrok/tunnel | `https://xxx.ngrok.io` |

---

## 5. Chọn Model cho Agent

Sau khi đã thêm provider, quay lại tab **Overview** của agent:

1. Dropdown **Model Selection** sẽ hiện các model từ **đúng provider đã cấu hình**
2. Models được nhóm theo provider (mỗi nhóm có header riêng)
3. Chọn model → nhấn **Save**

**Ví dụ với Ollama + DeepSeek:**

```
── Ollama ──────────────────
   deepseek-r1:7b
   deepseek-r1:14b
   llama3.2:3b
```

**Model Fallback (tuỳ chọn):**

Nhập thêm model dự phòng nếu model chính không phản hồi:

```
Primary:  ollama/deepseek-r1:7b
Fallback: ollama/llama3.2:3b
```

---

## 6. Câu hỏi thường gặp

**Q: Tôi đã thêm provider nhưng dropdown vẫn trống?**

Gateway cần vài giây để khởi động lại sau khi thêm provider. Đợi khoảng 5-10 giây rồi nhấn **Refresh** hoặc chuyển sang tab khác rồi quay lại.

---

**Q: Ollama báo "không kết nối được"?**

Kiểm tra:
- Ollama đang chạy: `ollama list`
- Firewall không chặn port 11434
- URL nhập đúng (không có dấu `/` ở cuối)

---

**Q: Tôi muốn dùng DeepSeek API cloud (không phải local)?**

DeepSeek cũng có API cloud riêng. Chọn provider **OpenRouter** (hỗ trợ DeepSeek cloud) hoặc dùng Ollama local như hướng dẫn trên.

---

**Q: Có thể dùng nhiều provider cùng lúc không?**

Có. Thêm từng provider một, mỗi provider tương ứng với một nhóm model trong dropdown. Ví dụ: thêm cả Gemini + OpenAI + Ollama thì dropdown sẽ hiện model của cả 3.

---

**Q: API key được lưu ở đâu, có an toàn không?**

Key lưu trong file config của gateway tại thư mục cài đặt. Không lưu trong trình duyệt, không gửi lên cloud. Bảo vệ thư mục cài đặt khỏi truy cập trái phép là đủ.

---

**Q: Tôi muốn xóa một provider đã thêm?**

Hiện tại chưa có nút xóa trong UI. Cách thủ công: vào **Cài đặt → Cấu hình** → chọn chế độ Raw → xóa entry trong `auth.profiles` và `models.providers` tương ứng.
