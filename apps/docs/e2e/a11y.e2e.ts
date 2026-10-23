import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// WCAG 2.2 A/AA rules on every docs page, in both bases.
const pages = ['/', '/theme'];
const schemes = ['light', 'dark'] as const;

for (const path of pages) {
	for (const colorScheme of schemes) {
		test(`${path} has no axe violations (${colorScheme === 'dark' ? 'Ink' : 'Bone'})`, async ({
			page
		}) => {
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
