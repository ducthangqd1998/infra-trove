import { useEffect, useRef, useState } from 'react';
import {
  CheckIcon,
  CopyButton,
  DownloadButton,
  Editor,
  Segmented,
  ToolReady,
  message,
} from '../../components/tools/Shared';
import {
  compareChecksum,
  hashBytes,
  hashText,
  validateFileSize,
  type HashAlgorithm,
} from './logic';

export default function HashChecksum() {
  const [mode, setMode] = useState('text');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [expected, setExpected] = useState('');
  const [digest, setDigest] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const generation = useRef(0);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      generation.current++;
    },
    [],
  );

  function invalidate() {
    generation.current++;
    setDigest('');
    setError('');
    setBusy(false);
  }

  async function calculate() {
    const run = ++generation.current;
    setDigest('');
    setError('');
    setBusy(true);
    try {
      let output: string;
      if (mode === 'file') {
        if (!file) throw new Error('Choose a file to calculate its checksum.');
        validateFileSize(file.size);
        output = await hashBytes(await file.arrayBuffer(), algorithm);
      } else output = await hashText(input, algorithm);
      if (run === generation.current) setDigest(output);
    } catch (error) {
      if (run === generation.current) setError(message(error));
    } finally {
      if (run === generation.current) setBusy(false);
    }
  }

  function clear() {
    invalidate();
    setInput('');
    setFile(null);
    setExpected('');
    if (fileInput.current) fileInput.current.value = '';
  }

  const comparison = compareChecksum(digest, expected, algorithm);
  const verdict = {
    empty: '',
    pending: '',
    invalid: `Expected checksum must contain ${algorithm === 'SHA-256' ? 64 : 128} hexadecimal characters.`,
    match: 'Checksums match',
    mismatch: 'Checksums do not match',
  }[comparison];

  const sourceInputBlock = (
    <div className={digest ? 'hash-source-section' : undefined}>
      {digest && (
        <div className="hash-source-header">
          <span className="seg-label">Source input</span>
        </div>
      )}
      {mode === 'text' ? (
        <Editor
          label="Text to hash"
          value={input}
          onChange={(value) => {
            invalidate();
            setInput(value);
          }}
          placeholder="Type text, or leave empty to hash an empty string"
          describedBy="hash-status hash-note"
          compact={!!digest}
        />
      ) : (
        <label className="field hash-file">
          Choose file
          <input
            ref={fileInput}
            type="file"
            aria-describedby="hash-note hash-status"
            onChange={(event) => {
              invalidate();
              const selected = event.target.files?.[0] ?? null;
              if (selected) {
                try {
                  validateFileSize(selected.size);
                  setFile(selected);
                } catch (error) {
                  setFile(null);
                  setError(message(error));
                }
              } else setFile(null);
            }}
          />
        </label>
      )}
      <p className="tool-hint" id="hash-note">
        Text is hashed exactly as entered, whitespace included. Files up to 32
        MiB stay in this tab.
      </p>
    </div>
  );

  const checksumOutputBlock = (
    <>
      <div className="checksum-output">
        <Editor
          label="Computed checksum"
          value={digest}
          readOnly
          compact
          placeholder="Computed hexadecimal checksum appears here"
          actions={
            digest ? (
              <>
                <CopyButton
                  value={digest}
                  label="Copy checksum"
                  className="text-button small"
                />
                <DownloadButton
                  value={digest}
                  filename={`${algorithm.toLowerCase()}.txt`}
                  label="Download"
                  className="text-button small"
                />
              </>
            ) : undefined
          }
        />
      </div>
      <label className="field">
        Expected checksum
        <input
          value={expected}
          onChange={(event) => setExpected(event.target.value)}
          placeholder={`Paste an expected ${algorithm} hex digest`}
          aria-describedby="hash-verdict"
          maxLength={512}
          spellCheck={false}
        />
      </label>
      {digest && comparison === 'match' ? (
        <div className="hash-verdict-banner match" role="status">
          <div className="hash-verdict-icon" aria-hidden="true">
            <CheckIcon />
          </div>
          <div className="hash-verdict-content">
            <strong id="hash-verdict" className="hash-verdict-title">
              Checksums match
            </strong>
            <p className="hash-verdict-desc">
              The computed {algorithm} hash exactly matches the expected
              checksum.
            </p>
          </div>
        </div>
      ) : digest && comparison === 'mismatch' ? (
        <div className="hash-verdict-banner mismatch" role="status">
          <div className="hash-verdict-icon" aria-hidden="true">
            !
          </div>
          <div className="hash-verdict-content">
            <strong id="hash-verdict" className="hash-verdict-title">
              Checksums do not match
            </strong>
            <p className="hash-verdict-desc">
              The computed {algorithm} hash differs from the expected checksum.
            </p>
          </div>
        </div>
      ) : (
        <p
          id="hash-verdict"
          role="status"
          className={comparison === 'invalid' ? 'inline-error' : 'sr-only'}
        >
          {verdict}
        </p>
      )}
    </>
  );

  return (
    <ToolReady>
      <div className="tool-bar">
        <button className="button" disabled={busy} onClick={calculate}>
          Calculate hash
        </button>
        <Segmented
          label="Source"
          value={mode}
          options={[
            { value: 'text', label: 'Text' },
            { value: 'file', label: 'File' },
          ]}
          onChange={(value) => {
            invalidate();
            setMode(value);
            setFile(null);
          }}
        />
        <Segmented
          label="Algorithm"
          value={algorithm}
          options={[
            { value: 'SHA-256', label: 'SHA-256' },
            { value: 'SHA-512', label: 'SHA-512' },
          ]}
          onChange={(value) => {
            invalidate();
            setAlgorithm(value as HashAlgorithm);
          }}
        />
        <div className="tool-bar-end">
          <button className="text-button" onClick={clear}>
            Clear
          </button>
        </div>
      </div>
      <p
        id="hash-status"
        className={error ? 'inline-error' : busy ? 'tool-hint' : 'sr-only'}
        role="status"
      >
        {error ||
          (busy
            ? 'Calculating locally…'
            : digest
              ? `${algorithm} checksum calculated.`
              : '')}
      </p>
      {/* If hash is computed: OUTPUT FIRST on top */}
      {digest && checksumOutputBlock}

      {/* Source input: either at the top if no digest, or below checksum if computed */}
      {sourceInputBlock}

      {/* If no hash computed yet, checksum output sits below the input as placeholder */}
      {!digest && checksumOutputBlock}
    </ToolReady>
  );
}
