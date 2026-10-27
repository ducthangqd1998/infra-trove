---
title: 'Base64 vs Base64URL: the small differences that matter'
description: 'Two characters and a padding convention can change whether an encoded value works in a URL.'
category: 'Encode & decode'
readingTime: '3 min read'
updated: '2026-10-24'
tool: 'base64-encoder-decoder'
---

Base64 represents binary bytes as text. Base64URL uses a slightly different alphabet so the encoded value is easier to include in URLs and filenames. Neither format encrypts anything.

## Compare the alphabets

Standard Base64 uses letters, digits, `+` and `/`. Base64URL replaces `+` with `-` and `/` with `_`. Depending on the protocol, trailing `=` padding may be omitted in Base64URL.

<div class="editorial-compare" aria-label="Compare Base64 and Base64URL">
  <div class="compare-col compare-before">
    <div class="compare-header">
      <span class="compare-label">Traditional Standard</span>
      <strong>Standard Base64</strong>
    </div>
    <div class="compare-pills">
      <div class="compare-pill">
        <span class="pill-badge">Chars 62 & 63</span>
        <span><code>+</code> and <code>/</code></span>
      </div>
      <div class="compare-pill">
        <span class="pill-badge">Trailing Padding</span>
        <span>Requires <code>=</code></span>
      </div>
    </div>
    <p class="compare-desc">Risk of collisions and escaping errors inside URL queries or file paths.</p>
  </div>

  <div class="compare-arrow" aria-hidden="true">
    <span>replace</span>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
  </div>

  <div class="compare-col compare-after">
    <div class="compare-header">
      <span class="compare-label">URL-Safe Standard</span>
      <strong>Base64URL</strong>
    </div>
    <div class="compare-pills">
      <div class="compare-pill">
        <span class="pill-badge">Chars 62 & 63</span>
        <span><code>-</code> and <code>_</code></span>
      </div>
      <div class="compare-pill">
        <span class="pill-badge">Trailing Padding</span>
        <span>Unpadded (no <code>=</code>)</span>
      </div>
    </div>
    <p class="compare-desc">Safe for URL parameters, JWT tokens, and HTTP header values.</p>
  </div>
</div>

For the same three bytes, the standard value `+/8=` becomes `-_8` in unpadded Base64URL. Those bytes are not valid UTF-8 text, so a text-only decoder should reject them rather than display misleading characters.

## Encode bytes, not abstract characters

Text first needs a character encoding. InfraTrove uses UTF-8 so non-English text and emoji round-trip correctly:

```text
Hello 👋
SGVsbG8g8J+Riw==
```

Passing Unicode directly to `btoa` can fail or encode unintended bytes. Convert text to UTF-8 bytes first with `TextEncoder`; decode bytes with `TextDecoder` afterward.

## Padding errors are useful clues

A correctly padded standard Base64 string has a length divisible by four. Missing padding, a misplaced equals sign, or an unexpected alphabet character should produce an error. Some protocols explicitly allow unpadded Base64URL; use the variant your protocol specifies instead of guessing.

InfraTrove's standard mode requires padding when needed. URL-safe mode accepts padded or unpadded input and returns unpadded output. Whitespace and invalid unused bits are rejected rather than silently repaired.

## Base64 is not a privacy feature

Anyone who has the encoded text can decode it. Do not use Base64 as password protection. A decoded JWT payload is also not proof of a verified signature.

<blockquote class="editorial-quote">
  “A Base64 string carries zero cryptographic protection — anyone holding the payload can reverse it to plaintext instantly.”
</blockquote>

<div class="takeaways-box">
  <div class="takeaways-header">
    <h3 class="takeaways-title">3 core takeaways to remember</h3>
    <span class="takeaways-badge">Key Takeaways</span>
  </div>
  <div class="takeaways-grid">
    <div class="takeaway-item">
      <div class="takeaway-head">
        <span class="takeaway-num">01</span>
        <strong class="takeaway-heading">URL-safe characters</strong>
      </div>
      <p>Replaces <code>+</code> and <code>/</code> with <code>-</code> and <code>_</code> so query strings never need percent-escaping.</p>
    </div>
    <div class="takeaway-item">
      <div class="takeaway-head">
        <span class="takeaway-num">02</span>
        <strong class="takeaway-heading">Padding convention</strong>
      </div>
      <p>Standard Base64 pads to a multiple of 4 with <code>=</code>, whereas Base64URL typically omits padding entirely.</p>
    </div>
    <div class="takeaway-item">
      <div class="takeaway-head">
        <span class="takeaway-num">03</span>
        <strong class="takeaway-heading">Encoding is not privacy</strong>
      </div>
      <p>Base64 is merely a byte representation format. Never treat it as encryption or password security.</p>
    </div>
  </div>
</div>

Try the [Base64 Encoder / Decoder](/tools/base64-encoder-decoder/) with a harmless sample. For percent-encoded URL parameters, use the [URL Encoder](/tools/url-encoder-decoder/) instead.

## References

- [RFC 4648: Base encodings](https://www.rfc-editor.org/rfc/rfc4648)
- [MDN: TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
