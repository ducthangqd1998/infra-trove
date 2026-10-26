---
title: 'Convert YAML and JSON without losing track of types'
description: 'Understand YAML 1.2 values, quoted strings and the limits of a configuration round-trip.'
category: 'Text & data'
readingTime: '3 min read'
updated: '2026-10-26'
tool: 'yaml-json-converter'
---

YAML and JSON can describe the same configuration data, but converting a document is different from preserving its original text. Comments, anchors, indentation and quoting style do not survive a YAML-to-JSON-to-YAML round-trip.

## Start with a small configuration

Paste this into the [YAML ↔ JSON Converter](/tools/yaml-json-converter/), choose YAML to JSON and select Convert:

```yaml
name: demo-api
replicas: 3
enabled: true
ports:
  - 8080
```

The result contains a string, number, boolean and an array. Copy or download it, then use Swap direction to convert it back. Compare the data rather than expecting identical whitespace.

## Quote values that must stay strings

The tool uses the YAML 1.2 core schema. `yes` is a string, while `true` is a boolean. Quote identifiers such as `"001"` when leading zeroes matter. Numeric or boolean mapping keys must also be quoted because JSON object keys are strings.

An integer outside JavaScript's safe integer range is rejected instead of silently rounded. Represent such an identifier as a quoted string. Other decimal values still follow JavaScript number precision; do not use this converter to preserve arbitrary-precision numeric data.

## Know what is unsupported

Convert one document at a time. Aliases, merge keys, custom tags, non-finite numbers and unsupported explicit tags are rejected. Expand aliases in your source configuration before using this tool. An anchor declaration may be discarded when no alias refers to it.

The limits are 100,000 input characters, 400,000 output characters, 50 nesting levels and 10,000 values. These limits keep the browser responsive; split larger documents before converting. Duplicate YAML keys produce an error. In JSON input, repeated keys keep their last value, as with `JSON.parse`.

## Check the target application

Converting syntax does not validate a Kubernetes resource, CI workflow or application schema. Check the converted result with the target application's validator. Use [Text Compare](/tools/text-compare/) to review configuration changes or [JSON Formatter](/tools/json-formatter/) to inspect JSON independently.

## References

- [YAML library documentation](https://eemeli.org/yaml/)
- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/)
