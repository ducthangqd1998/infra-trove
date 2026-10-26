---
title: "InfraTrove — Website Blueprint & Product Requirements"
version: "0.1"
status: "Working draft — market validation pending"
updated: "2026-10-26"
product_language: "English"
document_language: "English"
brand: "InfraTrove"
domain_candidate: "infratrove.com"
primary_business_model: "Free online tools + evergreen content + SEO + display advertising"
---

# InfraTrove — Website Blueprint & Product Requirements (v0.1)

> **Purpose:** Foundational blueprint covering product direction, design, content, SEO, and execution for InfraTrove. This is a **product specification document**, not a mandate to immediately build every conceivable feature, not a completed keyword research dataset, and not a guaranteed traffic or revenue projection.
>
> **Confirmed Scope:** Free browser-based online tools; companion blog supporting organic search; primary monetization via non-intrusive display ads; priority on fast, useful, client-side, low-maintenance utilities; English-first global market; built and operated by a solo founder.
>
> **Out of Scope:** Cloud cost estimation SaaS, infrastructure monitoring SaaS, recurring subscriptions, team management dashboards, or B2B enterprise offerings unless explicitly decided otherwise.

## 0. Executive Summary

**InfraTrove** is a website providing **free, private online tools** that help software developers, DevOps/SRE engineers, IT professionals, and data practitioners solve everyday repetitive tasks: password generation, text and configuration diffing, JSON formatting and validation, cron schedule parsing, Unix timestamp conversion, data encoding/decoding, storage unit conversion, checksum calculation, and more.

Business strategy:

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

**Proposed Brand Positioning:**

- Brand: **InfraTrove**
- Descriptive tagline: **Free Online Tools for Everyday Work**
- Alternative: **Fast, Private Tools for Developers and Beyond**
- Brand promise: **Open a tool, finish a task, leave with the result.**

The website must be instantly valuable even if a user never reads the blog, never logs in, and never interacts with advertisements. Search intent is the primary acquisition engine; utility, speed, and privacy drive repeat visits.

## 1. Decision Log — Confirmed Items, Hypotheses, Unknowns

| Category | Status | Notes |
|---|---|---|
| Brand name **InfraTrove** | **Confirmed** | Used consistently across website, documentation, and metadata |
| Domain `infratrove.com` | **Candidate checked by founder** | **Subject to ownership verification**, final purchase, and trademark clearance |
| English-speaking global market | **Confirmed direction** | Not restricted to the US; prioritizes universal English technical content |
| Free, no-login online tools | **Confirmed direction** | Zero utility paywalls or forced authentication |
| SEO + display advertising | **Confirmed direction** | Realized RPM and actual traffic volumes remain unverified |
| Blog paired with tools | **Confirmed direction** | Practical guides, examples, troubleshooting, evergreen technical topics |
| Cheat Sheets / Examples | **Proposed expansion** | Published only when offering distinct search intent and SEO evidence |
| Catalog & expansion sequence | **Updated 2026-10-26** | 12 tools implemented, including Batch 1 expansion in §5.2; next queue in §5.3; SEO demand pending measurement |
| Design tokens, logo, framework | **Proposed** | Validated via interactive prototypes; defined in `DESIGN.md` |
| 100,000 monthly pageviews target | **Business aspiration** | Milestone target without guarantee; not a blocking prerequisite for launch |
| 24–36 month horizon to 100k PV/mo | **Low-confidence planning scenario** | Hypothetical modeling scenario, not an empirical forecast |

**Research Gaps:** Real search volume, keyword difficulty (KD), CPC, SERP composition by geography, actual repeat retention, realized Page RPM, Google indexing rates, and ad network eligibility are **currently unmeasured**. Theoretical assumptions must never be presented as empirical market data.

## 2. Goals, Non-goals, and Product Principles

### 2.1 Goals

1. Solve a discrete, well-defined user task within seconds with minimum friction.
2. Attract organic search visits to tools and technical guides through genuine utility.
3. Drive repeat usage via browser favorites, consistent UX, and reliable everyday tools.
4. Scale the catalog with uniform quality and minimal maintenance overhead.
5. Monetize through display ads **without disrupting the primary utility workflow**.
6. Guarantee client-side privacy: user-pasted or uploaded data stays strictly in the browser tab.
7. Expand into adjacent developer topic clusters without mutating into a bloated SaaS.

### 2.2 Non-goals in initial phases

- No user accounts, passwords, subscriptions, billing, multi-tenancy, or team permissions.
- No cloud cost estimators, live infrastructure monitoring, alerting systems, or hosted APIs.
- No pay-per-call AI generation features requiring recurring inference fees.
- No arbitrary target of 100 thin tools built solely to generate indexed URLs.
- No programmatic doorway pages spun from near-identical keyword permutations.
- No server-side file processing or persistence of user data without a verified operational need.
- No high-risk medical or financial calculators requiring separate domain licensing.

### 2.3 Product principles

- **Task first:** Interactive workspace is immediately above the fold, never hidden beneath essays.
- **Fast by default:** Minimal JavaScript payloads, optimized Core Web Vitals, zero unnecessary re-renders.
- **No signup:** Zero registration walls, email prompts, or trial limits.
- **Private by design:** Client-side execution in local browser memory.
- **Correctness over catalog size:** Automated edge-case tests and unambiguous error handling are non-negotiable.
- **Accessible & keyboard-friendly:** Accessible on desktop and mobile, full keyboard navigation, WCAG compliance.
- **Search-useful, not search-spam:** Every indexed URL provides distinct value and fulfills a specific intent.
- **Ads never block utility:** No ads positioned between inputs, outputs, or copy triggers.

## 3. Audience & Jobs-To-Be-Done

### 3.1 Primary personas

| Persona | Repetitive Tasks | Matching Tools |
|---|---|---|
| Software Developers | Debug APIs, encode/decode strings, UUIDs, inspect JWTs | JSON Formatter, Base64, UUID, JWT Decoder, Regex Tester |
| DevOps / SRE / Sysadmins | Schedule cron jobs, parse epoch timestamps, compare configs, subnetting | Cron Parser, Timestamp Converter, Text Compare, CIDR Calculator |
| QA / Test Engineers | Compare responses, generate mock identifiers, inspect data formats | Text Compare, UUID Generator, Storage Converter |
| Data Analysts / Operations | Clean text, convert structures, normalize data | YAML ↔ JSON, JSON ↔ CSV, Remove Duplicates |
| Web Developers / Site Owners | Encode URLs, calculate checksums, preview assets | URL Encoder, Hash & Checksum, Base64 |

### 3.2 Secondary personas

Students, technical writers, IT support, and digital marketers who occasionally need password generation, word counting, timestamp conversions, or checksum verification. Expansion into secondary personas occurs only when supported by keyword evidence and brand alignment.

### 3.3 Core user journeys

1. **Search → Tool:** Query `cron expression generator` → landing page → enter/select schedule → copy expression → task complete.
2. **Blog → Tool:** Query `why is my json invalid` → read guide explaining trailing commas → open JSON validator with sample input → resolve syntax error.
3. **Bookmark → Repeat:** User favorites Text Compare or bookmarks URL → returns directly via browser → executes comparison without signing in.
4. **Adjacent Workflow:** JSON Formatter → YAML ↔ JSON → Text Compare via contextual internal links without forced redirects.

## 4. Information Architecture / Sitemap

```text
/
├── /tools/                              # Central tool directory
│   ├── /tools/text-compare/
│   ├── /tools/json-formatter/
│   ├── /tools/cron-generator/
│   ├── /tools/unix-timestamp-converter/
│   ├── /tools/password-generator/
│   ├── /tools/base64-encoder-decoder/
│   ├── /tools/url-encoder-decoder/
│   ├── /tools/uuid-generator/
│   ├── /tools/yaml-json-converter/
│   ├── /tools/jwt-decoder/
│   ├── /tools/storage-unit-converter/
│   ├── /tools/hash-checksum/
│   └── ... additional validated additions
├── /blog/                               # Technical guides & tutorials
│   └── /blog/{slug}/
├── /vi/blog/                            # Vietnamese localized guides
│   └── /vi/blog/{slug}/
├── /about/
├── /contact/
├── /privacy/
├── /terms/
├── /404.html
├── /robots.txt
└── /sitemap.xml
```

**Routing Conventions:** Strict lowercase kebab-case; one canonical URL per tool; consistent trailing-slash enforcement; search query URLs must not be indexed; zero empty category placeholder pages.

### 4.1 Top navigation

- Logo: **InfraTrove** (links to homepage)
- **Tools** (directory and category navigation)
- **Blog** (guides and tutorials)
- Global Search / Command palette (`Cmd/Ctrl + K`)
- **Favorites** (locally saved in browser storage, no account)
- Theme toggle (Light / Dark)

### 4.2 Taxonomy — candidate categories

- **Text & data**
- **Encode & decode**
- **Generators**
- **Time & scheduling**
- **Web & frontend**
- **Networking & system**

Categories serve to organize content logically; they are not quotas requiring artificial population.

## 5. Feature Portfolio & Priority

**Updated 2026-10-26:** Clearly delineates between implemented tools and future backlog items. Prioritization is guided by qualitative benchmarks against DevToys, IT-Tools, and Genie9, suited for a solo founder building browser-based utilities.

### 5.1 Current catalog — 12 implemented tools

Mirrors `src/data/tools.ts` and live routes. Implementation does not imply full public launch or completed SEO verification.

| # | Tool | Route | Implemented Scope |
|---|---|---|---|
| 1 | Text Compare / Diff | `/tools/text-compare/` | Line/word diff; side-by-side & unified; ignore whitespace/case |
| 2 | JSON Formatter & Validator | `/tools/json-formatter/` | Beautify, minify, syntax validation in a unified editor |
| 3 | Cron Expression Generator | `/tools/cron-generator/` | Unix 5-field syntax, schedule explanation, preview 5 next runs |
| 4 | Unix Timestamp Converter | `/tools/unix-timestamp-converter/` | Seconds/milliseconds ↔ human date; UTC/local/ISO 8601 |
| 5 | Password Generator | `/tools/password-generator/` | Cryptographically secure random passwords with entropy gauge |
| 6 | Base64 Encoder / Decoder | `/tools/base64-encoder-decoder/` | UTF-8 text; standard Base64 and URL-safe Base64 |
| 7 | URL Encoder / Decoder | `/tools/url-encoder-decoder/` | Percent-encoding and decoding of URL components |
| 8 | UUID Generator | `/tools/uuid-generator/` | Cryptographically secure UUID v4; batch generation of 1–100 |
| 9 | YAML ↔ JSON Converter | `/tools/yaml-json-converter/` | Bidirectional conversion, copy/download; YAML 1.2 core |
| 10 | JWT Decoder | `/tools/jwt-decoder/` | Header/payload inspection, UTC time claims; unverified disclaimer |
| 11 | Storage Unit Converter | `/tools/storage-unit-converter/` | SI (1000) and IEC (1024) conversions, exact rational precision |
| 12 | Hash & Checksum | `/tools/hash-checksum/` | Local SHA-256/SHA-512 text/file hashing, expected hash compare |

### 5.2 Completed batch — 4 expansion tools (2026-10-26)

**Status: Implemented and Live.** Catalog expanded from 8 to 12 tools, accompanied by 4 bilingual technical guides in English and Vietnamese. YAML enforces a 100,000 character limit without unsafe tags; Hash supports files up to 32 MiB entirely in memory.

| Priority | Tool | Slug | Initial Scope | Strategic Rationale |
|---|---|---|---|---|
| 1 | YAML ↔ JSON Converter | `yaml-json-converter` | Bidirectional, error reporting, copy/download | Essential for Kubernetes, CI/CD, and config debugging |
| 2 | JWT Decoder | `jwt-decoder` | Header/payload, `exp`/`iat`/`nbf` UTC claims, signature caveat | Highly targeted developer debugging task; zero network token leaks |
| 3 | Storage Unit Converter | `storage-unit-converter` | Bytes, SI, IEC units simultaneously | High utility for disk quotas, backups, and cloud storage calculation |
| 4 | Hash & Checksum | `hash-checksum` | SHA-256/SHA-512 text/file hashing, comparison | Verifies release artifacts, downloads, and checksums locally |

### 5.3 Next queue — upcoming additions

**Status: Next priority queue, not yet implemented.** Evaluated incrementally based on search data and user feedback.

| Sequence | Tool | Initial Scope / Rationale |
|---|---|---|
| 1 | Upload / Restore Time Calculator | Size + bandwidth + efficiency → estimated transfer duration; shares storage conversion math |
| 2 | SQL Formatter | Dialect-aware query formatting without executing SQL against a database |
| 3 | JSON ↔ CSV Converter | Bidirectional conversion, header/delimiter controls, tabular preview |
| 4 | Regex Tester | JavaScript regex flavor, matches, capture groups, timed Web Worker execution |
| 5 | IPv4 / CIDR Calculator | Subnet network, mask, address range, broadcast, and IP membership |
| 6 | chmod Calculator | Unix permissions checkboxes ↔ octal ↔ symbolic notation |

### 5.4 Later shortlist — screened, unscheduled

| Tool | Architectural Direction |
|---|---|
| Text Utilities | Unified tool for case conversion, sort/dedup lines, character/word counting |
| HTML Escape / Unescape | Encode/decode HTML entities; output strictly plain text |
| QR Code Generator | Static QR generation for URLs, text, Wi-Fi credentials; SVG/PNG export |
| JSON Diff | Structured object differences distinct from raw text diffing |
| Backup Storage Calculator | Source size, daily change rate, and retention modeling |

### 5.5 Other ideas backlog

- **Data:** XML Formatter, XML ↔ JSON, CSV Deduplicator, JSONPath, JSON Schema.
- **Text:** Join/Split Lines, Slug Generator, Markdown Table Builder, Unicode Inspector.
- **Encoding / Generators:** Number Base Converter, ULID Generator, HMAC Calculator, Nano ID.
- **Time:** Date Difference, Timezone Converter, Business Days Calculator.
- **Web / Networking:** Query String Parser, Color Contrast Checker, Subnet Overlap Checker.

Heavy PDF/video media processing, complex cloud playgrounds, and server-side network probes are excluded from this client-side utility architecture.

### 5.6 Scope rules and selection criteria

- Multi-mode tasks belong in a single unified tool: encode/decode, format/minify, YAML ↔ JSON, and multiple hash digests do not become separate URLs.
- Input and output data remain strictly in local browser memory; zero telemetry or uploads.
- Only publish functional tools with passing unit and E2E tests.
- Every new tool requires bilingual documentation guides in English and Vietnamese.
- Competitor "Popular" labels or GitHub star counts do not substitute for empirical search demand.

**Qualitative Research Sources (October 2026):**

| Source | Role in Decision Making | Limitations |
|---|---|---|
| [DevToys](https://github.com/DevToys-app/DevToys) & [IT-Tools](https://github.com/CorentinTh/it-tools) | Benchmarked developer utility coverage and categories | Catalog presence does not guarantee specific keyword volume |
| [Genie9 Workspace](https://genie9.com/workspace) | Informed promotion of Storage Converter and local file checksum workflows | Catalog descriptions inspected; full network behaviors unverified |
| [NIST Binary Prefixes](https://pml.nist.gov/cuu/Units/binary.html) | Strict architectural distinction between GB (1000) and GiB (1024) | Requires precise deterministic test vectors for every unit |

## 6. Functional Specifications

Every tool page must operate **without requiring authentication** and provide non-sensitive sample data for immediate testing. Input and output data are never logged or transmitted externally.

### T01 — Text Compare / Diff

**User Job:** Compare two text blocks, configurations, or logs to identify additions, deletions, and modifications.

- Two input editors: **Original** and **Changed**; clear, paste, swap buttons.
- Diff views: **Side-by-side** (desktop default) and **Unified** (mobile optimized).
- Line-level diffing combined with inline word-level `mark` highlighting.
- Toggles: Ignore whitespace, ignore letter case.
- Summary metrics: Count of added, removed, and modified lines; copy or download diff text.
- 100% local in-memory processing.
- **Acceptance Criteria:** Identical text yields zero diffs; CRLF vs. LF line endings normalized; Unicode handled without corruption; whitespace toggles adjust diff output deterministically.

### T02 — JSON Formatter & Validator

**User Job:** Paste raw or unformatted JSON to inspect syntax errors, beautify, or minify.

- Side-by-side input and formatted output code views; Format, Minify, Copy, Clear actions.
- Precise syntax validation status indicating error line, column, and descriptive message.
- Indentation controls: 2 spaces and 4 spaces.
- Validates structure without executing payload or mutating key order.
- In-browser memory bounds; handles large inputs gracefully.
- **Acceptance Criteria:** Validates primitives, objects, and arrays; identifies trailing commas and unquoted keys; preserves escaped Unicode; handles duplicate keys by retaining last-value semantics.

### T03 — Cron Expression Generator / Parser

**User Job:** Construct, validate, and understand Unix cron expressions.

- Standard **Unix 5-field cron** (minute, hour, day of month, month, day of week).
- Natural language human-readable explanation of the schedule.
- Calculates and displays the **next 5 execution times** in UTC and local browser time.
- Quick preset buttons: every 5 minutes, hourly, daily at midnight, weekdays.
- Timezone selector accounting for Daylight Saving Time (DST) shifts.
- **Acceptance Criteria:** Rejects invalid ranges and zero step values; accurately projects schedule boundaries; parses standard expressions (`*/5 * * * *`, `0 0 * * *`).

### T04 — Unix Timestamp Converter

**User Job:** Convert Unix epoch timestamps to human dates and vice versa.

- Accepts timestamps in both **seconds** and **milliseconds**.
- Outputs UTC, local time, and ISO 8601 strings with individual copy buttons.
- Reverse conversion: Date/time input generates seconds and milliseconds timestamps.
- Live "Now" button loading current time.
- Rejects values exceeding supported 64-bit integer date boundaries.
- **Acceptance Criteria:** Epoch zero resolves to `1970-01-01T00:00:00.000Z`; negative timestamps supported; distinguishes seconds from milliseconds without ambiguous auto-guessing.

### T05 — Password Generator

**User Job:** Generate cryptographically secure passwords and random tokens.

- Uses `crypto.getRandomValues()` exclusively; strictly avoids `Math.random()`.
- Rejection sampling prevents modulo bias when selecting characters.
- Length slider (8–128 characters) and character set toggles (Uppercase, Lowercase, Numbers, Symbols).
- Option to exclude ambiguous characters (`l`, `1`, `I`, `0`, `O`).
- Real-time password entropy calculation (bits).
- Passwords are never written to storage, URLs, or browser history.
- **Acceptance Criteria:** Conforms strictly to selected character sets and exact lengths; enforces cryptographic entropy.

### T06 — Base64 Encoder / Decoder

**User Job:** Encode and decode UTF-8 text for API testing and data payloads.

- Dedicated Encode and Decode modes with swap direction action.
- Full UTF-8 Unicode and emoji support via standard Web APIs (`TextEncoder`/`TextDecoder`).
- Explicit support for standard Base64 and URL-safe Base64 (`-` and `_` substitutions, omitted padding).
- Clear error notification on malformed alphabet or invalid padding.
- Clarifies that Base64 is an encoding scheme, not encryption.
- **Acceptance Criteria:** Round-trips multibyte Unicode and emojis without corruption; identifies invalid Base64 input strings.

### T07 — URL Encoder / Decoder

**User Job:** Escape or unescape URL components safely.

- Defaults to `encodeURIComponent` / `decodeURIComponent`.
- Clarifies differences between component encoding and full URI encoding (`%20` vs. `+`).
- Validates percent-encoding syntax and reports malformed sequences.
- **Acceptance Criteria:** Handles reserved characters, spaces, and Unicode query strings accurately.

### T08 — UUID Generator

**User Job:** Generate random UUIDs for mock data, testing, and development.

- Generates RFC-compliant **UUID v4** using `crypto.randomUUID()`.
- Supports single generation and batch generation from 1 to 100 identifiers.
- Individual copy buttons per UUID alongside a Copy All action.
- Monospace output display with uppercase/lowercase formatting options.
- **Acceptance Criteria:** Conforms to RFC 9562 UUID v4 bit specifications; handles batch generation cleanly.

### 6.1 Expansion tool specifications

| Tool | Must-Have Capabilities | Technical Boundaries & Correctness |
|---|---|---|
| YAML ↔ JSON Converter | Bidirectional conversion, line-specific errors, copy/download | Max 100k chars input; reject aliases and custom tags; does not preserve comments |
| JWT Decoder | Local header/payload decode, UTC date claims, copy | Does not verify signatures; does not fetch JWKS; rejects malformed token structures |
| Storage Unit Converter | Simultaneous conversion across Bytes, SI, and IEC units | SI uses base 1000; IEC uses base 1024; exact rational arithmetic; rounds half-up to 9 decimals |
| Hash & Checksum | SHA-256 and SHA-512 text/file hashing, expected hash compare | File limit 32 MiB; in-memory hashing; case-insensitive comparison; not password hashing |
| Upload / Restore Time | Size, bandwidth, assumed efficiency → time estimate | Explicit distinction between bits/sec and Bytes/sec; bandwidth > 0; efficiency 1–100% |
| SQL Formatter | Dialect selection, formatting, syntax preservation | Formats without executing SQL queries or contacting external database engines |
| JSON ↔ CSV Converter | Bidirectional tabular conversion, delimiter/header options | Handles quoted commas and newlines; mitigates spreadsheet formula injection |
| Regex Tester | Matches, capture groups, replacement preview | JavaScript flavor; executed inside a sandboxed Web Worker with execution timeout |
| IPv4 / CIDR Calculator | Network address, subnet mask, usable range, IP membership | Handles `/0`, `/31`, `/32` boundaries; validates IPv4 octets |
| chmod Calculator | Permission checkboxes ↔ octal ↔ symbolic | Scope limited to standard Unix mode bits `000`–`777`; does not run host commands |

### 6.2 Shared Tool Shell specifications

| Feature | Release Phase | Behavior |
|---|---|---|
| Copy Buttons | Launch | Instant clipboard copy with clear visual success/error feedback |
| Reset / Clear | Launch | Resets workspace without page reloads; preserves state against accidental data loss |
| Load Sample | Launch | Injects representative non-sensitive sample data for immediate testing |
| Inline Validation | Launch | Diagnoses errors with exact locations while preserving user input |
| Related Tools | Launch | Curated list of 3–5 contextually relevant tools |
| Favorites | Launch | Persists selected tool slugs in local browser storage; zero user data stored |
| Keyboard Support | Launch | Standard tab order, accessible focus rings, non-conflicting shortcuts |
| Global Search | Launch | Searches tool titles, keywords, and categories (`Cmd/Ctrl + K`) |
| Theme Toggle | Launch | Seamless switching between Light and Dark modes |

## 7. Product UX & Visual Design

### 7.1 Design direction

**Aesthetic Direction:** *Warm paper canvas, hairline white borders, ink-black primary buttons, and amber/orange accents.* The visual system prioritizes clarity, calm utility, and high readability over flashy marketing gimmicks.

- **Desktop:** Workspace is centered, taking full width where beneficial (`editors` dual layout vs. `panel` compact layout).
- **Mobile:** Single-column stacked layouts, touch targets >= 44px, code blocks scroll horizontally without breaking viewports.
- **Typography:** System UI sans-serif for UI copy; monospace for code, hashes, and configuration editors.

### 7.2 Core design tokens (mirrored in `DESIGN.md`)

- `--background`: Warm paper canvas (`#FBF9F5` light, `#121110` dark).
- `--surface`: Hairline card surface (`#FFFFFF` light, `#1C1A18` dark).
- `--primary`: Ink-black primary buttons in light mode; vibrant orange in dark mode.
- `--accent-color`: Amber/orange accent (`#E8590C`).
- `--border`: Crisp borders (`#E5E0D8` light, `#2E2A25` dark).

### 7.3 Homepage structure

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
│       Popular: JSON Formatter · Text Compare · Cron · Password   │
│                                                                  │
│  Browse by Category                                              │
│  [Text & data] [Encode & decode] [Generators] [Time]             │
│                                                                  │
│  All Developer Utilities                                         │
│  [ Tool Cards Grid with Favorites & Badges ]                     │
│                                                                  │
│  Latest Practical Guides                                         │
│  [ Bilingual Technical Guides Grid ]                             │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ About · Contact · Privacy · Terms                                │
└──────────────────────────────────────────────────────────────────┘
```

### 7.4 Tool Detail Page structure

```text
┌──────────────────────────────────────────────────────────────────┐
│ Home > Tools > Text & data > JSON Formatter                      │
│                                                                  │
│ JSON Formatter & Validator                        [☆ Favorite]  │
│ Beautify, minify and validate JSON directly in your browser.     │
│                                                                  │
│ ┌────────────── INPUT ─────────┐ ┌────── OUTPUT ─────────────┐    │
│ │ { pasted text }             │ │ { formatted text }        │    │
│ │                             │ │                           │    │
│ └─────────────────────────────┘ └───────────────────────────┘    │
│ [Load sample] [Clear]                 [Format] [Minify] [Copy]   │
│ Status: Valid JSON / Error message with line hint                │
│                                                                  │
│ How to use this tool                                             │
│ Example / Common errors / Privacy notice                         │
│                                                                  │
│ Related guides · Related tools                                   │
└──────────────────────────────────────────────────────────────────┘
```

The interactive workspace is placed immediately above the fold. Technical documentation, common errors, and related resources sit beneath the tool.

## 8. SEO & Content System

### 8.1 Core SEO strategy

- **Tool Pages:** Answer high-intent action queries (`format json`, `compare text`, `generate uuid`).
- **Guide Articles:** Address informational and troubleshooting intent (`how to fix trailing commas in json`, `gb vs gib storage`).
- **Static First:** Pre-rendered semantic HTML guarantees search crawlers index full content without JavaScript execution.
- Avoid duplicate doorway pages by consolidating task variants into single comprehensive URLs.

### 8.2 Suggested topic clusters

| Tool Cluster | Companion Guide Topics |
|---|---|
| JSON Formatter | Trailing Commas in JSON; Validating JSON Locally; JSON vs. YAML |
| Base64 | Base64 vs. Base64URL; Handling Multibyte UTF-8 in Base64 |
| Cron Generator | Understanding Unix Cron Schedules; Timezone and DST Pitfalls |
| Storage Converter | GB vs. GiB: SI Decimal vs. IEC Binary Storage Units Explained |
| Hash & Checksum | How to Verify File Integrity Using SHA-256 Checksums |
| JWT Decoder | Inspecting JWT Claims Safely Without Signature Verification |

### 8.3 Technical SEO requirements

- Semantic HTML5 structure with logical heading hierarchies (`h1` -> `h2` -> `h3`).
- Clean URLs with consistent trailing slashes and self-referential canonical tags.
- Open Graph and Twitter Card tags.
- Pre-rendered, crawlable HTML for all 35+ routes.
- Fully validated `robots.txt` and XML sitemaps.
- Production builds return genuine HTTP 404 status codes on nonexistent routes.

## 9. Monetization Strategy

### 9.1 Display advertising baseline

- Monetization through non-intrusive contextual display ads introduced only after meeting traffic and eligibility thresholds.
- Tool input and output workspaces are strictly excluded from third-party advertising scripts.
- Third-party advertising scripts must never co-exist inside the execution context of sensitive tools (Password Generator, JWT Decoder).
- Strict Cumulative Layout Shift (CLS) controls with reserved slot dimensions.

### 9.2 Financial modeling principles

```text
Gross monthly ad revenue = (Monthly pageviews / 1,000) × Realized Page RPM
Operating profit = Gross revenue − Hosting and domain expenses
Economic profit = Operating profit − Imputed founder time investment
```

Revenue projections are hypothetical planning models, not guaranteed earnings.

## 10. Technical Architecture

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
 Browser-side JS              Markdown/MDX content
      │
 Local parsing / math / transforms
      │
 Clipboard / optional local preferences
```

- **Static-first architecture** with client-side React islands.
- **Zero backend compute** for utility execution.
- Globally distributed static assets hosted on Cloudflare Workers Static Assets.
- Pinned dependency versions in `pnpm-lock.yaml` built with Node.js 24 LTS.

## 11. Privacy, Security & Trust

### 11.1 Data handling contract

| Data Category | Handling Contract |
|---|---|
| User text, code, configs | Processed entirely in browser memory; never uploaded |
| Generated passwords & keys | Held ephemerally in client state; never persisted to storage |
| Decoded JWTs | Inspected locally; never transmitted to remote servers |
| Favorites | Stored in `localStorage` strictly as tool slug strings |
| Analytics | Limited to privacy-safe event metadata; zero user payloads |

### 11.2 Security controls

- Enforce HTTPS and strict Content Security Policies (CSP).
- Escape all dynamic text outputs to prevent XSS.
- Web Worker sandboxing with timeouts for intensive computations.
- Regular automated dependency audits.

## 12. Analytics & Measurement

- **Google Search Console:** Primary source of truth for organic impressions, clicks, queries, and index coverage.
- **Privacy-Safe Analytics:** Aggregate pageviews and tool action events without payload collection.
- **Key Metrics:** Discovery (impressions, indexed pages), Utility (copy actions, completion rates), Retention (return visits, favorites).

## 13. Market Validation & Roadmap

```text
Phase 0: Research & Scope Lock (Completed)
Phase 1: Minimum Useful Site — 8 Core Utilities (Completed)
Phase 2: Catalog Expansion — Batch 1 (4 Tools + Bilingual Guides) (Completed)
Phase 3: Next Queue Expansion — Upload Time, SQL, CSV, Regex, CIDR, chmod (Pending)
Phase 4: Monetization & Ad Readiness (Subject to eligibility)
```

## 14. Definition of Done

A tool or page is considered production-ready when:

- [ ] Core task executes accurately with passing unit tests for edge cases and malformed inputs.
- [ ] Processing executes entirely on the client side with zero network requests.
- [ ] Zero leakage of user inputs to URLs, local storage, or telemetry.
- [ ] Responsive layouts verified at 375px and 1280px with WCAG 2.2 AA contrast compliance.
- [ ] Pre-rendered HTML contains complete title, H1, meta description, and canonical tags.
- [ ] Automated CI quality gates pass: formatting, typechecking, unit tests, static checks, Playwright E2E.
- [ ] Accompanied by bilingual documentation guides in English and Vietnamese.

---

## Appendix — Copy Examples (English)

**Homepage Hero:**
> **Tools that get the job done.**  
> Format data, compare text, generate secure passwords and convert units — free, fast, and private.

**Privacy Microcopy:**
> This tool processes your data locally in your browser. Nothing you enter is uploaded or saved to our servers.
