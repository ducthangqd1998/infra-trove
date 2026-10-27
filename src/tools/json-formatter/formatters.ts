import { parseDocument, stringify } from 'yaml';
import { checkSize } from '../../lib/input';

export type SupportedLanguage = 'json' | 'xml' | 'yaml' | 'sql' | 'html';
export type IndentOption = '2' | '4' | 'minify';

export interface FormatResult {
  output: string;
  error?: string;
  errorLine?: number;
}

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  json: 'JSON',
  xml: 'XML',
  yaml: 'YAML',
  sql: 'SQL',
  html: 'HTML',
};

export const EXAMPLES: Record<SupportedLanguage, string> = {
  json: '{"project":"InfraTrove","tools":["JSON","XML","YAML","SQL","HTML"],"free":true,"version":1}',
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<project name="InfraTrove">
  <version>1.0.0</version>
  <features>
    <feature id="1" active="true">Syntax Highlighting</feature>
    <feature id="2" active="true">Multi-language Format</feature>
  </features>
  <metadata author="InfraTrove" license="MIT" />
</project>`,
  yaml: `project: InfraTrove
version: 1.0.0
tools:
  - JSON
  - XML
  - YAML
  - SQL
  - HTML
settings:
  free: true
  open_source: true
  client_side_only: true`,
  sql: `SELECT u.id, u.username, count(t.id) as tool_count, max(t.used_at) as last_used
FROM users u
LEFT JOIN user_tools t ON u.id = t.user_id
WHERE u.active = 1 AND (u.role = 'admin' OR u.tier = 'pro')
GROUP BY u.id, u.username
HAVING count(t.id) > 5
ORDER BY tool_count DESC, last_used DESC
LIMIT 25;`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>InfraTrove Tools</title>
</head>
<body>
  <header>
    <h1>InfraTrove</h1>
    <p>Privacy-focused developer utilities.</p>
  </header>
  <main>
    <section class="card">
      <h2>JSON &amp; Code Formatter</h2>
      <button type="button" class="btn">Format Now</button>
    </section>
  </main>
</body>
</html>`,
};

/** Format JSON with 2 spaces, 4 spaces, or minify */
export function formatJson(
  input: string,
  indent: number | 'minify' = 2,
): string {
  checkSize(input);
  if (!input.trim()) throw new Error('Paste a JSON value first.');
  return JSON.stringify(
    JSON.parse(input),
    null,
    indent === 'minify' ? 0 : indent,
  );
}

/** Format XML with clean indentation or minify */
export function formatXml(
  input: string,
  indentOption: IndentOption = '2',
): string {
  checkSize(input);
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Paste an XML document first.');

  if (indentOption === 'minify') {
    return trimmed
      .replace(/>\s+</g, '><')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();
  }

  const indentStr = indentOption === '4' ? '    ' : '  ';
  let formatted = '';
  let indent = 0;

  // Normalize XML tags into distinct tokens while preserving CDATA and comments
  const rawTokens = trimmed
    .replace(/>\s*</g, '>\n<')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i];

    // Closing tag: </tag>
    if (token.startsWith('</')) {
      indent = Math.max(0, indent - 1);
      formatted += indentStr.repeat(indent) + token + '\n';
    }
    // Opening tag with inline closing: <tag>content</tag>
    else if (/<([^\s>/]+)[^>]*>.*<\/\1>/.test(token)) {
      formatted += indentStr.repeat(indent) + token + '\n';
    }
    // Self-closing tag, processing instruction, or comment: <tag/>, <?xml ... ?>, <!-- ... -->
    else if (
      token.startsWith('<?') ||
      token.startsWith('<!') ||
      token.endsWith('/>')
    ) {
      formatted += indentStr.repeat(indent) + token + '\n';
    }
    // Opening tag: <tag ...>
    else if (token.startsWith('<')) {
      formatted += indentStr.repeat(indent) + token + '\n';
      indent++;
    }
    // Pure text node
    else {
      formatted += indentStr.repeat(indent) + token + '\n';
    }
  }

  return formatted.trimEnd();
}

/** Format YAML using the standard yaml package */
export function formatYaml(
  input: string,
  indentOption: IndentOption = '2',
): string {
  checkSize(input);
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Paste a YAML document first.');

  const doc = parseDocument(trimmed, { version: '1.2', schema: 'core' });
  if (doc.errors.length) {
    throw new Error(doc.errors[0].message);
  }
  const indentNum = indentOption === '4' ? 4 : 2;
  return stringify(doc.toJS(), { indent: indentNum, lineWidth: 0 }).trimEnd();
}

const SQL_KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'AND',
  'OR',
  'JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'INNER JOIN',
  'FULL JOIN',
  'CROSS JOIN',
  'ON',
  'GROUP BY',
  'ORDER BY',
  'HAVING',
  'LIMIT',
  'OFFSET',
  'UNION',
  'UNION ALL',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE FROM',
  'CREATE TABLE',
  'ALTER TABLE',
  'DROP TABLE',
  'CREATE INDEX',
  'AS',
  'IN',
  'IS',
  'NOT',
  'NULL',
  'LIKE',
  'BETWEEN',
  'EXISTS',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'ASC',
  'DESC',
  'DISTINCT',
  'ALL',
];

const MAJOR_CLAUSES = [
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  'JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'INNER JOIN',
  'FULL JOIN',
  'CROSS JOIN',
  'SET',
  'VALUES',
  'UNION',
  'UNION ALL',
];

/** Format SQL with keyword capitalization and clean indentation */
export function formatSql(
  input: string,
  indentOption: IndentOption = '2',
): string {
  checkSize(input);
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Paste a SQL query first.');

  if (indentOption === 'minify') {
    return trimmed
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*([;()])\s*/g, '$1')
      .trim();
  }

  const indentStr = indentOption === '4' ? '    ' : '  ';

  // Capitalize SQL keywords while preserving string literals and comments
  const words = trimmed.split(/(\s+|--[^\n]*|\/\*[\s\S]*?\*\/|'[^']*'|[,;()])/);
  const processed: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!w) continue;
    if (w.startsWith("'") || w.startsWith('--') || w.startsWith('/*')) {
      processed.push(w);
    } else {
      const upper = w.toUpperCase();
      if (SQL_KEYWORDS.includes(upper)) {
        processed.push(upper);
      } else {
        processed.push(w);
      }
    }
  }

  const query = processed.join('');

  // Structured indentation for major SQL clauses
  let formatted = query;
  for (const clause of MAJOR_CLAUSES) {
    const regex = new RegExp(`\\b${clause}\\b`, 'gi');
    formatted = formatted.replace(regex, `\n${clause.toUpperCase()}`);
  }

  // Indent secondary lines after SELECT/FROM/WHERE
  const lines = formatted
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const result: string[] = [];
  let isUnderClause = false;

  for (const line of lines) {
    const isMajor = MAJOR_CLAUSES.some((clause) =>
      line.toUpperCase().startsWith(clause),
    );
    if (isMajor) {
      isUnderClause = !line.toUpperCase().startsWith('SELECT');
      result.push(line);
    } else if (isUnderClause) {
      result.push(indentStr + line);
    } else {
      result.push(line);
    }
  }

  return result.join('\n').trim();
}

const HTML_VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

/** Format HTML with clean indentation or minify */
export function formatHtml(
  input: string,
  indentOption: IndentOption = '2',
): string {
  checkSize(input);
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Paste an HTML document first.');

  if (indentOption === 'minify') {
    return trimmed
      .replace(/>\s+</g, '><')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();
  }

  const indentStr = indentOption === '4' ? '    ' : '  ';
  let formatted = '';
  let indent = 0;

  const rawTokens = trimmed
    .replace(/>\s*</g, '>\n<')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i];

    // Closing tag: </tag>
    if (token.startsWith('</')) {
      indent = Math.max(0, indent - 1);
      formatted += indentStr.repeat(indent) + token + '\n';
    }
    // Opening tag with inline closing: <tag>content</tag>
    else if (/<([^\s>/]+)[^>]*>.*<\/\1>/.test(token)) {
      formatted += indentStr.repeat(indent) + token + '\n';
    }
    // Comment, Doctype or self-closing: <!--...-->, <!DOCTYPE...>, <tag/>
    else if (
      token.startsWith('<!') ||
      token.startsWith('<?') ||
      token.endsWith('/>')
    ) {
      formatted += indentStr.repeat(indent) + token + '\n';
    }
    // Opening tag
    else if (token.startsWith('<')) {
      const match = /^<([a-zA-Z0-9-]+)/.exec(token);
      const tagName = match ? match[1].toLowerCase() : '';
      formatted += indentStr.repeat(indent) + token + '\n';
      if (!HTML_VOID_ELEMENTS.has(tagName)) {
        indent++;
      }
    } else {
      formatted += indentStr.repeat(indent) + token + '\n';
    }
  }

  return formatted.trimEnd();
}

/** Unified format function across all supported languages */
export function formatCode(
  input: string,
  language: SupportedLanguage,
  indent: IndentOption = '2',
): string {
  switch (language) {
    case 'json':
      return formatJson(input, indent === 'minify' ? 'minify' : Number(indent));
    case 'xml':
      return formatXml(input, indent);
    case 'yaml':
      return formatYaml(input, indent);
    case 'sql':
      return formatSql(input, indent);
    case 'html':
      return formatHtml(input, indent);
  }
}
