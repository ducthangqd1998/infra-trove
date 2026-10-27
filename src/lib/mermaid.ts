import type { MermaidConfig } from 'mermaid';

export { getDiagramType } from './mermaid-utils';

export function getMermaidConfig(isDark: boolean): MermaidConfig {
  const font = 'Geist Variable, system-ui, -apple-system, sans-serif';
  if (isDark) {
    return {
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      look: 'classic',
      fontFamily: font,
      flowchart: {
        wrappingWidth: 200,
        useMaxWidth: true,
        nodeSpacing: 45,
        rankSpacing: 45,
        padding: 12,
      },
      sequence: {
        useMaxWidth: true,
        mirrorActors: false,
      },
      themeVariables: {
        darkMode: true,
        fontFamily: font,
        fontSize: '13px',
        background: 'transparent',
        primaryColor: '#231f1c',
        primaryTextColor: '#fafaf9',
        primaryBorderColor: '#433b35',
        lineColor: '#8a8178',
        secondaryColor: '#1c1917',
        secondaryTextColor: '#fdba74',
        secondaryBorderColor: '#302a26',
        tertiaryColor: '#231f1c',
        tertiaryTextColor: '#fafaf9',
        tertiaryBorderColor: '#433b35',
        mainBkg: '#231f1c',
        nodeBorder: '#433b35',
        nodeTextColor: '#fafaf9',
        edgeLabelBackground: '#1c1917',
        clusterBkg: '#14110f',
        clusterBorder: '#302a26',
        titleColor: '#fafaf9',
        actorBkg: '#231f1c',
        actorBorder: '#433b35',
        actorTextColor: '#fafaf9',
        actorLineColor: '#8a8178',
        signalColor: '#fafaf9',
        signalTextColor: '#fafaf9',
        labelBoxBkgColor: '#1c1917',
        labelBoxBorderColor: '#302a26',
        labelTextColor: '#c9c3bd',
        loopTextColor: '#fafaf9',
        noteBkgColor: '#2a2118',
        noteBorderColor: '#fb923c',
        noteTextColor: '#fafaf9',
        activationBorderColor: '#fb923c',
        activationBkgColor: '#3a2314',
        sequenceNumberColor: '#1c1917',
      },
    };
  }
  return {
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    look: 'classic',
    fontFamily: font,
    flowchart: {
      wrappingWidth: 200,
      useMaxWidth: true,
      nodeSpacing: 45,
      rankSpacing: 45,
      padding: 12,
    },
    sequence: {
      useMaxWidth: true,
      mirrorActors: false,
    },
    themeVariables: {
      darkMode: false,
      fontFamily: font,
      fontSize: '13px',
      background: 'transparent',
      primaryColor: '#ffffff',
      primaryTextColor: '#1c1917',
      primaryBorderColor: '#d6d0c7',
      lineColor: '#78716c',
      secondaryColor: '#faf7f2',
      secondaryTextColor: '#b8390c',
      secondaryBorderColor: '#e7e2da',
      tertiaryColor: '#ffffff',
      tertiaryTextColor: '#1c1917',
      tertiaryBorderColor: '#d6d0c7',
      mainBkg: '#ffffff',
      nodeBorder: '#d6d0c7',
      nodeTextColor: '#1c1917',
      edgeLabelBackground: '#ffffff',
      clusterBkg: '#faf7f2',
      clusterBorder: '#e7e2da',
      titleColor: '#1c1917',
      actorBkg: '#ffffff',
      actorBorder: '#d6d0c7',
      actorTextColor: '#1c1917',
      actorLineColor: '#78716c',
      signalColor: '#1c1917',
      signalTextColor: '#1c1917',
      labelBoxBkgColor: '#ffffff',
      labelBoxBorderColor: '#e7e2da',
      labelTextColor: '#57534e',
      loopTextColor: '#1c1917',
      noteBkgColor: '#fff1e6',
      noteBorderColor: '#ea580c',
      noteTextColor: '#1c1917',
      activationBorderColor: '#ea580c',
      activationBkgColor: '#fff1e6',
      sequenceNumberColor: '#fafaf9',
    },
  };
}

let mermaidPromise: Promise<typeof import('mermaid').default> | null = null;

export async function getMermaidInstance() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((m) => m.default);
  }
  return mermaidPromise;
}

export async function renderMermaidSvg(
  id: string,
  code: string,
  isDark: boolean,
): Promise<string> {
  const mermaid = await getMermaidInstance();
  mermaid.initialize(getMermaidConfig(isDark));
  const { svg } = await mermaid.render(id, code);
  return svg;
}
