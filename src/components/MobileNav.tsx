import { useEffect, useId, useRef, useState } from 'react';
import { bindDialogEsc, closeDialog, openDialog } from '../lib/dialog-motion';

interface Props {
  phone: string;
  phoneHref: string;
}

export default function MobileNav({ phone, phoneHref }: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      bindDialogEsc(dialog);
    }
  }, []);

  const show = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    setOpen(true);
    void openDialog(dialog);
  };

  const close = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    void closeDialog(dialog);
  };

  const openLead = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const menu = dialogRef.current;
    const lead = document.getElementById('lead-dialog');
    void (async () => {
      if (menu?.open) {
        await closeDialog(menu);
      }
      if (lead instanceof HTMLDialogElement) {
        await openDialog(lead);
      }
    })();
  };

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-nav__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={show}
      >
        Меню
      </button>
      <dialog
        ref={dialogRef}
        id={panelId}
        className="dialog"
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="dialog__body">
          <div className="dialog__head">
            <h2 id={titleId} className="dialog__title">
              Меню
            </h2>
            <button type="button" className="dialog__close" aria-label="Закрыть" onClick={close}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav className="mobile-nav__panel" aria-label="Мобильная">
            <a href={phoneHref} onClick={close}>
              {phone}
            </a>
            <a href="#lead" onClick={openLead}>
              Оставить заявку
            </a>
            <a href="/blagoustrojstvo" onClick={close}>
              Благоустройство
            </a>
            <a href="/remont-kvartir" onClick={close}>
              Ремонт квартир
            </a>
            <a href="/politika-konfidencialnosti" onClick={close}>
              Политика конфиденциальности
            </a>
          </nav>
        </div>
      </dialog>
      <style>{`
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
          display: flex;
          flex-direction: column;
        }
        .mobile-nav__panel a {
          padding: var(--space-3) 0;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text);
          text-decoration: none;
          font-size: var(--font-size-lg);
          font-weight: 500;
        }
        .mobile-nav__panel a:last-child {
          border-bottom: 0;
        }
      `}</style>
    </div>
  );
}
