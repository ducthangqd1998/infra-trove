export const categories = [
  'All tools',
  'Text & data',
  'Encode & decode',
  'Generators',
  'Time & scheduling',
] as const;
export type Tool = {
  slug: string;
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
    layout: 'editors',
    title: 'JSON Formatter & Validator',
    shortTitle: 'JSON Formatter',
    summary: 'Turn compact JSON into something you can actually read.',
    category: 'Text & data',
    symbol: '{ }',
    tags: ['beautify', 'minify', 'validate', 'API'],
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
    note: 'CRLF and LF line endings are normalized. Ignoring whitespace collapses spaces and tabs within each line; blank lines remain significant. Comparison is capped at 20,000 characters per pane and a one-second diff budget.',
    related: ['json-formatter', 'base64-encoder-decoder'],
  },
  {
    slug: 'cron-generator',
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
];
export function getTool(slug: string): Tool {
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}
