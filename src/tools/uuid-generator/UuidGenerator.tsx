import { useEffect, useState } from 'react';
import { generateUuids } from './logic';
import {
  CopyButton,
  CopyIconButton,
  ErrorMessage,
  RefreshIcon,
  ToolReady,
  message,
} from '../../components/tools/Shared';
export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);
  const [error, setError] = useState('');
  function generate(amount = count) {
    try {
      setUuids(generateUuids(amount).split('\n'));
      setError('');
    } catch (error) {
      setError(message(error));
      setUuids([]);
    }
  }
  // One identifier is ready on arrival, generated in the browser after load.
  useEffect(() => generate(1), []);
  const shown = uuids.map((uuid) => {
    const value = hyphens ? uuid : uuid.replaceAll('-', '');
    return uppercase ? value.toUpperCase() : value;
  });
  return (
    <ToolReady>
      <div className="tool-bar">
        <label className="inline-field">
          Number of UUIDs
          <input
            type="number"
            min="1"
            max="100"
            value={Number.isNaN(count) ? '' : count}
            onChange={(event) => setCount(event.target.valueAsNumber)}
          />
        </label>
        <button className="button" onClick={() => generate()}>
          Generate UUIDs <RefreshIcon />
        </button>
        <span className="tool-bar-sep" aria-hidden="true" />
        <label className="check-label">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(event) => setUppercase(event.target.checked)}
          />
          Uppercase
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            checked={hyphens}
            onChange={(event) => setHyphens(event.target.checked)}
          />
          Hyphens
        </label>
        <div className="tool-bar-end">
          <span className="tool-tag">UUID v4 · cryptographically random</span>
        </div>
      </div>
      <ErrorMessage message={error} />
      <ol className="uuid-list" aria-label="Generated identifiers" role="list">
        {shown.map((uuid, index) => (
          <li key={uuids[index]}>
            <span className="uuid-index" aria-hidden="true">
              {index + 1}
            </span>
            <code>{uuid}</code>
            <CopyIconButton value={uuid} label={`UUID ${index + 1}`} />
          </li>
        ))}
      </ol>
      <div className="workspace-actions">
        <span className="tool-hint">
          {shown.length} {shown.length === 1 ? 'identifier' : 'identifiers'}
        </span>
        <CopyButton value={shown.join('\n')} label="Copy all" />
      </div>
    </ToolReady>
  );
}
