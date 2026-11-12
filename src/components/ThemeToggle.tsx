import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'monolit-theme';

function readTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'light';
  }
  const fromDom = document.documentElement.dataset.theme;
  if (fromDom === 'dark' || fromDom === 'light') {
    return fromDom;
  }
  return 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  const color = getComputedStyle(root).getPropertyValue('--color-bg-muted').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore quota / private mode */
  }
}

function switchTheme(theme: Theme) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof document.startViewTransition !== 'function' || reduced) {
    applyTheme(theme);
    return;
  }
  document.documentElement.classList.add('is-theme-switching');
  const transition = document.startViewTransition(() => applyTheme(theme));
  transition.finished.finally(() => {
    document.documentElement.classList.remove('is-theme-switching');
  });
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  const label = next === 'dark' ? 'Тёмная тема' : 'Светлая тема';

  const toggle = () => {
    setTheme(next);
    switchTheme(next);
  };

  return (
    <>
      <button
        type="button"
        className={`theme-toggle${theme === 'dark' ? ' is-dark' : ''}`}
        aria-label={label}
        title={label}
        onClick={toggle}
      >
        <span className="theme-toggle__track" aria-hidden="true">
          <span className="theme-toggle__thumb" />
        </span>
        <span className="theme-toggle__label">{theme === 'dark' ? 'Тёмная' : 'Светлая'}</span>
      </button>
      <style>{styles}</style>
    </>
  );
}

const styles = `
  .theme-toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    margin: 0;
    padding: var(--space-1);
    border: 0;
    background: transparent;
    color: var(--color-text);
    font: inherit;
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
    border-radius: var(--radius-lg);
  }
  .theme-toggle:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  .theme-toggle__track {
    position: relative;
    width: 2.5rem;
    height: 1.35rem;
    border-radius: 999px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    transition:
      background-color var(--theme-duration) ease,
      border-color var(--theme-duration) ease;
  }
  .theme-toggle.is-dark .theme-toggle__track {
    background: color-mix(in srgb, var(--color-primary) 35%, var(--color-surface));
    border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
  }
  .theme-toggle__thumb {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 1.05rem;
    height: 1.05rem;
    border-radius: 50%;
    background: var(--color-primary);
    transition: transform var(--theme-duration) ease;
  }
  .theme-toggle.is-dark .theme-toggle__thumb {
    transform: translateX(1.1rem);
  }
  .theme-toggle__label {
    display: none;
  }
  @media (min-width: 768px) {
    .theme-toggle__label {
      display: inline;
      color: var(--color-text-muted);
    }
  }
`;
