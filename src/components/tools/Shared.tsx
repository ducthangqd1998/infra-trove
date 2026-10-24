import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
export function ToolReady({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <fieldset className="tool-ready" disabled={!ready} aria-busy={!ready}>
      <legend className="sr-only">Interactive tool</legend>
      {children}
    </fieldset>
  );
}
function Svg({ d }: { d: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
export const CopyIcon = () => <Svg d="M9 9h10v11H9V9ZM5 15V4h10" />;
export const CheckIcon = () => <Svg d="m5 12 4 4 10-10" />;
export const SwapIcon = () => (
  <Svg d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
);
export const RefreshIcon = () => (
  <Svg d="M20 11a8 8 0 0 0-14.9-3.9L4 9M4 4v5h5M4 13a8 8 0 0 0 14.9 3.9L20 15M20 20v-5h-5" />
);
async function writeClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}
export function CopyButton({
  value,
  label = 'Copy output',
  className = 'button secondary',
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [status, setStatus] = useState('');
  useEffect(() => setStatus(''), [value]);
  return (
    <div className="copy-group">
      <button
        className={className}
        type="button"
        disabled={!value}
        onClick={async () =>
          setStatus(
            (await writeClipboard(value))
              ? 'Copied'
              : 'Copy failed. Select the output and copy manually.',
          )
        }
      >
        <CopyIcon />
        {label}
      </button>
      <span role="status">{status}</span>
    </div>
  );
}
/** Icon-only copy for one value in a list; the check icon confirms the copy. */
export function CopyIconButton({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <button
      type="button"
      className="icon-button copy-icon"
      aria-label={copied ? `Copied ${label}` : `Copy ${label}`}
      disabled={!value}
      onClick={async () => setCopied(await writeClipboard(value))}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}
export function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <div className="seg-field">
      <span className="seg-label" id={id}>
        {label}
      </span>
      <div className="segmented" role="group" aria-labelledby={id}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
export function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      id="tool-error"
      className={message ? 'error-message' : ''}
      role="alert"
    >
      {message}
    </div>
  );
}
export function textStats(value: string, bytes = false) {
  const lines = value ? value.split('\n').length : 0;
  const parts = [
    `${lines.toLocaleString('en')} ${lines === 1 ? 'line' : 'lines'}`,
    `${value.length.toLocaleString('en')} chars`,
  ];
  if (bytes)
    parts.push(
      `${new TextEncoder().encode(value).length.toLocaleString('en')} bytes`,
    );
  return parts.join(' · ');
}
export function Editor({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder,
  lineNumbers = false,
  wrap = true,
  errorLine,
  actions,
  meta,
  tall = false,
  describedBy,
  onKeyDown,
  onSelect,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  lineNumbers?: boolean;
  wrap?: boolean;
  errorLine?: number;
  actions?: ReactNode;
  meta?: string;
  tall?: boolean;
  describedBy?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSelect?: (event: SyntheticEvent<HTMLTextAreaElement>) => void;
}) {
  const id = useId();
  const gutter = useRef<HTMLDivElement>(null);
  const lines = Math.min(value ? value.split('\n').length : 1, 20_000);
  return (
    <div className="editor-field">
      <div className="editor-head">
        <label className="editor-label" htmlFor={id}>
          {label}
        </label>
        {meta && <span className="editor-meta">{meta}</span>}
        {actions && <div className="editor-actions">{actions}</div>}
      </div>
      <div
        className={`editor-frame${tall ? ' tall' : ''}${readOnly ? ' readonly' : ''}`}
      >
        {lineNumbers && (
          <div className="editor-gutter" ref={gutter} aria-hidden="true">
            {Array.from({ length: lines }, (_, index) => (
              <span
                key={index}
                className={errorLine === index + 1 ? 'is-error' : undefined}
              >
                {index + 1}
              </span>
            ))}
          </div>
        )}
        <textarea
          id={id}
          aria-describedby={describedBy}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          onScroll={(event) => {
            if (gutter.current)
              gutter.current.scrollTop = event.currentTarget.scrollTop;
          }}
          onKeyDown={onKeyDown}
          onSelect={onSelect}
          readOnly={readOnly}
          spellCheck={false}
          wrap={wrap ? 'soft' : 'off'}
          placeholder={placeholder}
          maxLength={400_000}
        />
      </div>
    </div>
  );
}
/** Ctrl+Enter or Cmd+Enter runs the tool's main action from inside an editor. */
export function runOnModEnter(action: () => void) {
  return (event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      action();
    }
  };
}
export function message(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Something went wrong. Check your input.';
}
