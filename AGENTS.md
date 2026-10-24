# Agent Instructions & Skill Orchestrator — InfraTrove

You are an expert AI software engineer and DevOps orchestrator working in the **InfraTrove** repository.
Treat this document as the **central orchestrator**: route all coding, design, testing, and deployment requests to the installed domain skills in `.agents/skills/` (or `.claude/skills/`).

---

## 1. Project Map & Architecture

**InfraTrove** is a free, privacy-focused suite of browser-based utilities and practical DevOps guides:
- **Core Stack**: Astro 7 (static output) + React 19 islands + TypeScript 6. Tailwind CSS v4 (`@tailwindcss/vite`) is imported for preflight and the font families in `@theme` only.
- **Styling**: hand-written CSS in `src/styles/global.css`, built on the custom-property tokens on `:root` (`light-dark()` pairs). Use those tokens and the existing class names; do not convert components to Tailwind utility classes.
- **Platform**: Cloudflare Workers Static Assets (`wrangler`). Static pages, zero tracking, zero external telemetry. One small Worker (`worker/`) answers only `/api/*`, today just guide comments stored in D1.
- **Testing**: Vitest for unit tests, Playwright for cross-browser & mobile E2E tests, custom static link/HTML checker.
- **Languages**: site UI (header, footer, tools) is English only. Guides are published in English and Vietnamese.

### Key Directory Layout
```text
infra-trove/
├── .agents/skills/          # Installed specialized agent skills (Antigravity, Codex, Cursor)
├── .claude/skills/          # Installed specialized agent skills (Claude Code)
├── DESIGN.md                # Design system: tokens + rules (mirrors src/styles/global.css)
├── src/
│   ├── data/tools.ts        # Typed registry, metadata, categories, related tools
│   ├── content/blog/en/     # English guides (Markdown)
│   ├── content/blog/vi/     # Vietnamese guides; same filename = translation of the en/ file
│   ├── pages/               # Astro static routes: index, tools/*, blog/* (en), vi/blog/* (vi)
│   ├── tools/<tool>/        # Tool React islands, pure TS logic, converters/parsers
│   ├── components/          # Shared UI: Icon.astro (SVG icons), ToolCard, PostCard, Directory, tools/ (Select, Editor, CopyButton)
│   ├── layouts/             # BaseLayout, ToolLayout (sidebar shell), BlogIndexLayout, BlogPostLayout
│   ├── lib/                 # Shared utilities; blog.ts (guide language/slug helpers), i18n.ts (guide UI copy)
│   └── styles/global.css    # Design tokens on :root + all component styles
├── tests/e2e/               # Playwright test specs
├── worker/                  # Worker for /api/* only: index.ts (routes), comments.ts (pure rules + tests)
├── migrations/              # D1 schema migrations (comments)
├── scripts/                 # Project automation (e.g. check-static.mjs)
├── plans/                   # Architectural specifications (feature.md, techstack.md)
└── wrangler.jsonc           # Cloudflare Workers Static Assets configuration
```

---

## 2. Design System — Read Before Any UI Work

`DESIGN.md` is the project's design doc: a warm paper canvas, white hairline cards, ink-black primary buttons (orange in dark mode) and one orange accent. The token values live in `src/styles/global.css`; `DESIGN.md` mirrors them.

- **`DESIGN.md` wins over skill defaults.** `ui-ux` falls back to its own "modern flat" style, and `frontend-design` picks its own design dials, only when a project has no design doc. Here the deliberate exceptions in `DESIGN.md` stand: gradients for the hero glow, guide covers and the CTA band; uppercase sidebar group labels; the amber/orange/red heat scale; orange fills with dark text.
- **A rule that looks wrong** gets reported as a Design gap (rule, screenshot, proposed change); do not quietly restyle against `DESIGN.md`.
- **Changing tokens**: edit `:root` in `global.css` first, update `DESIGN.md` in the same change, then run `npx @google/design.md lint DESIGN.md` (expects 0 errors).
- **Never hard-code colours** in components. Orange fills (`--accent-color`) carry dark text (`--on-accent`); orange text uses `--accent-text`; primary buttons use `--primary` / `--on-primary`.
- **Icons**: inline SVG via `src/components/Icon.astro`; no Unicode glyphs as icons.

---

## 3. Skill Orchestrator — Request Routing

Before executing tasks, find the appropriate skill in `.agents/skills/<name>/SKILL.md` (or `.claude/skills/<name>/SKILL.md`) and adhere to its specialized methodology:

| Category | If the user asks to... | Delegate to Skill | Skill Purpose |
|---|---|---|---|
| **UI & UX** | Build or review tool pages (`/tools/*`), workspace, form controls, sidebar, responsive 375px/1280px, color contrast, review design | `ui-ux` | Reads `DESIGN.md` first; WCAG 2.2 AA contrast, 44px touch targets, no native select popups, probe at 375/1280 light and dark |
| **Landing & Guide Pages** | Redesign the homepage, marketing sections, hero, the guide index or the guide article layout | `frontend-design` | Distinctive web design within `DESIGN.md`, audit-first redesigns, avoidance of generic AI aesthetics |
| **Tailwind CSS** | Change the Tailwind setup or the `@theme` font block | `tailwind-patterns` | Tailwind v4 configuration only; component styling stays in `global.css` tokens and classes |
| **Architecture** | Where code/state belongs (Astro vs React island), split components, API service layers | `frontend-architecture` | UI/logic/data separation, state tiers (URL/local/form), island boundaries |
| **React Performance** | Optimize React page/component, reduce client bundle size, fix waterfalls, re-renders | `nextjs-react-expert` | React 19 performance guidelines, compiler gates, bundle reduction |
| **Design Tokens** | Change tokens, update or validate `DESIGN.md`, DTCG color modes | `design-spec` | YAML token block authoring, WCAG verification, `@google/design.md` lint |
| **Accessibility Audit** | Audit code against Web Interface Guidelines, keyboard nav, screen reader labels | `web-design-guidelines` | Static code review against official Web Interface Guidelines |
| **E2E Testing** | Write or fix Playwright E2E tests, user flows, mock storage/clipboard | `webapp-testing` | Playwright best practices, resilient role-based locators, web-first assertions |
| **Git & Release** | Commit changes, create branches, prepare PR descriptions, resolve conflicts | `git-workflow` | Atomic staging, Conventional Commits, pre-commit secret scanning, safe git rules |
| **Debugging** | Troubleshoot runtime errors, unexpected behavior, test failures | `systematic-debugging` | 4-phase evidence-driven root cause analysis (reproduce, isolate, root-cause, verify) |
| **Security** | Scan for hardcoded tokens/secrets, inspect dependencies for CVEs | `vulnerability-scanner` | Secret leak detection, lockfile hygiene, OWASP Top 10 checks |
| **Release & Deploy** | Plan production deployment to Cloudflare, verify post-deploy, rollback | `deployment-procedures` | Safe release plans, migration safety, platform rollback strategies |
| **Task Planning** | Break a complex tool feature into sequential tasks with acceptance criteria | `plan-writing` | Structured task plans with dependencies and verification steps |
| **Documentation** | Write or update guide articles, tool copy, README, user manuals, code docs | `documentation-templates` | Grounded, high-signal documentation; guides follow the bilingual rule in §5 |
| **Automation** | Shell scripts, node scripts in `scripts/`, command-line automation | `bash-linux` | Robust shell scripting, error trapping, macOS/Linux compatibility |
| **CI/CD** | Configure or fix GitHub Actions workflows in `.github/` | `cicd-ops` | Workflow caching, lint/test gates, OIDC security, build optimization |

---

## 4. Standard Verification Commands

Always run project commands using `pnpm` (Node >= 24 LTS). CI (`.github/workflows/ci.yml`) runs `format:check`, `check`, `test`, `build`, `test:static`, then `test:e2e`.

```bash
# Development server (http://127.0.0.1:4321). It detaches; stop it with:
pnpm dev
pnpm astro dev stop

# Type check Astro & TypeScript
pnpm check

# Unit tests (Vitest)
pnpm test

# End-to-end tests (Playwright). Builds nothing: run `pnpm build` first.
# Outside CI it reuses any server already on :4321, so stop `pnpm dev` to test the build.
pnpm test:e2e

# Static asset, link, and metadata validation (needs dist/ from `pnpm build`)
pnpm test:static

# Code formatting
pnpm format:check
pnpm format

# Production build
pnpm build

# Preview build locally (also detaches; only one instance runs, so stop it when done)
pnpm preview
pnpm astro preview stop

# Site + comments API locally (http://127.0.0.1:8787). First time: cp .dev.vars.example .dev.vars
pnpm db:migrate:local
pnpm dev:api

# Regenerate Worker types after changing wrangler.jsonc
pnpm types:worker

# Deploy to Cloudflare Workers Static Assets
pnpm run deploy
```

### UI probe (`ui-ux` skill)

Probe the production build so the Astro dev toolbar does not add findings. The site switches theme from `localStorage["infratrove-theme"]`, so pass both theme scripts:

```bash
pnpm build && pnpm preview
node .claude/skills/ui-ux/scripts/probe.mjs http://127.0.0.1:4321/tools/json-formatter/ \
  --widths 375,768,1280 --dark \
  --light-script 'localStorage.setItem("infratrove-theme","light")' \
  --dark-script 'localStorage.setItem("infratrove-theme","dark")'
# New or redesigned screens: add --forced-colors --text-zoom 200 --sweep
pnpm astro preview stop
```

Known probe heuristics to verify, not fix blindly: `STATE_CONTRAST` on the current breadcrumb item, and `CHART_TEXT_ALT` on the decorative pixel chart inside the `aria-hidden` hero mock.

---

## 5. Safety & Implementation Guardrails

1. **Client-Side Privacy is Absolute**:
   - InfraTrove tools process data exclusively inside browser memory. Tool pages never call `/api/*` and load no third-party scripts.
   - Never introduce third-party analytics scripts, tracking pixels, or remote logging.
   - The only server code is the guide comments API in `worker/`. Never store raw IP addresses (only the daily HMAC in `ip_hash`); render user text with `textContent`, never as HTML; load Cloudflare Turnstile only after the reader starts writing. Any new endpoint or stored field needs a matching update to `src/pages/privacy.astro`.
2. **Git Safety (`git-workflow`)**:
   - Commit only when the user asks for it.
   - NEVER run blanket staging (`git add .`, `git add -A`, or glob adds). Stage intended files explicitly (`git add path/to/file`).
   - NEVER run destructive commands (`git reset --hard`, `git clean -f`, `git push --force`).
   - Run `pnpm check && pnpm test` before committing.
   - Commit messages must follow **Conventional Commits**: `<type>(<scope>): <subject>`.
3. **No Unstyled Native Controls**:
   - Do not use bare unstyled native `<select>` or OS popups; use the accessible combobox in `src/components/tools/Select.tsx`.
4. **Bilingual Guides**:
   - Every guide exists as `src/content/blog/en/<slug>.md` and `src/content/blog/vi/<slug>.md` with the same `<slug>`, `tool` and `updated` frontmatter; `title`, `description`, `category` and `readingTime` are translated.
   - English routes are `/blog/<slug>/`, Vietnamese routes are `/vi/blog/<slug>/`. Guide UI copy (TOC title, CTA, byline) lives in `src/lib/i18n.ts`; header, footer and tool UI stay English.
   - Adding a guide raises the page count checked by `scripts/check-static.mjs`; keep that threshold in step.
5. **Verified Evidence**:
   - Do not claim a bug is fixed or a feature is done without running the corresponding unit test or Playwright test.

---

## 6. Definition of Done

A task is considered complete when:
- [ ] Code adheres to `DESIGN.md` and the routed skill guidelines (`ui-ux`, `frontend-design`, `frontend-architecture`, `webapp-testing`, etc.).
- [ ] Tests and checks pass: `pnpm format:check`, `pnpm check`, `pnpm test`, and after `pnpm build`: `pnpm test:static` and `pnpm test:e2e` (if UI was altered).
- [ ] UI changes probed and screenshots opened at **375px** (mobile) and **1280px** (desktop) in both **Light** and **Dark** themes.
- [ ] Token changes are mirrored in `DESIGN.md` and `npx @google/design.md lint DESIGN.md` reports 0 errors.
- [ ] If the user asked for a commit: atomic Conventional Commit via `git-workflow` with explicit file staging.
