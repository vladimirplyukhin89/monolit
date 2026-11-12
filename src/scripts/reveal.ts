import { animate, inView } from 'motion';
import { fadeSlow, motionTransition, prefersReducedMotion, spring } from '../lib/motion';

if (!prefersReducedMotion()) {
  inView(
    '.reveal',
    (element) => {
      void animate(
        element,
        { opacity: [0, 1], transform: ['translateY(16px)', 'none'] },
        motionTransition(spring),
      );
    },
    { amount: 0.2 },
  );

  inView(
    '.trust__item',
    (element) => {
      const figures = element.querySelectorAll<HTMLElement>('.trust__num, .trust__ghost');
      if (!figures.length) return;
      void animate(
        figures,
        { opacity: [0, 1] },
        motionTransition({ ...fadeSlow, delay: 0.12 }),
      );
    },
    { amount: 0.2 },
  );
}
