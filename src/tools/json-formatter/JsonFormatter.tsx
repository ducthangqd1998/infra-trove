import { useDeferredValue, useMemo, useState } from 'react';
import {
  CheckIcon,
  CopyButton,
  DownloadButton,
  Editor,
  ErrorMessage,
  Segmented,
  ToolReady,
  message,
  runOnModEnter,
  textStats,
} from '../../components/tools/Shared';
import CodeViewer from './CodeViewer';
import {
  EXAMPLES,
  LANGUAGE_LABELS,
  type SupportedLanguage,
  formatCode,
} from './formatters';
import JsonTreeView from './JsonTreeView';

function errorLine(text: string, error: string) {
  const line = /line (\d+)/i.exec(error);
  if (line) return Number(line[1]);
  const position = /position (\d+)/i.exec(error);
  return position
    ? text.slice(0, Number(position[1])).split('\n').length
    : undefined;
}

export default function JsonFormatter() {
  const [language, setLanguage] = useState<SupportedLanguage>('json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState<'2' | '4'>('2');
  const [outputMode, setOutputMode] = useState<'code' | 'tree'>('code');

  const deferred = useDeferredValue(input);

  // Live validity check based on active language
  const check = useMemo(() => {
    if (!deferred.trim()) return null;
    if (language === 'json') {
      try {
        JSON.parse(deferred);
        return { ok: true as const, text: 'Valid JSON' };
      } catch (err) {
        const text = message(err);
        return { ok: false as const, text, line: errorLine(deferred, text) };
      }
    }
    if (language === 'xml') {
      // Basic balanced tag check
      const hasUnclosed = /<([a-zA-Z0-9:-]+)[^>]*>(?!.*?<\/\1>)/s.test(
        deferred,
      );
      return hasUnclosed
        ? { ok: false as const, text: 'Unclosed XML tag' }
        : { ok: true as const, text: 'XML ready' };
    }
    return { ok: true as const, text: `${LANGUAGE_LABELS[language]} ready` };
  }, [deferred, language]);

  function run(minify = false) {
    try {
      setOutput(formatCode(input, language, minify ? 'minify' : indent));
      setError('');
    } catch (err) {
      setError(message(err));
      setOutput('');
    }
  }

  function handleLanguageChange(nextLang: SupportedLanguage) {
    setLanguage(nextLang);
    setError('');
    setOutput('');
    // If input is empty or matches an existing example, switch to the new example
    const isCurrentExample = Object.values(EXAMPLES).includes(input);
    if (!input.trim() || isCurrentExample) {
      setInput(EXAMPLES[nextLang]);
    }
    if (outputMode === 'tree' && nextLang !== 'json') {
      setOutputMode('code');
    }
  }

  function reset(value: string) {
    setInput(value);
    setOutput('');
    setError('');
  }

  const inputLabel = `${LANGUAGE_LABELS[language]} input`;
  const outputLabel = `${LANGUAGE_LABELS[language]} output`;
  const formatButtonText = `Format ${LANGUAGE_LABELS[language]}`;

  const outputActions = (
    <>
      {language === 'json' && (
        <Segmented
          label="View"
          value={outputMode}
          options={[
            { value: 'code', label: 'Code' },
            { value: 'tree', label: 'Tree' },
          ]}
          onChange={(val) => setOutputMode(val as 'code' | 'tree')}
        />
      )}
      <CopyButton value={output} className="text-button small" />
      <DownloadButton
        value={output}
        filename={`formatted.${language}`}
        mimeType={
          language === 'json'
            ? 'application/json'
            : language === 'xml'
              ? 'application/xml'
              : 'text/plain'
        }
        label="Download"
        className="text-button small"
      />
    </>
  );

  return (
    <ToolReady>
      {/* Top language format selector */}
      <div className="tool-bar language-bar">
        <Segmented
          label="Format"
          value={language}
          options={[
            { value: 'json', label: 'JSON' },
            { value: 'xml', label: 'XML' },
            { value: 'yaml', label: 'YAML' },
            { value: 'sql', label: 'SQL' },
            { value: 'html', label: 'HTML' },
          ]}
          onChange={(val) => handleLanguageChange(val as SupportedLanguage)}
        />
        <div className="tool-bar-sep" aria-hidden="true" />
        <button
          className="button"
          onClick={() => run()}
          aria-keyshortcuts="Control+Enter Meta+Enter"
        >
          {formatButtonText}
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
          onChange={(val) => {
            setIndent(val as '2' | '4');
            if (output) setOutput('');
          }}
        />
        <div className="tool-bar-end">
          <button
            className="text-button"
            onClick={() => reset(EXAMPLES[language])}
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
          label={inputLabel}
          value={input}
          meta={textStats(input)}
          tall
          lineNumbers
          wrap={false}
          errorLine={check && !check.ok ? check.line : undefined}
          describedBy="tool-error"
          placeholder={
            language === 'json'
              ? '{"hello": "world"}'
              : language === 'xml'
                ? '<root><item>Hello</item></root>'
                : language === 'yaml'
                  ? 'key: value'
                  : language === 'sql'
                    ? 'SELECT * FROM users;'
                    : '<p>Hello world</p>'
          }
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
                    <CheckIcon /> {check.text}
                  </>
                ) : (
                  `Invalid${check.line ? ` · line ${check.line}` : ''}`
                )}
              </span>
            )
          }
        />

        {outputMode === 'tree' && language === 'json' ? (
          <div className="editor-field">
            <div className="editor-head">
              <span className="editor-label">JSON tree</span>
              <div className="editor-actions">{outputActions}</div>
            </div>
            <div className="editor-frame tall readonly">
              <JsonTreeView json={output || input} />
            </div>
          </div>
        ) : (
          <CodeViewer
            label={outputLabel}
            value={output}
            language={language}
            meta={output ? textStats(output) : undefined}
            tall
            actions={outputActions}
            placeholder="Output appears here"
          />
        )}
      </div>

      <p className="tool-hint">
        <kbd>Ctrl</kbd> + <kbd>Enter</kbd> formats · up to 200,000 characters
      </p>
    </ToolReady>
  );
}
