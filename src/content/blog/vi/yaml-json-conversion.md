---
title: 'Chuyển YAML và JSON mà vẫn hiểu rõ kiểu dữ liệu'
description: 'Hiểu giá trị YAML 1.2, chuỗi có dấu nháy và giới hạn khi chuyển cấu hình qua lại.'
category: 'Văn bản & dữ liệu'
readingTime: '3 phút đọc'
updated: '2026-10-26'
tool: 'yaml-json-converter'
---

YAML và JSON có thể mô tả cùng một cấu hình, nhưng chuyển dữ liệu không đồng nghĩa giữ nguyên văn bản gốc. Comment, anchor, cách thụt dòng và kiểu dấu nháy không được bảo toàn khi chuyển YAML sang JSON rồi quay lại YAML.

## Bắt đầu với cấu hình nhỏ

Dán ví dụ sau vào [YAML ↔ JSON Converter](/tools/yaml-json-converter/), chọn YAML to JSON rồi bấm Convert:

```yaml
name: demo-api
replicas: 3
enabled: true
ports:
  - 8080
```

Kết quả gồm chuỗi, số, boolean và mảng. Bạn có thể copy hoặc tải file, sau đó dùng Swap direction để chuyển ngược lại. Hãy so sánh dữ liệu thay vì đòi hỏi khoảng trắng giống hệt.

## Đặt dấu nháy cho giá trị phải là chuỗi

Công cụ dùng core schema của YAML 1.2. `yes` là chuỗi, còn `true` là boolean. Đặt dấu nháy quanh mã như `"001"` nếu cần giữ các số không ở đầu. Khóa mapping dạng số hoặc boolean cũng cần dấu nháy vì khóa object JSON phải là chuỗi.

Số nguyên ngoài vùng an toàn của JavaScript sẽ bị từ chối thay vì âm thầm làm tròn. Hãy biểu diễn mã định danh lớn dưới dạng chuỗi. Các số thập phân khác vẫn chịu giới hạn chính xác của JavaScript; công cụ không dành cho dữ liệu số chính xác tùy ý.

## Biết các giới hạn hỗ trợ

Mỗi lần chỉ chuyển một document. Công cụ từ chối alias, merge key, custom tag, số không hữu hạn và explicit tag không hỗ trợ. Hãy thay alias bằng dữ liệu đầy đủ trước khi chuyển. Khai báo anchor không có alias sử dụng có thể bị loại khỏi kết quả.

Giới hạn gồm 100.000 ký tự đầu vào, 400.000 ký tự đầu ra, 50 cấp lồng nhau và 10.000 giá trị. Hãy chia nhỏ tài liệu lớn hơn. YAML trùng khóa sẽ báo lỗi. JSON trùng khóa giữ giá trị cuối, giống hành vi `JSON.parse`.

## Kiểm tra ứng dụng đích

Chuyển cú pháp không xác thực schema của Kubernetes, CI hay ứng dụng. Hãy dùng bộ kiểm tra của hệ thống đích để xác nhận kết quả. Dùng [Text Compare](/tools/text-compare/) để rà thay đổi hoặc [JSON Formatter](/tools/json-formatter/) để đọc JSON riêng.

## Tham khảo

- [Tài liệu thư viện YAML](https://eemeli.org/yaml/)
- [Đặc tả YAML 1.2.2](https://yaml.org/spec/1.2.2/)
