import { test, expect } from '@playwright/test';

test('mise en scène mobile : ouverture, profondeur et retour sans animation', async ({ page, isMobile }, testInfo) => {
  test.skip(!isMobile);
  await page.goto('/');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => { image.loading = 'eager'; return image.decode(); }));
  });
  const seek = async (selector: string, fraction: number) => {
    await page.locator(selector).evaluate((element, fraction) => {
      window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - innerHeight * fraction, behavior: 'instant' });
    }, fraction);
    await page.waitForTimeout(650);
  };
  await seek('.hero-art', .8);
  const before = await page.locator('#hero-photo-mask path').getAttribute('d');
  await page.screenshot({ path: testInfo.outputPath('hero-before.png') });
  await seek('.hero-art', -.3);
  await expect(page.locator('#hero-photo-mask path')).not.toHaveAttribute('d', before!);
  await expect(page.locator('.hero-endword')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: testInfo.outputPath('hero-open.png') });

  for (const selector of ['.story-race-photo img', '.invitation-photo-left', '.location-photo img', '.ending-photo img']) {
    await seek(selector, .8);
    const first = await page.locator(selector).evaluate(element => getComputedStyle(element).transform);
    await page.evaluate(() => scrollBy({ top: 220, behavior: 'instant' }));
    await page.waitForTimeout(650);
    expect(await page.locator(selector).evaluate(element => getComputedStyle(element).transform)).not.toBe(first);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`${selector.replace(/[. ]/g, '-')}.png`) });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-endword')).toBeHidden();
  for (const selector of ['.story-race-photo', '.location-photo img', '.ending-photo img']) {
    await expect(page.locator(selector)).toHaveCSS('transform', 'none');
  }
  await expect(page.locator('.location-photo')).toHaveCSS('clip-path', 'none');
  await expect(page.locator('.ending-photo .scroll-photo-mask')).toHaveCSS('clip-path', 'none');
});
