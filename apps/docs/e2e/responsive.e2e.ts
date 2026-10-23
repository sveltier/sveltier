import { expect, test } from '@playwright/test';

// No page may scroll sideways at common breakpoints, in either base.
const widths = [320, 390, 768, 1440];
const pages = ['/', '/theme'];

for (const path of pages) {
	for (const width of widths) {
		test(`${path} fits ${width}px without horizontal scrolling`, async ({ page }) => {
			await page.setViewportSize({ width, height: 900 });
			await page.goto(path);
			await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'system');
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth
			);
			expect(overflow).toBeLessThanOrEqual(0);
		});
	}
}
