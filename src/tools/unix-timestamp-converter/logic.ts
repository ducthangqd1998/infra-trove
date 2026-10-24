export function timestampToDate(
  input: string,
  unit: 'seconds' | 'milliseconds',
) {
  if (!/^-?\d+$/.test(input.trim()))
    throw new Error('Enter a whole-number timestamp.');
  const number = Number(input);
  const milliseconds = unit === 'seconds' ? number * 1000 : number;
  if (!Number.isSafeInteger(number) || Math.abs(milliseconds) > 8.64e15)
    throw new Error('Timestamp is outside the supported date range.');
  const date = new Date(milliseconds);
  return {
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    seconds: Math.floor(milliseconds / 1000),
    milliseconds,
  };
}
export function dateToTimestamp(input: string) {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2})$/i.exec(
      input,
    );
  if (!match)
    throw new Error(
      'Use an ISO date with Z or an explicit offset, for example 2026-01-01T09:00:00+07:00.',
    );
  const [, year, month, day, hour, minute, second = '0'] = match;
  const daysInMonth = new Date(
    Date.UTC(Number(year), Number(month), 0),
  ).getUTCDate();
  if (
    +month < 1 ||
    +month > 12 ||
    +day < 1 ||
    +day > daysInMonth ||
    +hour > 23 ||
    +minute > 59 ||
    +second > 59
  )
    throw new Error('Date or time is invalid.');
  const milliseconds = Date.parse(input);
  if (!Number.isFinite(milliseconds)) throw new Error('Date is invalid.');
  return { seconds: Math.floor(milliseconds / 1000), milliseconds };
}

/** Epoch values with 12 or more digits are treated as milliseconds. */
export function guessUnit(input: string): 'seconds' | 'milliseconds' {
  return input.trim().replace(/^-/, '').length >= 12
    ? 'milliseconds'
    : 'seconds';
}
