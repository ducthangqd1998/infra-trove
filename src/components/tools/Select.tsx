import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';

type Option = { value: string; label: string };
export function Select({
  label,
  value,
  options,
  onChange,
  placeholder = 'Choose an option',
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const selected = options.find((option) => option.value === value);
  function placeMenu() {
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    const height = Math.min(options.length * 48 + 16, 280);
    const width = Math.min(Math.max(rect.width, 240), window.innerWidth - 32);
    setPosition({
      top:
        rect.bottom + height > window.innerHeight
          ? Math.max(16, rect.top - height - 8)
          : rect.bottom + 8,
      left: Math.max(16, Math.min(rect.left, window.innerWidth - width - 16)),
      width,
    });
  }
  function show() {
    placeMenu();
    setActive(
      Math.max(
        0,
        options.findIndex((option) => option.value === value),
      ),
    );
    setOpen(true);
  }
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (
        !menu.current?.contains(event.target as Node) &&
        !trigger.current?.contains(event.target as Node)
      )
        setOpen(false);
    }
    function dismiss() {
      setOpen(false);
    }
    function reposition(event: Event) {
      if (!menu.current?.contains(event.target as Node)) placeMenu();
    }
    document.addEventListener('pointerdown', outside);
    window.addEventListener('resize', dismiss);
    window.addEventListener('scroll', reposition, true);
    return () => {
      document.removeEventListener('pointerdown', outside);
      window.removeEventListener('resize', dismiss);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [open]);
  function choose(index: number) {
    onChange(options[index].value);
    setOpen(false);
    trigger.current?.focus();
  }
  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (
      ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'Escape'].includes(
        event.key,
      )
    ) {
      event.preventDefault();
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (!open) {
        show();
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        choose(active);
        return;
      }
      if (event.key === 'Home') setActive(0);
      else if (event.key === 'End') setActive(options.length - 1);
      else
        setActive(
          (index) =>
            (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) %
            options.length,
        );
    } else if (event.key === 'Tab') setOpen(false);
    else if (event.key.length === 1) {
      const index = options.findIndex((option) =>
        option.label.toLowerCase().startsWith(event.key.toLowerCase()),
      );
      if (index >= 0) {
        if (!open) show();
        setActive(index);
      }
    }
  }
  return (
    <div className="select-field">
      <label id={`${id}-label`} htmlFor={id}>
        {label}
      </label>
      <button
        ref={trigger}
        id={id}
        type="button"
        className="select-trigger"
        role="combobox"
        aria-labelledby={`${id}-label`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={keyDown}
      >
        <span>{selected?.label || placeholder}</span>
        <svg
          className="select-chevron"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open &&
        createPortal(
          <div
            ref={menu}
            id={`${id}-list`}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className="select-menu"
            style={position}
          >
            {options.map((option, index) => (
              <div
                id={`${id}-option-${index}`}
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={`select-option ${index === active ? 'highlighted' : ''}`}
                onPointerMove={() => setActive(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <svg
                    className="select-check"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="m5 12 4 4 10-10" />
                  </svg>
                )}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
