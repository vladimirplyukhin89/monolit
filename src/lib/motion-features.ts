/** Асинхронный пакет domMax для LazyMotion (layout + drag). */
export default async function loadMotionFeatures() {
  const { domMax } = await import('motion/react');
  return domMax;
}
