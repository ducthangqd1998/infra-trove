import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { fieldAt, previewCron } from './logic';
import {
  CopyButton,
  CopyIconButton,
  Segmented,
  ToolReady,
  message,
} from '../../components/tools/Shared';
const presets = [
  ['*/5 * * * *', 'Every 5 minutes'],
  ['0 * * * *', 'Every hour'],
  ['0 0 * * *', 'Every day at midnight'],
  ['0 9 * * 1-5', 'Weekdays at 09:00'],
  ['0 0 1 * *', 'First day of the month'],
];
const fieldNames = ['Minute', 'Hour', 'Day', 'Month', 'Weekday'];
const fieldRanges = ['0–59', '0–23', '1–31', '1–12', '0–6 (Sun–Sat)'];
export default function CronGenerator() {
  const [expression, setExpression] = useState('*/5 * * * *');
  const [zone, setZone] = useState('UTC');
  const [localZone, setLocalZone] = useState('UTC');
  const [field, setField] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setLocalZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setMounted(true);
  }, []);
  const deferred = useDeferredValue(expression);
  // Explains and previews as you type, like crontab.guru. Runs after mount so the
  // server-rendered HTML never carries build-time dates.
  const preview = useMemo(() => {
    if (!mounted) return { result: null, error: '' };
    try {
      return { result: previewCron(deferred, zone), error: '' };
    } catch (error) {
      return { result: null, error: message(error) };
    }
  }, [deferred, zone, mounted]);
  const fields = expression.trim().split(/\s+/);
  const trackCaret = (target: HTMLInputElement) =>
    setField(fieldAt(target.value, target.selectionStart ?? 0));
  return (
    <ToolReady>
      <div className="cron-hero">
        <p className="cron-sentence" role="status">
          {preview.result
            ? `“${preview.result.description}”`
            : mounted
              ? 'Not a valid five-field expression yet'
              : ' '}
        </p>
        <div className="cron-input">
          <label htmlFor="cron-expression-input" className="seg-label">
            Cron expression
          </label>
          <div className="cron-input-box">
            <input
              id="cron-expression-input"
              spellCheck={false}
              maxLength={100}
              value={expression}
              aria-describedby="cron-error"
              aria-invalid={!!preview.error}
              onChange={(event) => {
                setExpression(event.target.value);
                trackCaret(event.target);
              }}
              onSelect={(event) => trackCaret(event.currentTarget)}
              onFocus={(event) => trackCaret(event.currentTarget)}
              onBlur={() => setField(null)}
            />
            <CopyIconButton value={expression.trim()} label="Cron expression" />
          </div>
        </div>
        <dl className="cron-fields">
          {fieldNames.map((name, index) => (
            <div key={name} className={field === index ? 'is-active' : ''}>
              <dt>{name}</dt>
              <dd>{fields[index] || '–'}</dd>
              <dd className="cron-range">{fieldRanges[index]}</dd>
            </div>
          ))}
        </dl>
        <p
          id="cron-error"
          className={preview.error ? 'inline-error' : 'sr-only'}
        >
          {preview.error}
        </p>
      </div>
      <div className="preset-row" role="group" aria-labelledby="cron-presets">
        <span className="seg-label" id="cron-presets">
          Presets
        </span>
        {presets.map(([value, label]) => (
          <button
            key={value}
            type="button"
            className="preset"
            aria-pressed={expression.trim() === value}
            onClick={() => setExpression(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <section className="cron-result" aria-labelledby="cron-runs">
        <div className="result-head">
          <h2 id="cron-runs">Next 5 runs</h2>
          <div className="result-tools">
            {localZone !== 'UTC' && (
              <Segmented
                label="Timezone"
                value={zone}
                options={[
                  { value: 'UTC', label: 'UTC' },
                  { value: localZone, label: localZone },
                ]}
                onChange={setZone}
              />
            )}
            <CopyButton
              value={preview.result ? expression.trim() : ''}
              label="Copy expression"
              className="text-button"
            />
          </div>
        </div>
        {preview.result ? (
          <ol className="run-list" role="list">
            {preview.result.dates.map((date) => (
              <li key={date}>
                <time dateTime={date}>
                  {new Intl.DateTimeFormat('en-GB', {
                    timeZone: zone,
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short',
                  }).format(new Date(date))}
                </time>
              </li>
            ))}
          </ol>
        ) : (
          <p className="result-empty">
            Fix the expression above to see upcoming runs.
          </p>
        )}
      </section>
    </ToolReady>
  );
}
