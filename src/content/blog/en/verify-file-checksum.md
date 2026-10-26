---
title: 'Compare a file checksum and understand what a match proves'
description: 'Calculate SHA-256 or SHA-512 locally, compare the expected digest and distinguish integrity from authenticity.'
category: 'Generators'
readingTime: '3 min read'
updated: '2026-10-26'
tool: 'hash-checksum'
---

A checksum lets you compare a file's bytes with an expected digest. It is useful after downloading an archive, copying an artifact or restoring a backup. The conclusion depends on where the expected checksum came from.

## Calculate and compare

Open [Hash & Checksum](/tools/hash-checksum/), choose File and select a file up to 32 MiB. Choose the same algorithm as the publisher, calculate the hash and paste the expected hexadecimal checksum.

The comparator ignores case and whitespace. SHA-256 requires 64 hexadecimal characters; SHA-512 requires 128. The page distinguishes an invalid expected digest from a well-formed digest that does not match.

## Test a known text value

In Text mode, `abc` produces this SHA-256 digest:

```text
ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```

Text is encoded as UTF-8. Spaces, newlines and a byte-order mark change the bytes and therefore the hash. An empty string is supported and has its own digest. To compare an existing file, use File mode rather than copying its visible text, which might change encoding or line endings.

## A match is not a safety verdict

A matching cryptographic checksum provides strong evidence of agreement with the supplied digest. It does not prove the file contains no malware. If an attacker can replace both a download and its published checksum, a comparison cannot detect that substitution. Authenticate the publisher through a trusted checksum channel or the project's signature-verification procedure.

These fast general-purpose hashes are not designed for storing passwords. Password storage needs a dedicated password-hashing scheme with appropriate work factors and salts.

## Know the browser limits

Hashing uses Web Crypto and requires HTTPS or localhost. Nothing is uploaded or saved. The complete file is held in memory, so this version limits files to 32 MiB and text to 200,000 characters. It supports SHA-256 and SHA-512 only.

For larger files, use a local command such as `sha256sum file.iso` on Linux, following the publisher's instructions. Check [Storage Unit Converter](/tools/storage-unit-converter/) if a size reported in MB differs from one reported in MiB.

## References

- [MDN: SubtleCrypto.digest](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
- [NIST: Secure Hash Standard](https://doi.org/10.6028/NIST.FIPS.180-4)
