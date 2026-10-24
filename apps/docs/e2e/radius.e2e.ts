import { expect, test } from '@playwright/test';
import { PAGES } from './pages.ts';

/**
 * Boxes taller than the tallest control whose corners round them into a pill or an oval. Round
 * things (as wide as they are tall) are meant to be round and are left out.
 */
function findOvals(): string[] {
	const probe = document.createElement('div');
	probe.style.blockSize = 'calc(var(--sv-control-xl) * var(--sv-density-comfortable))';
	document.body.append(probe);
	const tallest = probe.getBoundingClientRect().height;
	probe.remove();

	const ovals: string[] = [];
	for (const element of document.body.querySelectorAll('*')) {
		const { width, height } = element.getBoundingClientRect();
		if (height <= tallest + 1 || Math.abs(width - height) < 1) continue;
		const style = getComputedStyle(element);
		const painted =
			style.borderTopStyle !== 'none' ||
			style.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
			style.backgroundImage !== 'none' ||
			style.overflow !== 'visible';
		if (painted && parseFloat(style.borderStartStartRadius) >= height / 2) {
			const name = [...element.classList].slice(0, 2).join('.');
			ovals.push(`${element.localName}${name ? `.${name}` : ''} ${Math.round(height)}px tall`);
		}
	}
	return ovals;
}

// Milano's controls are pills. Everything taller than a control has to stay a box there, or its
// content is clipped at the corners.
for (const path of PAGES) {
	test(`${path} has no box rounded into an oval`, async ({ page }) => {
		await page.addInitScript(() => localStorage.setItem('sv-theme', 'milano-light'));
		await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
		await page.goto(path);
		await expect(page.locator('html')).toHaveAttribute('data-sv-theme', 'milano-light');

		expect(await page.evaluate(findOvals)).toEqual([]);
	});
}
