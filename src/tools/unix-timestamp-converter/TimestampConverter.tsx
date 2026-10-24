import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { dateToTimestamp, guessUnit, timestampToDate } from './logic';
import {
  CopyIconButton,
  Segmented,
  ToolReady,
  message,
} from '../../components/tools/Shared';
type Unit = 'seconds' | 'milliseconds';
/** Now as an ISO string in the browser's own offset, e.g. 2026-01-01T09:00:00+07:00. */
function localIso(date = new Date()) {
  const offset = -date.getTimezoneOffset();
  const pad = (value: number) =>
    String(Math.floor(Math.abs(value))).padStart(2, '0');
  const wall = new Date(date.getTime() + offset * 60_000)
    .toISOString()
    .slice(0, 19);
  return `${wall}${offset >= 0 ? '+' : '-'}${pad(offset / 60)}:${pad(offset % 60)}`;
}
function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="result-rows">
      {rows.map(([key, value]) => (
        <div key={key}>
          <dt>{key}</dt>
          <dd>{value}</dd>
          <CopyIconButton value={value} label={key} />
        </div>
      ))}
    </dl>
  );
}
function convert<T>(input: string, run: () => T) {
  if (!input.trim()) return { value: null, error: '' };
  try {
    return { value: run(), error: '' };
  } catch (error) {
    return { value: null, error: message(error) };
  }
}
export default function TimestampConverter() {
  const [now, setNow] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [unit, setUnit] = useState<Unit>('seconds');
  const [autoUnit, setAutoUnit] = useState(true);
  const [isoInput, setIsoInput] = useState('');
  useEffect(() => {
    setNow(Math.floor(Date.now() / 1000));
    const timer = setInterval(
      () => setNow(Math.floor(Date.now() / 1000)),
      1000,
    );
    return () => clearInterval(timer);
  }, []);
  const deferredInput = useDeferredValue(input);
  const deferredIso = useDeferredValue(isoInput);
  const toDate = useMemo(
    () => convert(deferredInput, () => timestampToDate(deferredInput, unit)),
    [deferredInput, unit],
  );
  const toTimestamp = useMemo(
    () => convert(deferredIso, () => dateToTimestamp(deferredIso)),
    [deferredIso],
  );
  function setTimestamp(value: string) {
    setInput(value);
    // Pick seconds or milliseconds from the digit count until the user chooses.
    if (autoUnit) setUnit(guessUnit(value));
  }
  return (
    <ToolReady>
      <div className="now-banner">
        <div className="now-text">
          <span className="seg-label">Current Unix time</span>
          <strong className="now-value">{now ?? '…'}</strong>
          <span className="now-sub">seconds since 1970-01-01 00:00 UTC</span>
        </div>
        <div className="now-actions">
          <CopyIconButton
            value={now ? String(now) : ''}
            label="current Unix time"
          />
          <button
            className="text-button"
            onClick={() => {
              setAutoUnit(true);
              setUnit('seconds');
              setInput(String(now ?? Math.floor(Date.now() / 1000)));
            }}
          >
            Use current time
          </button>
        </div>
      </div>
      <div className="conversion-grid">
        <section aria-labelledby="ts-to-date">
          <h2 id="ts-to-date">Timestamp → date</h2>
          <label className="field">
            Unix timestamp
            <input
              value={input}
              onChange={(event) => setTimestamp(event.target.value)}
              placeholder="e.g. 1700000000"
              inputMode="numeric"
              aria-describedby="ts-hint"
            />
          </label>
          <Segmented
            label="Unit"
            value={unit}
            options={[
              { value: 'seconds', label: 'Seconds' },
              { value: 'milliseconds', label: 'Milliseconds' },
            ]}
            onChange={(value) => {
              setUnit(value as Unit);
              setAutoUnit(false);
            }}
          />
          <p id="ts-hint" className="tool-hint">
            {autoUnit
              ? 'Unit is detected from the number of digits.'
              : 'Unit set by you.'}
          </p>
          <div className="result-output" role="status">
            {toDate.value ? (
              <Rows
                rows={[
                  ['ISO 8601', toDate.value.iso],
                  ['UTC', toDate.value.utc],
                  ['Local', toDate.value.local],
                  ['Seconds', String(toDate.value.seconds)],
                  ['Milliseconds', String(toDate.value.milliseconds)],
                ]}
              />
            ) : toDate.error ? (
              <p className="inline-error">{toDate.error}</p>
            ) : (
              <p className="result-empty">Results appear as you type.</p>
            )}
          </div>
        </section>
        <section aria-labelledby="date-to-ts">
          <h2 id="date-to-ts">Date → timestamp</h2>
          <label className="field">
            ISO date with timezone
            <input
              value={isoInput}
              onChange={(event) => setIsoInput(event.target.value)}
              placeholder="e.g. 2026-01-01T09:00:00+07:00"
              aria-describedby="iso-hint"
            />
          </label>
          <div className="field-row">
            <button
              className="text-button"
              onClick={() => setIsoInput(localIso())}
            >
              Use now
            </button>
            <p id="iso-hint" className="tool-hint">
              Include Z for UTC or an offset such as +07:00.
            </p>
          </div>
          <div className="result-output" role="status">
            {toTimestamp.value ? (
              <Rows
                rows={[
                  ['Seconds', String(toTimestamp.value.seconds)],
                  ['Milliseconds', String(toTimestamp.value.milliseconds)],
                ]}
              />
            ) : toTimestamp.error ? (
              <p className="inline-error">{toTimestamp.error}</p>
            ) : (
              <p className="result-empty">Results appear as you type.</p>
            )}
          </div>
        </section>
      </div>
    </ToolReady>
  );
}
