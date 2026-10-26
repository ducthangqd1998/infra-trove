---
title: 'GB và GiB: đổi đơn vị dung lượng không cần đoán'
description: 'Phân biệt dung lượng thập phân và nhị phân khi đọc disk usage, quota và kích thước backup.'
category: 'Văn bản & dữ liệu'
readingTime: '2 phút đọc'
updated: '2026-10-26'
tool: 'storage-unit-converter'
---

Gigabyte và gibibyte biểu diễn số byte khác nhau. Chênh lệch xuất phát từ quy ước đơn vị, không phải bằng chứng ổ đĩa bị mất dữ liệu.

## So sánh hai hệ đơn vị

| Đơn vị | Byte          |
| ------ | ------------- |
| 1 kB   | 1.000         |
| 1 KiB  | 1.024         |
| 1 MB   | 1.000.000     |
| 1 MiB  | 1.048.576     |
| 1 GB   | 1.000.000.000 |
| 1 GiB  | 1.073.741.824 |

Tiền tố SI dùng lũy thừa 1000. Tiền tố nhị phân IEC dùng lũy thừa 1024 và có chữ `i`. Vì vậy, `1 GB = 1000 MB` và `1 GiB = 1024 MiB`.

## Đổi một giá trị sang nhiều đơn vị

Mở [Storage Unit Converter](/tools/storage-unit-converter/), nhập `1.5` và chọn `GiB`. Kết quả byte là `1610612736`, kết quả MiB là `1536`. Đổi sang GB để thấy số byte thay đổi thế nào khi chọn đơn vị khác.

Dung lượng 500 GB tương đương khoảng 465,661287308 GiB. Định dạng ổ, metadata filesystem và các vùng dành riêng có thể làm dung lượng dùng cho file giảm thêm; phép đổi đơn vị không tự tính các phần này.

## Hiểu độ chính xác và giới hạn

Nhập số thập phân không âm, tối đa 40 chữ số nguyên và 18 chữ số thập phân. Không dùng dấu phẩy hoặc ký pháp số mũ. Công cụ tính bằng phân số số nguyên để giữ nguyên số nguyên lớn, tránh mất chính xác do số thực JavaScript.

Kết quả làm tròn half up đến chín chữ số thập phân. Giá trị dương nhỏ hơn độ chính xác hiển thị được ghi `< 0.000000001`; đây không phải số không. Kết quả byte lẻ là quy đổi toán học, không có nghĩa file thật chiếm một phần của byte.

## Tách dung lượng khỏi bandwidth

Công cụ đổi dung lượng theo byte. Một byte có tám bit nên Mbps khác MB/s. Đổi dung lượng không đo tốc độ mạng hay dự đoán hiệu năng restore. Dùng [Hash & Checksum](/tools/hash-checksum/) khi cần kiểm tra file đã tải hoặc sao chép.

## Tham khảo

- [NIST: Tiền tố nhị phân](https://pml.nist.gov/cuu/Units/binary.html)
