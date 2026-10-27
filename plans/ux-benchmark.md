---
title: "InfraTrove — Tool UX Benchmark & Workspace Patterns"
version: "2.0"
status: "UX design baseline and implementation-ready specifications"
updated: "2026-10-27"
project: "InfraTrove"
language: "en"
website_language: "en"
architecture: "5 Reusable Workspace Patterns on Astro + React Islands"
related_documents:
  - "feature.md"
  - "techstack.md"
---

# InfraTrove — Tool UX Benchmark & Workspace Patterns (v2.0)

> **Purpose:** Foundational UX design specification, competitive benchmark, and implementation guide for InfraTrove's browser-based developer utilities. Establishes five reusable workspace patterns to improve task completion, reading ergonomics, and privacy across all tools.
>
> **Companion Documents:**
> - [feature.md](feature.md) defines product strategy, catalog priorities, and functional requirements.
> - [techstack.md](techstack.md) specifies the technical architecture, runtime choices, and deployment pipeline.

---

## 0. Executive Decisions

**Do not rebuild InfraTrove from scratch. Preserve existing branding, sidebar navigation, URL routes, and pure TypeScript business logic; refactor tool interfaces into 5 reusable workspace patterns.** The goal is to maximize task completion speed, clarity of results, user trust, and repeat usage—not to accumulate unnecessary visual effects.

1. **Fix layout ergonomics first:** Eliminate oversized empty editor heights, bring results above the fold, place actions adjacent to outputs, display explicit error/status indicators, ensure responsive mobile behavior, and establish consistent container widths.
2. **Add high-value features sequentially:** Introduce JSON Tree View, above-the-fold diff results, Cron visual builder, UUID v7 support, and multi-format timestamp previews.
3. **Expand catalog only after existing tools meet quality gates:** Keep new tool ideas in the backlog until the 12 existing utilities satisfy all acceptance criteria. Do not speculate on unverified SEO demand or revenue.
4. **Client-side privacy is non-negotiable:** Passwords, JWTs, editor payloads, uploaded files, and checksums are processed exclusively in browser tab memory. Zero sensitive user data is ever sent to servers, analytics, or error logs.
5. **SEO copy must never degrade utility:** Explanatory guides, technical references, and FAQs sit below the interactive workspace. Do not split unified tools into separate URLs solely for search variations.

### Evidence & Certainty Classification

Every observation and recommendation in this document is labeled with its source category:

- **`[S] Source Inventory`:** Established capabilities and catalog status from project specifications (`plans/feature.md`, `src/data/tools.ts`).
- **`[UI] Screenshot Audit`:** Grounded visual findings from audit screenshots of 6 tools (JSON Formatter, Text Compare, YAML ↔ JSON, Storage Converter, Base64, Password Generator).
- **`[V] Verified Benchmark`:** Public competitor and reference behaviors inspected directly on October 27, 2026.
- **`[R] Recommendation`:** Proposed UX improvements, workspace patterns, and prioritized engineering tasks.
- **`[H] Hypothesis`:** Assumptions regarding task completion, retention, and search discovery to be validated with real post-launch data.

---

## 1. Existing Product Inventory [S]

InfraTrove currently provides 12 live tools, organized into 4 logical categories:

| # | Tool | Category | Route | Capability Summary |
|---|---|---|---|---|
| 1 | **JSON Formatter & Validator** | Text & data | `/tools/json-formatter/` | Beautify (2/4 spaces), minify, syntax error markers with line hints, char/line counts, copy/download. |
| 2 | **Text Compare (Diff)** | Text & data | `/tools/text-compare/` | Side-by-side & unified diffs, inline word-level highlights, ignore case/whitespace toggles, swap inputs. |
| 3 | **Base64 Encoder / Decoder** | Encode & decode | `/tools/base64-encoder-decoder/` | UTF-8 Unicode and emoji support, standard & URL-safe Base64, live conversion, copy output. |
| 4 | **URL Encoder / Decoder** | Encode & decode | `/tools/url-encoder-decoder/` | Component percent-encoding and decoding, reserved character handling, query param preservation. |
| 5 | **Cron Expression Generator** | Time & scheduling | `/tools/cron-generator/` | Unix 5-field syntax, human-readable schedule description, common presets, next 5 execution times. |
| 6 | **Unix Timestamp Converter** | Time & scheduling | `/tools/unix-timestamp-converter/` | Seconds & milliseconds ↔ UTC/local/ISO 8601 dates, epoch to human date, "Now" live button. |
| 7 | **Password Generator** | Generators | `/tools/password-generator/` | CSPRNG randomness (`crypto.getRandomValues`), 8–128 length, 4 character groups, ambiguous character filter. |
| 8 | **UUID Generator** | Generators | `/tools/uuid-generator/` | Cryptographically secure UUID v4, batch generation (1–100), copy single/all values. |
| 9 | **YAML ↔ JSON Converter** | Text & data | `/tools/yaml-json-converter/` | Bidirectional YAML 1.2 core ↔ JSON, parse error diagnostics, copy/download, 100k character boundary. |
| 10 | **JWT Decoder** | Encode & decode | `/tools/jwt-decoder/` | Client-side header/payload decode, UTC date claims (`exp`, `iat`, `nbf`), prominent unverified disclaimer. |
| 11 | **Storage Unit Converter** | Text & data | `/tools/storage-unit-converter/` | Exact rational arithmetic across Bytes, SI (1000) and IEC (1024) units through TB/TiB, 9-decimal precision. |
| 12 | **Hash & Checksum** | Generators | `/tools/hash-checksum/` | Local SHA-256 and SHA-512 text/file hashing (≤32 MiB), case-insensitive expected hash compare. |

---

## 2. Screenshot-Based UX Audit [UI]

### 2.1 Shared Layout Observations

**What to preserve:**
- Warm paper background canvas (`#FBF9F5` / `#121110`).
- Subtle hairline borders and restrained amber/orange accent cues.
- Left-hand category navigation with clear active states.
- Clean typography: System sans-serif for UI copy; monospace for code, hashes, and structured outputs.

**What to improve:**

| Issue Identified in UI Audit | Severity | Root Cause | Proposed Solution [R] |
|---|---|---|---|
| Editor panes occupy excessive vertical space (~900px) even when empty | **High** | Fixed minimum heights force low information density | Set content-aware initial heights (280–360px); allow manual resize or fullscreen modal. |
| Text Compare pushes diff output completely below the fold | **High** | Dual 600px input editors dominate the screen before compare action | Automatically collapse/accordion inputs after clicking Compare; anchor diff result into main view. |
| Identical two-editor geometry applied across distinct task types | **Medium** | Rigid page template used for JSON, Base64, and YAML without specialization | Separate shared editor component from page layout; map each tool to its optimal workspace pattern. |
| Primary actions positioned far from corresponding outputs | **Medium** | Buttons placed in top bars rather than output panels | Place contextual `Copy`, `Download`, and `Expand` actions directly inside result panel headers. |
| Prominent "How to use" sidebars squeeze workspaces on medium screens | **Medium** | Documentation cards compete with active inputs | Relocate comprehensive documentation below the fold; keep only compact dismissible hints near the workspace. |
| Inconsistent container widths across different tools | **Low** | Ad-hoc layout wrappers on individual pages | Standardize page containers into 3 presets: Wide (1440px), Medium (1120px), Compact (840px). |

### 2.2 Per-Tool Findings

- **JSON Formatter:** Split layout is fundamentally sound. Need: `Code | Tree` view tabs, line/column error indicator with click-to-line, file upload/download, and dynamic editor height.
- **Text Compare:** Swap and whitespace toggles already exist. Main priority: bring diff results into the immediate viewport upon clicking Compare, and place the Split vs. Unified toggle next to the result.
- **YAML ↔ JSON:** Direction selector and pane separation work well. Disclose limits clearly: YAML 1.2, 100k char cap, no aliases/custom tags, comments not preserved. Place download actions directly on output panes.
- **Storage Unit Converter:** Clean input fields, but empty state provides low visual signal. Automatically display a live conversion matrix across all SI and IEC units upon input, and preserve exact rational calculations.
- **Base64:** Clean Encode/Decode tabs. Editors are unnecessarily tall for short strings. Reduce initial height to ~280px, enable live conversion, and provide an explicit Swap action.
- **Password Generator:** Strong layout with entropy meter. Ensure copy action is disabled until a password is generated, distinguish estimated strength from generated output, and never store passwords in session history.

---

## 3. Competitive Benchmark [V]

Public developer utilities benchmarked on October 27, 2026:

| Tool | Primary Benchmark | Secondary Benchmark | Transferable Best Practices | Anti-Patterns to Avoid |
|---|---|---|---|---|
| **JSON Formatter** | [JSONFormatter.org](https://jsonformatter.org/) | [JSON Console](https://jsonconsole.com/tools) | Tree + Code view tabs, line-level syntax validation, copy/download. | Do not persist pasted JSON into `localStorage`. |
| **Text Compare** | [Diffchecker](https://www.diffchecker.com/) | [text.compare](https://text.compare/) | Side-by-side/unified modes, synchronized scrolling, ignore rules. | Do not lock essential features behind paywalls or subscriptions. |
| **Base64** | [Base64.Guru](https://base64.guru/) | [CyberChef](https://gchq.github.io/CyberChef/) | URL-safe toggle, character set indicators, copy/download actions. | Do not transmit user inputs to remote conversion endpoints. |
| **URL Encoder** | [URLEncoder.org](https://www.urlencoder.org/) | [URLDecoder.org](https://www.urldecoder.org/) | Clear mode indicators (`encodeURIComponent` vs full URL), query param breakdown. | Do not allow ambiguous double-encoding. |
| **Cron Generator** | [Crontab.guru](https://crontab.guru/) | [Crontab.io](https://crontab.io/visual-builder) | Natural language description, quick presets, upcoming run preview. | Do not mix 5-field Unix and 6-field Quartz cron without explicit mode labels. |
| **Unix Timestamp** | [EpochConverter](https://www.epochconverter.com/) | [timestamp.tools](https://timestamp.tools/) | Live current timestamp, multi-format output table (UTC, Local, ISO). | Do not auto-guess ambiguous 10-digit vs 13-digit inputs silently. |
| **Password** | [Bitwarden Generator](https://bitwarden.com/password-generator/) | [Bitwarden Passphrase](https://bitwarden.com/passphrase-generator/) | CSPRNG randomness, unambiguous character filtering, entropy gauge. | Do not make unrealistic "time to crack" claims; zero storage. |
| **UUID Generator** | [UUIDTools](https://uuidtools.com/) | [UUIDTools v7](https://uuidtools.com/generate/v7) | RFC compliance, batch generation, uppercase/lowercase formatting. | Do not conflate UUIDs with cryptographic secrets. |
| **YAML ↔ JSON** | [transform.tools](https://transform.tools/yaml-to-json) | [JSON Console](https://jsonconsole.com/tools) | Bidirectional conversion, instant swap, clear parse error diagnostics. | Do not claim lossless conversion where comments/tags are dropped. |
| **JWT Decoder** | [jwt.io](https://jwt.io/) | [Genie9 JWT](https://genie9.com/workspace/dev/jwt-decoder) | Color-coded segments, structured claims view, clear timestamp expiration. | Decoded does **not** mean verified; never display unverified signatures as safe. |
| **Storage Converter** | [ConvertUnits](https://www.convertunits.com/from/GB/to/GiB) | [Genie9 Storage](https://genie9.com/workspace/converter/storage-converter) | Simultaneous SI vs. IEC matrix, exact rational precision. | Never confuse decimal GB (10⁹) with binary GiB (2³⁰); adhere strictly to NIST. |
| **Hash & Checksum** | [emn178 SHA-256](https://emn178.github.io/online-tools/sha256.html) | [emn178 File Hash](https://emn178.github.io/online-tools/sha256_checksum.html) | In-browser Web Crypto hashing, local file dropzone, expected hash matching. | Do not upload files to server; checksum match is not malware clearance. |

### Technical Standards & Authorities

- **UUIDs:** [RFC 9562 — Universally Unique IDentifiers](https://www.rfc-editor.org/rfc/rfc9562.html)
- **Binary & Decimal Units:** [NIST — SI and IEC Prefixes](https://pml.nist.gov/cuu/Units/binary.html)
- **JSON Web Tokens:** [RFC 7519 — JSON Web Token (JWT)](https://www.rfc-editor.org/rfc/rfc7519.html)
- **Web Cryptography:** [W3C Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/)
- **Search Quality:** [Google Search Central — Creating Helpful Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

---

## 4. Target UX Architecture — Five Workspace Patterns [R]

Every tool maps to one of five reusable, battle-tested workspace patterns:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Site Header: Logo | Tools | Blog | Command Palette (⌘K) | Theme Toggle │
├────────────────────────────────────────────────────────────────────────┤
│ Breadcrumbs: Home > Tools > Category > Tool Name                       │
│ H1: Tool Title & Value Proposition                                     │
│                                                                        │
│ ┌────────────────────── WORKSPACE (Above the Fold) ──────────────────┐ │
│ │ Pattern A: Dual Editor      │ Pattern B: Diff Workspace            │ │
│ │ Pattern C: Generator        │ Pattern D: Interactive Builder       │ │
│ │ Pattern E: Converter / Inspector                                   │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ Step-by-Step Instructions · Technical Edge Cases · FAQ · Related Tools │
├────────────────────────────────────────────────────────────────────────┤
│ Footer: About | Contact | Privacy | Terms                              │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Pattern A — Dual Editor
*Used by: JSON Formatter, YAML ↔ JSON, Base64, URL Encoder*

```text
[ Mode / Options Bar ]                           [ Load Sample ] [ Clear ]
┌─ Input Pane ──────────────────────┐  ┌─ Output Pane [Code | Tree] [Copy] ─┐
│ Editable source with line numbers │  │ Formatted read-only output         │
│ and syntax error markers          │  │ with contextual action buttons     │
└───────────────────────────────────┘  └────────────────────────────────────┘
[ Counts: Lines · Chars · Bytes ]      [ Status: Valid / Parsing diagnostic ]
```

- Split 50:50 on desktop (≥1024px); vertically stacked on mobile (<768px).
- Dynamic initial height (~280–360px), expandable up to `60vh` or full viewport.
- Independent scrolling between input and output panes.
- Output pane is strictly read-only with copy/download triggers in the pane header.

### 4.2 Pattern B — Diff Workspace
*Used by: Text Compare*

```text
[ Compare ] [ Swap ] [ Ignore Whitespace ] [ Ignore Case ] [ Split | Unified ]
┌─ Original Text ───────────────────┐  ┌─ Changed Text ─────────────────────┐
│ Source version                    │  │ Modified version                   │
└───────────────────────────────────┘  └────────────────────────────────────┘
[ + N additions ] [ - N deletions ] [ ~ N modifications ] [ Prev ] [ Next ]
┌─────────────────────────── DIFF RESULT ───────────────────────────────────┐
│ Synchronized line numbers · Inline word diffs · Collapsible unchanged rows│
└───────────────────────────────────────────────────────────────────────────┘
```

- Clicking **Compare** smoothly collapses or accordions the raw inputs, bringing the diff results directly into view.
- Provides synchronized scrolling in Split mode and single-column rendering in Unified mode.
- Includes step-by-step navigation buttons (`Next change` / `Previous change`).

### 4.3 Pattern C — Generator
*Used by: Password Generator, UUID Generator*

```text
┌──────────────────────── MAIN RESULT DISPLAY ──────────────────────────────┐
│ Monospace Output: 4f8b2a1c-9e3d-4a5f-8b2c-1d0e9f8a7b6c   [ Copy ] [ Regen ]│
└───────────────────────────────────────────────────────────────────────────┘
[ Quantity / Length Slider ] [ Options & Checkboxes ] [ Advanced Formatting ]
[ Privacy & Entropy Note: 100% In-Browser Cryptographic Randomness ]
```

- Primary generated value is rendered prominently at the top with an immediate Copy action.
- Configuration sliders and checkboxes sit directly below the result.
- Displays realistic entropy/strength estimates without fabricating crack times.

### 4.4 Pattern D — Interactive Builder
*Used by: Cron Expression Generator*

```text
┌─ Expression Hero: 0 9 * * 1-5 ───────────────────────── [ Copy ] [ Valid ]─┐
│ "At 09:00 AM, Monday through Friday"                                      │
└───────────────────────────────────────────────────────────────────────────┘
[ Common Presets: Hourly · Daily · Weekly · Weekdays · Monthly ]
[ Visual Builder Tabs: Minutes · Hours · Day of Month · Month · Day of Week ]
Upcoming Scheduled Runs (Timezone: UTC / Local Browser):
1. 2026-10-28 09:00:00 UTC
2. 2026-10-29 09:00:00 UTC
3. 2026-10-30 09:00:00 UTC
```

- Clean bidirectional sync: Editing the expression updates the visual builder; clicking builder fields updates the expression.
- Displays the next 5 execution timestamps with explicit timezone labels.

### 4.5 Pattern E — Converter / Inspector
*Used by: Unix Timestamp, Storage Unit Converter, JWT Decoder, Hash & Checksum*

```text
┌─ Primary Input Row ───────────────────────────────────────────────────────┐
│ [ Enter Value / Select Unit / Drop File ]                 [ Action / Reset ]│
└───────────────────────────────────────────────────────────────────────────┘
┌─ Structured Output / Conversion Matrix ───────────────────────────────────┐
│ Table or cards with instant conversions and individual row copy buttons    │
│ Security/verification status clearly displayed (e.g. Unverified signature) │
└───────────────────────────────────────────────────────────────────────────┘
```

- Produces instant conversion output upon input.
- Displays structured data (e.g. JWT claims or SI/IEC unit tables) in clean, copyable rows.
- Clear contextual badges for verification status (e.g., neutral warning badge for unverified JWTs).

---

## 5. Visual Design System & Component Contracts [R]

Tokens mirror `DESIGN.md` and `src/styles/global.css`:

### 5.1 Design Tokens

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--background` | `#FBF9F5` (warm paper) | `#121110` (deep ink) | Page body canvas |
| `--surface` | `#FFFFFF` | `#1C1A18` | Workspace card, tool panels |
| `--surface-muted` | `#F5F1EB` | `#24211F` | Output panels, secondary regions |
| `--text` | `#24211F` (charcoal) | `#EDE8E1` | Primary headings and text |
| `--text-muted` | `#69635C` | `#9E968D` | Secondary labels, line numbers |
| `--border` | `#E5E0D8` | `#2E2A25` | Hairline card and control borders |
| `--primary` | `#1C1A18` | `#E8590C` | Primary action button |
| `--accent-color` | `#E8590C` (amber orange) | `#E8590C` | Active states, focus rings |

### 5.2 Component Contracts

- **`ToolLayout`:** Standard Astro shell rendering breadcrumbs, H1, description, client island, and editorial guide.
- **`ToolShell`:** Universal React island wrapper providing action bars, error states, and responsive presets.
- **`CodeEditor`:** Shared text editor with syntax highlighting, line numbers, character counters, and read-only modes.
- **`Select`:** Accessible custom combobox (`src/components/tools/Select.tsx`) replacing unstyled native dropdowns.
- **`CopyButton`:** Accessible clipboard button with instant visual feedback ("Copied!" checkmark) and timeout reset.

---

## 6. Detailed Tool Specifications [S/R]

Priority levels:
- **`P0` (Release Quality):** Core layout, responsive sizing, edge-case unit tests, error states, clipboard safety.
- **`P1` (High-Value Polish):** Secondary views (Tree view, visual builder), advanced format toggles, file drag-and-drop.
- **`P2` (Future Exploratory):** Multi-file workflows, custom schema validation, batch processing.

### 6.1 JSON Formatter & Validator
- **User Job:** Format, minify, and validate JSON payloads with precise error diagnostics.
- **P0 Requirements:** Content-aware initial height; 2 and 4 space indentation; minify action; clear error banners indicating line and column; preserve input across errors; copy/download buttons.
- **P1 Requirements:** Collapsible interactive Tree View; search filter inside tree; local file upload and download.
- **Edge Cases:** Large numbers exceeding `Number.MAX_SAFE_INTEGER` without rounding; trailing commas rejected with clear messages; duplicate key handling.

### 6.2 Text Compare (Diff)
- **User Job:** Compare two text blocks or configuration files to spot additions, deletions, and line changes.
- **P0 Requirements:** Side-by-side (desktop) and unified (mobile) diffs; collapse inputs upon comparison; inline word-level diff marks; ignore case and ignore whitespace toggles; swap inputs.
- **P1 Requirements:** Synchronized split scrolling; step-by-step next/previous change navigation; copy modified blocks.
- **Edge Cases:** CRLF vs. LF line ending normalization; trailing newlines; multi-megabyte text inputs handled without browser freezing.

### 6.3 Base64 Encoder / Decoder
- **User Job:** Quickly encode and decode UTF-8 text and URL-safe Base64 strings.
- **P0 Requirements:** Compact dual editors (~280px); automatic live conversion; standard vs. URL-safe Base64 selector; swap input/output; copy button.
- **P1 Requirements:** Input/output byte counters; local file to Base64 conversion; data URI generation.
- **Edge Cases:** Multibyte UTF-8 Unicode characters and emojis; unpadded Base64 strings handled cleanly.

### 6.4 URL Encoder / Decoder
- **User Job:** Percent-encode or decode URL components without mangling query structure.
- **P0 Requirements:** Explicit mode selector (`Component` vs. `Full URL`); validation of percent-encoded sequences; swap button.
- **P1 Requirements:** Query parameter breakdown table (parsed key-value pairs); editable query parameters.
- **Edge Cases:** Malformed `%` sequences; handling `+` as space vs. literal `+`; preserving structural `://` delimiters in full URL mode.

### 6.5 Cron Expression Generator
- **User Job:** Build and verify 5-field Unix cron schedules with human-readable descriptions.
- **P0 Requirements:** Top expression hero with copy button; natural language explanation; calculation of next 5 runs; common presets (hourly, daily, weekly).
- **P1 Requirements:** Visual builder with interactive minutes/hours/weekdays tabs; explicit timezone selector (UTC vs. local).
- **Edge Cases:** Sunday 0 vs. 7 semantics; day-of-month and day-of-week combinations; Daylight Saving Time shifts.

### 6.6 Unix Timestamp Converter
- **User Job:** Convert epoch timestamps to human dates and vice versa.
- **P0 Requirements:** Prominent current timestamp card; support for seconds and milliseconds; outputs in UTC, Local, and ISO 8601; reverse date-to-epoch converter.
- **P1 Requirements:** Live ticking clock; relative time indicator (e.g. "3 hours ago"); IANA timezone selector.
- **Edge Cases:** Distinguishing 10-digit seconds from 13-digit milliseconds; negative timestamps (pre-1970); Year 2038 boundary.

### 6.7 Password Generator
- **User Job:** Generate cryptographically secure passwords matching custom requirements.
- **P0 Requirements:** Cryptographic randomness via Web Crypto (`crypto.getRandomValues`); length slider (8–128); character group toggles; ambiguous character filter (`l`, `1`, `I`, `0`, `O`); copy button disabled until generated; zero storage.
- **P1 Requirements:** Passphrase generator mode using curated wordlists; minimum required digits/symbols controls.
- **Edge Cases:** Preventing modulo bias through rejection sampling; handling constraint combinations safely.

### 6.8 UUID Generator
- **User Job:** Generate random RFC-compliant UUIDs for testing, database keys, and mock data.
- **P0 Requirements:** Cryptographically secure UUID v4 generation; batch generation (1–100); copy individual and copy all; uppercase/lowercase toggles.
- **P1 Requirements:** UUID v7 support (time-ordered per RFC 9562); hyphen-free formatting option.
- **Edge Cases:** Validating RFC version and variant bits; high-frequency batch generation without collisions.

### 6.9 YAML ↔ JSON Converter
- **User Job:** Convert configuration files bidirectionally between YAML and JSON.
- **P0 Requirements:** Explicit conversion direction; clear line-level parse errors; disclosure of YAML limits (100k chars, no custom tags/aliases, comments dropped); copy and download buttons.
- **P1 Requirements:** Indentation configuration; duplicate key warnings.
- **Edge Cases:** YAML implicit type coercion (e.g. `yes`/`no` to booleans); circular references rejected safely.

### 6.10 JWT Decoder
- **User Job:** Inspect JWT header and payload claims safely without remote verification.
- **P0 Requirements:** Client-side decoding; structured claims table; human-readable UTC dates for `exp`, `iat`, `nbf`; prominent unverified signature banner; sanitized plain-text rendering (no XSS).
- **P1 Requirements:** Relative expiration status (e.g. "Expired 12 minutes ago"); handoff expiration timestamp to Unix Timestamp tool.
- **Edge Cases:** Malformed tokens; `alg: none` tokens clearly flagged; non-standard claim formats.

### 6.11 Storage Unit Converter
- **User Job:** Convert file and storage sizes between Bytes, decimal SI units, and binary IEC units.
- **P0 Requirements:** Input amount and unit selector; immediate conversion table across all SI (KB, MB, GB, TB) and IEC (KiB, MiB, GiB, TiB) units; exact rational arithmetic; 9-decimal precision.
- **P1 Requirements:** Humanized shorthand inputs (e.g. `1.5 GB`); data transfer time estimation link.
- **Edge Cases:** Maintaining precision without floating-point drift; avoiding misleading rounded-to-zero results.

### 6.12 Hash & Checksum
- **User Job:** Generate cryptographic hashes of text or files and verify against expected checksums.
- **P0 Requirements:** SHA-256 and SHA-512 algorithms; in-memory text and file hashing (≤32 MiB); expected checksum comparison with case-insensitive matching; copy digest button.
- **P1 Requirements:** Drag-and-drop file dropzone; file metadata preview (name, size); SHA-384 support.
- **Edge Cases:** Distinguishing empty string hash from uninitialized input; handling files right at the 32 MiB boundary.

---

## 7. Cross-Tool Workflows [R]

Connect related utilities through in-memory handoffs without leaking sensitive data into URLs or storage:

| Source Tool | Contextual Action | Target Tool | Data Handoff Rule |
|---|---|---|---|
| **Base64 Decode** | `Open decoded text in JSON Formatter` | JSON Formatter | In-memory React state; zero URL parameters |
| **YAML ↔ JSON** | `Format output as JSON` | JSON Formatter | Pre-validated JSON passed directly |
| **JSON Formatter** | `Compare with another JSON version` | Text Compare | User selects which diff pane to populate |
| **JWT Decoder** | `Inspect expiration in Timestamp converter` | Unix Timestamp | Numeric timestamp claim only |
| **Storage Converter**| `Calculate transfer / restore duration` | Upload Calculator | Size and unit values only |

---

## 8. Quality, Privacy & Acceptance Standards [R]

### 8.1 Error State Taxonomy

Standardized user feedback across all tools:

| State | User-Facing Display | Visual Treatment | Example |
|---|---|---|---|
| **Empty** | Helpful instructional prompt | Neutral, low contrast | `Paste JSON to format or validate` |
| **Ready** | Primary action enabled | High-contrast button | `Format JSON` |
| **Processing** | Non-blocking inline spinner | Subtle animation | `Comparing text...` |
| **Success** | Clear positive confirmation | Green icon / checkmark | `Valid JSON · 14 lines` |
| **Invalid Input**| Precise error message with location | Red banner, preserves input | `Unexpected token '}' at line 4, col 12` |
| **Unsupported** | Honest limitation disclosure | Amber warning badge | `YAML aliases are not supported` |
| **Exceeded Limit**| Clear boundary explanation | Amber warning badge | `File size exceeds the 32 MiB limit` |
| **Unverified** | Neutral informative badge | Gray/amber badge | `Decoded — digital signature not verified` |

### 8.2 Privacy & Security Baseline

1. **Zero Server Transmission:** Tool engines execute 100% in client browser memory. No network requests are made to process inputs.
2. **Zero Sensitive Storage:** Passwords, private keys, JWTs, and arbitrary text are never stored in `localStorage`, cookies, or browser history.
3. **No URL Payload Leakage:** Sensitive parameters are never placed into URL query parameters or hash fragments.
4. **Sanitized Output:** All outputs are rendered as safe text nodes (`textContent`), never evaluated as raw HTML (`innerHTML`).
5. **Worker Isolation:** Heavy tasks (diffing, regex matching, hashing) execute in sandboxed Web Workers with execution timeouts.

---

## 9. Phased Implementation Roadmap [R]

```text
Phase 1: Ergonomic Foundations
├── Standardize container widths across wide, medium, and compact presets
├── Fix initial editor heights (280–360px) and add resize affordances
└── Move primary actions (Copy, Download) adjacent to output panels

Phase 2: High-Impact Task Refinements
├── Text Compare: collapse inputs after Compare; diff result visible above fold
├── JSON Formatter: line/column error feedback; code vs. tree view tabs
├── YAML ↔ JSON: explicit limit notices and direct output download
└── Storage Converter: instant SI vs. IEC matrix display on input

Phase 3: Deep Feature Upgrades
├── Cron Generator: visual builder tab and timezone selector
├── UUID Generator: UUID v7 time-ordered generation
└── JWT Decoder: relative expiration badges and timestamp handoff

Phase 4: Expansion Queue (Governed by feature.md §5.3)
├── Upload / Restore Time Calculator
├── SQL Formatter
├── JSON ↔ CSV Converter
├── Regex Tester
├── IPv4 / CIDR Calculator
└── chmod Calculator
```

---

## 10. Definition of Done

A tool page satisfies the UX benchmark when:

- [ ] All documented core capabilities execute accurately in browser memory.
- [ ] Primary action and result affordances are visible above the fold on desktop (1280px) and mobile (375px).
- [ ] Outputs provide instant, accessible Copy actions with clear visual feedback.
- [ ] Error messages pinpoint failure causes and preserve user input.
- [ ] Network inspection confirms zero outgoing requests containing user data.
- [ ] UI satisfies WCAG 2.2 AA contrast standards in both light and dark themes.
- [ ] Automated tests pass: `pnpm check`, `pnpm test`, `pnpm test:static`, and `pnpm test:e2e`.
- [ ] Accompanied by bilingual technical documentation guides in English and Vietnamese.
