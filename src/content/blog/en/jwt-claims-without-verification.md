---
title: 'Read JWT claims without confusing decoding with verification'
description: 'Inspect a token header, payload and NumericDate claims while keeping trust checks separate.'
category: 'Encode & decode'
readingTime: '3 min read'
updated: '2026-10-26'
tool: 'jwt-decoder'
---

A compact signed JWT normally has three dot-separated parts: a header, a payload and a signature. Reading the first two parts can help debug an API response, but it does not establish that either part is authentic.

## Inspect a harmless example first

Open the [JWT Decoder](/tools/jwt-decoder/) and select Load example. The sample contains `sub: "demo-user"` and time values of zero. It is intentionally a debugging example, not an authentication credential or a verified signature.

Header and payload are Base64URL-encoded JSON objects. The tool decodes them locally and lets you copy each section. It does not request a signing key, fetch a JWKS endpoint or store the token.

## Interpret time claims as seconds

The registered claims `iat`, `nbf` and `exp` use NumericDate values in seconds from the Unix epoch:

| Claim | Meaning                                            |
| ----- | -------------------------------------------------- |
| `iat` | When the token was issued                          |
| `nbf` | The time before which it must not be accepted      |
| `exp` | The time at or after which it must not be accepted |

Zero is a real value: it becomes `1970-01-01T00:00:00.000Z`. Milliseconds entered as seconds can produce a misleading distant date. The tool displays UTC dates without guessing a different unit; use the [Timestamp Converter](/tools/unix-timestamp-converter/) to investigate a suspected unit error.

## Verify trust in the application

An attacker can change an encoded payload. Your application must validate the signature and the expected issuer, audience and applicable time claims with a suitable JWT library. The displayed algorithm name is also untrusted input; the application chooses which algorithms it accepts.

The decoder can inspect an unsecured `alg: "none"` token with an empty signature. That does not make the token acceptable for authentication. It does not automatically classify HS256 as weak: key strength and the application's verification configuration matter.

## Supported format and limits

This decoder accepts three-part compact JWTs with JSON objects in the header and payload, up to 20,000 characters. Five-part encrypted JWE, detached payloads and unencoded payloads are not supported. NumericDate claims must be finite numeric values in the supported date range. Repeated JSON keys keep their last value.

## References

- [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519)
- [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725)
