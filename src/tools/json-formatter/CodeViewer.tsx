import { useId, useMemo, useRef } from 'react';
import type { SupportedLanguage } from './formatters';
import { highlightCode } from './highlighter';

interface CodeViewerProps {
  label: string;
  value: string;
  language: SupportedLanguage;
  meta?: string;
  actions?: React.ReactNode;
  placeholder?: string;
  tall?: boolean;
}

export default function CodeViewer({
  label,
  value,
  language,
  meta,
  actions,
  placeholder = 'Output appears here',
  tall = true,
}: CodeViewerProps) {
  const id = useId();
  const gutter = useRef<HTMLDivElement>(null);
  const codeArea = useRef<HTMLPreElement>(null);

  const lines = useMemo(() => {
    return value ? value.split('\n') : [];
  }, [value]);

  const highlightedHtml = useMemo(() => {
    return highlightCode(value, language);
  }, [value, language]);

  const lineCount = Math.max(1, lines.length);

  return (
    <div className="editor-field code-viewer-field">
      <div className="editor-head">
        <label className="editor-label" htmlFor={id}>
          {label}
        </label>
        {meta && <span className="editor-meta">{meta}</span>}
        {actions && <div className="editor-actions">{actions}</div>}
      </div>

      <div className={`editor-frame readonly${tall ? ' tall' : ''}`}>
        {/* Line numbers gutter */}
        <div className="editor-gutter" ref={gutter} aria-hidden="true">
          {Array.from({ length: lineCount }, (_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </div>

        {/* Syntax highlighted code block */}
        <div className="code-viewer-container">
          {value ? (
            <pre
              ref={codeArea}
              className="code-highlight-pre"
              tabIndex={0}
              onScroll={(e) => {
                if (gutter.current) {
                  gutter.current.scrollTop = e.currentTarget.scrollTop;
                }
              }}
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <div className="code-viewer-placeholder">{placeholder}</div>
          )}

          {/* Accessible textarea for screen-readers and programmatic interaction (e.g. Playwright getByLabel) */}
          <textarea
            id={id}
            readOnly
            value={value}
            tabIndex={-1}
            aria-label={label}
            className="sr-only-accessible-textarea"
          />
        </div>
      </div>
    </div>
  );
}
