import { useId, useState } from 'react';

interface Props {
  phone: string;
  phoneHref: string;
}

export default function MobileNav({ phone, phoneHref }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-nav__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Закрыть' : 'Меню'}
      </button>
      {open ? (
        <nav id={panelId} className="mobile-nav__panel" aria-label="Мобильная">
          <a href={phoneHref} onClick={() => setOpen(false)}>
            {phone}
          </a>
          <a href="#lead" onClick={() => setOpen(false)}>
            Оставить заявку
          </a>
          <a href="/blagoustrojstvo" onClick={() => setOpen(false)}>
            Благоустройство
          </a>
          <a href="/remont-kvartir" onClick={() => setOpen(false)}>
            Ремонт квартир
          </a>
          <a href="/politika-konfidencialnosti" onClick={() => setOpen(false)}>
            Политика конфиденциальности
          </a>
        </nav>
      ) : null}
      <style>{`
        .mobile-nav {
          position: relative;
        }
        .mobile-nav__toggle {
          border: 1px solid var(--color-border);
          background: var(--color-bg);
          color: var(--color-text);
          border-radius: var(--radius-full);
          padding: var(--space-2) var(--space-4);
          font: inherit;
          font-weight: 600;
          cursor: pointer;
          transition:
            background-color var(--duration-fast) var(--ease-out),
            transform var(--duration-fast) var(--ease-out);
        }
        .mobile-nav__toggle:hover {
          background: var(--color-surface);
        }
        .mobile-nav__toggle:active {
          transform: scale(var(--press-scale));
        }
        .mobile-nav__panel {
          position: absolute;
          right: 0;
          top: calc(100% + var(--space-2));
          min-width: 16rem;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: 0 var(--space-2) var(--space-6) var(--shadow-color);
        }
        .mobile-nav__panel a {
          color: var(--color-text);
          text-decoration: none;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
