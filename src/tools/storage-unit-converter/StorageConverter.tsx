import { useMemo, useState } from 'react';
import { Select } from '../../components/tools/Select';
import {
  CopyIconButton,
  ToolReady,
  message,
} from '../../components/tools/Shared';
import { convertStorage, STORAGE_UNITS } from './logic';

export default function StorageConverter() {
  const [input, setInput] = useState('');
  const [unit, setUnit] = useState('GB');
  const result = useMemo(() => {
    if (!input.trim()) return { rows: [], error: '' };
    try {
      return { rows: convertStorage(input, unit), error: '' };
    } catch (error) {
      return { rows: [], error: message(error) };
    }
  }, [input, unit]);
  return (
    <ToolReady>
      <div className="tool-bar">
        <button
          className="text-button"
          onClick={() => {
            setInput('1');
            setUnit('GiB');
          }}
        >
          Load example
        </button>
        <div className="tool-bar-end">
          <button className="text-button" onClick={() => setInput('')}>
            Clear
          </button>
        </div>
      </div>
      <div className="storage-fields">
        <label className="field">
          Amount
          <input
            inputMode="decimal"
            value={input}
            placeholder="e.g. 1.5"
            onChange={(event) => setInput(event.target.value)}
            aria-describedby="storage-status storage-rounding"
            maxLength={60}
          />
        </label>
        <Select
          label="Source unit"
          value={unit}
          onChange={setUnit}
          options={STORAGE_UNITS.map(({ unit, name }) => ({
            value: unit,
            label: `${unit} (${name})`,
          }))}
        />
      </div>
      <p className="tool-hint">SI: 1 GB = 1000 MB. IEC: 1 GiB = 1024 MiB.</p>
      <p
        id="storage-status"
        className={result.error ? 'inline-error' : 'tool-hint'}
        role="status"
      >
        {result.error ||
          (result.rows.length
            ? 'Conversions updated.'
            : 'Enter an amount to see every unit.')}
      </p>
      {result.rows.length > 0 && (
        <dl className="storage-results">
          {result.rows.map(({ unit, name, value }) => (
            <div key={unit}>
              <dt>
                <strong>{unit}</strong>
                <span>{name}</span>
              </dt>
              <dd data-testid={`storage-result-${unit}`}>{value}</dd>
              <CopyIconButton value={value} label={unit} />
            </div>
          ))}
        </dl>
      )}
      <p className="tool-hint" id="storage-rounding">
        Results are rounded to 9 decimal places, half up. Values below the
        displayed precision are marked with &lt;. Whole integers keep their
        precision. No exponent notation.
      </p>
    </ToolReady>
  );
}
