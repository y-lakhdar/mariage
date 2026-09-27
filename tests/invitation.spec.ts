import { test, expect } from '@playwright/test';

test('invitation, photos et mise en page sans débordement', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle('Marie-Audrée & Yassine — On se marie !');
  await expect(page.locator('h1')).toContainText('marie');
  await expect(page.locator('.couple-names')).toContainText('Marie-Audrée Murphy Desjardins');
  await expect(page.locator('.day-card')).toHaveCount(3);
  await page.evaluate(async () => { await document.fonts.ready; });
  await expect(page.locator('.hero-arch img')).toHaveJSProperty('complete', true);
  expect(await page.locator('.hero-arch img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.locator('.hero-arch img').evaluate((image: HTMLImageElement) => image.decode());
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

test('six plans photo, défilement réversible et questions pratiques', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('[data-photo-slot]')).toHaveCount(6);
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
  await page.getByText('Comment confirmer notre présence ?', { exact: true }).click();
  await expect(page.getByText('Pour l’instant, réservez simplement', { exact: false })).toBeVisible();
});

test('scènes sticky et cadrages aux différentes étapes', async ({ page, isMobile }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/scroll-ready/);
  for (const selector of ['.hero-scroll', '#histoire', '.weekend-scroll', '.details-opening', '.location-card', '#calendrier', '.ending-scene']) {
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
    await page.locator('.hero-scroll').evaluate(element => {
      const rect = element.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + rect.top + (rect.height - innerHeight) * .5, behavior: 'instant' });
    });
    await page.waitForTimeout(1100);
    expect(Math.abs((await page.locator('.hero-stage').boundingBox())!.y)).toBeLessThan(2);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-stage')).toHaveCSS('position', 'relative');
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
  await expect(page.locator('[data-photo-slot]')).toHaveCount(6);
  await page.getByText('Est-ce qu’on dort sur place ?', { exact: true }).click();
  await expect(page.getByText('Oui ! L’idée est de passer', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: /Apple \/ Outlook/ })).toHaveAttribute('href', '/invitation.ics');
  await context.close();
});
