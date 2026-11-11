import { AnimatePresence, LazyMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { useLayoutEffect, useState } from 'react';
import { fade, motionTransition, prefersReducedMotion, spring } from '../lib/motion';
import loadMotionFeatures from '../lib/motion-features';

type Direction = 'neutral' | 'landscaping' | 'renovation';

interface PreviewService {
  title: string;
  price: string;
}

interface PreviewPhoto {
  src: string;
  alt: string;
}

const landscapingServices: PreviewService[] = [
  { title: 'Асфальтирование территорий', price: 'от 800 ₽/м²' },
  { title: 'Укладка брусчатки и тротуарной плитки', price: 'от 900 ₽/м²' },
  { title: 'Отмостка', price: 'от 800 ₽/м²' },
  { title: 'Водоотведение и дренаж', price: 'от 400 ₽' },
];

const renovationServices: PreviewService[] = [
  { title: 'Дизайн-проект квартиры', price: 'от 1 500 ₽/м²' },
  { title: 'Ремонт под ключ', price: 'от 25 000 ₽/м²' },
  { title: 'Черновая и чистовая отделка', price: 'от 12 000 ₽/м²' },
  { title: 'Инженерия и сантехника', price: 'от 4 500 ₽/м²' },
];

const previews = {
  landscaping: {
    heading: 'Благоустройство',
    services: landscapingServices,
    href: '/blagoustrojstvo',
    cta: 'Смотреть благоустройство',
    photos: [
      {
        src: '/images/png/объект-1.png',
        alt: 'Готовый участок: мощение и благоустройство территории',
      },
      {
        src: '/images/png/объект-2.png',
        alt: 'Благоустройство двора: дорожки и покрытие',
      },
    ] satisfies PreviewPhoto[],
  },
  renovation: {
    heading: 'Ремонт квартир',
    services: renovationServices,
    href: '/remont-kvartir',
    cta: 'Смотреть ремонт квартир',
    photos: [
      {
        src: '/images/webp/дизайн-1.webp',
        alt: 'Интерьер квартиры после ремонта под ключ',
      },
      {
        src: '/images/jpg/дизайн-2.jpg',
        alt: 'Дизайн и отделка жилой комнаты',
      },
    ] satisfies PreviewPhoto[],
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

  const shellClass = [
    'chooser__shell',
    hasSelection ? 'has-selection' : '',
    direction === 'landscaping' ? 'is-landscaping' : '',
    direction === 'renovation' ? 'is-renovation' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <section className="chooser section" aria-labelledby="chooser-title">
        <div className="container">
          <h2 id="chooser-title" className="chooser__title">
            Что нужно сделать
          </h2>

          <div className={shellClass}>
            <div className="chooser__grid" role="group" aria-label="Направления работ">
              <DirectionCard
                direction="landscaping"
                selected={direction === 'landscaping'}
                title="Благоустройство"
                text="Участок под ключ: асфальт, брусчатка, дренаж и отмостка — от расчёта до сдачи"
                onSelect={() => select('landscaping')}
              />
              <DirectionCard
                direction="renovation"
                selected={direction === 'renovation'}
                title="Ремонт квартир"
                text="Квартира под ключ: дизайн, отделка и инженерия — одна команда и понятный план работ"
                onSelect={() => select('renovation')}
              />
            </div>

            <div className="chooser__preview" aria-live="polite">
              {!hasSelection ? (
                <p className="chooser__hint">
                  Выберите направление — покажем услуги и примеры работ.
                </p>
              ) : (
                <div className="preview">
                  <AnimatePresence mode="wait">
                    <m.div
                      key={direction}
                      className="preview__content"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={motionTransition(fade)}
                    >
                      <PreviewContent {...previews[direction]} />
                    </m.div>
                  </AnimatePresence>
                </div>
              )}
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
  const reduced = prefersReducedMotion();

  return (
    <m.button
      type="button"
      className={`chooser__card chooser__card--${direction}${selected ? ' is-selected' : ''}`}
      aria-pressed={selected}
      onClick={onSelect}
      whileHover={reduced ? undefined : { scale: 1.02, y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      whileFocus={reduced ? undefined : { scale: 1.02 }}
      transition={motionTransition(spring)}
    >
      <span className="chooser__card-title">{title}</span>
      <span className="chooser__card-text">{text}</span>
      <span className="chooser__card-action">{selected ? 'Выбрано' : 'Выбрать'}</span>
    </m.button>
  );
}

function PreviewContent({
  heading,
  services,
  href,
  cta,
  photos,
}: {
  heading: string;
  services: PreviewService[];
  href: string;
  cta: string;
  photos: PreviewPhoto[];
}) {
  return (
    <>
      <h3 className="preview__heading">{heading}: услуги</h3>
      <ul className="preview__list">
        {services.map((service) => (
          <li key={service.title} className="preview__item">
            <span>{service.title}</span>
            <strong>{service.price}</strong>
          </li>
        ))}
      </ul>
      <div className="preview__media">
        {photos.map((photo) => (
          <img
            key={photo.src}
            className="preview__photo"
            src={encodeURI(photo.src)}
            alt={photo.alt}
            width={640}
            height={400}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
      <a className="preview__cta" href={href}>
        {cta}
      </a>
    </>
  );
}

const styles = `
  .chooser {
    --chooser-ink: var(--color-primary-contrast);
  }
  [data-theme='dark'] .chooser {
    --chooser-ink: #ffffff;
  }
  .chooser__title {
    margin: 0 0 var(--space-8);
    font-size: var(--font-size-xl);
    font-weight: 500;
    line-height: var(--line-height-tight);
  }
  .chooser__shell {
    position: relative;
    padding: var(--space-4);
    border-radius: var(--radius-2xl);
    border: 1px solid var(--glass-border);
    background:
      linear-gradient(
        180deg,
        var(--glass-highlight) 0%,
        color-mix(in srgb, var(--color-bg) 42%, transparent) 45%,
        color-mix(in srgb, var(--color-bg) 58%, transparent) 100%
      );
    -webkit-backdrop-filter: blur(var(--glass-blur));
    backdrop-filter: blur(var(--glass-blur));
    box-shadow:
      inset 0 1px 0 var(--glass-highlight),
      0 var(--space-2) var(--space-6) var(--shadow-color);
    transition:
      background var(--ambient-duration) var(--ease-out),
      border-color var(--ambient-duration) var(--ease-out);
  }
  .chooser__shell.is-landscaping {
    background:
      linear-gradient(
        180deg,
        var(--glass-highlight) 0%,
        color-mix(in srgb, var(--color-ambient-landscape) 70%, transparent) 45%,
        color-mix(in srgb, var(--color-ambient-landscape) 82%, transparent) 100%
      );
  }
  .chooser__shell.is-renovation {
    background:
      linear-gradient(
        180deg,
        var(--glass-highlight) 0%,
        color-mix(in srgb, var(--color-ambient-renovation) 70%, transparent) 45%,
        color-mix(in srgb, var(--color-ambient-renovation) 82%, transparent) 100%
      );
  }
  .chooser__grid {
    position: relative;
    z-index: 1;
    display: grid;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }
  .chooser__shell.has-selection .chooser__grid {
    margin-bottom: 0;
  }
  .chooser__card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
    text-align: left;
    padding: var(--space-6);
    border: 1px solid color-mix(in srgb, var(--chooser-ink) 16%, transparent);
    border-radius: var(--radius-xl);
    background: var(--color-primary);
    color: var(--chooser-ink);
    font: inherit;
    cursor: pointer;
    box-shadow: 0 var(--space-2) var(--space-6) var(--shadow-color);
    transition:
      border-color var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out),
      background-color var(--duration-fast) var(--ease-out),
      border-radius var(--duration-fast) var(--ease-out),
      margin-bottom var(--duration-fast) var(--ease-out);
  }
  .chooser__card--landscaping {
    view-transition-name: dir-landscaping;
  }
  .chooser__card--renovation {
    view-transition-name: dir-renovation;
  }
  .chooser__shell.has-selection .chooser__card:not(.is-selected) {
    background: var(--color-primary-active);
    margin-bottom: var(--space-2);
  }
  .chooser__card.is-selected {
    z-index: 2;
    border-color: color-mix(in srgb, var(--chooser-ink) 22%, transparent);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: 0 var(--space-1) var(--space-4) var(--shadow-color);
  }
  .chooser__card-title {
    font-size: var(--font-size-xl);
    font-weight: 700;
    line-height: var(--line-height-tight);
  }
  .chooser__card-text {
    color: color-mix(in srgb, var(--chooser-ink) 88%, transparent);
  }
  .chooser__card-action {
    margin-top: auto;
    font-weight: 600;
    color: var(--chooser-ink);
  }
  .chooser__preview {
    position: relative;
    z-index: 1;
    min-height: 1.5rem;
  }
  .chooser__hint {
    margin: 0;
    padding: var(--space-2) 0 0;
    color: var(--color-text-muted);
  }
  .preview {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    border: 1px solid color-mix(in srgb, var(--chooser-ink) 16%, transparent);
    background: var(--color-primary);
    box-shadow: 0 var(--space-2) var(--space-6) var(--shadow-color);
    color: var(--chooser-ink);
  }
  .chooser__shell.has-selection .preview {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .preview__content {
    will-change: transform, opacity;
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
    border-bottom: 1px solid color-mix(in srgb, var(--chooser-ink) 18%, transparent);
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
  .preview__photo {
    display: block;
    width: 100%;
    height: 20rem;
    object-fit: cover;
    object-position: top;
    border-radius: var(--radius-lg);
    border: 1px solid color-mix(in srgb, var(--chooser-ink) 14%, transparent);
    background: color-mix(in srgb, var(--chooser-ink) 8%, transparent);
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
      gap: var(--space-4);
    }
    .preview__media {
      grid-template-columns: 1fr 1fr;
    }
  }
`;
