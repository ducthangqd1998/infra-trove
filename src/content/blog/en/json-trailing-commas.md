---
title: 'Why your JSON is invalid (and how to fix it)'
description: 'Trailing commas, quoted keys and escaped characters: a practical checklist for the JSON errors you see most often.'
category: 'Text & data'
readingTime: '3 min read'
updated: '2026-10-24'
tool: 'json-formatter'
---

JSON is a data format with a smaller syntax than JavaScript. A value can look like a JavaScript object and still fail `JSON.parse`. Start with the first reported error: one missing quote can make everything after it look broken.

<div class="editorial-compare" aria-label="Comparison between invalid JS syntax and valid JSON">
  <div class="compare-col compare-before">
    <div class="compare-header">
      <span class="compare-label">Invalid syntax</span>
      <strong>JavaScript Object</strong>
    </div>
    <div class="compare-pills">
      <div class="compare-pill">
        <span class="pill-badge">Trailing comma</span>
        <span><code>{"a": 1, }</code></span>
      </div>
      <div class="compare-pill">
        <span class="pill-badge">Keys & strings</span>
        <span><code>{ key: 'text' }</code></span>
      </div>
      <div class="compare-pill">
        <span class="pill-badge">Comments</span>
        <span><code>// comment</code></span>
      </div>
    </div>
    <p class="compare-desc">Convenient shorthand in JS/TS, but will crash <code>JSON.parse</code> instantly.</p>
  </div>

  <div class="compare-arrow" aria-hidden="true">
    <span>fix to</span>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
  </div>

  <div class="compare-col compare-after">
    <div class="compare-header">
      <span class="compare-label">RFC 8259 Standard</span>
      <strong>Valid JSON</strong>
    </div>
    <div class="compare-pills">
      <div class="compare-pill">
        <span class="pill-badge">Trailing comma</span>
        <span><code>{"a": 1}</code></span>
      </div>
      <div class="compare-pill">
        <span class="pill-badge">Keys & strings</span>
        <span><code>{ "key": "text" }</code></span>
      </div>
      <div class="compare-pill">
        <span class="pill-badge">Comments</span>
        <span>Disallowed</span>
      </div>
    </div>
    <p class="compare-desc">Strict data interchange format, guaranteed compatible with every programming language.</p>
  </div>
</div>

## Remove trailing commas

The last item in an object or array must not have a comma after it. This is invalid JSON:

```text
{"name": "InfraTrove", "free": true,}
```

Remove the comma after `true`:

```json
{ "name": "InfraTrove", "free": true }
```

## Use double quotes

Object keys and string values need double quotes. Single quotes and unquoted property names are JavaScript conventions, not JSON syntax. The values `true`, `false` and `null` are lowercase and unquoted. A string containing the word true is different from the boolean `true`.

## Escape characters inside strings

A literal newline cannot appear inside a JSON string. Use `\n` instead. Escape an embedded double quote with `\"` and a backslash with `\\`.

```json
{ "message": "She said \"hello\".\nNext line.", "path": "C:\\temp" }
```

## Comments are not JSON

Neither `//` comments nor `/* ... */` comments are valid. If a config format allows them, it is using an extension such as JSONC. Do not remove comments from a configuration file without checking which format the consuming program expects.

<blockquote class="editorial-quote">
  “JSON is not merely a subset of JavaScript — it is a strict data interchange standard that tolerates neither a trailing comma nor a single quote.”
</blockquote>

## A valid value does not need to be an object

Arrays, strings, numbers, booleans and `null` can all be complete JSON documents. Whether an API accepts them is a separate question about its schema.

## Formatting can change representation

InfraTrove parses JSON using JavaScript and serializes the result. Duplicate object keys keep the last value. Numbers beyond JavaScript's safe integer range can lose precision. If you need exact handling of large identifiers, encode them as strings in the source system or use a parser designed for lossless numbers.

<div class="takeaways-box">
  <div class="takeaways-header">
    <h3 class="takeaways-title">3 golden rules to remember</h3>
    <span class="takeaways-badge">Summary</span>
  </div>
  <div class="takeaways-grid">
    <div class="takeaway-item">
      <div class="takeaway-head">
        <span class="takeaway-num">01</span>
        <strong class="takeaway-heading">Strict double quotes</strong>
      </div>
      <p>Both object keys and string values must strictly be enclosed in double quotes <code>"..."</code>.</p>
    </div>
    <div class="takeaway-item">
      <div class="takeaway-head">
        <span class="takeaway-num">02</span>
        <strong class="takeaway-heading">Zero trailing commas</strong>
      </div>
      <p>The final item in an object or array must never have a trailing comma after it.</p>
    </div>
    <div class="takeaway-item">
      <div class="takeaway-head">
        <span class="takeaway-num">03</span>
        <strong class="takeaway-heading">Proper escape sequences</strong>
      </div>
      <p>Raw newlines must be converted to <code>\n</code>, and literal quotes escaped with <code>\"</code>.</p>
    </div>
  </div>
</div>

Use the [JSON Formatter](/tools/json-formatter/) to check syntax and make the structure easier to read. It preserves your input when parsing fails.

## Reference

The [JSON standard, RFC 8259](https://www.rfc-editor.org/rfc/rfc8259), defines valid values, strings and number syntax.
