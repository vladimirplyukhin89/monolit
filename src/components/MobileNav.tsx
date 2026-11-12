import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { openDialog } from '../lib/dialog-motion';
import { prefersReducedMotion } from '../lib/motion';

export interface HeaderLink {
  href: string;
  label: string;
}

interface Props {
  phone: string;
  phoneHref: string;
  links: readonly HeaderLink[];
  pageLinks: readonly HeaderLink[];
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function padIndex(index: number): string {
  return String(index + 1).padStart(2, '0');
}

function circleFrom(toggle: HTMLElement, panel: HTMLElement, open: boolean): string {
  const rect = toggle.getBoundingClientRect();
  const bounds = panel.getBoundingClientRect();
  const x = rect.left + rect.width / 2 - bounds.left;
  const y = rect.top + rect.height / 2 - bounds.top;
  const radius = open
    ? Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y)) + 24
    : 0;
  return `circle(${radius}px at ${x}px ${y}px)`;
}

export default function MobileNav({ phone, phoneHref, links, pageLinks }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const openRef = useRef(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel || openRef.current) return;
    panel.hidden = true;
  }, [mounted]);

  useEffect(() => {
    const toggle = toggleRef.current;
    const panel = panelRef.current;
    if (!toggle || !panel) return;

    const items = [...panel.querySelectorAll<HTMLElement>('[data-nav-item]')];
    const first = panel.querySelector<HTMLElement>('[data-nav-first]');
    let token = 0;
    const playing: Animation[] = [];

    const stopPlaying = () => {
      while (playing.length) {
        playing.pop()?.cancel();
      }
    };

    const setChrome = (next: boolean) => {
      openRef.current = next;
      setOpen(next);
      toggle.setAttribute('aria-expanded', next ? 'true' : 'false');
      toggle.setAttribute('aria-label', next ? 'Закрыть меню' : 'Открыть меню');
      panel.setAttribute('aria-hidden', next ? 'false' : 'true');
      document.documentElement.classList.toggle('nav-open', next);
    };

    const showInstant = () => {
      panel.hidden = false;
      panel.style.clipPath = 'none';
      items.forEach((item) => {
        item.style.opacity = '1';
        item.style.filter = 'none';
        item.style.transform = 'none';
      });
    };

    const hideInstant = () => {
      panel.hidden = true;
      panel.style.clipPath = '';
      items.forEach((item) => {
        item.style.opacity = '';
        item.style.filter = '';
        item.style.transform = '';
      });
    };

    const playOpen = async (id: number) => {
      panel.hidden = false;
      setChrome(true);

      if (prefersReducedMotion()) {
        showInstant();
        first?.focus({ preventScroll: true });
        return;
      }

      const origin = circleFrom(toggle, panel, false);
      const target = circleFrom(toggle, panel, true);
      panel.style.clipPath = '';

      const sheet = panel.animate([{ clipPath: origin }, { clipPath: target }], {
        duration: 620,
        easing: EASE,
        fill: 'forwards',
      });
      playing.push(sheet);
      const rows = items.map((item, index) => {
        const anim = item.animate(
          [
            { opacity: 0, transform: 'translateX(28px)', filter: 'blur(12px)' },
            { opacity: 1, transform: 'translateX(0px)', filter: 'blur(0px)' },
          ],
          { duration: 420, delay: 120 + index * 55, easing: EASE, fill: 'both' },
        );
        playing.push(anim);
        return anim.finished;
      });

      await Promise.all([sheet.finished, ...rows]).catch(() => undefined);
      if (id !== token) return;
      panel.style.clipPath = 'none';
      sheet.cancel();
      items.forEach((item) => {
        item.getAnimations().forEach((anim) => anim.cancel());
        item.style.opacity = '';
        item.style.transform = '';
        item.style.filter = '';
      });
      first?.focus({ preventScroll: true });
    };

    const playClose = async (id: number) => {
      setChrome(false);

      if (prefersReducedMotion()) {
        hideInstant();
        toggle.focus({ preventScroll: true });
        return;
      }

      const origin = getComputedStyle(panel).clipPath;
      const from = origin && origin !== 'none' ? origin : circleFrom(toggle, panel, true);
      const target = circleFrom(toggle, panel, false);
      panel.style.clipPath = '';

      const rows = items.map((item, index) => {
        const anim = item.animate(
          [
            { opacity: 1, transform: 'translateX(0px)', filter: 'blur(0px)' },
            { opacity: 0, transform: 'translateX(16px)', filter: 'blur(8px)' },
          ],
          {
            duration: 220,
            delay: (items.length - 1 - index) * 30,
            easing: EASE,
            fill: 'forwards',
          },
        );
        playing.push(anim);
        return anim.finished;
      });
      const sheet = panel.animate([{ clipPath: from }, { clipPath: target }], {
        duration: 420,
        delay: 80,
        easing: EASE,
        fill: 'forwards',
      });
      playing.push(sheet);

      await Promise.all([...rows, sheet.finished]).catch(() => undefined);
      if (id !== token) return;
      hideInstant();
      toggle.focus({ preventScroll: true });
    };

    const setMenu = (next: boolean) => {
      if (next === openRef.current) return;
      const id = ++token;
      stopPlaying();
      return next ? playOpen(id) : playClose(id);
    };

    const onToggle = () => {
      void setMenu(!openRef.current);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !openRef.current) return;
      event.preventDefault();
      void setMenu(false);
    };

    const scrollToAnchor = (href: string) => {
      const target = document.querySelector(href);
      void Promise.resolve(setMenu(false)).then(() => {
        if (target instanceof HTMLElement) {
          target.scrollIntoView({
            block: 'start',
            behavior: prefersReducedMotion() ? 'instant' : 'smooth',
          });
        }
        history.replaceState(null, '', href);
      });
    };

    const onPanelClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest('a');
      if (!(link instanceof HTMLAnchorElement) || !panel.contains(link)) return;
      const href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#')) {
        event.preventDefault();
        if (href === '#lead' && !document.getElementById('lead')) {
          void Promise.resolve(setMenu(false)).then(() => {
            const lead = document.getElementById('lead-dialog');
            if (lead instanceof HTMLDialogElement) void openDialog(lead);
          });
          return;
        }
        scrollToAnchor(href);
        return;
      }
      void setMenu(false);
    };

    toggle.addEventListener('click', onToggle);
    document.addEventListener('keydown', onKey);
    panel.addEventListener('click', onPanelClick);

    return () => {
      token += 1;
      stopPlaying();
      document.documentElement.classList.remove('nav-open');
      toggle.removeEventListener('click', onToggle);
      document.removeEventListener('keydown', onKey);
      panel.removeEventListener('click', onPanelClick);
    };
  }, [mounted]);

  const panel = (
    <nav
      ref={panelRef}
      id="site-nav-panel"
      className="site-nav"
      aria-hidden={open ? 'false' : 'true'}
      aria-labelledby={titleId}
    >
      <div className="site-nav__inner container">
        <p id={titleId} className="eyebrow" data-nav-item>
          Меню
        </p>
        {links.length > 0 ? (
          <ul className="site-nav__list">
            {links.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="site-nav__link"
                  data-nav-item
                  {...(index === 0 ? { 'data-nav-first': '' } : {})}
                >
                  <span className="site-nav__index" aria-hidden="true">
                    {padIndex(index)}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <ul className="site-nav__pages">
          {pageLinks.map((item, index) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="site-nav__page"
                data-nav-item
                {...(links.length === 0 && index === 0 ? { 'data-nav-first': '' } : {})}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="site-nav__footer" data-nav-item>
          <a className="site-nav__phone" href={phoneHref} aria-label={`Позвонить ${phone}`}>
            Позвонить
          </a>
          <a className="site-nav__cta" href="#lead">
            Оставить заявку
          </a>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="header__burger"
        aria-expanded={open}
        aria-controls="site-nav-panel"
        aria-label="Открыть меню"
      >
        <span className="header__burger-bars" aria-hidden="true" />
      </button>
      {mounted ? createPortal(panel, document.body) : null}
      <style>{styles}</style>
    </>
  );
}

const styles = `
  .header__burger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text);
    cursor: pointer;
  }
  .header__burger-bars,
  .header__burger-bars::before,
  .header__burger-bars::after {
    display: block;
    width: 1.05rem;
    height: 0.125rem;
    border-radius: var(--radius-full);
    background: currentColor;
  }
  .header__burger-bars {
    position: relative;
  }
  .header__burger-bars::before,
  .header__burger-bars::after {
    content: '';
    position: absolute;
    left: 0;
    transition: transform var(--duration-base) var(--ease-out);
  }
  .header__burger-bars::before {
    top: -0.35rem;
  }
  .header__burger-bars::after {
    top: 0.35rem;
  }
  .header__burger[aria-expanded='true'] .header__burger-bars {
    background: transparent;
  }
  .header__burger[aria-expanded='true'] .header__burger-bars::before {
    transform: translateY(0.35rem) rotate(45deg);
  }
  .header__burger[aria-expanded='true'] .header__burger-bars::after {
    transform: translateY(-0.35rem) rotate(-45deg);
  }
  .site-nav {
    position: fixed;
    inset: 0;
    z-index: 30;
    overflow-y: auto;
    overscroll-behavior: contain;
    background: var(--color-bg);
    clip-path: circle(0px at calc(100% - 2.5rem) 1.5rem);
  }
  .site-nav__inner {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding-top: 5rem;
    padding-bottom: var(--space-8);
  }
  .site-nav__list,
  .site-nav__pages {
    list-style: none;
    margin: var(--space-4) 0 0;
    padding: 0;
  }
  .site-nav__link {
    display: flex;
    align-items: baseline;
    gap: var(--space-4);
    padding: var(--space-3) 0;
    color: var(--color-text);
    text-decoration: none;
    font-size: var(--font-size-xl);
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: var(--line-height-tight);
    transition: color var(--duration-fast) var(--ease-out);
  }
  .site-nav__link:hover {
    color: var(--color-primary);
  }
  .site-nav__index {
    width: 1.6rem;
    flex-shrink: 0;
    font-size: var(--font-size-base);
    font-weight: 700;
    letter-spacing: 0.14em;
    color: var(--color-primary);
  }
  .site-nav__page {
    display: block;
    padding: var(--space-2) 0;
    color: var(--color-text-muted);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--duration-fast) var(--ease-out);
  }
  .site-nav__page:hover {
    color: var(--color-primary);
  }
  .site-nav__footer {
    display: grid;
    gap: var(--space-3);
    margin-top: auto;
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border);
  }
  .site-nav__phone,
  .site-nav__cta {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-full);
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    transition:
      background-color var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }
  .site-nav__phone {
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-text);
  }
  .site-nav__phone:hover {
    background: var(--color-ghost-hover);
    border-color: color-mix(in srgb, var(--color-text) 22%, var(--color-border));
  }
  .site-nav__phone:active,
  .site-nav__cta:active {
    transform: scale(var(--press-scale));
  }
  .site-nav__cta {
    background: var(--color-primary);
    color: var(--color-primary-contrast);
  }
  .site-nav__cta:hover {
    background: var(--color-primary-hover);
  }
  @media (prefers-reduced-motion: reduce) {
    .header__burger-bars::before,
    .header__burger-bars::after {
      transition: none;
    }
    .site-nav {
      clip-path: none;
    }
  }
`;
