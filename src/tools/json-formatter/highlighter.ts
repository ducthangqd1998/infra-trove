import type { SupportedLanguage } from './formatters';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Highlight JSON tokens: keys, strings, numbers, booleans, null, punctuation */
function highlightJson(json: string): string {
  const jsonRegex =
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}[\],:])/g;

  let result = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = jsonRegex.exec(json)) !== null) {
    const textBefore = json.slice(lastIndex, match.index);
    if (textBefore) result += escapeHtml(textBefore);

    const token = match[0];
    if (token.startsWith('"')) {
      if (token.endsWith(':')) {
        const colonIndex = token.lastIndexOf(':');
        const keyPart = token.slice(0, colonIndex).trimEnd();
        const spaceColon = token.slice(keyPart.length);
        result += `<span class="token-key">${escapeHtml(keyPart)}</span><span class="token-punct">${escapeHtml(spaceColon)}</span>`;
      } else {
        result += `<span class="token-string">${escapeHtml(token)}</span>`;
      }
    } else if (token === 'true' || token === 'false') {
      result += `<span class="token-boolean">${token}</span>`;
    } else if (token === 'null') {
      result += `<span class="token-null">${token}</span>`;
    } else if (/^-?\d/.test(token)) {
      result += `<span class="token-number">${token}</span>`;
    } else {
      result += `<span class="token-punct">${escapeHtml(token)}</span>`;
    }

    lastIndex = match.index + token.length;
  }

  const remainder = json.slice(lastIndex);
  if (remainder) result += escapeHtml(remainder);

  return result;
}

/** Highlight XML/HTML tags, attributes, comments */
function highlightXmlHtml(markup: string): string {
  const tagRegex =
    /(<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[a-zA-Z0-9:-]+(?:\s+[^>]*)?\/?>)/gi;

  let result = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(markup)) !== null) {
    const textBefore = markup.slice(lastIndex, match.index);
    if (textBefore) result += escapeHtml(textBefore);

    const token = match[0];
    if (token.startsWith('<!--') || token.startsWith('<!DOCTYPE')) {
      result += `<span class="token-comment">${escapeHtml(token)}</span>`;
    } else {
      // Parse tag contents: <tag attr="val">
      const isClosing = token.startsWith('</');
      const isSelfClosing = token.endsWith('/>');
      const tagContent = token.slice(
        isClosing ? 2 : 1,
        isSelfClosing ? token.length - 2 : token.length - 1,
      );

      const parts = tagContent.match(
        /^[a-zA-Z0-9:-]+|([a-zA-Z0-9:-]+)(?:=(?:"[^"]*"|'[^']*'|[^\s"'>]+))?|\s+/g,
      );
      if (!parts) {
        result += `<span class="token-punct">&lt;</span>${escapeHtml(tagContent)}<span class="token-punct">&gt;</span>`;
      } else {
        let tagHtml = isClosing ? '&lt;/' : '&lt;';
        tagHtml = `<span class="token-punct">${tagHtml}</span>`;

        // First part is tagName
        tagHtml += `<span class="token-tag">${escapeHtml(parts[0])}</span>`;

        for (let i = 1; i < parts.length; i++) {
          const part = parts[i];
          if (/^\s+$/.test(part)) {
            tagHtml += part;
          } else if (part.includes('=')) {
            const eqIndex = part.indexOf('=');
            const attrName = part.slice(0, eqIndex);
            const attrVal = part.slice(eqIndex + 1);
            tagHtml += `<span class="token-attr">${escapeHtml(attrName)}</span><span class="token-punct">=</span><span class="token-string">${escapeHtml(attrVal)}</span>`;
          } else {
            tagHtml += `<span class="token-attr">${escapeHtml(part)}</span>`;
          }
        }

        tagHtml += `<span class="token-punct">${isSelfClosing ? '/&gt;' : '&gt;'}</span>`;
        result += tagHtml;
      }
    }

    lastIndex = match.index + token.length;
  }

  const remainder = markup.slice(lastIndex);
  if (remainder) result += escapeHtml(remainder);

  return result;
}

/** Highlight YAML keys, strings, booleans, comments */
function highlightYaml(yaml: string): string {
  const lines = yaml.split('\n');
  const highlightedLines = lines.map((line) => {
    // Check comment
    const commentIndex = line.indexOf('#');
    let content = line;
    let comment = '';
    if (commentIndex !== -1) {
      content = line.slice(0, commentIndex);
      comment = line.slice(commentIndex);
    }

    // Match key: value
    const keyMatch = /^(\s*)(-\s+)?([a-zA-Z0-9_-]+):(\s*)(.*)$/.exec(content);
    if (keyMatch) {
      const [, leading, bullet, key, midSpace, value] = keyMatch;
      let valHtml = escapeHtml(value);
      if (/^(true|false|yes|no)$/i.test(value.trim())) {
        valHtml = `<span class="token-boolean">${escapeHtml(value)}</span>`;
      } else if (/^-?\d+(\.\d+)?$/.test(value.trim())) {
        valHtml = `<span class="token-number">${escapeHtml(value)}</span>`;
      } else if (value.trim().startsWith('"') || value.trim().startsWith("'")) {
        valHtml = `<span class="token-string">${escapeHtml(value)}</span>`;
      } else if (/^(null|~)$/i.test(value.trim())) {
        valHtml = `<span class="token-null">${escapeHtml(value)}</span>`;
      }

      content = `${escapeHtml(leading)}${bullet ? `<span class="token-punct">${escapeHtml(bullet)}</span>` : ''}<span class="token-key">${escapeHtml(key)}</span><span class="token-punct">:</span>${midSpace}${valHtml}`;
    } else {
      content = escapeHtml(content);
    }

    if (comment) {
      content += `<span class="token-comment">${escapeHtml(comment)}</span>`;
    }

    return content;
  });

  return highlightedLines.join('\n');
}

const SQL_KEYWORDS_REGEX = new RegExp(
  `\\b(SELECT|FROM|WHERE|AND|OR|JOIN|LEFT|RIGHT|INNER|FULL|CROSS|ON|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|INDEX|AS|IN|IS|NOT|NULL|LIKE|BETWEEN|EXISTS|CASE|WHEN|THEN|ELSE|END|ASC|DESC)\\b`,
  'gi',
);

/** Highlight SQL keywords, strings, numbers, comments */
function highlightSql(sql: string): string {
  const tokenRegex =
    /(--[^\n]*|\/\*[\s\S]*?\*\/|'[^']*'|\b\d+(?:\.\d+)?\b|[(),;=<>*+-])/g;

  let result = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(sql)) !== null) {
    const textBefore = sql.slice(lastIndex, match.index);
    if (textBefore) {
      result += textBefore.replace(
        SQL_KEYWORDS_REGEX,
        '<span class="token-keyword">$1</span>',
      );
    }

    const token = match[0];
    if (token.startsWith('--') || token.startsWith('/*')) {
      result += `<span class="token-comment">${escapeHtml(token)}</span>`;
    } else if (token.startsWith("'")) {
      result += `<span class="token-string">${escapeHtml(token)}</span>`;
    } else if (/^\d/.test(token)) {
      result += `<span class="token-number">${escapeHtml(token)}</span>`;
    } else {
      result += `<span class="token-punct">${escapeHtml(token)}</span>`;
    }

    lastIndex = match.index + token.length;
  }

  const remainder = sql.slice(lastIndex);
  if (remainder) {
    result += remainder.replace(
      SQL_KEYWORDS_REGEX,
      '<span class="token-keyword">$1</span>',
    );
  }

  return result;
}

/** Unified syntax highlighter returning safe HTML markup */
export function highlightCode(
  code: string,
  language: SupportedLanguage,
): string {
  if (!code) return '';
  switch (language) {
    case 'json':
      return highlightJson(code);
    case 'xml':
    case 'html':
      return highlightXmlHtml(code);
    case 'yaml':
      return highlightYaml(code);
    case 'sql':
      return highlightSql(code);
  }
}
