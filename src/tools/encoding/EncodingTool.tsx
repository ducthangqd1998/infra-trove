import { useDeferredValue, useMemo, useState } from 'react';
import { transformBase64 } from './base64';
import { transformUrl } from './url';
import {
  CopyButton,
  DownloadButton,
  Editor,
  Segmented,
  SwapIcon,
  ToolReady,
  message,
  textStats,
} from '../../components/tools/Shared';
const examples = {
  base64: { encode: 'Hello 👋', decode: 'SGVsbG8g8J+Riw==' },
  url: { encode: 'hello world & tea', decode: 'hello%20world%20%26%20tea' },
};
export default function EncodingTool({ kind }: { kind: 'base64' | 'url' }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [urlSafe, setUrlSafe] = useState(false);
  const deferred = useDeferredValue(input);
  const decode = mode === 'decode';
  // Converts as you type; every step runs in this tab.
  const result = useMemo(() => {
    if (!deferred) return { output: '', error: '' };
    try {
      return {
        output:
          kind === 'base64'
            ? transformBase64(deferred, decode, urlSafe)
            : transformUrl(deferred, decode),
        error: '',
      };
    } catch (error) {
      return { output: '', error: message(error) };
    }
  }, [deferred, decode, urlSafe, kind]);
  const name = kind === 'base64' ? 'Base64' : 'URL component';
  return (
    <ToolReady>
      <div className="tool-bar">
        <Segmented
          label="Mode"
          value={mode}
          options={[
            { value: 'encode', label: 'Encode' },
            { value: 'decode', label: 'Decode' },
          ]}
          onChange={(value) => setMode(value as typeof mode)}
        />
        {kind === 'base64' && (
          <label className="check-label">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(event) => setUrlSafe(event.target.checked)}
            />
            URL-safe variant
          </label>
        )}
        <div className="tool-bar-end">
          <button
            className="text-button"
            onClick={() => setInput(examples[kind][mode])}
          >
            Load example
          </button>
          <button className="text-button" onClick={() => setInput('')}>
            Clear
          </button>
        </div>
      </div>
      <div className="editor-grid with-swap">
        <Editor
          label={decode ? `${name} to decode` : 'Text to encode'}
          value={input}
          meta={textStats(input, true)}
          compact
          placeholder={
            decode ? 'Paste an encoded value…' : 'Type or paste text…'
          }
          describedBy="encoding-error"
          onChange={setInput}
        />
        <button
          type="button"
          className="icon-button swap-button"
          aria-label="Swap direction"
          title="Swap direction"
          disabled={!result.output}
          onClick={() => {
            setInput(result.output);
            setMode(decode ? 'encode' : 'decode');
          }}
        >
          <SwapIcon />
        </button>
        <Editor
          label={decode ? 'Decoded text' : `${name} output`}
          value={result.output}
          meta={result.output ? textStats(result.output, true) : undefined}
          readOnly
          compact
          placeholder="Your result appears here as you type"
          actions={
            <>
              <CopyButton value={result.output} className="text-button small" />
              <DownloadButton
                value={result.output}
                filename={
                  kind === 'base64'
                    ? decode
                      ? 'decoded.txt'
                      : 'encoded.b64'
                    : decode
                      ? 'decoded.txt'
                      : 'encoded.txt'
                }
                label="Download"
                className="text-button small"
              />
            </>
          }
        />
      </div>
      <p
        id="encoding-error"
        className={result.error ? 'inline-error' : 'tool-hint'}
        role="status"
      >
        {result.error ||
          `${decode ? 'Decodes' : 'Encodes'} as you type. Nothing leaves this tab.`}
      </p>
    </ToolReady>
  );
}
