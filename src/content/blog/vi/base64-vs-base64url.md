---
title: 'Base64 và Base64URL: những khác biệt nhỏ nhưng quan trọng'
description: 'Hai ký tự và một quy ước về padding có thể quyết định giá trị mã hóa có dùng được trong URL hay không.'
category: 'Mã hóa & giải mã'
readingTime: '3 phút đọc'
updated: '2026-10-24'
tool: 'base64-encoder-decoder'
---

Base64 biểu diễn các byte nhị phân dưới dạng văn bản. Base64URL dùng bảng ký tự hơi khác để giá trị mã hóa dễ đưa vào URL và tên file hơn. Không định dạng nào mã hóa bảo mật dữ liệu.

## So sánh bảng ký tự

Base64 chuẩn dùng chữ cái, chữ số, `+` và `/`. Base64URL thay `+` bằng `-` và `/` bằng `_`. Tùy giao thức, dấu `=` padding ở cuối có thể bị bỏ trong Base64URL.

Với cùng ba byte, giá trị chuẩn `+/8=` trở thành `-_8` trong Base64URL không padding. Các byte này không phải văn bản UTF-8 hợp lệ, nên bộ giải mã chỉ dành cho văn bản cần từ chối chúng thay vì hiển thị ký tự gây hiểu lầm.

## Mã hóa byte, không phải ký tự trừu tượng

Văn bản cần có bảng mã ký tự trước. InfraTrove dùng UTF-8 để tiếng không phải tiếng Anh và emoji được mã hóa rồi giải mã lại đúng:

```text
Hello 👋
SGVsbG8g8J+Riw==
```

Truyền Unicode trực tiếp vào `btoa` có thể báo lỗi hoặc mã hóa ra byte ngoài ý muốn. Hãy chuyển văn bản thành byte UTF-8 bằng `TextEncoder` trước; sau đó giải mã byte bằng `TextDecoder`.

## Lỗi padding là manh mối hữu ích

Chuỗi Base64 chuẩn có padding đúng sẽ có độ dài chia hết cho bốn. Thiếu padding, dấu bằng đặt sai chỗ hoặc ký tự lạ ngoài bảng ký tự đều phải gây ra lỗi. Một số giao thức cho phép rõ ràng Base64URL không padding; hãy dùng biến thể mà giao thức của bạn quy định thay vì đoán.

Chế độ chuẩn của InfraTrove yêu cầu padding khi cần. Chế độ URL-safe chấp nhận đầu vào có hoặc không có padding và trả về đầu ra không padding. Khoảng trắng và các bit thừa không hợp lệ bị từ chối thay vì được tự sửa âm thầm.

## Base64 không phải tính năng bảo mật

Ai có chuỗi mã hóa cũng giải mã được. Đừng dùng Base64 để bảo vệ mật khẩu. Payload của JWT sau khi giải mã cũng không chứng minh chữ ký đã được xác minh.

Hãy thử [Base64 Encoder / Decoder](/tools/base64-encoder-decoder/) với một mẫu vô hại. Với tham số URL dạng percent-encoding, hãy dùng [URL Encoder](/tools/url-encoder-decoder/).

## Tham khảo

- [RFC 4648: Base encodings](https://www.rfc-editor.org/rfc/rfc4648)
- [MDN: TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
