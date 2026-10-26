export type HashAlgorithm = 'SHA-256' | 'SHA-512';
export const MAX_FILE_BYTES = 32 * 1024 * 1024;
export function validateFileSize(size: number) {
  if (!Number.isSafeInteger(size) || size < 0 || size > MAX_FILE_BYTES)
    throw new Error(
      'File limit: 32 MiB. Use a local command-line tool for larger files.',
    );
}
export async function hashBytes(
  bytes: ArrayBuffer,
  algorithm: HashAlgorithm,
): Promise<string> {
  if (algorithm !== 'SHA-256' && algorithm !== 'SHA-512')
    throw new Error('Unsupported hash algorithm.');
  validateFileSize(bytes.byteLength);
  const digest = await crypto.subtle.digest(algorithm, bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
export async function hashText(
  text: string,
  algorithm: HashAlgorithm,
): Promise<string> {
  if (text.length > 200_000) throw new Error('Text limit: 200,000 characters.');
  if (!text.isWellFormed()) throw new Error('Text contains invalid Unicode.');
  return hashBytes(new TextEncoder().encode(text).buffer, algorithm);
}
export function compareChecksum(
  actual: string,
  expected: string,
  algorithm: HashAlgorithm,
) {
  const normalized = expected.replace(/\s/g, '').toLowerCase();
  if (!normalized) return 'empty';
  if (
    !new RegExp(`^[a-f0-9]{${algorithm === 'SHA-256' ? 64 : 128}}$`).test(
      normalized,
    )
  )
    return 'invalid';
  if (!actual) return 'pending';
  return actual === normalized ? 'match' : 'mismatch';
}
