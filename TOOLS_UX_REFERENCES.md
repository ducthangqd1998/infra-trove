# InfraTrove — Tool UX References & Benchmark Tracker

Tài liệu này tổng hợp toàn bộ các công cụ hiện có trên **InfraTrove**. Bạn có thể điền các trang web tham khảo (UX benchmark / reference sites), tính năng hay ho, hoặc ghi chú trải nghiệm người dùng vào từng mục bên dưới để đội ngũ AI / kỹ thuật nghiên cứu và nâng cấp.

---

## 📌 Bảng tổng quan các công cụ hiện có

| STT | Công cụ                        | Danh mục          |  Layout hiện tại  | Đường dẫn                                                              |
| :-: | ------------------------------ | ----------------- | :---------------: | ---------------------------------------------------------------------- |
|  1  | **JSON Formatter & Validator** | Text & data       | `editors` (2 cột) | [`/tools/json-formatter/`](/tools/json-formatter/)                     |
|  2  | **Text Compare (Diff)**        | Text & data       | `editors` (2 cột) | [`/tools/text-compare/`](/tools/text-compare/)                         |
|  3  | **Base64 Encoder / Decoder**   | Encode & decode   | `editors` (2 cột) | [`/tools/base64-encoder-decoder/`](/tools/base64-encoder-decoder/)     |
|  4  | **URL Encoder / Decoder**      | Encode & decode   | `editors` (2 cột) | [`/tools/url-encoder-decoder/`](/tools/url-encoder-decoder/)           |
|  5  | **Cron Expression Generator**  | Time & scheduling | `panel` (compact) | [`/tools/cron-generator/`](/tools/cron-generator/)                     |
|  6  | **Unix Timestamp Converter**   | Time & scheduling | `panel` (compact) | [`/tools/unix-timestamp-converter/`](/tools/unix-timestamp-converter/) |
|  7  | **Password Generator**         | Generators        | `panel` (compact) | [`/tools/password-generator/`](/tools/password-generator/)             |
|  8  | **UUID Generator**             | Generators        | `panel` (compact) | [`/tools/uuid-generator/`](/tools/uuid-generator/)                     |
|  9  | **YAML ↔ JSON Converter**      | Text & data       | `editors` (2 cột) | [`/tools/yaml-json-converter/`](/tools/yaml-json-converter/)           |
| 10  | **JWT Decoder**                | Encode & decode   | `editors` (2 cột) | [`/tools/jwt-decoder/`](/tools/jwt-decoder/)                           |
| 11  | **Storage Unit Converter**     | Text & data       | `panel` (compact) | [`/tools/storage-unit-converter/`](/tools/storage-unit-converter/)     |
| 12  | **Hash & Checksum**            | Generators        | `panel` (compact) | [`/tools/hash-checksum/`](/tools/hash-checksum/)                       |

---

## 🛠️ Chi tiết từng công cụ & Khu vực điền Reference UX

### 1. JSON Formatter & Validator

- **Chức năng hiện tại**: Format/beautify JSON (2 spaces, 4 spaces), Minify JSON, kiểm tra lỗi cú pháp (validate), đếm dòng/ký tự, copy output.
- **Layout**: 2 editor song song (Input bên trái, Output bên phải).
- **Đường dẫn**: `/tools/json-formatter/`

#### 🌐 Các site UX mẫu nên tham khảo (Điền vào đây):

- **Trang 1**:
  - URL:
  - Điểm hay nên học hỏi (layout, tính năng, phím tắt, tree view, v.v.):
- **Trang 2**:
  - URL:
  - Điểm hay nên học hỏi:
- **Ghi chú / Tính năng muốn bổ sung**:
  - [ ] Ví dụ: JSON Tree view (xem dạng cây thu gọn/mở rộng)?
  - [ ] Ví dụ: Filter JSON bằng JSONPath / JQ?
  - [ ] Ví dụ: Convert JSON sang YAML / CSV / TypeScript interface?

---

### 2. Text Compare (Diff Checker)

- **Chức năng hiện tại**: So sánh 2 văn bản, đánh dấu thêm/xoá/sửa dòng, highlight từng từ khác biệt (`mark`), tuỳ chọn bỏ qua hoa/thường (ignore case), bỏ qua khoảng trắng thừa (ignore whitespace), chế độ Side-by-side và Unified.
- **Layout**: 2 editor input ➔ Bảng kết quả Diff dạng bảng kèm số dòng hai bên.
- **Đường dẫn**: `/tools/text-compare/`

#### 🌐 Các site UX mẫu nên tham khảo (Điền vào đây):

- **Trang 1**:
  - URL:
  - Điểm hay nên học hỏi:
- **Trang 2**:
  - URL:
  - Điểm hay nên học hỏi:
- **Ghi chú / Tính năng muốn bổ sung**:
  - [ ] Ví dụ: Đồng bộ cuộn (sync scroll) mượt mà hơn?
  - [ ] Ví dụ: Swap hai bên (đổi chỗ văn bản gốc và văn bản sửa)?

---

### 3. Base64 Encoder / Decoder

- **Chức năng hiện tại**: Encode và Decode văn bản UTF-8 (hỗ trợ Unicode, emoji), hỗ trợ Base64 chuẩn và biến thể URL-safe Base64, copy kết quả.
- **Layout**: 2 editor song song (Input và Output).
- **Đường dẫn**: `/tools/base64-encoder-decoder/`

#### 🌐 Các site UX mẫu nên tham khảo (Điền vào đây):

- **Trang 1**:
  - URL:
  - Điểm hay nên học hỏi:
- **Trang 2**:
  - URL:
  - Điểm hay nên học hỏi:
- **Ghi chú / Tính năng muốn bổ sung**:
  - [ ] Ví dụ: Hỗ trợ encode / decode file ảnh (Image to Base64 data URL) và preview ảnh trực tiếp?

---

### 4. URL Encoder / Decoder

- **Chức năng hiện tại**: Mã hóa / giải mã URL component (percent-encoding), xử lý ký tự đặc biệt, dấu cách, query params.
- **Layout**: 2 editor song song.
- **Đường dẫn**: `/tools/url-encoder-decoder/`

#### 🌐 Các site UX mẫu nên tham khảo (Điền vào đây):

- **Trang 1**:
  - URL:
  - Điểm hay nên học hỏi:
- **Trang 2**:
  - URL:
  - Điểm hay nên học hỏi:
- **Ghi chú / Tính năng muốn bổ sung**:
  - [ ] Ví dụ: Bảng parse URL chi tiết (Protocol, Host, Pathname, Query params theo dạng Key - Value trực quan)?

---

### 5. Cron Expression Generator

- **Chức năng hiện tại**: Sinh biểu thức Unix cron 5 trường, giải nghĩa lịch bằng câu tiếng Anh tự nhiên, chọn nhanh presets (mỗi phút, mỗi giờ, hàng ngày...), tính toán và preview 5 lần chạy kế tiếp (next runs), chuyển đổi múi giờ UTC / Local browser.
- **Layout**: Khối tương tác trực quan (panel) + bảng lịch sử lần chạy kế tiếp.
- **Đường dẫn**: `/tools/cron-generator/`

#### 🌐 Các site UX mẫu nên tham khảo (Điền vào đây):

- **Trang 1**:
  - URL:
  - Điểm hay nên học hỏi:
- **Trang 2**:
  - URL:
  - Điểm hay nên học hỏi:
- **Ghi chú / Tính năng muốn bổ sung**:
  - [ ] Ví dụ: Chọn lịch bằng giao diện visual builder (chọn ngày trong tuần dạng nút bấm T2-CN, thanh kéo giờ/phút)?
  - [ ] Ví dụ: Hỗ trợ cú pháp Cron 6 trường (Quartz cron / Spring / AWS EventBridge)?

---

### 6. Unix Timestamp Converter

- **Chức năng hiện tại**: Chuyển đổi timestamp (giây hoặc mili-giây) sang ngày giờ đọc được (UTC, ISO 8601, Local time), chuyển đổi ngược lại từ ngày giờ sang timestamp, nút lấy thời gian hiện tại ("Now").
- **Layout**: Bảng thông số thời gian dạng thẻ gọn (panel).
- **Đường dẫn**: `/tools/unix-timestamp-converter/`

#### 🌐 Các site UX mẫu nên tham khảo (Điền vào đây):

- **Trang 1**:
  - URL:
  - Điểm hay nên học hỏi:
- **Trang 2**:
  - URL:
  - Điểm hay nên học hỏi:
- **Ghi chú / Tính năng muốn bổ sung**:
  - [ ] Ví dụ: Đồng hồ thời gian thực (live ticking clock)?
  - [ ] Ví dụ: Tính toán chênh lệch thời gian (relative time: "3 hours ago", "in 2 days")?

---

### 7. Password Generator

- **Chức năng hiện tại**: Tạo mật khẩu ngẫu nhiên bằng `crypto.getRandomValues()` an toàn, tuỳ chỉnh độ dài (8 - 128 ký tự), chọn loại ký tự (Hoa, Thường, Số, Ký tự đặc biệt), loại trừ ký tự dễ nhầm (`l`, `1`, `I`, `O`, `0`...), hiển thị thang đo độ mạnh (entropy bits).
- **Layout**: Thẻ điều khiển dạng thanh trượt (slider) + checkbox nút lớn + màn hình hiển thị mật khẩu có tô màu phân biệt ký tự.
- **Đường dẫn**: `/tools/password-generator/`

#### 🌐 Các site UX mẫu nên tham khảo (Điền vào đây):

- **Trang 1**:
  - URL:
  - Điểm hay nên học hỏi:
- **Trang 2**:
  - URL:
  - Điểm hay nên học hỏi:
- **Ghi chú / Tính năng muốn bổ sung**:
  - [ ] Ví dụ: Hỗ trợ sinh passphrase (mật khẩu dạng cụm từ dễ nhớ: ví dụ `correct-horse-battery-staple`)?
  - [ ] Ví dụ: Lịch sử tạo mật khẩu tạm thời trong phiên làm việc?

---

### 8. UUID Generator

- **Chức năng hiện tại**: Tạo hàng loạt mã định danh UUID v4 ngẫu nhiên an toàn (từ 1 đến 100 mã một lượt), nút Copy từng mã riêng lẻ và Copy All.
- **Layout**: Khối tuỳ chọn số lượng + danh sách kết quả cuộn được.
- **Đường dẫn**: `/tools/uuid-generator/`

#### 🌐 Các site UX mẫu nên tham khảo (Điền vào đây):

- **Trang 1**:
  - URL:
  - Điểm hay nên học hỏi:
- **Trang 2**:
  - URL:
  - Điểm hay nên học hỏi:
- **Ghi chú / Tính năng muốn bổ sung**:
  - [ ] Ví dụ: Hỗ trợ UUID v7 (sắp xếp theo thời gian - Time-ordered UUID)?
  - [ ] Ví dụ: Tuỳ chọn định dạng (có dấu gạch ngang `-`, không dấu gạch ngang, chữ hoa/thường)?

---

## 🎨 Tham khảo chung cho toàn bộ Website (Global UX / UI System)

Bạn có thể liệt kê các trang web hoặc sản phẩm có phong cách tổng thể, micro-interaction hoặc workflow bạn thích nhất (ví dụ: Raycast, Linear, Vercel, DevToys, CyberChef, IT-Tools, Omatsuri...):

1. **Trang tham khảo chung 1**:
   - URL:
   - Điểm thích nhất (màu sắc, thanh tìm kiếm Command palette, phím tắt, font chữ, độ mượt...):
2. **Trang tham khảo chung 2**:
   - URL:
   - Điểm thích nhất:

---

## 💡 Đề xuất các Tools mới muốn làm trong tương lai (Ideas Backlog)

Danh sách cập nhật **2026-10-26** sau nghiên cứu DevToys, IT-Tools và Genie9. [Product spec](plans/feature.md) §5 là nguồn chính cho thứ tự, phạm vi và trạng thái; đợt đầu bên dưới **đã triển khai**, các hàng đợi sau vẫn chưa triển khai.

### Đợt 1 đã triển khai: catalog hiện có 12 tools

- [x] **YAML ↔ JSON Converter**: Chuyển hai chiều, báo lỗi, copy/download. Reference: [DevToys](https://github.com/DevToys-app/DevToys).
- [x] **JWT Decoder**: Header/payload, đọc `exp`/`iat`/`nbf`; ghi rõ chưa verify chữ ký. Reference: [Genie9 JWT](https://genie9.com/workspace/dev/jwt-decoder).
- [x] **Storage Unit Converter**: Đổi Bytes, đơn vị SI/IEC và hiển thị nhiều kết quả cùng lúc. Reference: [Genie9 Storage](https://genie9.com/workspace/converter/storage-converter); phân biệt đúng GB/GiB theo [NIST](https://pml.nist.gov/cuu/Units/binary.html).
- [x] **Hash & Checksum**: Text/file local, SHA-256/SHA-512, đối chiếu expected checksum. Reference: [Genie9 File Checksum](https://genie9.com/workspace/security/file-checksum).

### Hàng đợi sau đó, theo thứ tự

- [ ] **Upload / Restore Time Calculator**: Dung lượng + bandwidth + hiệu suất giả định → thời gian ước tính; dùng chung logic đơn vị với Storage Converter. Reference: mô tả trong [Genie9 Workspace](https://genie9.com/workspace); trang chi tiết chưa tải được khi nghiên cứu.
- [ ] **SQL Formatter**: Format theo dialect, không thực thi query.
- [ ] **JSON ↔ CSV Converter**: Hai chiều, header/delimiter và preview bảng.
- [ ] **Regex Tester**: JavaScript flavor, matches/groups, replace preview, Worker có timeout.
- [ ] **IPv4 / CIDR Calculator**: Network, mask, range và IP membership.
- [ ] **chmod Calculator**: Quyền owner/group/other ↔ octal ↔ symbolic.

### Để sau, chưa lên lịch

- [ ] **Text Utilities**: Case conversion, sort/deduplicate lines, word/character count, cleanup trong một tool.
- [ ] **HTML Escape / Unescape**.
- [ ] **QR Code Generator**: QR tĩnh cho URL/text/Wi-Fi, export PNG/SVG.
- [ ] **JSON Diff**: Structured differences, phân biệt với Text Compare.
- [ ] **Backup Storage Calculator**: Source size, change rate, retention; ghi rõ giả định mô hình.

Các mode của cùng tác vụ không tự động thành tools riêng. JSON minify/validate, Base64URL và cron next-run preview đã có trong catalog hiện tại. Chưa có keyword volume, traffic hoặc SERP opportunity xác thực cho backlog này; nhãn “Popular” của đối thủ không phải số liệu sử dụng.

### References

- https://genie9.com/
