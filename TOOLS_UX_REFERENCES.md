# InfraTrove — Tool UX Benchmark & Redesign Specification

> **Version:** 2.0  
> **Updated:** 2026-10-27  
> **Language:** Vietnamese (UI copy, keyword targets and technical terminology in English)  
> **Status:** Design proposal / implementation-ready planning document; **not** an audit of source code  
> **Coverage:** 12 existing tools, 6 supplied UI screenshots, competitor benchmark, design system, feature scope, validation plan and future backlog.

---

## 0. Executive decision

**Không rebuild InfraTrove. Giữ branding, sidebar, routes và core logic hiện tại; refactor tool pages theo 5 reusable workspace patterns.** Mục tiêu là tăng task completion, khả năng đọc kết quả, mức độ tin cậy và repeat usage; không phải thêm nhiều hiệu ứng.

1. **Trước tiên sửa layout hiện tại:** editor height, result visibility, placement của actions, status/error, mobile, copy/download và consistency.
2. **Sau đó nâng cấp chức năng có lợi ích rõ ràng:** JSON Tree View, diff result above the fold / integrated diff, Cron visual builder, UUID v7, Timestamp multi-format.
3. **Chỉ mở rộng tool collection sau khi 12 tools hiện có đạt quality gate.** Các ý tưởng mới giữ trong backlog, chưa suy diễn SEO demand hoặc doanh thu.
4. **Client-side by default.** Tuyệt đối không gửi password, JWT, nội dung editor, file, checksum hoặc dữ liệu workflow vào analytics/logs; ngoại lệ nào cũng phải được công bố rõ.
5. **SEO không được làm chậm công cụ:** content hỗ trợ nằm dưới thao tác chính; không cần separate URL cho mỗi mode nếu cùng một user task.

**Nguồn và mức độ chắc chắn:**

- **[S] Source file:** `Pasted markdown.md` của project mô tả capabilities và planned features. Đây là inventory do founder cung cấp, **chưa xác minh bằng source-code tests**.
- **[UI] Supplied screenshot:** 6 ảnh cho JSON Formatter, Text Compare, YAML ↔ JSON, Storage Converter, Base64 và Password Generator. Các nhận xét chỉ nói về trạng thái nhìn thấy trên ảnh.
- **[V] Verified public reference:** trang benchmark hoặc standards được đọc/đối chiếu công khai ngày 2026-10-27; không có automated UI testing trên đối thủ.
- **[R] Recommendation:** hướng thiết kế, P0/P1/P2, effort và UX decisions do InfraTrove đề xuất, **không phải current feature**.
- **[H] Hypothesis:** nhận định về conversion, retention, SEO hoặc monetization cần đo bằng dữ liệu sau release.

---

## 1. Existing product inventory — giữ đúng thông tin gốc [S]

| #   | Existing tool              | Category          | Current route                      | Existing capability summary                                                                          |
| --- | -------------------------- | ----------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1   | JSON Formatter & Validator | Text & data       | `/tools/json-formatter/`           | Beautify 2/4 spaces, minify, syntax validation/error hints, counts, copy                             |
| 2   | Text Compare (Diff)        | Text & data       | `/tools/text-compare/`             | Added/removed/modified lines, word-level inline marks, ignore case/whitespace, split & unified modes |
| 3   | Base64 Encoder / Decoder   | Encode & decode   | `/tools/base64-encoder-decoder/`   | UTF-8/Unicode/emoji, standard & URL-safe Base64, copy                                                |
| 4   | URL Encoder / Decoder      | Encode & decode   | `/tools/url-encoder-decoder/`      | Percent encoding/decoding, special characters, query param preservation                              |
| 5   | Cron Expression Generator  | Time & scheduling | `/tools/cron-generator/`           | Unix 5-field, English explanation, presets, next 5 runs, UTC/local browser timezone                  |
| 6   | Unix Timestamp Converter   | Time & scheduling | `/tools/unix-timestamp-converter/` | Seconds/milliseconds ↔ UTC/ISO/local date; date → epoch; Now                                         |
| 7   | Password Generator         | Generators        | `/tools/password-generator/`       | Web Crypto randomness, length 8–128, character groups, confusing-char exclusion, entropy gauge       |
| 8   | UUID Generator             | Generators        | `/tools/uuid-generator/`           | Secure bulk UUID v4, 1–100 per run, copy individual/all                                              |
| 9   | YAML ↔ JSON Converter      | Text & data       | `/tools/yaml-json-converter/`      | YAML 1.2 core ↔ JSON, validation/errors, copy/download; limitations below                            |
| 10  | JWT Decoder                | Encode & decode   | `/tools/jwt-decoder/`              | Decode header/payload locally, exp/iat/nbf to UTC, explicit non-verification caveat                  |
| 11  | Storage Unit Converter     | Text & data       | `/tools/storage-unit-converter/`   | Bytes + decimal SI/IEC simultaneously; exact rational arithmetic, 9-decimal display                  |
| 12  | Hash & Checksum            | Generators        | `/tools/hash-checksum/`            | Local SHA-256/SHA-512 for text/files ≤32 MiB; compare expected checksum                              |

> Existing routes, categories and capabilities are carried from source [S]. Screenshots show a portion of the UI, not enough to prove all interactions or implementation correctness. The original file's `plans/feature.md` is named as the priority source of truth but **was not provided**; this document must not override any contradictory project policy until reconciled.

---

## 2. Screenshot-based UX audit [UI] — 6 pages

### 2.1 Shared layout observations

**What should stay:** muted warm background; orange accent and outlined icons; left category navigation with active state; clear H1; compact top toolbar; readable monospace for data; generally lightweight styling.

**What should change:**

| Finding on supplied screenshots                                                      | Severity | Reason                                                                 | Proposed fix                                                                                             |
| ------------------------------------------------------------------------------------ | -------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Editor panes occupy most of a ~900 px high viewport even when there is no user input | High     | Low information density and results may appear too far down            | Content-aware `min-height`, initial 280–360 px; workspace resize/fullscreen; grow to 45–60vh as needed   |
| Same two-editor geometry used for JSON, Base64 and YAML                              | Medium   | Tools have different main jobs and result representations              | Share editor component, not fixed page layout; configure workspaces per task                             |
| Text Compare has two very tall inputs and a separate result below                    | High     | Core output isn't visible without scrolling                            | Compare result inline / tabbed in primary workspace, shrink inputs after compare, jump-to-results option |
| Primary actions often distant from related output                                    | Medium   | Extra pointer travel and unclear feedback                              | Contextual `Copy`, `Download`, `Expand` in each result header                                            |
| Right `How to use` card on compact tools takes prominent space                       | Medium   | Repeats straightforward steps, may squeeze core task on medium screens | Slim help summary/accordion or inline hints; full guide below workspace                                  |
| `Next in your workflow` card row is large relative to short converters               | Medium   | Related links visually compete with output                             | Contextual mini-links after results, larger related cards lower on page                                  |
| Tool page widths/styles vary by tool                                                 | Low      | Potential inconsistency in navigation and content reading              | One page shell with 3 container presets: wide, medium, compact                                           |

### 2.2 Per-page notes

**JSON Formatter:** left/right editor is a good starting point; current 2/4-spaces and format/minify controls are clear. Output has a distinct tinted background, but active toolbar/status could be stronger. Text `0 lines · 0 chars` while visible example-like text is shown may be perfectly correct _if it is placeholder text_; check that it cannot be mistaken for actual input. Suggested: `Code | Tree` output tabs; inline error marker; dynamic editor height; file actions.

**Text Compare:** Swap and ignore toggles are _already visible_, so do not reimplement them as new features. Source file says split/unified modes already exist, even if not visible at the current screenshot scroll position. The biggest fix is to surface diff results quickly and make the split/unified switch discoverable next to the result.

**YAML ↔ JSON:** direction selector, swap affordance and separated panes work well. The screenshot explicitly states **YAML 1.2, 100,000 character limit, no aliases or custom tags, comments not preserved**; do not advertise lossless conversion. Download action should live beside output, and cross-format losses should be disclosed close to that action.

**Storage Converter:** source unit and amount fields are readable, but form occupies a short block, followed immediately by sizable related cards; without populated input the actual value of the converter is not obvious. Show `From → To` plus complete SI/IEC conversion table once a value is entered; collapse right guide into info/help. Preserve exact rational arithmetic.

**Base64:** tabs for Encode/Decode and URL-safe variant are clear. Current initial editors are unnecessarily tall for common short strings. Initial height ~240–320 px, automatic conversion with error feedback, and an optional expand mode would better fit user jobs.

**Password Generator:** current composition is the most mature of the six: password prominent, length+slider, 4 groups, generate/copy and local-crypto/privacy messaging. On first load `Ready when you are` is not a generated password; distinguish _estimated strength for settings_ from _actual generated output_. Make Copy visibly unavailable until generation, and do not store generated passwords in persistent history.

**Cannot conclude from supplied screenshots:** actual mobile responsiveness, keyboard accessibility, focus handling, perf, correctness of all modes, backend traffic, LCP/INP/CLS, analytics or ads behavior. These require a running-site audit.

---

## 3. Competitive benchmark — what to learn, what NOT to copy [V]

Benchmark pages were verified via public page content on **2026-10-27**. Sources below describe observable/advertised features; they do not provide site traffic, SEO volume, revenue, usability experiment results or verified performance.

| InfraTrove tool | Primary reference                                                   | Secondary reference                                                               | Transferable pattern                                                           | Anti-pattern / caveat                                                            |
| --------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| JSON Formatter  | [JSONFormatter.org](https://jsonformatter.org/)                     | [JSON Console](https://jsonconsole.com/tools)                                     | Tree + code view, syntax checking, file workflow, related conversions          | Avoid automatic local-storage of potentially sensitive pasted JSON               |
| Text Compare    | [Diffchecker](https://www.diffchecker.com/)                         | [text.compare](https://text.compare/)                                             | Side-by-side/unified diff, synced scroll, ignore rules, hide unchanged, export | Competitor Pro features aren't necessarily free; don't clone feature overload    |
| Base64          | [Base64.Guru](https://base64.guru/converter/encode)                 | [CyberChef](https://gchq.github.io/CyberChef/)                                    | Data type/mode options, copy/download, composable conversion                   | Remote URL / file workflows add privacy and cost complexity; skip for MVP        |
| URL Encoder     | [URLEncoder.org](https://www.urlencoder.org/)                       | [URLDecoder.org](https://www.urldecoder.org/)                                     | Real-time mode, batch/per-line, explain charset, decode limits                 | These sites have file-upload features; InfraTrove should prefer local processing |
| Cron            | [Crontab.guru](https://crontab.guru/)                               | [Crontab.io Visual Builder](https://crontab.io/visual-builder)                    | Tiny parser UI + visual controls, presets, next executions                     | Do not mix Unix/Quartz/Spring/AWS semantics under generic '6-field cron'         |
| Unix Timestamp  | [EpochConverter](https://www.epochconverter.com/)                   | [timestamp.tools](https://timestamp.tools/)                                       | Prominent current timestamp, all formats with inline copy, batch later         | Some sites accept too many date formats; ambiguous local dates must be explicit  |
| Password        | [Bitwarden generator](https://bitwarden.com/password-generator/)    | [Bitwarden passphrase](https://bitwarden.com/passphrase-generator/)               | Password/passphrase distinction, advanced constraints, copy/regen              | Don't promise crack times; avoid persistent generation history                   |
| UUID            | [UUIDTools generator](https://uuidtools.com/)                       | [UUIDTools v7](https://uuidtools.com/generate/v7)                                 | Version options, quantity, formatting, download, inspect                       | UUIDs are identifiers, not credentials; clarify v7 time ordering                 |
| YAML ↔ JSON     | [transform.tools](https://transform.tools/yaml-to-json)             | [JSON Console](https://jsonconsole.com/tools)                                     | Source-to-target editor, direction, related converters                         | Schema/tags/comments and multi-document semantics need explicit limitations      |
| JWT             | [jwt.io](https://jwt.io/)                                           | [Genie9 JWT](https://genie9.com/workspace/dev/jwt-decoder)                        | Colored segments, structured claims, signature status                          | Decoded does **not** mean verified, trusted or authorized                        |
| Storage         | [ConvertUnits GB→GiB](https://www.convertunits.com/from/GB/to/GiB)  | [Genie9 storage](https://genie9.com/workspace/converter/storage-converter)        | Instant dual-input conversion, table/reference values                          | **Verify units against NIST**; competitor copy can use GB ambiguously            |
| Hash            | [emn178 SHA-256](https://emn178.github.io/online-tools/sha256.html) | [emn178 SHA-256 file](https://emn178.github.io/online-tools/sha256_checksum.html) | Encoding selector, text/file separation, checksum compare                      | HMAC ≠ hash, hashing ≠ encryption, checksum ≠ authenticity                       |

**Global inspiration:** [IT-Tools](https://it-tools.tech/) (tool discovery), [DevToys](https://github.com/DevToys-app/DevToys) (developer-tool workflows), [CyberChef](https://gchq.github.io/CyberChef/) (input → operations → output), [Diffchecker](https://www.diffchecker.com/) (deep task UX), [JSON Console](https://jsonconsole.com/tools) (coherent related tools).

**Standards and primary technical sources:**

- [RFC 9562 — UUID](https://www.rfc-editor.org/rfc/rfc9562.html)
- [NIST — SI and IEC binary prefixes](https://pml.nist.gov/cuu/Units/binary.html)
- [RFC 7519 — JWT](https://www.rfc-editor.org/rfc/rfc7519.html)
- [MDN — SubtleCrypto.digest()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
- [MDN — Crypto.getRandomValues()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
- [Google Search Central — Helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

---

## 4. Target UX architecture — five distinct workspace patterns [R]

### 4.1 Site Shell: common on every page

```text
Desktop >=1280px
┌────────────────┬───────────────────────────────────────────────────────────┐
│ Left sidebar   │ Icon + H1 + optional one-line value proposition          │
│ Search tools   │ ┌──────────────── Workspace ----------------------------┐ │
│ Favorites      │ │ Per-tool controls + task UI + inline status          │ │
│ Categories     │ │ [NO interstitial or in-workspace ads]               │ │
│ ...            │ └───────────────────────────────────────────────────────┘ │
│                │ Short related-tool links (contextual)                      │
│                │ Guide / examples / FAQ / technical limits / SEO content    │
└────────────────┴───────────────────────────────────────────────────────────┘
```

Desktop shell must support **wide**, **medium** and **compact** content widths without forcing every tool into the same page grid. Sidebar can collapse and must not steal more than needed from diff/editor pages.

### 4.2 Pattern A — Dual Editor (JSON, YAML, Base64, URL)

```text
[H1]                            [Input sample] [Clear] [Fullscreen]
[Mode / format / indent controls]
┌─ Input ───────────────────┐  ┌─ Output [Code|Tree] [Copy] [Download] ───┐
│ syntax-highlight editor  │  │ result/preview                          │
│                          │  │                                         │
└──────────────────────────┘  └─────────────────────────────────────────┘
[Counts / validation]           [Warnings / format details]
```

- Default desktop width: `wide`, split 50:50 unless tool requires otherwise.
- Height responsive: start ~280–360px; expand up to `60vh` or fullscreen; preserve manual resize.
- Input and output scrolling must be independent; optional sync only where useful.
- Mobile (<768px): stack Input above Output, with a visible action and copy controls.
- Output is **read-only and accessible**; do not style empty result as a valid actual value.
- Only JSON needs `Code | Tree`; Base64 and URL should not inherit irrelevant tabs.

### 4.3 Pattern B — Diff Workspace (Text Compare)

```text
[Compare] [Swap] [Ignore case] [Ignore whitespace] [View: Split|Unified]
┌─ Original ─────────────────┐ ┌─ Changed ────────────────────────────┐
│ editable source            │ │ editable source                        │
└────────────────────────────┘ └───────────────────────────────────────┘
[+ N additions] [- N deletions] [~ N modifications] [Prev] [Next]
┌──────────────────────────────── DIFF RESULT ──────────────────────────┐
│ aligned line numbers / inline highlights / collapse unchanged        │
└───────────────────────────────────────────────────────────────────────┘
```

**Decision:** when Compare runs, reduce/accordion-collapse input editors and bring result into visible workspace; do not require scrolling past two 600px blank editors. Preserve both inputs to edit them again. If implementing live diff later, integrate editing and diff in the same main grid.

### 4.4 Pattern C — Generator (Password, UUID)

```text
[Title]
┌───────────── Main generated value / result list ───────────────┐
│ readable monospace result       [Copy] [Generate again]        │
└────────────────────────────────────────────────────────────────┘
[Length/Quantity] [Types/Version] [Format/Advanced] [Generate]
[Privacy / entropy note / limitations]
```

Compact-to-medium width. Never present an ungenerated example as if it were a user-specific generated secret.

### 4.5 Pattern D — Interactive Builder (Cron)

```text
[ Cron expression: 0 9 * * 1-5 ] [Copy] [Valid]
Every weekday at 9:00 AM
[Quick presets] [Visual builder | Advanced expression]
[Minutes] [Hours] [Days] [Months] [Weekdays]
Next 5 runs: [Timezone]
[Run #1] [Run #2] [Run #3] ...
```

Editing expression must update builder where supported; unsupported complex syntax must remain intact and provide an honest `Advanced mode` explanation.

### 4.6 Pattern E — Converter / Inspector (Timestamp, Storage, JWT, Hash)

- **Timestamp/Storage:** instant-value hero, primary input + unit, results in copyable rows/tables.
- **JWT/Hash:** primary input, parse/hash status, structured panels and output actions; security caveats contextual.
- Reuse shells/components, but keep domains distinct: JWT needs claims and signature states; Storage needs exact units; Hash needs text/file tabs.

---

## 5. Visual design system (proposal, not screenshot-derived measurements) [R]

### 5.1 Foundations

| Token / rule  | Suggested default                            | Purpose                                    |
| ------------- | -------------------------------------------- | ------------------------------------------ |
| Background    | warm off-white, e.g. `#FAF7F3`               | Preserve current warm identity             |
| Surface       | white `#FFFFFF`                              | Clean workspace / tool card                |
| Muted surface | `#F5F1EB`                                    | Output background, secondary panels        |
| Text          | charcoal `#24211F`                           | High contrast                              |
| Muted text    | `#69635C`                                    | Metadata, not core instructions            |
| Accent        | orange-red, starting point `#E54B1B`         | Selected states, subtle accents            |
| Border        | neutral warm gray, e.g. `#E4DBD2`            | Delineate inputs without noise             |
| Error/Success | semantic red/green + text/icons              | Never rely on color alone                  |
| Font          | existing sans-serif; `ui-monospace` for code | Consistency and zero extra font dependency |
| Radius        | ~10–14px for panels, ~8px for controls       | Similar to current look                    |
| Spacing       | 4/8/12/16/24/32px scale                      | Consistent rhythm                          |

Colors are starting points only: run WCAG contrast checks in the actual design tokens before shipping. Do not automatically overwrite the current CSS palette.

### 5.2 Component contracts

- `ToolPageShell`: H1, icon, category, breadcrumbs if useful, width mode, sidebar state.
- `ToolToolbar`: primary action first; secondary actions grouped; collapse excess actions on mobile.
- `CodeEditor`: plaintext/code, line numbers, validation markers, counters, keyboard behavior, read-only option, size mode.
- `ToolResultPanel`: loading/empty/success/error, Copy/Download, format info, generated output.
- `ToolStatus`: clear _Valid_, _Invalid_, _Converted_, _Decoded but unverified_, _Matched_, _No match_ states.
- `ExamplePicker`: deterministic sample that covers a meaningful edge case; avoid adding input unless explicitly clicked.
- `PrivacyHint`: truthful per tool; avoid blanket claims when third-party scripts are present.
- `RelatedToolLinks`: 2–4 context-relevant small links and optional action `Open output in...`; never link raw sensitive data in query params.
- `ToolGuide`: move long-form instructions below workspace; allow summary in a dismissible disclosure.

### 5.3 Responsive and accessibility

| Viewport    | Layout                                                                            |
| ----------- | --------------------------------------------------------------------------------- |
| >=1280px    | Sidebar + wide workspace; editor pages prioritize 2 columns                       |
| 1024–1279px | Compact sidebar; wide editor area; optional 1-column if panes become too narrow   |
| 768–1023px  | Sidebar collapsible; 2 columns only if each pane stays readable                   |
| <768px      | Single-column tool workspace; sticky _actions_ only if they don't occlude content |
| <480px      | Short labels, overflow menu for secondary options, large touch targets            |

- Minimum target: keyboard usable; visible focus; explicit input labels; appropriate screen-reader statuses (`aria-live` sparingly); accessible drag/drop alternatives.
- `Ctrl+Enter` / `Cmd+Enter` triggers explicit actions where relevant, but must not accidentally discard text. Provide shortcut hint adjacent to action.
- Copy success toast must state what was copied. Respect `prefers-reduced-motion`.
- Test with keyboard-only flow and at least one screen reader; avoid reliance on orange/green alone.

---

## 6. Detailed tool specifications

**Priority notation:** `P0 = fix/release quality`, `P1 = high-value incremental`, `P2 = exploratory`. These are roadmap recommendations, **not existing tool status**. Each tool section distinguishes [S] from [R].

### 6.1 JSON Formatter & Validator

**Primary user job:** Paste JSON → understand correctness → format or inspect → copy/export.

- **Existing [S]:** Format 2/4 spaces, minify, validation errors, counts, copy, dual panes.
- **Reference [V]:** [JSONFormatter.org](https://jsonformatter.org/) for tree; [JSON Console](https://jsonconsole.com/tools) for a family of related operations.
- **Layout [R]:** Wide Dual Editor. Input left; output right; top `Format | Minify`; output tabs `Code | Tree` (P1); error bar anchored to input with line/column and go-to-line.
- **P0:** shrink oversized empty pane, valid/invalid/empty states; copy/download close to output; Load example/Reset consistency; formatter doesn't modify input unless explicitly requested; preserve raw input.
- **P1:** collapsible Tree View, node search, copy subtree/JSONPath, upload/download local file; optional Find.
- **P2:** JSONPath query; lossless big-number handling; explicit `Open in YAML ↔ JSON` / `Text Compare` workflow. Do **not** add all converter types to one screen.
- **Edge cases / correctness:** numbers beyond JavaScript safe integer precision, duplicate keys, very deep nesting, escape sequences, malformed trailing commas (strict JSON), large payload rendering.
- **Acceptance:** `{ "a": 1 }` formats deterministically for 2/4 spaces; invalid input reports useful location; copying output matches visible result; input `9007199254740993` is never silently rounded as part of formatting; two panes remain usable on 1280px and mobile.
- **Suggested English microcopy:** `Paste JSON to format or validate` / `Valid JSON` / `Invalid JSON at line 3, column 8` / `Nothing to copy yet`.

### 6.2 Text Compare (Diff Checker)

**Primary user job:** Paste two versions → see changes immediately → find/copy meaningful differences.

- **Existing [S]:** added/removed/modified lines, inline word diff, ignore case/whitespace, split/unified modes; Swap is also visible [UI].
- **Reference [V]:** [Diffchecker](https://www.diffchecker.com/), [text.compare](https://text.compare/).
- **Layout [R]:** Dedicated Diff Workspace, not regular Dual Editor. Compare toolbar always visible; after Compare the diff result is main focus, with compact editable sources or expand-toggle.
- **P0:** remove full-height empty input constraint; surface result above fold; make `Split | Unified` visible at results; counts; `Next change` / `Previous change`; retain input on view switch; meaningful empty/identical states.
- **P1:** synchronized scrolling in split results, collapsed unchanged lines, copy change block, optional file input/drag-drop, word/character precision selector.
- **P2:** patch export, change merge, JSON-structured diff separate from plain-text diff.
- **Edge cases:** different line endings (`CRLF`/`LF`), trailing newline, whitespace-only differences, very long single lines, Unicode grapheme clusters, large files or worst-case diff performance.
- **Acceptance:** identical inputs show `No differences found`; ignore-case hides case-only changes without deleting originals; split/unified produce equivalent change semantics; next/prev navigates every change; after clicking Compare result is visible without excessive scroll.
- **Suggested microcopy:** `Original text` / `Changed text` / `No differences found` / `3 additions · 2 deletions · 1 change`.

### 6.3 Base64 Encoder / Decoder

**Primary user job:** Encode or decode a short UTF-8 string fast; optionally work with Base64URL.

- **Existing [S]:** Unicode/emoji UTF-8, standard and URL-safe variants, two editors, copy, Encode/Decode mode.
- **Reference [V]:** [Base64.Guru](https://base64.guru/converter/encode), [CyberChef](https://gchq.github.io/CyberChef/).
- **Layout [R]:** compact Dual Editor with automatic live conversion; mode and URL-safe directly above two panes; reduced initial editor height (approx. 280px).
- **P0:** deterministic encode/decode, no stale output after invalid input; Copy; `Swap / Use output as input`; clearly label Standard vs Base64URL; handle missing padding according to documented policy.
- **P1:** input/output bytes count; Data URL mode; local file → Base64 with explicit size limit and download; optional binary decode path (not rendered as corrupt Unicode).
- **P2:** image preview from local data URL, multi-line batch mode.
- **Edge cases:** emoji, mixed Unicode, empty input, invalid alphabet/padding, malformed UTF-8, very large strings, URL-safe `-`/`_` vs `+`/`/`.
- **Acceptance:** roundtrip `Xin chào 👋` yields exact original string; invalid Base64 shows validation error; Base64URL is not silently confused with standard; privacy claim matches actual network traffic.
- **Suggested microcopy:** `Text to encode` / `Encoded Base64` / `Invalid Base64 input` / `Processed in your browser`.

### 6.4 URL Encoder / Decoder

**Primary user job:** Encode/decode a URL component or inspect query params without corrupting the URL structure.

- **Existing [S]:** percent-encode/decode, special chars, query-preserving behavior.
- **Reference [V]:** [URLEncoder.org](https://www.urlencoder.org/), [URLDecoder.org](https://www.urldecoder.org/).
- **Layout [R]:** short Dual Editor + explicit mode choice `URL component | Full URL | Form data` (mode expansion P1). Do not overload the same `Encode` button with ambiguous behavior.
- **P0:** label what is encoded (`component`), `Encode | Decode`, robust `%` validation, Copy, Swap, example; protect reserved delimiters according to selected mode.
- **P1:** Query Parameter Inspector: Parsed URL (scheme/host/path/fragment), editable key-value query table, URL builder output; form-urlencoded `+` vs `%20` guidance.
- **P2:** batch line mode, recursive decode with max iteration count; explicit warning for repeated decode.
- **Edge cases:** `+` as literal vs space, `%25`, `%2F`, malformed `%E0%A4%A`, Unicode, multiple same-name query keys, URL fragments.
- **Acceptance:** `a b&c` component encodes and decodes correctly; full URL mode does not encode structural `https://` delimiters indiscriminately; empty or invalid percent input gives understandable state.

### 6.5 Cron Expression Generator

**Primary user job:** Build or understand a schedule, confirm when it will run, copy a correct expression.

- **Existing [S]:** Unix 5 fields, explanation, presets, next 5 times, UTC/local toggle.
- **Reference [V]:** [Crontab.guru](https://crontab.guru/), [Crontab.io visual builder](https://crontab.io/visual-builder).
- **Layout [R]:** Cron expression is hero at top; plain-English meaning below; `Expression | Visual Builder` tabs; next 5 runs in visible timeline/table.
- **P0:** readable field labels; validation feedback per field; next runs with explicit time zone and absolute dates; Copy; preserve advanced expressions.
- **P1:** weekday multi-select, hours/minutes UI, common scheduling patterns, timezone selector using IANA zone names and DST clarification.
- **P2:** explicitly separate Unix vs Quartz vs AWS EventBridge vs Spring modes, each with its own parser/documentation and tests. Never auto-infer by field count alone.
- **Edge cases:** Sunday 0/7 semantics, DOM + DOW matching conventions, month end, leap years, timezone DST gaps/overlaps, unsatisfiable schedules, special dialect tokens.
- **Acceptance:** `0 9 * * 1-5` produces weekday 09:00 schedule in selected time zone; invalid field gives precise error; next-run list actually obeys parser and DST policy; copy mirrors visible expression.

### 6.6 Unix Timestamp Converter

**Primary user job:** Instantly convert an epoch into dates and date-time back to epoch.

- **Existing [S]:** seconds/milliseconds ↔ UTC/ISO/local, Now.
- **Reference [V]:** [EpochConverter](https://www.epochconverter.com/), [timestamp.tools](https://timestamp.tools/).
- **Layout [R]:** current Unix timestamp card on top; primary input accepts explicit unit; immediately show UTC, Local, ISO, epoch s/ms and Copy per row.
- **P0:** prominent unit selector, conversion both directions, negative timestamp support where library permits, clear timezone display and validation, `Now` action.
- **P1:** live ticking clock, microseconds/nanoseconds without JS floating-point loss, chosen IANA time zone, relative time (`3 hours ago`).
- **P2:** batch conversions and code snippets.
- **Edge cases:** 10 vs 13 vs 16 vs 19 digits should not silently guess without showing detected unit, negative epochs, timezone DST ambiguity, precision loss, date overflow, year 2038.
- **Acceptance:** epoch `0` equals `1970-01-01T00:00:00Z`; s↔ms yields same instant; timezone conversion changes display, not instant; micro/nano processing is exact if offered.

### 6.7 Password Generator

**Primary user job:** Generate a strong password with site-required constraints and copy it safely.

- **Existing [S]:** CSPRNG with `crypto.getRandomValues()`, 8–128 length, 4 character groups, ambiguous-char exclusion, entropy gauge. [UI] shows explicit Generate action and a waiting state.
- **Reference [V]:** [Bitwarden password generator](https://bitwarden.com/password-generator/), [Bitwarden passphrase](https://bitwarden.com/passphrase-generator/).
- **Layout [R]:** Preserve existing compact configuration. Place generated value, Copy and Regenerate above settings. Keep privacy notice short; help lower.
- **P0:** verify unbiased random selection and guarantee every enabled required character group if UI promises it; disable Copy before Generate; clear output on session reload; show settings-derived entropy as **estimate**, not certified strength; no secret analytics or persistence.
- **P1:** passphrase mode with curated large word list and CSPRNG; configurable required minimum digits/symbols for site constraints; Copy feedback; optional reveal/mask.
- **P2:** PIN mode, batch passwords (only if justified), optional easily dismissed temporary in-memory history **off by default** (prefer no history due to risk).
- **Edge cases:** all character groups deselected, length shorter than number of mandatory groups, ambiguous exclusions reducing charset, biased modulo mapping, clipboard visibility, screen sharing, autocomplete/persistence.
- **Acceptance:** 1,000+ deterministic test cases (using controlled test RNG, never production RNG) satisfy constraints; no repeated seeded Math.random use in production; actual passwords do not enter URL, logs, telemetry or storage; strength wording remains honest.

### 6.8 UUID Generator

**Primary user job:** Generate and export IDs for fixtures, APIs or databases.

- **Existing [S]:** v4, bulk 1–100, copy one/all.
- **Reference [V]:** [UUIDTools generator](https://uuidtools.com/), [UUIDTools v7](https://uuidtools.com/generate/v7).
- **Layout [R]:** visible first UUID and contextual Copy; `Version | Quantity | Output format` above a compact results list; download/copy all near list header.
- **P0:** preserve secure v4 and current bulk behavior; validate output syntax and version/variant bits; copy UI states.
- **P1:** UUIDv7 per RFC 9562, uppercase/lowercase, hyphens, braces, JSON/lines/csv formatting, local download, `Regenerate`.
- **P2:** v3/v5 namespace-based IDs, UUID inspector, timestamp extraction for v7.
- **Edge cases:** v7 timestamp bits, clock collision handling, bulk generation across same millisecond, formatting without changing underlying UUID value; do not imply absolute uniqueness or use UUID as password.
- **Acceptance:** 1,000 v4 values parse as proper v4/variant; v7 passes RFC vectors where applicable; formatting roundtrips; quantity bounds enforced.

### 6.9 YAML ↔ JSON Converter

**Primary user job:** Convert configuration between two formats while understanding lossy transformations.

- **Existing [S]:** bidirectional YAML 1.2 core ↔ JSON, error messages, copy/download, swap. Screenshot [UI] additionally notes single document, no aliases/custom tags, comments not preserved, 100k chars.
- **Reference [V]:** [transform.tools YAML → JSON](https://transform.tools/yaml-to-json), [JSON Console](https://jsonconsole.com/tools).
- **Layout [R]:** wide Dual Editor. Mode `YAML → JSON | JSON → YAML`, syntax labels above each pane; Download beside Copy in output header; warning banner only when relevant.
- **P0:** precise syntax errors, no output on invalid input, explicit _comments/tags/aliases may not survive_ and no false `lossless` claim; clear unsupported input error; stable output formatting; copy/download correct extension.
- **P1:** configurable indentation, YAML anchors/aliases when a safe parser is selected, multi-document option with explicit JSON array policy; duplicate-key detection.
- **P2:** format-specific schema validation and Kubernetes-oriented examples (not a separate validator unless demand supports it).
- **Edge cases:** YAML implicit scalars, duplicate keys, aliases, custom tags, cyclic references, multi-document streams, date/timestamp scalars, numeric precision, object prototype pollution.
- **Acceptance:** simple map/array converts both ways; unsupported tags/aliases fail cleanly (until implemented); comments loss visibly disclosed; extension and MIME of downloaded result match chosen target.

### 6.10 JWT Decoder

**Primary user job:** Inspect a token's claims without accidentally believing it is verified.

- **Existing [S]:** client-side header/payload decode, UTC time claims, caveat about unverified signatures.
- **Reference [V]:** [jwt.io](https://jwt.io/), [Genie9 JWT](https://genie9.com/workspace/dev/jwt-decoder).
- **Layout [R]:** JWT encoded string input (compact), sections `Header | Payload | Claims | Signature status`, expiration metadata and optional `Copy decoded JSON`.
- **P0:** clearly distinct states `Decoding failed`, `Decoded / signature NOT verified`, `Expired / not expired per local clock` (latter not proof of validity); never trust/execute decoded strings; sanitize XSS; don't cache input.
- **P1:** understandable claim descriptions (sub, iss, aud, exp, iat, nbf), relative expiration and `Open exp in Unix Timestamp` using in-memory handoff.
- **P2:** explicit optional local signature verification using correct keys and algorithm validation; distinguish verified signature from application authorization/issuer trust.
- **Edge cases:** malformed Base64URL, `alg:none`, 5-part JWE (not JWT decoder scope), missing exp, nonnumeric timestamp, nested or large claims, unsupported algorithms, time skew.
- **Acceptance:** sample JWT decodes header/payload; unsigned/altered token never gets green `Verified` badge without actual verification; any token content is rendered as text, not HTML; no secret payload in logs, URL or analytics.

### 6.11 Storage Unit Converter

**Primary user job:** Convert bytes and SI/IEC sizes accurately, with unambiguous units.

- **Existing [S]:** exact rational math, bytes, SI and IEC units through TB/TiB, rounded output to 9 decimals, matrix display.
- **Reference [V]:** [ConvertUnits GB→GiB](https://www.convertunits.com/from/GB/to/GiB), [Genie9 Storage](https://genie9.com/workspace/converter/storage-converter), **truth source** [NIST](https://pml.nist.gov/cuu/Units/binary.html).
- **Layout [R]:** compact `Amount | From Unit` → highlighted selected `To Unit` with copy, then complete sortable results table; instructional content below or accordion.
- **P0:** show an immediate helpful default example _without silently changing entered values_; default output target e.g. `GiB` with dropdown; preserve exact rational data and 9-decimal formatting; unambiguous labels `GB (10^9 bytes)` and `GiB (2^30 bytes)`.
- **P1:** input expressions like `1.5 GB` (if parser secure); bit units with clearly labeled `b` vs `B`; Copy original/exact value and rounded display; preset common conversions.
- **P2:** separate `Transfer rate` / `Upload time` calculator; keep storage size semantics distinct from throughput.
- **Edge cases:** 0, very large whole numbers, fractional precision, tiny positive number rounded to 0 (use `<` or scientific exact), malformed decimal, negative not allowed per current UI, unit label ambiguities.
- **Acceptance:** `1 GB` = `1,000,000,000 B` and ~`0.931322575 GiB`; `1 GiB` = `1,073,741,824 B`; preserve precision for all accepted inputs; no copy of misleading rounded zero.

### 6.12 Hash & Checksum

**Primary user job:** Hash text or local file and compare against a trusted published checksum.

- **Existing [S]:** local SHA-256/SHA-512, text/file <=32MiB, checksum comparison.
- **Reference [V]:** [emn178 text SHA256](https://emn178.github.io/online-tools/sha256.html), [emn178 file checksum](https://emn178.github.io/online-tools/sha256_checksum.html).
- **Layout [R]:** tabs `Text | File`; input/file dropzone; algorithm selector; result prominent; comparison directly adjacent to result, status `Match / Mismatch / Invalid expected digest`.
- **P0:** clarify 32 MiB limit pre-selection; clear progress/errors; text input encoded as UTF-8; distinct file hashing raw bytes; copy digest; expected checksum comparison correctly ignores only formatting allowed by documented rules.
- **P1:** SHA-384, uppercase/lowercase, Base64 digest output, drag & drop, file metadata (name/size) without logging file name; improve performance with worker where needed.
- **P2:** optional streaming hash implementation for larger files after security review; legacy MD5/SHA-1 **only** with explicit compatibility label and collision warnings; HMAC separately, never conflated.
- **Edge cases:** empty string digest vs no input, trailing newline, file too large, file permission read errors, subtleCrypto requires full buffer (not streaming), digest size, uppercase expected hash.
- **Acceptance:** SHA-256 of UTF-8 `abc` equals `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad`; a byte-different file mismatches; file stays local; checksum match is not described as malware/author authenticity validation.

---

## 7. Cross-tool workflows [R/H]

Only introduce cross-tool actions when they save clear steps, not to force extra page views.

| Source tool       | Contextual action                     | Target                   | Privacy and implementation rule                |
| ----------------- | ------------------------------------- | ------------------------ | ---------------------------------------------- |
| Base64 Decode     | `Open decoded text in JSON Formatter` | JSON Formatter           | Memory handoff; no input embedded in URL       |
| YAML → JSON       | `Format output as JSON`               | JSON Formatter           | Local transfer; validation already done        |
| JSON Formatter    | `Compare two JSON versions`           | Text Compare             | User explicitly chooses which side to populate |
| JWT Decoder       | `Inspect expiration timestamp`        | Unix Timestamp           | Transfer numeric claim only                    |
| Storage Converter | `Estimate transfer time`              | Future Upload Calculator | Transfer numeric size & unit only              |
| Hash & Checksum   | `Use digest in verification`          | Same page                | Keep action local; no unnecessary navigation   |

Suggested implementation: per-tab in-memory state/context or explicit copy/paste fallback; avoid query params/localStorage for sensitive payloads. Do not create account/backend dependencies just for these shortcuts.

---

## 8. SEO and content architecture [R/H]

**Business constraint:** initial goal is an SEO-driven ad/affiliate/tool business, **not cloud monitoring SaaS**. Therefore prioritize usable free tools, search intent alignment, helpful supporting explanations, fast load and repeat utility.

### 8.1 Per-tool page composition

1. Semantic H1 and optionally a one-sentence value proposition.
2. Functional workspace visible immediately (first screen, ideally primary action and result affordance).
3. Compact examples; caveats specific to algorithm.
4. Technical reference: what the conversion means, use cases, real edge cases.
5. FAQ based on actual recurring questions; not fabricated user quotes.
6. Relevant tool links; perhaps one contextual cross-tool link above guide.
7. Optional ads outside workspace and interaction paths; reserve slots to prevent CLS.

### 8.2 SEO rules

- Keep existing canonical tool URLs; don't split `/encode/`, `/decode/`, `/minify/` unless independent SERP intent is validated.
- Unique title/meta/H1 aligned with concrete function and limitations; don't promise guarantees not delivered.
- SSR/prerender textual content so search engines can understand pages without running editor JS; lazy-load heavy editors.
- Helpful examples and precise comparisons beat generic 1,500-word filler.
- Use BreadcrumbList structured data only if visible breadcrumbs are actually implemented; do not expect FAQ markup to guarantee rich results.
- Optimize Core Web Vitals, caching, CLS, editor lazy loading and code-splitting; test with real-device field data.
- Ads must never be inserted between source and target editor or next to misleading action labels. Privacy claims must match third-party scripts.

### 8.3 Research honesty

This document **does not claim keyword volumes, KD, CPC, SERP rankings, traffic, revenue or conversion**. Validate using Google Search Console/Bing Webmaster Tools after indexing, actual SERP sampling, and paid tools when available. Don't rank roadmap ideas by invented search volume.

---

## 9. Quality, privacy and architecture standards [R]

### 9.1 Functional correctness

- Every tool has typed input/output, validation, explicit empty/error states, golden test vectors and regression tests.
- Never silently mutate input when conversion is lossy; distinguish parse error, unsupported feature and warning.
- Consider property-based roundtrip tests for reversible operations, acknowledging YAML/JSON and full URLs are sometimes lossy.
- For CPU-heavy parsing/diff/file hashing, use a Web Worker and cancel/restart long tasks; graceful error if resource limit reached.

### 9.2 Browser privacy

- Passwords, JWT and arbitrary user text: no auto-save in localStorage, cookies, URL, telemetry, crash logs or session replay.
- Text may be user-private even when apparently benign. Do not send samples and token strings to AI APIs for convenience.
- If external analytics/ads are present, phrase privacy precisely: **tool input is processed locally**, not “nothing leaves the tab” as an absolute statement.
- Avoid logging full exception objects that include user input; sanitize clipboard/in-app handoff.
- Validate/sanitize any rendered text before HTML insertion; untrusted JSON/YAML/JWT is displayed as inert text.

### 9.3 Error states taxonomy

| State                    | User-facing display                 | Example                                         |
| ------------------------ | ----------------------------------- | ----------------------------------------------- |
| Empty                    | Instruction + Load example          | `Paste JSON to get started`                     |
| Ready                    | Action enabled and clear affordance | `Format JSON`                                   |
| Working                  | Nonblocking status for large work   | `Comparing…`                                    |
| Success                  | Result + Copy/Download              | `Valid JSON`                                    |
| Invalid input            | Error at source, preserve input     | `Unexpected token at line 4`                    |
| Unsupported              | Feature-specific message            | `YAML aliases aren't supported in this version` |
| Too large                | Limit and recovery option           | `Maximum file size: 32 MiB`                     |
| No meaningful difference | Clear non-error result              | `No differences found`                          |
| Unverified               | Neutral not green                   | `Decoded — signature not verified`              |

### 9.4 Testing matrix

Test Chrome/Firefox/Safari desktop; Chromium-based Android browser and iOS Safari; narrow/tall desktop; keyboard-only; browser zoom 200%; dark mode _only if offered_. Unit tests + end-to-end tests must cover Copy, Reset, Example, mobile and navigation; no unexpected scroll jumps or focus loss.

---

## 10. Phased rollout & acceptance gates [R]

Priorities are **recommendations based on visible UX pain and likely engineering leverage**, not quantified SEO opportunity. Sizes are relative effort guesses dependent on existing component architecture.

| Phase                | Scope                                                                                                                  | Priority | Approx. effort category | Release gate                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------- | ------------------------------------------------------------------------ |
| 0 — Baseline         | Capture UI states, Lighthouse/mobile review, smoke tests, telemetry without user input                                 | P0       | S–M                     | Can distinguish UX improvements from regressions                         |
| 1 — Shared Workspace | `ToolPageShell`, `CodeEditor` sizing, result headers, copy/status, mobile, no-results                                  | P0       | M                       | All 12 visually consistent where appropriate; no broken current features |
| 2 — High-impact UX   | Text Compare result placement, JSON errors/output, YAML output actions, Base64 short editor, Storage result prominence | P0       | M–L                     | Main task completed without unnecessary scroll on common screens         |
| 3 — Depth Features   | JSON Tree View, Cron visual builder, UUIDv7, Timestamp multi-format, URL mode semantics, JWT status                    | P1       | L                       | Golden vectors and edge-case tests pass                                  |
| 4 — Advanced         | File Base64, diff patch, passphrase, batch converters, multi-document YAML, large streaming hashes                     | P2       | Variable                | Add only with demand signal and documented limits                        |
| 5 — New tools        | From existing queue (below)                                                                                            | Research | Variable                | SERP research + MVP validation before implementation                     |

### 10.1 Priority within 12 tools

**First design pass:** Text Compare → JSON Formatter → Base64 → YAML ↔ JSON → Storage Converter → Password Generator. These six have supplied screenshots, so UI issues are directly grounded.

**Following pass:** Cron → Unix Timestamp → UUID → JWT → URL Encoder → Hash. Source lists capabilities, but **no screenshots were provided for these six**, so inspect live UI before major design decisions.

### 10.2 Definition of Done for a tool page

- [ ] All documented existing functions preserved.
- [ ] Main action/result discoverable in common desktop and mobile viewport.
- [ ] Deterministic tests for valid/invalid/edge cases pass.
- [ ] Copy/Download reflect visible output and disable on empty/error.
- [ ] Keyboard/touch/focus, loading/empty/error and long text verified.
- [ ] `No input sent to backend` statement validated against actual network and telemetry.
- [ ] No third-party or ad layout shifting core workspace; no ads between input/result.
- [ ] Browser history/navigation do not leak tokens/passwords.
- [ ] SEO copy accurately reflects implementation and limitations.
- [ ] Pre/post screenshots at desktop 1440px, tablet ~820px, mobile 390px captured.

### 10.3 Measurements and experiments [H]

**Instrument only non-sensitive events:** `tool_view`, `example_clicked`, `action_clicked` (action name only), `result_success`, `result_error` (error _category_ only), `copy_clicked`, `download_clicked`, `related_tool_clicked`. Do not collect inputs, filenames, passwords, token claims, checksum values, generated IDs or output contents.

Evaluate **task completion proxy**, **time to first successful result**, **copy rate after success**, **error recovery rate**, **repeat tool usage (aggregated, privacy-conscious)**, **Core Web Vitals**, **GSC search clicks/CTR/position**. No fixed success-percent targets are claimed without baseline. Simple smoke usability: ask 5 users to format a JSON, compare 2 snippets, copy a password, decode Base64 and convert GB→GiB; record where they hesitate. Five interviews are exploratory, not statistical proof.

---

## 11. Future tool roadmap — retained from source [S], re-evaluated [R]

**Original document notes:** 2026-10-26 qualitative research on DevToys, IT-Tools and Genie9. It labels all 12 inventory tools live; the bottom of that document highlights four of them as Batch 1 completed (YAML, JWT, Storage, Hash). Treat **all 12 as currently implemented** based on the main inventory; don't misread the lower list as only 4 existing tools.

### 11.1 Next queue (source order preserved)

| Original order | Tool                             | Original concept                                  | Recommendation                                                          |
| -------------- | -------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------- |
| 1              | Upload / Restore Time Calculator | Size + bandwidth + transfer efficiency → duration | **Research next**: adjacent to Storage; client-side, helpful for DevOps |
| 2              | SQL Formatter                    | Dialect-aware formatting, no execution            | **Research next**: frequent utility; check competitive SERP             |
| 3              | JSON ↔ CSV Converter             | Bidirectional, headers/delimiters, table preview  | **Good extension** from JSON workspace; validate data shape limitations |
| 4              | Regex Tester                     | JS regex, captures, replacement, worker timeout   | **Research next**: frequent use, substantial UX/complexity competition  |
| 5              | IPv4 / CIDR Calculator           | Subnets, masks, ranges, membership                | **Good tech differentiator**; test developer/admin search demand        |
| 6              | chmod Calculator                 | Permission checkboxes ↔ octal/symbolic            | **Quick validation candidate**; likely easy to build                    |

### 11.2 Later shortlist (source order preserved)

- Text Utilities: case conversion, line sort/dedup, word count, cleanup.
- HTML Escape / Unescape: safe text-only entities.
- QR Code Generator: URL/text/Wi-Fi, PNG/SVG local export.
- JSON Diff: structured object comparison; distinct from text diff.
- Backup Storage Calculator: source size, daily change, retention modeling.

**Backlog rule:** discover → research SERP and user pain → validate with simplest utility → prioritize → build. Don't append separate tools for modes that current tools already cover (JSON minify/validate, Base64URL, cron preview). Don't use speculative volumes or fake popularity badges.

---

## 12. Concrete design decisions for next sprint

1. **Do not redesign sidebar yet.** Fix one `wide editor` page and one `compact` page first; propagate only validated improvements.
2. **Start with Text Compare:** result placement is the clearest direct UX issue in supplied screenshots. Build the `DiffWorkspace` pattern and verify Split/Unified are visible in the right context.
3. **Next JSON Formatter:** dynamic pane height + output actions, then Tree View behind a tab. Ensure numeric precision is not silently corrupted.
4. **Base64 and YAML:** reuse editor surface and error result states, but keep tool-specific controls, privacy and conversion limits.
5. **Storage and Password:** compress documentation and related cards; preserve exact calculation/Web Crypto logic and clarify current output state.
6. **Run a design QA at 1440×900, 820×1180, 390×844** before adding new features.
7. **Publish only after behavior tests and privacy review.** Visual polish alone is not a release gate.

### Proposed implementation structure (framework-agnostic)

```text
src/
  components/tool-shell/
    ToolPageShell
    ToolHeader
    ToolToolbar
    ToolResultPanel
    ToolStatus
    ToolGuide
    RelatedTools
  components/workspaces/
    DualEditorWorkspace
    DiffWorkspace
    GeneratorWorkspace
    CronBuilderWorkspace
    ConverterWorkspace
    InspectorWorkspace
  components/inputs/
    CodeEditor
    CopyAction
    DownloadAction
    ExamplePicker
    UnitSelector
  features/tools/
    json-formatter/
    text-compare/
    base64/
    url-encoder/
    cron/
    timestamp/
    password/
    uuid/
    yaml-json/
    jwt/
    storage/
    hash/
  lib/
    safe-formatters/
    worker-tasks/
    analytics-events-only/
```

Note: These are conceptual module names, not an instruction to change the current tech stack or existing directory structure blindly.

---

## Appendix A — Source cross-reference

**Original internal source:** `Pasted markdown.md`, read in full on 2026-10-27 (source owner: InfraTrove project). The original contains placeholder benchmark sites, current capabilities, route table, global inspiration and two future queues. The current rewrite fills in reference URLs, provides design patterns and moves proposed work into explicit priorities. No material facts about implemented functionality should be inferred beyond that source or the screenshots.

**Public references verified on 2026-10-27:**

- https://jsonformatter.org/
- https://jsonconsole.com/tools
- https://www.diffchecker.com/
- https://text.compare/
- https://base64.guru/converter/encode
- https://www.urlencoder.org/
- https://www.urldecoder.org/
- https://crontab.guru/
- https://crontab.io/
- https://crontab.io/visual-builder
- https://www.epochconverter.com/
- https://timestamp.tools/
- https://bitwarden.com/password-generator/
- https://bitwarden.com/passphrase-generator/
- https://uuidtools.com/
- https://uuidtools.com/generate/v7
- https://transform.tools/yaml-to-json
- https://jwt.io/
- https://genie9.com/workspace/dev/jwt-decoder
- https://genie9.com/workspace/converter/storage-converter
- https://www.convertunits.com/from/GB/to/GiB
- https://emn178.github.io/online-tools/sha256.html
- https://emn178.github.io/online-tools/sha256_checksum.html
- https://gchq.github.io/CyberChef/
- https://github.com/DevToys-app/DevToys
- https://it-tools.tech/

**Standards:**

- https://pml.nist.gov/cuu/Units/binary.html
- https://www.rfc-editor.org/rfc/rfc9562.html
- https://www.rfc-editor.org/rfc/rfc7519.html
- https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
- https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

**Caution:** competitor product descriptions and pages can change after research. Do not infer traffic or monetization success from the existence of these sites. Some competitor pages mix SI/IEC labels; follow NIST, not competitor wording. Actual InfraTrove functionality needs code-level audit before changing current-feature status.

---

## Appendix B — Founder sign-off checklist

- [ ] Confirm this document is a companion to — not a replacement for — `plans/feature.md`.
- [ ] Agree that left sidebar and palette remain, only workspaces are redesigned.
- [ ] Pick a concrete pilot: Text Compare + JSON Formatter.
- [ ] Review `P0` (must ship) vs `P1/P2` (defer) scope by tool.
- [ ] Validate frontend constraints: editor library, current component architecture, routing, worker strategy.
- [ ] Add annotated before/after screenshots and measure task completion after implementation.

**Final principle:** _Make the common task immediate; make advanced operations discoverable; never sacrifice correctness or privacy for visual polish or SEO._
