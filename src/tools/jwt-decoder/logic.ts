import { transformBase64 } from '../encoding/base64';

export type DecodedJwt = {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  dates: { claim: string; iso: string }[];
};
function decodeObject(segment: string, name: string): Record<string, unknown> {
  if (!segment || !/^[A-Za-z0-9_-]+$/.test(segment))
    throw new Error(`${name} must use unpadded Base64URL.`);
  const value: unknown = JSON.parse(transformBase64(segment, true, true));
  if (value === null || Array.isArray(value) || typeof value !== 'object')
    throw new Error(`${name} must contain a JSON object.`);
  return value as Record<string, unknown>;
}
export function decodeJwt(input: string): DecodedJwt {
  if (input.length > 20_000) throw new Error('Token limit: 20,000 characters.');
  const parts = input.trim().split('.');
  if (parts.length !== 3)
    throw new Error(
      'Enter a JWT with three dot-separated parts. Encrypted JWE tokens are not supported.',
    );
  const [encodedHeader, encodedPayload, signature] = parts;
  const header = decodeObject(encodedHeader, 'Header');
  if (header.b64 === false)
    throw new Error('Unencoded JWT payloads are not supported.');
  const payload = decodeObject(encodedPayload, 'Payload');
  if (typeof header.alg !== 'string' || !header.alg)
    throw new Error('Header must declare an algorithm (alg).');
  if (
    !/^[A-Za-z0-9_-]*$/.test(signature) ||
    signature.length % 4 === 1 ||
    (!signature && header.alg !== 'none')
  )
    throw new Error(
      'Signature must use Base64URL, or be empty for alg "none".',
    );
  if (header.alg === 'none' && signature)
    throw new Error(
      'An unsecured JWT with alg "none" must have an empty signature.',
    );
  const dates: DecodedJwt['dates'] = [];
  for (const claim of ['exp', 'iat', 'nbf']) {
    if (!(claim in payload)) continue;
    const value = payload[claim];
    if (typeof value !== 'number' || !Number.isFinite(value))
      throw new Error(`${claim} must be a numeric Unix timestamp in seconds.`);
    const date = new Date(value * 1000);
    if (!Number.isFinite(date.getTime()))
      throw new Error(`${claim} is outside the supported date range.`);
    dates.push({ claim, iso: date.toISOString() });
  }
  return { header, payload, dates };
}
export const JWT_EXAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJleHAiOjAsImlhdCI6MH0.c2ln';
