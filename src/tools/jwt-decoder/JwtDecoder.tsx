import { useMemo, useState } from 'react';
import { decodeJwt, JWT_EXAMPLE } from './logic';
import {
  CopyButton,
  DownloadButton,
  Editor,
  ToolReady,
  message,
} from '../../components/tools/Shared';

export default function JwtDecoder() {
  const [input, setInput] = useState('');
  const result = useMemo(() => {
    if (!input.trim()) return { value: null, error: '' };
    try {
      return { value: decodeJwt(input), error: '' };
    } catch (error) {
      return { value: null, error: message(error) };
    }
  }, [input]);
  const header = result.value
    ? JSON.stringify(result.value.header, null, 2)
    : '';
  const payload = result.value
    ? JSON.stringify(result.value.payload, null, 2)
    : '';
  return (
    <ToolReady>
      <div className="tool-bar">
        <strong className="tool-hint">Signature not verified</strong>
        <div className="tool-bar-end">
          <button className="text-button" onClick={() => setInput(JWT_EXAMPLE)}>
            Load example
          </button>
          <button className="text-button" onClick={() => setInput('')}>
            Clear
          </button>
        </div>
      </div>
      <div className="jwt-token">
        <Editor
          label="JWT token"
          value={input}
          onChange={setInput}
          placeholder="Paste a three-part JWT…"
          describedBy="jwt-status jwt-note"
        />
      </div>
      <p className="tool-hint" id="jwt-note">
        Inspect claims locally. Decoding does not establish trust, authenticate
        a user or check a signature.
      </p>
      <div className="editor-grid">
        <Editor
          label="Decoded header"
          value={header}
          readOnly
          lineNumbers
          actions={
            <CopyButton
              value={header}
              label="Copy header"
              className="text-button small"
            />
          }
        />
        <Editor
          label="Decoded payload"
          value={payload}
          readOnly
          lineNumbers
          actions={
            <>
              <CopyButton
                value={payload}
                label="Copy payload"
                className="text-button small"
              />
              <DownloadButton
                value={payload}
                filename="jwt-payload.json"
                mimeType="application/json"
                label="Download"
                className="text-button small"
              />
            </>
          }
        />
      </div>
      <p
        id="jwt-status"
        className={result.error ? 'inline-error' : 'tool-hint'}
        role="status"
      >
        {result.error ||
          (result.value
            ? 'Header and payload decoded. Signature not checked.'
            : 'Paste a token or load the example to inspect its claims.')}
      </p>
      {result.value && (
        <section className="jwt-dates" aria-labelledby="jwt-dates-title">
          <div className="jwt-dates-head">
            <h2 id="jwt-dates-title">Time claims in UTC</h2>
            {typeof result.value.payload.exp === 'number' && (
              <span
                className={`validity ${result.value.payload.exp * 1000 < Date.now() ? 'bad' : 'ok'}`}
              >
                {result.value.payload.exp * 1000 < Date.now()
                  ? 'Expired (per browser clock)'
                  : 'Active (not expired yet)'}
              </span>
            )}
          </div>
          {result.value.dates.length ? (
            <dl className="result-rows">
              {result.value.dates.map(({ claim, iso }) => (
                <div key={claim}>
                  <dt>{claim}</dt>
                  <dd>{iso}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="tool-hint">No exp, iat or nbf claims are present.</p>
          )}
          <p className="tool-hint">
            These dates come from unverified claims. Your application must check
            the signature, issuer, audience and applicable time claims.
          </p>
        </section>
      )}
    </ToolReady>
  );
}
