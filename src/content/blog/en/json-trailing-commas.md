---
title: 'Why your JSON is invalid (and how to fix it)'
description: 'Trailing commas, quoted keys and escaped characters: a practical checklist for the JSON errors you see most often.'
category: 'Text & data'
readingTime: '3 min read'
updated: '2026-10-24'
tool: 'json-formatter'
---

JSON is a data format with a smaller syntax than JavaScript. A value can look like a JavaScript object and still fail `JSON.parse`. Start with the first reported error: one missing quote can make everything after it look broken.

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

## A valid value does not need to be an object

Arrays, strings, numbers, booleans and `null` can all be complete JSON documents. Whether an API accepts them is a separate question about its schema.

## Formatting can change representation

InfraTrove parses JSON using JavaScript and serializes the result. Duplicate object keys keep the last value. Numbers beyond JavaScript's safe integer range can lose precision. If you need exact handling of large identifiers, encode them as strings in the source system or use a parser designed for lossless numbers.

Use the [JSON Formatter](/tools/json-formatter/) to check syntax and make the structure easier to read. It preserves your input when parsing fails.

## Reference

The [JSON standard, RFC 8259](https://www.rfc-editor.org/rfc/rfc8259), defines valid values, strings and number syntax.
