import { useMemo, useState } from 'react';
import { decodeJwt, JWT_EXAMPLE } from './logic';
import {
  CheckIcon,
  CopyButton,
  DownloadButton,
  Editor,
  ToolReady,
  message,
} from '../../components/tools/Shared';

export default function JwtDecoder() {
  const [input, setInput] = useState('');
  const [showToken, setShowToken] = useState(true);

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

  const isExpired =
    result.value &&
    typeof result.value.payload.exp === 'number' &&
    result.value.payload.exp * 1000 < Date.now();

  const tokenInputBlock = (
    <div className="jwt-token-section">
      {showToken ? (
        <div className="jwt-token">
          <Editor
            label="JWT token"
            meta={input ? `${input.length} chars` : undefined}
            value={input}
            onChange={setInput}
            compact
            placeholder="Paste a three-part JWT…"
            describedBy="jwt-status jwt-note"
            actions={
              result.value ? (
                <button
                  type="button"
                  className="text-button small"
                  onClick={() => setShowToken(false)}
                >
                  Collapse token
                </button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="diff-inputs-collapsed">
          <span className="diff-collapsed-summary">
            Token: {input.slice(0, 32)}… ({input.length} chars)
          </span>
          <button
            type="button"
            className="text-button small"
            onClick={() => setShowToken(true)}
          >
            Edit token
          </button>
        </div>
      )}
      <p className="sr-only" id="jwt-note">
        Decoding does not establish trust, authenticate a user or check a
        signature.
      </p>
    </div>
  );

  return (
    <ToolReady>
      <div className="tool-bar">
        <span className="tool-tag">Signature not verified</span>
        <div className="tool-bar-end">
          <button
            className="text-button"
            onClick={() => {
              setInput(JWT_EXAMPLE);
              setShowToken(true);
            }}
          >
            Load example
          </button>
          <button
            className="text-button"
            onClick={() => {
              setInput('');
              setShowToken(true);
            }}
          >
            Clear
          </button>
        </div>
      </div>
      {/* If token is empty or invalid, show the token input at the top */}
      {!result.value && tokenInputBlock}

      {/* When token is valid, prioritize decoded output on top */}
      {result.value && (
        <div
          className={`jwt-status-banner ${isExpired ? 'expired' : 'active'}`}
          role="status"
        >
          <div className="jwt-status-icon" aria-hidden="true">
            {isExpired ? '!' : <CheckIcon />}
          </div>
          <div className="jwt-status-content">
            <div className="jwt-status-header">
              <strong className="jwt-status-title">
                {typeof result.value.payload.exp === 'number'
                  ? isExpired
                    ? 'Token is Expired'
                    : 'Token is Active (valid)'
                  : 'Token Decoded (no expiration set)'}
              </strong>
              <span className="jwt-status-meta">
                Alg: {String(result.value.header.alg || 'none')} · Typ:{' '}
                {String(result.value.header.typ || 'JWT')}
              </span>
            </div>
            {result.value.dates.length > 0 && (
              <div className="jwt-status-dates">
                {result.value.dates.map(({ claim, iso }) => (
                  <span key={claim} className="jwt-date-pill">
                    <strong>{claim}:</strong> {iso}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decoded Output Grid: Payload & Header */}
      <div className="editor-grid">
        <Editor
          label="Decoded payload"
          value={payload}
          readOnly
          lineNumbers
          placeholder="Decoded payload claims appear here"
          actions={
            payload ? (
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
            ) : undefined
          }
        />
        <Editor
          label="Decoded header"
          value={header}
          readOnly
          lineNumbers
          placeholder="Decoded header parameters appear here"
          actions={
            header ? (
              <CopyButton
                value={header}
                label="Copy header"
                className="text-button small"
              />
            ) : undefined
          }
        />
      </div>

      <p
        id="jwt-status"
        className={result.error ? 'inline-error' : 'sr-only'}
        role="status"
      >
        {result.error ||
          (result.value
            ? 'Header and payload decoded. Signature not checked.'
            : '')}
      </p>

      {/* Detailed UTC time claims */}
      {result.value && (
        <section className="jwt-dates" aria-labelledby="jwt-dates-title">
          <div className="jwt-dates-head">
            <h2 id="jwt-dates-title">Time claims in UTC</h2>
            {typeof result.value.payload.exp === 'number' && (
              <span className={`validity ${isExpired ? 'bad' : 'ok'}`}>
                {isExpired
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

      {/* If token is valid, show the token input below the output */}
      {result.value && tokenInputBlock}
    </ToolReady>
  );
}
