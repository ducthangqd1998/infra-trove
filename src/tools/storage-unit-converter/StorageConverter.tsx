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

  const presets = [
    { label: '1 GiB', value: '1', unit: 'GiB' },
    { label: '1 GB', value: '1', unit: 'GB' },
    { label: '500 GB', value: '500', unit: 'GB' },
    { label: '1 TB', value: '1', unit: 'TB' },
  ];

  return (
    <ToolReady>
      <div className="tool-bar">
        <div
          className="preset-row"
          role="group"
          aria-label="Quick storage presets"
        >
          <span className="seg-label">Presets</span>
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="preset"
              onClick={() => {
                setInput(preset.value);
                setUnit(preset.unit);
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
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
      <p
        id="storage-status"
        className={result.error ? 'inline-error' : 'sr-only'}
        role="status"
      >
        {result.error || (result.rows.length ? 'Conversions updated.' : '')}
      </p>
      {result.rows.length > 0 ? (
        <dl className="storage-results">
          {result.rows.map(({ unit, name, value }) => {
            const isIEC = ['KiB', 'MiB', 'GiB', 'TiB'].includes(unit);
            const isSI = ['kB', 'MB', 'GB', 'TB'].includes(unit);
            return (
              <div key={unit}>
                <dt>
                  <strong>{unit}</strong>
                  <span>
                    {name}
                    {isIEC && <em className="unit-badge iec">IEC</em>}
                    {isSI && <em className="unit-badge si">SI</em>}
                  </span>
                </dt>
                <dd data-testid={`storage-result-${unit}`}>{value}</dd>
                <CopyIconButton value={value} label={unit} />
              </div>
            );
          })}
        </dl>
      ) : !result.error ? (
        <div className="storage-reference-card">
          <h2>Quick reference guide</h2>
          <div className="storage-ref-grid">
            <div className="storage-ref-col">
              <h3>Decimal (SI) · Multiples of 1,000</h3>
              <ul>
                <li>
                  <strong>1 kB</strong> = 1,000 Bytes (10³)
                </li>
                <li>
                  <strong>1 MB</strong> = 1,000,000 Bytes (10⁶)
                </li>
                <li>
                  <strong>1 GB</strong> = 1,000,000,000 Bytes (10⁹)
                </li>
                <li>
                  <strong>1 TB</strong> = 10¹² Bytes
                </li>
              </ul>
            </div>
            <div className="storage-ref-col">
              <h3>Binary (IEC) · Multiples of 1,024</h3>
              <ul>
                <li>
                  <strong>1 KiB</strong> = 1,024 Bytes (2¹⁰)
                </li>
                <li>
                  <strong>1 MiB</strong> = 1,048,576 Bytes (2²⁰)
                </li>
                <li>
                  <strong>1 GiB</strong> = 1,073,741,824 Bytes (2³⁰)
                </li>
                <li>
                  <strong>1 TiB</strong> = 2⁴⁰ Bytes
                </li>
              </ul>
            </div>
          </div>
          <p className="tool-hint">
            1 GiB is ~7.37% larger than 1 GB. Operating systems such as Windows
            often display GiB while labeling it "GB".
          </p>
        </div>
      ) : null}
      {result.rows.length > 0 && (
        <p className="tool-hint" id="storage-rounding">
          Rounded half up to 9 decimal places. Smaller values show as &lt;.
        </p>
      )}
    </ToolReady>
  );
}
