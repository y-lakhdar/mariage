import { test, expect } from '@playwright/test';

test('invitation, photos et mise en page sans débordement', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle('Marie-Audrée & Yassine — On se marie !');
  await expect(page.locator('h1')).toContainText('marie');
  await expect(page.locator('.couple-names')).toContainText('Marie-Audrée Murphy Desjardins');
  await expect(page.locator('#calendrier .attendance-note')).toHaveText('Contactez-nous pour nous aviser de votre présence.');
  await expect(page.locator('.site-footer p')).toHaveText('Youpi');
  await expect(page.locator('.day-card')).toHaveCount(3);
  await page.evaluate(async () => { await document.fonts.ready; });
  await expect(page.locator('.hero-arch img')).toHaveJSProperty('complete', true);
  expect(await page.locator('.hero-arch img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.locator('.hero-arch img').evaluate((image: HTMLImageElement) => image.decode());
  await expect(page.locator('.hero-arch')).toHaveCSS('clip-path', /hero-photo-mask/);
  await expect(page.locator('.orbit-line')).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('accueil.png') });
  for (const section of ['#histoire', '#invitation', '#weekend', '#infos', '#calendrier']) {
    await page.locator(section).scrollIntoViewIfNeeded();
    await page.waitForTimeout(850);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  for (const image of await page.locator('main img').all()) {
    await image.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await expect(image).toHaveJSProperty('complete', true);
    expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  }
  const climbing = page.locator('[data-photo-slot="invitationLeft"] img');
  const ratios = await climbing.evaluate((image: HTMLImageElement) => ({ rendered: image.clientWidth / image.clientHeight, original: image.naturalWidth / image.naturalHeight }));
  expect(ratios.rendered).toBeCloseTo(ratios.original, 2);
  await expect(climbing).toHaveCSS('transform', 'none');
  expect(await page.locator('#histoire').evaluate(element => Boolean(element.compareDocumentPosition(document.querySelector('#invitation')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  for (const element of await page.locator('.reveal').all()) await element.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
  await page.screenshot({ path: testInfo.outputPath('page-complete.png'), fullPage: true });
  expect(errors).toEqual([]);
});

test('cinq plans photo et défilement réversible', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('[data-photo-slot]')).toHaveCount(5);
  await expect(page.locator('#ensemble, .gallery-track')).toHaveCount(0);
  const scene = page.locator('#invitation');
  const photo = page.locator('[data-photo-slot="invitationLeft"]');
  await scene.evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(1000);
  const originalScroll = await page.evaluate(() => window.scrollY);
  const before = await photo.evaluate(element => getComputedStyle(element).transform);
  const beforeY = await photo.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m42);
  await page.evaluate(() => window.scrollBy({ top: 240, behavior: 'instant' }));
  await expect.poll(() => photo.evaluate(element => getComputedStyle(element).transform)).not.toBe(before);
  await page.waitForTimeout(900);
  await page.screenshot({ path: testInfo.outputPath('invitation-scroll.png') });
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), originalScroll);
  await expect.poll(() => photo.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m42)).toBeCloseTo(beforeY, 1);
  await expect(scene.getByRole('button')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(photo).toHaveCSS('transform', 'none');
  await expect(page.locator('.faq-block')).toHaveCount(0);
  await expect(page.getByText('La fin de semaine se vit sur place, avec hébergement. Les détails pour les nuits suivront.')).toBeVisible();
  await expect(page.getByText('Du 8 au 10 octobre 2027.')).toBeVisible();
  await expect(page.getByText('02 / Section inutile')).toBeVisible();
  await expect(page.getByText('P.S. On vous jure, on est vraiment contents.')).toBeVisible();
});

test('scènes sticky et cadrages aux différentes étapes', async ({ page, isMobile }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/scroll-ready/);
  for (const selector of ['.hero-scroll', '#histoire', '.weekend-scroll', '.details-opening', '.location-card', '#calendrier']) {
    const scene = page.locator(selector);
    const positions = selector.includes('scroll') ? [0, .5, 1] : [.25];
    for (const progress of positions) {
      await scene.evaluate((element, progress) => {
        const rect = element.getBoundingClientRect();
        window.scrollTo({ top: window.scrollY + rect.top + Math.max(0, rect.height - window.innerHeight) * progress, behavior: 'instant' });
      }, progress);
      await page.waitForTimeout(1100);
      await page.screenshot({ path: testInfo.outputPath(`${selector.replace(/[.#]/g, '')}-${progress}.png`) });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  if (!isMobile) {
    await page.locator('.hero-scroll').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.waitForTimeout(600);
    await expect(page.locator('#hero-photo-mask path')).toHaveAttribute('d', /^M 0\.669295/);
    await page.locator('.hero-scroll').evaluate(element => {
      const rect = element.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + rect.top + (rect.height - innerHeight) * .95, behavior: 'instant' });
    });
    await page.waitForTimeout(1100);
    expect(Math.abs((await page.locator('.hero-stage').boundingBox())!.y)).toBeLessThan(2);
    await expect(page.locator('#hero-photo-mask path')).toHaveAttribute('d', /^M 1 0 C 1 0\.333333/);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-stage')).toHaveCSS('position', 'relative');
});

test('cadre d’accueil proportionné sur téléphone, tablette et ordinateur', async ({ page, isMobile }, testInfo) => {
  test.skip(isMobile, 'Tailles vérifiées avec redimensionnement dans le projet desktop.');
  for (const [width, height] of [[360, 800], [600, 900], [768, 1024], [900, 900], [1024, 768], [1440, 900], [1920, 1080], [2560, 940], [3440, 1440]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.locator('.hero-arch img').evaluate((image: HTMLImageElement) => image.decode());
    await page.evaluate(async () => { await document.fonts.ready; });
    const frame = await page.locator('.hero-arch').boundingBox();
    expect(frame!.x).toBeGreaterThanOrEqual(0);
    expect(frame!.x + frame!.width).toBeLessThanOrEqual(width);
    expect(frame!.width / frame!.height).toBeCloseTo(600 / 650, 2);
    const stage = await page.locator('.hero-stage').boundingBox();
    expect(stage!.width).toBeLessThanOrEqual(1360);
    expect(Math.abs(stage!.x + stage!.width / 2 - width / 2)).toBeLessThan(1);
    if (width > 900) {
      const copy = await page.locator('.hero-copy').boundingBox();
      expect(frame!.x - copy!.x - copy!.width).toBeCloseTo(48, 0);
      expect(frame!.width).toBeGreaterThan(copy!.width);
      expect(frame!.y + frame!.height).toBeLessThanOrEqual(height);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`hero-${width}.png`) });
    if (width >= 1440) {
      for (const progress of [.7, 1]) {
        await page.locator('.hero-scroll').evaluate((element, progress) => {
          const rect = element.getBoundingClientRect();
          window.scrollTo({ top: scrollY + rect.top + (rect.height - innerHeight) * progress, behavior: 'instant' });
        }, progress);
        await page.waitForTimeout(1000);
        const photo = (await page.locator('.hero-arch').boundingBox())!;
        const word = (await page.locator('.hero-endword').boundingBox())!;
        expect(word.x).toBeGreaterThan(photo.x);
        expect(word.x + word.width).toBeLessThan(photo.x + photo.width);
        expect(word.y).toBeGreaterThan(photo.y);
        expect(word.y + word.height).toBeLessThan(photo.y + photo.height);
        await page.screenshot({ path: testInfo.outputPath(`hero-${width}-scroll-${progress}.png`) });
      }
    }
  }
});

test('carrousel mobile piloté par le scroll, réversible et sans superposition', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Interaction propre au mobile.');
  await page.goto('/');
  await page.evaluate(async () => {
    await Promise.all([...document.images].map(image => { image.loading = 'eager'; return image.decode(); }));
    await document.fonts.ready;
  });
  await expect(page.locator('html')).toHaveClass(/weekend-carousel-ready/);
  const scene = page.locator('.weekend-scroll');
  const track = page.locator('.weekend-track');
  const seek = async (progress: number) => {
    await scene.evaluate((element, progress) => {
      const rect = element.getBoundingClientRect();
      window.scrollTo({ top: scrollY + rect.top + (rect.height - innerHeight) * progress, behavior: 'instant' });
    }, progress);
    await page.waitForTimeout(800);
  };
  await seek(0);
  const initial = await track.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41);
  for (const progress of [0, .5, 1]) {
    await seek(progress);
    const first = (await page.locator('.weekend-backdrop').boundingBox())!;
    const second = (await page.locator('.weekend-foreground').boundingBox())!;
    const title = (await page.locator('.weekend-title').boundingBox())!;
    expect(first.x + first.width).toBeLessThanOrEqual(second.x + 1);
    expect(title.y + title.height).toBeLessThan(first.y);
    for (const image of await track.locator('img').all()) await expect(image).toHaveCSS('object-fit', 'cover');
  }
  expect(await track.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41)).toBeLessThan(initial - 200);
  await seek(0);
  expect(await track.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41)).toBeCloseTo(initial, 0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveClass(/weekend-carousel-ready/);
  await page.reload();
  await page.evaluate(async () => {
    await Promise.all([...document.images].map(image => { image.loading = 'eager'; return image.decode(); }));
    await document.fonts.ready;
  });
  await expect(page.locator('html')).not.toHaveClass(/scroll-ready/);
  await page.waitForTimeout(400);
  await seek(1);
  const first = (await page.locator('.weekend-backdrop').boundingBox())!;
  const second = (await page.locator('.weekend-foreground').boundingBox())!;
  expect(second.y).toBeCloseTo(first.y, 0);
  expect(second.x + second.width).toBeLessThanOrEqual(page.viewportSize()!.width - 20);
});

test('carrousel actif sur mobile court et désactivé après passage desktop', async ({ page, isMobile }, testInfo) => {
  test.skip(isMobile, 'Redimensionnement et molette vérifiés dans le projet desktop.');
  for (const [width, height] of [[375, 560], [461, 541], [390, 844], [600, 600]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/weekend-carousel-ready/);
    await page.locator('.weekend-scroll').evaluate(element => {
      window.scrollTo({ top: scrollY + element.getBoundingClientRect().top, behavior: 'instant' });
    });
    await page.waitForTimeout(700);
    const track = page.locator('.weekend-track');
    const x = () => track.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41);
    const before = await x();
    await page.screenshot({ path: testInfo.outputPath(`carousel-${width}-${height}-start.png`) });
    await page.mouse.move(width / 2, height / 2);
    for (let step = 0; step < 4; step++) {
      await page.mouse.wheel(0, width * .3);
      await page.waitForTimeout(450);
    }
    await expect.poll(x).toBeLessThan(before - width * .45);
    const last = (await page.locator('.weekend-foreground').boundingBox())!;
    expect(last.x + last.width).toBeLessThanOrEqual(width - 20);
    expect((await page.locator('.weekend-media').boundingBox())!.height).toBeGreaterThan(180);
    await page.screenshot({ path: testInfo.outputPath(`carousel-${width}-${height}-end.png`) });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('html')).not.toHaveClass(/weekend-carousel-ready/);
  await expect(page.locator('.weekend-track')).toHaveCSS('display', 'contents');
  await expect(page.locator('.weekend-track')).toHaveCSS('transform', 'none');
  await expect(page.locator('.weekend-foreground')).toHaveCSS('position', 'absolute');
});

test('histoire : photo de course animée et preuve encadrée', async ({ page }) => {
  await page.goto('/');
  const story = page.locator('#histoire');
  const course = page.locator('.story-race-photo');
  await story.evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(700);
  const before = await course.evaluate(element => getComputedStyle(element).transform);
  await page.evaluate(() => window.scrollBy({ top: 180, behavior: 'instant' }));
  await expect.poll(() => course.evaluate(element => getComputedStyle(element).transform)).not.toBe(before);
  await expect(course).toHaveAttribute('data-travel', '90');
  await expect(page.locator('.story-proof img')).toHaveAttribute('src', '/photos/preuve-1200.webp');
  await expect(page.locator('.story-proof')).toHaveCSS('box-shadow', /rgb/);
});

test('logistique inversée et calendrier dans la scène finale', async ({ page, request, isMobile }) => {
  await page.goto('/');
  const details = page.locator('.details-opening');
  const text = details.locator('.section-heading');
  const photo = details.locator('.details-photo');
  expect(await text.evaluate(element => element.nextElementSibling?.classList.contains('details-photo'))).toBe(true);
  if (!isMobile) {
    const textBox = await text.boundingBox();
    const photoBox = await photo.boundingBox();
    expect(photoBox!.x).toBeGreaterThan(textBox!.x);
  }
  await expect(page.locator('#calendrier')).toHaveClass(/calendar-ending/);
  await expect(page.locator('.ending-note, .closing-backdrop')).toHaveCount(0);
  const snow = await request.get('/photos/snow-1200.webp');
  expect(snow.status()).toBe(404);
});

test('calendriers : tout le séjour du 8 au 10 inclus', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.getByRole('link', { name: /Google Calendar/ }).getAttribute('href');
  const url = new URL(href!);
  expect(url.searchParams.get('dates')).toBe('20271008/20271011');
  expect(url.searchParams.get('location')).toContain('2311 Rte 148');
  const response = await request.get('/invitation.ics');
  expect(response.ok()).toBe(true);
  const ics = await response.text();
  expect(ics).toContain('DTSTART;VALUE=DATE:20271008');
  expect(ics).toContain('DTEND;VALUE=DATE:20271011');
  expect(ics).toContain('SUMMARY:Mariage de Marie-Audrée & Yassine');
  for (const line of ics.split('\r\n')) expect(Buffer.byteLength(line)).toBeLessThanOrEqual(75);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: /Apple \/ Outlook/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('mariage-marie-audree-yassine.ics');
});

test('navigation mobile et préférence de mouvement réduit', async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  if (isMobile) {
    await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Navigation mobile' })).toBeVisible();
    await page.getByRole('navigation', { name: 'Navigation mobile' }).getByRole('link', { name: 'La fin de semaine' }).click();
    await expect(page.getByRole('navigation', { name: 'Navigation mobile' })).toBeHidden();
    await expect(page).toHaveURL(/#weekend$/);
  }
  await page.locator('#infos').scrollIntoViewIfNeeded();
  await expect(page.locator('.practical .section-heading')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-arch img')).toHaveCSS('transform', 'none');
});

test('informations accessibles sans JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('.weekend-title')).toHaveCSS('opacity', '1');
  await expect(page.locator('[data-photo-slot]')).toHaveCount(5);
  await expect(page.locator('.faq-block')).toHaveCount(0);
  await expect(page.getByText('La fin de semaine se vit sur place, avec hébergement. Les détails pour les nuits suivront.')).toBeVisible();
  await expect(page.getByRole('link', { name: /Apple \/ Outlook/ })).toHaveAttribute('href', '/invitation.ics');
  await context.close();
});
