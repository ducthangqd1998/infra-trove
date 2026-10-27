import { describe, expect, it } from 'vitest';
import {
  formatCode,
  formatHtml,
  formatJson,
  formatSql,
  formatXml,
  formatYaml,
} from './formatters';

describe('multi-language formatters', () => {
  describe('JSON', () => {
    it('formats valid JSON with custom indentation', () => {
      expect(formatJson('{"a":1}', 2)).toBe('{\n  "a": 1\n}');
      expect(formatJson('{"a":1}', 4)).toBe('{\n    "a": 1\n}');
    });

    it('minifies JSON', () => {
      expect(formatJson('{\n  "a": 1\n}', 'minify')).toBe('{"a":1}');
    });

    it('throws on invalid JSON', () => {
      expect(() => formatJson('{a:1}')).toThrow();
    });
  });

  describe('XML', () => {
    it('formats XML with hierarchy and indentation', () => {
      const xml = '<root><item id="1">Text</item><empty/></root>';
      const formatted = formatXml(xml, '2');
      expect(formatted).toContain('<root>');
      expect(formatted).toContain('  <item id="1">Text</item>');
      expect(formatted).toContain('  <empty/>');
      expect(formatted).toContain('</root>');
    });

    it('minifies XML', () => {
      const xml = '<root>\n  <item>Text</item>\n</root>';
      expect(formatXml(xml, 'minify')).toBe('<root><item>Text</item></root>');
    });
  });

  describe('YAML', () => {
    it('formats YAML cleanly', () => {
      const yaml = 'b: 2\na: 1';
      const formatted = formatYaml(yaml, '2');
      expect(formatted).toContain('b: 2');
      expect(formatted).toContain('a: 1');
    });

    it('throws on invalid YAML', () => {
      expect(() => formatYaml('key: [unclosed')).toThrow();
    });
  });

  describe('SQL', () => {
    it('capitalizes keywords and structures clauses', () => {
      const sql =
        'select id, name from users where active = 1 order by id desc';
      const formatted = formatSql(sql, '2');
      expect(formatted).toContain('SELECT');
      expect(formatted).toContain('FROM users');
      expect(formatted).toContain('WHERE active = 1');
      expect(formatted).toContain('ORDER BY id DESC');
    });

    it('minifies SQL query', () => {
      const sql = 'SELECT id,\n  name\nFROM users';
      expect(formatSql(sql, 'minify')).toBe('SELECT id, name FROM users');
    });
  });

  describe('HTML', () => {
    it('formats HTML and recognizes void elements', () => {
      const html =
        '<div><p>Hello</p><img src="test.jpg"><input type="text"></div>';
      const formatted = formatHtml(html, '2');
      expect(formatted).toContain('<div>');
      expect(formatted).toContain('  <p>Hello</p>');
      expect(formatted).toContain('  <img src="test.jpg">');
      expect(formatted).toContain('  <input type="text">');
      expect(formatted).toContain('</div>');
    });

    it('minifies HTML', () => {
      const html = '<div>\n  <p>Text</p>\n</div>';
      expect(formatHtml(html, 'minify')).toBe('<div><p>Text</p></div>');
    });
  });

  describe('formatCode unified dispatcher', () => {
    it('dispatches to correct formatter', () => {
      expect(formatCode('{"a":1}', 'json', '2')).toBe('{\n  "a": 1\n}');
      expect(formatCode('<root/>', 'xml', '2')).toBe('<root/>');
    });
  });
});
