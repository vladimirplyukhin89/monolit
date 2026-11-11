import { animate, inView } from 'motion';
import { motionTransition, prefersReducedMotion, spring } from '../lib/motion';

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
}
