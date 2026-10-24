import { expect, test } from '@playwright/test';

// The link at the end of every thrown message opens the entry of its code.

test('an error link opens the entry of its code', async ({ page }) => {
	await page.goto('/errors#SV3001');
	const entry = page.getByRole('heading', { name: 'SV3001 Portal target not found' });
	await expect(entry).toBeInViewport();
	await expect(page.getByRole('heading', { name: /^SV\d{4} / })).not.toHaveCount(0);
});

test('llms-full.txt lists every error code with its fix', async ({ request }) => {
	const text = await (await request.get('/llms-full.txt')).text();
	expect(text).toContain('## Errors');
	expect(text).toMatch(/- `SV1001` The root ThemeProvider has no themes\. .+ Fix: Pass at least/);
});
