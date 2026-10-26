import { useDeferredValue, useMemo, useState } from 'react';
import { formatJson } from './logic';
import {
  CheckIcon,
  CopyButton,
  Editor,
  ErrorMessage,
  Segmented,
  ToolReady,
  message,
  runOnModEnter,
  textStats,
} from '../../components/tools/Shared';
/** Line of a JSON.parse error, from "line N" or a character position. */
function errorLine(text: string, error: string) {
  const line = /line (\d+)/i.exec(error);
  if (line) return Number(line[1]);
  const position = /position (\d+)/i.exec(error);
  return position
    ? text.slice(0, Number(position[1])).split('\n').length
    : undefined;
}
export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState('2');
  const deferred = useDeferredValue(input);
  // Live validity while typing; formatting itself stays an explicit action.
  const check = useMemo(() => {
    if (!deferred.trim()) return null;
    try {
      JSON.parse(deferred);
      return { ok: true as const };
    } catch (error) {
      const text = message(error);
      return { ok: false as const, text, line: errorLine(deferred, text) };
    }
  }, [deferred]);
  function run(minify = false) {
    try {
      setOutput(formatJson(input, minify ? 'minify' : Number(indent)));
      setError('');
    } catch (error) {
      setError(message(error));
      setOutput('');
    }
  }
  function reset(value: string) {
    setInput(value);
    setOutput('');
    setError('');
  }
  return (
    <ToolReady>
      <div className="tool-bar">
        <button
          className="button"
          onClick={() => run()}
          aria-keyshortcuts="Control+Enter Meta+Enter"
        >
          Format JSON
        </button>
        <button className="text-button" onClick={() => run(true)}>
          Minify
        </button>
        <Segmented
          label="Indent"
          value={indent}
          options={[
            { value: '2', label: '2 spaces' },
            { value: '4', label: '4 spaces' },
          ]}
          onChange={(value) => {
            setIndent(value);
            if (output) setOutput('');
          }}
        />
        <div className="tool-bar-end">
          <button
            className="text-button"
            onClick={() =>
              reset(
                '{"project":"InfraTrove","tools":["JSON","Diff"],"free":true}',
              )
            }
          >
            Load example
          </button>
          <button className="text-button" onClick={() => reset('')}>
            Clear
          </button>
        </div>
      </div>
      <ErrorMessage message={error} />
      <div className="editor-grid">
        <Editor
          label="JSON input"
          value={input}
          meta={textStats(input)}
          tall
          lineNumbers
          wrap={false}
          errorLine={check && !check.ok ? check.line : undefined}
          describedBy="tool-error"
          placeholder='{"hello": "world"}'
          onKeyDown={runOnModEnter(() => run())}
          onChange={(value) => {
            setInput(value);
            setOutput('');
            setError('');
          }}
          actions={
            check && (
              <span
                className={`validity ${check.ok ? 'ok' : 'bad'}`}
                role="status"
              >
                {check.ok ? (
                  <>
                    <CheckIcon /> Valid JSON
                  </>
                ) : (
                  `Invalid${check.line ? ` · line ${check.line}` : ''}`
                )}
              </span>
            )
          }
        />
        <Editor
          label="JSON output"
          value={output}
          meta={output ? textStats(output) : undefined}
          readOnly
          tall
          lineNumbers
          wrap={false}
          placeholder="Output appears here"
          actions={<CopyButton value={output} className="text-button small" />}
        />
      </div>
      <p className="tool-hint">
        Strict JSON · Maximum 200,000 characters · <kbd>Ctrl</kbd> +{' '}
        <kbd>Enter</kbd> formats
      </p>
    </ToolReady>
  );
}
