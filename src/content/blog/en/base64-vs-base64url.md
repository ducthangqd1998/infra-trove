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

Try the [Base64 Encoder / Decoder](/tools/base64-encoder-decoder/) with a harmless sample. For percent-encoded URL parameters, use the [URL Encoder](/tools/url-encoder-decoder/) instead.

## References

- [RFC 4648: Base encodings](https://www.rfc-editor.org/rfc/rfc4648)
- [MDN: TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
