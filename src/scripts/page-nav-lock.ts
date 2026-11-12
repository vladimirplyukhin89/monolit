import { isInternalPageHref, PAGE_NAV_LOCKED } from '../lib/page-nav';

/**
 * TODO: разблокировать переходы на другие страницы — см. `PAGE_NAV_LOCKED`
 * в `src/lib/page-nav.ts`.
 */
if (PAGE_NAV_LOCKED) {
  const block = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest('a');
    if (!anchor) return;
    if (!isInternalPageHref(anchor.getAttribute('href'))) return;
    event.preventDefault();
  };

  document.addEventListener('click', block, true);
  document.addEventListener('auxclick', block, true);
}
