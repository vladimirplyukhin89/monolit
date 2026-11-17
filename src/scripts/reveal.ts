import { animate, inView } from 'motion';
import { fadeSlow, motionTransition, prefersReducedMotion, spring } from '../lib/motion';

/** Длина токена в пикселях, чтобы Motion мог интерполировать сдвиг. */
function readTokenPx(name: string): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return 0;
  const probe = document.createElement('div');
  probe.style.width = raw;
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  document.documentElement.appendChild(probe);
  const px = probe.getBoundingClientRect().width;
  probe.remove();
  return px;
}

if (!prefersReducedMotion()) {
  inView(
    '.reveal:not(.services__card)',
    (element) => {
      void animate(
        element,
        { opacity: [0, 1], transform: ['translateY(16px)', 'none'] },
        motionTransition(spring),
      );
    },
    { amount: 0.2 },
  );

  const serviceCards: HTMLElement[] = [];
  let serviceFrame = 0;

  inView(
    '.services__card',
    (element) => {
      serviceCards.push(element as HTMLElement);
      if (serviceFrame) return;
      serviceFrame = requestAnimationFrame(() => {
        serviceFrame = 0;
        const batch = serviceCards.splice(0).sort((a, b) => {
          if (a === b) return 0;
          return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });
        const shift = readTokenPx('--space-12');
        batch.forEach((card, index) => {
          void animate(
            card,
            { opacity: [0, 1], x: [-shift, 0] },
            motionTransition({ ...spring, delay: index * 0.06 }),
          );
        });
      });
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
