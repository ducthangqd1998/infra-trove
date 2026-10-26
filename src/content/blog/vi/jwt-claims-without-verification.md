---
title: 'Đọc claim JWT và phân biệt giải mã với xác minh'
description: 'Xem header, payload và thời gian NumericDate mà không nhầm chúng với bằng chứng tin cậy.'
category: 'Mã hóa & giải mã'
readingTime: '3 phút đọc'
updated: '2026-10-26'
tool: 'jwt-decoder'
---

JWT có chữ ký ở dạng compact thường gồm ba phần ngăn bằng dấu chấm: header, payload và signature. Đọc hai phần đầu giúp debug API, nhưng không chứng minh chúng có nguồn gốc xác thực.

## Thử ví dụ mẫu trước

Mở [JWT Decoder](/tools/jwt-decoder/) rồi chọn Load example. Ví dụ chứa `sub: "demo-user"` và thời gian bằng không. Đây là dữ liệu minh họa để debug, không phải thông tin đăng nhập hoặc chữ ký đã xác minh.

Header và payload là object JSON được encode Base64URL. Công cụ decode tại trình duyệt và cho phép copy từng phần. Nó không yêu cầu signing key, gọi JWKS endpoint hay lưu token.

## Đọc thời gian theo đơn vị giây

Các claim `iat`, `nbf` và `exp` dùng NumericDate tính bằng giây từ Unix epoch:

| Claim | Ý nghĩa                                        |
| ----- | ---------------------------------------------- |
| `iat` | Thời điểm phát hành token                      |
| `nbf` | Thời điểm trước đó token chưa được chấp nhận   |
| `exp` | Thời điểm từ đó token không còn được chấp nhận |

Số không là giá trị thật, tương ứng `1970-01-01T00:00:00.000Z`. Nếu nhầm mili giây thành giây, kết quả có thể là ngày rất xa. Công cụ hiển thị UTC mà không tự đoán đơn vị khác; dùng [Timestamp Converter](/tools/unix-timestamp-converter/) để kiểm tra khi nghi ngờ sai đơn vị.

## Xác minh độ tin cậy trong ứng dụng

Kẻ tấn công có thể sửa payload đã encode. Ứng dụng phải kiểm tra chữ ký, issuer, audience và các điều kiện thời gian bằng thư viện JWT phù hợp. Tên thuật toán trong header cũng là dữ liệu chưa đáng tin; ứng dụng quyết định thuật toán nào được chấp nhận.

Công cụ có thể đọc token `alg: "none"` với signature rỗng. Điều đó không làm token phù hợp cho authentication. Công cụ cũng không tự đánh đồng HS256 với thuật toán yếu: độ mạnh của key và cấu hình xác minh mới quyết định.

## Định dạng và giới hạn

Công cụ nhận JWT compact ba phần với header và payload là object JSON, tối đa 20.000 ký tự. Không hỗ trợ JWE mã hóa năm phần, detached payload hoặc unencoded payload. NumericDate phải là số hữu hạn trong vùng ngày được hỗ trợ. JSON trùng khóa giữ giá trị cuối.

## Tham khảo

- [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519)
- [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725)
