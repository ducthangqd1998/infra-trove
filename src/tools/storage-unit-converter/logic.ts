export const STORAGE_UNITS = [
  { unit: 'B', name: 'bytes', factor: 1n },
  { unit: 'kB', name: 'kilobytes', factor: 1000n },
  { unit: 'MB', name: 'megabytes', factor: 1000n ** 2n },
  { unit: 'GB', name: 'gigabytes', factor: 1000n ** 3n },
  { unit: 'TB', name: 'terabytes', factor: 1000n ** 4n },
  { unit: 'KiB', name: 'kibibytes', factor: 1024n },
  { unit: 'MiB', name: 'mebibytes', factor: 1024n ** 2n },
  { unit: 'GiB', name: 'gibibytes', factor: 1024n ** 3n },
  { unit: 'TiB', name: 'tebibytes', factor: 1024n ** 4n },
] as const;
/** Round a positive rational half up at nine decimal places without floating point loss. */
function decimal(numerator: bigint, denominator: bigint) {
  const scale = 1_000_000_000n;
  const rounded = (numerator * scale * 2n + denominator) / (2n * denominator);
  if (numerator > 0n && rounded === 0n) return '< 0.000000001';
  const fraction = (rounded % scale)
    .toString()
    .padStart(9, '0')
    .replace(/0+$/, '');
  return (rounded / scale).toString() + (fraction ? `.${fraction}` : '');
}
export function convertStorage(input: string, source: string) {
  const value = input.trim();
  if (!/^\d{1,40}(?:\.\d{1,18})?$/.test(value))
    throw new Error(
      'Enter a non-negative decimal number (up to 40 whole digits and 18 decimal places). No commas or exponent notation.',
    );
  const from = STORAGE_UNITS.find((entry) => entry.unit === source);
  if (!from) throw new Error('Choose a supported storage unit.');
  const [whole, fraction = ''] = value.split('.');
  const numerator = BigInt(whole + fraction) * from.factor;
  const denominator = 10n ** BigInt(fraction.length);
  return STORAGE_UNITS.map(({ unit, name, factor }) => ({
    unit,
    name,
    value: decimal(numerator, denominator * factor),
  }));
}
