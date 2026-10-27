import { useState, type CSSProperties } from 'react';
import {
  generatePassword,
  passwordStrength,
  type PasswordOptions,
} from './logic';
import {
  CopyIconButton,
  ErrorMessage,
  RefreshIcon,
  ToolReady,
  message,
} from '../../components/tools/Shared';
const groups = [
  ['upper', 'Uppercase', 'A–Z'],
  ['lower', 'Lowercase', 'a–z'],
  ['digits', 'Digits', '0–9'],
  ['symbols', 'Symbols', '!@#'],
] as const;
/** Digits and symbols get their own colour so similar glyphs are easy to read back. */
function Colored({ value }: { value: string }) {
  return [...value].map((char, index) => (
    <span
      key={index}
      className={
        /\d/.test(char)
          ? 'pw-digit'
          : /[A-Za-z]/.test(char)
            ? undefined
            : 'pw-symbol'
      }
    >
      {char}
    </span>
  ));
}
export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 20,
    upper: true,
    lower: true,
    digits: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [lengthDraft, setLengthDraft] = useState('20');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const strength = passwordStrength(options);
  function update(next: PasswordOptions) {
    setOptions(next);
    setOutput('');
    setError('');
  }
  function setLength(length: number) {
    setLengthDraft(String(length));
    update({ ...options, length });
  }
  function generate() {
    try {
      setOutput(generatePassword(options));
      setError('');
    } catch (error) {
      setError(message(error));
      setOutput('');
    }
  }
  return (
    <ToolReady>
      <div className="pw-display">
        <span className="seg-label">Your password</span>
        <div className="pw-row">
          <output className="password-output">
            {output ? (
              <Colored value={output} />
            ) : (
              <span className="pw-empty">Ready when you are.</span>
            )}
          </output>
          <div className="pw-actions">
            <button
              type="button"
              className="icon-button"
              aria-label={output ? 'Regenerate password' : 'Generate'}
              title={output ? 'Regenerate' : 'Generate password'}
              onClick={generate}
            >
              <RefreshIcon />
            </button>
            <CopyIconButton value={output} label="password" />
          </div>
        </div>
        <div className="pw-strength">
          <span
            className="meter"
            data-level={strength.level}
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>
            <strong>{strength.label}</strong> · Estimated {strength.bits} bits
            of entropy (based on settings)
          </span>
        </div>
      </div>
      <div className="pw-options">
        <div className="pw-length">
          <label htmlFor="pw-length-number">Length</label>
          <input
            id="pw-length-number"
            className="pw-length-number"
            type="number"
            min="8"
            max="128"
            value={lengthDraft}
            onChange={(event) => {
              setLengthDraft(event.target.value);
              const value = event.target.valueAsNumber;
              if (Number.isInteger(value) && value >= 8 && value <= 128)
                update({ ...options, length: value });
            }}
            onBlur={() => setLengthDraft(String(options.length))}
          />
          <input
            type="range"
            min="8"
            max="128"
            aria-label="Password length"
            value={options.length}
            style={
              {
                '--fill': `${((options.length - 8) / 120) * 100}%`,
              } as CSSProperties
            }
            onChange={(event) => setLength(Number(event.target.value))}
          />
        </div>
        <div className="pw-groups">
          {groups.map(([key, label, sample]) => (
            <label className="toggle-card" key={key}>
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(event) =>
                  update({ ...options, [key]: event.target.checked })
                }
              />
              <span>
                {label}
                <small>{sample}</small>
              </span>
            </label>
          ))}
        </div>
        <label className="check-label">
          <input
            type="checkbox"
            checked={options.excludeAmbiguous}
            onChange={(event) =>
              update({ ...options, excludeAmbiguous: event.target.checked })
            }
          />
          Exclude confusing characters (I, l, 1, O, 0, o, |)
        </label>
      </div>
      <ErrorMessage message={error} />
      <div className="workspace-actions">
        <button className="button" onClick={generate}>
          Generate password <RefreshIcon />
        </button>
        <p className="tool-hint">
          Web Crypto randomness · No storage · Generated only when you click
        </p>
      </div>
    </ToolReady>
  );
}
