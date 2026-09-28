// Mobile-only horizontal storytelling. Uses native vertical scrolling, including
// with reduced motion: no inertia, autoplay, zoom or wheel/touch interception.
const mobile = window.matchMedia('(max-width: 600px)');
const scene = document.querySelector<HTMLElement>('.weekend-scroll')!;
const stage = scene.querySelector<HTMLElement>('.weekend-stage')!;
const viewport = scene.querySelector<HTMLElement>('.weekend-media')!;
const track = scene.querySelector<HTMLElement>('.weekend-track')!;
const progressBar = scene.querySelector<HTMLElement>('.weekend-progress > span')!;
let cleanup: (() => void) | undefined;

function setup() {
  cleanup?.();
  cleanup = undefined;
  if (!mobile.matches) return;

  document.documentElement.classList.add('weekend-carousel-ready');
  viewport.scrollLeft = 0;
  let frame = 0;
  let distance = 0;
  const update = () => {
    frame = 0;
    const rect = scene.getBoundingClientRect();
    const range = scene.offsetHeight - stage.offsetHeight;
    const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, range)));
    track.style.transform = `translate3d(${-distance * progress}px, 0, 0)`;
    progressBar.style.transform = `translateX(${progress * 100}%)`;
  };
  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const measure = () => {
    const last = track.lastElementChild as HTMLElement;
    distance = Math.max(0, last.offsetLeft + last.offsetWidth + 24 - viewport.clientWidth);
    scene.style.setProperty('--carousel-distance', `${Math.max(distance * 1.5, viewport.clientWidth)}px`);
    requestUpdate();
  };
  const observer = new ResizeObserver(measure);
  observer.observe(viewport);
  observer.observe(track);
  observer.observe(document.body);
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('pageshow', measure);
  measure();

  cleanup = () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', measure);
    window.removeEventListener('pageshow', measure);
    document.documentElement.classList.remove('weekend-carousel-ready');
    scene.style.removeProperty('--carousel-distance');
    track.style.removeProperty('transform');
    progressBar.style.removeProperty('transform');
    viewport.scrollLeft = 0;
  };
}

mobile.addEventListener('change', setup);
setup();
