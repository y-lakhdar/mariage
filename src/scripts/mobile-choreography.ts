import gsap from 'gsap';

// Called inside the parent GSAP matchMedia context: every tween and trigger is
// reverted on desktop or reduced motion. Native scrolling owns the playhead.
export function mobileChoreography(squareMask: string) {
  const hero = gsap.timeline({
    scrollTrigger: { trigger: '.hero-art', start: 'top 78%', end: 'bottom 28%', scrub: .3, invalidateOnRefresh: true },
  });
  hero.to('#hero-photo-mask path', { attr: { d: squareMask }, duration: .75, ease: 'power1.inOut' }, 0)
    .to('.hero-art', { scale: () => window.innerWidth / document.querySelector<HTMLElement>('.hero-art')!.offsetWidth, duration: 1, ease: 'none' }, 0)
    .fromTo('.hero-arch img', { yPercent: -3, scale: 1.08 }, { yPercent: 3, scale: 1, duration: 1, ease: 'none' }, 0)
    .to('.hero-word-shade', { opacity: 1, duration: .35 }, .4)
    .fromTo('.hero-endword', { y: 45, rotation: -7, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: .4, ease: 'power2.out' }, .48);

  // Whole-image depth: the original ratios and all faces remain in the frame.
  const portraits = [
    { selector: '.invitation-photo-left', tilt: 3, travel: 110 },
  ];
  portraits.forEach(({ selector, tilt, travel }) => {
    const photo = document.querySelector<HTMLElement>(selector)!;
    const anchor = photo.parentElement!;
    gsap.fromTo(photo, { y: travel / 2, rotation: tilt, scale: .9 }, {
      y: -travel / 2, rotation: 0, scale: 1, ease: 'none',
      scrollTrigger: { trigger: anchor, start: 'top 95%', end: 'bottom 25%', scrub: .3, invalidateOnRefresh: true },
    });
  });

  gsap.fromTo('.story-race-photo img', { yPercent: -3 }, {
    yPercent: 3, ease: 'none',
    scrollTrigger: { trigger: '#histoire', start: 'top bottom', end: 'bottom top', scrub: .3 },
  });

  gsap.fromTo('.invitation-color-block', { xPercent: -25, rotation: -6, scaleY: .75 }, {
    xPercent: 8, rotation: 3, scaleY: 1.15, ease: 'none',
    scrollTrigger: { trigger: '.invitation-stage', start: 'top bottom', end: 'center center', scrub: .4 },
  });
  // The copy stays readable; only its short expressive accents travel.
  ['.story-copy h2 em', '.invitation-text .handwritten', '.heading-aside'].forEach(selector => {
    gsap.fromTo(selector, { x: 26, opacity: .45 }, {
      x: 0, opacity: 1, ease: 'power2.out',
      scrollTrigger: { trigger: selector, start: 'top 94%', end: 'top 65%', scrub: .25 },
    });
  });
  gsap.fromTo('.story-proof', { rotation: 3, y: 28 }, {
    rotation: -1, y: -10, ease: 'none',
    scrollTrigger: { trigger: '.story-proof', start: 'top bottom', end: 'bottom 30%', scrub: .35 },
  });

  // A shutter opens onto the lake, with the image moving behind the frame.
  gsap.fromTo('.location-photo', { clipPath: 'inset(12% 7% 12% 7% round 45% 45% 3px 3px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 0% 0% 3px 3px)', ease: 'power1.inOut',
    scrollTrigger: { trigger: '.location-card', start: 'top 95%', end: 'top 30%', scrub: .35 },
  });
  gsap.fromTo('.location-photo img', { yPercent: -5, scale: 1.14 }, {
    yPercent: 5, scale: 1.14, ease: 'none',
    scrollTrigger: { trigger: '.location-card', start: 'top bottom', end: 'bottom top', scrub: .3 },
  });
  gsap.fromTo('.ending-photo .scroll-photo-mask', { clipPath: 'inset(0% 9% 0% 9% round 45% 45% 0% 0%)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 0% 0% 0% 0%)', ease: 'power1.inOut',
    scrollTrigger: { trigger: '.ending-photo', start: 'top 95%', end: 'top 20%', scrub: .4 },
  });
  gsap.fromTo('.ending-photo img', { yPercent: -4 }, {
    yPercent: 4, ease: 'none',
    scrollTrigger: { trigger: '.ending-photo', start: 'top bottom', end: 'bottom top', scrub: .3 },
  });
}
