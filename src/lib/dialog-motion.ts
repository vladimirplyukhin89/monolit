import { animate } from 'motion';
import { fade, motionTransition, prefersReducedMotion, spring } from './motion';

const SHEET_MQ = '(max-width: 767px)';

function isSheet(): boolean {
  return window.matchMedia(SHEET_MQ).matches;
}

function clearInlineMotion(dialog: HTMLDialogElement) {
  dialog.style.transform = '';
  dialog.style.opacity = '';
}

/** Открыть dialog с пружиной: шторка снизу на мобиле, fade+scale на десктопе. */
export async function openDialog(dialog: HTMLDialogElement): Promise<void> {
  if (dialog.open) {
    return;
  }

  dialog.showModal();

  if (prefersReducedMotion()) {
    clearInlineMotion(dialog);
    return;
  }

  if (isSheet()) {
    await animate(dialog, { y: ['100%', '0%'] }, motionTransition(spring)).finished;
  } else {
    await animate(
      dialog,
      { opacity: [0, 1], scale: [0.96, 1] },
      motionTransition(spring),
    ).finished;
  }

  clearInlineMotion(dialog);
}

/** Закрыть dialog: выход быстрее входа, затем native close(). */
export async function closeDialog(dialog: HTMLDialogElement): Promise<void> {
  if (!dialog.open) {
    return;
  }

  if (!prefersReducedMotion()) {
    if (isSheet()) {
      await animate(dialog, { y: '100%' }, motionTransition(fade)).finished;
    } else {
      await animate(dialog, { opacity: 0, scale: 0.96 }, motionTransition(fade)).finished;
    }
  }

  dialog.close();
  clearInlineMotion(dialog);
}

/**
 * Esc → closeDialog (cancel + preventDefault).
 * Повторный вызов безопасен: слушатель вешается один раз.
 */
export function bindDialogEsc(dialog: HTMLDialogElement): void {
  if (dialog.dataset.motionEsc === '1') {
    return;
  }
  dialog.dataset.motionEsc = '1';
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    void closeDialog(dialog);
  });
}
