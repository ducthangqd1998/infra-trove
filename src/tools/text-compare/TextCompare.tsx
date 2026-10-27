import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildDiffRows,
  compareText,
  findChangeHunks,
  inlineDiff,
  type ChangeHunk,
  type DiffCell,
  type SplitRow,
  type UnifiedRow,
} from './logic';
import {
  CopyButton,
  DownloadButton,
  Editor,
  ErrorMessage,
  InfoIcon,
  Segmented,
  SwapIcon,
  ToolReady,
  message,
  runOnModEnter,
  textStats,
} from '../../components/tools/Shared';

type Segment = { text: string; changed: boolean };
const signs = { same: ' ', removed: '−', added: '+' };
const names = { same: '', removed: 'Removed: ', added: 'Added: ' };

function Code({
  type,
  text,
  segments,
}: {
  type: DiffCell['type'];
  text: string;
  segments?: Segment[];
}) {
  return (
    <td className={`code ${type}`}>
      {names[type] && <span className="sr-only">{names[type]}</span>}
      <span className="sign" aria-hidden="true">
        {signs[type]}
      </span>
      {segments
        ? segments.map((segment, index) =>
            segment.changed ? (
              <mark key={index}>{segment.text}</mark>
            ) : (
              <span key={index}>{segment.text}</span>
            ),
          )
        : text || ' '}
    </td>
  );
}

function SplitTable({
  rows,
  original,
  changed,
  removedCount,
  addedCount,
  activeHunk,
  onRowClick,
}: {
  rows: SplitRow[];
  original: string;
  changed: string;
  removedCount: number;
  addedCount: number;
  activeHunk?: ChangeHunk | null;
  onRowClick?: (rowIndex: number) => void;
}) {
  const originalLines = original ? original.split('\n').length : 0;
  const changedLines = changed ? changed.split('\n').length : 0;

  return (
    <table className="diff-table split">
      <caption className="sr-only">
        Side-by-side differences: original on the left, changed on the right
      </caption>
      <colgroup>
        <col className="ln-col" />
        <col />
        <col className="ln-col" />
        <col />
      </colgroup>
      <thead>
        <tr className="diff-thead-row">
          <th colSpan={2} scope="colgroup" className="diff-th removed-th">
            <div className="diff-th-content">
              <div className="diff-col-meta-group">
                <span
                  className="diff-badge removed"
                  aria-label={`${removedCount} removals`}
                >
                  <span className="diff-badge-icon" aria-hidden="true">
                    −
                  </span>
                  <span>
                    {removedCount} {removedCount === 1 ? 'removal' : 'removals'}
                  </span>
                </span>
                <span className="diff-col-lines">
                  {originalLines.toLocaleString('en')}{' '}
                  {originalLines === 1 ? 'line' : 'lines'}
                </span>
              </div>
              <CopyButton
                value={original}
                label="Copy"
                className="text-button small"
              />
            </div>
          </th>
          <th colSpan={2} scope="colgroup" className="diff-th added-th">
            <div className="diff-th-content">
              <div className="diff-col-meta-group">
                <span
                  className="diff-badge added"
                  aria-label={`${addedCount} additions`}
                >
                  <span className="diff-badge-icon" aria-hidden="true">
                    +
                  </span>
                  <span>
                    {addedCount} {addedCount === 1 ? 'addition' : 'additions'}
                  </span>
                </span>
                <span className="diff-col-lines">
                  {changedLines.toLocaleString('en')}{' '}
                  {changedLines === 1 ? 'line' : 'lines'}
                </span>
              </div>
              <CopyButton
                value={changed}
                label="Copy"
                className="text-button small"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const isChange =
            row.left?.type === 'removed' || row.right?.type === 'added';
          const words =
            row.left?.type === 'removed' && row.right?.type === 'added'
              ? inlineDiff(row.left.text, row.right.text)
              : null;
          const isHunkActive =
            activeHunk &&
            index >= activeHunk.startIdx &&
            index <= activeHunk.endIdx;
          const isHunkStart = activeHunk && index === activeHunk.startIdx;
          const isHunkEnd = activeHunk && index === activeHunk.endIdx;
          const rowClasses = [
            isChange ? 'diff-change-row' : '',
            isHunkActive ? 'diff-hunk-active' : '',
            isHunkStart ? 'diff-hunk-start' : '',
            isHunkEnd ? 'diff-hunk-end' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <tr
              key={index}
              id={`diff-row-${index}`}
              className={rowClasses || undefined}
              onClick={() => isChange && onRowClick?.(index)}
            >
              {row.left ? (
                <>
                  <td className="ln">{row.left.n}</td>
                  <Code
                    type={row.left.type}
                    text={row.left.text}
                    segments={words?.left}
                  />
                </>
              ) : (
                <>
                  <td className="ln" />
                  <td className="code empty" />
                </>
              )}
              {row.right ? (
                <>
                  <td className="ln">{row.right.n}</td>
                  <Code
                    type={row.right.type}
                    text={row.right.text}
                    segments={words?.right}
                  />
                </>
              ) : (
                <>
                  <td className="ln" />
                  <td className="code empty" />
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function UnifiedTable({
  rows,
  removedCount,
  addedCount,
  activeHunk,
  onRowClick,
}: {
  rows: UnifiedRow[];
  removedCount: number;
  addedCount: number;
  activeHunk?: ChangeHunk | null;
  onRowClick?: (rowIndex: number) => void;
}) {
  return (
    <table className="diff-table unified">
      <caption className="sr-only">Unified differences</caption>
      <colgroup>
        <col className="ln-col" />
        <col className="ln-col" />
        <col />
      </colgroup>
      <thead>
        <tr className="diff-thead-row">
          <th colSpan={3} scope="colgroup" className="diff-th unified-th">
            <div className="diff-th-content">
              <div className="diff-col-meta-group">
                <span className="diff-badge removed">
                  <span className="diff-badge-icon" aria-hidden="true">
                    −
                  </span>
                  <span>
                    {removedCount} {removedCount === 1 ? 'removal' : 'removals'}
                  </span>
                </span>
                <span className="diff-badge added">
                  <span className="diff-badge-icon" aria-hidden="true">
                    +
                  </span>
                  <span>
                    {addedCount} {addedCount === 1 ? 'addition' : 'additions'}
                  </span>
                </span>
                <span className="diff-col-lines">
                  {rows.length.toLocaleString('en')} rows
                </span>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const isChange = row.type !== 'same';
          const isHunkActive =
            activeHunk &&
            index >= activeHunk.startIdx &&
            index <= activeHunk.endIdx;
          const isHunkStart = activeHunk && index === activeHunk.startIdx;
          const isHunkEnd = activeHunk && index === activeHunk.endIdx;
          const rowClasses = [
            isChange ? 'diff-change-row' : '',
            isHunkActive ? 'diff-hunk-active' : '',
            isHunkStart ? 'diff-hunk-start' : '',
            isHunkEnd ? 'diff-hunk-end' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <tr
              key={index}
              id={`diff-row-${index}`}
              className={rowClasses || undefined}
              onClick={() => isChange && onRowClick?.(index)}
            >
              <td className="ln">{row.oldN ?? ''}</td>
              <td className="ln">{row.newN ?? ''}</td>
              <Code type={row.type} text={row.text} />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function TextCompare() {
  const [original, setOriginal] = useState('');
  const [changed, setChanged] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof buildDiffRows> | null>(
    null,
  );
  const [error, setError] = useState('');
  const [view, setView] = useState('split');
  const [showInputs, setShowInputs] = useState(false);
  const [activeHunkIdx, setActiveHunkIdx] = useState(0);
  const resultRef = useRef<HTMLElement>(null);
  const inputsRef = useRef<HTMLDivElement>(null);
  const diffScrollRef = useRef<HTMLDivElement>(null);

  // Narrow screens cannot fit two columns of text; start them in the unified view.
  useEffect(() => {
    if (matchMedia('(max-width: 767px)').matches) setView('unified');
  }, []);

  function clearResult() {
    setResult(null);
    setError('');
  }

  const hunks = useMemo(() => {
    if (!result) return [];
    const rows = view === 'split' ? result.split : result.unified;
    return findChangeHunks(rows, view as 'split' | 'unified');
  }, [result, view]);

  const activeHunk = hunks[activeHunkIdx] ?? null;

  function scrollToHunk(hunk: ChangeHunk) {
    const rowEl = document.getElementById(`diff-row-${hunk.startIdx}`);
    const container = diffScrollRef.current;
    if (!rowEl || !container) return;
    const rowRect = rowEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const relativeTop = rowRect.top - containerRect.top + container.scrollTop;
    const targetScrollTop = Math.max(
      0,
      relativeTop - Math.max(40, container.clientHeight * 0.25),
    );
    container.scrollTo({
      top: targetScrollTop,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  }

  function jumpHunk(direction: 1 | -1) {
    if (hunks.length === 0) return;
    const next = (activeHunkIdx + direction + hunks.length) % hunks.length;
    setActiveHunkIdx(next);
    scrollToHunk(hunks[next]);
  }

  function handleRowClick(rowIndex: number) {
    const foundIdx = hunks.findIndex(
      (h) => rowIndex >= h.startIdx && rowIndex <= h.endIdx,
    );
    if (foundIdx !== -1 && foundIdx !== activeHunkIdx) {
      setActiveHunkIdx(foundIdx);
    }
  }

  // Keyboard shortcut navigation (F7 for next, Shift+F7 for previous difference hunk)
  useEffect(() => {
    if (hunks.length === 0) return;
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'F7') {
        e.preventDefault();
        if (e.shiftKey) {
          jumpHunk(-1);
        } else {
          jumpHunk(1);
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hunks, activeHunkIdx]);

  function compare() {
    try {
      setResult(
        buildDiffRows(
          compareText(original, changed, ignoreCase, ignoreWhitespace),
          original,
          changed,
        ),
      );
      setError('');
      setActiveHunkIdx(0);
      setShowInputs(false);
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({
          block: 'start',
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        }),
      );
    } catch (err) {
      setError(message(err));
      setResult(null);
      setShowInputs(true);
    }
  }

  function toggleInputs() {
    setShowInputs((prev) => {
      const next = !prev;
      if (next) {
        requestAnimationFrame(() =>
          inputsRef.current?.scrollIntoView({
            block: 'start',
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'auto'
              : 'smooth',
          }),
        );
      }
      return next;
    });
  }

  const copyText =
    result?.unified
      .map((row) => `${signs[row.type].replace('−', '-')}${row.text}`)
      .join('\n') || '';

  return (
    <ToolReady>
      <div className="tool-bar">
        <button
          className="button"
          onClick={compare}
          aria-keyshortcuts="Control+Enter Meta+Enter"
        >
          Compare text
        </button>
        <button
          className="text-button"
          onClick={() => {
            const nextOrig = changed;
            const nextChanged = original;
            setOriginal(nextOrig);
            setChanged(nextChanged);
            if (result) {
              try {
                setResult(
                  buildDiffRows(
                    compareText(
                      nextOrig,
                      nextChanged,
                      ignoreCase,
                      ignoreWhitespace,
                    ),
                    nextOrig,
                    nextChanged,
                  ),
                );
                setError('');
              } catch (err) {
                setError(message(err));
                setResult(null);
              }
            }
          }}
        >
          <SwapIcon /> Swap inputs
        </button>
        <span className="tool-bar-sep" aria-hidden="true" />
        <label className="check-label">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(event) => {
              const next = event.target.checked;
              setIgnoreCase(next);
              if (result) {
                try {
                  setResult(
                    buildDiffRows(
                      compareText(original, changed, next, ignoreWhitespace),
                      original,
                      changed,
                    ),
                  );
                  setError('');
                } catch (err) {
                  setError(message(err));
                  setResult(null);
                }
              }
            }}
          />
          Ignore case
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(event) => {
              const next = event.target.checked;
              setIgnoreWhitespace(next);
              if (result) {
                try {
                  setResult(
                    buildDiffRows(
                      compareText(original, changed, ignoreCase, next),
                      original,
                      changed,
                    ),
                  );
                  setError('');
                } catch (err) {
                  setError(message(err));
                  setResult(null);
                }
              }
            }}
          />
          Ignore whitespace
        </label>
        <div className="tool-bar-end">
          <button
            className="text-button"
            onClick={() => {
              const exOrig = 'Hello world\nVersion: 1\nReady';
              const exChanged = 'Hello InfraTrove\nVersion: 2\nReady';
              setOriginal(exOrig);
              setChanged(exChanged);
              try {
                setResult(
                  buildDiffRows(
                    compareText(
                      exOrig,
                      exChanged,
                      ignoreCase,
                      ignoreWhitespace,
                    ),
                    exOrig,
                    exChanged,
                  ),
                );
                setError('');
                setShowInputs(false);
              } catch (err) {
                setError(message(err));
                setResult(null);
              }
            }}
          >
            Load example
          </button>
          <button
            className="text-button"
            onClick={() => {
              setOriginal('');
              setChanged('');
              clearResult();
              setShowInputs(true);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <ErrorMessage message={error} />

      {/* Compare Result Section is placed BEFORE inputs */}
      {result && (
        <>
          {result.added === 0 && result.removed === 0 && (
            <div className="diff-identical-banner" role="status">
              <div className="diff-identical-icon" aria-hidden="true">
                <InfoIcon />
              </div>
              <div>
                <strong className="diff-identical-title">
                  The two texts are identical
                </strong>
                <p className="diff-identical-desc">
                  There is no difference to show between these two texts.
                </p>
              </div>
            </div>
          )}

          <section
            className="diff-result"
            ref={resultRef}
            aria-labelledby="diff-title"
          >
            <div className="diff-head">
              <h2 id="diff-title">Differences</h2>
              <p className="diff-summary" role="status">
                {result.added || result.removed ? (
                  <>
                    <span className="count removed">
                      {result.removed} lines removed
                    </span>
                    <span className="count added">
                      {result.added} lines added
                    </span>
                  </>
                ) : (
                  <span className="count same">No differences found.</span>
                )}
              </p>
              <div className="diff-tools">
                <div
                  className="diff-tools-group"
                  role="toolbar"
                  aria-label="Difference view and navigation"
                >
                  {hunks.length > 0 && (
                    <div
                      className="diff-nav"
                      aria-label="Difference navigation"
                    >
                      <button
                        type="button"
                        className="diff-nav-btn"
                        onClick={() => jumpHunk(-1)}
                        disabled={hunks.length <= 1}
                        title="Previous difference (Shift+F7)"
                        aria-label="Previous difference"
                      >
                        <span aria-hidden="true">↑</span> Prev
                      </button>
                      <span
                        className="diff-nav-count"
                        aria-live="polite"
                        title={`Difference ${activeHunkIdx + 1} of ${hunks.length}`}
                      >
                        {activeHunkIdx + 1} / {hunks.length}
                      </span>
                      <button
                        type="button"
                        className="diff-nav-btn"
                        onClick={() => jumpHunk(1)}
                        disabled={hunks.length <= 1}
                        title="Next difference (F7)"
                        aria-label="Next difference"
                      >
                        Next <span aria-hidden="true">↓</span>
                      </button>
                    </div>
                  )}
                  <Segmented
                    label="View mode"
                    hideLabel
                    value={view}
                    options={[
                      { value: 'split', label: 'Side by side' },
                      { value: 'unified', label: 'Unified' },
                    ]}
                    onChange={(nextView) => {
                      setView(nextView);
                      setActiveHunkIdx(0);
                    }}
                  />
                </div>

                <div className="diff-tools-sep" aria-hidden="true" />

                <div
                  className="diff-tools-group actions"
                  aria-label="Diff actions"
                >
                  <CopyButton
                    value={copyText}
                    label="Copy"
                    className="text-button small"
                  />
                  <DownloadButton
                    value={copyText}
                    filename="diff.patch"
                    label="Download"
                    className="text-button small"
                  />
                </div>

                <div className="diff-tools-sep" aria-hidden="true" />

                <button
                  type="button"
                  className="text-button small diff-edit-toggle"
                  onClick={toggleInputs}
                >
                  {showInputs ? 'Hide inputs' : 'Edit inputs'}
                </button>
              </div>
            </div>
            <div className="diff-scroll" ref={diffScrollRef}>
              {view === 'split' ? (
                <SplitTable
                  rows={result.split}
                  original={original}
                  changed={changed}
                  removedCount={result.removed}
                  addedCount={result.added}
                  activeHunk={activeHunk}
                  onRowClick={handleRowClick}
                />
              ) : (
                <UnifiedTable
                  rows={result.unified}
                  removedCount={result.removed}
                  addedCount={result.added}
                  activeHunk={activeHunk}
                  onRowClick={handleRowClick}
                />
              )}
            </div>
          </section>
        </>
      )}

      {/* Inputs Section */}
      {!result ? (
        <>
          <div className="editor-grid">
            <Editor
              label="Original"
              value={original}
              meta={textStats(original)}
              tall
              lineNumbers
              wrap={false}
              placeholder="Paste the original text"
              onKeyDown={runOnModEnter(compare)}
              onChange={(value) => {
                setOriginal(value);
                setError('');
              }}
            />
            <Editor
              label="Changed"
              value={changed}
              meta={textStats(changed)}
              tall
              lineNumbers
              wrap={false}
              placeholder="Paste the changed text"
              onKeyDown={runOnModEnter(compare)}
              onChange={(value) => {
                setChanged(value);
                setError('');
              }}
            />
          </div>
          <p className="tool-hint">
            Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> in either box to compare.
          </p>
        </>
      ) : (
        <div className="diff-inputs-container" ref={inputsRef}>
          {!showInputs ? (
            <div className="diff-inputs-collapsed">
              <span className="diff-collapsed-summary">
                Original: {textStats(original)} · Changed: {textStats(changed)}
              </span>
              <button
                type="button"
                className="text-button small"
                onClick={toggleInputs}
              >
                Edit inputs
              </button>
            </div>
          ) : (
            <div className="diff-inputs-expanded">
              <div className="diff-inputs-expanded-head">
                <span className="diff-collapsed-summary">
                  Original: {textStats(original)} · Changed:{' '}
                  {textStats(changed)}
                </span>
                <div className="diff-inputs-actions">
                  <button
                    type="button"
                    className="button small"
                    onClick={compare}
                  >
                    Re-compare
                  </button>
                  <button
                    type="button"
                    className="text-button small"
                    onClick={() => setShowInputs(false)}
                  >
                    Hide inputs
                  </button>
                </div>
              </div>
              <div className="editor-grid">
                <Editor
                  label="Original"
                  value={original}
                  meta={textStats(original)}
                  tall
                  lineNumbers
                  wrap={false}
                  placeholder="Paste the original text"
                  onKeyDown={runOnModEnter(compare)}
                  onChange={(value) => {
                    setOriginal(value);
                    setError('');
                  }}
                />
                <Editor
                  label="Changed"
                  value={changed}
                  meta={textStats(changed)}
                  tall
                  lineNumbers
                  wrap={false}
                  placeholder="Paste the changed text"
                  onKeyDown={runOnModEnter(compare)}
                  onChange={(value) => {
                    setChanged(value);
                    setError('');
                  }}
                />
              </div>
              <p className="tool-hint">
                Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> in either box to
                re-compare.
              </p>
            </div>
          )}
        </div>
      )}
    </ToolReady>
  );
}
