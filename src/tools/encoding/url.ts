import { checkSize } from '../../lib/input';
export function transformUrl(input: string, decode: boolean) {
  checkSize(input);
  try {
    return decode ? decodeURIComponent(input) : encodeURIComponent(input);
  } catch {
    throw new Error(
      'Invalid percent encoding or Unicode. Check the input and try again.',
    );
  }
}
