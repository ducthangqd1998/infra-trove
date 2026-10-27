export function getDiagramType(code: string): string {
  const line = code
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('%%'));
  if (!line) return 'Diagram';
  const firstWord = line.split(/[\s(;]/)[0]?.toLowerCase();
  switch (firstWord) {
    case 'flowchart':
    case 'graph':
      return 'Flowchart';
    case 'sequencediagram':
      return 'Sequence Diagram';
    case 'statediagram':
    case 'statediagram-v2':
      return 'State Diagram';
    case 'classdiagram':
      return 'Class Diagram';
    case 'erdiagram':
      return 'ER Diagram';
    case 'architecture':
    case 'architecturediagram':
      return 'Architecture Diagram';
    case 'gantt':
      return 'Gantt Chart';
    case 'gitgraph':
      return 'Git Graph';
    case 'pie':
      return 'Pie Chart';
    case 'mindmap':
      return 'Mindmap';
    case 'timeline':
      return 'Timeline';
    default:
      return 'Diagram';
  }
}
