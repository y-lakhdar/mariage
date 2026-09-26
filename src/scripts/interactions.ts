import './scroll-experience';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Le contenu reste visible si JavaScript ou IntersectionObserver est indisponible.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  document.documentElement.classList.add('motion-ready');
}

const frames = [...document.querySelectorAll<HTMLElement>('.parallax-frame')];
let scheduled = false;
function updateParallax() {
  const height = window.innerHeight;
  frames.forEach(frame => {
    const rect = frame.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > height) return;
    const progress = (height / 2 - rect.top - rect.height / 2) / height;
    const offset = reducedMotion.matches ? 0 : Math.max(-rect.height * 0.08, Math.min(rect.height * 0.08, progress * 65));
    frame.style.setProperty('--parallax', `${offset.toFixed(2)}px`);
  });
  scheduled = false;
}
function requestParallax() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(updateParallax);
}
window.addEventListener('scroll', requestParallax, { passive: true });
window.addEventListener('resize', requestParallax, { passive: true });
reducedMotion.addEventListener('change', requestParallax);
requestParallax();

const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle')!;
const mobileMenu = document.querySelector<HTMLElement>('#mobile-menu')!;
function closeMenu() {
  mobileMenu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Ouvrir le menu');
}
toggle.addEventListener('click', () => {
  const opening = mobileMenu.hidden;
  mobileMenu.hidden = !opening;
  toggle.setAttribute('aria-expanded', String(opening));
  toggle.setAttribute('aria-label', opening ? 'Fermer le menu' : 'Ouvrir le menu');
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); toggle.focus(); }
});
window.matchMedia('(min-width: 601px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
