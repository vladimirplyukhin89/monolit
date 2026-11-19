import { AnimatePresence, LazyMotion, LayoutGroup, type PanInfo } from 'motion/react';
import * as m from 'motion/react-m';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { motionTransition, prefersReducedMotion, spring } from '../lib/motion';
import loadMotionFeatures from '../lib/motion-features';

export interface PhotoSlide {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
}

interface Props {
  slides: readonly PhotoSlide[];
  variant: 'peek' | 'snap';
  label: string;
  /** Сброс на первый кадр, когда панель таба снова становится активной. */
  active?: boolean;
  reveal?: boolean;
  tone?: 'default' | 'inverse';
}

function usePerView(): number {
  // Всегда 1 на первом рендере: сервер и клиент должны совпасть, иначе React
  // заменяет узел и reveal больше не может его показать.
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setPerView(mq.matches ? 2 : 1);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return perView;
}

export default function PhotoSlider({
  slides,
  variant,
  label,
  active = true,
  reveal = true,
  tone = 'default',
}: Props) {
  const labelId = useId();
  const dotLayoutId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const snapPerView = usePerView();
  const perView = variant === 'snap' ? snapPerView : 1;
  const maxIndex = Math.max(0, slides.length - perView);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [pad, setPad] = useState(0);
  const activeRef = useRef(active);
  const reduced = prefersReducedMotion();
  const peek = variant === 'peek';
  const origin = peek ? pad : 0;

  const measure = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || track.children.length === 0) {
      return { step: 0, pad: 0 };
    }
    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement | undefined;
    const nextStep = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    const nextPad =
      peek && viewport ? Math.max(0, (viewport.clientWidth - first.offsetWidth) / 2) : 0;
    return { step: nextStep, pad: nextPad };
  }, [peek]);

  useLayoutEffect(() => {
    const apply = () => {
      const next = measure();
      setStep(next.step);
      setPad(next.pad);
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, [measure, perView, slides.length, active]);

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (active && !activeRef.current) {
      setIndex(0);
    }
    activeRef.current = active;
  }, [active]);

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
    if (!active) return;
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
  }, [active, goTo, index]);

  const pageCount = maxIndex + 1;
  const page = Math.min(index, maxIndex);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <div
        ref={rootRef}
        className={`photo-slider photo-slider--${variant}${tone === 'inverse' ? ' photo-slider--inverse' : ''}${reveal ? ' reveal' : ''}`}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
      >
        <p id={labelId} className="photo-slider__status" aria-live="polite">
          Слайд {page + 1} из {pageCount}
        </p>

        <div ref={viewportRef} className="photo-slider__viewport">
          <m.div
            ref={trackRef}
            className="photo-slider__track"
            drag={reduced || maxIndex === 0 ? false : 'x'}
            dragConstraints={{ left: origin - maxIndex * step, right: origin }}
            dragElastic={0.12}
            dragListener={!reduced && maxIndex > 0}
            animate={{ x: origin - index * step }}
            transition={motionTransition(spring)}
            onDragEnd={onDragEnd}
          >
            {slides.map((slide, i) => {
              const current = i >= index && i < index + perView;
              const featured = peek && i === index;
              return (
                <div
                  key={slide.src}
                  className="photo-slider__slide"
                  aria-roledescription="slide"
                  aria-hidden={!current}
                >
                  <m.div
                    className={`photo-slider__frame${featured ? ' is-selected' : ''}`}
                    animate={
                      peek
                        ? { scale: featured ? 1 : 0.92, opacity: featured ? 1 : 0.78 }
                        : { scale: 1, opacity: 1 }
                    }
                    transition={motionTransition(spring)}
                  >
                    <img
                      src={slide.src}
                      srcSet={slide.srcSet || undefined}
                      sizes={slide.sizes}
                      width={slide.width}
                      height={slide.height}
                      alt={slide.alt}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </m.div>
                </div>
              );
            })}
          </m.div>
        </div>

        <div className="photo-slider__controls">
          <button
            type="button"
            className="photo-slider__nav"
            aria-label="Предыдущий слайд"
            disabled={page === 0}
            onClick={() => goTo(index - 1)}
          >
            ←
          </button>

          <LayoutGroup>
            <div className="photo-slider__dots" role="tablist" aria-label="Слайды">
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === page}
                  aria-label={`Слайд ${i + 1}`}
                  className="photo-slider__dot"
                  onClick={() => goTo(i)}
                >
                  <AnimatePresence>
                    {i === page ? (
                      <m.span
                        className="photo-slider__dot-active"
                        layoutId={dotLayoutId}
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
            className="photo-slider__nav"
            aria-label="Следующий слайд"
            disabled={page === maxIndex}
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
  .photo-slider {
    position: relative;
    outline: none;
    min-width: 0;
  }
  .photo-slider__status {
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
  .photo-slider__viewport {
    overflow: hidden;
  }
  .photo-slider__track {
    display: flex;
    align-items: center;
    cursor: grab;
    touch-action: pan-y;
  }
  .photo-slider__track:active {
    cursor: grabbing;
  }
  .photo-slider__slide {
    min-width: 0;
  }
  .photo-slider__frame {
    min-width: 0;
  }
  .photo-slider__frame img {
    display: block;
    width: 100%;
  }
  .photo-slider--peek .photo-slider__track {
    gap: var(--space-3);
  }
  .photo-slider--peek .photo-slider__slide {
    flex: 0 0 76%;
  }
  .photo-slider--peek .photo-slider__viewport {
    /* Место под --shadow-glow: overflow вьюпорта иначе срезает ореол */
    padding-block: var(--space-8);
  }
  .photo-slider--peek .photo-slider__frame {
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    aspect-ratio: 4 / 3;
  }
  .photo-slider--peek .photo-slider__frame.is-selected {
    /* Тень без transition: color-mix в --shadow-glow не интерполируется и гаснет.
       overflow на кадре тоже срезает тень вместе со скруглением, поэтому его нет. */
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
    box-shadow: var(--shadow-glow);
  }
  .photo-slider--peek .photo-slider__frame img {
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
  .photo-slider--snap .photo-slider__track {
    align-items: stretch;
    gap: var(--space-4);
  }
  .photo-slider--snap .photo-slider__slide {
    flex: 0 0 100%;
  }
  .photo-slider--snap .photo-slider__frame {
    height: 100%;
    background: var(--color-bg);
    border-radius: var(--radius-xl);
    padding: var(--space-3);
  }
  .photo-slider--snap .photo-slider__frame img {
    height: auto;
    border-radius: var(--radius-lg);
  }
  .photo-slider__controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    margin-top: var(--space-6);
  }
  .photo-slider__nav {
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
  .photo-slider__nav:hover:not(:disabled) {
    background: var(--color-surface);
  }
  .photo-slider__nav:active:not(:disabled) {
    transform: scale(var(--press-scale));
  }
  .photo-slider__nav:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .photo-slider__dots {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-2);
  }
  .photo-slider__dot {
    position: relative;
    width: 0.65rem;
    height: 0.65rem;
    padding: 0;
    border: 0;
    border-radius: var(--radius-full);
    background: var(--color-border);
    cursor: pointer;
  }
  .photo-slider__dot-active {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--color-primary);
  }
  .photo-slider--inverse .photo-slider__nav {
    background: color-mix(in srgb, var(--color-on-inverse) 8%, var(--color-bg-inverse));
    border-color: color-mix(in srgb, var(--color-on-inverse) 20%, transparent);
    color: var(--color-on-inverse);
  }
  .photo-slider--inverse .photo-slider__nav:hover:not(:disabled) {
    background: color-mix(in srgb, var(--color-on-inverse) 16%, var(--color-bg-inverse));
  }
  .photo-slider--inverse .photo-slider__dot {
    background: color-mix(in srgb, var(--color-on-inverse) 40%, transparent);
  }
  @media (min-width: 768px) {
    .photo-slider--peek .photo-slider__track {
      gap: var(--space-6);
    }
    .photo-slider--peek .photo-slider__slide {
      flex-basis: 68%;
    }
    .photo-slider--snap .photo-slider__track {
      gap: var(--space-6);
    }
    .photo-slider--snap .photo-slider__slide {
      flex-basis: calc((100% - var(--space-6)) / 2);
    }
  }
`;
