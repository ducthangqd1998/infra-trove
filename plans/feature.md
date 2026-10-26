---
title: "InfraTrove — Website Blueprint & Product Requirements"
version: "0.1"
status: "Working draft — chưa xác thực thị trường"
updated: "2026-10-26"
product_language: "English"
document_language: "Vietnamese"
brand: "InfraTrove"
domain_candidate: "infratrove.com"
primary_business_model: "Free online tools + evergreen content + SEO + display advertising"
---

# InfraTrove — Website Blueprint & Product Requirements (v0.1)

> **Mục đích:** Tài liệu định hướng sản phẩm, thiết kế, nội dung, SEO và triển khai cho InfraTrove. Đây là **product blueprint**, không phải lệnh triển khai toàn bộ features, không phải nghiên cứu keyword đã hoàn tất và không phải cam kết traffic/doanh thu.
>
> **Phạm vi đã chốt:** Online tools miễn phí; blog hỗ trợ SEO; monetization chính dự kiến là display ads; ưu tiên công cụ nhanh, hữu ích, xử lý client-side, chi phí thấp; thị trường tiếng Anh; một solo founder xây và vận hành.
>
> **Ngoài phạm vi:** Không xây Cloud Cost SaaS, infrastructure monitoring SaaS, subscriptions, team dashboards hay B2B enterprise product nếu không có quyết định mới.

## 0. Executive Summary

**InfraTrove** là website cung cấp **free online tools** giúp developers, IT professionals và người làm việc với dữ liệu, văn bản, web giải quyết các tác vụ nhỏ hằng ngày: tạo password, so sánh text, format JSON, parse cron, convert Unix time, encode/decode dữ liệu, v.v.

Chiến lược kinh doanh:

```text
Search intent / direct visits
          ↓
Useful, fast, free tool pages  ←→  Helpful articles / references
          ↓
Organic traffic + repeat usage
          ↓
Context-appropriate display advertising
          ↓
Revenue − operational costs = operating profit
```

**Định vị đề xuất (chưa cần chốt tagline):**

- Brand: **InfraTrove**
- Descriptive tagline: **Free Online Tools for Everyday Work**
- Alternative: **Fast, Private Tools for Developers and Beyond**
- Brand promise: **Open a tool, finish a task, leave with the result.**

Website phải có ích ngay cả khi người dùng không đọc blog, không đăng nhập và không xem quảng cáo. SEO là kênh acquisition; utility và tốc độ tạo khả năng quay lại.

## 1. Decision Log — Điều đã chốt, giả thuyết, điểm chưa biết

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| Tên thương hiệu **InfraTrove** | **Đã chốt** | Sử dụng thống nhất trên site và content |
| Domain `infratrove.com` | **Ứng viên đã kiểm tra khả dụng bởi founder** | **Chưa xác minh đã mua / sở hữu**, cần kiểm tra lần cuối và trademark |
| Thị trường English-speaking | **Đã chốt định hướng** | Không giới hạn chỉ Mỹ; ưu tiên nội dung tiếng Anh |
| Free, no-login online tools | **Đã chốt định hướng** | Không đặt core utilities sau paywall |
| SEO + display ads | **Đã chốt định hướng** | RPM và traffic thực tế chưa biết |
| Blog gắn với tools | **Đã chốt định hướng** | Hướng dẫn, examples, troubleshooting, evergreen |
| Cheat Sheets / Examples | **Đề xuất mở rộng** | Chỉ publish khi có giá trị riêng và SEO evidence |
| Tool catalog và thứ tự mở rộng | **Cập nhật 2026-10-26** | 12 tools đã triển khai, gồm đợt mở rộng 4 tools tại §5.2; hàng đợi tiếp theo tại §5.3; chưa xác thực cơ hội SEO |
| Design tokens, logo, framework | **Đề xuất** | Có thể điều chỉnh sau prototype |
| Target 100.000 pageviews/tháng | **Business aspiration** | Không có bảo đảm đạt được; không phải mục tiêu bắt buộc cho launch |
| Mốc 24–36 tháng lên 100K PV/tháng | **Kịch bản hoạch định, độ tin cậy thấp** | Không phải thống kê hay dự báo được xác minh |

**Research gaps:** Search volumes, KD, CPC, SERP composition theo quốc gia, repeat usage thực tế, Page RPM, Google indexation outcomes, ad network eligibility đều **chưa được đo/xác minh**. Tuyệt đối không trình bày số liệu giả định như dữ liệu thị trường.

## 2. Goals, Non-goals và nguyên tắc sản phẩm

### 2.1 Goals

1. Đáp ứng một tác vụ rõ ràng trong vài giây và giảm số thao tác cần thiết.
2. Thu hút organic clicks đến từng tool hoặc hướng dẫn nhờ tính hữu ích thực tế.
3. Tạo repeat visits qua favorites, consistent UX và công cụ dùng thường xuyên.
4. Mở rộng catalog với chất lượng đồng đều, chi phí phát triển/bảo trì thấp.
5. Monetize bằng Ads **không phá hỏng tác vụ chính**.
6. Duy trì quyền riêng tư: dữ liệu được người dùng paste/upload ưu tiên ở trong browser.
7. Cho phép mở rộng qua các topic clusters có liên quan; không cần trở thành SaaS.

### 2.2 Non-goals trong giai đoạn đầu

- Không user accounts, subscription, billing, multi-tenant, team management.
- Không cloud cost estimation, infrastructure monitoring, alerting service, hosted API platform.
- Không AI content generation cần inference trả phí.
- Không xây đủ 100 tools chỉ để có nhiều indexed URLs.
- Không tạo hàng nghìn programmatic pages từ những keyword biến thể gần như giống nhau.
- Không triển khai server-side file processing hoặc lưu dữ liệu người dùng nếu không có nhu cầu mạnh.
- Không làm các financial/medical decision calculators rủi ro cao nếu chưa có expertise và validation riêng.

### 2.3 Product principles

- **Task first:** Công cụ ở đầu trang, không bị che bởi lời giới thiệu dài.
- **Fast by default:** Ít JavaScript, tối ưu Core Web Vitals, không render nặng vô lý.
- **No signup:** Không cần email, tài khoản để sử dụng.
- **Private by design:** Xử lý tại client với các tool có thể làm được.
- **Correctness over catalog size:** Edge cases, error messages và tests là yêu cầu bắt buộc.
- **Accessible & keyboard-friendly:** Người dùng dùng được trên desktop/mobile, bàn phím và screen reader.
- **Search useful, not search-spam:** Mỗi URL có giá trị riêng và intent rõ.
- **Ads never block utility:** Tránh quảng cáo sát các nút copy/generate và vùng nhập liệu.

## 3. Audience & Jobs-To-Be-Done

### 3.1 Primary personas

| Audience | Công việc lặp lại | Tools phù hợp |
|---|---|---|
| Software Developers | Debug JSON/API, encode values, UUID, JWT, regex | JSON Formatter, Base64, UUID, JWT Decoder, Regex Tester |
| DevOps / SRE / Sysadmins | Schedule jobs, parse timestamps, compare config/log, subnet | Cron Parser, Timestamp, Text Compare, CIDR |
| QA / Test Engineers | So sánh responses, tạo mock identifiers, test format | Text/JSON Compare, UUID, CSV Cleaner |
| Data Analysts / Operations | Clean text/CSV, convert structures, format output | CSV Cleaner, JSON ↔ CSV, Remove Duplicates |
| Web Developers / Site Owners | Format web data, preview metadata, optimize assets | URL Encoder, Meta Preview, Favicon, Image utilities |

### 3.2 Secondary personas

Students, technical writers, content editors, digital marketers, everyday users cần các tác vụ đơn giản như word counter, QR code, password generator, text cleanup. Chỉ mở rộng vào nhóm này khi keyword evidence và mức phù hợp brand ủng hộ.

### 3.3 Core user journeys

1. **Search → Tool:** Google query `cron expression generator` → tool page → paste/generate expression → copy → hoàn tất.
2. **Blog → Tool:** Search `why is my json invalid` → đọc hướng dẫn có ví dụ → mở JSON validator với sample input → sửa lỗi.
3. **Bookmark → Repeat:** Người dùng bookmark Text Compare hoặc lưu Favorite → quay lại trực tiếp → hoàn tất mà không login.
4. **Related workflow:** JSON Formatter → JSON Diff → JSON to CSV với liên kết hữu ích, không ép chuyển trang.

## 4. Information Architecture / Sitemap

```text
/
├── /tools/                              # All tools directory
│   ├── /tools/text-compare/
│   ├── /tools/json-formatter/
│   ├── /tools/cron-generator/
│   ├── /tools/unix-timestamp-converter/
│   ├── /tools/password-generator/
│   ├── /tools/base64-encoder-decoder/
│   ├── /tools/url-encoder-decoder/
│   ├── /tools/uuid-generator/
│   └── ... additional validated tools
├── /tools/category/{category-slug}/    # Chỉ tạo nếu category có nội dung hữu ích
├── /blog/                               # Guides, how-to, troubleshooting
│   └── /blog/{article-slug}/
├── /cheatsheets/                        # OPTIONAL: phase 2, không tạo trang rỗng
│   └── /cheatsheets/{topic-slug}/
├── /examples/                           # OPTIONAL: phase 2, không tạo trang rỗng
│   └── /examples/{topic-slug}/
├── /about/
├── /contact/
├── /privacy/
├── /terms/                               # Khi phù hợp với vận hành và ad policy
├── /404
├── /robots.txt
└── /sitemap.xml
```

**Routing conventions:** Lowercase kebab-case; một canonical URL cho mỗi tool; nhất quán trailing-slash policy; không index search/filter/query URLs có nội dung trùng; không tự tạo empty category pages. `/search/` nếu có chỉ là UX functionality, không cần index.

### 4.1 Top navigation — launch

- Logo **InfraTrove** (về homepage)
- **Tools** (directory + categories)
- **Blog**
- Global Search / command palette
- **Favorites** (locally saved, không account)
- Theme toggle (nếu có dark mode)

Chưa đưa `Cheat Sheets`, `Examples` lên navigation chính cho đến khi có đủ nội dung đáng kể. Footer chứa About, Contact, Privacy, Terms và những nhóm điều hướng thật sự hữu ích.

### 4.2 Taxonomy — candidate categories

- **Text & Comparison**
- **JSON, CSV & Data**
- **Encode & Decode**
- **Generators & Security**
- **Time & Scheduling**
- **Web & Frontend**
- **Networking & System**
- **Calculators & References** (future, chỉ khi có nội dung phù hợp)

Categories là tổ chức nội dung, **không phải quota bắt buộc** phải lấp đầy.

## 5. Feature Portfolio & Priority

**Cập nhật 2026-10-26:** Danh sách dưới đây phân biệt công cụ đã có và backlog sẽ làm. Thứ tự mở rộng dựa trên nghiên cứu định tính DevToys, IT-Tools, Genie9 và độ phù hợp với một solo founder làm browser-based utilities cho dev/DevOps. Đây là **ưu tiên sản phẩm**, không phải thứ hạng traffic hay kết quả keyword validation.

### 5.1 Current catalog — 12 tools đã triển khai

Đối chiếu với `src/data/tools.ts` và các route hiện có. Có implementation không đồng nghĩa đã public launch hoặc đã xác thực SEO.

| # | Tool | URL | Phạm vi hiện có |
|---|---|---|---|
| 1 | Text Compare / Diff | `/tools/text-compare/` | Line/word diff; side-by-side và unified; tùy chọn ignore case/whitespace |
| 2 | JSON Formatter & Validator | `/tools/json-formatter/` | Format, minify và validate trong một tool |
| 3 | Cron Expression Generator / Parser | `/tools/cron-generator/` | Unix 5 fields, giải nghĩa và preview 5 lần chạy kế tiếp |
| 4 | Unix Timestamp Converter | `/tools/unix-timestamp-converter/` | Seconds/milliseconds ↔ ngày giờ; UTC/local/ISO |
| 5 | Password Generator | `/tools/password-generator/` | Random password; passphrase và bulk chưa triển khai |
| 6 | Base64 Encoder / Decoder | `/tools/base64-encoder-decoder/` | UTF-8 text; standard Base64 và Base64URL |
| 7 | URL Encoder / Decoder | `/tools/url-encoder-decoder/` | Percent-encode/decode URL component |
| 8 | UUID Generator | `/tools/uuid-generator/` | UUID v4, tạo 1–100 giá trị mỗi lượt |
| 9 | YAML ↔ JSON Converter | `/tools/yaml-json-converter/` | Chuyển hai chiều, copy/download; YAML 1.2 core, không aliases/custom tags |
| 10 | JWT Decoder | `/tools/jwt-decoder/` | Header/payload, NumericDate UTC; không verify chữ ký |
| 11 | Storage Unit Converter | `/tools/storage-unit-converter/` | SI/IEC, phép tính phân số chính xác, kết quả 9 chữ số thập phân |
| 12 | Hash & Checksum | `/tools/hash-checksum/` | SHA-256/SHA-512 cho text/file, đối chiếu checksum; file tối đa 32 MiB |

### 5.2 Completed batch — 4 tools mở rộng ngày 2026-10-26

**Trạng thái: đã triển khai.** Catalog tăng từ 8 lên 12 tools, kèm 4 hướng dẫn có đủ bản Anh/Việt. Các slug dưới đây đã có route hoạt động. YAML giới hạn 100.000 ký tự, không aliases/custom tags; Hash giới hạn file 32 MiB. Không có placeholder trong directory.

| Thứ tự | Tool | Slug | Phạm vi bản đầu | Lý do ưu tiên |
|---|---|---|---|---|
| 1 | YAML ↔ JSON Converter | `yaml-json-converter` | Chuyển hai chiều, báo lỗi, copy/download | Sát config, Kubernetes, CI/CD và API; bổ sung JSON tool hiện có |
| 2 | JWT Decoder | `jwt-decoder` | Header/payload; đọc `exp`, `iat`, `nbf`; hiển thị chưa verify chữ ký | Tác vụ debug authentication rõ; tận dụng cluster JSON/Base64/timestamp |
| 3 | Storage Unit Converter | `storage-unit-converter` | Bytes và các đơn vị SI/IEC; hiển thị nhiều kết quả cùng lúc | Hữu ích khi đọc disk usage, quota và backup; phạm vi nhỏ, ít bảo trì |
| 4 | Hash & Checksum | `hash-checksum` | SHA-256/SHA-512 cho text hoặc file; đối chiếu expected checksum | Kiểm tra artifact/download/backup; kết quả trả lời trực tiếp khớp hay không |

**Điều chỉnh sau khi xem Genie9:** Storage Unit Converter được đưa lên trước SQL Formatter. Hash bao gồm workflow kiểm tra file, không chỉ sinh một chuỗi hash. Đợt này không thêm backend, tài khoản, subscription hay third-party scripts vào tool pages.

### 5.3 Next queue — công cụ sẽ làm tiếp

**Trạng thái: ưu tiên tiếp theo, chưa triển khai; không gắn ETA hoặc yêu cầu hoàn thành đồng loạt.** Đánh giá lại theo phản hồi và dữ liệu tìm kiếm thực tế sau mỗi đợt.

| Thứ tự | Tool | Phạm vi bản đầu / lý do |
|---|---|---|
| 1 | Upload / Restore Time Calculator | Dung lượng + tốc độ truyền + hiệu suất giả định → thời gian ước tính; phân biệt bits/bytes và SI/IEC. Dùng chung phép đổi đơn vị với Storage Converter |
| 2 | SQL Formatter | Format query, chọn dialect được hỗ trợ rõ ràng; không thực thi SQL |
| 3 | JSON ↔ CSV Converter | Chuyển hai chiều; header/delimiter rõ; preview bảng; giữ Unicode và ô có dấu phẩy/xuống dòng |
| 4 | Regex Tester | JavaScript regex, flags, matches/groups, replace preview; chạy trong Worker có timeout |
| 5 | IPv4 / CIDR Calculator | Network, mask, range và kiểm tra IP thuộc subnet; IPv6 để riêng |
| 6 | chmod Calculator | Quyền Unix dạng checkbox ↔ octal ↔ symbolic; không chạy lệnh trên host |

### 5.4 Later shortlist — đã sàng lọc, chưa lên lịch

| Tool | Hướng xem xét |
|---|---|
| Text Utilities | Gộp case conversion, sort/deduplicate lines, đếm words/characters và cleanup; không tách mỗi thao tác thành một trang |
| HTML Escape / Unescape | Encode/decode HTML entities; output luôn là text, không thực thi markup |
| QR Code Generator | QR tĩnh cho URL, text, Wi-Fi; export PNG/SVG; không dịch vụ redirect hoặc tracking |
| JSON Diff | Structured differences; tách rõ với Text Compare, quy định semantics của array/key order |
| Backup Storage Calculator | Source size, change rate, retention; công khai giả định compression/dedup và giới hạn mô hình |

### 5.5 Other ideas — chưa chọn

- **Data:** XML Formatter, XML ↔ JSON, CSV Cleaner/Deduplicator, TSV ↔ CSV, JSONPath, JSON Schema, JSON Lines ↔ Array, JSON to Markdown/TypeScript, Mock Data, Diff CSV.
- **Text:** Join/Split Lines, Find & Replace, Slug Generator, Markdown Table, Lorem Ipsum, Unicode Inspector.
- **Encoding / generators:** Hex/Text, Number Base Converter (một tool cho nhiều cơ số), ULID, random string, barcode, HMAC, Nano ID.
- **Time:** Date Difference, Timezone Converter, Working Days, Duration, Unix/Quartz/AWS cron dialects, epoch microseconds/nanoseconds.
- **Web / images:** Query String Parser, Markdown Preview, Color Contrast, HTML Formatter, CSS Minifier, favicon, image resize/convert, EXIF, Open Graph/Meta Preview, Robots.txt Tester.
- **Network / references:** Subnet Overlap, IPv4 ↔ Integer, IPv6 utilities, PEM/Certificate Decoder, HTTP Status Codes, Cron/Regex/Git cheat sheets, MIME/ASCII tables.

Không đưa PDF/video/Office processing, image editor đầy đủ, playground, health/fun calculators hoặc các network probes cần backend vào đợt mở rộng này. Các hướng đó cần một quyết định phạm vi riêng.

### 5.6 Scope rules và bằng chứng lựa chọn

- Một tác vụ có nhiều chế độ dùng một tool: encode/decode, JSON format/minify/validate, YAML ↔ JSON, JSON ↔ CSV và các thuật toán hash không tự động thành nhiều route.
- JSON Minifier, Base64URL và Cron Execution Preview đã nằm trong tools hiện có; không đếm lại thành backlog mới.
- Input/output của mọi tool chạy trong browser memory; không upload, gọi `/api/*`, log hoặc lưu payload vào URL/web storage. Chỉ theme, sidebar và favorite IDs được lưu theo quy tắc hiện tại.
- Chỉ publish tool có implementation và kiểm tra tương ứng; registry runtime vẫn chỉ liệt kê các tool hoạt động.
- Mỗi tool mới có hướng dẫn tiếng Anh và tiếng Việt theo quy tắc repo, ví dụ có thể chạy, giới hạn chính xác và related tools theo tác vụ.
- Chưa có search volume, KD, traffic hoặc conversion data xác thực cho các tool mới. Không lấy số GitHub stars, nhãn “Popular/Most Used” hoặc số tool của đối thủ làm bằng chứng thứ hạng nhu cầu.

**Nguồn nghiên cứu đọc ngày 2026-10-26:**

| Nguồn | Dùng để quyết định | Giới hạn |
|---|---|---|
| [DevToys](https://github.com/DevToys-app/DevToys) và [tool registry IT-Tools](https://github.com/CorentinTh/it-tools/blob/main/src/tools/index.ts) | Đối chiếu độ phủ các nhóm tác vụ dev/DevOps | Catalog không phải số lượt dùng từng tool hoặc keyword volume |
| [Genie9 Workspace](https://genie9.com/workspace), [Storage Converter](https://genie9.com/workspace/converter/storage-converter), [File Checksum](https://genie9.com/workspace/security/file-checksum) | Đẩy Storage lên đợt đầu; chọn workflow file + expected checksum và cụm storage → transfer time → checksum | Chưa kiểm chứng toàn bộ thuật toán hoặc hành vi network; trang chi tiết Upload/Restore Time chưa tải được qua trình đọc web, mới đọc mô tả catalog |
| [NIST binary prefixes](https://pml.nist.gov/cuu/Units/binary.html) | Phân biệt GB/MB với GiB/MiB trong Storage và Transfer Time | Khi triển khai cần test vectors cho từng đơn vị; không dùng nhãn “GB = 1024 MB” |

## 6. Functional Specification — core tools và các đợt mở rộng

Một trang tool phải hoạt động được **không cần đăng nhập** và có input sample để thử ngay. Input/output không gửi tới analytics, log, server hoặc `/api/*`. T01–T08 là đặc tả core; không dùng danh sách tính năng mong muốn dưới đây để suy ra mọi extension đã được triển khai. Phạm vi hiện có và thứ tự mở rộng theo §5.

### T01 — Text Compare / Diff

**User job:** So sánh hai đoạn text / configs / logs, xác định phần được thêm, xóa và sửa.

- Hai input panes: **Original** và **Changed**; paste, clear, swap panes.
- Diff view: **side-by-side** và **unified** (có thể ưu tiên side-by-side ở desktop; mobile chuyển unified).
- Highlight mức line và token/character khi có thể, đảm bảo tính đọc được.
- Toggles: ignore whitespace, ignore case; nêu rõ ảnh hưởng lên kết quả.
- Summary: added/removed/changed lines; copy result hoặc download diff text (nếu hỗ trợ).
- Input demo + empty, identical, different và large-text states.
- Local-only processing; không tự lưu hai đoạn text nhạy cảm vào history.
- **Acceptance samples:** same text → no differences; CRLF vs LF xử lý nhất quán; Unicode text; whitespace-only differences phản hồi đúng theo toggle.

**SEO intent examples:** `text compare online`, `compare two texts`, `text diff checker` (cần kiểm tra search volume/SERP).

### T02 — JSON Formatter & Validator

**User job:** Paste JSON để đọc dễ hơn, minify, kiểm tra lỗi syntax.

- Input text editor và output code view; Format, Minify, Copy, Reset.
- Syntax validity status rõ ràng; line/column hoặc offset khi parser hỗ trợ chính xác.
- Options: indentation 2/4 spaces (không cần vô số tùy chọn); demo JSON.
- Cho biết JSON hợp lệ nhưng không tự ý sửa hoặc giả định key order.
- Không execute nội dung JSON. Hạn chế kích thước và báo lỗi dễ hiểu với input quá lớn.
- Client-side; không lưu pasted secrets trong URL, logs, analytics hay localStorage.
- **Acceptance samples:** valid objects/arrays/primitives; invalid trailing comma; malformed quotes; escaped Unicode; very large JSON trong giới hạn đã định.

**P1 add-on:** Tree explorer, JSON Repair (nên là chức năng riêng nếu có search intent và tính đúng đắn).

### T03 — Cron Expression Generator / Parser

**User job:** Hiểu lịch chạy và tạo cron expression đúng với môi trường.

- Launch mặc định hỗ trợ **Unix-style five-field cron**: minute / hour / day of month / month / day of week; ghi rõ dialect.
- Expression input + visual selectors; validation từng field; human-readable explanation.
- Hiển thị **next N execution times** với timezone được chọn (giá trị N cố định hợp lý, ví dụ 5–10).
- Timezone selector tối thiểu UTC / browser timezone; giải thích DST và những trường hợp thời gian bị skip/repeated.
- Sample presets: every 5 minutes, daily, weekday, first day of month.
- Copy expression; không cố convert âm thầm giữa các cron dialects.
- **Acceptance samples:** `*/5 * * * *`, `0 0 * * *`, `0 9 * * 1-5`, invalid range, step value zero, DST transition.
- **Note:** Cron flavors khác nhau ở day-of-month/day-of-week semantics và nhiều chi tiết; cần chọn engine có specs/test vectors rõ trước triển khai.

**P2:** Quartz / AWS EventBridge cron dialects, comparison, timezone-aware conversions — chỉ khi có nhu cầu.

### T04 — Unix Timestamp Converter

**User job:** Chuyển Unix epoch sang thời gian dễ đọc và ngược lại.

- Chấp nhận timestamp ở đơn vị **seconds** và **milliseconds**; cho phép chọn rõ đơn vị.
- Render UTC, local time, ISO 8601, copy từng định dạng.
- Ngược lại: Date/time + timezone → timestamp seconds/milliseconds.
- Current timestamp live/readable, sample values, quick copy.
- Báo lỗi với số ngoài supported date range; tránh suy đoán nhầm đơn vị gây sai kết quả.
- **Acceptance samples:** epoch zero, negative timestamp khi browser hỗ trợ, values in seconds vs milliseconds, DST boundary, invalid date.

### T05 — Password & Passphrase Generator

**User job:** Tạo password, passphrase hoặc random token an toàn nhanh chóng.

- Modes: strong random password, word-based passphrase (nếu có wordlist phù hợp), random token.
- Password options: length, uppercase/lowercase/digits/symbols, exclude confusing characters.
- Generate, regenerate, copy; có thể bulk generation **giới hạn số lượng** để tránh làm đơ UI.
- Sử dụng **cryptographically secure random API** (`crypto.getRandomValues()` hoặc tương đương); không dùng `Math.random()`.
- Nếu ánh xạ byte vào alphabet, tránh modulo bias đáng kể (ví dụ rejection sampling).
- Không ghi password vào URL, analytics, logs, web storage, browser history; không tự phục hồi sau reload.
- Hiển thị lời nhắc về clipboard / screen sharing và khuyến nghị dùng password manager khi phù hợp.
- **Acceptance samples:** output đủ chiều dài, đáp ứng charsets đã chọn, xử lý trường hợp không chọn charset, cryptographic randomness.

### T06 — Base64 Encoder / Decoder

**User job:** Encode/decode text phục vụ APIs và dữ liệu thử nghiệm.

- Tabs Encode/Decode; hỗ trợ Unicode UTF-8 đúng chuẩn, không làm mất dữ liệu.
- Copy output, clear, swap direction, example string.
- Base64URL là variant riêng hoặc option rõ ràng; phân biệt padding semantics.
- Chỉ decode khi input hợp lệ; hiển thị lỗi invalid alphabet/padding tùy chế độ.
- Không khẳng định Base64 là encryption; cảnh báo không paste secrets nếu không tin cậy thiết bị/trình duyệt.
- **Acceptance samples:** ASCII, Vietnamese Unicode, emoji, empty input, malformed Base64, Base64URL strings.

### T07 — URL Encoder / Decoder

**User job:** Escape hoặc decode URL components mà không làm sai query strings.

- Encode/decode **URL component** là mặc định; giải thích sự khác nhau với encode toàn URL.
- Query string parser: P1 (không trộn vào UX mặc định nếu dễ gây nhầm).
- Copy output, swap, example inputs; validate percent encoding.
- Giải thích `%20` và `+` khác nhau trong một số form-encoding contexts.
- **Acceptance samples:** spaces, reserved characters, Unicode, malformed `%` escapes, query parameters.

### T08 — UUID Generator

**User job:** Tạo UUID để test data, identifiers và development.

- Mặc định **UUID v4**, dùng cryptographically secure browser API.
- Generate one hoặc small batch; copy, regenerate; lowercase/uppercase display optional.
- Ghi rõ version, format và không khẳng định uniqueness tuyệt đối.
- **Acceptance samples:** RFC-compliant UUID v4 format, valid version/variant bits, copy output, bulk limit.
- **P2:** UUID v7/ULID chỉ sau khi tests, specs và search intent rõ.

### 6.1 Expansion requirements — theo thứ tự tại §5

Bốn tool đầu của bảng đã có implementation theo §5.2; sáu tool tiếp theo vẫn là yêu cầu cho hàng đợi §5.3. Không suy ra các mục backlog còn lại đã triển khai.

| Tool | Must-have bản đầu | Giới hạn / tính đúng đắn |
|---|---|---|
| YAML ↔ JSON Converter | Safe parsing, lỗi có vị trí, chuyển hai chiều, copy/download | Không execute tags; giới hạn alias expansion, nesting và input; nêu rõ comment/anchor/type không round-trip nguyên vẹn |
| JWT Decoder | Header/payload local; `exp`/`iat`/`nbf` dễ đọc; không lưu token | Decode không verify signature; không tự fetch JWKS; không kết luận token đáng tin từ nội dung decode |
| Storage Unit Converter | Bytes, kB/MB/GB/TB và KiB/MiB/GiB/TiB; nhiều output đồng thời | SI theo 1000, IEC theo 1024; reject giá trị không hợp lệ; precision và rounding rõ |
| Hash & Checksum | Text/file, SHA-256/SHA-512, copy và expected-hash comparison | Giới hạn bộ nhớ/file size rõ; dùng reference vectors; hash không phải password hashing; checksum match không tự chứng minh nguồn gốc file |
| Upload / Restore Time Calculator | Dung lượng, bandwidth, efficiency; thời gian lý thuyết và ước tính | Phân biệt Mbps/MB/s; bandwidth > 0; 0 < efficiency ≤ 100%; không đo mạng hoặc hứa tốc độ thực tế |
| SQL Formatter | Chọn dialect, format/copy, input giữ nguyên khi lỗi | Không thực thi query; không gọi DB; chỉ nhận dialect parser hỗ trợ |
| JSON ↔ CSV Converter | Hai chiều, header/delimiter, preview, copy/download | Quoted commas/newlines, Unicode, kiểu dữ liệu/nested objects có quy tắc rõ; CSV formula injection trong output xuất cho spreadsheet phải được xử lý minh bạch |
| Regex Tester | Pattern + flags + text, matches/groups, replace preview | ECMAScript flavor; Worker + timeout/terminate; giới hạn input để không treo UI |
| IPv4 / CIDR Calculator | Network, mask, range, IP membership | `/0`, `/31`, `/32`, IPv4 invalid; không khái quát usable host count cho mọi môi trường/cloud |
| chmod Calculator | Quyền owner/group/other ↔ octal ↔ symbolic | Bản đầu chỉ mode bits `000`–`777`; ACL và special bits chưa hỗ trợ; không chạy command |
| Later shortlist | Tham khảo phạm vi §5.4 | Chưa khóa đặc tả hoặc thứ tự triển khai |

### 6.2 Shared Tool Shell — chức năng dùng chung

| Feature | Priority | Behavior |
|---|---|---|
| Copy buttons | Launch | Instant copy with clear success/error feedback |
| Reset / Clear | Launch | Không reload trang để xóa; tránh accidental loss với data lớn |
| Examples / Load demo | Launch | User test ngay được; ví dụ non-sensitive |
| Inline validation | Launch | Nêu lỗi chính xác, giữ nguyên input để người dùng sửa |
| Related tools | Launch | 3–5 links có ngữ cảnh, không thành link farm |
| Favorite / Unfavorite | Launch | Lưu **tool IDs** locally, không lưu user inputs |
| Keyboard support | Launch | Tab order logic, shortcut không chặn nhập text |
| Global search | Launch | Search theo tool name, synonyms, category |
| Dark mode | Nice-to-have | Theo system preference, user override được |
| PWA/offline | P2 | Chỉ nếu repeat usage thực tế xác nhận giá trị |
| Chaining tools | P2 | Chỉ chuyển data sau user action, không tự chia sẻ |
| Usage history | Không launch | Privacy, complexity; nếu làm phải explicit opt-in |

## 7. Product UX & Visual Design

### 7.1 Design direction

**Hướng thẩm mỹ:** *Calm, minimal, practical developer utility*. Không quá cyberpunk, không dashboard doanh nghiệp, không gradient neon nặng. Site phải đáng tin, dễ scan, có không gian cho tool và nội dung.

- **Desktop:** Tool ở trung tâm, một hoặc hai panes rộng, sidebar tùy theo category/related info.
- **Mobile:** Single column; input và output stack dọc, nút hành động đủ lớn; không ép side-by-side diff quá hẹp.
- **Light mode:** Default để đọc blog dễ; dark mode có thể bổ sung nếu effort thấp.
- **Brand personality:** Gọn, rõ, nhanh, thực dụng, không quảng cáo bằng lời hứa quá đà.

### 7.2 Design tokens — đề xuất, chưa final

| Token | Light suggestion | Dark suggestion | Purpose |
|---|---|---|---|
| `--background` | `#F8FAFC` | `#0B1220` | Page background |
| `--surface` | `#FFFFFF` | `#111B2C` | Cards/editors |
| `--text` | `#0F172A` | `#E5EDF8` | Primary text |
| `--muted` | `#526077` | `#9AA8BE` | Secondary text |
| `--accent` | `#0E7490` | `#38BDF8` | Primary accent |
| `--border` | `#E2E8F0` | `#28354A` | Subtle outlines |
| `--success` | `#15803D` | `#4ADE80` | Success states |
| `--danger` | `#B91C1C` | `#F87171` | Error states |

- Text font: system UI hoặc một web font cực nhẹ; code/editor: system monospace hoặc monospace tối ưu tải.
- Container max-width đề xuất 1120–1280px, nhưng **tool work area** có thể rộng hơn article.
- Spacing theo thang 4/8/12/16/24/32 px; góc bo khoảng 8–12 px; borders nhẹ, hạn chế shadows.
- Focus-visible rõ ràng; contrast kiểm thử theo WCAG; không chỉ dùng màu để biểu diễn lỗi.
- Icons đơn giản, nhất quán; không dùng logo của bên thứ ba tùy tiện.

### 7.3 Homepage — nội dung và layout

```text
┌──────────────────────────────────────────────────────────────────┐
│ InfraTrove     Tools   Blog        [ Search tools... ⌘K ]  ☆    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│       Free Online Tools for Everyday Work                        │
│       Format, compare, generate and convert — quickly.           │
│                                                                  │
│       [ Search across tools...                         ]         │
│                                                                  │
│       Popular: JSON Formatter · Text Compare · Cron · Password    │
│                                                                  │
│  Browse by Category                                              │
│  [Text] [Data] [Encode] [Generators] [Time] [Web]                │
│                                                                  │
│  Popular Tools                                                   │
│  [ JSON Formatter ] [ Text Compare ] [ Cron Generator ]         │
│  [ Unix Timestamp ] [ Password Generator ] [ Base64 ]            │
│                                                                  │
│  Latest Practical Guides                                         │
│  [article] [article] [article]                                    │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ About · Contact · Privacy · Terms                                │
└──────────────────────────────────────────────────────────────────┘
```

**Homepage requirements:** Tool search nổi bật; popular tools không cần đăng nhập; category browsing đơn giản; hero copy giải thích utility; blog teasers vừa phải; không nhồi keyword/ads ở vùng đầu khi mới vào.

### 7.4 Tools Directory

- Main heading `All Free Online Tools`.
- Global search/filter, category chips, tool cards có icon, title, one-line job description.
- Sort mặc định theo editorial order/usefulness, không cần fake `most popular` nếu chưa có data.
- Favorites section được ghim đầu khi có favorite.
- Nếu số tool dưới khoảng 15, không cần phức tạp hóa bằng pagination.
- Categories có mô tả ngắn hữu ích; tránh index category gần trống hoặc chỉ chứa duplicated excerpts.

### 7.5 Tool Detail Page — layout chuẩn

```text
┌──────────────────────────────────────────────────────────────────┐
│ Home > Tools > Data & Text > JSON Formatter                      │
│                                                                  │
│ JSON Formatter & Validator                        [☆ Favorite]  │
│ Beautify, minify and validate JSON directly in your browser.     │
│                                                                  │
│ ┌────────────── INPUT ─────────┐ ┌────── OUTPUT ─────────────┐    │
│ │ { pasted text }             │ │ { formatted text }        │    │
│ │                             │ │                           │    │
│ └─────────────────────────────┘ └───────────────────────────┘    │
│ [Load example] [Clear]                [Format] [Minify] [Copy]    │
│ Status: Valid JSON / Error message + location                   │
│                                                                  │
│ How to use this tool                                             │
│ Example / Common errors / Privacy note                          │
│                                                                  │
│ Related guides · Related tools                                   │
│ [Contextual, policy-compliant ad area if enabled]                │
└──────────────────────────────────────────────────────────────────┘
```

**Above the fold:** H1, short description, interactive tool. Tránh hero/banner đủ cao làm user phải scroll mới thấy tool.

**Below the tool:** How it works, valid use cases, 1–3 examples, edge cases/FAQ thật sự cần, privacy statement, related guides & tools; câu chữ riêng cho từng tool, không copy hàng loạt template rỗng.

**Editor UX:** Xử lý paste lớn an toàn; mỗi tool chỉ dùng editor complexity cần thiết. Input/Output có labels và keyboard access; copy feedback accessible; controls không bị ads làm lệch vị trí.

### 7.6 Blog / Article page

- H1, ngày cập nhật khi thực sự sửa đổi, author identity hoặc editorial attribution phù hợp.
- Table of contents chỉ với bài đủ dài; anchor links.
- Mở bài ngắn giải quyết intent, sau đó examples/runnable snippets + pitfalls.
- Inline CTA hữu ích: `Try this in InfraTrove Cron Generator`, không ép dùng tool khi không liên quan.
- Related posts/related tools cuối bài; code block có copy và syntax highlight nhẹ.
- Ads có thể chèn giữa các section có đủ khoảng cách; không chen vào code block hoặc che nội dung.

### 7.7 Cheat Sheets & Examples pages — phase 2

- Cheat sheets = reference nhanh, dễ copy, navigation theo section, có ví dụ thực hành.
- Examples = cấu hình/snippets thực sự chạy được, giải thích input/output và edge cases.
- Không tách 100 URLs chỉ thay một con số trong cron expression; ưu tiên một trang examples tổng hợp nếu intent gần nhau.
- Chỉ launch category khi có ít nhất vài trang chất lượng và keyword/UX justification.

### 7.8 Responsive, accessibility, interactions

- Keyboard-first: **Cmd/Ctrl+K** mở global tool search; Escape đóng modal; không đánh cắp shortcuts phổ biến trong editor.
- Mobile buttons đủ lớn; không tràn ngang các code blocks; scrollable panes khi cần.
- Labels gắn inputs; focus states rõ; status/errors thông báo có ý nghĩa cho assistive tech.
- Respect `prefers-reduced-motion`; không animation không cần thiết.
- Không dùng placeholder làm label duy nhất.
- Pasted data không tự biến mất khi xuất hiện lỗi, page layout shift hoặc refresh kết quả.

## 8. SEO & Content System

### 8.1 Core SEO strategy

- **Tool intent:** Mỗi trang trả lời một hành động rõ (`format JSON`, `compare text`, `generate UUID`).
- **Informational intent:** Blog giải thích use case, lỗi phổ biến, examples, edge cases.
- **Reference intent:** Cheat sheets/explanations nếu thật sự đem lại giá trị nhanh hơn blog.
- Một query cluster có thể dùng **một page** nếu intent gần nhau; không chia nhiều bài gần trùng để tăng page count.
- Ưu tiên US/UK/CA/AU trong nghiên cứu, nhưng không nhắm các khu vực bằng geotargeted duplicate pages.

### 8.2 Suggested topic clusters (cần keyword research)

| Core tool | Blog candidates | Future supporting content |
|---|---|---|
| Cron Generator | Cron Expression Examples; Cron Every 5 Minutes; Cron Timezone & DST Issues | Cron Cheat Sheet, Cron Dialect Comparison |
| JSON Formatter | Fix Invalid JSON; JSON vs YAML; Trailing Commas in JSON | JSON Syntax Cheat Sheet, JSON Diff, JSON↔CSV |
| Text Compare | How to Compare Two Text Files; Ignore Whitespace in Diff | JSON Diff, CSV Diff |
| Unix Timestamp | Seconds vs Milliseconds; Convert Epoch to UTC | Timezone Converter, Date Formats |
| Password Generator | Password vs Passphrase; Secure Random Passwords | Token Generator |
| Base64 | Base64 vs Base64URL; Common Base64 Decode Errors | JWT Decoder, URL Encoding |
| UUID | UUID v4 Explained; UUID vs ULID | ULID Generator |
| URL Encode | URL Encoding vs Form Encoding | Query String Parser |

Các topic này **chưa có verified search volume**; publish theo intent và dữ liệu SERP, không theo quota số bài.

### 8.3 On-page SEO template

**Tool page:**

- Title: `{Tool Name} — Free Online {Task} | InfraTrove` (tùy chỉnh từng trang, không ép mẫu nếu bị dài).
- Meta description: việc làm + lợi ích thực, không spam modifiers.
- Unique H1, one-liner trực tiếp, interactive main content.
- Clean URL, self-referencing canonical, Open Graph image phù hợp.
- Breadcrumb internal links có ý nghĩa; related tools/articles có kiểm soát.
- Semantic HTML; content quan trọng xuất hiện trong crawlable HTML, không chỉ JavaScript runtime.
- Structured data (ví dụ `SoftwareApplication`, `BreadcrumbList`, `BlogPosting`) **chỉ áp dụng khi đáp ứng hướng dẫn hiện hành**; không kỳ vọng tự động có rich result.

**Blog:**

- Tập trung tìm intent thực sự; answer early; ví dụ độc đáo và chính xác.
- Code/config snippets được test; liên kết đến tool nơi hữu ích.
- Biên tập, cập nhật khi specs thay đổi; không đổi `dateModified` giả.
- Tránh affiliate links không liên quan và nội dung được AI mass-generate không kiểm chứng.

### 8.4 Technical SEO requirements

- HTML crawlable: prerender/SSG/SSR tool landing pages; functionality có thể client-side.
- `robots.txt`, XML sitemap chỉ chứa canonical indexable pages.
- Proper status codes: 200, 301/308, 404, 410 khi hợp lý.
- Noindex trang rỗng, internal search, các parameter duplicates nếu tồn tại.
- Không block scripts/resources cần để Google hiểu nội dung.
- Mobile parity: nội dung và links cốt lõi hiện diện trên mobile.
- Structured breadcrumbs, descriptive alt text, accessible heading hierarchy.
- Core Web Vitals theo dữ liệu thực; tránh CLS do ads, fonts, code editors.
- Search Console để theo dõi indexing, queries, clicks, impressions và CTR.

### 8.5 Publishing quality checklist

- Intent rõ và có lý do riêng để index.
- Tool hoạt động chính xác; article snippets được test.
- Nội dung hữu ích vượt lên một landing page mỏng có vài trăm chữ chung chung.
- Dễ phân biệt tools có cùng chức năng; tránh cannibalization.
- Internal links đúng workflow, không auto-link spam.
- Không công bố search volume/KD/CPC khi không có nguồn và ngày đo.

## 9. Monetization — Display Ads First

### 9.1 Business model

- **Primary:** Contextual display ads khi site đủ điều kiện và có nguồn traffic phù hợp.
- **Optional secondary:** Affiliate links/sponsorship chỉ khi liên quan nội dung, công khai minh bạch; không bắt buộc.
- **Không nằm trong roadmap:** SaaS subscription, paid API, managed cloud services.
- **Không cam kết:** Việc có nhiều tool pages hoặc ad placements không bảo đảm có doanh thu đáng kể.

### 9.2 Ad placement policy cho InfraTrove

| Page | Ads approach đề xuất | Không được làm |
|---|---|---|
| Homepage | Có thể chưa đặt ads trong launch | Đặt banner che hero/search |
| Tool detail | Chỉ hiển thị ở vùng không cản trở tác vụ; có thể **không đặt ads ở những tool nhạy cảm** | Ads chen giữa input/output, sát Copy/Generate, popup khi paste |
| Blog detail | In-content placements tiết chế sau vài đoạn có giá trị; cuối bài | Ads giả làm code/output hoặc bít nội dung |
| Cheat sheets | Placement sau khu reference đầu tiên nếu có đủ content | Che bảng, gắn ads làm nhầm nút copy |
| Tools Directory | Chỉ khi UX và policy phù hợp | Ad cards không phân biệt với tool cards |

**Security note:** JavaScript quảng cáo bên thứ ba có thể cùng tồn tại với DOM của tool page. Không đưa ra lời hứa “mọi dữ liệu tuyệt đối chỉ mình bạn thấy” khi chưa audit script, CSP và isolation. Với password/JWT/secret-focused tools, ưu tiên **không nhúng third-party ad scripts** hoặc thiết kế kiến trúc cô lập hợp lý và kiểm thử kỹ trước khi quảng cáo.

### 9.3 Ad operations

- Kiểm tra chính sách của ad network tại thời điểm triển khai, không dựa vào một checklist cố định.
- Consent/Privacy/Cookie management theo vùng địa lý và yêu cầu nhà quảng cáo hiện hành.
- Dành sẵn kích thước cho ad units để tránh layout shift (CLS).
- Theo dõi page-level ad revenue khi nền tảng cho phép; xem ảnh hưởng lên UX/Core Web Vitals.
- Không ép auto-refresh ads, click bait, deceptive UI hay accidental clicks.

### 9.4 Financial modeling — không phải doanh thu dự báo

```text
Gross monthly display-ad revenue = (monthly pageviews / 1,000) × realized Page RPM
Operating profit before tax = ad revenue + other realized revenue − operating expenses
Economic profit = operating profit − imputed founder time cost
```

Ví dụ **toán học minh họa**: 100.000 pageviews/tháng × $2–$3 giả định Page RPM / 1.000 = **$200–$300 gross ads revenue/tháng**. Đây không phải benchmark hay kỳ vọng đã xác minh riêng cho InfraTrove.

**Phải tách** traffic, ads monetization, hosting/tools cost, taxes và founder time. Không có Page RPM, audience geography hoặc ad approval thực tế ở giai đoạn này.

## 10. Technical Architecture — đơn giản, tiết kiệm, không lock stack

### 10.1 Recommended architecture pattern

```text
        Search crawlers / users
                 │
          CDN + edge cache
                 │
  Static / prerendered HTML content
      ┌──────────┴────────────┐
      │                       │
 Tools landing pages      Blog / references
      │                       │
 Browser-side JS              Markdown/MDX-or-equivalent content
      │
 Local parsing / math / transforms
      │
 Clipboard / optional local preferences
```

- **Default:** Static/prerendered site + client-side tool logic.
- **No application backend** cho các tool không cần network/third-party processing.
- **No database** ở launch; favorites/theme/preferences lưu local khi cần.
- **Hosting:** Static hosting + CDN, tùy chọn provider sau khi so sánh cost/maintenance.
- **Content:** Repo-managed Markdown (hoặc CMS đơn giản nếu có lý do), git versioning, preview environment.
- **Tool registry:** Một nguồn dữ liệu duy nhất cho slug, title, category, description, related tools, SEO metadata và status.
- **Scalability:** Route-level code splitting; chỉ tải engine/editor cần cho tool đang mở.
- **Avoid overengineering:** Không microservices, queues, Kubernetes, auth server, custom analytics platform.

### 10.2 Conceptual project structure (không bắt buộc framework)

```text
infratrove/
├── site/                  # Layouts, pages, navigation, content rendering
├── tools/                 # Logic từng công cụ (pure functions where possible)
│   ├── text-compare/
│   ├── json-formatter/
│   ├── cron-generator/
│   └── ...
├── components/            # Shared Tool Shell, Editor, Buttons, Alerts
├── content/
│   ├── blog/
│   ├── cheatsheets/       # future
│   └── examples/          # future
├── registry/              # Tool metadata, categories, related content
├── styles/                # Theme tokens and UI foundation
├── tests/                 # Unit / integration / E2E / accessibility
├── public/                # Icons, share images, static assets
└── docs/                  # Spec, decision log, research, content standards
```

### 10.3 Performance / reliability requirements

- Ưu tiên Core Web Vitals hiện hành: LCP, INP, CLS; đo bằng field data khi có đủ traffic.
- Không nhúng heavy editors ở homepage hoặc mọi tool page nếu không cần.
- Cảnh báo input quá lớn; tools xử lý nặng có thể dùng Web Workers để không block main thread.
- Lazy-load content không thiết yếu, nhưng main functionality phải xuất hiện và usable sớm.
- No dependency on an external API for password/UUID/JSON/Base64/Text compare khi xử lý offline được.
- Error boundaries / graceful fallback; mỗi tool không làm crash toàn site.
- Content và JS release có rollback đơn giản; basic uptime/error monitoring của site chỉ phục vụ vận hành, **không phải sản phẩm monitoring bán cho users**.
- Build pipeline có lint, unit tests, type checks (nếu stack có types), E2E smoke và dependency audits.

### 10.4 Browser / capability support

- Hỗ trợ các evergreen browsers phổ biến, desktop và mobile.
- Clipboard API cần handling cho permission/secure context và có fallback UX khi thất bại.
- Crypto API cần secure context HTTPS; disable chức năng thay vì fallback sang randomness yếu.
- Date/timezone logic sử dụng IANA time zones nếu có; test DST và dữ liệu locale.
- Không ghi tool input hoặc output ra query string trừ một tính năng share rõ ràng, explicit và đã review privacy.

## 11. Privacy, Security & Trust

### 11.1 Data handling contract

| Data | Default behavior |
|---|---|
| Text/code/config user paste | Xử lý trong browser; không upload |
| Generated passwords / tokens | Chỉ ở memory để hiển thị/copy; không lưu tự động |
| JWT / encoded content | Decode tại client; không lưu, không log; không claim đã verify chữ ký |
| Favorites | Local storage chỉ chứa `tool_id` hoặc `slug` |
| Theme preference | Local storage/cookie cần thiết nếu phù hợp |
| Analytics | Chỉ metadata sự kiện, không input/output hoặc nội dung clipboard |
| Blog content | Public, build-time/content repo |
| Contact messages | Nếu thêm contact form cần privacy notice, anti-spam, data retention; có thể dùng email link ban đầu |

### 11.2 Mandatory security controls

- Dùng HTTPS và security headers/CSP phù hợp, review đặc biệt nếu có third-party ad scripts.
- Không render user-provided HTML hoặc SVG unsanitized dưới dạng trusted markup.
- Không execute pasted JSON/YAML/JS/regex từ inputs ngoài scope; regex cần sandbox/timeouts khi có tính năng test.
- Giới hạn input sizes và output quantities để chống crash trình duyệt.
- Không ghi secrets vào console/logs/error reporting/analytics.
- Kiểm soát third-party script access đến tool DOM; nêu privacy notice trung thực.
- Đối với file utilities tương lai: local file reading qua File API, explicit permissions; không âm thầm upload.
- Nếu sau này thêm server-side URL/network checker, phải thiết kế chống SSRF, DNS rebinding, internal IP access, redirect abuse và rate limits; **không thuộc launch**.
- Dependency provenance, license compliance, vulnerability review cho các engine parsing/diff/cron.

### 11.3 Trust pages

- **About:** InfraTrove là gì, miễn phí ra sao, contact và nguyên tắc bảo mật.
- **Privacy:** Dữ liệu tool input được xử lý như thế nào; analytics, cookies, ad partners; nội dung chính xác theo thực tế triển khai.
- **Contact:** Đường nhận feedback/bugs và privacy requests.
- **Terms:** Scope, reasonable use, limitations; review theo yêu cầu pháp lý liên quan.
- **Last updated:** Chỉ thay khi nội dung thực sự cập nhật.

## 12. Analytics & Measurement

### 12.1 Measurement stack — đề xuất

- **Google Search Console:** Queries, impressions, clicks, CTR, position *ước lượng* và indexing.
- **Web analytics:** Pageviews, engaged visits, return visits, traffic source, device, geography; chọn công cụ phù hợp privacy/consent.
- **Event tracking:** Chỉ đo cách dùng tool; **không bao giờ** gửi pasted content hoặc output.
- **Ad dashboard:** Revenue, realized Page RPM, ad eligibility, page performance khi có ads.
- **Operational metrics:** JS runtime errors, web performance, broken pages (không chứa user input).

### 12.2 Suggested privacy-safe event schema

| Event | Allowed properties | Tuyệt đối không gửi |
|---|---|---|
| `tool_open` | `tool_id`, `category`, `source_page_type` | Input / output |
| `tool_action` | `tool_id`, `action_type` (`format`, `compare`, `generate`) | Text, JSON, password |
| `tool_success` | `tool_id`, `action_type`, `time_bucket` (optional) | Data contents, JWT |
| `tool_error` | `tool_id`, `error_code` (coarse), `action_type` | Raw error strings nếu có data |
| `copy_clicked` | `tool_id`, `output_kind` (enum) | Clipboard data |
| `favorite_toggled` | `tool_id`, `is_favorite` | User's other stored data |
| `related_content_click` | `from_slug`, `to_slug` | User text/query |

Sự kiện analytics phải tuân thủ consent khi có yêu cầu. Với những tool xử lý secrets, cân nhắc tắt event tracking hoặc chỉ giữ pageview aggregate, tùy threat model.

### 12.3 KPI hierarchy

| Layer | KPIs | Decision use |
|---|---|---|
| Discoverability | Indexed pages, GSC impressions, ranking queries | Tool/blog nào được Google khám phá |
| Acquisition | Organic clicks, organic sessions, landing pages | Chọn cluster đầu tư nội dung |
| Utility | Completed action proxy, copy interaction, client error rate | Tool có thực sự hoạt động và tạo giá trị |
| Retention | Return visit rates 7/30 ngày, direct/bookmark visits | Có tạo thói quen sử dụng không |
| Monetization | Page RPM, ad revenue, revenue/page family | Cluster nào tạo income thực tế |
| Efficiency | Dev+maintenance hours, hosting cost, cost/page | Có phù hợp solo founder không |

**Metrics caution:** GA4 `page_view`/views khác GSC clicks; không diễn giải 100.000 clicks = 100.000 pageviews hoặc ngược lại. Tránh tối ưu `tool_action` khiến UX trở nên rườm rà chỉ để tăng event counts.

## 13. Market Validation & Feature Selection

### 13.1 Weighted scoring for SEO + Ads

| Criterion | Weight | Evaluation question |
|---|---:|---|
| Search demand | 30% | Có truy vấn thật, recurring/evergreen không? |
| Organic competition accessibility | 25% | SERP có chỗ cho site mới? Search intent có click potential? |
| Ad monetization opportunity | 15% | Audience/geography phù hợp và pageview có thể monetize? |
| Build + maintenance feasibility | 15% | Có thể ship nhanh, client-side, ít bảo trì? |
| Repeat use | 10% | User có lý do quay lại? |
| Cluster expansion / internal linking | 5% | Có tool/blog adjacent thực sự hữu ích? |

Chỉ chấm định tính khi chưa có dữ liệu; kèm **evidence confidence** và những unknowns. Không tự tạo keyword volumes, KD/CPC hoặc competitor revenue.

### 13.2 Minimum validation card per tool

```text
Tool idea:
User & job:
Primary search intent:
Keyword variants (not necessarily separate pages):
Validated search volume / source / country / date: UNKNOWN until measured
SERP composition (top real domains/pages, device/geo/date): PENDING
Existing solutions & gaps:
Unique utility / UX differentiation:
Build complexity / maintenance:
Ads suitability / privacy constraints:
Blog / related cluster potential:
Qualitative score + confidence:
Decision: Test / Build / Defer / Reject
```

### 13.3 Cheapest useful experiments

1. Manual SERP audit nhóm từ khóa hẹp cho 8–12 tool candidates; đánh dấu pages thuộc giant sites vs independent utilities.
2. Keyword Planner/GSC (khi có)/third-party datasets có nguồn ngày và quốc gia; nếu không có paid data, ghi nhận UNKNOWN.
3. Dùng các tool cạnh tranh với cùng sample input, ghi lại UX friction, error handling và edge cases.
4. Publish một batch nhỏ tools + bài hỗ trợ; quan sát indexation, impressions, clicks, usage mà không đánh đồng các chỉ số.
5. Mở rộng thắng lợi đã thấy: cải thiện tool+cluster có query growth trước khi build thêm 20 tools mới.

## 14. Delivery Roadmap — không ràng buộc thời gian

**Baseline 2026-10-26:** 12 tools đã có implementation; trạng thái triển khai tools theo §5.1. Các phase dưới đây là khung phát hành/vận hành, không phải danh sách việc đều chưa làm. Thứ tự mở rộng catalog theo §5.2–§5.4; không suy ra public launch, keyword validation hoặc monetization đã hoàn tất.

### Phase 0 — Research & Scope Lock

**Deliverables:** Candidate inventory, 8–12 SERP audits, competitor gap notes, final Wave 1 selection, privacy/ad decisions, content cluster plan.

**Exit criteria:** Mỗi tool được chọn có task intent rõ, value proposition, testable behavior, và lý do tại sao đáng xây so với đối thủ.

### Phase 1 — Minimum Useful Site

- Homepage, navigation, directory, categories phù hợp, simple search, footer/trust pages.
- Tool shell và 8 tools core hiện có tại §5.1; review khả năng sẵn sàng public launch riêng với trạng thái implementation.
- 3–5 bài blog hữu ích gắn với core tool clusters (số lượng không phải SEO requirement).
- Responsive design, accessibility baseline, technical SEO, analytics và privacy baseline.
- Initial legal/policy review; không cần bật ads ngay nếu chưa đủ điều kiện.

**Exit criteria:** User có thể vào từ search, hoàn thành task, copy output, dùng mobile, không gặp core errors.

### Phase 2 — Content + Tool Expansion

- **Đã triển khai 12 tools**: 8 tools core và đợt mở rộng §5.2 gồm YAML ↔ JSON, JWT Decoder, Storage Unit Converter, Hash & Checksum. Đợt mở rộng có 4 hướng dẫn đủ bản Anh/Việt.
- Sau đó đánh giá hàng đợi §5.3, bắt đầu với Upload / Restore Time; không coi tổng số tool là quota hoặc thứ hạng SEO.
- Viết supporting guides thật sự trả lời search intent, thêm relevant internal links.
- Favorites và command search tối ưu dựa trên feedback.
- Theo dõi indexation và traffic theo từng landing page, không chỉ site aggregate.

**Exit criteria:** Một vài tool/blog pages có measured organic impressions/clicks và tín hiệu sử dụng hữu ích.

### Phase 3 — Ad Validation

- Chỉ đăng ký/tích hợp ad network khi đáp ứng chính sách tại thời điểm đó.
- Kiểm thử ad locations, privacy/consent, Page RPM, Core Web Vitals và UX.
- Không đánh đổi utility để tăng ad clicks; theo dõi negative feedback.

**Exit criteria:** Có đo được doanh thu thực tế và tác động ads đối với user experience.

### Phase 4 — Scale Based on Evidence

- Tăng catalog theo các profitable/useful clusters: Text & Data, Time & Scheduling, Web Publishing, Networking nếu phù hợp.
- Cân nhắc Cheat Sheets/Examples khi tìm được intent có giá trị riêng.
- Cập nhật/loại bỏ các trang lỗi thời hoặc thiếu giá trị; tránh mass publishing.

### Checkpoints — quản trị rủi ro, không phải lời hứa tăng trưởng

- **Sau launch 1–3 tháng:** Indexation/technical errors và usage correctness; ít dữ liệu không có nghĩa ngay là SEO thất bại.
- **Sau launch ~6 tháng:** Queries, impression trend, pages gaining clicks, ranking gaps, content quality, maintenance workload.
- **Sau 6–12 tháng:** Quyết định tăng đầu tư, thay đổi topic focus hoặc dừng những cluster không có tín hiệu.
- **Long-term aspiration:** 100.000 pageviews/tháng là business milestone, không phải outcome được bảo đảm; mọi timeline trước đây chỉ là giả định hoạch định.

## 15. Definition of Done & Quality Gates

### 15.1 Every tool page — DoD

- [ ] Core operation hoàn thành chính xác với sample data, edge cases và invalid inputs.
- [ ] Có ít nhất một automated test cho happy path và negative cases quan trọng.
- [ ] Client-only processing được kiểm tra thực tế ở Network tab khi sử dụng.
- [ ] Không leak inputs/secrets vào URL, logs, analytics hoặc error telemetry.
- [ ] Keyboard, responsive, screen-reader labels và copy feedback ổn.
- [ ] Input giữ nguyên khi lỗi; reset/copy/example actions hoạt động.
- [ ] Unique title, H1, meta description, canonical và indexable content.
- [ ] Tool được đăng ký trong directory/category và có related links hợp lý.
- [ ] Không quảng cáo cản thao tác; không layout shifts lớn.
- [ ] Nêu rõ limitations và supported formats/dialects.
- [ ] Không có third-party licensing/policy blockers chưa xử lý.

### 15.2 Every blog / reference page — DoD

- [ ] Search intent riêng và hữu ích, không doorway/duplicate.
- [ ] Examples/snippets đã test với versions được ghi rõ khi cần.
- [ ] Author/editorial responsibility và update date trung thực.
- [ ] Tool link đúng ngữ cảnh; nguồn references cho factual assertions.
- [ ] Accessibility/readability trên mobile và desktop.
- [ ] Indexed status, canonical và metadata đúng.

### 15.3 Site release checklist

- [ ] Domain ownership, SSL, DNS, redirects và basic availability đã xác nhận.
- [ ] About/Contact/Privacy/Terms đúng với sản phẩm thực tế.
- [ ] Search Console/site analytics setup hợp lệ với consent requirements.
- [ ] Sitemap/robots/canonical/404/links tested.
- [ ] No broken tool outputs; smoke test trên desktop/mobile.
- [ ] Security headers, dependencies và sensitive-input threat review.
- [ ] Ad policy/consent/ad scripts kiểm thử nếu đang bật quảng cáo.
- [ ] Lighthouse/lab checks + field monitoring plan, không dùng score lab thay cho trải nghiệm thật.

## 16. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Generic keywords quá cạnh tranh | Không nhận được organic traffic | Audit long-tail & real SERPs; ưu tiên unique functionality; validate trước build |
| Search chuyển thành AI/zero-click | Ít clicks hơn dự kiến | Tập trung interactive utility, return users, direct traffic |
| Ads RPM thấp | Traffic lớn mà doanh thu nhỏ | Monetization math thận trọng; tối ưu geo/content context theo dữ liệu thật, không promise RPM |
| Nhiều tool mỏng, trùng lặp | SEO/brand quality thấp | Quality gates, one intent per page, tránh scaled content spam |
| Security/privacy incident | Mất uy tín | Local-first, no secrets in telemetry, third-party scripts audit |
| Maintenance tăng khi catalog lớn | Không phù hợp solo founder | Shared components, automated tests, dependency discipline, prune low-value tools |
| UI bị ads làm xấu | Retention và trust giảm | Ads sau utility, reserve space, đo CLS và user feedback |
| Brand quá technical khi mở rộng đại chúng | Khó định vị | Mở rộng vào workflows có liên quan, không gom mọi calculator trên internet |
| SEO phụ thuộc Google | Traffic biến động | Favorites, direct visits, GitHub/docs sharing; vẫn ưu tiên search là acquisition chính |
| Sai lệch phép tính / format | User mất niềm tin | Reference test vectors, standards, deterministic tests, edge-case docs |

## 17. Open Questions & Decisions Deferred

1. `infratrove.com` đã đăng ký thành công, đã kiểm tra trademark và social handles chưa?
2. Có keyword clusters nào thực sự accessible cho domain mới? (Chưa đo.)
3. Đợt tại §5.2 đã triển khai theo độ phù hợp sản phẩm; keyword/SERP evidence nào xác nhận hoặc yêu cầu điều chỉnh thứ tự sau mỗi đợt?
4. Có cần dark mode trong launch hay để phase 1.5?
5. Chọn tool editor nhẹ hay code editor nâng cao cho JSON/diff?
6. Launch chỉ tiếng Anh hay có lý do thực sự để hỗ trợ đa ngôn ngữ về sau?
7. Ads provider, CMP và geo/privacy requirements chính thức tại thời điểm chạy là gì?
8. Dữ liệu analytics nào có thể đo mà không gây privacy risk trên password/JWT pages?
9. Tool content viết bởi founder hay cần editorial workflow hỗ trợ?
10. Có cần logo/icon design system riêng trước launch, hay dùng wordmark đơn giản?

## 18. Research & Scope Deliverables

1. **Keyword & SERP Research Sheet:** Core tools hiện có và 4 tools tại §5.2 + blog topics; ghi country/date/source, intent, SERP, confidence; dữ liệu chưa đo giữ trạng thái UNKNOWN.
2. **Competitor UX Comparison:** Text Compare, JSON Formatter, Cron Generator, Password Generator (cùng test inputs).
3. **Low-fidelity Wireframes:** Homepage, directory, standard tool page, mobile tool page, blog page.
4. **Design Prototype:** Một tool shell và component tokens được review về accessibility/Ads placement trước triển khai hàng loạt.
5. **Next Tool Batch:** Hàng đợi §5.3, bắt đầu với Upload / Restore Time; không đồng nhất implementation đã có với cơ hội SEO đã xác thực.

## 19. Source-of-truth & update policy

- Tài liệu này là **product spec** được xây dựng từ các quyết định trong dự án InfraTrove tính tới **2026-10-26**; §5 là nguồn chính cho trạng thái catalog và thứ tự tools sẽ làm.
- Các công thức, kỳ vọng traffic, Page RPM và timeline nếu nhắc đến là **scenarios/assumptions**, không phải kết quả đo thực tế.
- Keyword research/competitor findings nên ở artifact riêng, có source URLs, capture date, geo và confidence, sau đó liên kết vào version tiếp theo của spec.
- Mỗi thay đổi phạm vi lớn (ví dụ thêm SaaS, backend data processing, pivot sang general calculators) phải có decision log mới để tránh scope creep.
- Version kế tiếp nên là **v0.2 (after market validation)**, sau đó mới khóa **v1.0 launch scope**.

### Useful official references — kiểm tra cập nhật khi triển khai

- Google Search Central documentation: https://developers.google.com/search/docs
- Search Essentials & spam policies: https://developers.google.com/search/docs/essentials
- Google Search Console: https://search.google.com/search-console/about
- Google AdSense Help: https://support.google.com/adsense/
- Web Core Vitals: https://web.dev/articles/vitals
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- RFC 9562 (UUID): https://www.rfc-editor.org/rfc/rfc9562.html
- RFC 4648 (Base64/Base64URL): https://www.rfc-editor.org/rfc/rfc4648

---

## Appendix A — Brief copy examples (English)

**Homepage hero:**

> **Tools that get the job done.**  
> Format data, compare text, generate secure passwords and decode everyday formats — free, fast and straightforward.

**JSON tool:**

> **JSON Formatter & Validator**  
> Format, minify and validate JSON directly in your browser. Paste your JSON, inspect errors and copy the result.

**Cron tool:**

> **Cron Expression Generator**  
> Build and explain Unix-style cron schedules. Preview upcoming run times before using an expression.

**Privacy microcopy for local-only tools (chỉ dùng khi implementation thực sự đáp ứng):**

> This tool processes your input in your browser. We do not upload the content you enter to our servers.

Lưu ý: Nếu chạy ad/analytics scripts có thể truy cập nội dung DOM, privacy copy cần được rà soát kỹ theo threat model và hành vi thực tế của third-party code.

## Appendix B — Scope at a glance

| Area | Launch candidate | Future / conditional | Not planned |
|---|---|---|---|
| User utility | Free text/data/time/generator tools | Web/network/file utilities | Paid core tool access |
| Content | Blog guides / tutorials | Cheat Sheets / Examples | Auto-generated thin page farms |
| UX | Search, directory, favorites, copy, examples | Offline mode, tool chaining | Account-required core usage |
| Acquisition | Technical SEO + organic search | Brand/direct/community referrals | Paid acquisition assumed from day 1 |
| Revenue | Display Ads (once eligible) | Contextual affiliate/sponsorship | SaaS/subscriptions/managed APIs |
| Backend | Static/CDN + client-side logic | Only if later justified | Production microservices for simple converters |

**North star:** Xây một website đáng bookmark vì các tiện ích thật sự hữu ích, thu hút organic traffic bền vững và tạo lợi nhuận từ Ads sau chi phí — **không đánh đổi chất lượng để lấy số lượng trang**.
