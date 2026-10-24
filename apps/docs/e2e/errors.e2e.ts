import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// Unknown paths get a real 404: a page that says so, and a 404.html for the static host.

test('an unknown path shows the not-found page with a 404', async ({ page }) => {
	const response = await page.goto('/no-such-page');
	expect(response?.status()).toBe(404);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page does not exist');
	await page.getByRole('link', { name: 'Installation' }).click();
	await expect(page).toHaveURL(/\/getting-started\/installation$/);
});

// The static host reads these files from the build; the preview server does not serve them as is.
test('the build has a 404.html and headers for the static host', () => {
	const build = (file: string) =>
		readFileSync(new URL(`../build/${file}`, import.meta.url), 'utf8');
	expect(build('404.html')).toContain('<!doctype html>');
	expect(build('_headers')).toContain('Cache-Control: public, max-age=31536000, immutable');
});
