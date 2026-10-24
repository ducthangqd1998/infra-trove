import { checkSize } from '../../lib/input';
export function transformBase64(
  input: string,
  decode: boolean,
  urlSafe = false,
) {
  checkSize(input);
  if (!decode) {
    if (!input.isWellFormed())
      throw new Error('Input contains invalid Unicode.');
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const encoded = btoa(binary);
    return urlSafe
      ? encoded.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
      : encoded;
  }
  if (!input) return '';
  const pattern = urlSafe ? /^[A-Za-z0-9_-]*={0,2}$/ : /^[A-Za-z0-9+/]*={0,2}$/;
  if (
    !pattern.test(input) ||
    (!urlSafe && input.length % 4 !== 0) ||
    (input.includes('=') && input.length % 4 !== 0)
  )
    throw new Error('Invalid Base64 alphabet or padding.');
  let normalized = input.replaceAll('-', '+').replaceAll('_', '/');
  if (normalized.length % 4 === 1) throw new Error('Invalid Base64 length.');
  normalized += '='.repeat((4 - (normalized.length % 4)) % 4);
  let binary: string;
  try {
    binary = atob(normalized);
  } catch {
    throw new Error('Invalid Base64 input.');
  }
  if (btoa(binary) !== normalized)
    throw new Error(
      'Non-canonical Base64 encoding. Check the final characters.',
    );
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(
      Uint8Array.from(binary, (char) => char.charCodeAt(0)),
    );
  } catch {
    throw new Error(
      'Decoded data is not valid UTF-8 text. Binary files are not supported.',
    );
  }
}
