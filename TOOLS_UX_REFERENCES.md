# InfraTrove — Tool UX References & Benchmark Tracker

This document compiles all tools currently available on **InfraTrove**. You can record benchmark websites (reference UX sites), notable features, and user experience notes under each tool below for engineering research and continuous upgrades.

---

## 📌 Overview of Implemented Tools

|  #  | Tool                           | Category          |   Current Layout   | Path                                                                   |
| :-: | ------------------------------ | ----------------- | :----------------: | ---------------------------------------------------------------------- |
|  1  | **JSON Formatter & Validator** | Text & data       | `editors` (2 cols) | [`/tools/json-formatter/`](/tools/json-formatter/)                     |
|  2  | **Text Compare (Diff)**        | Text & data       | `editors` (2 cols) | [`/tools/text-compare/`](/tools/text-compare/)                         |
|  3  | **Base64 Encoder / Decoder**   | Encode & decode   | `editors` (2 cols) | [`/tools/base64-encoder-decoder/`](/tools/base64-encoder-decoder/)     |
|  4  | **URL Encoder / Decoder**      | Encode & decode   | `editors` (2 cols) | [`/tools/url-encoder-decoder/`](/tools/url-encoder-decoder/)           |
|  5  | **Cron Expression Generator**  | Time & scheduling | `panel` (compact)  | [`/tools/cron-generator/`](/tools/cron-generator/)                     |
|  6  | **Unix Timestamp Converter**   | Time & scheduling | `panel` (compact)  | [`/tools/unix-timestamp-converter/`](/tools/unix-timestamp-converter/) |
|  7  | **Password Generator**         | Generators        | `panel` (compact)  | [`/tools/password-generator/`](/tools/password-generator/)             |
|  8  | **UUID Generator**             | Generators        | `panel` (compact)  | [`/tools/uuid-generator/`](/tools/uuid-generator/)                     |
|  9  | **YAML ↔ JSON Converter**      | Text & data       | `editors` (2 cols) | [`/tools/yaml-json-converter/`](/tools/yaml-json-converter/)           |
| 10  | **JWT Decoder**                | Encode & decode   | `editors` (2 cols) | [`/tools/jwt-decoder/`](/tools/jwt-decoder/)                           |
| 11  | **Storage Unit Converter**     | Text & data       | `panel` (compact)  | [`/tools/storage-unit-converter/`](/tools/storage-unit-converter/)     |
| 12  | **Hash & Checksum**            | Generators        | `panel` (compact)  | [`/tools/hash-checksum/`](/tools/hash-checksum/)                       |

---

## 🛠️ Tool Details & UX Benchmark Inputs

### 1. JSON Formatter & Validator

- **Current capabilities**: Format/beautify JSON (2 spaces, 4 spaces), minify JSON, syntax validation with precise error hints, line/character count, copy output.
- **Layout**: 2 side-by-side editors (Input left, Output right).
- **Route**: `/tools/json-formatter/`

#### 🌐 Reference UX Sites (Fill in here):

- **Site 1**:
  - URL:
  - Notable strengths (layout, features, shortcuts, tree view, etc.):
- **Site 2**:
  - URL:
  - Notable strengths:
- **Notes / Planned Features**:
  - [ ] Collapsible JSON tree view?
  - [ ] Filter JSON via JSONPath / JQ syntax?
  - [ ] Convert JSON to YAML / CSV / TypeScript interface?

---

### 2. Text Compare (Diff Checker)

- **Current capabilities**: Compare two texts, line-level added/removed/modified flags, word-level inline difference highlighting (`mark`), ignore case toggle, ignore whitespace toggle, side-by-side and unified modes.
- **Layout**: 2 input editors ➔ Table-based diff result with dual line numbers.
- **Route**: `/tools/text-compare/`

#### 🌐 Reference UX Sites (Fill in here):

- **Site 1**:
  - URL:
  - Notable strengths:
- **Site 2**:
  - URL:
  - Notable strengths:
- **Notes / Planned Features**:
  - [ ] Synchronized smooth scrolling across panels?
  - [ ] Swap button (switch original and modified panes)?

---

### 3. Base64 Encoder / Decoder

- **Current capabilities**: Encode and decode UTF-8 text (full Unicode and emoji support), standard Base64 and URL-safe Base64 variants, one-click copy.
- **Layout**: 2 side-by-side editors (Input and Output).
- **Route**: `/tools/base64-encoder-decoder/`

#### 🌐 Reference UX Sites (Fill in here):

- **Site 1**:
  - URL:
  - Notable strengths:
- **Site 2**:
  - URL:
  - Notable strengths:
- **Notes / Planned Features**:
  - [ ] Image file encode/decode (Image to Base64 data URL) with live image preview?

---

### 4. URL Encoder / Decoder

- **Current capabilities**: Encode / decode URL components (percent-encoding), special character and space handling, query param preservation.
- **Layout**: 2 side-by-side editors.
- **Route**: `/tools/url-encoder-decoder/`

#### 🌐 Reference UX Sites (Fill in here):

- **Site 1**:
  - URL:
  - Notable strengths:
- **Site 2**:
  - URL:
  - Notable strengths:
- **Notes / Planned Features**:
  - [ ] Detailed URL breakdown table (Protocol, Host, Pathname, Query parameters as structured Key-Value pairs)?

---

### 5. Cron Expression Generator

- **Current capabilities**: Generate 5-field Unix cron expressions, natural English schedule explanations, quick presets (every minute, hourly, daily...), calculate and preview the next 5 execution times, UTC vs Local browser timezone toggle.
- **Layout**: Compact interactive panel + upcoming execution timeline table.
- **Route**: `/tools/cron-generator/`

#### 🌐 Reference UX Sites (Fill in here):

- **Site 1**:
  - URL:
  - Notable strengths:
- **Site 2**:
  - URL:
  - Notable strengths:
- **Notes / Planned Features**:
  - [ ] Visual cron builder UI (segmented weekday pickers Mon-Sun, hour/minute sliders)?
  - [ ] Support 6-field cron syntax (Quartz cron / Spring / AWS EventBridge)?

---

### 6. Unix Timestamp Converter

- **Current capabilities**: Convert timestamps (seconds or milliseconds) to human-readable dates (UTC, ISO 8601, Local time), reverse conversion from date-time to epoch timestamps, "Now" button for current time.
- **Layout**: Compact time parameter panel.
- **Route**: `/tools/unix-timestamp-converter/`

#### 🌐 Reference UX Sites (Fill in here):

- **Site 1**:
  - URL:
  - Notable strengths:
- **Site 2**:
  - URL:
  - Notable strengths:
- **Notes / Planned Features**:
  - [ ] Live ticking real-time clock indicator?
  - [ ] Relative time calculations ("3 hours ago", "in 2 days")?

---

### 7. Password Generator

- **Current capabilities**: Cryptographically secure random passwords via `crypto.getRandomValues()`, configurable length (8 - 128 characters), character set toggles (Uppercase, Lowercase, Numbers, Symbols), exclude confusing characters (`l`, `1`, `I`, `O`, `0`...), real-time password entropy gauge.
- **Layout**: Interactive slider + large checkbox controls + high-contrast syntax-tinted password display.
- **Route**: `/tools/password-generator/`

#### 🌐 Reference UX Sites (Fill in here):

- **Site 1**:
  - URL:
  - Notable strengths:
- **Site 2**:
  - URL:
  - Notable strengths:
- **Notes / Planned Features**:
  - [ ] Memorable passphrase generator (e.g., `correct-horse-battery-staple`)?
  - [ ] Ephemeral in-session generation history?

---

### 8. UUID Generator

- **Current capabilities**: Cryptographically secure bulk UUID v4 generation (1 to 100 identifiers per run), individual copy button per item and Copy All action.
- **Layout**: Quantity configuration panel + scrollable monospace result list.
- **Route**: `/tools/uuid-generator/`

#### 🌐 Reference UX Sites (Fill in here):

- **Site 1**:
  - URL:
  - Notable strengths:
- **Site 2**:
  - URL:
  - Notable strengths:
- **Notes / Planned Features**:
  - [ ] Support UUID v7 (time-ordered UUIDs)?
  - [ ] Formatting options (standard hyphenated, unhyphenated, uppercase/lowercase)?

---

### 9. YAML ↔ JSON Converter

- **Current capabilities**: Bidirectional conversion between YAML 1.2 core and JSON, syntax validation with clear error messages, copy and file download actions.
- **Layout**: 2 side-by-side editors with swap direction button.
- **Route**: `/tools/yaml-json-converter/`

#### 🌐 Reference UX Sites (Fill in here):

- **Site 1**:
  - URL:
  - Notable strengths:
- **Site 2**:
  - URL:
  - Notable strengths:
- **Notes / Planned Features**:
  - [ ] Multi-document YAML support?

---

### 10. JWT Decoder

- **Current capabilities**: Client-side inspection of JWT header and payload, automatic human-readable UTC formatting of time claims (`exp`, `iat`, `nbf`), prominent disclaimer that signatures are not verified.
- **Layout**: Token input editor + formatted header/payload panels.
- **Route**: `/tools/jwt-decoder/`

#### 🌐 Reference UX Sites (Fill in here):

- **Site 1**:
  - URL:
  - Notable strengths:
- **Site 2**:
  - URL:
  - Notable strengths:
- **Notes / Planned Features**:
  - [ ] Signature status indicator (explicitly displaying unverified / unsigned)?

---

### 11. Storage Unit Converter

- **Current capabilities**: Convert decimal storage amounts between Bytes, SI units (kB, MB, GB, TB using base 1000), and IEC binary units (KiB, MiB, GiB, TiB using base 1024) simultaneously with exact rational precision and 9-decimal rounding.
- **Layout**: Compact numeric panel + comprehensive conversion matrix.
- **Route**: `/tools/storage-unit-converter/`

#### 🌐 Reference UX Sites (Fill in here):

- **Site 1**:
  - URL:
  - Notable strengths:
- **Site 2**:
  - URL:
  - Notable strengths:
- **Notes / Planned Features**:
  - [ ] Bandwidth / data transfer rate conversion mode (Gbps, MB/s)?

---

### 12. Hash & Checksum

- **Current capabilities**: Local SHA-256 and SHA-512 hashing for text strings and files up to 32 MiB, hex digest computation, real-time comparison against an expected checksum.
- **Layout**: Text / File toggle panel + calculated hash output and checksum comparison validator.
- **Route**: `/tools/hash-checksum/`

#### 🌐 Reference UX Sites (Fill in here):

- **Site 1**:
  - URL:
  - Notable strengths:
- **Site 2**:
  - URL:
  - Notable strengths:
- **Notes / Planned Features**:
  - [ ] Additional hash algorithms (e.g., SHA-384, MD5 / SHA-1 legacy verification warnings)?

---

## 🎨 Global Website Benchmark & Inspiration (Global UX / UI System)

List products or websites with overall aesthetics, micro-interactions, or workflows you admire (e.g., Raycast, Linear, Vercel, DevToys, CyberChef, IT-Tools, Omatsuri...):

1. **Global Reference Site 1**:
   - URL:
   - Notable strengths (color palette, Command palette search, keyboard navigation, typography, responsiveness...):
2. **Global Reference Site 2**:
   - URL:
   - Notable strengths:

---

## 💡 Future Tool Proposals & Ideas Backlog

Updated **2026-10-26** following qualitative research on DevToys, IT-Tools, and Genie9. The [Product Spec](plans/feature.md) §5 remains the primary source of truth for priority, scope, and status; the first batch below is **completed and live**, while subsequent queues remain unreleased.

### Batch 1 Completed: 12 Live Tools

- [x] **YAML ↔ JSON Converter**: Bidirectional conversion, error reporting, copy/download. Reference: [DevToys](https://github.com/DevToys-app/DevToys).
- [x] **JWT Decoder**: Header/payload inspection, human-readable `exp`/`iat`/`nbf` claims, signature verification caveat. Reference: [Genie9 JWT](https://genie9.com/workspace/dev/jwt-decoder).
- [x] **Storage Unit Converter**: Convert Bytes, SI and IEC units simultaneously. Reference: [Genie9 Storage](https://genie9.com/workspace/converter/storage-converter); strict GB vs GiB distinction per [NIST](https://pml.nist.gov/cuu/Units/binary.html).
- [x] **Hash & Checksum**: Local text/file hashing, SHA-256/SHA-512, expected checksum comparison. Reference: [Genie9 File Checksum](https://genie9.com/workspace/security/file-checksum).

### Next Queue (In Priority Order)

- [ ] **Upload / Restore Time Calculator**: Data size + bandwidth + assumed transfer efficiency → estimated transfer duration; shares storage conversion math. Reference: described in [Genie9 Workspace](https://genie9.com/workspace).
- [ ] **SQL Formatter**: Dialect-aware query formatting without executing SQL.
- [ ] **JSON ↔ CSV Converter**: Bidirectional conversion, header/delimiter handling, tabular preview.
- [ ] **Regex Tester**: JavaScript flavor, matches/groups, replace preview, timed Web Worker execution.
- [ ] **IPv4 / CIDR Calculator**: Subnet network, mask, address range, and IP membership checks.
- [ ] **chmod Calculator**: Unix permission checkboxes ↔ octal ↔ symbolic notation without host execution.

### Later Shortlist (Screened, Unscheduled)

- [ ] **Text Utilities**: Consolidated tool for case conversion, line sort/dedup, word/character count, and text cleanup.
- [ ] **HTML Escape / Unescape**: Encode/decode HTML entities safely as plain text.
- [ ] **QR Code Generator**: Static QR codes for URLs, text, and Wi-Fi credentials; PNG/SVG export.
- [ ] **JSON Diff**: Structured object difference visualizer, distinct from textual diff.
- [ ] **Backup Storage Calculator**: Source size, daily change rate, retention policy modeling.

Different modes of the same task do not become separate tools. JSON minification/validation, Base64URL, and cron execution previews are already integrated into existing tools. Unvalidated competitor metrics or "Popular" badges do not substitute for verified search demand.

### References

- https://genie9.com/
