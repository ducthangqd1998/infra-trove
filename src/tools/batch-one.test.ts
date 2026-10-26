import { describe, expect, it } from 'vitest';
import { convertYamlJson } from './yaml-json-converter/logic';
import { decodeJwt } from './jwt-decoder/logic';
import { convertStorage } from './storage-unit-converter/logic';
import {
  compareChecksum,
  hashBytes,
  hashText,
  validateFileSize,
  MAX_FILE_BYTES,
} from './hash-checksum/logic';

describe('YAML / JSON conversion', () => {
  it('round-trips Unicode, primitives and string-like values', () => {
    for (const value of [
      { title: 'Tiếng Việt 👋', enabled: true, values: [null, '001', 1] },
      'yes',
      0,
      null,
    ]) {
      const json = JSON.stringify(value);
      expect(
        JSON.parse(
          convertYamlJson(
            convertYamlJson(json, 'json-to-yaml'),
            'yaml-to-json',
          ),
        ),
      ).toEqual(value);
    }
  });
  it('uses YAML 1.2 and preserves prototype-looking keys as data', () => {
    expect(
      JSON.parse(
        convertYamlJson('enabled: yes\n__proto__: value', 'yaml-to-json'),
      ),
    ).toEqual({ enabled: 'yes', ['__proto__']: 'value' });
    expect({}.hasOwnProperty('polluted')).toBe(false);
  });
  it.each([
    'a: 1\na: 2',
    'a: !custom value',
    'a: &x [1]\nb: *x',
    'a: .inf',
    '1: value',
    '---\na: 1\n---\nb: 2',
    'a: 9007199254740993',
    'a: [',
  ])('rejects lossy, ambiguous or unsupported YAML: %s', (value) => {
    expect(() => convertYamlJson(value, 'yaml-to-json')).toThrow();
  });
  it('rejects oversized input, excessive nesting and unsafe JSON numbers', () => {
    expect(() => convertYamlJson('a'.repeat(100_001), 'yaml-to-json')).toThrow(
      'limit',
    );
    expect(() =>
      convertYamlJson('['.repeat(60) + '0' + ']'.repeat(60), 'json-to-yaml'),
    ).toThrow('nesting');
    expect(() =>
      convertYamlJson('{"n":9007199254740993}', 'json-to-yaml'),
    ).toThrow('safe');
  });
});

const token = (header: unknown, payload: unknown, signature = 'c2ln') =>
  [header, payload]
    .map((part) => Buffer.from(JSON.stringify(part)).toString('base64url'))
    .join('.') +
  '.' +
  signature;
describe('JWT inspection', () => {
  it('decodes Unicode claims and converts NumericDate zero without verifying a signature', () => {
    const result = decodeJwt(
      token(
        { alg: 'HS256' },
        { name: 'Tiếng Việt 👋', exp: 0, iat: -1, nbf: 1 },
      ),
    );
    expect(result.payload.name).toBe('Tiếng Việt 👋');
    expect(result.dates.find((d) => d.claim === 'exp')?.iso).toBe(
      '1970-01-01T00:00:00.000Z',
    );
    expect(result.header.alg).toBe('HS256');
  });
  it.each([
    'a.b',
    'a.b.c.d.e',
    token([], {}),
    token({}, []),
    token({ alg: 'HS256' }, { exp: 'tomorrow' }),
    token({ alg: 'HS256' }, {}, '!!!'),
    token({ alg: 'HS256' }, {}, ''),
  ])('rejects malformed or unsupported token: %s', (value) =>
    expect(() => decodeJwt(value)).toThrow(),
  );
  it('supports unsecured JWT inspection without claiming trust', () => {
    expect(
      decodeJwt(token({ alg: 'none' }, { sub: 'demo' }, '')).header.alg,
    ).toBe('none');
  });
});

describe('exact storage conversion', () => {
  it('distinguishes decimal and binary units', () => {
    expect(convertStorage('1', 'GB').find((v) => v.unit === 'B')?.value).toBe(
      '1000000000',
    );
    expect(convertStorage('1', 'GiB').find((v) => v.unit === 'B')?.value).toBe(
      '1073741824',
    );
    expect(
      convertStorage('1.5', 'GiB').find((v) => v.unit === 'MiB')?.value,
    ).toBe('1536');
  });
  it('preserves large integers, zero and tiny values', () => {
    expect(convertStorage('9007199254740993', 'B')[0].value).toBe(
      '9007199254740993',
    );
    expect(convertStorage('0', 'TiB').every((v) => v.value === '0')).toBe(true);
    expect(convertStorage('0.000000000000000001', 'B')[0].value).toBe(
      '< 0.000000001',
    );
  });
  it.each(['-1', 'NaN', 'Infinity', '1e3', '1,000', '', '.'])(
    'rejects invalid amount %s',
    (value) => expect(() => convertStorage(value, 'B')).toThrow(),
  );
  it('rejects unknown units', () =>
    expect(() => convertStorage('1', 'unknown')).toThrow());
});

describe('local SHA hashing', () => {
  it('matches SHA-256 and SHA-512 reference vectors', async () => {
    expect(await hashText('abc', 'SHA-256')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
    expect(await hashText('abc', 'SHA-512')).toBe(
      'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
    );
    expect(await hashBytes(new ArrayBuffer(0), 'SHA-256')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
  it('hashes UTF-8 text as bytes', async () =>
    expect(await hashText('Tiếng Việt 👋', 'SHA-256')).toBe(
      await hashBytes(
        new TextEncoder().encode('Tiếng Việt 👋').buffer,
        'SHA-256',
      ),
    ));
  it('checks expected checksum syntax before comparing', () => {
    const digest = 'a'.repeat(64);
    expect(
      compareChecksum(digest, ` ${digest.toUpperCase()}\n`, 'SHA-256'),
    ).toBe('match');
    expect(compareChecksum(digest, 'b'.repeat(64), 'SHA-256')).toBe('mismatch');
    expect(compareChecksum(digest, 'xyz', 'SHA-256')).toBe('invalid');
    expect(compareChecksum(digest, '', 'SHA-256')).toBe('empty');
  });
  it('bounds memory and rejects invalid text / unsupported algorithms', async () => {
    expect(() => validateFileSize(MAX_FILE_BYTES + 1)).toThrow('32 MiB');
    expect(() => validateFileSize(0)).not.toThrow();
    await expect(hashText('\ud800', 'SHA-256')).rejects.toThrow('Unicode');
    await expect(hashText('abc', 'MD5' as 'SHA-256')).rejects.toThrow(
      'algorithm',
    );
  });
});
