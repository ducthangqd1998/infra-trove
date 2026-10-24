export function generateUuids(count: number) {
  if (!Number.isInteger(count) || count < 1 || count > 100)
    throw new Error('Choose between 1 and 100 UUIDs.');
  if (!globalThis.crypto?.randomUUID)
    throw new Error('Web Crypto is unavailable. Open this tool over HTTPS.');
  return Array.from({ length: count }, () => crypto.randomUUID()).join('\n');
}
