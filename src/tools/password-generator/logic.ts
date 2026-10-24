export type PasswordOptions = {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
};
function randomIndex(length: number) {
  if (!globalThis.crypto?.getRandomValues)
    throw new Error(
      'Web Crypto is unavailable. Open this tool over HTTPS in a modern browser.',
    );
  const limit = 256 - (256 % length);
  const buffer = new Uint8Array(1);
  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);
  return buffer[0] % length;
}
export function characterGroups(options: PasswordOptions) {
  return [
    options.upper && 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    options.lower && 'abcdefghijklmnopqrstuvwxyz',
    options.digits && '0123456789',
    options.symbols && '!@#$%^&*()-_=+[]{}:,.?',
  ]
    .filter((group): group is string => typeof group === 'string')
    .map((group) =>
      options.excludeAmbiguous ? group.replace(/[Il1O0o|]/g, '') : group,
    );
}
/** Entropy of a uniformly random password from the selected alphabet. */
export function passwordStrength(options: PasswordOptions) {
  const size = characterGroups(options).join('').length;
  const bits = size > 1 ? Math.round(options.length * Math.log2(size)) : 0;
  const level = bits < 50 ? 1 : bits < 80 ? 2 : bits < 110 ? 3 : 4;
  return {
    bits,
    level,
    label: ['Weak', 'Fair', 'Strong', 'Very strong'][level - 1],
  };
}
export function generatePassword(options: PasswordOptions) {
  const groups = characterGroups(options);
  if (!groups.length) throw new Error('Select at least one character group.');
  if (
    !Number.isInteger(options.length) ||
    options.length < 8 ||
    options.length > 128
  )
    throw new Error('Choose a length between 8 and 128.');
  const alphabet = groups.join('');
  // Reject whole candidates until all selected groups occur. This preserves uniformity
  // across the valid passwords rather than biasing positions by forced insertion.
  for (let attempt = 0; attempt < 1000; attempt++) {
    const chars = Array.from(
      { length: options.length },
      () => alphabet[randomIndex(alphabet.length)],
    );
    if (groups.every((group) => chars.some((char) => group.includes(char))))
      return chars.join('');
  }
  throw new Error('Could not generate a password. Please try again.');
}
