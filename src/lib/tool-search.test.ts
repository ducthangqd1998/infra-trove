import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';
import { searchTools } from './tool-search';

describe('tool search', () => {
  it('lists all tools alphabetically before typing', () => {
    const result = searchTools(tools, '  ');
    expect(result).toHaveLength(tools.length);
    expect(result.map((tool) => tool.title)).toEqual(
      tools.map((tool) => tool.title).sort((a, b) => a.localeCompare(b, 'en')),
    );
  });
  it.each([
    ['diff', 'text-compare'],
    ['epoch', 'unix-timestamp-converter'],
    ['sha256', 'hash-checksum'],
    ['guid', 'uuid-generator'],
  ])('finds %s by its alias', (query, slug) => {
    expect(searchTools(tools, query)[0].slug).toBe(slug);
  });
  it('ranks title matches above descriptions and tags', () => {
    expect(searchTools(tools, 'json')[0].slug).toBe('json-formatter');
    expect(searchTools(tools, '  JSON   formatter ')[0].slug).toBe(
      'json-formatter',
    );
  });
  it('matches words in different fields and rejects unrelated queries', () => {
    expect(
      searchTools(tools, 'json kubernetes').map((tool) => tool.slug),
    ).toEqual(['yaml-json-converter']);
    expect(searchTools(tools, '<script>nothing matches</script>')).toEqual([]);
  });
});
