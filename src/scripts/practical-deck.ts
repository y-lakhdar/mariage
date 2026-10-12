export {};

const mobile = matchMedia('(max-width: 600px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const deck = document.querySelector<HTMLElement>('.practical-deck')!;
const grid = deck.querySelector<HTMLElement>('.practical-grid')!;
const cards = [...grid.querySelectorAll<HTMLElement>('.practical-item')];
const status = deck.querySelector<HTMLElement>('.practical-deck-status')!;
const prevButton = deck.querySelector<HTMLButtonElement>('.practical-previous')!;
const nextButton = deck.querySelector<HTMLButtonElement>('.practical-next')!;
let cleanup: (() => void) | undefined;

function setup() {
  cleanup?.();
  cleanup = undefined;
  if (!mobile.matches) return;
  deck.classList.add('is-carousel-ready');
  grid.tabIndex = 0;
  grid.setAttribute('role', 'region');
  grid.setAttribute('aria-label', 'Informations pratiques');
  let index = 0;
  let frame = 0;
  let stops: number[] = [];
  const render = () => {
    frame = 0;
    index = stops.reduce((best, stop, i) => Math.abs(stop - grid.scrollLeft) < Math.abs(stops[best] - grid.scrollLeft) ? i : best, 0);
    const label = `${index + 1} / ${cards.length}`;
    if (status.textContent !== label) status.textContent = label;
    prevButton.setAttribute('aria-disabled', String(index === 0));
    nextButton.setAttribute('aria-disabled', String(index === cards.length - 1));
  };
  const requestRender = () => { if (!frame) frame = requestAnimationFrame(render); };
  const measure = () => {
    const max = grid.scrollWidth - grid.clientWidth;
    stops = cards.map(card => Math.max(0, Math.min(max, card.offsetLeft - cards[0].offsetLeft)));
    requestRender();
  };
  const advance = (direction: number) => {
    const target = Math.max(0, Math.min(cards.length - 1, index + direction));
    grid.scrollTo({ left: stops[target], behavior: reduced.matches ? 'instant' : 'smooth' });
  };
  const previous = () => advance(-1);
  const next = () => advance(1);
  const key = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    advance(event.key === 'ArrowRight' ? 1 : -1);
  };
  const resize = new ResizeObserver(measure);
  resize.observe(grid);
  cards.forEach(card => resize.observe(card));
  grid.addEventListener('scroll', requestRender, { passive: true });
  grid.addEventListener('keydown', key);
  prevButton.addEventListener('click', previous);
  nextButton.addEventListener('click', next);
  measure();
  cleanup = () => {
    cancelAnimationFrame(frame);
    resize.disconnect();
    deck.classList.remove('is-carousel-ready');
    grid.removeAttribute('tabindex');
    grid.removeAttribute('role');
    grid.removeAttribute('aria-label');
    grid.removeEventListener('scroll', requestRender);
    grid.removeEventListener('keydown', key);
    prevButton.removeEventListener('click', previous);
    nextButton.removeEventListener('click', next);
    grid.scrollLeft = 0;
  };
}
mobile.addEventListener('change', setup);
setup();
