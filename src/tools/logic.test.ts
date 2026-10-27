import { describe, expect, it } from 'vitest';
import { formatJson } from './json-formatter/logic';
import { transformBase64 } from './encoding/base64';
import { transformUrl } from './encoding/url';
import { generatePassword, passwordStrength } from './password-generator/logic';
import { generateUuids } from './uuid-generator/logic';
import { buildDiffRows, compareText, inlineDiff } from './text-compare/logic';
import {
  timestampToDate,
  dateToTimestamp,
  guessUnit,
} from './unix-timestamp-converter/logic';
import { fieldAt, previewCron } from './cron-generator/logic';

describe('JSON', () => {
  it.each([
    'null',
    'true',
    '123',
    '"hello"',
    '[]',
    '{"hello":"Tiếng Việt 👋"}',
  ])('round-trips %s', (input) =>
    expect(JSON.parse(formatJson(input))).toEqual(JSON.parse(input)),
  );
  it('formats and minifies', () => {
    expect(formatJson('{"a":1}', 4)).toBe('{\n    "a": 1\n}');
    expect(formatJson(' { "a": 1 } ', 'minify')).toBe('{"a":1}');
  });
  it.each(['', '{"a":1,}', "{'a':1}"])('rejects invalid input %s', (input) =>
    expect(() => formatJson(input)).toThrow(),
  );
  it('limits size', () =>
    expect(() => formatJson(' '.repeat(200_001))).toThrow('limit'));
});
describe('encoding', () => {
  it.each(['', 'Hello 👋', 'Tiếng Việt', 'a\0b', 'line\nbreak'])(
    'round-trips UTF-8 %s',
    (input) => {
      expect(transformBase64(transformBase64(input, false), true)).toBe(input);
      expect(
        transformBase64(transformBase64(input, false, true), true, true),
      ).toBe(input);
    },
  );
  it('matches a known test vector', () =>
    expect(transformBase64('Hello 👋', false)).toBe('SGVsbG8g8J+Riw=='));
  it('handles URL-safe alphabet', () => {
    const encoded = transformBase64('🫿', false, true);
    expect(encoded).not.toMatch(/[+/=]/);
    expect(transformBase64(encoded, true, true)).toBe('🫿');
  });
  it.each(['a', 'ab=c', '!!!!', 'Zg', 'Zg===', 'Zh==', '/w==', ' Zg=='])(
    'rejects malformed or binary Base64 %s',
    (value) => expect(() => transformBase64(value, true)).toThrow(),
  );
  it('allows unpadded Base64URL', () =>
    expect(transformBase64('Zg', true, true)).toBe('f'));
  it('does not silently replace malformed Unicode', () =>
    expect(() => transformBase64('\ud800', false)).toThrow('Unicode'));
  it('encodes components and retains plus signs', () => {
    expect(transformUrl('hello world & tea', false)).toBe(
      'hello%20world%20%26%20tea',
    );
    expect(transformUrl('a+b%20c', true)).toBe('a+b c');
    expect(transformUrl(transformUrl('👋&=/?', false), true)).toBe('👋&=/?');
  });
  it('rejects invalid URL escapes', () =>
    expect(() => transformUrl('%GG', true)).toThrow());
});
describe('secure generators', () => {
  const options = {
    length: 20,
    upper: true,
    lower: true,
    digits: true,
    symbols: true,
    excludeAmbiguous: false,
  };
  it('meets length and every selected group', () => {
    for (let i = 0; i < 20; i++) {
      const result = generatePassword(options);
      expect(result).toHaveLength(20);
      expect(result).toMatch(/[A-Z]/);
      expect(result).toMatch(/[a-z]/);
      expect(result).toMatch(/[0-9]/);
      expect(result).toMatch(/[!@#$%^&*()\-_=+\[\]{}:,.?]/);
    }
  });
  it('respects exclusions and selected alphabet', () =>
    expect(
      generatePassword({
        ...options,
        upper: false,
        lower: false,
        symbols: false,
        excludeAmbiguous: true,
      }),
    ).toMatch(/^[2-9]{20}$/));
  it('rejects empty charset and invalid sizes', () => {
    expect(() =>
      generatePassword({
        ...options,
        upper: false,
        lower: false,
        symbols: false,
        digits: false,
      }),
    ).toThrow();
    expect(() => generatePassword({ ...options, length: 129 })).toThrow();
  });
  it('produces UUID v4 version and variant bits', () => {
    const values = generateUuids(10).split('\n');
    expect(values).toHaveLength(10);
    for (const value of values)
      expect(value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
  });
  it.each([0, 101, 1.5, NaN])('rejects bulk size %s', (count) =>
    expect(() => generateUuids(count)).toThrow(),
  );
});
describe('diff', () => {
  it('identifies added and removed lines', () => {
    const parts = compareText('hello\nold\n', 'hello\nnew\n');
    expect(parts.find((part) => part.removed)?.value).toBe('old\n');
    expect(parts.find((part) => part.added)?.value).toBe('new\n');
  });
  it('normalizes line endings', () =>
    expect(
      compareText('one\r\ntwo\r\n', 'one\ntwo\n').every(
        (part) => !part.added && !part.removed,
      ),
    ).toBe(true));
  it('handles empty text and Unicode', () => {
    expect(compareText('', '')).toEqual([]);
    expect(compareText('', '👋')[0].added).toBe(true);
  });
  it('applies ignore options consistently', () =>
    expect(
      compareText(' Hello  WORLD ', 'hello world', true, true).every(
        (part) => !part.added && !part.removed,
      ),
    ).toBe(true));
  it('handles large text inputs up to 200,000 characters', () => {
    const textA = 'const variable_name = "some_sample_value_here";\n'.repeat(
      1500,
    );
    const textB = 'const variable_name = "some_modified_value_here";\n'.repeat(
      1500,
    );
    const parts = compareText(textA, textB);
    expect(parts.length).toBeGreaterThan(0);
  });
  it('rejects oversized text', () =>
    expect(() => compareText('a'.repeat(200_001), '')).toThrow('limit'));
});
describe('timestamps', () => {
  it('supports zero, milliseconds and negative epochs', () => {
    expect(timestampToDate('0', 'seconds').iso).toBe(
      '1970-01-01T00:00:00.000Z',
    );
    expect(timestampToDate('1000', 'milliseconds').seconds).toBe(1);
    expect(timestampToDate('-1', 'seconds').iso).toBe(
      '1969-12-31T23:59:59.000Z',
    );
  });
  it('uses explicit timezone offsets', () =>
    expect(dateToTimestamp('1970-01-01T07:00:00+07:00').seconds).toBe(0));
  it('distinguishes the repeated DST hour', () =>
    expect(
      dateToTimestamp('2026-11-01T01:30:00-05:00').seconds -
        dateToTimestamp('2026-11-01T01:30:00-04:00').seconds,
    ).toBe(3600));
  it.each([
    '2026-02-30T00:00:00Z',
    '2026-01-01T25:00:00Z',
    '2026-01-01T09:00:00',
    '2025-02-29T00:00:00Z',
  ])('rejects invalid or ambiguous date %s', (input) =>
    expect(() => dateToTimestamp(input)).toThrow(),
  );
  it.each(['NaN', '1.2', '8640000000000001', ''])(
    'rejects invalid timestamps %s',
    (input) => expect(() => timestampToDate(input, 'milliseconds')).toThrow(),
  );
});
describe('cron', () => {
  const start = new Date('2026-01-01T00:00:00Z');
  it('previews a known schedule', () => {
    const result = previewCron('*/5 * * * *', 'UTC', start);
    expect(result.dates[0]).toBe('2026-01-01T00:05:00.000Z');
    expect(result.dates).toHaveLength(5);
  });
  it('supports weekdays', () =>
    expect(previewCron('0 9 * * 1-5', 'UTC', start).dates[0]).toBe(
      '2026-01-01T09:00:00.000Z',
    ));
  it('uses Unix OR semantics for day fields', () =>
    expect(previewCron('0 9 1 * 1', 'UTC', start).dates[0]).toBe(
      '2026-01-01T09:00:00.000Z',
    ));
  it('keeps local wall time across a DST change', () => {
    const dates = previewCron(
      '0 9 * * *',
      'America/New_York',
      new Date('2026-03-07T00:00:00Z'),
    ).dates;
    expect(dates[0]).toBe('2026-03-07T14:00:00.000Z');
    expect(dates[1]).toBe('2026-03-08T13:00:00.000Z');
  });
  it.each([
    '*/0 * * * *',
    '99 * * * *',
    '* * * * * *',
    '@daily',
    '0 9 ? * 1',
    '0 0 L * *',
  ])('rejects invalid or unsupported expression %s', (expression) =>
    expect(() => previewCron(expression, 'UTC', start)).toThrow(),
  );
});
describe('diff rows', () => {
  it('pairs a changed block and numbers both sides', () => {
    const original = 'Hello world\nVersion: 1\nReady';
    const changed = 'Hello InfraTrove\nVersion: 2\nReady';
    const rows = buildDiffRows(
      compareText(original, changed),
      original,
      changed,
    );
    expect(rows.added).toBe(2);
    expect(rows.removed).toBe(2);
    expect(rows.split).toHaveLength(3);
    expect(rows.split[0].left).toEqual({
      n: 1,
      text: 'Hello world',
      type: 'removed',
    });
    expect(rows.split[0].right).toEqual({
      n: 1,
      text: 'Hello InfraTrove',
      type: 'added',
    });
    expect(rows.split[2].left?.type).toBe('same');
    expect(rows.unified.map((row) => row.type)).toEqual([
      'removed',
      'removed',
      'added',
      'added',
      'same',
    ]);
  });
  it('leaves the other side empty for pure additions', () => {
    const rows = buildDiffRows(compareText('a\n', 'a\nb\n'), 'a\n', 'a\nb\n');
    expect(rows.split[1]).toEqual({
      right: { n: 2, text: 'b', type: 'added' },
    });
  });
  it('shows the original text when ignoring case', () => {
    const rows = buildDiffRows(
      compareText('Hello', 'hello', true),
      'Hello',
      'hello',
    );
    expect(rows.split[0].left?.text).toBe('Hello');
    expect(rows.added + rows.removed).toBe(0);
  });
  it('marks changed words inside a line', () => {
    const words = inlineDiff('Version: 1', 'Version: 2');
    expect(
      words?.left.filter((part) => part.changed).map((part) => part.text),
    ).toEqual(['1']);
    expect(
      words?.right.filter((part) => part.changed).map((part) => part.text),
    ).toEqual(['2']);
    expect(inlineDiff('a'.repeat(1500), 'b'.repeat(1500))).toBeNull();
  });
});
describe('tool helpers', () => {
  it('rates password strength from the alphabet size', () => {
    const base = {
      length: 20,
      upper: true,
      lower: true,
      digits: true,
      symbols: true,
      excludeAmbiguous: false,
    };
    expect(passwordStrength(base).label).toBe('Very strong');
    expect(
      passwordStrength({
        ...base,
        length: 8,
        upper: false,
        lower: false,
        symbols: false,
      }),
    ).toMatchObject({ bits: 27, label: 'Weak' });
  });
  it('finds the cron field at the caret', () => {
    expect(fieldAt('*/5 * * * *', 0)).toBe(0);
    expect(fieldAt('*/5 * * * *', 4)).toBe(1);
    expect(fieldAt('*/5 * * * *', 11)).toBe(4);
    expect(fieldAt('0 9 ', 4)).toBe(2);
  });
  it('guesses seconds or milliseconds', () => {
    expect(guessUnit('1792838983')).toBe('seconds');
    expect(guessUnit('1792838983000')).toBe('milliseconds');
    expect(guessUnit('-1')).toBe('seconds');
  });
});
