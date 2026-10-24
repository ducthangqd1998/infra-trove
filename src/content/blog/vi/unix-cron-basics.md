---
title: 'Đọc lịch cron năm trường mà không cần đoán'
description: 'Hướng dẫn nhanh về phút, giờ, các trường ngày và những câu hỏi về múi giờ nên kiểm tra trước khi một job chạy thật.'
category: 'Thời gian & lập lịch'
readingTime: '4 phút đọc'
updated: '2026-10-24'
tool: 'cron-generator'
---

Một biểu thức cron Unix thông thường có năm trường: phút, giờ, ngày trong tháng, tháng và ngày trong tuần. Biểu thức mô tả lịch lặp lại theo giờ đồng hồ treo tường. Bản thân nó không chỉ định múi giờ.

## Đọc từ trái sang phải

```text
minute  hour  day-of-month  month  day-of-week
*/5     *     *             *      *
```

Dấu sao nghĩa là mọi giá trị cho phép. `*/5` ở trường phút chọn các phút 0, 5, 10 và tiếp tục như vậy. Nó không có nghĩa là năm phút sau khi lần chạy trước kết thúc.

## Các ví dụ thường gặp

```text
*/5 * * * *     Every five minutes
0 0 * * *       Every day at midnight
0 9 * * 1-5     Weekdays at 09:00
0 0 1 * *       First day of each month at midnight
```

Khoảng giá trị và danh sách ngăn cách bằng dấu phẩy chọn nhiều giá trị. Ví dụ `0 9,17 * * 1-5` chọn 09:00 và 17:00 vào các ngày trong tuần.

## Kiểm tra cả hai trường ngày

Cron Unix truyền thống áp dụng phép OR khi cả trường ngày trong tháng và ngày trong tuần đều bị giới hạn. Lịch như `0 9 1 * 1` có thể chạy lúc 09:00 vào ngày mùng một hằng tháng **và** vào mỗi thứ Hai. Nó không nhất thiết có nghĩa là thứ Hai đầu tiên. Các bộ lập lịch khác nhau về điểm này, nên hãy kiểm tra hệ thống thật mà bạn triển khai.

## Múi giờ và giờ mùa hè quan trọng

Job 09:00 chạy theo múi giờ được cấu hình của bộ lập lịch. Một giờ địa phương có thể bị bỏ qua hoặc lặp lại khi chuyển đổi giờ mùa hè. Cách xử lý các trường hợp này thuộc về bộ lập lịch. Bản xem trước giúp kiểm tra hành vi nhưng không thay thế việc kiểm tra trên bộ lập lịch production của bạn.

InfraTrove cho phép xem trước năm lần chạy tiếp theo theo UTC hoặc múi giờ trình duyệt. UTC tránh được thay đổi giờ mùa hè, nhưng giờ địa phương tương ứng vẫn có thể dịch chuyển theo mùa.

## Đừng trộn lẫn các biến thể

Một số hệ thống thêm trường giây, trường năm hoặc ký tự đặc biệt. Biểu thức Quartz sáu trường không phải biểu thức Unix năm trường. Công cụ hiện tại của InfraTrove chỉ chấp nhận cú pháp số năm trường và từ chối các dạng không được hỗ trợ.

Mở [Cron Generator](/tools/cron-generator/) để thử các ví dụ, hoặc dùng [Timestamp Converter](/tools/unix-timestamp-converter/) để kiểm tra timestamp của một lần thực thi.

## Tham khảo

- [Tài liệu crontab](https://man7.org/linux/man-pages/man5/crontab.5.html)
- [Tài liệu cron-parser](https://github.com/harrisiirak/cron-parser)
