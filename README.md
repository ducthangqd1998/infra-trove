# InfraTrove

Free browser-based utilities and practical guides. Astro 7 static HTML, React islands, TypeScript, Tailwind 4 and Cloudflare Workers Static Assets. No application backend, accounts, analytics or ads.

## Local development

Use Node 24 LTS and pnpm 10.33.0. The lockfile pins tested dependency versions. TypeScript 6 is selected for compatibility with the Astro language server.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://127.0.0.1:4321. Tool inputs stay in tab memory. Only theme and favorite tool slugs are stored locally. Crypto and clipboard features require HTTPS or localhost.

## Checks

```sh
pnpm format:check
pnpm check
pnpm test
pnpm build
pnpm test:static
pnpm exec playwright install chromium
pnpm test:e2e
```

Unit tests cover malformed input, Unicode, random generation constraints, diff normalization, timestamps and cron timezone/DST behavior. Playwright exercises desktop and mobile critical flows, clipboard, favorites, no-JS content, input privacy and 404. Static checks inspect generated HTML, links, metadata and indexing controls.

## Structure

- `src/data/tools.ts`: typed registry, categories, instructions and related tools.
- `src/pages/tools/*.astro`: direct imports of individual React islands.
- `src/tools/<tool>/`: UI and independently importable logic; heavy cron/diff engines stay on their own routes.
- `src/components/tools/`: shared editor, copy and error UI.
- `src/content/blog/`: Markdown articles with validated collection metadata.
- `src/layouts/`: shared static shell, SEO and editorial content.

To add a tool, add tested logic/UI, a direct `.astro` route, registry metadata, unique editorial content and an E2E flow. Only publish working tools. Avoid logging or persisting input/output. The CSP currently allows Astro's inline hydration scripts; do not add remote scripts without reviewing the privacy model and headers.

## Scope decisions

Twelve tools are implemented: JSON, text compare, cron, timestamp, password, Base64, URL encoding, UUID, YAML ↔ JSON, JWT Decoder, Storage Unit Converter and Hash & Checksum. The [tool roadmap](plans/feature.md) is the source of truth for planned additions and their scope, updated on 2026-10-26.

The completed expansion batch adds **YAML ↔ JSON, JWT Decoder, Storage Unit Converter and Hash & Checksum**, with four guides in both English and Vietnamese. YAML accepts one YAML 1.2 core document (100,000 characters), rejects aliases/custom tags and does not preserve comments. JWT decoding does not verify signatures. Hash supports SHA-256/SHA-512 with a 32 MiB file limit. The next queue starts with **Upload / Restore Time Calculator**, then SQL Formatter, JSON ↔ CSV, Regex Tester, IPv4 / CIDR and chmod. Later candidates include Text Utilities, HTML Escape / Unescape, static QR codes, JSON Diff and Backup Storage Calculator.

Priorities reflect product fit and qualitative competitor research; keyword volume, SERP opportunity and traffic have not been validated. Publish only working tools, keep all tool processing in the browser, and group modes of the same task into one tool. Password passphrases, bulk passwords and diff character-level highlighting remain future additions.

## Preview and production

Default builds are **not indexable**, omit canonical URLs and omit the sitemap. The internal `example.invalid` site origin is a build placeholder. Do not publish with it as a production domain.

After verifying domain ownership, configure both variables in the build environment:

```sh
SITE_URL=https://your-owned-domain.example PUBLIC_INDEXABLE=true pnpm build
SITE_URL=https://your-owned-domain.example PUBLIC_INDEXABLE=true pnpm test:static
```

Only set these for production. Preview builds must keep `PUBLIC_INDEXABLE=false`. Astro loads `.env` during build; the config reads process environment, so set production variables in the shell/CI hosting environment rather than relying on an `.env` file for `SITE_URL`.

Cloudflare configuration serves `dist` directly, with no Worker handler or SSR adapter. `404.html` is the custom HTTP 404. `_headers` adds security headers. Verify them on the deployed domain.

For local Cloudflare routing verification: `pnpm exec wrangler dev`. For deployment: `pnpm deploy` after configuring your Cloudflare credentials and owned domain. Choose one deploy mechanism: Cloudflare Workers Builds (build `pnpm build`, deploy `pnpm exec wrangler deploy`) or a dedicated CI deploy job. The included GitHub Actions workflow only checks the code.

Rollback by redeploying a previously verified commit/build through the chosen deployment mechanism. Keep build environment variables consistent with that release. No database migration is required.

## Public launch requirements

Configure a real contact address/channel in the Contact page; review operator identity, Privacy and Terms for the actual deployment; verify domain ownership, DNS/HTTPS, redirects, security headers, canonical URLs and sitemap. No public support address or domain ownership has been assumed. Connect Search Console after deployment. Ads, consent tooling and analytics require a separate implementation and privacy review. The current site intentionally has no third-party scripts.
