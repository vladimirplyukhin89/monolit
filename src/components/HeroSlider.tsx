import { LazyMotion, type PanInfo } from 'motion/react';
import * as m from 'motion/react-m';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { instant, prefersReducedMotion, spring } from '../lib/motion';
import loadMotionFeatures from '../lib/motion-features';

export interface HeroSlide {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
}

interface Props {
  slides: readonly HeroSlide[];
}

const AUTOPLAY_MS = 15000;

export default function HeroSlider({ slides }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const wrapForward = useRef(false);
  const count = slides.length;
  const extended = count > 1 ? [...slides, slides[0]] : [...slides];
  const [index, setIndex] = useState(0);
  const [skip, setSkip] = useState(false);
  const [step, setStep] = useState(0);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduced = prefersReducedMotion();
  const dot = count === 0 ? 0 : index % count;

  indexRef.current = index;

  const go = useCallback(
    (delta: 1 | -1) => {
      if (count < 2) return;
      const current = indexRef.current;
      const visual = current >= count ? 0 : current;
      if (delta === 1 && visual === count - 1) {
        wrapForward.current = true;
        setSkip(false);
        setIndex(count);
        return;
      }
      if (delta === -1 && visual === 0) {
        wrapForward.current = false;
        setSkip(true);
        setIndex(count);
        return;
      }
      wrapForward.current = false;
      setSkip(false);
      setIndex((visual + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const update = () => setStep(viewport.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!skip || index !== count || wrapForward.current || count < 2) return;
    const frame = requestAnimationFrame(() => {
      setSkip(false);
      setIndex(count - 1);
    });
    return () => cancelAnimationFrame(frame);
  }, [skip, index, count]);

  useEffect(() => {
    if (index !== count || count < 2 || !wrapForward.current) return;
    const timer = window.setTimeout(() => {
      if (indexRef.current !== count || !wrapForward.current) return;
      wrapForward.current = false;
      setSkip(true);
      setIndex(0);
    }, 480);
    return () => window.clearTimeout(timer);
  }, [index, count]);

  useEffect(() => {
    const plate = rootRef.current?.closest('.hero__plate');
    if (!(plate instanceof HTMLElement)) return;

    const onEnter = () => setHover(true);
    const onLeave = () => setHover(false);
    const onFocusIn = () => setFocus(true);
    const onFocusOut = (event: FocusEvent) => {
      if (!plate.contains(event.relatedTarget as Node | null)) {
        setFocus(false);
      }
    };
    const onVisibility = () => setHidden(document.hidden);

    plate.addEventListener('pointerenter', onEnter);
    plate.addEventListener('pointerleave', onLeave);
    plate.addEventListener('focusin', onFocusIn);
    plate.addEventListener('focusout', onFocusOut);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      plate.removeEventListener('pointerenter', onEnter);
      plate.removeEventListener('pointerleave', onLeave);
      plate.removeEventListener('focusin', onFocusIn);
      plate.removeEventListener('focusout', onFocusOut);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (reduced || hover || focus || hidden || count < 2) return;
    const timer = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [reduced, hover, focus, hidden, count, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset.x + info.velocity.x * 0.2;
    if (offset < -40) {
      go(1);
    } else if (offset > 40) {
      go(-1);
    }
  };

  const onSlideKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    }
  };

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <div
        ref={rootRef}
        className="hero-slider"
        role="region"
        aria-roledescription="carousel"
        aria-label="Фото объектов"
      >
        <p className="visually-hidden" aria-live="polite">
          Слайд {dot + 1} из {count}
        </p>
        <div ref={viewportRef} className="hero-slider__viewport">
          <m.div
            className="hero-slider__track"
            drag={reduced || step === 0 ? false : 'x'}
            dragElastic={0.12}
            dragMomentum={false}
            animate={{ x: -index * step }}
            transition={reduced || skip ? instant : spring}
            onDragEnd={onDragEnd}
          >
            {extended.map((slide, slideIndex) => {
              const clone = count > 1 && slideIndex === count;
              const current = !clone && slideIndex === dot;
              return (
                <div
                  key={`${slide.src}-${slideIndex}`}
                  className="hero-slider__slide"
                  aria-hidden={current ? undefined : true}
                >
                  <img
                    src={slide.src}
                    alt={current ? slide.alt : ''}
                    width={slide.width}
                    height={slide.height}
                    decoding="async"
                    draggable={false}
                    fetchPriority={slideIndex === 0 ? 'high' : undefined}
                    loading={slideIndex === 0 ? undefined : 'lazy'}
                    style={{ objectPosition: slide.objectPosition ?? 'center' }}
                  />
                </div>
              );
            })}
          </m.div>
        </div>
        <div className="hero-slider__scrim" aria-hidden="true" />
        {count > 1 ? (
          <div className="hero-slider__dots" role="tablist" aria-label="Слайды">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                className="hero-slider__dot"
                aria-selected={slideIndex === dot}
                aria-label={`Слайд ${slideIndex + 1}`}
                onClick={() => {
                  wrapForward.current = false;
                  setSkip(false);
                  setIndex(slideIndex);
                }}
                onKeyDown={onSlideKey}
              >
                <span />
              </button>
            ))}
          </div>
        ) : null}
        <style>{styles}</style>
      </div>
    </LazyMotion>
  );
}

const styles = `
  .hero-slider {
    position: relative;
    height: 100%;
  }

  .hero-slider__scrim {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      to top,
      color-mix(in srgb, var(--color-bg-inverse) 82%, transparent) 0%,
      color-mix(in srgb, var(--color-bg-inverse) 78%, transparent) 100%
    );
  }

  @media (min-width: 768px) {
    .hero-slider__scrim {
      background: linear-gradient(
        to right,
        color-mix(in srgb, var(--color-bg-inverse) 88%, transparent) 0%,
        color-mix(in srgb, var(--color-bg-inverse) 78%, transparent) 46%,
        color-mix(in srgb, var(--color-bg-inverse) 20%, transparent) 78%,
        color-mix(in srgb, var(--color-bg-inverse) 8%, transparent) 100%
      );
    }
  }

  .hero-slider__viewport {
    height: 100%;
    overflow: hidden;
  }

  .hero-slider__track {
    display: flex;
    height: 100%;
    cursor: grab;
    touch-action: pan-y;
  }

  .hero-slider__track:active {
    cursor: grabbing;
  }

  .hero-slider__slide {
    flex: 0 0 100%;
    height: 100%;
    min-width: 0;
  }

  .hero-slider__slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    user-select: none;
  }

  .hero-slider__dots {
    position: absolute;
    z-index: 2;
    left: 50%;
    bottom: var(--space-3);
    display: flex;
    transform: translateX(-50%);
  }

  .hero-slider__dot {
    display: grid;
    place-items: center;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .hero-slider__dot span {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--color-on-inverse) 45%, transparent);
  }

  .hero-slider__dot[aria-selected='true'] span {
    background: var(--color-on-inverse);
  }
`;
