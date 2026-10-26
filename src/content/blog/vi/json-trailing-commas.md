---
title: 'Vì sao JSON của bạn không hợp lệ (và cách sửa)'
description: 'Dấu phẩy thừa, khóa không có nháy kép và ký tự escape: danh sách kiểm tra thực tế cho những lỗi JSON gặp nhiều nhất.'
category: 'Văn bản & dữ liệu'
readingTime: '3 phút đọc'
updated: '2026-10-24'
tool: 'json-formatter'
---

JSON là định dạng dữ liệu có cú pháp chặt hơn JavaScript. Một giá trị trông giống object JavaScript vẫn có thể làm `JSON.parse` báo lỗi. Hãy bắt đầu từ lỗi đầu tiên được báo: chỉ cần thiếu một dấu nháy là mọi thứ phía sau đều trông như hỏng.

<div class="editorial-compare" aria-label="So sánh cú pháp JSON sai và đúng">
  <div class="compare-col compare-before">
    <div class="compare-header">
      <span class="compare-label">Cú pháp không hợp lệ</span>
      <strong>JavaScript Object</strong>
    </div>
    <div class="compare-pills">
      <div class="compare-pill">
        <span class="pill-badge">Dấu phẩy thừa</span>
        <span><code>{"a": 1, }</code></span>
      </div>
      <div class="compare-pill">
        <span class="pill-badge">Khóa & chuỗi</span>
        <span><code>{ key: 'text' }</code></span>
      </div>
      <div class="compare-pill">
        <span class="pill-badge">Chú thích</span>
        <span><code>// comment</code></span>
      </div>
    </div>
    <p class="compare-desc">Tiện tay viết theo JS/TS nhưng khiến <code>JSON.parse</code> vấp lỗi ngay lập tức.</p>
  </div>

  <div class="compare-arrow" aria-hidden="true">
    <span>chuẩn hóa</span>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
  </div>

  <div class="compare-col compare-after">
    <div class="compare-header">
      <span class="compare-label">Chuẩn RFC 8259</span>
      <strong>Valid JSON</strong>
    </div>
    <div class="compare-pills">
      <div class="compare-pill">
        <span class="pill-badge">Kết thúc phần tử</span>
        <span><code>{"a": 1}</code></span>
      </div>
      <div class="compare-pill">
        <span class="pill-badge">Khóa & chuỗi</span>
        <span><code>{ "key": "text" }</code></span>
      </div>
      <div class="compare-pill">
        <span class="pill-badge">Chú thích</span>
        <span>Không cho phép</span>
      </div>
    </div>
    <p class="compare-desc">Dữ liệu trao đổi nghiêm ngặt, tương thích tuyệt đối mọi ngôn ngữ lập trình.</p>
  </div>
</div>

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

<blockquote class="editorial-quote">
  “JSON không phải là một tập con hoàn chỉnh của JavaScript — nó là một đặc tả định dạng dữ liệu nghiêm ngặt, nơi một dấu phẩy thừa hay một dấu nháy đơn cũng đủ làm tê liệt cả parser.”
</blockquote>

## Giá trị hợp lệ không nhất thiết là object

Mảng, chuỗi, số, boolean và `null` đều có thể là một tài liệu JSON hoàn chỉnh. API có chấp nhận chúng hay không là câu hỏi riêng về schema của API đó.

## Định dạng lại có thể làm đổi cách biểu diễn

InfraTrove phân tích JSON bằng JavaScript rồi serialize kết quả. Khóa trùng nhau sẽ giữ giá trị cuối cùng. Số vượt quá khoảng số nguyên an toàn của JavaScript có thể mất độ chính xác. Nếu cần xử lý chính xác các định danh lớn, hãy mã hóa chúng thành chuỗi ở hệ thống nguồn, hoặc dùng parser được thiết kế cho số không mất độ chính xác.

<div class="takeaways-box">
  <div class="takeaways-title">3 quy tắc vàng cần nhớ</div>
  <div class="takeaways-grid">
    <div class="takeaway-item">
      <span class="takeaway-num">01</span>
      <strong class="takeaway-heading">Luôn dùng nháy kép</strong>
      <p>Cả tên khóa (keys) lẫn giá trị chuỗi (string values) đều bắt buộc nằm trong <code>"..."</code>.</p>
    </div>
    <div class="takeaway-item">
      <span class="takeaway-num">02</span>
      <strong class="takeaway-heading">Không dấu phẩy cuối</strong>
      <p>Mục cuối cùng trong object hoặc array tuyệt đối không được có dấu phẩy đi kèm.</p>
    </div>
    <div class="takeaway-item">
      <span class="takeaway-num">03</span>
      <strong class="takeaway-heading">Escape đúng chuẩn</strong>
      <p>Xuống dòng thực tế phải thay bằng <code>\n</code>, nháy kép nội tại phải escape bằng <code>\"</code>.</p>
    </div>
  </div>
</div>

Dùng [JSON Formatter](/tools/json-formatter/) để kiểm tra cú pháp và làm cấu trúc dễ đọc hơn. Công cụ giữ nguyên dữ liệu bạn nhập khi việc phân tích thất bại.

## Tham khảo

[Chuẩn JSON, RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) định nghĩa các giá trị, chuỗi và cú pháp số hợp lệ.
