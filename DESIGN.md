---
version: alpha
name: InfraTrove Warm
description: Browser-based developer tools and guides. Warm paper canvas, white hairline cards, ink-black actions, one orange accent.
colors:
  primary: '#1c1917'
  on-primary: '#fafaf9'
  primary-dark: '#fb923c'
  on-primary-dark: '#1c1917'
  accent: '#ea580c'
  accent-dark: '#fb923c'
  on-accent: '#1c1917'
  accent-text: '#b8390c'
  accent-text-dark: '#fdba74'
  background: '#faf7f2'
  background-dark: '#14110f'
  surface: '#ffffff'
  surface-dark: '#1c1917'
  code: '#f6f2ec'
  code-dark: '#231f1c'
  soft: '#fff1e6'
  soft-dark: '#3a2314'
  hover: '#f1ece4'
  hover-dark: '#2a2521'
  ink: '#1c1917'
  ink-dark: '#fafaf9'
  muted: '#57534e'
  muted-dark: '#c9c3bd'
  faint: '#6b645d'
  faint-dark: '#a39c95'
  hairline: '#e7e2da'
  hairline-dark: '#302a26'
  line: '#d6d0c7'
  line-dark: '#433b35'
  control-line: '#8a8178'
  control-line-dark: '#7a7068'
  error: '#b42318'
  error-dark: '#f97066'
  added-bg: '#dcfae6'
  added-text: '#05603a'
  added-bg-dark: '#0f3a2a'
  added-text-dark: '#75e0a7'
  removed-bg: '#fee4e2'
  removed-text: '#b42318'
  removed-bg-dark: '#4a1d1d'
  removed-text-dark: '#fda29b'
  heat-1: '#fbbf24'
  heat-2: '#f97316'
  heat-3: '#ef4444'
  band-from: '#9a3412'
  band-to: '#b91c1c'
  on-band: '#ffffff'
typography:
  display-lg:
    fontFamily: Geist Variable
    fontSize: 3.75rem
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist Variable
    fontSize: 3rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Geist Variable
    fontSize: 1.75rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.02em
  title-md:
    fontFamily: Geist Variable
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist Variable
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: Geist Variable
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.7
  body-prose:
    fontFamily: Geist Variable
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.85
  body-prose-vi:
    fontFamily: Be Vietnam Pro
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.85
  label-md:
    fontFamily: Geist Variable
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.4
  caption-md:
    fontFamily: Geist Variable
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.6
  label-group:
    fontFamily: Geist Variable
    fontSize: 0.6875rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.06em
  code-md:
    fontFamily: Geist Mono Variable
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.7
rounded:
  xs: 0.375rem
  tag: 6px
  sm: 0.625rem
  tile: 12px
  lg: 1rem
  pill: 999px
spacing:
  s1: 0.25rem
  s2: 0.5rem
  s3: 0.75rem
  s4: 1rem
  s5: 1.5rem
  s6: 2rem
  s7: 3rem
  s8: 4rem
  control-height: 2.75rem
  header-height: 4rem
  shell-max: 120rem
  rail-w: 22rem
components:
  page:
    backgroundColor: '{colors.background}'
    textColor: '{colors.ink}'
    typography: '{typography.body-md}'
  page-dark:
    backgroundColor: '{colors.background-dark}'
    textColor: '{colors.ink-dark}'
  page-muted:
    backgroundColor: '{colors.background}'
    textColor: '{colors.muted}'
  page-muted-dark:
    backgroundColor: '{colors.background-dark}'
    textColor: '{colors.muted-dark}'
  caption:
    backgroundColor: '{colors.hover}'
    textColor: '{colors.faint}'
    typography: '{typography.caption-md}'
  caption-dark:
    backgroundColor: '{colors.surface-dark}'
    textColor: '{colors.faint-dark}'
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.lg}'
    padding: 1.5rem
  card-dark:
    backgroundColor: '{colors.surface-dark}'
    textColor: '{colors.ink-dark}'
    rounded: '{rounded.lg}'
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.label-md}'
    rounded: '{rounded.sm}'
    height: 2.75rem
    padding: 0 1.5rem
  button-primary-dark:
    backgroundColor: '{colors.primary-dark}'
    textColor: '{colors.on-primary-dark}'
    rounded: '{rounded.sm}'
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.sm}'
    height: 2.75rem
  button-secondary-hover:
    backgroundColor: '{colors.hover}'
    textColor: '{colors.ink}'
  button-secondary-dark:
    backgroundColor: '{colors.surface-dark}'
    textColor: '{colors.ink-dark}'
  button-secondary-hover-dark:
    backgroundColor: '{colors.hover-dark}'
    textColor: '{colors.ink-dark}'
  accent-fill:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.on-accent}'
  accent-fill-dark:
    backgroundColor: '{colors.accent-dark}'
    textColor: '{colors.on-accent}'
  badge:
    backgroundColor: '{colors.soft}'
    textColor: '{colors.accent-text}'
    typography: '{typography.caption-md}'
    rounded: '{rounded.pill}'
  badge-dark:
    backgroundColor: '{colors.soft-dark}'
    textColor: '{colors.accent-text-dark}'
    rounded: '{rounded.pill}'
  tag:
    backgroundColor: '{colors.background}'
    textColor: '{colors.muted}'
    typography: '{typography.caption-md}'
    rounded: '{rounded.tag}'
  tool-symbol:
    backgroundColor: '{colors.code}'
    textColor: '{colors.accent-text}'
    typography: '{typography.code-md}'
    rounded: '{rounded.tile}'
    size: 44px
  tool-symbol-dark:
    backgroundColor: '{colors.code-dark}'
    textColor: '{colors.accent-text-dark}'
  sidebar-group:
    backgroundColor: '{colors.background}'
    textColor: '{colors.faint}'
    typography: '{typography.label-group}'
  sidebar-item-selected:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.sm}'
    height: 40px
  editor:
    backgroundColor: '{colors.code}'
    textColor: '{colors.ink}'
    typography: '{typography.code-md}'
    rounded: '{rounded.sm}'
  editor-dark:
    backgroundColor: '{colors.code-dark}'
    textColor: '{colors.ink-dark}'
  error-message:
    backgroundColor: '{colors.code}'
    textColor: '{colors.error}'
  error-message-dark:
    backgroundColor: '{colors.code-dark}'
    textColor: '{colors.error-dark}'
  diff-added:
    backgroundColor: '{colors.added-bg}'
    textColor: '{colors.added-text}'
  diff-added-dark:
    backgroundColor: '{colors.added-bg-dark}'
    textColor: '{colors.added-text-dark}'
  diff-removed:
    backgroundColor: '{colors.removed-bg}'
    textColor: '{colors.removed-text}'
  diff-removed-dark:
    backgroundColor: '{colors.removed-bg-dark}'
    textColor: '{colors.removed-text-dark}'
  cta-band:
    backgroundColor: '{colors.band-from}'
    textColor: '{colors.on-band}'
    rounded: '{rounded.lg}'
  cta-band-end:
    backgroundColor: '{colors.band-to}'
    textColor: '{colors.on-band}'
  hairline-divider:
    backgroundColor: '{colors.hairline}'
    height: 1px
  hairline-divider-dark:
    backgroundColor: '{colors.hairline-dark}'
    height: 1px
  card-border:
    backgroundColor: '{colors.line}'
    height: 1px
  card-border-dark:
    backgroundColor: '{colors.line-dark}'
    height: 1px
  input-border:
    backgroundColor: '{colors.control-line}'
    height: 1px
  input-border-dark:
    backgroundColor: '{colors.control-line-dark}'
    height: 1px
  focus-ring:
    backgroundColor: '{colors.accent}'
    size: 2px
  pixel-heat-low:
    backgroundColor: '{colors.heat-1}'
    size: 8px
  pixel-heat-mid:
    backgroundColor: '{colors.heat-2}'
    size: 8px
  pixel-heat-high:
    backgroundColor: '{colors.heat-3}'
    size: 8px
---

# InfraTrove design

## Overview

InfraTrove is a free suite of browser-based developer tools plus practical guides in English and
Vietnamese. The look is a warm take on a modern dashboard: warm paper canvas, white cards framed by
hairlines, ink-black primary actions, and one orange accent. Warmth comes from the canvas, the
orange accent and the heat scale (amber, orange, red), never from a second brand hue.

**Source of truth:** the custom properties on `:root` in `src/styles/global.css` (plus the font
families in its `@theme` block). This file mirrors them; change the CSS first, then update this
file in the same change. Every colour in the CSS is a `light-dark(light, dark)` pair; here each
pair is written as `name` / `name-dark`. Token names map to CSS like this: `background` is `--bg`,
`accent` is `--accent-color`, every other name is the same (`surface` is `--surface`).

The theme follows the OS (`color-scheme: light dark`). A saved choice in
`localStorage["infratrove-theme"]` (`light` or `dark`) becomes `data-theme` on `<html>` before
first paint.

## Colors

- **Primary / primary-dark:** the main action. Ink black with off-white text in light mode; orange
  with ink text in dark mode, so the primary never becomes a light patch on a dark page. One
  primary per region.
- **Accent / accent-dark (orange):** focus rings, selected tab underline, selected sidebar bar,
  checked checkbox, chart marks. Orange fills always carry **dark** text (`on-accent`, about
  4.7:1). White on orange fails contrast; never use it.
- **Accent-text / accent-text-dark:** orange for text and icons (links, badge text, tool symbols).
  It is a darker step than the fill so it clears 4.5:1 on surface, background, soft and hover.
- **Background, surface, code, soft, hover:** canvas, cards, code and editor wells, the warm tint
  behind badges and the selected TOC item, and hover fills.
- **Ink, muted, faint:** three text roles. Faint is the lightest allowed text (captions, hints,
  sidebar group labels) and still clears 4.5:1 on background and hover.
- **Hairline, line, control-line:** card edges and dividers; secondary-button and card hover edges;
  input edges and the selected segment ring (3:1, WCAG 1.4.11).
- **Error, added-\*, removed-\*:** status. Always paired with words or signs (`+`/`-`), never colour
  alone.
- **Heat-1/2/3 (amber, orange, red):** reserved for decorative heat scales. Never used as status
  colours; the home directory does not use charts.
- **Band-from / band-to:** the only gradient that carries text (the CTA band), with
  `on-band` white text at 6.5:1 or more.

## Typography

**Geist Variable** is the default for English content and the site UI. Vietnamese blog content
uses **Be Vietnam Pro** through `--font-sans-vi`, scoped to `.blog-content[lang='vi']` on both the
guide index and article pages. This includes translated titles, prose, cards, navigation and
comments. Header, footer and tool pages keep Geist. **Geist Mono Variable** remains the font for
code, tool symbols and the cron field in both languages. Weights 400, 500 and 600 only.

All fonts are self-hosted. Be Vietnam Pro includes normal and true italic faces at all three
weights. Its regular Latin and Vietnamese subsets are preloaded only on `/vi/blog/` routes;
other weights and italics load on demand. English pages never request Be Vietnam Pro font files.

- **display-lg:** reserved for display headings; the home directory uses a compact
  `clamp(2rem, 3vw, 2.5rem)` heading so tools stay near the top.
- **headline-lg:** page `h1`; `clamp(2rem, 4vw, 3rem)`.
- **headline-md:** section `h2`; `clamp(1.375rem, 2.2vw, 1.75rem)`.
- **title-md:** card titles (`h3`).
- **body-lg / body-md / body-prose:** intros, body text, guide articles (looser line height).
- **label-md:** buttons, nav, tabs, form labels.
- **caption-md:** badges, tags, metadata, footers of cards.
- **label-group:** uppercase sidebar group labels. This is the only uppercase text in the product.
- **code-md:** editors, `pre`, inline code (inline code renders at 0.875em).

Text is never smaller than 11px (0.6875rem). Inputs and textareas use 16px on screens up to 767px
so iOS does not zoom.

## Layout

- Container max 1280px, side padding 2rem, 1rem at 767px and below. Tool pages are an app shell and
  use `--shell-max` (120rem, 1920px) instead, header and footer included so every edge lines up;
  guides, the home page and the other pages keep 1280px. The tool work area is the container minus
  the 15rem sidebar and a 1rem gap: 960px at 1280px, 1400px at 1720px.
- Breakpoints: 1200px (tool directory uses an adaptive grid with a 16rem minimum, normally 4
  columns; enlarged text reduces the column count), 1100px (tool grid goes to 2 columns),
  1023px (tool sidebar hides, guide TOC moves above the article), 899px (home intro stacks),
  767px (mobile: header menu drawer, one column, touch targets 44px).
- Spacing scale `s1`…`s8` (4px to 64px). Card padding `s5`; gaps between cards `s4`.
- **Tool pages:** app shell. A 15rem sticky sidebar groups tools by category; a button in the tool
  header collapses it (saved in `localStorage["infratrove-sidebar"]`, applied before first paint).
  The tool column is task-first: a compact header with an SVG symbol tile, category breadcrumb,
  `h1` at 1.375rem and tool description on the left; privacy pill and Save button on the right, all
  aligned without skeuomorphic 3D avatars. Then the workspace card, then guide panels and related
  tools. Nothing above the workspace repeats the tool name.
  Each tool declares a `layout` in `src/data/tools.ts`. `editors` tools (JSON, Text Compare, Base64,
  URL) give the whole row to the workspace; the guide panels and related tools stay below. `panel`
  tools (Password, UUID, Cron, Timestamp) are one compact card: from 1600px the guide panels move
  to a 22rem rail (`--rail-w`) on the right, and the related tools sit under the card on the left,
  so both columns end together and no side of the page stays empty. Below 1600px the panels stay
  below the card, as on every tool under 1024px.
- **Guide header:** title, lead and byline on the left; on the right a framed flat illustration
  (`PostArt.astro`, one scene per guide) drawn only from tokens: `soft` stage with faint accent arcs,
  `ink` outlines, `surface` and `code` fills, heat scale for emphasis. Decorative (`aria-hidden`), no
  text inside, hidden below 768px so reading starts at once. A guide with no scene gets a generic page.
- **Guides:** article column up to 46rem plus a 16rem sticky "On this page" panel that starts level
  with the title and marks the section being read (`aria-current="location"`). Below 1024px the panel
  sits under the title, collapsed. The index is one four-column grid of compact cards (the newest carries a "Latest article" badge). Code blocks carry a language and copy bar,
  wide tables scroll inside a focusable region, and "Keep reading" closes the article.
- **Home:** a utility directory. Compact title and task description on the left, labelled search
  on the right, stacked below 900px. A plain line explains that no account is needed and tool input
  stays in the browser. Category filters, Favorites and tool cards follow immediately; latest
  guides sit below a hairline divider. No promotional hero, dashboard mock, feature grid or CTA
  band. Keep `tool-search` and the legacy `flow-title` anchor on the privacy line.

## Elevation & Depth

Flat. Cards separate by a 1px hairline edge on the warm canvas, not by shadow. Shadows only on
layers that float: select menus and the mobile drawer. No perspective or 3D decoration on the home
directory.

## Shapes

- `lg` (16px): cards, panels, banners, CTA band.
- `tile` (12px): icon tiles.
- `sm` (10px): buttons, inputs, selects, sidebar items.
- `tag` (6px) and `xs` (6px): tags such as the category label on a card, kbd keys.
- `pill`: badges and the eyebrow only.

## Components

- **Buttons:** primary = `button-primary` (ink, orange in dark). Secondary = surface with a `line`
  edge, hover fill `hover`. Min height 44px. Labels may carry a trailing arrow icon.
- **Cards** (tools, guides): header row (icon tile + tag), body (title, one-line summary), footer
  separated by a hairline: metadata left (tags or reading time), small bordered "Open tool" or
  "Read guide" button right. Guide cards are compact: a 16px icon with the category, title, two-line
  summary, then reading time and "Read article" with no tile or footer rule. The whole card is one link (stretched title link).
- **Badge / eyebrow:** `soft` fill, `accent-text`, thin orange edge, pill.
- **Tabs:** text tabs with a 2px orange underline on the selected one.
- **Segmented control** (guide language, tool options): grey track; the selected segment is surface
  with an inset `control-line` ring. Use it for two to four mutually exclusive options instead of a
  select (`Segmented` in `src/components/tools/Shared.tsx`).
- **Sidebar:** background rail; the selected item is a surface card with a 1px `line` ring and a 3px
  orange bar on the left. Group labels use `label-group`.
- **Banner** (tools index and guide index headers): surface card with concentric hairline arcs on the
  right.
- **Workspace** (tool UI): one card. A single dense `tool-bar` row on top (primary action first,
  then options, then Load example and Clear pushed right; 40px controls, 44px on mobile), then the
  work area. Each tool's layout follows its main job, not a shared template:
  - Text tools (Text Compare, JSON, Base64, URL): two tall editors side by side, height
    `clamp(16rem, 100dvh - 28rem, 40rem)`, resizable. Editors show a header (label, line and
    character count, actions such as Copy) and, for code-like text, a line-number gutter with no
    soft wrap. Input is surface, read-only output is `code`. Ctrl or Cmd + Enter runs the action.
  - Live tools (Base64, URL, Cron, Timestamp, JSON validity): results update as you type; errors
    show inline as a status, not an alert. Password stays click-to-generate by design.
  - Diff results: an aligned table with line numbers on both sides, hatched filler for missing
    lines, `mark` for changed words (bold + underline, tint kept above 4.5:1), counts as
    removed/added chips, Side by side / Unified segmented (unified by default on mobile).
  - Lists of values (UUIDs, timestamp results): one row per value with its own icon copy button,
    plus Copy all where a list exists.
  - Cron: the sentence first, a large centred expression, one tile per field that lights up for
    the field under the caret, presets as pill chips, next runs as numbered rows.
  - Password: large output that colours digits (`accent-text`) and symbols (`error`) apart from
    letters, inline regenerate and copy, an entropy meter with a word label.
- **Selects:** use the custom accessible combobox in `src/components/tools/Select.tsx` for longer
  option lists, never a bare native `<select>`. Two to four options use the segmented control.
- **Icons:** inline SVG outline icons, 1.5px stroke, from `src/components/Icon.astro`. Decorative
  icons are `aria-hidden`. Unicode glyphs are not used as icons. Each tool has its own icon in
  `src/components/ToolIcon.astro` (same 24px grid and stroke), shown in a `tool-symbol` tile: 44px
  (48px on cards), `tile` radius, surface-to-`soft` gradient, orange-tinted edge, `accent-text` icon;
  on card hover or focus the tile fills with `accent` and the icon turns `on-accent`.

## Do's and Don'ts

- Do keep warmth in the canvas, the orange accent and the heat scale. Don't add blue, indigo or
  purple.
- Do put dark text on orange fills. Don't put white text on orange.
- Do use gradients only for tool icon tiles and the CTA band. Don't put text on a
  gradient other than the dark band.
- Do frame cards with hairlines. Don't add shadows to static cards.
- Do use uppercase only for sidebar group labels. Don't uppercase headings, eyebrows or buttons.
- Do give every selected, current or pressed state a cue of at least 3:1 (underline, bar, ring), not
  a tint alone.
- Do keep one primary button per region.
- Do put real tools before explanatory content on the home directory. Don't add decorative
  dashboards, charts or invented metrics and users.
- Don't hard-code colours in components; add a token to `:root` and to this file.
