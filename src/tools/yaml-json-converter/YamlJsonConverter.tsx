import { useState } from 'react';
import { convertYamlJson, type Direction } from './logic';
import {
  CopyButton,
  Editor,
  ErrorMessage,
  Segmented,
  SwapIcon,
  ToolReady,
  message,
  runOnModEnter,
  textStats,
} from '../../components/tools/Shared';

const examples: Record<Direction, string> = {
  'yaml-to-json':
    'name: demo-api\nreplicas: 3\nenabled: true\nports:\n  - 8080\n',
  'json-to-yaml':
    '{"name":"demo-api","replicas":3,"enabled":true,"ports":[8080]}',
};
export default function YamlJsonConverter() {
  const [direction, setDirection] = useState<Direction>('yaml-to-json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const yamlInput = direction === 'yaml-to-json';
  function update(value: string) {
    setInput(value);
    setOutput('');
    setError('');
  }
  function convert() {
    try {
      setOutput(convertYamlJson(input, direction));
      setError('');
    } catch (error) {
      setOutput('');
      setError(message(error));
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([output], {
        type: yamlInput ? 'application/json' : 'text/yaml',
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted.${yamlInput ? 'json' : 'yaml'}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <ToolReady>
      <div className="tool-bar">
        <button className="button" onClick={convert}>
          Convert
        </button>
        <Segmented
          label="Direction"
          value={direction}
          options={[
            { value: 'yaml-to-json', label: 'YAML to JSON' },
            { value: 'json-to-yaml', label: 'JSON to YAML' },
          ]}
          onChange={(value) => {
            setDirection(value as Direction);
            update('');
          }}
        />
        <div className="tool-bar-end">
          <button
            className="text-button"
            onClick={() => update(examples[direction])}
          >
            Load example
          </button>
          <button className="text-button" onClick={() => update('')}>
            Clear
          </button>
        </div>
      </div>
      <div className="editor-grid with-swap">
        <Editor
          label={yamlInput ? 'YAML input' : 'JSON input'}
          value={input}
          onChange={update}
          meta={textStats(input)}
          tall
          lineNumbers
          wrap={false}
          placeholder={
            yamlInput ? 'Paste one YAML 1.2 document…' : 'Paste a JSON value…'
          }
          describedBy="tool-error yaml-note"
          onKeyDown={runOnModEnter(convert)}
        />
        <button
          className="icon-button swap-button"
          aria-label="Swap direction"
          title="Swap direction"
          disabled={!output}
          onClick={() => {
            setDirection(yamlInput ? 'json-to-yaml' : 'yaml-to-json');
            update(output);
          }}
        >
          <SwapIcon />
        </button>
        <Editor
          label={yamlInput ? 'JSON output' : 'YAML output'}
          value={output}
          readOnly
          tall
          lineNumbers
          wrap={false}
          placeholder="Converted output appears here"
          actions={<CopyButton value={output} className="text-button small" />}
        />
      </div>
      <ErrorMessage message={error} />
      <div className="field-row">
        <p className="tool-hint" id="yaml-note">
          YAML 1.2 · 100,000 characters · No aliases or custom tags. Comments
          are not preserved.
        </p>
        <button className="text-button" disabled={!output} onClick={download}>
          Download output
        </button>
      </div>
    </ToolReady>
  );
}
