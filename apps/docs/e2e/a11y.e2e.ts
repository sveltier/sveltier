import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { PAGES } from './pages.ts';

// WCAG 2.2 A/AA rules on every docs page, in the light and dark theme of the default pack.
for (const path of PAGES) {
	for (const colorScheme of ['light', 'dark'] as const) {
		test(`${path} has no axe violations (${colorScheme})`, async ({ page }) => {
			await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
			await page.goto(path);
			await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'system');

			const results = await new AxeBuilder({ page })
				.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
				.analyze();
			expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
		});
	}
}
