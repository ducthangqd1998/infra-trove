---
title: 'Đối chiếu checksum và hiểu giới hạn của kết quả khớp'
description: 'Tính SHA-256 hoặc SHA-512 tại máy, đối chiếu digest và phân biệt toàn vẹn với xác thực nguồn gốc.'
category: 'Tạo dữ liệu'
readingTime: '3 phút đọc'
updated: '2026-10-26'
tool: 'hash-checksum'
---

Checksum giúp so sánh byte của file với digest mong đợi. Nó hữu ích sau khi tải archive, sao chép artifact hoặc khôi phục backup. Ý nghĩa kết quả còn phụ thuộc nguồn của checksum mong đợi.

## Tính và đối chiếu

Mở [Hash & Checksum](/tools/hash-checksum/), chọn File và file tối đa 32 MiB. Chọn thuật toán giống nhà phát hành, tính hash rồi dán checksum hexadecimal mong đợi.

Công cụ bỏ qua khác biệt hoa/thường và khoảng trắng khi đối chiếu. SHA-256 cần 64 ký tự hex; SHA-512 cần 128. Giao diện phân biệt checksum sai định dạng với checksum đúng định dạng nhưng không khớp.

## Thử giá trị văn bản đã biết

Trong chế độ Text, `abc` cho SHA-256 sau:

```text
ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```

Văn bản được encode UTF-8. Dấu cách, xuống dòng và byte-order mark làm thay đổi byte nên cũng đổi hash. Chuỗi rỗng được hỗ trợ và có digest riêng. Khi kiểm tra file sẵn có, hãy dùng File thay vì copy phần chữ nhìn thấy vì thao tác đó có thể làm đổi encoding hoặc kiểu xuống dòng.

## Khớp checksum không chứng minh file an toàn

Checksum mật mã khớp là bằng chứng mạnh về sự phù hợp với digest được cung cấp. Nó không chứng minh file không chứa mã độc. Nếu kẻ tấn công thay được cả file lẫn checksum công bố, phép so sánh không phát hiện được việc thay thế. Cần xác thực nhà phát hành qua kênh checksum đáng tin hoặc quy trình kiểm tra chữ ký của dự án.

Hash đa dụng tốc độ cao không được thiết kế để lưu mật khẩu. Lưu mật khẩu cần thuật toán chuyên dụng với salt và chi phí tính toán phù hợp.

## Giới hạn trình duyệt

Công cụ dùng Web Crypto, cần HTTPS hoặc localhost. Không upload hay lưu nội dung. Vì toàn bộ file được giữ trong bộ nhớ, bản này giới hạn file 32 MiB và văn bản 200.000 ký tự. Chỉ hỗ trợ SHA-256 và SHA-512.

Với file lớn, dùng lệnh local như `sha256sum file.iso` trên Linux và theo hướng dẫn nhà phát hành. Dùng [Storage Unit Converter](/tools/storage-unit-converter/) nếu dung lượng MB và MiB có vẻ khác nhau.

## Tham khảo

- [MDN: SubtleCrypto.digest](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
- [NIST: Secure Hash Standard](https://doi.org/10.6028/NIST.FIPS.180-4)
