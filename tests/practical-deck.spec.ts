import { test, expect } from '@playwright/test';

test('carrousel pratique : aperçu, navigation et retour desktop', async ({ page, isMobile }, testInfo) => {
  test.skip(!isMobile);
  await page.goto('/');
  const deck = page.locator('.practical-deck');
  await deck.scrollIntoViewIfNeeded();
  const cards = deck.locator('.practical-item');
  const status = deck.locator('.practical-deck-status');
  await expect(status).toContainText('1 / 3');
  const first = (await cards.first().boundingBox())!;
  const second = (await cards.nth(1).boundingBox())!;
  expect(second.x).toBeGreaterThan(first.x + first.width);
  expect(second.x).toBeLessThan(page.viewportSize()!.width);
  expect(second.y).toBeCloseTo(first.y, 0);
  await expect(deck.locator('.practical-deck-hint')).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('cards-start.png') });
  await page.getByRole('button', { name: 'Information suivante' }).tap();
  await expect(status).toContainText('2 / 3');
  await page.getByRole('button', { name: 'Information suivante' }).tap();
  await expect(status).toContainText('3 / 3');
  await expect(page.getByRole('button', { name: 'Information suivante' })).toBeDisabled();
  await deck.locator('.practical-grid').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(status).toContainText('2 / 3');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Information précédente' }).tap();
  await expect(status).toContainText('1 / 3');
  await page.getByRole('button', { name: 'Information suivante' }).tap();
  await expect(status).toContainText('2 / 3');
  await page.screenshot({ path: testInfo.outputPath('cards-second.png') });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(deck).not.toHaveClass(/is-carousel-ready/);
  for (const card of await cards.all()) {
    await expect(card).toHaveJSProperty('inert', false);
    await expect(card).not.toHaveAttribute('aria-hidden');
  }
});

test('cartes pratiques : geste tactile horizontal et scroll vertical', async ({ page, isMobile, browserName }) => {
  test.skip(!isMobile || browserName !== 'chromium');
  await page.goto('/');
  await page.locator('.practical-deck').scrollIntoViewIfNeeded();
  const box = (await page.locator('.practical-item').first().boundingBox())!;
  const client = await page.context().newCDPSession(page);
  const swipe = async (dx: number, dy: number) => {
    const x = box.x + box.width * .75;
    const y = Math.max(150, box.y + 180);
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 10; i++) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * i / 10, y: y + dy * i / 10 }] });
      await page.waitForTimeout(20);
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  await swipe(-220, 0);
  await expect(page.locator('.practical-deck-status')).toContainText('2 / 3');
  const before = await page.evaluate(() => scrollY);
  await swipe(0, -120);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 30);
  await expect(page.locator('.practical-deck-status')).toContainText('2 / 3');
  await client.detach();
});
