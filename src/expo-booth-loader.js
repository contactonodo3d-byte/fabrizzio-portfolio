const hero = document.querySelector('.hero');
const host = hero?.querySelector('.booth-art');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let cleanup, pending = false;
// Privacy browsers may mask cores/RAM. Those values must never disable WebGL.
const saveData = navigator.connection?.saveData;
async function start() {
  if (!host || saveData || motion.matches || pending || cleanup) return;
  pending = true;
  try { const { mountBooth } = await import('./expo-booth.js'); if (!motion.matches) cleanup = mountBooth(host, hero); }
  catch { host.classList.remove('booth-ready'); }
  finally { pending = false; }
}
const observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) start(); }, {rootMargin:'120px'});
if (hero) observer.observe(hero);
motion.addEventListener('change', () => { cleanup?.(); cleanup = undefined; if (!motion.matches) start(); });
window.addEventListener('pagehide', () => { cleanup?.(); cleanup = undefined; });
window.addEventListener('pageshow', start);
