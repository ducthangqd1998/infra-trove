import type { Tool } from '../data/tools';

export type SearchTool = Pick<Tool, 'slug' | 'title' | 'summary' | 'tags'>;

const aliases: Record<string, string[]> = {
  'text-compare': ['diff', 'difference', 'compare text'],
  'unix-timestamp-converter': ['epoch', 'timestamp', 'unix time'],
  'hash-checksum': ['sha256', 'sha512', 'hash', 'checksum'],
  'uuid-generator': ['guid', 'identifier'],
  'json-formatter': ['pretty print', 'prettify', 'validate json'],
  'cron-generator': ['crontab', 'schedule'],
};

const normalize = (value: string) =>
  value.toLowerCase().trim().replace(/\s+/g, ' ');

/** Lower scores rank first; null means that at least one word did not match. */
export function toolSearchScore(
  tool: SearchTool,
  query: string,
): number | null {
  const words = normalize(query);
  if (!words) return 0;
  const title = normalize(tool.title);
  if (title === words) return 0;
  if (title.startsWith(words)) return 1;
  if (title.includes(words)) return 2;
  const keywords = normalize(
    [...tool.tags, ...(aliases[tool.slug] ?? [])].join(' '),
  );
  if (words.split(' ').every((word) => `${title} ${keywords}`.includes(word)))
    return 3;
  const description = `${title} ${keywords} ${normalize(tool.summary)}`;
  return words.split(' ').every((word) => description.includes(word))
    ? 4
    : null;
}

export function searchTools<T extends SearchTool>(
  tools: T[],
  query: string,
): T[] {
  return tools
    .map((tool) => ({ tool, score: toolSearchScore(tool, query) }))
    .filter((item) => item.score !== null)
    .sort(
      (a, b) =>
        a.score! - b.score! || a.tool.title.localeCompare(b.tool.title, 'en'),
    )
    .map(({ tool }) => tool);
}
