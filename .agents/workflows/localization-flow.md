---
description: Hướng dẫn dịch thuật và đồng bộ văn bản Anh - Việt cho giao diện (Localization Workflow)
---

# Quy trình dịch thuật (Localization/I18n Workflow) cho giao diện (Control UI)

Tài liệu này hướng dẫn cách dịch và bổ sung các chuỗi văn bản mới (kể cả tiếng Việt `vi.ts` và tiếng Anh `en.ts`) vào hệ thống để các thành phần UI hiển thị chính xác ngôn ngữ mà người dùng chọn. Nếu bạn là AI, hãy **đọc kỹ và tuân thủ tuyệt đối quy trình này** khi được yêu cầu thêm bản dịch hoặc cập nhật cấu hình cho giao diện.

## 1. Kiến trúc lưu trữ bản dịch

Các file ngôn ngữ được lưu trong thư mục `control-ui/src/i18n/locales/`:
- `vi.ts`: Chứa các bản dịch tiếng Việt gốc.
- `en.ts`: Chứa các bản dịch tiếng Anh tương đương.

**Yêu cầu cốt lõi**: Định dạng JSON/Object trong hai file này phải **khớp 100% với nhau** về các key. Bất kỳ key nào thêm vào `vi.ts` cũng phải có mặt trong `en.ts` và ngược lại.

## 2. Quy trình làm việc (Bước theo bước)

### Bước 1: Khai báo cặp khóa - giá trị mới trong `vi.ts` và `en.ts`

Khi có văn bản tiếng Anh mã nguồn cứng (hardcoded) hoặc trường cấu hình mới (config label/help text) cần dịch:
1. Xác định vị trí thích hợp trong object dịch (ví dụ: `channels.titles`, `config.copy`, hoặc `channels.wizard`).
2. Mở `control-ui/src/i18n/locales/vi.ts` và thêm khóa cùng nội dung tiếng Việt.
   - *Lưu ý*: Đối với văn bản cấu hình hệ thống, hãy ưu tiên đưa vào `config.copy`.
3. Mở `control-ui/src/i18n/locales/en.ts` và thêm **chính xác khóa đó** với nội dung tiếng Anh gốc. Điều này giúp ngăn ngừa cảnh báo thiếu phím (missing keys) ở frontend.

### Bước 2: Tích hợp vào UI Components

1. Sử dụng hàm `t("tên_khóa")` từ `src/i18n/index`.
2. Hạn chế sử dụng biến cấu hình tiếng Anh trực tiếp trong mã HTML/Lit.
Ví dụ: Thay thế `Thiết lập ${label}` bằng `${t("common.setup")} ${label}`.

### Bước 3: Ánh xạ cấu hình tự động (Dành cho `config-form.node.ts`)

Trong phần hiển thị file cấu hình, Gateway backend trả về các mô tả và nhãn (labels, help text) hoàn toàn bằng tiếng Anh cứng. 
1. Mở file `control-ui/src/ui/views/config-form.node.ts`.
2. Tìm đối tượng hằng số `CONFIG_COPY_KEY_BY_TEXT`.
3. Thêm một khóa mới (là **chính xác câu tiếng Anh gốc** hoặc ID hệ thống sẽ hiển thị). Giá trị của nó là đường dẫn `t()` key được tạo ở Bước 1.

**Ví dụ trong `config-form.node.ts`:**
```typescript
const CONFIG_COPY_KEY_BY_TEXT: Record<string, string> = {
  // ...
  "Telegram Streaming Mode": "config.copy.telegram.streamingModeLabel",
  "Unified Telegram stream preview mode: \"off\" | \"partial\" | \"block\" | \"progress\" (default: \"partial\").": "config.copy.telegram.streamingModeHelp",
};
```
*Lưu ý cẩn thận*: Chỉ cần sai một khoảng trắng, một dấu câu, hoặc quên/sai lỗi chính tả nào đó so với bản gốc thì hệ thống sẽ không nhận diện được và hiển thị thành tiếng Anh. (Đôi khi có typo ở backend, ví dụ "elegram Retry", bạn nên map cả hai dạng đúng và sai).

## 3. Các thực hành tốt nhất (Best Practices) khi dịch

1. **Giữ nguyên kiểu nội dung nhạy cảm**: Với những từ thiết lập bắt buộc của hệ thống (như `true`, `false`, `null`, `"pairing"`, `"dm"`, `"open"`...). Không được dịch chúng sang tiếng Việt (ví dụ: "cặp" thay vì "pairing" sẽ làm sai chức năng mô tả).
2. **Tuân thủ đúng định dạng thẻ HTML**: Trong `vi.ts` hoặc `en.ts`, văn bản có thể chứa các thành phần bôi đậm `<strong>` hoặc thuộc tính thay thế biến `{count}`. Hãy giữ nguyên vị trí thẻ HTML và biến số như bản gốc.
3. **Phân nhóm hợp lý**: Ví dụ nếu dịch mục `retry` của `Telegram`, hãy gom gọn vào object `config.copy.telegram.retry` gồm `attemptsLabel`, `attemptsHelp`, `jitterLabel`... Không nên để các key nằm lộn xộn.

## 4. Kiểm tra sự đồng bộ

Khi được người dùng yêu cầu kiểm tra (Ví dụ: "Cập nhật nốt tiếng Việt đi"):
- Tìm kiếm tệp theo đuôi nội dung để chắc chắn bạn không đang xem thiếu sót bất kỳ phần nào.
- Sử dụng `grep_search` trong codebase để kiểm tra số lượng các cấu hình cứng còn sót chưa thay `t("")`.
- Thực hiện xác minh đối chiếu (`diff_block_start`) trong cả `vi.ts` và `en.ts` mỗi khi thêm một object cấu hình dịch.

---
// turbo-all
