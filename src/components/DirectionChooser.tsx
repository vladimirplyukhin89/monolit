import { useLayoutEffect, useState } from 'react';

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
    <section className="chooser section" aria-labelledby="chooser-title">
      <div className="container">
        <h2 id="chooser-title" className="chooser__title">
          Выберите направление
        </h2>

        <div
          className={`chooser__shell${hasSelection ? ' is-active' : ''}`}
        >
          <div className="chooser__grid" role="group" aria-label="Направления работ">
            <button
              type="button"
              className={`chooser__card chooser__card--landscaping${direction === 'landscaping' ? ' is-selected' : ''}`}
              aria-pressed={direction === 'landscaping'}
              onClick={() => select('landscaping')}
            >
              <span className="chooser__card-title">Благоустройство</span>
              <span className="chooser__card-text">
                Участок под ключ: асфальт, брусчатка, дренаж, отмостки
              </span>
              <span className="chooser__card-action">Выбрать</span>
            </button>
            <button
              type="button"
              className={`chooser__card chooser__card--renovation${direction === 'renovation' ? ' is-selected' : ''}`}
              aria-pressed={direction === 'renovation'}
              onClick={() => select('renovation')}
            >
              <span className="chooser__card-title">Ремонт квартир</span>
              <span className="chooser__card-text">[Краткое описание направления]</span>
              <span className="chooser__card-action">Выбрать</span>
            </button>
          </div>

          <div className="chooser__preview" aria-live="polite">
            {!hasSelection ? (
              <p className="chooser__hint">Нажмите на раздел, чтобы увидеть услуги.</p>
            ) : null}

            {direction === 'landscaping' ? (
              <Preview
                heading="Благоустройство"
                services={landscapingServices}
                href="/blagoustrojstvo"
                cta="Смотреть благоустройство"
              />
            ) : null}

            {direction === 'renovation' ? (
              <Preview
                heading="Ремонт квартир"
                services={renovationServices}
                href="/remont-kvartir"
                cta="Смотреть ремонт квартир"
              />
            ) : null}
          </div>
        </div>
      </div>
      <style>{styles}</style>
    </section>
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
    border-radius: var(--radius-xl);
    padding: 0;
    transition:
      background-color var(--ambient-duration) ease,
      padding var(--ambient-duration) ease;
  }
  .chooser__shell.is-active {
    background: var(--color-primary);
    padding: var(--space-4);
  }
  .chooser__grid {
    display: grid;
    gap: var(--space-4);
  }
  .chooser__card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
    text-align: left;
    padding: var(--space-6);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-xl);
    color: var(--color-chooser-text);
    font: inherit;
    cursor: pointer;
    transition:
      border-color var(--ambient-duration) ease,
      transform var(--ambient-duration) ease,
      background-color var(--ambient-duration) ease,
      box-shadow var(--ambient-duration) ease,
      border-radius var(--ambient-duration) ease;
  }
  .chooser__card--landscaping {
    background: var(--color-ambient-landscape);
  }
  .chooser__card--renovation {
    background: var(--color-ambient-renovation);
  }
  .chooser__card:hover {
    border-color: color-mix(in srgb, var(--color-primary) 50%, var(--color-border));
  }
  .chooser__card.is-selected {
    border-color: var(--color-bg-inverse);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px color-mix(in srgb, var(--color-bg-inverse) 18%, transparent);
  }
  .chooser__shell:not(.is-active) .chooser__card.is-selected {
    border-color: var(--color-primary);
    box-shadow: none;
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
    margin-top: var(--space-4);
  }
  .chooser__shell.is-active .chooser__preview {
    margin-top: var(--space-4);
  }
  .chooser__shell.is-active .preview,
  .chooser__shell.is-active .chooser__card {
    border-radius: max(var(--radius-md), calc(var(--radius-xl) - var(--space-4)));
  }
  .chooser__shell:not(.is-active) .chooser__preview {
    margin-top: var(--space-8);
  }
  .chooser__hint {
    margin: 0;
    color: var(--color-text-muted);
  }
  .preview {
    background: var(--color-bg);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    animation: preview-in var(--ambient-duration) ease;
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
  @keyframes preview-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @media (min-width: 768px) {
    .chooser__shell.is-active {
      padding: var(--space-6);
      border-radius: var(--radius-2xl);
    }
    .chooser__shell.is-active .preview,
    .chooser__shell.is-active .chooser__card {
      border-radius: max(var(--radius-md), calc(var(--radius-2xl) - var(--space-6)));
    }
    .chooser__grid {
      grid-template-columns: 1fr 1fr;
      gap: var(--space-6);
    }
    .preview__media {
      grid-template-columns: 1fr 1fr;
    }
  }
`;
