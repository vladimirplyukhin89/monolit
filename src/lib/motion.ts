import type { Transition } from 'motion';

/** Системная настройка «уменьшить движение». */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Мгновенный переход — для reduced-motion и деградации. */
export const instant: Transition = { duration: 0 };

/**
 * Пружина для панелей: модалки, меню, layoutId, слайдер.
 * Длительность близка к --duration-slow (320ms).
 */
export const spring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 34,
  mass: 0.9,
};

/** Кроссфейд / появление: --duration-base (200ms), ease-out. */
export const fade: Transition = {
  duration: 0.2,
  ease: [0.2, 0, 0, 1],
};

/** Более медленный fade: --duration-slow (320ms). */
export const fadeSlow: Transition = {
  duration: 0.32,
  ease: [0.2, 0, 0, 1],
};

/** Transition с учётом reduced-motion. */
export function motionTransition(transition: Transition): Transition {
  return prefersReducedMotion() ? instant : transition;
}
