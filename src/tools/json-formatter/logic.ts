import { checkSize } from '../../lib/input';
export function formatJson(input: string, indent: number | 'minify' = 2) {
  checkSize(input);
  if (!input.trim()) throw new Error('Paste a JSON value first.');
  return JSON.stringify(
    JSON.parse(input),
    null,
    indent === 'minify' ? 0 : indent,
  );
}
