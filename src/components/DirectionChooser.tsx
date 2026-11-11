import { AnimatePresence, LazyMotion, LayoutGroup } from 'motion/react';
import * as m from 'motion/react-m';
import { useLayoutEffect, useState } from 'react';
import { fade, motionTransition, spring } from '../lib/motion';
import loadMotionFeatures from '../lib/motion-features';

type Direction = 'neutral' | 'landscaping' | 'renovation';

interface PreviewService {
  title: string;
  price: string;
}

const landscapingServices: PreviewService[] = [
  { title: 'Асфальтирование территорий', price: 'от 800 ₽/м²' },
  { title: 'Укладка брусчатки и тротуарной плитки', price: 'от 900 ₽/м²' },
  { title: 'Отмостка', price: 'от 800 ₽/м²' },
  { title: 'Водоотведение и дренаж', price: 'от 400 ₽' },
];

const renovationServices: PreviewService[] = [
  { title: '[Услуга 1]', price: '[от — ₽]' },
  { title: '[Услуга 2]', price: '[от — ₽]' },
  { title: '[Услуга 3]', price: '[от — ₽]' },
];

const previews = {
  landscaping: {
    heading: 'Благоустройство',
    services: landscapingServices,
    href: '/blagoustrojstvo',
    cta: 'Смотреть благоустройство',
  },
  renovation: {
    heading: 'Ремонт квартир',
    services: renovationServices,
    href: '/remont-kvartir',
    cta: 'Смотреть ремонт квартир',
  },
};

function readDirectionFromUrl(): Direction {
  if (typeof window === 'undefined') {
    return 'neutral';
  }
  const value = new URLSearchParams(window.location.search).get('dir');
  if (value === 'landscaping' || value === 'renovation') {
    return value;
  }
  return 'neutral';
}

export default function DirectionChooser() {
  const [direction, setDirection] = useState<Direction>('neutral');
  const hasSelection = direction !== 'neutral';

  useLayoutEffect(() => {
    setDirection(readDirectionFromUrl());
  }, []);

  const select = (next: Direction) => {
    setDirection(next);
    const url = new URL(window.location.href);
    if (next === 'neutral') {
      url.searchParams.delete('dir');
    } else {
      url.searchParams.set('dir', next);
    }
    window.history.replaceState({}, '', url);
  };

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <section className="chooser section" aria-labelledby="chooser-title">
        <div className="container">
          <h2 id="chooser-title" className="chooser__title">
            Выберите направление
          </h2>

          <div className="chooser__shell">
            <div className="chooser__glow" aria-hidden="true" />
            <LayoutGroup>
              <div className="chooser__grid" role="group" aria-label="Направления работ">
                <DirectionCard
                  direction="landscaping"
                  selected={direction === 'landscaping'}
                  title="Благоустройство"
                  text="Участок под ключ: асфальт, брусчатка, дренаж, отмостки"
                  onSelect={() => select('landscaping')}
                />
                <DirectionCard
                  direction="renovation"
                  selected={direction === 'renovation'}
                  title="Ремонт квартир"
                  text="[Краткое описание направления]"
                  onSelect={() => select('renovation')}
                />
              </div>
            </LayoutGroup>

            <div className="chooser__preview" aria-live="polite">
              {!hasSelection ? (
                <p className="chooser__hint">Нажмите на раздел, чтобы увидеть услуги.</p>
              ) : null}

              <AnimatePresence mode="wait">
                {direction !== 'neutral' ? (
                  <m.div
                    key={direction}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={motionTransition(fade)}
                  >
                    <Preview {...previews[direction]} />
                  </m.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <style>{styles}</style>
      </section>
    </LazyMotion>
  );
}

function DirectionCard({
  direction,
  selected,
  title,
  text,
  onSelect,
}: {
  direction: 'landscaping' | 'renovation';
  selected: boolean;
  title: string;
  text: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`chooser__card chooser__card--${direction}${selected ? ' is-selected' : ''}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      {selected ? (
        <m.span
          className="chooser__selected"
          layoutId="chooser-selected"
          transition={motionTransition(spring)}
          aria-hidden="true"
        />
      ) : null}
      <span className="chooser__card-title">{title}</span>
      <span className="chooser__card-text">{text}</span>
      <span className="chooser__card-action">{selected ? 'Выбрано' : 'Выбрать'}</span>
    </button>
  );
}

function Preview({
  heading,
  services,
  href,
  cta,
}: {
  heading: string;
  services: PreviewService[];
  href: string;
  cta: string;
}) {
  return (
    <div className="preview">
      <h3 className="preview__heading">{heading}: услуги</h3>
      <ul className="preview__list">
        {services.map((service) => (
          <li key={service.title} className="preview__item">
            <span>{service.title}</span>
            <strong>{service.price}</strong>
          </li>
        ))}
      </ul>
      <div className="preview__media" aria-hidden="true">
        <div className="preview__placeholder">Фото работ — скоро</div>
        <div className="preview__placeholder">Фото работ — скоро</div>
      </div>
      <a className="preview__cta" href={href}>
        {cta}
      </a>
    </div>
  );
}

const styles = `
  .chooser__title {
    margin: 0 0 var(--space-8);
    font-size: var(--font-size-xl);
    font-weight: 500;
    line-height: var(--line-height-tight);
  }
  .chooser__shell {
    position: relative;
    isolation: isolate;
  }
  .chooser__glow {
    pointer-events: none;
    position: absolute;
    inset: -10% -5%;
    z-index: 0;
    background:
      radial-gradient(ellipse 45% 55% at 20% 40%, var(--color-ambient-landscape), transparent 70%),
      radial-gradient(ellipse 45% 55% at 80% 55%, var(--color-ambient-renovation), transparent 70%);
    filter: blur(28px);
    opacity: 0.85;
  }
  .chooser__grid {
    position: relative;
    z-index: 1;
    display: grid;
    gap: var(--space-4);
  }
  .chooser__card {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
    text-align: left;
    padding: var(--space-6);
    border: 1px solid color-mix(in srgb, var(--color-text) 14%, transparent);
    border-radius: var(--radius-xl);
    color: var(--color-chooser-text);
    font: inherit;
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0 var(--space-2) var(--space-6) var(--shadow-color);
    transition:
      border-color var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out);
  }
  .chooser__card > * {
    position: relative;
    z-index: 1;
  }
  .chooser__card--landscaping {
    background: var(--color-ambient-landscape);
    view-transition-name: dir-landscaping;
  }
  .chooser__card--renovation {
    background: var(--color-ambient-renovation);
    view-transition-name: dir-renovation;
  }
  .chooser__selected {
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: inherit;
    background: var(--color-primary);
  }
  .chooser__card.is-selected {
    border-color: color-mix(in srgb, var(--color-primary) 55%, transparent);
    color: var(--color-primary-contrast);
  }
  .chooser__card.is-selected .chooser__card-text,
  .chooser__card.is-selected .chooser__card-action {
    color: var(--color-primary-contrast);
  }
  .chooser__card-title {
    font-size: var(--font-size-lg);
    font-weight: 700;
  }
  .chooser__card-text {
    color: var(--color-chooser-text-muted);
  }
  .chooser__card-action {
    margin-top: auto;
    font-weight: 600;
    color: var(--color-primary);
  }
  .chooser__preview {
    position: relative;
    z-index: 1;
    margin-top: var(--space-8);
    min-height: 1.5rem;
  }
  .chooser__hint {
    margin: 0;
    color: var(--color-text-muted);
  }
  .preview {
    background: var(--color-bg);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    border: 1px solid var(--color-border);
  }
  .preview__heading {
    margin: 0 0 var(--space-4);
    font-size: var(--font-size-lg);
    font-weight: 600;
  }
  .preview__list {
    list-style: none;
    margin: 0 0 var(--space-6);
    padding: 0;
    display: grid;
    gap: var(--space-3);
  }
  .preview__item {
    display: flex;
    justify-content: space-between;
    gap: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }
  .preview__item strong {
    white-space: nowrap;
    font-weight: 600;
  }
  .preview__media {
    display: grid;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }
  .preview__placeholder {
    min-height: 8rem;
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    color: var(--color-text-muted);
    display: grid;
    place-items: center;
    font-size: 0.875rem;
  }
  .preview__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-full);
    border: 1px solid color-mix(in srgb, var(--color-on-inverse) 16%, transparent);
    background: var(--color-bg-inverse);
    color: var(--color-on-inverse);
    text-decoration: none;
    font-weight: 600;
    transition:
      background-color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }
  .preview__cta:hover {
    background: var(--color-inverse-hover);
  }
  .preview__cta:active {
    transform: scale(var(--press-scale));
  }
  @media (min-width: 768px) {
    .chooser__grid {
      grid-template-columns: 1fr 1fr;
      gap: var(--space-6);
    }
    .preview__media {
      grid-template-columns: 1fr 1fr;
    }
  }
`;
