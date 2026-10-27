import { describe, it, expect } from 'vitest';
import { getDiagramType, getMermaidConfig } from './mermaid';

describe('mermaid utilities', () => {
  describe('getDiagramType', () => {
    it('detects flowchart and graph', () => {
      expect(getDiagramType('flowchart TD\n A --> B')).toBe('Flowchart');
      expect(getDiagramType('flowchart LR\n A --> B')).toBe('Flowchart');
      expect(getDiagramType('graph TD\n A --> B')).toBe('Flowchart');
    });

    it('ignores leading comments and whitespace', () => {
      expect(
        getDiagramType('%% Ingress and routing layer\nflowchart LR\n A --> B'),
      ).toBe('Flowchart');
      expect(getDiagramType('\n  \n  sequenceDiagram\n Alice->>Bob: Hi')).toBe(
        'Sequence Diagram',
      );
    });

    it('detects other diagram types', () => {
      expect(getDiagramType('sequenceDiagram\n Alice->>Bob: Hi')).toBe(
        'Sequence Diagram',
      );
      expect(getDiagramType('stateDiagram-v2\n [*] --> Active')).toBe(
        'State Diagram',
      );
      expect(getDiagramType('classDiagram\n class BankAccount')).toBe(
        'Class Diagram',
      );
      expect(getDiagramType('erDiagram\n CUSTOMER ||--o{ ORDER : places')).toBe(
        'ER Diagram',
      );
      expect(getDiagramType('gantt\n title A Gantt')).toBe('Gantt Chart');
      expect(getDiagramType('gitGraph\n commit')).toBe('Git Graph');
      expect(getDiagramType('pie title Pets\n "Dogs" : 386')).toBe('Pie Chart');
    });

    it('returns Diagram for unknown or empty input', () => {
      expect(getDiagramType('')).toBe('Diagram');
      expect(getDiagramType('%% only comments\n%% second comment')).toBe(
        'Diagram',
      );
      expect(getDiagramType('unknownSyntax foo bar')).toBe('Diagram');
    });
  });

  describe('getMermaidConfig', () => {
    it('generates secure light mode configuration matching DESIGN.md', () => {
      const config = getMermaidConfig(false);
      expect(config.startOnLoad).toBe(false);
      expect(config.securityLevel).toBe('strict');
      expect(config.theme).toBe('base');
      expect(config.themeVariables?.darkMode).toBe(false);
      expect(config.themeVariables?.primaryColor).toBe('#ffffff');
      expect(config.themeVariables?.primaryBorderColor).toBe('#d6d0c7');
      expect(config.themeVariables?.primaryTextColor).toBe('#1c1917');
      expect(config.themeVariables?.lineColor).toBe('#78716c');
    });

    it('generates secure dark mode configuration matching DESIGN.md', () => {
      const config = getMermaidConfig(true);
      expect(config.startOnLoad).toBe(false);
      expect(config.securityLevel).toBe('strict');
      expect(config.theme).toBe('base');
      expect(config.themeVariables?.darkMode).toBe(true);
      expect(config.themeVariables?.primaryColor).toBe('#231f1c');
      expect(config.themeVariables?.primaryBorderColor).toBe('#433b35');
      expect(config.themeVariables?.primaryTextColor).toBe('#fafaf9');
      expect(config.themeVariables?.lineColor).toBe('#8a8178');
    });
  });
});
