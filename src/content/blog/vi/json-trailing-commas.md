---
title: 'Vì sao JSON của bạn không hợp lệ (và cách sửa)'
description: 'Dấu phẩy thừa, khóa không có nháy kép và ký tự escape: danh sách kiểm tra thực tế cho những lỗi JSON gặp nhiều nhất.'
category: 'Văn bản & dữ liệu'
readingTime: '3 phút đọc'
updated: '2026-10-24'
tool: 'json-formatter'
---

JSON là định dạng dữ liệu có cú pháp chặt hơn JavaScript. Một giá trị trông giống object JavaScript vẫn có thể làm `JSON.parse` báo lỗi. Hãy bắt đầu từ lỗi đầu tiên được báo: chỉ cần thiếu một dấu nháy là mọi thứ phía sau đều trông như hỏng.

## Xóa dấu phẩy thừa

Phần tử cuối cùng của object hoặc mảng không được có dấu phẩy phía sau. Đây là JSON không hợp lệ:

```text
{"name": "InfraTrove", "free": true,}
```

Xóa dấu phẩy sau `true`:

```json
{ "name": "InfraTrove", "free": true }
```

## Dùng nháy kép

Khóa của object và giá trị chuỗi phải nằm trong nháy kép. Nháy đơn và khóa không có nháy là quy ước của JavaScript, không phải cú pháp JSON. Các giá trị `true`, `false` và `null` viết thường và không có nháy. Chuỗi chứa chữ true khác với giá trị boolean `true`.

## Escape ký tự trong chuỗi

Ký tự xuống dòng thật không được xuất hiện trong chuỗi JSON. Hãy dùng `\n`. Escape nháy kép bên trong chuỗi bằng `\"` và dấu gạch chéo ngược bằng `\\`.

```json
{ "message": "She said \"hello\".\nNext line.", "path": "C:\\temp" }
```

## Chú thích không phải là JSON

Cả chú thích `//` lẫn `/* ... */` đều không hợp lệ. Nếu một định dạng cấu hình cho phép chú thích, nó đang dùng phần mở rộng như JSONC. Đừng xóa chú thích khỏi file cấu hình khi chưa kiểm tra chương trình đọc file đó mong đợi định dạng nào.

## Giá trị hợp lệ không nhất thiết là object

Mảng, chuỗi, số, boolean và `null` đều có thể là một tài liệu JSON hoàn chỉnh. API có chấp nhận chúng hay không là câu hỏi riêng về schema của API đó.

## Định dạng lại có thể làm đổi cách biểu diễn

InfraTrove phân tích JSON bằng JavaScript rồi serialize kết quả. Khóa trùng nhau sẽ giữ giá trị cuối cùng. Số vượt quá khoảng số nguyên an toàn của JavaScript có thể mất độ chính xác. Nếu cần xử lý chính xác các định danh lớn, hãy mã hóa chúng thành chuỗi ở hệ thống nguồn, hoặc dùng parser được thiết kế cho số không mất độ chính xác.

Dùng [JSON Formatter](/tools/json-formatter/) để kiểm tra cú pháp và làm cấu trúc dễ đọc hơn. Công cụ giữ nguyên dữ liệu bạn nhập khi việc phân tích thất bại.

## Tham khảo

[Chuẩn JSON, RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) định nghĩa các giá trị, chuỗi và cú pháp số hợp lệ.
