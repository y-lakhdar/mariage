import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const media = gsap.matchMedia();

media.add({
  desktop: '(min-width: 601px)',
  mobile: '(max-width: 600px)',
  reduce: '(prefers-reduced-motion: reduce)',
}, context => {
  const { desktop, reduce } = context.conditions!;
  if (reduce) return;

  document.documentElement.classList.add('scroll-ready');
  const strength = desktop ? 1 : .32;

  // One reversible scrub timeline per scene. No wheel interception or scroll hijacking.
  gsap.to('.reading-progress', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: true },
  });

  if (desktop) {
    const hero = gsap.timeline({ scrollTrigger: { trigger: '.hero-scroll', start: 'top top', end: 'bottom bottom', scrub: .65, invalidateOnRefresh: true } });
    hero.to('.hero-copy', { y: -100, opacity: 0, duration: .4 }, 0)
      .to('.scroll-cue', { opacity: 0, duration: .2 }, 0)
      .to('.hero-art', { x: () => -window.innerWidth * .18, scale: 1.35, rotation: -2, duration: 1, ease: 'power1.inOut' }, 0)
      .to('.hero-arch', { borderRadius: '2px', duration: .7 }, .1)
      .to('.hero-arch img', { scale: 1.04, duration: 1 }, 0)
      .to('.orbit-line', { opacity: 0, duration: .2 }, 0)
      .fromTo('.hero-endword', { y: 90, opacity: 0 }, { y: -30, opacity: 1, duration: .45 }, .5);
  }

  gsap.utils.toArray<HTMLElement>('.scroll-photo').forEach(photo => {
    const scene = photo.closest<HTMLElement>('[data-scroll-scene]')!;
    const travel = Number(photo.dataset.travel) * strength;
    const rotation = Number(photo.dataset.rotate) * strength;
    const trigger = { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: .65, invalidateOnRefresh: true };
    if (travel) gsap.fromTo(photo,
      { y: travel / 2, rotation: -rotation },
      { y: -travel / 2, rotation, ease: 'none', scrollTrigger: trigger });
    if (!photo.dataset.natural) gsap.fromTo(photo.querySelector('img'),
      { yPercent: -3 * strength, scale: 1.1 },
      { yPercent: 3 * strength, scale: 1, ease: 'none', scrollTrigger: trigger });
  });

  gsap.fromTo('.invitation-color-block', { scaleY: .65 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.invitation-stage', start: 'top bottom', end: 'bottom top', scrub: .6 } });

  const weekend = gsap.timeline({ scrollTrigger: { trigger: '.weekend-scroll', start: 'top top', end: 'bottom bottom', scrub: .7, invalidateOnRefresh: true } });
  weekend.fromTo('.weekend-backdrop .scroll-photo-mask', { clipPath: desktop ? 'inset(9% 8% 9% 8%)' : 'inset(3% 3% 3% 3%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'none' }, 0)
    .to('.weekend-title', { y: -90 * strength, duration: 1, ease: 'none' }, 0)
    .fromTo('.weekend-outline', { x: -100 * strength }, { x: 170 * strength, duration: 1, ease: 'none' }, 0);


  document.fonts.ready.then(() => ScrollTrigger.refresh());
  return () => document.documentElement.classList.remove('scroll-ready');
});

window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
window.addEventListener('pageshow', () => ScrollTrigger.refresh());
