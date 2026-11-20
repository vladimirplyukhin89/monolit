import type { Transition } from 'motion';
import { AnimatePresence, LazyMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { useLayoutEffect, useState } from 'react';
import blindAreaPhoto from '../../docs/content/media/blagoustrojstvo/cases/otmostki/05.jpg';
import drainagePhoto from '../../docs/content/media/blagoustrojstvo/cases/otmostki/04.jpg';
import { fade, motionTransition, prefersReducedMotion, spring } from '../lib/motion';
import loadMotionFeatures from '../lib/motion-features';

function assetSrc(file: string | { src: string }): string {
  return typeof file === 'string' ? file : file.src;
}

/** Мягче общей пружины: только перетекание вкладки и списка. */
const liquid: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 30,
  mass: 1,
};

type Direction = 'neutral' | 'landscaping' | 'renovation';

interface PreviewPhoto {
  src: string;
  alt: string;
}

interface PreviewService {
  id: string;
  title: string;
  price: string;
  summary: string;
  photo: PreviewPhoto;
}

const landscapingServices: PreviewService[] = [
  {
    id: 'asphalt',
    title: 'Асфальтирование территорий',
    price: 'от 800 ₽/м²',
    summary:
      'Покрываем дворы частных домов, парковки и подъездные дороги. Работаем по площади: от площадки у дома до въезда на участок.',
    photo: {
      src: '/images/png/объект-2.png',
      alt: 'Пример благоустройства: покрытие въезда и площадки у дома',
    },
  },
  {
    id: 'paving',
    title: 'Укладка брусчатки и тротуарной плитки',
    price: 'от 900 ₽/м²',
    summary:
      'Укладываем брусчатку и тротуарную плитку на дорожках и площадках. Тем же камнем закрываем парковочные зоны у дома.',
    photo: {
      src: '/images/png/объект-1.png',
      alt: 'Пример благоустройства: мощение двора у кирпичного дома',
    },
  },
  {
    id: 'blind-area',
    title: 'Отмостка',
    price: 'от 800 ₽/м²',
    summary:
      'Делаем отмостку вокруг дома из брусчатки, тротуарной плитки или бетона. Полоса идёт по периметру и стыкуется с покрытием двора.',
    photo: {
      src: assetSrc(blindAreaPhoto),
      alt: 'Отмостка из тротуарной плитки вдоль стены дома',
    },
  },
  {
    id: 'drainage',
    title: 'Водоотведение и дренаж',
    price: 'от 400 ₽',
    summary:
      'Устраиваем дренаж участка, ливневую канализацию и отвод воды от дома. Система забирает воду с двора и с покрытия.',
    photo: {
      src: assetSrc(drainagePhoto),
      alt: 'Водосток и ливневый лоток у отмостки дома',
    },
  },
];

const renovationServices: PreviewService[] = [
  {
    id: 'design',
    title: 'Дизайн-проект квартиры',
    price: 'от 1 500 ₽/м²',
    summary:
      'Готовим планировку, схему света и подбор материалов до старта ремонта. По проекту видно, какие работы войдут в отделку.',
    photo: {
      src: '/images/webp/дизайн-1.webp',
      alt: 'Пример ремонта квартиры: гостиная и столовая после отделки',
    },
  },
  {
    id: 'turnkey',
    title: 'Ремонт под ключ',
    price: 'от 25 000 ₽/м²',
    summary:
      'Берём ремонт от черновых работ до квартиры, в которую можно въехать. Отделку и инженерию ведёт одна команда по согласованному плану.',
    photo: {
      src: '/images/jpg/дизайн-3.jpg',
      alt: 'Пример ремонта квартиры: кухня после отделки',
    },
  },
  {
    id: 'finishing',
    title: 'Черновая и чистовая отделка',
    price: 'от 12 000 ₽/м²',
    summary:
      'Делаем черновую подготовку квартиры и чистовую отделку. В чистовую входят покрытия стен, полов и потолков, которые остаются после сдачи.',
    photo: {
      src: '/images/jpg/дизайн-2.jpg',
      alt: 'Пример ремонта квартиры: чистовая отделка стены и пола',
    },
  },
  {
    id: 'engineering',
    title: 'Инженерия и сантехника',
    price: 'от 4 500 ₽/м²',
    summary:
      'Разводим электрику: точки света и розетки по проекту. По сантехнике делаем разводку воды и установку приборов в санузлах и на кухне.',
    photo: {
      src: '/images/webp/дизайн-4.webp',
      alt: 'Пример ремонта квартиры: санузел с установленной сантехникой',
    },
  },
];

const previews = {
  landscaping: {
    id: 'landscaping' as const,
    heading: 'Благоустройство',
    services: landscapingServices,
    href: '/blagoustrojstvo',
    cta: 'Смотреть благоустройство',
  },
  renovation: {
    id: 'renovation' as const,
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
  const reduced = prefersReducedMotion();

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
      <section id="directions" className="chooser section" aria-labelledby="chooser-title">
        <div className="container">
          <p className="eyebrow">Направления</p>
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
              <AnimatePresence initial={false} mode="popLayout">
                {direction === 'landscaping' ? renderPreview('landscaping', reduced) : null}
              </AnimatePresence>
              <DirectionCard
                direction="renovation"
                selected={direction === 'renovation'}
                title="Ремонт квартир"
                text="Квартира под ключ: дизайн, отделка и инженерия — одна команда и понятный план работ"
                onSelect={() => select('renovation')}
              />
              <AnimatePresence initial={false} mode="popLayout">
                {direction === 'renovation' ? renderPreview('renovation', reduced) : null}
              </AnimatePresence>
            </div>
            {!hasSelection ? (
              <p className="chooser__hint">
                Выберите направление — покажем услуги и примеры работ.
              </p>
            ) : null}
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
      {selected ? (
        reduced ? (
          <span className="chooser__fill" aria-hidden="true" />
        ) : (
          <m.span
            className="chooser__fill"
            layoutId="chooser-fill"
            transition={liquid}
            aria-hidden="true"
          />
        )
      ) : null}
      <span className="chooser__card-title">{title}</span>
      <span className="chooser__card-text">{text}</span>
      <span className="chooser__card-action">{selected ? 'Выбрано' : 'Выбрать'}</span>
    </m.button>
  );
}

function renderPreview(direction: 'landscaping' | 'renovation', reduced: boolean) {
  return (
    <m.div
      key={direction}
      className="chooser__preview"
      initial={reduced ? false : { opacity: 0, y: '0.75rem' }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: '0.75rem' }}
      transition={motionTransition(liquid)}
    >
      <div className="preview">
        <PreviewContent {...previews[direction]} reduced={reduced} />
      </div>
    </m.div>
  );
}

function PreviewContent({
  id,
  heading,
  services,
  href,
  cta,
  reduced,
}: {
  id: 'landscaping' | 'renovation';
  heading: string;
  services: PreviewService[];
  href: string;
  cta: string;
  reduced: boolean;
}) {
  const panelId = `preview-service-${id}`;
  const [activeId, setActiveId] = useState(services[0].id);
  const active = services.find((service) => service.id === activeId) ?? services[0];

  return (
    <>
      <h3 className="preview__heading">{heading}: услуги</h3>
      <ul className="preview__list">
        {services.map((service, index) => {
          const selected = service.id === active.id;
          return (
            <m.li
              key={service.id}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...motionTransition(fade),
                delay: reduced ? 0 : index * 0.04,
              }}
            >
              <button
                type="button"
                id={`${panelId}-${service.id}`}
                className={`preview__item${selected ? ' is-active' : ''}`}
                aria-expanded={selected}
                aria-controls={panelId}
                onClick={() => setActiveId(service.id)}
              >
                <span className="preview__name">{service.title}</span>
                <strong>{service.price}</strong>
              </button>
            </m.li>
          );
        })}
      </ul>
      <div
        id={panelId}
        className="preview__slot"
        role="region"
        aria-live="polite"
        aria-labelledby={`${panelId}-${active.id}`}
      >
        <AnimatePresence initial={false}>
          <m.div
            key={active.id}
            className="preview__detail"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={motionTransition(fade)}
          >
            <p className="preview__summary">{active.summary}</p>
            <img
              className="preview__photo"
              src={encodeURI(active.photo.src)}
              alt={active.photo.alt}
              width={640}
              height={400}
              loading="lazy"
              decoding="async"
            />
          </m.div>
        </AnimatePresence>
      </div>
      <a className="preview__cta" href={href}>
        {cta}
      </a>
    </>
  );
}

const newLocal = `
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
  .chooser__card.is-selected + .chooser__preview {
    margin-top: calc(var(--space-3) * -1);
  }
  .chooser__card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
    text-align: left;
    padding: var(--space-6);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl);
    background: color-mix(in srgb, var(--color-bg) 64%, transparent);
    color: var(--color-text);
    font: inherit;
    cursor: pointer;
    box-shadow: inset 0 1px 0 var(--glass-highlight);
    transition:
      border-color var(--duration-fast) var(--ease-out),
      background-color var(--duration-base) var(--ease-out),
      box-shadow var(--duration-base) var(--ease-out),
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
    margin-bottom: var(--space-2);
  }
  .chooser__card.is-selected {
    z-index: 2;
    border-color: transparent;
    background: transparent;
    box-shadow: none;
    color: var(--color-primary-contrast);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .chooser__fill {
    position: absolute;
    z-index: 0;
    display: block;
    inset: -1px;
    border-radius: inherit;
    background: var(--color-primary);
    pointer-events: none;
  }
  .chooser__card-title,
  .chooser__card-text,
  .chooser__card-action {
    position: relative;
    z-index: 1;
  }
  .chooser__card-title {
    font-size: var(--font-size-xl);
    font-weight: 700;
    line-height: var(--line-height-tight);
  }
  .chooser__card-text {
    color: var(--color-text-muted);
  }
  .chooser__card.is-selected .chooser__card-text {
    color: var(--color-primary-contrast);
  }
  .chooser__card-action {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    background: var(--color-primary);
    color: var(--color-primary-contrast);
    font-size: var(--font-size-lg);
    font-weight: 600;
    line-height: var(--line-height-tight);
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
    border: 1px solid var(--glass-border);
    background: color-mix(in srgb, var(--color-bg) 78%, transparent);
    box-shadow: inset 0 1px 0 var(--glass-highlight);
    color: var(--color-text);
  }
  .chooser__shell.has-selection .preview {
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .preview__heading {
    margin: 0 0 var(--space-4);
    font-size: var(--font-size-lg);
    font-weight: 600;
  }
  .preview__list {
    list-style: none;
    margin: 0 0 var(--space-4);
    padding: 0;
    display: grid;
    gap: var(--space-2);
  }
  .preview__item {
    --preview-item-outset: calc(var(--space-6) - 5px);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-4);
    width: calc(100% + 2 * var(--preview-item-outset));
    margin-inline: calc(-1 * var(--preview-item-outset));
    padding-block: var(--space-3);
    padding-inline: var(--preview-item-outset);
    border: 0;
    border-radius: var(--radius-md);
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: var(--font-size-base);
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition:
      background-color var(--duration-base) var(--ease-out),
      color var(--duration-base) var(--ease-out);
  }
  .preview__item:hover,
  .preview__item:focus-visible,
  .preview__item.is-active,
  .preview__item.is-active:hover,
  .preview__item.is-active:focus-visible {
    background: var(--color-primary);
    color: var(--color-primary-contrast);
  }
  .preview__name {
    position: relative;
    min-width: 0;
    padding-left: var(--space-4);
    font-weight: 500;
  }
  .preview__name::before {
    content: '';
    position: absolute;
    top: 0.5lh;
    left: 0;
    width: 0.4em;
    height: 0.4em;
    border-radius: var(--radius-full);
    background-color: var(--color-primary);
    transform: translateY(-50%);
    animation: preview-name-pulse calc(var(--duration-slow) * 5) var(--ease-in-out) infinite;
  }
  .preview__item:hover .preview__name::before,
  .preview__item:focus-visible .preview__name::before,
  .preview__item.is-active .preview__name::before {
    background-color: var(--color-primary-contrast);
    animation: none;
  }
  @keyframes preview-name-pulse {
    0%,
    100% {
      transform: translateY(-50%) scale(1);
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-primary) 50%, transparent);
    }
    50% {
      transform: translateY(-50%) scale(1.2);
      box-shadow: 0 0 0 0.28em color-mix(in srgb, var(--color-primary) 0%, transparent);
    }
  }
  .preview__item strong {
    flex-shrink: 0;
    white-space: nowrap;
    font-weight: 600;
  }
  .preview__slot {
    display: grid;
    margin-bottom: var(--space-6);
  }
  .preview__detail {
    grid-area: 1 / 1;
    display: grid;
    gap: var(--space-4);
    align-items: start;
  }
  .preview__summary {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 500;
    min-height: calc(var(--line-height-base) * 4em);
    line-height: var(--line-height-base);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    overflow: hidden;
  }
  .preview__photo {
    display: block;
    width: 100%;
    height: 12rem;
    object-fit: cover;
    object-position: center;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    background: var(--color-bg-muted);
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
      border-color var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }
  .preview__cta:hover,
  .preview__cta:focus-visible,
  .preview__cta:active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-primary-contrast);
  }
  .preview__cta:active {
    transform: scale(var(--press-scale));
  }
  @media (prefers-reduced-motion: reduce) {
    .preview__item,
    .preview__cta {
      transition: none;
    }
    .preview__name::before {
      animation: none;
    }
  }
  @media (min-width: 768px) {
    .chooser__card-action {
      font-size: inherit;
    }
    .chooser__grid {
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }
    .preview__item {
      align-items: center;
      padding-block: var(--space-3);
      padding-inline: calc(var(--preview-item-outset) + var(--space-3));
    }
    .chooser__card--landscaping {
      order: 1;
    }
    .chooser__card--renovation {
      order: 2;
    }
    .chooser__preview {
      order: 3;
      grid-column: 1 / -1;
    }
    .chooser__card.is-selected + .chooser__preview {
      margin-top: calc(var(--space-4) * -1);
    }
    .preview__detail {
      grid-template-columns: 1fr 1.15fr;
      gap: var(--space-6);
    }
    .preview__summary {
      min-height: 0;
    }
    .preview__photo {
      height: 14rem;
    }
  }
`;
const styles = newLocal;
