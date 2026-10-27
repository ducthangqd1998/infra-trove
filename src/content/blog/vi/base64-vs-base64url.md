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

<div class="editorial-compare" aria-label="So sánh Base64 và Base64URL">
  <div class="compare-col compare-before">
    <div class="compare-header">
      <span class="compare-label">Chuẩn truyền thống</span>
      <strong>Standard Base64</strong>
    </div>
    <div class="compare-pills">
      <div class="compare-pill">
        <span class="pill-badge">Ký tự 62 & 63</span>
        <span><code>+</code> và <code>/</code></span>
      </div>
      <div class="compare-pill">
        <span class="pill-badge">Padding cuối</span>
        <span>Bắt buộc dấu <code>=</code></span>
      </div>
    </div>
    <p class="compare-desc">Dễ xung đột cú pháp khi truyền trong URL query hoặc tên file.</p>
  </div>

  <div class="compare-arrow" aria-hidden="true">
    <span>thay thế</span>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
  </div>

  <div class="compare-col compare-after">
    <div class="compare-header">
      <span class="compare-label">Chuẩn URL-safe</span>
      <strong>Base64URL</strong>
    </div>
    <div class="compare-pills">
      <div class="compare-pill">
        <span class="pill-badge">Ký tự 62 & 63</span>
        <span><code>-</code> và <code>_</code></span>
      </div>
      <div class="compare-pill">
        <span class="pill-badge">Padding cuối</span>
        <span>Bỏ padding (không <code>=</code>)</span>
      </div>
    </div>
    <p class="compare-desc">An toàn tuyệt đối cho URL parameter, JWT payload và HTTP header.</p>
  </div>
</div>

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

<blockquote class="editorial-quote">
  “Một chuỗi Base64 không có giá trị bảo mật — bất kỳ ai nhận được chuỗi cũng có thể giải mã ngược lại nguyên văn.”
</blockquote>

<div class="takeaways-box">
  <div class="takeaways-header">
    <h3 class="takeaways-title">3 điểm cốt lõi cần nhớ</h3>
    <span class="takeaways-badge">Điểm cốt lõi</span>
  </div>
  <div class="takeaways-grid">
    <div class="takeaway-item">
      <div class="takeaway-head">
        <span class="takeaway-num">01</span>
        <strong class="takeaway-heading">An toàn cho URL</strong>
      </div>
      <p>Thay thế <code>+</code> và <code>/</code> bằng <code>-</code> và <code>_</code> để không bị phân tách nhầm trong URL query.</p>
    </div>
    <div class="takeaway-item">
      <div class="takeaway-head">
        <span class="takeaway-num">02</span>
        <strong class="takeaway-heading">Quy ước Padding</strong>
      </div>
      <p>Base64 chuẩn yêu cầu <code>=</code> cho đủ bội số của 4, trong khi Base64URL thường bỏ hẳn padding.</p>
    </div>
    <div class="takeaway-item">
      <div class="takeaway-head">
        <span class="takeaway-num">03</span>
        <strong class="takeaway-heading">Không phải bảo mật</strong>
      </div>
      <p>Base64 chỉ là định dạng biểu diễn byte nhị phân, tuyệt đối không dùng thay thế cho mã hóa bảo mật hay hàm băm.</p>
    </div>
  </div>
</div>

Hãy thử [Base64 Encoder / Decoder](/tools/base64-encoder-decoder/) với một mẫu vô hại. Với tham số URL dạng percent-encoding, hãy dùng [URL Encoder](/tools/url-encoder-decoder/).

## Tham khảo

- [RFC 4648: Base encodings](https://www.rfc-editor.org/rfc/rfc4648)
- [MDN: TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
