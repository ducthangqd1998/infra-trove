import { diffLines, diffWordsWithSpace, type Change } from 'diff';
import { checkSize } from '../../lib/input';
export function compareText(
  original: string,
  changed: string,
  ignoreCase = false,
  ignoreWhitespace = false,
) {
  checkSize(original, 200_000);
  checkSize(changed, 200_000);
  const normalize = (value: string) => {
    let result = value.replace(/\r\n?/g, '\n');
    if (ignoreWhitespace)
      result = result
        .split('\n')
        .map((line) => line.replace(/[\t ]+/g, ' ').trim())
        .join('\n');
    return ignoreCase ? result.toLowerCase() : result;
  };
  const parts = diffLines(normalize(original), normalize(changed), {
    timeout: 2500,
    maxEditLength: 30_000,
  });
  if (!parts) throw new Error('Comparison is too complex. Try smaller inputs.');
  return parts;
}

export type DiffCell = {
  n: number;
  text: string;
  type: 'same' | 'removed' | 'added';
};
export type SplitRow = { left?: DiffCell; right?: DiffCell };
export type UnifiedRow = {
  oldN?: number;
  newN?: number;
  text: string;
  type: DiffCell['type'];
};
const partLines = (value: string) => value.replace(/\n$/, '').split('\n');
const sourceLines = (value: string) =>
  value.replace(/\r\n?/g, '\n').split('\n');

/**
 * Turns line parts into display rows. Text comes from the original inputs, not the
 * normalized copy, so "ignore case" never changes what the user sees.
 */
export function buildDiffRows(
  parts: Change[],
  original: string,
  changed: string,
) {
  const oldLines = sourceLines(original);
  const newLines = sourceLines(changed);
  const split: SplitRow[] = [];
  const unified: UnifiedRow[] = [];
  let o = 0;
  let n = 0;
  let added = 0;
  let removed = 0;
  const cell = (type: DiffCell['type'], index: number, lines: string[]) => ({
    n: index + 1,
    text: lines[index] ?? '',
    type,
  });
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const count = partLines(part.value).length;
    if (part.removed) {
      // A removal followed by an addition is a change: pair the lines row by row.
      const next = parts[i + 1]?.added ? parts[++i] : undefined;
      const addCount = next ? partLines(next.value).length : 0;
      for (let k = 0; k < Math.max(count, addCount); k++)
        split.push({
          left: k < count ? cell('removed', o + k, oldLines) : undefined,
          right: k < addCount ? cell('added', n + k, newLines) : undefined,
        });
      for (let k = 0; k < count; k++)
        unified.push({
          oldN: o + k + 1,
          text: oldLines[o + k] ?? '',
          type: 'removed',
        });
      for (let k = 0; k < addCount; k++)
        unified.push({
          newN: n + k + 1,
          text: newLines[n + k] ?? '',
          type: 'added',
        });
      removed += count;
      added += addCount;
      o += count;
      n += addCount;
    } else if (part.added) {
      for (let k = 0; k < count; k++) {
        split.push({ right: cell('added', n + k, newLines) });
        unified.push({
          newN: n + k + 1,
          text: newLines[n + k] ?? '',
          type: 'added',
        });
      }
      added += count;
      n += count;
    } else {
      for (let k = 0; k < count; k++) {
        split.push({
          left: cell('same', o + k, oldLines),
          right: cell('same', n + k, newLines),
        });
        unified.push({
          oldN: o + k + 1,
          newN: n + k + 1,
          text: oldLines[o + k] ?? '',
          type: 'same',
        });
      }
      o += count;
      n += count;
    }
  }
  return { split, unified, added, removed };
}

/** Word-level changes inside one changed line pair. Long lines skip the extra pass. */
export function inlineDiff(before: string, after: string) {
  if (before.length + after.length > 2000) return null;
  const parts = diffWordsWithSpace(before, after);
  return {
    left: parts
      .filter((part) => !part.added)
      .map((part) => ({ text: part.value, changed: !!part.removed })),
    right: parts
      .filter((part) => !part.removed)
      .map((part) => ({ text: part.value, changed: !!part.added })),
  };
}

export type ChangeHunk = {
  id: number;
  startIdx: number;
  endIdx: number;
  lineCount: number;
};

/**
 * Groups contiguous changed diff rows into a single hunk (change block).
 * This allows jumping between distinct change blocks instead of line-by-line.
 */
export function findChangeHunks(
  rows: (SplitRow | UnifiedRow)[],
  view: 'split' | 'unified',
): ChangeHunk[] {
  const hunks: ChangeHunk[] = [];
  let inHunk = false;
  let startIdx = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const isChange =
      view === 'split'
        ? (row as SplitRow).left?.type === 'removed' ||
          (row as SplitRow).right?.type === 'added'
        : (row as UnifiedRow).type !== 'same';

    if (isChange) {
      if (!inHunk) {
        inHunk = true;
        startIdx = i;
      }
    } else if (inHunk) {
      hunks.push({
        id: hunks.length + 1,
        startIdx,
        endIdx: i - 1,
        lineCount: i - startIdx,
      });
      inHunk = false;
    }
  }

  if (inHunk) {
    hunks.push({
      id: hunks.length + 1,
      startIdx,
      endIdx: rows.length - 1,
      lineCount: rows.length - startIdx,
    });
  }

  return hunks;
}
