import { useState } from 'react';
import {
  CopyIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '../../components/tools/Shared';

interface JsonTreeViewProps {
  json: string;
}

type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function formatPrimitive(value: string | number | boolean | null): {
  text: string;
  className: string;
} {
  if (value === null) return { text: 'null', className: 'json-null' };
  if (typeof value === 'boolean')
    return { text: String(value), className: 'json-bool' };
  if (typeof value === 'number')
    return { text: String(value), className: 'json-num' };
  return { text: JSON.stringify(value), className: 'json-str' };
}

function TreeNode({
  nodeKey,
  value,
  depth,
  expandedState,
  onToggle,
}: {
  nodeKey?: string;
  value: JsonValue;
  depth: number;
  expandedState: Record<string, boolean>;
  onToggle: (path: string) => void;
}) {
  const path = `${depth}-${nodeKey ?? 'root'}`;
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  const isExpanded = expandedState[path] ?? depth < 3;
  const [copied, setCopied] = useState(false);

  const copyVal = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  if (!isObject) {
    const { text, className } = formatPrimitive(value);
    return (
      <div
        className="json-node json-primitive"
        style={{ paddingLeft: `${depth * 1.25}rem` }}
      >
        {nodeKey !== undefined && (
          <span className="json-key">"{nodeKey}": </span>
        )}
        <span className={className}>{text}</span>
      </div>
    );
  }

  const entries = isArray
    ? (value as JsonValue[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, JsonValue>);
  const count = entries.length;
  const countLabel = isArray
    ? `${count} ${count === 1 ? 'item' : 'items'}`
    : `${count} ${count === 1 ? 'key' : 'keys'}`;

  return (
    <div className="json-node-group">
      <div
        className="json-node json-collapsible"
        style={{ paddingLeft: `${depth * 1.25}rem` }}
      >
        <button
          type="button"
          className="json-toggle"
          onClick={() => onToggle(path)}
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${nodeKey ?? 'root'}`}
        >
          {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </button>
        {nodeKey !== undefined && (
          <span className="json-key">"{nodeKey}": </span>
        )}
        <span className="json-bracket">{isArray ? '[' : '{'}</span>
        {!isExpanded && (
          <span className="json-summary" onClick={() => onToggle(path)}>
            {countLabel}
          </span>
        )}
        {!isExpanded && (
          <span className="json-bracket">{isArray ? ']' : '}'}</span>
        )}
        <button
          type="button"
          className="icon-button json-copy-btn"
          aria-label={copied ? 'Copied' : 'Copy branch'}
          title="Copy branch"
          onClick={() => copyVal(JSON.stringify(value, null, 2))}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      {isExpanded && (
        <div className="json-children">
          {entries.map(([childKey, childVal]) => (
            <TreeNode
              key={childKey}
              nodeKey={isArray ? undefined : childKey}
              value={childVal}
              depth={depth + 1}
              expandedState={expandedState}
              onToggle={onToggle}
            />
          ))}
          <div
            className="json-closing"
            style={{ paddingLeft: `${depth * 1.25}rem` }}
          >
            <span className="json-bracket">{isArray ? ']' : '}'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JsonTreeView({ json }: JsonTreeViewProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  let parsed: JsonValue = null;
  let parseError = '';
  try {
    parsed = JSON.parse(json);
  } catch (err) {
    parseError = err instanceof Error ? err.message : 'Invalid JSON';
  }

  const toggle = (path: string) => {
    setExpanded((prev) => ({
      ...prev,
      [path]: !(prev[path] ?? true),
    }));
  };

  const setAll = (state: boolean) => {
    // Clearing overrides will let nodes fall back or we can toggle globally
    const next: Record<string, boolean> = {};
    const traverse = (val: JsonValue, d: number, key?: string) => {
      const p = `${d}-${key ?? 'root'}`;
      next[p] = state;
      if (val !== null && typeof val === 'object') {
        if (Array.isArray(val)) {
          val.forEach((item, idx) => traverse(item, d + 1, String(idx)));
        } else {
          Object.entries(val).forEach(([k, item]) => traverse(item, d + 1, k));
        }
      }
    };
    if (parsed) traverse(parsed, 0);
    setExpanded(next);
  };

  if (parseError || !json.trim()) {
    return (
      <div className="json-tree-empty">
        <p className="tool-hint">
          {parseError
            ? `Cannot render tree: ${parseError}`
            : 'Format or enter valid JSON to view the tree.'}
        </p>
      </div>
    );
  }

  return (
    <div className="json-tree-container">
      <div className="json-tree-toolbar">
        <div className="json-tree-actions">
          <button
            type="button"
            className="text-button small"
            onClick={() => setAll(true)}
          >
            Expand all
          </button>
          <button
            type="button"
            className="text-button small"
            onClick={() => setAll(false)}
          >
            Collapse all
          </button>
        </div>
      </div>
      <div className="json-tree-view" role="tree">
        <TreeNode
          value={parsed}
          depth={0}
          expandedState={expanded}
          onToggle={toggle}
        />
      </div>
    </div>
  );
}
