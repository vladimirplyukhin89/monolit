/**
 * TODO: разблокировать переходы на другие страницы, когда разделы
 * (/blagoustrojstvo, /remont-kvartir, политика) будут готовы к публикации.
 * Выставить `PAGE_NAV_LOCKED = false`.
 */
export const PAGE_NAV_LOCKED = true;

/** Внутренняя ссылка на документ сайта (не якорь, tel, mailto, внешний URL). */
export function isInternalPageHref(href: string | null): boolean {
  if (!href) return false;
  const value = href.trim();
  if (
    value.startsWith('#') ||
    value.startsWith('tel:') ||
    value.startsWith('mailto:') ||
    value.startsWith('sms:')
  ) {
    return false;
  }
  if (/^https?:\/\//i.test(value) || value.startsWith('//')) {
    return false;
  }
  return true;
}
