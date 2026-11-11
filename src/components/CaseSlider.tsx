import { AnimatePresence, LazyMotion, LayoutGroup, type PanInfo } from 'motion/react';
import * as m from 'motion/react-m';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { motionTransition, prefersReducedMotion, spring } from '../lib/motion';
import loadMotionFeatures from '../lib/motion-features';

export interface CaseItem {
  title: string;
  category: string;
}

interface Props {
  items: CaseItem[];
  variant?: 'light' | 'dark';
  showActions?: boolean;
  viewLabel?: string;
  leadLabel?: string;
  leadHref?: string;
}

function usePerView(): number {
  const [perView, setPerView] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches ? 2 : 1,
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setPerView(mq.matches ? 2 : 1);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return perView;
}

export default function CaseSlider({
  items,
  variant = 'light',
  showActions = false,
  viewLabel = 'Смотреть',
  leadLabel = 'Оставить заявку',
  leadHref = '#lead',
}: Props) {
  const labelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const perView = usePerView();
  const maxIndex = Math.max(0, items.length - perView);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const dark = variant === 'dark';
  const reduced = prefersReducedMotion();

  const measureStep = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) {
      return 0;
    }
    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement | undefined;
    if (!second) {
      return first.offsetWidth;
    }
    return second.offsetLeft - first.offsetLeft;
  }, []);

  useEffect(() => {
    const update = () => setStep(measureStep());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [measureStep, perView, items.length]);

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  const goTo = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(maxIndex, next)));
    },
    [maxIndex],
  );

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (step === 0) return;
    const offset = info.offset.x + info.velocity.x * 0.2;
    if (offset < -40) {
      goTo(index + 1);
    } else if (offset > 40) {
      goTo(index - 1);
    }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const root = rootRef.current;
      if (!root || !root.contains(document.activeElement)) {
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(index + 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(index - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, index]);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <div
        ref={rootRef}
        className={`cases-slider${dark ? ' is-dark' : ''} reveal`}
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={labelId}
        tabIndex={0}
      >
        <p id={labelId} className="cases-slider__status">
          Слайд {index + 1} из {maxIndex + 1}
        </p>

        <div className="cases-slider__viewport">
          <m.div
            ref={trackRef}
            className="cases-slider__track"
            drag={reduced ? false : 'x'}
            dragConstraints={{ left: -maxIndex * step, right: 0 }}
            dragElastic={0.12}
            dragListener={!reduced}
            animate={{ x: -index * step }}
            transition={motionTransition(spring)}
            onDragEnd={onDragEnd}
          >
            {items.map((item) => (
              <article key={item.title} className="cases__card glow" aria-roledescription="slide">
                <div
                  className="cases__media"
                  role="img"
                  aria-label={`Фото: ${item.title} — будет добавлено`}
                >
                  <span>{item.category}</span>
                </div>
                <h3 className="cases__name">{item.title}</h3>
                <p className="cases__category">{item.category}</p>
                {showActions ? (
                  <div className="cases__actions">
                    <a className="cases__action cases__action--ghost" href="#cases-title">
                      {viewLabel}
                    </a>
                    <a
                      className="cases__action cases__action--primary"
                      href={leadHref}
                      data-lead-dialog
                    >
                      {leadLabel}
                    </a>
                  </div>
                ) : null}
              </article>
            ))}
          </m.div>
        </div>

        <div className="cases-slider__controls">
          <button
            type="button"
            className="cases-slider__nav"
            aria-label="Предыдущий слайд"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
          >
            ←
          </button>

          <LayoutGroup>
            <div className="cases-slider__dots" role="tablist" aria-label="Слайды">
              {Array.from({ length: maxIndex + 1 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Слайд ${i + 1}`}
                  className="cases-slider__dot"
                  onClick={() => goTo(i)}
                >
                  <AnimatePresence>
                    {i === index ? (
                      <m.span
                        className="cases-slider__dot-active"
                        layoutId="cases-dot"
                        transition={motionTransition(spring)}
                      />
                    ) : null}
                  </AnimatePresence>
                </button>
              ))}
            </div>
          </LayoutGroup>

          <button
            type="button"
            className="cases-slider__nav"
            aria-label="Следующий слайд"
            disabled={index === maxIndex}
            onClick={() => goTo(index + 1)}
          >
            →
          </button>
        </div>

        <style>{styles}</style>
      </div>
    </LazyMotion>
  );
}

const styles = `
  .cases-slider {
    outline: none;
  }
  .cases-slider__status {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  .cases-slider__viewport {
    overflow: hidden;
  }
  .cases-slider__track {
    display: flex;
    gap: var(--space-4);
    cursor: grab;
    touch-action: pan-y;
  }
  .cases-slider__track:active {
    cursor: grabbing;
  }
  .cases__card {
    flex: 0 0 calc(100% - var(--space-8));
    min-width: 0;
    background: var(--color-bg);
    border-radius: var(--radius-xl);
    overflow: hidden;
    padding-bottom: var(--space-4);
    transition:
      translate var(--duration-base) var(--ease-out),
      box-shadow var(--duration-base) var(--ease-out);
  }
  .cases-slider.is-dark .cases__card {
    background: color-mix(in srgb, var(--color-on-inverse) 6%, var(--color-bg-inverse));
    border: 1px solid color-mix(in srgb, var(--color-on-inverse) 16%, transparent);
  }
  @media (hover: hover) {
    .cases__card:hover {
      translate: 0 -2px;
      box-shadow: var(--shadow-glow);
    }
    .cases__card:hover .cases__media img {
      scale: 1.03;
    }
  }
  .cases__media img {
    transition: scale var(--duration-slow) var(--ease-out);
  }
  .cases__media {
    min-height: 11rem;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    display: grid;
    place-items: center;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
  .cases-slider.is-dark .cases__media {
    background: color-mix(in srgb, var(--color-on-inverse) 10%, var(--color-bg-inverse));
    border-bottom-color: color-mix(in srgb, var(--color-on-inverse) 16%, transparent);
    color: color-mix(in srgb, var(--color-on-inverse) 55%, transparent);
  }
  .cases__name {
    margin: var(--space-4) var(--space-4) var(--space-1);
    font-size: var(--font-size-lg);
    font-weight: 600;
    line-height: var(--line-height-tight);
  }
  .cases__category {
    margin: 0 var(--space-4);
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
  .cases-slider.is-dark .cases__category {
    color: color-mix(in srgb, var(--color-on-inverse) 65%, transparent);
  }
  .cases__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin: var(--space-4) var(--space-4) 0;
  }
  .cases__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    transition:
      background-color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }
  .cases__action:active {
    transform: scale(var(--press-scale));
  }
  .cases__action--ghost {
    border: 1px solid var(--color-border);
    color: var(--color-text);
  }
  .cases__action--ghost:hover {
    background: var(--color-ghost-hover);
  }
  .cases-slider.is-dark .cases__action--ghost {
    border-color: color-mix(in srgb, var(--color-on-inverse) 35%, transparent);
    color: var(--color-on-inverse);
  }
  .cases-slider.is-dark .cases__action--ghost:hover {
    background: color-mix(in srgb, var(--color-on-inverse) 10%, transparent);
  }
  .cases__action--primary {
    background: var(--color-primary);
    color: var(--color-primary-contrast);
  }
  .cases__action--primary:hover {
    background: var(--color-primary-hover);
  }
  .cases__action--primary:active {
    background: var(--color-primary-active);
  }
  .cases-slider__controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    margin-top: var(--space-6);
  }
  .cases-slider__nav {
    width: 2.75rem;
    height: 2.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    background: var(--color-bg);
    color: var(--color-text);
    font: inherit;
    font-size: var(--font-size-lg);
    cursor: pointer;
    transition:
      background-color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }
  .cases-slider.is-dark .cases-slider__nav {
    background: color-mix(in srgb, var(--color-on-inverse) 8%, var(--color-bg-inverse));
    border-color: color-mix(in srgb, var(--color-on-inverse) 20%, transparent);
    color: var(--color-on-inverse);
  }
  .cases-slider__nav:hover:not(:disabled) {
    background: var(--color-surface);
  }
  .cases-slider__nav:active:not(:disabled) {
    transform: scale(var(--press-scale));
  }
  .cases-slider__nav:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .cases-slider__dots {
    display: flex;
    gap: var(--space-2);
  }
  .cases-slider__dot {
    position: relative;
    width: 0.65rem;
    height: 0.65rem;
    padding: 0;
    border: 0;
    border-radius: var(--radius-full);
    background: var(--color-border);
    cursor: pointer;
  }
  .cases-slider.is-dark .cases-slider__dot {
    background: color-mix(in srgb, var(--color-on-inverse) 25%, transparent);
  }
  .cases-slider__dot-active {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--color-primary);
  }
  @media (min-width: 768px) {
    .cases-slider__track {
      gap: var(--space-6);
    }
    .cases__card {
      flex-basis: calc((100% - var(--space-6)) / 2);
    }
  }
`;
