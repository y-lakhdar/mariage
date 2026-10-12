// Native scrolling remains in charge. Only the track is transformed; there are
// no wheel/touch handlers, artificial inertia, or continuous animation loops.
const mobile = window.matchMedia('(max-width: 600px)');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const shortScreen = window.matchMedia('(max-height: 479px)');
const scene = document.querySelector<HTMLElement>('.weekend-scroll')!;
const stage = scene.querySelector<HTMLElement>('.weekend-stage')!;
const viewport = scene.querySelector<HTMLElement>('.weekend-media')!;
const track = scene.querySelector<HTMLElement>('.weekend-track')!;
const photos = [...track.children] as HTMLElement[];
const progressBar = scene.querySelector<HTMLElement>('.weekend-progress > span')!;
const current = scene.querySelector<HTMLElement>('.weekend-current')!;
const previous = scene.querySelector<HTMLButtonElement>('.weekend-previous')!;
const next = scene.querySelector<HTMLButtonElement>('.weekend-next')!;
let cleanup: (() => void) | undefined;

function setup() {
  cleanup?.();
  cleanup = undefined;
  viewport.tabIndex = mobile.matches ? 0 : -1;
  if (!mobile.matches) return;

  const scrollDriven = !reduced.matches && !shortScreen.matches;
  document.documentElement.classList.toggle('weekend-carousel-ready', scrollDriven);
  document.documentElement.classList.add('weekend-controls-ready');
  viewport.scrollLeft = 0;
  let frame = 0;
  let distance = 0;
  let active = 0;
  let nearScene = false;
  let stops: number[] = [];
  let centers: number[] = [];
  const images = photos.map(photo => photo.querySelector('img')!);
  progressBar.style.width = `${100 / photos.length}%`;

  const update = () => {
    frame = 0;
    const rect = scene.getBoundingClientRect();
    const range = scene.offsetHeight - stage.offsetHeight;
    const progress = scrollDriven
      ? Math.max(0, Math.min(1, -rect.top / Math.max(1, range)))
      : Math.max(0, Math.min(1, viewport.scrollLeft / Math.max(1, distance)));
    if (scrollDriven) track.style.transform = `translate3d(${-distance * progress}px, 0, 0)`;
    if (scrollDriven) images.forEach((image, index) => {
      // Opposing motion inside each frame adds depth to the horizontal passage.
      const offset = Math.max(-1, Math.min(1, (centers[index] - distance * progress - viewport.clientWidth / 2) / viewport.clientWidth));
      image.style.transform = `translate3d(${offset * -8}px, 0, 0) scale(1.07)`;
    });
    progressBar.style.transform = `translateX(${progress * (photos.length - 1) * 100}%)`;
    active = stops.reduce((best, stop, index) => Math.abs(stop - distance * progress) < Math.abs(stops[best] - distance * progress) ? index : best, 0);
    current.textContent = String(active + 1).padStart(2, '0');
    // Keep controls focusable at the ends, avoiding focus loss after a click.
    previous.setAttribute('aria-disabled', String(active === 0));
    next.setAttribute('aria-disabled', String(active === photos.length - 1));
  };
  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const onScroll = () => { if (nearScene) requestUpdate(); };
  const measure = () => {
    const padding = parseFloat(getComputedStyle(track).paddingRight);
    const last = photos.at(-1)!;
    distance = Math.max(0, last.offsetLeft + last.offsetWidth + padding - viewport.clientWidth);
    stops = photos.map(photo => Math.max(0, Math.min(distance, photo.offsetLeft + photo.offsetWidth / 2 - viewport.clientWidth / 2)));
    centers = photos.map(photo => photo.offsetLeft + photo.offsetWidth / 2);
    if (scrollDriven) scene.style.setProperty('--carousel-distance', `${Math.max(distance * 1.25, viewport.clientWidth)}px`);
    requestUpdate();
  };
  const goTo = (index: number) => {
    const position = stops[Math.max(0, Math.min(photos.length - 1, index))];
    if (scrollDriven) {
      const top = scrollY + scene.getBoundingClientRect().top + position / Math.max(1, distance) * (scene.offsetHeight - stage.offsetHeight);
      window.scrollTo({ top, behavior: 'smooth' });
    } else viewport.scrollTo({ left: position, behavior: reduced.matches ? 'instant' : 'smooth' });
  };
  const back = () => goTo(active - 1);
  const forward = () => goTo(active + 1);
  const keyboard = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    goTo(active + (event.key === 'ArrowLeft' ? -1 : 1));
  };
  const observer = new ResizeObserver(measure);
  observer.observe(viewport);
  observer.observe(track);
  observer.observe(document.body);
  const visibility = new IntersectionObserver(([entry]) => {
    nearScene = entry.isIntersecting;
    track.style.willChange = scrollDriven && nearScene ? 'transform' : 'auto';
    if (nearScene) {
      // Fetch the whole short strip before it enters the screen, not the page.
      track.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
    }
    requestUpdate();
  }, { rootMargin: '100% 0px' });
  visibility.observe(scene);
  window.addEventListener('scroll', onScroll, { passive: true });
  viewport.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('pageshow', measure);
  previous.addEventListener('click', back);
  next.addEventListener('click', forward);
  viewport.addEventListener('keydown', keyboard);
  measure();

  cleanup = () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    visibility.disconnect();
    window.removeEventListener('scroll', onScroll);
    viewport.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('pageshow', measure);
    previous.removeEventListener('click', back);
    next.removeEventListener('click', forward);
    viewport.removeEventListener('keydown', keyboard);
    document.documentElement.classList.remove('weekend-carousel-ready', 'weekend-controls-ready');
    scene.style.removeProperty('--carousel-distance');
    track.style.removeProperty('transform');
    track.style.removeProperty('will-change');
    progressBar.style.removeProperty('transform');
    images.forEach(image => image.style.removeProperty('transform'));
    viewport.scrollLeft = 0;
  };
}

[mobile, reduced, shortScreen].forEach(query => query.addEventListener('change', setup));
setup();
