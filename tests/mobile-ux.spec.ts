import { test, expect } from '@playwright/test';

test('histoire : fond photo mobile et composition desktop conservée', async ({ page, isMobile }, testInfo) => {
  await page.goto('/');
  await page.locator('#histoire').evaluate(element => window.scrollTo({ top: scrollY + element.getBoundingClientRect().top, behavior: 'instant' }));
  await page.waitForTimeout(700);
  if (isMobile) {
    await expect(page.locator('.story-photos')).toHaveCSS('position', 'absolute');
    await expect(page.locator('.story-copy')).toHaveCSS('color', 'rgb(246, 245, 238)');
    const title = (await page.locator('.story-copy h2').boundingBox())!;
    expect(title.y).toBeGreaterThan(0);
    expect(title.y).toBeLessThan(130);
    expect(await page.locator('.story-race-photo').evaluate(element => getComputedStyle(element, '::after').backgroundImage)).toContain('linear-gradient');
    await page.screenshot({ path: testInfo.outputPath('story-mobile-background.png') });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.story-race-photo img')).toHaveCSS('transform', 'none');
    await expect(page.locator('.story-copy')).toHaveCSS('color', 'rgb(246, 245, 238)');
  } else {
    await expect(page.locator('#histoire')).toHaveCSS('display', 'grid');
    await expect(page.locator('.story-photos')).toHaveCSS('position', 'relative');
    const photo = (await page.locator('.story-photos').boundingBox())!;
    const copy = (await page.locator('.story-copy').boundingBox())!;
    expect(photo.x + photo.width).toBeLessThan(copy.x);
  }
});

test('parcours tactile : menu, focus et calendrier', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/');
  for (const selector of ['.menu-toggle', '.header-date', '.site-header .monogram', '.calendar-buttons a', '.text-link']) {
    for (const target of await page.locator(selector).all()) {
      const box = (await target.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
  }
  const toggle = page.getByRole('button', { name: 'Ouvrir le menu' });
  await toggle.tap();
  await expect(page.locator('#mobile-menu a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await toggle.tap();
  await page.locator('#mobile-menu a[href="#infos"]').tap();
  await expect(page.locator('#infos')).toBeFocused();
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await expect(page).toHaveURL(/#infos$/);
});

test('petits écrans, texte agrandi et photos réservées au chargement', async ({ page, isMobile }, testInfo) => {
  test.skip(!isMobile);
  for (const [width, height] of [[320, 568], [375, 667], [430, 932], [600, 400]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const missing = await page.locator('main img').evaluateAll(images => images.filter(image => !image.hasAttribute('width') || !image.hasAttribute('height')).length);
    expect(missing).toBe(0);
    await page.locator('.weekend-scroll').evaluate(element => window.scrollTo({ top: scrollY + element.getBoundingClientRect().top, behavior: 'instant' }));
    if (height >= 480) {
      const title = (await page.locator('.weekend-title').boundingBox())!;
      const media = (await page.locator('.weekend-media').boundingBox())!;
      expect(title.y + title.height).toBeLessThanOrEqual(media.y);
      expect(media.height).toBeGreaterThan(180);
    } else {
      await expect(page.locator('.weekend-stage')).toHaveCSS('position', 'relative');
      await page.locator('.weekend-next').click();
      await expect(page.locator('.weekend-current')).toHaveText('02');
    }
    await page.screenshot({ path: testInfo.outputPath(`mobile-${width}-${height}.png`) });
  }
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await expect(page.locator('.story-copy .story-lead')).toHaveCSS('font-size', '32px');
  await expect(page.locator('.weekend-stage')).toHaveCSS('position', 'relative');
});

test('sans JavaScript : les trois photos restent accessibles sur mobile', async ({ browser, baseURL, isMobile }) => {
  test.skip(!isMobile);
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('.weekend-track img')).toHaveCount(3);
  await expect(page.locator('.weekend-media')).toHaveCSS('overflow-x', 'auto');
  await expect(page.locator('.weekend-pagination')).toBeHidden();
  await page.locator('.weekend-media').evaluate(element => { element.scrollLeft = element.scrollWidth; });
  const last = (await page.locator('.weekend-kiss').boundingBox())!;
  expect(last.x).toBeGreaterThanOrEqual(0);
  expect(last.x + last.width).toBeLessThanOrEqual(390);
  await expect(page.locator('.practical-grid')).toHaveCSS('overflow-x', 'auto');
  await expect(page.locator('.practical-deck-controls')).toBeHidden();
  await page.locator('.practical-grid').evaluate(element => { element.scrollLeft = element.scrollWidth; });
  const lastCard = (await page.locator('.practical-item').last().boundingBox())!;
  expect(lastCard.x).toBeGreaterThanOrEqual(0);
  expect(lastCard.x + lastCard.width).toBeLessThanOrEqual(390);
  await context.close();
});

test('boutons du carrousel, redimensionnement et changement de préférence à chaud', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/');
  await page.locator('.weekend-scroll').evaluate(element => window.scrollTo({ top: scrollY + element.getBoundingClientRect().top, behavior: 'instant' }));
  const next = page.getByRole('button', { name: 'Photo suivante' });
  await next.tap();
  await expect(page.locator('.weekend-current')).toHaveText('02');
  await expect.poll(async () => (await page.locator('.weekend-foreground').boundingBox())!.x).toBeGreaterThan(0);
  await next.tap();
  await expect(page.locator('.weekend-current')).toHaveText('03');
  await expect.poll(async () => (await page.locator('.weekend-kiss').boundingBox())!.x).toBeLessThan(100);
  await page.setViewportSize({ width: 390, height: 750 });
  await expect(page.locator('html')).toHaveClass(/weekend-carousel-ready/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass(/weekend-carousel-ready/);
  await expect(page.locator('.weekend-track')).toHaveCSS('transform', 'none');
  await next.tap();
  await expect(page.locator('.weekend-current')).toHaveText('02');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveClass(/weekend-carousel-ready/);
});

test('un geste tactile vertical fait avancer les photos', async ({ page, isMobile, browserName }) => {
  test.skip(!isMobile || browserName !== 'chromium', 'Injection tactile CDP spécifique à Chromium.');
  await page.goto('/');
  await page.locator('.weekend-scroll').evaluate(element => window.scrollTo({ top: scrollY + element.getBoundingClientRect().top, behavior: 'instant' }));
  const track = page.locator('.weekend-track');
  await expect.poll(() => track.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41)).toBeCloseTo(0, 0);
  const before = await page.evaluate(() => scrollY);
  const client = await page.context().newCDPSession(page);
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 500 }] });
  for (let step = 1; step <= 12; step++) {
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: 500 - step * 20 }] });
    await page.waitForTimeout(20);
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 100);
  await expect.poll(() => track.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41)).toBeLessThan(-75);
  await client.detach();
});
