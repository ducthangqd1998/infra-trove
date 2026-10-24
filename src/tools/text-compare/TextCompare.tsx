import { useEffect, useRef, useState } from 'react';
import {
  buildDiffRows,
  compareText,
  inlineDiff,
  type DiffCell,
  type SplitRow,
  type UnifiedRow,
} from './logic';
import {
  CopyButton,
  Editor,
  ErrorMessage,
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
function SplitTable({ rows }: { rows: SplitRow[] }) {
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
      <thead className="sr-only">
        <tr>
          <th>Original line</th>
          <th>Original</th>
          <th>Changed line</th>
          <th>Changed</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const words =
            row.left?.type === 'removed' && row.right?.type === 'added'
              ? inlineDiff(row.left.text, row.right.text)
              : null;
          return (
            <tr key={index}>
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
function UnifiedTable({ rows }: { rows: UnifiedRow[] }) {
  return (
    <table className="diff-table unified">
      <caption className="sr-only">Unified differences</caption>
      <colgroup>
        <col className="ln-col" />
        <col className="ln-col" />
        <col />
      </colgroup>
      <thead className="sr-only">
        <tr>
          <th>Original line</th>
          <th>Changed line</th>
          <th>Text</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <td className="ln">{row.oldN ?? ''}</td>
            <td className="ln">{row.newN ?? ''}</td>
            <Code type={row.type} text={row.text} />
          </tr>
        ))}
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
  const resultRef = useRef<HTMLElement>(null);
  // Narrow screens cannot fit two columns of text; start them in the unified view.
  useEffect(() => {
    if (matchMedia('(max-width: 767px)').matches) setView('unified');
  }, []);
  function clearResult() {
    setResult(null);
    setError('');
  }
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
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({
          block: 'start',
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        }),
      );
    } catch (error) {
      setError(message(error));
      setResult(null);
    }
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
            setOriginal(changed);
            setChanged(original);
            clearResult();
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
              setIgnoreCase(event.target.checked);
              clearResult();
            }}
          />
          Ignore case
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(event) => {
              setIgnoreWhitespace(event.target.checked);
              clearResult();
            }}
          />
          Ignore whitespace
        </label>
        <div className="tool-bar-end">
          <button
            className="text-button"
            onClick={() => {
              setOriginal('Hello world\nVersion: 1\nReady');
              setChanged('Hello InfraTrove\nVersion: 2\nReady');
              clearResult();
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
            }}
          >
            Clear
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
            clearResult();
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
            clearResult();
          }}
        />
      </div>
      <p className="tool-hint">
        Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> in either box to compare.
      </p>
      <ErrorMessage message={error} />
      {result && (
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
              <Segmented
                label="View"
                value={view}
                options={[
                  { value: 'split', label: 'Side by side' },
                  { value: 'unified', label: 'Unified' },
                ]}
                onChange={setView}
              />
              <CopyButton
                value={copyText}
                label="Copy diff"
                className="text-button"
              />
            </div>
          </div>
          <div className="diff-scroll">
            {view === 'split' ? (
              <SplitTable rows={result.split} />
            ) : (
              <UnifiedTable rows={result.unified} />
            )}
          </div>
        </section>
      )}
    </ToolReady>
  );
}
