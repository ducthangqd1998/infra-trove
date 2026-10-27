export const categories = [
  'All tools',
  'Text & data',
  'Encode & decode',
  'Generators',
  'Time & scheduling',
] as const;
export type Tool = {
  slug: string;
  artwork?: string;
  guide?: string;
  /**
   * `editors`: two editors side by side, so the workspace takes the whole row.
   * `panel`: one compact panel; from 1600px the guide panels sit beside it as a rail.
   */
  layout: 'editors' | 'panel';
  title: string;
  shortTitle: string;
  summary: string;
  category: (typeof categories)[number];
  symbol: string;
  tags: string[];
  steps: string[];
  example: string;
  note: string;
  related: string[];
};
export const tools: Tool[] = [
  {
    slug: 'json-formatter',
    artwork: '/images/tools/json-formatter.jpg',
    layout: 'editors',
    title: 'JSON Formatter & Validator',
    shortTitle: 'JSON Formatter',
    summary: 'Turn compact JSON into something you can actually read.',
    category: 'Text & data',
    symbol: '{ }',
    tags: [
      'beautify',
      'minify',
      'validate',
      'API',
      'XML',
      'YAML',
      'SQL',
      'HTML',
    ],
    steps: [
      'Paste a JSON value into the input.',
      'Choose an indentation size, then format or minify.',
      'Read syntax errors or copy the resulting JSON.',
    ],
    example: '{"project":"InfraTrove","tools":["JSON","Diff"],"free":true}',
    note: 'Accepts objects, arrays, strings, numbers, booleans and null. Strict JSON does not allow comments or trailing commas. Duplicate keys keep their last value, and JavaScript numbers can lose precision beyond the safe integer range. Maximum input: 200,000 characters.',
    related: ['text-compare', 'base64-encoder-decoder', 'url-encoder-decoder'],
  },
  {
    slug: 'text-compare',
    artwork: '/images/tools/text-compare.jpg',
    layout: 'editors',
    title: 'Text Compare',
    shortTitle: 'Text Compare',
    summary: 'Spot the changes between two pieces of text, line by line.',
    category: 'Text & data',
    symbol: '±',
    tags: ['diff', 'compare', 'config', 'changes'],
    steps: [
      'Paste the original text and changed text.',
      'Optionally ignore case or spaces within each line.',
      'Compare to see added and removed lines. Switch between unified and side-by-side views.',
    ],
    example: 'Original: Hello world\nChanged: Hello InfraTrove',
    note: 'CRLF and LF line endings are normalized. Ignoring whitespace collapses spaces and tabs within each line; blank lines remain significant. Comparison is capped at 200,000 characters per pane and a 2.5-second diff budget.',
    related: ['json-formatter', 'base64-encoder-decoder'],
  },
  {
    slug: 'cron-generator',
    artwork: '/images/tools/cron-generator.jpg',
    layout: 'panel',
    title: 'Cron Expression Generator',
    shortTitle: 'Cron Generator',
    summary: 'Build a schedule. Understand exactly when it will run.',
    category: 'Time & scheduling',
    symbol: '↻',
    tags: ['schedule', 'crontab', 'parser', 'jobs'],
    steps: [
      'Choose a preset or enter a five-field Unix cron expression.',
      'Choose UTC or your browser timezone.',
      'Preview the next five execution times before copying your schedule.',
    ],
    example: '*/5 * * * * → every 5 minutes',
    note: 'Five fields only: minute, hour, day of month, month, day of week. Uses cron-parser with Unix OR semantics when both day fields are restricted. Quartz, seconds, macros and special L/#/? syntax are not supported. Preview accounts for the selected timezone; your actual scheduler can differ around daylight saving transitions.',
    related: ['unix-timestamp-converter', 'uuid-generator'],
  },
  {
    slug: 'unix-timestamp-converter',
    artwork: '/images/tools/unix-timestamp-converter.jpg',
    layout: 'panel',
    title: 'Unix Timestamp Converter',
    shortTitle: 'Unix Timestamp',
    summary: 'Translate epoch seconds or milliseconds into a readable date.',
    category: 'Time & scheduling',
    symbol: '01',
    tags: ['epoch', 'date', 'milliseconds', 'UTC'],
    steps: [
      'Enter a timestamp and select seconds or milliseconds explicitly.',
      'Convert to UTC, ISO 8601 and local time.',
      'For reverse conversion, enter an ISO date with Z or an explicit UTC offset.',
    ],
    example: '0 seconds → 1970-01-01T00:00:00.000Z',
    note: 'Unix time counts from January 1, 1970 UTC and does not count leap seconds. Negative timestamps are supported. Reverse conversion requires a timezone offset to avoid ambiguous local times; seconds output is floored for fractional seconds.',
    related: ['cron-generator', 'json-formatter'],
  },
  {
    slug: 'password-generator',
    artwork: '/images/tools/password-generator.jpg',
    layout: 'panel',
    title: 'Password Generator',
    shortTitle: 'Password Generator',
    summary: 'Make a strong, random password without sending it anywhere.',
    category: 'Generators',
    symbol: '✳',
    tags: ['secure', 'random', 'token', 'security'],
    steps: [
      'Choose a length and at least one character group.',
      'Optionally exclude characters that are easy to confuse.',
      'Generate a password and copy it when you are ready.',
    ],
    example: 'Choose 20 characters with letters, digits and symbols.',
    note: 'Uses Web Crypto and rejection sampling, with at least one character from every selected group. Passwords stay in memory and are cleared on reload. Clipboard contents may be visible to other apps; store your password in a trusted password manager. This release generates random passwords, not word-based passphrases.',
    related: ['uuid-generator', 'base64-encoder-decoder'],
  },
  {
    slug: 'base64-encoder-decoder',
    artwork: '/images/tools/base64-encoder-decoder.jpg',
    layout: 'editors',
    title: 'Base64 Encoder / Decoder',
    shortTitle: 'Base64 Encoder',
    summary: 'Encode or decode UTF-8 text, including emoji and Unicode.',
    category: 'Encode & decode',
    symbol: '64',
    tags: ['UTF-8', 'encode', 'decode', 'base64url'],
    steps: [
      'Paste text to encode or a Base64 string to decode.',
      'Choose standard Base64 or the URL-safe variant.',
      'Run the operation and copy the output.',
    ],
    example: 'Hello 👋 → SGVsbG8g8J+Riw==',
    note: 'Base64 is an encoding, not encryption. This tool handles UTF-8 text, not arbitrary binary files. Standard mode requires correct padding; URL-safe mode accepts padded or unpadded input and emits unpadded output. Invalid characters and non-canonical encodings are rejected. Maximum input: 200,000 characters.',
    related: ['url-encoder-decoder', 'json-formatter'],
  },
  {
    slug: 'url-encoder-decoder',
    artwork: '/images/tools/url-encoder-decoder.jpg',
    layout: 'editors',
    title: 'URL Encoder / Decoder',
    shortTitle: 'URL Encoder',
    summary: 'Escape a URL component or decode percent-encoded text.',
    category: 'Encode & decode',
    symbol: '%',
    tags: ['URI', 'percent', 'query', 'escape'],
    steps: [
      'Paste a URL component or percent-encoded string.',
      'Choose encode or decode.',
      'Copy the output into the appropriate part of your URL.',
    ],
    example: 'hello world & tea → hello%20world%20%26%20tea',
    note: 'Uses encodeURIComponent/decodeURIComponent for individual components, not a complete URL. A plus sign remains a plus sign; form encoding uses different rules. Malformed percent escapes and invalid Unicode return an error. Maximum input: 200,000 characters.',
    related: ['base64-encoder-decoder', 'json-formatter'],
  },
  {
    slug: 'uuid-generator',
    artwork: '/images/tools/uuid-generator.jpg',
    layout: 'panel',
    title: 'UUID Generator',
    shortTitle: 'UUID Generator',
    summary: 'Create cryptographically random UUID v4 identifiers in a click.',
    category: 'Generators',
    symbol: '#',
    tags: ['identifier', 'GUID', 'v4', 'random'],
    steps: [
      'Choose between 1 and 100 identifiers.',
      'Generate a fresh batch of UUID v4 values.',
      'Copy the newline-separated list for your development workflow.',
    ],
    example: 'Format: xxxxxxxx-xxxx-4xxx-[89ab]xxx-xxxxxxxxxxxx',
    note: 'Uses crypto.randomUUID() in a secure browser context. UUID v4 provides random identifiers with a very low collision probability, not an absolute uniqueness guarantee. These identifiers are not intended as authentication secrets.',
    related: ['password-generator', 'json-formatter'],
  },
  {
    slug: 'yaml-json-converter',
    guide: 'yaml-json-conversion',
    layout: 'editors',
    title: 'YAML ↔ JSON Converter',
    shortTitle: 'YAML ↔ JSON',
    summary: 'Convert configuration between YAML and JSON with clear errors.',
    category: 'Text & data',
    symbol: 'YAML',
    tags: ['YAML', 'JSON', 'config', 'Kubernetes'],
    steps: [
      'Choose YAML to JSON or JSON to YAML.',
      'Paste your document and select Convert, or press Ctrl/Cmd + Enter.',
      'Copy or download the result. Swap direction to convert it back.',
    ],
    example: 'name: demo-api\nreplicas: 3\nenabled: true',
    note: 'One YAML 1.2 core document or JSON value. Maximum 100,000 input characters, 400,000 output characters, 50 nesting levels and 10,000 values. Aliases, merge keys, custom tags, non-string mapping keys, non-finite values and unsafe integers are rejected. Comments, anchors and original formatting are not preserved. JSON duplicate keys keep their last value.',
    related: ['json-formatter', 'text-compare', 'base64-encoder-decoder'],
  },
  {
    slug: 'jwt-decoder',
    guide: 'jwt-claims-without-verification',
    layout: 'editors',
    title: 'JWT Decoder',
    shortTitle: 'JWT Decoder',
    summary: 'Inspect a JWT header, payload and time claims locally.',
    category: 'Encode & decode',
    symbol: 'JWT',
    tags: ['JWT', 'token', 'claims', 'auth'],
    steps: [
      'Paste a three-part JWT or load the harmless example.',
      'Inspect the header and payload; time claims are shown in UTC.',
      'Copy the sections you need. Verify trust separately in your application.',
    ],
    example: 'exp: 0 → 1970-01-01T00:00:00.000Z',
    note: 'Decodes compact three-part JWTs, including alg "none" with an empty signature. It does not verify signatures, issuer, audience or authorization. Encrypted JWE and detached/unencoded payloads are unsupported. Maximum 20,000 characters. Time claims must be numeric seconds. JSON duplicate keys keep their last value. Tokens are never stored or sent to a JWKS service.',
    related: [
      'base64-encoder-decoder',
      'json-formatter',
      'unix-timestamp-converter',
    ],
  },
  {
    slug: 'storage-unit-converter',
    guide: 'storage-units-gb-gib',
    layout: 'panel',
    title: 'Storage Unit Converter',
    shortTitle: 'Storage Converter',
    summary: 'Convert bytes and storage sizes with explicit SI and IEC units.',
    category: 'Text & data',
    symbol: 'GB',
    tags: ['bytes', 'GB', 'GiB', 'storage'],
    steps: [
      'Enter a non-negative decimal amount.',
      'Choose the source unit. SI units use 1000; IEC units use 1024.',
      'Read all conversions and copy an individual result.',
    ],
    example: '1 GB = 1000000000 bytes\n1 GiB = 1073741824 bytes',
    note: 'Supports bytes through TB/TiB. Input accepts up to 40 whole digits and 18 fractional digits, without commas or exponent notation. Exact rational arithmetic avoids floating-point integer loss. Results round half up to 9 decimal places; smaller positive values are marked < 0.000000001. This converts storage bytes, not network bit rates.',
    related: [
      'hash-checksum',
      'base64-encoder-decoder',
      'unix-timestamp-converter',
    ],
  },
  {
    slug: 'hash-checksum',
    guide: 'verify-file-checksum',
    layout: 'panel',
    title: 'Hash & Checksum',
    shortTitle: 'Hash & Checksum',
    summary:
      'Hash text or a file and compare its SHA checksum without uploads.',
    category: 'Generators',
    symbol: 'SHA',
    tags: ['SHA-256', 'SHA-512', 'checksum', 'file'],
    steps: [
      'Choose Text or File and select SHA-256 or SHA-512.',
      'Enter text or choose a file up to 32 MiB, then select Calculate hash.',
      'Copy the digest or paste an expected hexadecimal checksum to compare.',
    ],
    example:
      'SHA-256 of abc:\nba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    note: 'Uses Web Crypto in HTTPS or localhost. Text is UTF-8 and whitespace is significant; empty strings and empty files are supported. Maximum 200,000 text characters or 32 MiB per file because the complete input is held in memory. Expected checksums ignore case and whitespace. A match establishes agreement with that checksum, not file safety or publisher authenticity. Not a password-hashing tool.',
    related: [
      'storage-unit-converter',
      'password-generator',
      'base64-encoder-decoder',
    ],
  },
];
export function getTool(slug: string): Tool {
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}
